"use client";
import { tabKeyNavigation } from "./ui";
import { useState } from "react";
import { ArrowRight, Plus, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { artists, genres, money, compact, type Artist } from "@/lib/data";
import { useDemo } from "./store";
import {
  PageIntro,
  RoleGate,
  DemoNote,
  Stat,
  SearchBox,
  Badge,
  Empty,
  Modal,
  SectionTitle,
} from "./ui";
import { ArtistProfile } from "./index-page";
import { Agreements } from "./agreements";
export function OfferForm({
  artist,
  onClose,
}: {
  artist: Artist;
  onClose: () => void;
}) {
  const { send, notify } = useDemo();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [usage, setUsage] = useState("Short film · 12 months · South Africa");
  return (
    <Modal title={`A connection with ${artist.name}`} onClose={onClose}>
      <Badge tone="purple">Simulated sync licensing offer</Badge>
      <p style={{ marginTop: 16 }}>
        Define a project and offer. Acceptance, escrow and settlement are local
        demo states. This does not create a legal agreement.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (
            send({
              type: "offer",
              artistId: artist.id,
              title: title + " · " + usage,
              amount: Math.round(Number(amount) * 100),
              kind: "license",
            })
          ) {
            notify(
              "Demo offer created. Switch to Artist to accept Amara Sol’s offer.",
            );
            onClose();
          }
        }}
      >
        <label className="field">
          Project name
          <input
            required
            minLength={3}
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A story worth hearing"
          />
        </label>
        <label className="field">
          Usage, term & territory
          <select value={usage} onChange={(e) => setUsage(e.target.value)}>
            <option>Short film · 12 months · South Africa</option>
            <option>Digital campaign · 6 months · South Africa</option>
            <option>Podcast · 12 months · Worldwide</option>
          </select>
          <small>
            Non-exclusive illustrative licence. Final legal terms require
            review.
          </small>
        </label>
        <label className="field">
          Offer amount (ZAR)
          <input
            required
            type="number"
            min="1"
            max="1000000"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="3500.00"
          />
        </label>
        {artist.id !== "amara" && (
          <p className="safety-caption">
            Only Amara Sol has an active artist workspace in this prototype. You
            can create this offer, but this artist cannot accept it.
          </p>
        )}
        <div className="button-row">
          <button className="btn secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" type="submit">
            Create demo offer
            <ArrowRight size={15} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
export default function BrandsPage({
  initialArtist = "",
}: {
  initialArtist?: string;
}) {
  const { state } = useDemo();
  const [tab, setTab] = useState("Discover artists");
  const [query, setQuery] = useState(
    artists.find((a) => a.id === initialArtist)?.name ?? "",
  );
  const [genre, setGenre] = useState("All genres");
  const [audience, setAudience] = useState("All audiences");
  const [verified, setVerified] = useState(false);
  const [selected, setSelected] = useState<Artist | null>(null);
  const [offer, setOffer] = useState<Artist | null>(null);
  const matches = artists.filter(
    (a) =>
      `${a.name} ${a.city}`.toLowerCase().includes(query.toLowerCase()) &&
      (genre === "All genres" || genre === a.genre) &&
      (audience === "All audiences" || a.audience >= 100000) &&
      !verified,
  );
  return (
    <div className="content-wrap">
      <PageIntro
        eyebrow="THE BRAND HUB"
        title="Culture is a connection."
        accent="Make yours."
        description="Discover independent voices. Find shared values. Build partnerships with a clearer view of the music."
      />
      <DemoNote />
      <RoleGate role="brand">
        <div className="stat-grid three">
          <Stat
            label="Demo campaign balance"
            value={money(state.brandWallet)}
            detail="No real funding connected"
          />
          <Stat
            label="Your licensing offers"
            value={String(
              state.deals.filter((d) => d.kind === "license").length,
            ).padStart(2, "0")}
            detail="Locally saved demo agreements"
          />
          <Stat
            label="Verified live data"
            value="Not connected"
            detail="All artist figures are illustrative"
          />
        </div>
        <div
          className="tabs workspace-tabs"
          role="tablist"
          onKeyDown={tabKeyNavigation}
          aria-label="Brand workspace"
        >
          {["Discover artists", "Offers & agreements", "Data transparency"].map(
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
        {tab === "Discover artists" && (
          <>
            <SectionTitle
              title="Find a voice that feels right."
              description="Explore the sound, the audience and the possibility."
              action={
                <SlidersHorizontal size={19} style={{ color: "#9e81b1" }} />
              }
            />
            <div className="filter-row">
              <SearchBox value={query} onChange={setQuery} />
              <select
                aria-label="Artist genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option>All genres</option>
                {genres.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
              <select
                aria-label="Audience size"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              >
                <option>All audiences</option>
                <option>100k+ demo audience</option>
              </select>
              <label
                className="check-field"
                style={{ margin: 0, fontSize: 10 }}
              >
                <input
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  type="checkbox"
                />
                Verified only
              </label>
              <span className="result-count">{matches.length} artists</span>
            </div>
            {matches.length ? (
              <div className="artist-card-grid">
                {matches.map((a) => (
                  <article className="discovery-card" key={a.id}>
                    <button
                      className="card-image"
                      style={{ width: "100%", padding: 0 }}
                      onClick={() => setSelected(a)}
                      aria-label={`View ${a.name} profile`}
                    >
                      <img
                        src={a.image}
                        alt="Editorial portrait for fictional artist"
                      />
                      <Badge tone="purple">{a.genre}</Badge>
                    </button>
                    <div className="card-body">
                      <h3>{a.name}</h3>
                      <p>{a.city} · independent artist</p>
                      <div className="card-data">
                        <span>
                          Demo audience <strong>{compact(a.audience)}</strong>
                        </span>
                        <span>
                          Index score <strong>{a.score}</strong>
                        </span>
                        <Badge>Unverified demo</Badge>
                      </div>
                      <button
                        className="btn secondary"
                        onClick={() => setOffer(a)}
                      >
                        Start a connection
                        <Plus size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Empty
                title={
                  verified
                    ? "No verified sources are connected."
                    : "No artists match this search."
                }
                description={
                  verified
                    ? "All profiles currently use fictional demo data. Turn off Verified only to explore."
                    : "Try a different name, audience or genre."
                }
              >
                <button
                  className="btn secondary"
                  onClick={() => {
                    setQuery("");
                    setGenre("All genres");
                    setAudience("All audiences");
                    setVerified(false);
                  }}
                >
                  Reset filters
                </button>
              </Empty>
            )}
          </>
        )}
        {tab === "Offers & agreements" && (
          <>
            <SectionTitle
              title="From possibility to partnership."
              description="Track artist acceptance, simulated escrow and settlement."
              action={
                <button
                  className="btn secondary small"
                  onClick={() => {
                    setTab("Discover artists");
                  }}
                >
                  Find an artist
                  <Plus size={14} />
                </button>
              }
            />
            <div className="agreements-explainer" style={{ marginBottom: 20 }}>
              Create an offer → switch to Artist and accept Amara Sol’s offer →
              return to Brand to fund demo escrow → complete the simulated
              settlement. Cancellation returns held demo funds exactly once.
            </div>
            <Agreements kind="license" />
          </>
        )}
        {tab === "Data transparency" && (
          <div className="workspace-grid">
            <section className="panel">
              <ShieldCheck size={30} style={{ color: "#a17bbb" }} />
              <h2 style={{ marginTop: 20 }}>Trust starts with the source.</h2>
              <p className="muted">
                Audience estimates, index scores and identity claims in this
                preview are fictional. They have not been verified by a third
                party.
              </p>
              <div className="integration-list">
                {[
                  "Artist identity & rights",
                  "Streaming & audience data",
                  "Brand identity",
                  "Licence documentation",
                ].map((x) => (
                  <div key={x}>
                    <div>
                      <strong>{x}</strong>
                      <small>Provider integration required</small>
                    </div>
                    <Badge tone="amber">Not connected</Badge>
                  </div>
                ))}
              </div>
            </section>
            <div className="callout">
              <h3>Evidence before claims.</h3>
              <p>
                A live platform must attach provenance, collection dates,
                permissions and verification status to each data source. This
                demo does not issue verified badges.
              </p>
            </div>
          </div>
        )}
      </RoleGate>
      {selected && (
        <ArtistProfile artist={selected} onClose={() => setSelected(null)} />
      )}{" "}
      {offer && <OfferForm artist={offer} onClose={() => setOffer(null)} />}
    </div>
  );
}
