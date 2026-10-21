"use client";
import { tabKeyNavigation } from "./ui";
import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  ArrowRight,
  ArrowLeft,
  FileAudio,
  Image as ImageIcon,
  Disc3,
  Send,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { genres } from "@/lib/data";
import { releaseErrors, type Release } from "@/lib/domain";
import { useDemo } from "./store";
import {
  PageIntro,
  RoleGate,
  DemoNote,
  SectionTitle,
  Badge,
  Empty,
  Modal,
  StatusSteps,
} from "./ui";
type Draft = Omit<Release, "id" | "status" | "progress">;
const emptyDraft: Draft = {
  title: "",
  artist: "Kabza De Small",
  genre: "",
  date: "",
  isrc: "",
  explicit: false,
  rights: false,
  share: 100,
  audioName: "",
  artworkName: "",
};
function ReleaseWizard({
  existing,
  onClose,
}: {
  existing?: Release;
  onClose: () => void;
}) {
  const { send, notify } = useDemo();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(existing ?? emptyDraft);
  const [assetError, setAssetError] = useState("");
  const [checking, setChecking] = useState(false);
  const [formError, setFormError] = useState("");
  const errors = releaseErrors(draft);
  const update = (key: keyof Draft, value: string | number | boolean) =>
    setDraft((d) => ({ ...d, [key]: value }));
  async function asset(file: File | undefined, kind: "audio" | "artwork") {
    if (!file) return;
    setAssetError("");
    if (kind === "audio") {
      if (
        !/\.(wav|flac)$/i.test(file.name) ||
        file.size > 150 * 1024 * 1024 ||
        file.size === 0
      ) {
        setAssetError("Choose a non-empty WAV or FLAC file under 150 MB.");
        return;
      }
      update("audioName", file.name);
    } else {
      if (!/\.(png|jpe?g)$/i.test(file.name) || file.size > 10 * 1024 * 1024) {
        setAssetError("Choose a JPG or PNG artwork file under 10 MB.");
        return;
      }
      setChecking(true);
      try {
        const image = await createImageBitmap(file);
        const valid = image.width === image.height && image.width >= 1000;
        image.close();
        if (!valid) {
          setAssetError(
            "Artwork must be square and at least 1000 × 1000 pixels.",
          );
          return;
        }
        update("artworkName", file.name);
      } catch {
        setAssetError(
          "This image could not be decoded. Choose a valid JPG or PNG.",
        );
      } finally {
        setChecking(false);
      }
    }
  }
  function next() {
    setFormError("");
    if (
      step === 0 &&
      (!draft.title.trim() ||
        !draft.artist.trim() ||
        !draft.genre ||
        !draft.date)
    ) {
      setFormError(
        "Add a title, artist, genre and release date before continuing.",
      );
      return;
    }
    setStep(Math.min(3, step + 1));
  }
  return (
    <Modal
      title={
        existing ? "Your release, refined." : "Your next chapter starts here."
      }
      onClose={onClose}
    >
      <StatusSteps
        steps={["Metadata", "Assets", "Rights", "Review"]}
        current={step}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) {
            next();
            return;
          }
          if (send({ type: "release", release: draft, id: existing?.id })) {
            notify(
              "Demo draft saved locally. Review and submit it to simulate delivery.",
            );
            onClose();
          }
        }}
      >
        {step === 0 && (
          <>
            <div className="form-grid">
              <label className="field wide">
                Release title
                <input
                  required
                  maxLength={120}
                  value={draft.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="The name of your next chapter"
                />
              </label>
              <label className="field">
                Primary artist
                <input
                  required
                  value={draft.artist}
                  onChange={(e) => update("artist", e.target.value)}
                />
              </label>
              <label className="field">
                Genre
                <select
                  required
                  value={draft.genre}
                  onChange={(e) => update("genre", e.target.value)}
                >
                  <option value="">Choose a genre</option>
                  {genres.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Release date
                <input
                  type="date"
                  required
                  min={new Date().toISOString().slice(0, 10)}
                  value={draft.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </label>
              <label className="field">
                ISRC (optional)
                <input
                  maxLength={12}
                  value={draft.isrc}
                  onChange={(e) =>
                    update(
                      "isrc",
                      e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
                    )
                  }
                  placeholder="ZAABC2600001"
                />
                <small>No code is assigned automatically.</small>
              </label>
            </div>
            <label className="check-field">
              <input
                type="checkbox"
                checked={draft.explicit}
                onChange={(e) => update("explicit", e.target.checked)}
              />
              Contains explicit lyrics
            </label>
          </>
        )}
        {step === 1 && (
          <>
            <p className="muted">
              Check your master and cover before the next step. Only filenames
              are saved locally; files are not uploaded or retained.
            </p>
            <div className="upload-field">
              <label className="field">
                <span>
                  <FileAudio size={17} /> Audio master
                </span>
                <input
                  aria-label="Audio master"
                  type="file"
                  accept=".wav,.flac"
                  onChange={(e) => void asset(e.target.files?.[0], "audio")}
                />
                <small>
                  WAV or FLAC · up to 150 MB · format and non-empty size
                  checked; mastering specs require a live validator
                </small>
                {draft.audioName && (
                  <Badge tone="purple">{draft.audioName}</Badge>
                )}
              </label>
            </div>
            <div className="upload-field">
              <label className="field">
                <span>
                  <ImageIcon size={17} /> Cover artwork
                </span>
                <input
                  aria-label="Cover artwork"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => void asset(e.target.files?.[0], "artwork")}
                />
                <small>
                  JPG or PNG · square · at least 1000 × 1000 pixels · up to 10
                  MB
                </small>
                {draft.artworkName && (
                  <Badge tone="purple">{draft.artworkName}</Badge>
                )}
              </label>
            </div>
            {checking && (
              <p role="status" className="muted">
                Checking artwork dimensions…
              </p>
            )}
            {assetError && (
              <div role="alert" className="form-error">
                {assetError}
              </div>
            )}
            <button
              type="button"
              className="btn secondary small"
              onClick={() => {
                setAssetError("");
                setDraft({
                  ...draft,
                  audioName: "sonic-demo-tone.wav",
                  artworkName: "sonic-demo-cover.png",
                });
              }}
            >
              Use clearly labelled demo assets
            </button>
            <p className="safety-caption" style={{ marginTop: 12 }}>
              Demo assets are an original tone and generated cover, used only to
              demonstrate the workflow.
            </p>
          </>
        )}
        {step === 2 && (
          <>
            <p className="muted">
              A clear release begins with clear rights. This demo supports one
              rights holder; collaborator split management requires a live
              rights workflow.
            </p>
            <label className="field">
              Primary rights holder
              <input value={draft.artist} disabled />
            </label>
            <label className="field">
              Royalty allocation (%)
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
                value={draft.share}
                onChange={(e) => update("share", Number(e.target.value))}
              />
              <small>Single rights holder allocation must total 100%.</small>
            </label>
            <label className="check-field">
              <input
                type="checkbox"
                checked={draft.rights}
                onChange={(e) => update("rights", e.target.checked)}
              />
              I control the master recording and cover artwork rights for this
              simulated release.
            </label>
            <div className="settings-message">
              Rights declarations are not independently verified. No collecting
              society, label or publisher is contacted.
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="detail-line">
              <span>Release</span>
              <strong>{draft.title || "Untitled"}</strong>
            </div>
            <div className="detail-line">
              <span>Artist / genre</span>
              <span>
                {draft.artist} · {draft.genre || "Not set"}
              </span>
            </div>
            <div className="detail-line">
              <span>Date / explicit</span>
              <span>
                {draft.date || "Not set"} ·{" "}
                {draft.explicit ? "Explicit" : "Clean"}
              </span>
            </div>
            <div className="detail-line">
              <span>Audio</span>
              <span>{draft.audioName || "Not attached"}</span>
            </div>
            <div className="detail-line">
              <span>Artwork</span>
              <span>{draft.artworkName || "Not attached"}</span>
            </div>
            <div className="detail-line">
              <span>Rights / allocation</span>
              <span>
                {draft.rights ? "Declared" : "Not declared"} · {draft.share}%
              </span>
            </div>
            <div style={{ marginTop: 20 }}>
              {errors.length ? (
                <div className="form-error">
                  <strong>
                    Save a draft now; resolve these before submission:
                  </strong>
                  <ul className="release-error-list">
                    {errors.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="form-success">
                  Ready for the simulated delivery workflow.
                </div>
              )}
            </div>
            <p className="safety-caption">
              Saving creates a local draft. No files, music or metadata are sent
              to any DSP. Use “Review & submit demo” on the saved draft to
              continue.
            </p>
          </>
        )}
        {formError && (
          <div className="form-error" role="alert">
            {formError}
          </div>
        )}
        <div className="save-bar">
          {step > 0 ? (
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setStep(step - 1);
                setFormError("");
              }}
            >
              <ArrowLeft size={14} />
              Back
            </button>
          ) : (
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn primary" disabled={checking}>
            {step === 3 ? "Save draft" : "Continue"}
            {step < 3 && <ArrowRight size={15} />}
          </button>
        </div>
      </form>
    </Modal>
  );
}
export default function DistributionPage() {
  const { state, send, notify } = useDemo();
  const [tab, setTab] = useState("Release manager");
  const [wizard, setWizard] = useState(false);
  const [editing, setEditing] = useState<Release | undefined>();
  const [review, setReview] = useState<Release | null>(null);
  function advance(r: Release) {
    if (send({ type: "advanceRelease", id: r.id }))
      notify(
        r.progress === 75
          ? "Simulated delivery completed. No music was sent to DSPs."
          : "Demo delivery advanced by one stage.",
      );
  }
  return (
    <div className="content-wrap">
      <PageIntro
        eyebrow="INDEPENDENCE, DISTRIBUTED"
        title="Your sound."
        accent="A bigger world."
        description="Bring your release together. Keep your rights in view. Follow every step from master to destination."
      >
        <button
          className="btn primary"
          onClick={() => {
            setEditing(undefined);
            setWizard(true);
          }}
        >
          <Plus size={17} />
          New release
        </button>
      </PageIntro>
      <DemoNote>
        Distribution is simulated. Media files are not uploaded, retained or
        sent to DSPs. Metadata and filenames persist only in this browser.
      </DemoNote>
      <RoleGate role="artist">
        <div
          className="tabs workspace-tabs"
          role="tablist"
          onKeyDown={tabKeyNavigation}
          aria-label="Distribution workspace"
        >
          {["Release manager", "Destinations", "Rights & royalties"].map(
            (t) => (
              <button
                key={t}
                role="tab"
                tabIndex={tab === t ? 0 : -1}
                aria-selected={tab === t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ),
          )}
        </div>
        {tab === "Release manager" && (
          <div className="workspace-grid">
            <section>
              <SectionTitle
                title="Every release has a beginning."
                description={`${state.releases.length} locally saved demo release${state.releases.length === 1 ? "" : "s"}`}
              />
              {state.releases.length ? (
                state.releases.map((r) => (
                  <article key={r.id} className="release-card">
                    <div className="release-head">
                      <span className="round-icon">
                        <Disc3 size={24} />
                      </span>
                      <div>
                        <h3>{r.title}</h3>
                        <p>
                          {r.artist} · {r.genre || "Genre not set"} ·{" "}
                          {r.date || "Date not set"}
                        </p>
                      </div>
                      <Badge
                        tone={r.status === "delivered" ? "green" : "purple"}
                      >
                        {r.status} · demo
                      </Badge>
                    </div>
                    <div className="release-assets">
                      <span>
                        <FileAudio size={13} />
                        {r.audioName || "Audio not attached"}
                      </span>
                      <span>
                        <ImageIcon size={13} />
                        {r.artworkName || "Artwork not attached"}
                      </span>
                      <span>
                        <ShieldCheck size={13} />
                        {r.rights ? "Rights declared" : "Rights pending"}
                      </span>
                    </div>
                    <StatusSteps
                      steps={["Draft", "Validated", "Queued", "Delivered"]}
                      current={
                        r.status === "draft" ? 0 : r.status === "queued" ? 2 : 3
                      }
                    />
                    {r.status !== "draft" && (
                      <>
                        <div className="progress-track">
                          <span style={{ width: r.progress + "%" }} />
                        </div>
                        <div className="dsp-row">
                          {["Spotify", "Apple Music", "YouTube Music"].map(
                            (d) => (
                              <div className="dsp" key={d}>
                                <strong>{d}</strong>
                                <small>
                                  {r.status === "delivered"
                                    ? "Simulated delivery"
                                    : `Demo queue ${r.progress}%`}
                                </small>
                              </div>
                            ),
                          )}
                        </div>
                      </>
                    )}
                    <div className="button-row">
                      {r.status === "draft" && (
                        <>
                          <button
                            className="btn secondary small"
                            onClick={() => {
                              setEditing(r);
                              setWizard(true);
                            }}
                          >
                            Edit draft
                          </button>
                          <button
                            className="btn primary small"
                            onClick={() => setReview(r)}
                          >
                            Review & submit demo
                            <Send size={13} />
                          </button>
                        </>
                      )}
                      {r.status === "queued" && (
                        <button
                          className="btn primary small"
                          onClick={() => advance(r)}
                        >
                          Advance simulated delivery
                          <ArrowRight size={14} />
                        </button>
                      )}
                      {r.status === "delivered" && (
                        <span className="audio-tag">
                          <CheckCircle2 size={14} />
                          Demo workflow complete · no live delivery
                        </span>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <section className="panel">
                  <Empty
                    title="A new release. A new possibility."
                    description="Start with your metadata, add your assets and confirm your rights. We’ll keep the next step clear."
                  >
                    <button
                      className="btn primary"
                      onClick={() => {
                        setEditing(undefined);
                        setWizard(true);
                      }}
                    >
                      Create your first release
                      <Plus size={16} />
                    </button>
                  </Empty>
                </section>
              )}
            </section>
            <aside className="stack">
              <div className="callout">
                <p className="eyebrow">THE RELEASE CHECKLIST</p>
                <h3>
                  Make every
                  <br />
                  detail count.
                </h3>
                <div className="compliance-list">
                  {[
                    "Title, artist and genre",
                    "Release date and ISRC",
                    "Audio master and artwork",
                    "Rights declaration",
                    "100% royalty allocation",
                  ].map((x) => (
                    <div key={x}>
                      <span>{x}</span>
                      <CheckCircle2
                        size={15}
                        style={{ color: "var(--paint-b293ca, #b293ca)" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <section className="panel">
                <h3>Keep the whole picture.</h3>
                <p className="muted">
                  Your release, royalties and ledger belong in the same
                  conversation.
                </p>
                <Link className="text-link" href="/artists">
                  Open artist terminal
                  <ArrowRight size={14} />
                </Link>
              </section>
            </aside>
          </div>
        )}
        {tab === "Destinations" && (
          <section className="panel">
            <SectionTitle
              title="A connected world, once configured."
              description="DSP destinations are shown to illustrate the delivery flow. No distributor credentials are configured."
            />
            <div className="integration-list">
              {[
                "Spotify",
                "Apple Music",
                "YouTube Music",
                "Deezer",
                "Amazon Music",
                "TikTok / Instagram",
              ].map((d) => (
                <div key={d}>
                  <div>
                    <strong>{d}</strong>
                    <small>Requires a licensed distribution partner</small>
                  </div>
                  <Badge tone="amber">Not connected</Badge>
                </div>
              ))}
            </div>
          </section>
        )}
        {tab === "Rights & royalties" && (
          <div className="workspace-grid">
            <section className="panel">
              <ShieldCheck
                size={28}
                style={{ color: "var(--paint-b18bcf, #b18bcf)" }}
              />
              <h2 style={{ marginTop: 20 }}>Ownership stays in view.</h2>
              <p className="muted">
                Every simulated submission checks a rights declaration and a
                complete 100% royalty allocation. Declarations are not a legal
                rights verification.
              </p>
              <div className="integration-list">
                {[
                  "Master recording ownership",
                  "Publishing and composition rights",
                  "Collecting society registration",
                  "DSP royalty statements",
                ].map((x) => (
                  <div key={x}>
                    <div>
                      <strong>{x}</strong>
                      <small>External verification or provider required</small>
                    </div>
                    <Badge tone="amber">Not connected</Badge>
                  </div>
                ))}
              </div>
            </section>
            <div className="callout">
              <h3>
                From a stream
                <br />
                to a statement.
              </h3>
              <p>
                A live royalty feed needs provider statements, reconciliation,
                rights mapping and payout approval. This demo only records
                simulated agreement settlements.
              </p>
              <Link className="btn secondary small" href="/artists">
                View demo royalties
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </RoleGate>
      {wizard && state.role === "artist" && (
        <ReleaseWizard
          existing={editing}
          onClose={() => {
            setWizard(false);
            setEditing(undefined);
          }}
        />
      )}
      {review && (
        <Modal
          title="Before your release takes its next step."
          onClose={() => setReview(null)}
        >
          <h3>{review.title}</h3>
          <Badge tone="purple">Simulated submission only</Badge>
          <p style={{ marginTop: 15 }}>
            This validates the saved metadata, filename declarations and rights
            allocation. It creates a demo delivery queue without uploading files
            or contacting platforms.
          </p>
          {releaseErrors(review).length > 0 ? (
            <div className="form-error" role="alert">
              <ul className="release-error-list">
                {releaseErrors(review).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="form-success">
              Saved release passes the demo validation.
            </div>
          )}
          <div className="button-row">
            <button className="btn secondary" onClick={() => setReview(null)}>
              Back to releases
            </button>
            <button
              className="btn primary"
              disabled={releaseErrors(review).length > 0}
              onClick={() => {
                if (send({ type: "submitRelease", id: review.id })) {
                  setReview(null);
                  notify(
                    "Release queued for simulated delivery. No DSP was contacted.",
                  );
                }
              }}
            >
              Submit demo release
              <Send size={14} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
