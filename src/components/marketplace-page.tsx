"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  AudioLines,
  SlidersHorizontal,
  ArrowRight,
  Heart,
  Library,
  Search,
} from "lucide-react";
import { musicAssets, type MusicAsset } from "@/lib/marketplace";
import { useMarket } from "./market-store";
import { AssetCard, Collection, PreviewPlayer } from "./marketplace-ui";
import { Empty } from "./ui";
export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All sounds");
  const [type, setType] = useState("All formats");
  const [sort, setSort] = useState("curated");
  const [savedOnly, setSavedOnly] = useState(false);
  const [collection, setCollection] = useState(false);
  const [playing, setPlaying] = useState<MusicAsset | null>(null);
  const { state } = useMarket();
  const matches = musicAssets
    .filter(
      (a) =>
        (!savedOnly || state.saved.includes(a.id)) &&
        (genre === "All sounds" || a.genre === genre) &&
        (type === "All formats" || a.kind === type) &&
        `${a.title} ${a.creator} ${a.city} ${a.genre}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : 0,
    );
  return (
    <div className="market-page editorial-shell">
      <div className="market-topline">
        <p className="eyebrow">THE SOUND IS JUST THE BEGINNING.</p>
        <button className="btn white small" onClick={() => setCollection(true)}>
          <Library size={16} />
          My collection ({state.purchases.length})
        </button>
      </div>
      <section className="market-masthead">
        <div>
          <h1>
            Find your
            <br />
            <em>next obsession.</em>
          </h1>
          <p>
            Tracks with character. Beats with a story.
            <br />
            Creative possibilities, made in South Africa.
          </p>
          <a className="btn primary" href="#browse-assets">
            Find your sound <ArrowRight size={17} />
          </a>
        </div>
        <div className="market-feature">
          <span className="feature-kicker">THE AFTER HOURS EDIT / 001</span>
          <div className="feature-disc">
            <span>SE.</span>
          </div>
          <div className="feature-bottom">
            <span>
              For the night.
              <br />
              <strong>For what comes next.</strong>
            </span>
            <Link
              href="/marketplace/after-hours"
              aria-label="Explore After Hours in Jozi"
            >
              <ArrowUpRight size={28} />
            </Link>
          </div>
        </div>
      </section>
      <div className="market-trust-strip">
        <span>
          <AudioLines size={17} /> Listen before you choose
        </span>
        <span>✳ Clear illustrative licence options</span>
        <span>✳ Fictional listings · no rights transferred</span>
      </div>
      <section id="browse-assets">
        <div className="market-browse-heading">
          <div>
            <p className="eyebrow">FRESH FROM THE CRATE</p>
            <h2>Discover something different.</h2>
          </div>
          <button
            className={`btn ${savedOnly ? "primary" : "white"}`}
            aria-pressed={savedOnly}
            onClick={() => setSavedOnly(!savedOnly)}
          >
            <Heart size={16} />
            Saved ({state.saved.length})
          </button>
        </div>
        <div className="market-filters">
          <label className="market-search">
            <Search size={18} />
            <span className="sr-only">Search marketplace</span>
            <input
              aria-label="Search marketplace"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tracks, creators, cities…"
            />
          </label>
          <label>
            <span className="sr-only">Marketplace genre</span>
            <select
              aria-label="Marketplace genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {["All sounds", ...new Set(musicAssets.map((a) => a.genre))].map(
                (g) => (
                  <option key={g}>{g}</option>
                ),
              )}
            </select>
          </label>
          <label>
            <span className="sr-only">Asset format</span>
            <select
              aria-label="Asset format"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {["All formats", "Track", "Instrumental", "Sample pack"].map(
                (t) => (
                  <option key={t}>{t}</option>
                ),
              )}
            </select>
          </label>
          <label>
            <SlidersHorizontal size={15} />
            <span className="sr-only">Sort assets</span>
            <select
              aria-label="Sort assets"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="curated">Curated for you</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>
        <p className="market-result-count" role="status">
          {matches.length} {matches.length === 1 ? "asset" : "assets"} to
          explore · Illustrative prices in ZAR
        </p>
        {matches.length ? (
          <div className="market-grid">
            {matches.map((a) => (
              <AssetCard asset={a} key={a.id} onPlay={setPlaying} />
            ))}
          </div>
        ) : (
          <Empty
            title="A little too specific?"
            description="Try another sound, clear your search or save an asset to build your crate."
          >
            <button
              className="btn primary"
              onClick={() => {
                setQuery("");
                setGenre("All sounds");
                setType("All formats");
                setSavedOnly(false);
              }}
            >
              Clear all filters
            </button>
          </Empty>
        )}
      </section>
      <section className="market-creator-banner">
        <div>
          <p className="eyebrow">YOUR SOUND HAS A FUTURE.</p>
          <h2>Make your next move.</h2>
          <p>
            Manage your releases, understand your rights and explore your artist
            workspace.
          </p>
        </div>
        <Link className="btn primary" href="/artists">
          Open artist workspace <ArrowUpRight size={17} />
        </Link>
      </section>
      <p className="market-disclosure">
        Marketplace is a browser-local demonstration. All creators and sale
        listings here are fictional; they are separate from the real artists
        featured in INDEX. No seller verification, legal rights transfer,
        payment processing or escrow service is connected.
      </p>
      <PreviewPlayer asset={playing} onClose={() => setPlaying(null)} />
      {collection && <Collection onClose={() => setCollection(false)} />}
    </div>
  );
}
