"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  AudioLines,
  Play,
  Disc3,
  ChartNoAxesCombined,
  Fingerprint,
  Zap,
  MoveUpRight,
} from "lucide-react";
import { musicAssets, type MusicAsset } from "@/lib/marketplace";
import { artists } from "@/lib/data";
import { AssetCard, PreviewPlayer } from "./marketplace-ui";
import { ArtistImage } from "./artist-image";
import { MiniChart, Modal } from "./ui";
export default function HomePage() {
  const [playing, setPlaying] = useState<MusicAsset | null>(null);
  const [film, setFilm] = useState(false);
  return (
    <div className="exchange-home">
      <section className="home-hero editorial-shell">
        <div className="home-hero-copy">
          <p className="edition-label">
            <span /> SOUTH AFRICAN SOUND. WORLDWIDE POSSIBILITY.
          </p>
          <h1>
            Music has value.
            <br />
            Make it <em>move.</em>
          </h1>
          <p className="home-deck">
            A new home for the sound of tomorrow. Discover the culture. Connect
            with its creators. Find music that moves you.
          </p>
          <div className="button-row">
            <Link className="btn primary" href="/marketplace">
              Explore Marketplace <ArrowUpRight size={18} />
            </Link>
            <button className="home-film" onClick={() => setFilm(true)}>
              <span>
                <Play size={12} fill="currentColor" />
              </span>
              Step inside SONIC
            </button>
          </div>
          <div className="hero-community">
            <span className="mini-avatars">
              {artists.slice(0, 3).map((a) => (
                <ArtistImage key={a.id} artist={a} decorative />
              ))}
            </span>
            <span>Rooted here. Ready for everywhere.</span>
            <span className="community-line" />
          </div>
        </div>
        <div className="home-hero-stage">
          <div className="stage-orbit orbit-one" />
          <div className="stage-orbit orbit-two" />
          <div className="hero-stage-grain" />
          <span className="stage-label">TURN UP WHAT’S NEXT</span>
          <img
            className="stage-portrait"
            src="/images/hero.webp"
            alt="Music listener wearing headphones"
            fetchPriority="high"
          />
          <div className="stage-wave">
            {[28, 62, 98, 45, 122, 75, 105, 42, 82, 116, 58, 34].map((n, i) => (
              <i key={i} style={{ height: n }} />
            ))}
          </div>
          <div className="stage-sticker">
            <AudioLines size={25} />
            <span>
              Music. Culture.
              <br />
              <strong>Possibility.</strong>
            </span>
            <ArrowUpRight size={20} />
          </div>
          <div className="stage-index">01 / A NEW FREQUENCY</div>
        </div>
      </section>
      <div className="sound-marquee" aria-hidden="true">
        <span>INDEPENDENT BY DESIGN</span>
        <span>✳</span>
        <span>CONNECTED BY MUSIC</span>
        <span>✳</span>
        <span>LOCAL ROOTS. GLOBAL REACH.</span>
        <span>✳</span>
        <span>THE NEXT WAVE STARTS HERE</span>
        <span>✳</span>
      </div>
      <section
        className="home-paths editorial-shell"
        aria-label="Explore the exchange"
      >
        {[
          {
            icon: Disc3,
            title: "Find your next sound",
            copy: "Explore tracks, beats and creative possibilities.",
            href: "/marketplace",
            number: "01",
          },
          {
            icon: ChartNoAxesCombined,
            title: "Follow the movement",
            copy: "Meet the South African artists shaping the culture.",
            href: "/index",
            number: "02",
          },
          {
            icon: Fingerprint,
            title: "Build on your terms",
            copy: "Your music. Your rights. Your next chapter.",
            href: "/artists",
            number: "03",
          },
          {
            icon: Zap,
            title: "Catch it in the moment",
            copy: "Hear something? Find your frequency.",
            href: "/sonic-now",
            number: "04",
          },
        ].map(({ icon: Icon, ...item }) => (
          <Link key={item.href} href={item.href}>
            <span className="path-top">
              <Icon size={24} />
              <small>{item.number}</small>
            </span>
            <h2>{item.title}</h2>
            <p>{item.copy}</p>
            <ArrowUpRight size={18} className="path-arrow" />
          </Link>
        ))}
      </section>
      <section className="home-assets editorial-shell">
        <div className="editorial-heading">
          <div>
            <p className="eyebrow">THE CRATE / VOL. 01</p>
            <h2>
              Good music.
              <br />
              <span>Great possibilities.</span>
            </h2>
          </div>
          <div>
            <p>
              Fresh finds for your next big idea.
              <br />A curated selection of fictional demo assets.
            </p>
            <Link href="/marketplace" className="editorial-link">
              Dig into Marketplace <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <div className="home-asset-grid">
          {musicAssets.slice(0, 4).map((a) => (
            <AssetCard key={a.id} asset={a} onPlay={setPlaying} />
          ))}
        </div>
      </section>
      <section className="home-culture editorial-shell">
        <div className="culture-story">
          <p className="eyebrow">CULTURE DOESN’T STAND STILL.</p>
          <h2>
            Neither
            <br />
            should you<span>.</span>
          </h2>
          <p>
            From amapiano to the next underground wave. Find the people, songs
            and sounds moving South Africa forward.
          </p>
          <Link className="btn primary" href="/index">
            Explore the INDEX <MoveUpRight size={17} />
          </Link>
          <span className="culture-footnote">
            Real artist references · illustrative momentum
          </span>
        </div>
        <div className="home-movers">
          <div className="movers-heading">
            <span>ON OUR RADAR</span>
            <span>DEMO SNAPSHOT ↗</span>
          </div>
          {artists.slice(0, 4).map((a, i) => (
            <Link href={`/index?q=${encodeURIComponent(a.name)}`} key={a.id}>
              <span className="mover-rank">0{i + 1}</span>
              <ArtistImage artist={a} />
              <div>
                <strong>{a.name}</strong>
                <small>
                  {a.track} · {a.genre}
                </small>
              </div>
              <MiniChart />
              <span className="mover-change">+{a.change}%</span>
              <ArrowUpRight size={17} />
            </Link>
          ))}
          <Link className="movers-all" href="/index">
            See the full picture <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section className="home-now editorial-shell">
        <div className="now-visual">
          <img
            src="/images/crowd.jpg"
            alt="Crowd sharing a live music moment"
            loading="lazy"
          />
          <span>
            FEEL IT.
            <br />
            <em>FIND IT.</em>
          </span>
          <AudioLines size={60} />
        </div>
        <div className="now-copy">
          <p className="eyebrow">THIS MOMENT HAS A SOUNDTRACK.</p>
          <h2>
            What’s that
            <br />
            <span>feeling?</span>
          </h2>
          <p>
            A sound stops you in your tracks. SONIC NOW helps you explore what
            comes next. Try the listening demo and discover a new favourite.
          </p>
          <Link href="/sonic-now" className="btn primary">
            Open SONIC NOW <AudioLines size={18} />
          </Link>
          <small>
            Recognition provider not connected. Sample results are clearly
            labelled.
          </small>
        </div>
      </section>
      <section className="home-bottom editorial-shell">
        <p className="eyebrow">ARTISTS. BRANDS. VENUES. ONE EXCHANGE.</p>
        <h2>
          Your next chapter
          <br />
          sounds <em>different.</em>
        </h2>
        <div className="button-row">
          <Link className="btn primary" href="/artists">
            For artists <ArrowUpRight size={17} />
          </Link>
          <Link className="btn white" href="/brands">
            For brands <ArrowUpRight size={17} />
          </Link>
          <Link className="btn white" href="/venues">
            For venues <ArrowUpRight size={17} />
          </Link>
        </div>
        <p className="home-demo-note">
          Interactive prototype · Marketplace listings, prices and transactions
          are fictional. No real music rights are offered or transferred.
        </p>
      </section>
      <PreviewPlayer asset={playing} onClose={() => setPlaying(null)} />
      {film && (
        <Modal title="Welcome to the exchange" onClose={() => setFilm(false)}>
          <div className="intro-film">
            <AudioLines size={54} />
            <h3>
              A new frequency
              <br />
              for South African music.
            </h3>
            <p>
              Discover artists in INDEX, explore demo music licences in
              Marketplace, and connect through the artist, brand and venue
              workspaces.
            </p>
          </div>
          <p className="muted">
            This is an interactive introduction. A brand film has not been added
            yet.
          </p>
          <Link
            className="btn primary"
            href="/marketplace"
            onClick={() => setFilm(false)}
          >
            Start exploring <ArrowUpRight size={16} />
          </Link>
        </Modal>
      )}
    </div>
  );
}
