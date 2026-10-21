"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  AudioLines,
  Pause,
  Play,
  Orbit,
  ScanLine,
  Sparkles,
  Check,
} from "lucide-react";
import { SoundWorld } from "./sound-world";
import { useDemo } from "./store";
import { musicAssets, type MusicAsset } from "@/lib/marketplace";
import { AssetCard, PreviewPlayer } from "./marketplace-ui";
import { artists, type Role } from "@/lib/data";
import { ArtistImage } from "./artist-image";
const paths = [
  {
    id: "visitor",
    title: "I’m here to discover",
    label: "Your next favourite lives here.",
    text: "Find the people shaping South African music. Explore artist stories and song references, try the listening demo, or dig through the Marketplace.",
    href: "/index",
    action: "Explore the INDEX",
    destinations: ["INDEX", "SONIC NOW", "MARKETPLACE"],
  },
  {
    id: "artist",
    title: "I make music",
    label: "Your sound. Your next chapter.",
    text: "Step into an artist workspace. Explore release management, rights, royalties and collaboration opportunities—all in a guided demo.",
    href: "/artists",
    action: "Try the artist workspace",
    destinations: ["ARTISTS", "DISTRIBUTION", "MARKETPLACE"],
  },
  {
    id: "brand",
    title: "I represent a brand",
    label: "Find a sound that says something.",
    text: "Discover South African artists, explore audience insights and try a licensing offer. Follow a simulated agreement from artist acceptance to escrow.",
    href: "/brands",
    action: "Try the brand workspace",
    destinations: ["BRANDS", "INDEX", "MARKETPLACE"],
  },
  {
    id: "venue",
    title: "I bring people together",
    label: "Give the next wave a stage.",
    text: "Explore artists for your venue, try an illustrative audience estimate and walk through a booking—from request to acceptance and demo funding.",
    href: "/venues",
    action: "Try the venue workspace",
    destinations: ["VENUES", "INDEX", "FACTS SHOW"],
  },
] as const;
const chapters = [
  {
    number: "01",
    title: "Find your frequency.",
    text: "Start with discovery. Explore the cultural INDEX, meet South African artists and follow the sounds that move you.",
    href: "/index",
    action: "Discover the INDEX",
    icon: ScanLine,
  },
  {
    number: "02",
    title: "Explore the possibilities.",
    text: "Dig through original demo listings in Marketplace. Listen, save a sound and compare the different kinds of music rights.",
    href: "/marketplace",
    action: "Browse demo assets",
    icon: Orbit,
  },
  {
    number: "03",
    title: "Make your next move.",
    text: "Choose your workspace. Artists manage releases; brands explore collaborations; venues bring the culture to a stage.",
    href: "#your-world",
    action: "Find your starting point",
    icon: Sparkles,
  },
];
export default function HomePage() {
  const [paused, setPaused] = useState(false);
  const [path, setPath] = useState<(typeof paths)[number]>(paths[0]);
  const [playing, setPlaying] = useState<MusicAsset | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const { send } = useDemo();
  useEffect(() => {
    const elements = root.current?.querySelectorAll("[data-reveal]");
    if (!elements || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.1 },
    );
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div className={`sonic-world ${paused ? "motion-paused" : ""}`} ref={root}>
      <section className="world-hero" aria-labelledby="world-title">
        <div className="world-hero-top">
          <span>
            <i /> SOUTH AFRICAN ROOTS. UNLIMITED POSSIBILITIES.
          </span>
          <span>INDEPENDENT BY DESIGN / 001</span>
        </div>
        <div className="world-hero-content">
          <p className="world-kicker">THIS IS SONIC EXCHANGE.</p>
          <h1 id="world-title">
            A new world
            <br />
            of <span>sound.</span>
            <i aria-hidden="true">✳</i>
          </h1>
          <p className="world-intro">
            Discover music. Connect with its makers.
            <br />
            Turn your next idea into something that moves.
          </p>
          <div className="world-hero-actions">
            <a className="world-button acid" href="#how-it-works">
              Show me around <ArrowDown size={17} />
            </a>
            <Link className="world-text-link" href="/marketplace">
              Explore Marketplace <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <SoundWorld paused={paused} />
        <div className="world-hero-bottom">
          <a href="#what-is-sonic">
            <span className="scroll-line" /> SCROLL TO ENTER
          </a>
          <span>A SPACE FOR MUSIC TO BECOME MORE.</span>
          <button
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Resume visual motion" : "Pause visual motion"}
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
            <span>{paused ? "MOTION OFF" : "MOTION ON"}</span>
          </button>
        </div>
      </section>
      <section className="world-definition" id="what-is-sonic">
        <div className="world-definition-top">
          <p className="world-kicker">01 / MEET THE EXCHANGE</p>
          <span className="world-asterisk" aria-hidden="true">
            ✳
          </span>
        </div>
        <div className="definition-grid" data-reveal>
          <h2>
            Music moves culture.
            <br />
            We{" "}
            <em>
              connect
              <br />
              the dots.
            </em>
          </h2>
          <div>
            <p className="definition-lead">
              SONIC EXCHANGE brings music discovery, creative opportunities and
              artist tools into one connected platform.
            </p>
            <p>
              It’s a place for artists to build, brands to collaborate, venues
              to connect with talent—and everyone else to discover what’s next.
            </p>
            <p className="definition-footnote">
              <Check size={15} /> You don’t need to be a music expert to start.
            </p>
          </div>
        </div>
        <div className="definition-bottom">
          <span>DISCOVER.</span>
          <span>CONNECT.</span>
          <span>CREATE.</span>
          <ArrowUpRight size={36} />
        </div>
      </section>
      <section className="world-how" id="how-it-works">
        <div className="world-section-heading" data-reveal>
          <div>
            <p className="world-kicker">02 / YOUR FIRST STEPS</p>
            <h2>
              New here?
              <br />
              <span>Follow the sound.</span>
            </h2>
          </div>
          <p>
            Three ways in.
            <br />A whole world to explore.
          </p>
        </div>
        <div className="world-chapters">
          {chapters.map(({ icon: Icon, ...chapter }) => (
            <article key={chapter.number} className="world-chapter" data-reveal>
              <span className="chapter-number">/{chapter.number}</span>
              <div className="chapter-orbit">
                <Icon size={36} strokeWidth={1} />
                <div />
                <div />
              </div>
              <h3>{chapter.title}</h3>
              <p>{chapter.text}</p>
              <Link href={chapter.href} className="world-text-link">
                {chapter.action}
                <ArrowUpRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="world-portal" id="your-world">
        <div className="world-section-heading" data-reveal>
          <div>
            <p className="world-kicker">03 / FIND YOUR WAY IN</p>
            <h2>
              Different people.
              <br />
              <span>Shared frequency.</span>
            </h2>
          </div>
          <p>
            No wrong entrance.
            <br />
            Choose what brings you here.
          </p>
        </div>
        <div className="world-path-picker">
          <div
            role="group"
            aria-label="Choose your starting point"
            className="world-path-options"
          >
            {paths.map((p, i) => (
              <button
                key={p.id}
                aria-pressed={path.id === p.id}
                onClick={() => setPath(p)}
              >
                <span>0{i + 1}</span>
                {p.title}
                <ArrowUpRight size={20} />
              </button>
            ))}
          </div>
          <div className="world-path-result" key={path.id}>
            <span className="path-result-symbol" aria-hidden="true">
              ✳
            </span>
            <div className="path-destinations">
              {path.destinations.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <h3>{path.label}</h3>
            <p>{path.text}</p>
            <Link
              className="world-button acid"
              href={path.href}
              onClick={() => send({ type: "role", role: path.id as Role })}
            >
              {path.action}
              <ArrowUpRight size={17} />
            </Link>
            <small>
              No signup needed for the demo. Role switching is not live
              authentication.
            </small>
          </div>
        </div>
      </section>
      <section className="world-culture">
        <div className="culture-giant" aria-hidden="true">
          <span>HOMEGROWN.</span>
          <span>BOUNDLESS.</span>
        </div>
        <div className="world-culture-copy">
          <p className="world-kicker">04 / THE CULTURE IS THE SIGNAL</p>
          <h2>
            From here.
            <br />
            <em>To everywhere.</em>
          </h2>
          <p>
            South African sound is shaping the conversation.
            <br />
            Meet the artists. Explore their songs. Find your own connection.
          </p>
          <Link className="world-button outline" href="/index">
            Meet the movement <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="world-artist-stack">
          {artists.slice(0, 4).map((a, i) => (
            <Link
              key={a.id}
              href={`/index?q=${encodeURIComponent(a.name)}`}
              className="world-artist-row"
            >
              <span>0{i + 1}</span>
              <ArtistImage artist={a} />
              <div>
                <h3>{a.name}</h3>
                <p>
                  {a.track} / {a.genre}
                </p>
              </div>
              <ArrowUpRight size={20} />
            </Link>
          ))}
          <small>
            Real artist and song references. Insights in INDEX are simulated.
          </small>
        </div>
      </section>
      <section className="world-crate">
        <div className="world-section-heading" data-reveal>
          <div>
            <p className="world-kicker">05 / A TASTE OF WHAT’S INSIDE</p>
            <h2>
              A sound.
              <br />
              <span>A thousand possibilities.</span>
            </h2>
          </div>
          <Link className="world-text-link" href="/marketplace">
            Enter Marketplace
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="world-crate-grid">
          {musicAssets.slice(0, 3).map((a) => (
            <AssetCard asset={a} key={a.id} onPlay={setPlaying} />
          ))}
        </div>
        <p className="world-demo-copy">
          Fictional demo listings. Audio previews are original synthesized
          samples, not recordings by the real artists featured above. No rights
          are for sale or transferred.
        </p>
      </section>
      <section className="world-questions">
        <div>
          <p className="world-kicker">A LITTLE CLARITY BEFORE YOU DIVE IN.</p>
          <h2>
            Good questions.
            <br />
            <span>Clear answers.</span>
          </h2>
        </div>
        <div className="world-faq">
          {[
            {
              q: "What can I do on SONIC EXCHANGE?",
              a: "Discover South African artists in INDEX, try music identification in SONIC NOW, explore demo music licences in Marketplace, or use artist, brand and venue workspaces. DISTRIBUTION guides artists through a demo release, and FACTS SHOW brings editorial stories and audience participation together.",
            },
            {
              q: "Where should I start?",
              a: "Choose your starting point above. If you’re curious about music, begin with INDEX. If you create music, try ARTISTS. Brands can explore BRANDS, and venue teams can try VENUES. You can move freely between every destination.",
            },
            {
              q: "Is this a live marketplace?",
              a: "This is a fully interactive prototype. Listings, prices, offers, payments, escrow and rights transfers are demonstrations only. Purchases create local demo receipts; no money moves and no real music rights are transferred.",
            },
            {
              q: "Are the artist insights and recognition results live?",
              a: "Real South African artist and song references are paired with illustrative insights. Live social feeds, recognition, DSP delivery and verification services are not connected. Sample results and simulated actions are labelled throughout.",
            },
            {
              q: "Do I need an account to explore?",
              a: "No. Try the prototype without signing up. Your demo progress stays in this browser. The role selector opens sample workspaces and is not a real account or authentication system.",
            },
          ].map(({ q, a }) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="world-finale">
        <div className="finale-orbit" aria-hidden="true" />
        <p className="world-kicker">THE NEXT CHAPTER IS YOURS.</p>
        <h2>
          Come for the sound.
          <br />
          <em>Stay for what’s next.</em>
        </h2>
        <a href="#your-world" className="world-button acid">
          Find your starting point <ArrowUpRight size={18} />
        </a>
        <Link href="/sonic-now" className="world-text-link">
          Or start with a sound <AudioLines size={18} />
        </Link>
        <p className="world-demo-copy">
          An interactive vision for South African music. Explore the
          possibilities; every live integration still to come is clearly
          identified.
        </p>
      </section>
      <PreviewPlayer asset={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}
