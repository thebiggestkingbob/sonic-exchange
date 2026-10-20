"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Heart,
  Share2,
  Check,
  ShieldCheck,
  AudioLines,
  Download,
  FileAudio,
  Music2,
  Globe2,
  Library,
} from "lucide-react";
import {
  licenses,
  musicAssets,
  assetPrice,
  rand,
  type License,
  type MusicAsset,
} from "@/lib/marketplace";
import { useMarket } from "./market-store";
import { useDemo } from "./store";
import { Cover, AssetCard, PreviewPlayer, Collection } from "./marketplace-ui";
import { Modal, tabKeyNavigation } from "./ui";
const tabs = [
  "Overview",
  "Track details",
  "Stems & files",
  "Usage rights",
  "Earnings potential",
  "Related assets",
];
export default function AssetDetailPage({ asset }: { asset: MusicAsset }) {
  const { state, ready, act } = useMarket();
  const { notify } = useDemo();
  const [license, setLicense] = useState<License>("sync");
  const [tab, setTab] = useState("Overview");
  const [modal, setModal] = useState<"buy" | "offer" | "collection" | null>(
    null,
  );
  const [consent, setConsent] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [uses, setUses] = useState(4);
  const [playing, setPlaying] = useState<MusicAsset | null>(null);
  const saved = state.saved.includes(asset.id);
  const owned = state.purchases.some(
    (p) => p.assetId === asset.id && p.license === license,
  );
  const price = assetPrice(asset, license);
  const option = licenses.find((l) => l.id === license)!;
  const related = musicAssets.filter((a) => a.id !== asset.id).slice(0, 3);
  function download() {
    const content = {
      title: asset.title,
      creator: asset.creator,
      license: option.label,
      terms: option.terms,
      demonstration:
        "Fictional asset. No music rights transferred. This is a demo information manifest, not a legal contract or a stems download.",
      demoAudio: "/audio/market-demo.wav",
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(content, null, 2)], {
        type: "application/json",
      }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${asset.id}-demo-manifest.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="asset-detail editorial-shell">
      <div className="asset-breadcrumb">
        <Link href="/marketplace">
          <ArrowLeft size={15} />
          Back to Marketplace
        </Link>
        <button onClick={() => setModal("collection")}>
          <Library size={16} />
          My collection ({state.purchases.length})
        </button>
      </div>
      <div className="detail-layout">
        <div className="detail-main">
          <section className="asset-overview">
            <div className="detail-cover">
              <Cover asset={asset} />
              <span className="detail-cover-label">ORIGINAL DEMO SERIES</span>
            </div>
            <div className="detail-heading">
              <div className="detail-chips">
                <span>{asset.tag}</span>
                <span>{asset.kind}</span>
                <span>{asset.genre}</span>
              </div>
              <h1>{asset.title}</h1>
              <p className="asset-byline">
                by <strong>{asset.creator}</strong>
                <span>Demo creator · {asset.city}</span>
              </p>
              <p>{asset.description}</p>
              <div className="detail-actions">
                <button
                  disabled={!ready}
                  aria-pressed={saved}
                  onClick={() => act({ type: "save", assetId: asset.id })}
                >
                  <Heart size={17} fill={saved ? "currentColor" : "none"} />
                  {saved ? "Saved to your crate" : "Save to your crate"}
                </button>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      notify("Asset link copied.");
                    } catch {
                      notify(
                        "Copy this page’s address from your browser to share it.",
                      );
                    }
                  }}
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
              <div className="asset-audio">
                <div>
                  <AudioLines size={21} />
                  <span>
                    THE PREVIEW{" "}
                    <small>
                      12-second synthesized demo · not an artist recording
                    </small>
                  </span>
                </div>
                <audio
                  controls
                  preload="metadata"
                  src="/audio/market-demo.wav"
                  aria-label={`Listen to ${asset.title} demo`}
                />
              </div>
              <dl className="track-facts">
                {[
                  ["Genre", asset.genre],
                  ["BPM", String(asset.bpm)],
                  ["Key", asset.key],
                  ["Format", "Demo WAV"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
          <div
            className="detail-tabs"
            role="tablist"
            aria-label="Asset information"
            onKeyDown={tabKeyNavigation}
          >
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                id={`tab-${t.replaceAll(" ", "-")}`}
                aria-controls="asset-panel"
                aria-selected={tab === t}
                tabIndex={tab === t ? 0 : -1}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <section
            className="detail-tab-content"
            id="asset-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab.replaceAll(" ", "-")}`}
            tabIndex={0}
          >
            {tab === "Overview" && (
              <div className="asset-about">
                <div>
                  <p className="eyebrow">BEHIND THE SOUND</p>
                  <h2>
                    A little character.
                    <br />A lot of possibility.
                  </h2>
                  <p>{asset.description}</p>
                  <p>
                    Part of our fictional South African creator series. Explore
                    how licensing could work before connecting real artists,
                    catalogues and verified rights holders.
                  </p>
                </div>
                <div className="asset-highlights">
                  {[
                    {
                      icon: Globe2,
                      title: "Made for the bigger picture",
                      copy: "Explore an illustrative licence for film, digital and brand projects.",
                    },
                    {
                      icon: Music2,
                      title: "A sound with a point of view",
                      copy: `${asset.genre} · ${asset.bpm} BPM · ${asset.city}`,
                    },
                    {
                      icon: ShieldCheck,
                      title: "Know what you’re exploring",
                      copy: "Clear demo terms. No implied artist affiliation or rights ownership.",
                    },
                  ].map(({ icon: Icon, title, copy }) => (
                    <div key={title}>
                      <Icon size={22} />
                      <div>
                        <h3>{title}</h3>
                        <p>{copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === "Track details" && (
              <>
                <h2>The finer details.</h2>
                <dl className="asset-specs">
                  {[
                    ["Title", asset.title],
                    ["Demo creator", asset.creator],
                    ["Creative scene", asset.city],
                    ["Genre", asset.genre],
                    ["Tempo", `${asset.bpm} BPM`],
                    ["Musical key", asset.key],
                    ["Audio preview", "12 seconds · synthesized original"],
                    [
                      "Recording status",
                      "Fictional listing; no commercial master supplied",
                    ],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
            {tab === "Stems & files" && (
              <>
                <h2>What’s in the demo.</h2>
                <div className="file-row">
                  <FileAudio size={25} />
                  <div>
                    <strong>market-demo.wav</strong>
                    <p>
                      12-second synthesized original · mono WAV · shared
                      demonstration audio
                    </p>
                  </div>
                  <a
                    className="btn white small"
                    href="/audio/market-demo.wav"
                    download
                  >
                    <Download size={15} />
                    Download preview
                  </a>
                </div>
                <p>
                  No commercial master, stems or artist recordings are provided.
                  A production marketplace would release verified files only
                  after payment and rights clearance.
                </p>
                <button className="btn secondary" onClick={download}>
                  <Download size={16} />
                  Download demo information
                </button>
              </>
            )}
            {tab === "Usage rights" && (
              <>
                <h2>Understand the possibilities.</h2>
                <p>
                  No real rights are offered or transferred in this prototype.
                  These options demonstrate how separate rights could be
                  presented.
                </p>
                {licenses.map((l) => (
                  <div className="licence-explainer" key={l.id}>
                    <h3>{l.label}</h3>
                    <p>{l.terms}</p>
                  </div>
                ))}
              </>
            )}
            {tab === "Earnings potential" && (
              <>
                <h2>Explore a scenario.</h2>
                <p>
                  This calculator is hypothetical, not a forecast or a claim
                  about any artist’s income. It assumes repeated non-exclusive
                  sync licences at the listed demo price, before costs or
                  revenue splits.
                </p>
                <label className="scenario-label" htmlFor="uses">
                  Hypothetical sync licences <strong>{uses}</strong>
                </label>
                <input
                  id="uses"
                  type="range"
                  min="1"
                  max="20"
                  value={uses}
                  onChange={(e) => setUses(Number(e.target.value))}
                />
                <div className="scenario-result">
                  <small>Illustrative gross total</small>
                  <strong>{rand(asset.price * uses)}</strong>
                  <span>
                    {uses} × {rand(asset.price)} · before costs
                  </span>
                </div>
              </>
            )}
            {tab === "Related assets" && (
              <>
                <h2>Keep digging.</h2>
                <div className="detail-related-grid">
                  {related.map((a) => (
                    <AssetCard key={a.id} asset={a} onPlay={setPlaying} />
                  ))}
                </div>
              </>
            )}
          </section>
          {tab !== "Related assets" && (
            <section className="detail-related">
              <div className="editorial-heading compact">
                <h2>More from the crate.</h2>
                <Link href="/marketplace" className="editorial-link">
                  View all <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="detail-related-grid">
                {related.map((a) => (
                  <AssetCard key={a.id} asset={a} onPlay={setPlaying} />
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="purchase-column">
          <div className="purchase-card">
            <p className="eyebrow">MAKE IT PART OF YOUR STORY.</p>
            <h2>Choose your possibilities.</h2>
            <div
              className="licence-options"
              role="group"
              aria-label="Licence type"
            >
              {licenses.map((l) => (
                <button
                  key={l.id}
                  aria-pressed={license === l.id}
                  onClick={() => setLicense(l.id)}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="purchase-price">{rand(price)}</div>
            <p className="purchase-price-note">
              Illustrative one-time price · ZAR
            </p>
            <p className="purchase-terms">{option.terms}</p>
            <button
              className="btn primary full"
              disabled={!ready}
              onClick={() => {
                setConsent(false);
                setModal(owned ? "collection" : "buy");
              }}
            >
              {owned ? "View in demo collection" : "Try demo checkout"}
              <ArrowUpRight size={17} />
            </button>
            <button
              className="btn white full"
              onClick={() => setModal("offer")}
            >
              Make a demo offer
            </button>
            <div className="purchase-checks">
              {[
                "Transparent illustrative terms",
                "Original demo preview included",
                "Saved in your browser",
                "No charge. No rights transfer.",
              ].map((t) => (
                <span key={t}>
                  <Check size={15} />
                  {t}
                </span>
              ))}
            </div>
            <div className="purchase-honesty">
              <ShieldCheck size={23} />
              <p>
                <strong>A safe space to explore.</strong>Payments, escrow,
                seller verification and legal contracts are not connected.
              </p>
            </div>
          </div>
          <div className="seller-card">
            <span className="eyebrow">BEHIND THE MUSIC</span>
            <div>
              <span className={`seller-monogram ${asset.theme}`}>
                {asset.creator
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div>
                <h3>{asset.creator}</h3>
                <p>{asset.city} · Fictional creator</p>
              </div>
            </div>
            <p>
              Part of the SONIC demo studio. This listing is not affiliated with
              the real artists in INDEX.
            </p>
            <Link href="/artists" className="editorial-link">
              Explore the artist workspace <ArrowUpRight size={15} />
            </Link>
          </div>
        </aside>
      </div>
      {modal === "buy" && (
        <Modal title="Try a demo purchase" onClose={() => setModal(null)}>
          <div className="checkout-summary">
            <span>
              {asset.title}
              <small>{option.label}</small>
            </span>
            <strong>{rand(price)}</strong>
          </div>
          <p>{option.terms}</p>
          <p>
            No payment details are collected, no money is moved, and no rights
            are transferred. This creates a local demo receipt only.
          </p>
          <label className="check-field">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            I understand this is a simulated purchase, not a legal music
            licence.
          </label>
          <button
            className="btn primary full"
            disabled={!consent}
            onClick={() => {
              if (act({ type: "purchase", assetId: asset.id, license })) {
                setModal("collection");
                notify(
                  "Demo purchase saved. No charge and no rights transferred.",
                );
              }
            }}
          >
            Confirm demo purchase
          </button>
        </Modal>
      )}
      {modal === "offer" && (
        <Modal title="Start a conversation" onClose={() => setModal(null)}>
          <p>
            Make an illustrative offer for {asset.title} · {option.label}. It
            stays in this browser and is not sent to a seller.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                act({
                  type: "offer",
                  assetId: asset.id,
                  license,
                  amount: Math.round(Number(amount) * 100),
                  message,
                })
              ) {
                setAmount("");
                setMessage("");
                setModal("collection");
                notify("Demo offer saved locally. Not sent to a seller.");
              }
            }}
          >
            <label className="field">
              Your offer (ZAR)
              <input
                type="number"
                required
                min="1"
                max="1000000"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5000"
              />
            </label>
            <label className="field">
              Tell us about your project
              <textarea
                required
                minLength={10}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A short film, a campaign, something completely different…"
              />
            </label>
            <button className="btn primary full">
              Save demo offer <ArrowUpRight size={16} />
            </button>
          </form>
        </Modal>
      )}
      {modal === "collection" && <Collection onClose={() => setModal(null)} />}
      <PreviewPlayer asset={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}
