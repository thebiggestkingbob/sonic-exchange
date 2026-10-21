"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Pause,
  Play,
  AudioLines,
  Plus,
  Minus,
} from "lucide-react";
import { useDemo } from "./store";
import type { Role } from "@/lib/data";
export const directions = [
  {
    id: "liquid",
    name: "Liquid Universe",
    summary: "Fluid colour. Organic shapes. A playful, immersive world.",
    number: "01",
  },
  {
    id: "kinetic",
    name: "Culture in Motion",
    summary: "Moving artwork. Bold type. The energy of a music festival.",
    number: "02",
  },
  {
    id: "chrome",
    name: "Future Frequency",
    summary: "Sculptural chrome. Light and space. An experimental music lab.",
    number: "03",
  },
] as const;
export type Direction = (typeof directions)[number]["id"];
const journeys: {
  role: Role;
  label: string;
  title: string;
  text: string;
  href: string;
  action: string;
}[] = [
  {
    role: "visitor",
    label: "Discover music",
    title: "Start with something you love.",
    text: "Explore South African artists and their songs in INDEX. Try the SONIC NOW listening demo or discover original demo assets in Marketplace.",
    href: "/index",
    action: "Discover the INDEX",
  },
  {
    role: "artist",
    label: "I’m an artist",
    title: "Build your next chapter.",
    text: "Try your artist workspace: manage releases, explore royalty records and walk through a collaboration. DISTRIBUTION guides you through a simulated music release.",
    href: "/artists",
    action: "Try the artist workspace",
  },
  {
    role: "brand",
    label: "I’m a brand",
    title: "Connect your idea to the culture.",
    text: "Discover South African talent, explore illustrative audience insights and try a licensing agreement from offer to artist acceptance and demo escrow.",
    href: "/brands",
    action: "Try the brand workspace",
  },
  {
    role: "venue",
    label: "I run a venue",
    title: "Bring the next wave to your stage.",
    text: "Explore the venue portal, try a local audience estimate and follow a booking from request to acceptance. Every financial action is a clear simulation.",
    href: "/venues",
    action: "Try the venue workspace",
  },
];
function Artwork({ direction }: { direction: Direction }) {
  if (direction === "liquid")
    return (
      <div className="direction-art liquid-art" aria-hidden="true">
        <div className="liquid-blob blob-a" />
        <div className="liquid-blob blob-b" />
        <div className="liquid-blob blob-c" />
        <div className="liquid-dial">
          <span>
            SONIC
            <br />
            EXCHANGE
          </span>
          <AudioLines size={32} />
        </div>
        <div className="liquid-satellite satellite-a">
          SOUND HAS NO BORDERS ↗
        </div>
        <div className="liquid-satellite satellite-b">
          FEEL SOMETHING NEW ✳
        </div>
        <div className="liquid-orbit" />
      </div>
    );
  if (direction === "kinetic")
    return (
      <div className="direction-art kinetic-art" aria-hidden="true">
        <div className="kinetic-gallery gallery-one">
          {[1, 2, 3, 1, 2, 3].map((n, i) => (
            <div className={`kinetic-print print-${n}`} key={i}>
              <img src={`/images/artist-${n}.jpg`} alt="" />
              <span>
                {
                  [
                    "FEEL THE CULTURE.",
                    "MAKE SOME NOISE.",
                    "FIND YOUR PEOPLE.",
                  ][n - 1]
                }
              </span>
            </div>
          ))}
        </div>
        <div className="kinetic-gallery gallery-two">
          {[4, 3, 2, 4, 3, 2].map((n, i) => (
            <div className={`kinetic-print print-${n}`} key={i}>
              <img src={`/images/artist-${n}.jpg`} alt="" />
              <span>
                {
                  [
                    "THE NEXT WAVE.",
                    "IN YOUR ELEMENT.",
                    "NOTHING STANDS STILL.",
                  ][n % 3]
                }
              </span>
            </div>
          ))}
        </div>
        <div className="kinetic-seal">
          SA
          <br />
          TO THE
          <br />
          WORLD↗
        </div>
      </div>
    );
  return (
    <div className="direction-art chrome-art" aria-hidden="true">
      <div className="chrome-grid" />
      <div className="chrome-object">
        <div className="chrome-ring ring-one" />
        <div className="chrome-ring ring-two" />
        <div className="chrome-ring ring-three" />
      </div>
      <div className="chrome-shadow" />
      <span className="chrome-coordinate">SE / FREQUENCY 001</span>
      <div className="chrome-label">
        <AudioLines size={20} />
        <span>
          Human creativity.
          <br />
          <strong>Infinite possibility.</strong>
        </span>
      </div>
    </div>
  );
}
export default function DesignDirection({
  direction,
  light = false,
  platformLook = "kinetic-light",
}: {
  direction: Direction;
  light?: boolean;
  platformLook?: string;
}) {
  const [paused, setPaused] = useState(false);
  const [journey, setJourney] = useState(journeys[0]);
  const [faq, setFaq] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const { send } = useDemo();
  const info = directions.find((d) => d.id === direction)!;
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (reduced.matches || paused) return;
        node.style.setProperty(
          "--design-scroll",
          `${Math.min(window.scrollY, 1200) * 0.08}px`,
        );
      });
    };
    const pointer = (event: PointerEvent) => {
      if (paused || reduced.matches || event.pointerType === "touch") return;
      node.style.setProperty(
        "--pointer-x",
        `${(event.clientX / window.innerWidth - 0.5) * 16}deg`,
      );
      node.style.setProperty(
        "--pointer-y",
        `${(event.clientY / window.innerHeight - 0.5) * -12}deg`,
      );
    };
    window.addEventListener("scroll", scroll, { passive: true });
    node.addEventListener("pointermove", pointer);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("design-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    node
      .querySelectorAll("[data-design-reveal]")
      .forEach((el) => observer.observe(el));
    return () => {
      window.removeEventListener("scroll", scroll);
      node.removeEventListener("pointermove", pointer);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [paused]);
  const questions = [
    {
      q: "What is SONIC EXCHANGE?",
      a: "One connected platform for discovering South African music, exploring creative opportunities and managing your next move. INDEX, SONIC NOW, Marketplace and artist, brand and venue workspaces bring the ecosystem together.",
    },
    {
      q: "How do I get started?",
      a: "Choose what brings you here in the section above. Curious about music? Start with INDEX. Creating music? Try ARTISTS. Exploring a collaboration? Try BRANDS. Planning a show? Try VENUES. You can visit every destination.",
    },
    {
      q: "Is this a live music marketplace?",
      a: "This is an interactive prototype. Marketplace listings, valuations, licences, purchases and offers are fictional demonstrations. No money moves and no music rights are transferred. Artist references in INDEX are real; their insights are simulated.",
    },
  ];
  return (
    <div
      ref={root}
      className={`design-direction design-${direction} ${light ? "kinetic-light" : ""} ${paused ? "design-motion-paused" : ""}`}
    >
      <a className="skip-link" href="#direction-main">
        Skip to content
      </a>
      <header className="direction-nav">
        <Link href="/design-lab" className="direction-logo">
          SONIC EXCHANGE<span>®</span>
        </Link>
        <nav aria-label="Design navigation">
          <a href="#direction-about">The idea</a>
          <a href="#direction-start">Find your way</a>
          <Link
            href={light ? `/marketplace?look=${platformLook}` : "/marketplace"}
          >
            Marketplace
            <ArrowUpRight size={13} />
          </Link>
        </nav>
        <Link
          className="direction-enter"
          href={light ? `/index?look=${platformLook}` : "/index"}
        >
          Enter platform
          <ArrowUpRight size={15} />
        </Link>
      </header>
      <div id="direction-main">
        <section className="direction-hero">
          <div className="direction-eyeline">
            <span>
              <i /> MUSIC / CULTURE / POSSIBILITY
            </span>
            <span>SOUTH AFRICA → EVERYWHERE</span>
          </div>
          <div className="direction-hero-copy">
            <p className="direction-eyebrow">WELCOME TO SONIC EXCHANGE</p>
            {direction === "liquid" ? (
              <h1>
                Feel
                <br />
                <em>everything.</em>
              </h1>
            ) : direction === "kinetic" ? (
              <h1>
                SOUND
                <br />
                <span>WITHOUT</span>
                <br />
                LIMITS<span className="kinetic-period">.</span>
              </h1>
            ) : (
              <h1>
                A different
                <br />
                <em>frequency.</em>
              </h1>
            )}
            <p className="direction-deck">
              {direction === "liquid"
                ? "A whole world of music. A whole new way to connect. Find your sound, your people, your next possibility."
                : direction === "kinetic"
                  ? "The artists. The ideas. The next wave. Step into the exchange moving South African music forward."
                  : "A new space for music discovery, creative exchange and the people shaping what comes next."}
            </p>
            <div className="direction-hero-actions">
              <a className="direction-button" href="#direction-start">
                Find your way in
                <ArrowUpRight size={18} />
              </a>
              <a className="direction-tour" href="#direction-about">
                What is SONIC?
                <ArrowDown size={15} />
              </a>
            </div>
          </div>
          <Artwork direction={direction} />
          <div className="direction-hero-foot">
            <span>
              {direction === "liquid"
                ? "FOLLOW THE FEELING."
                : direction === "kinetic"
                  ? "INDEPENDENT BY DESIGN. LOUD BY NATURE."
                  : "DESIGNED AROUND HUMAN CREATIVITY."}
            </span>
            <button
              onClick={() => setPaused(!paused)}
              aria-pressed={paused}
              aria-label={paused ? "Resume motion" : "Pause motion"}
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
              {paused ? "MOTION PAUSED" : "MOTION ON"}
            </button>
            <span>
              SCROLL TO EXPLORE
              <ArrowDown size={12} />
            </span>
          </div>
        </section>
        <div className="direction-marquee" aria-hidden="true">
          <div>
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>
                DISCOVER SOUND <b>✳</b> CONNECT WITH CULTURE <b>✳</b> CREATE
                WHAT’S NEXT <b>✳</b>
              </span>
            ))}
          </div>
        </div>
        <section
          id="direction-about"
          className="direction-about"
          data-design-reveal
        >
          <p className="direction-eyebrow">01 / AN EXCHANGE OF POSSIBILITIES</p>
          <div>
            <h2>
              Music is the start.
              <br />
              <em>You’re what’s next.</em>
            </h2>
            <div>
              <p>
                SONIC EXCHANGE connects music discovery, creative opportunities
                and artist tools in one place.
              </p>
              <p>
                Discover South African artists. Explore demo music licences.
                Build a release, find a collaboration or bring talent to a
                stage. Whatever brings you here, there’s a way in.
              </p>
              <Link
                href={light ? `/sonic-now?look=${platformLook}` : "/sonic-now"}
                className="direction-inline"
              >
                Start with a sound
                <AudioLines size={18} />
              </Link>
            </div>
          </div>
          <div className="direction-three">
            <Link href={light ? `/index?look=${platformLook}` : "/index"}>
              <span>01</span>
              <h3>Discover.</h3>
              <p>
                Explore South African artists, songs and cultural signals in
                INDEX.
              </p>
              <ArrowUpRight />
            </Link>
            <Link
              href={
                light ? `/marketplace?look=${platformLook}` : "/marketplace"
              }
            >
              <span>02</span>
              <h3>Exchange.</h3>
              <p>
                Listen to demo assets. Save a sound. Explore illustrative music
                rights.
              </p>
              <ArrowUpRight />
            </Link>
            <a href="#direction-start">
              <span>03</span>
              <h3>Create.</h3>
              <p>
                Choose your workspace and try the next step in your music
                journey.
              </p>
              <ArrowUpRight />
            </a>
          </div>
        </section>
        <section id="direction-start" className="direction-start">
          <div className="direction-start-heading" data-design-reveal>
            <p className="direction-eyebrow">02 / YOUR WORLD STARTS HERE</p>
            <h2>
              What brings
              <br />
              <em>you here?</em>
            </h2>
            <p>
              You don’t need to know the music business.
              <br />
              Just choose a starting point.
            </p>
          </div>
          <div className="direction-selector">
            <div role="group" aria-label="Choose your journey">
              {journeys.map((j) => (
                <button
                  key={j.role}
                  aria-pressed={journey.role === j.role}
                  onClick={() => setJourney(j)}
                >
                  {j.label}
                  <ArrowUpRight size={17} />
                </button>
              ))}
            </div>
            <div className="direction-journey" key={journey.role}>
              <span className="direction-journey-symbol" aria-hidden="true">
                ✳
              </span>
              <h3>{journey.title}</h3>
              <p>{journey.text}</p>
              <Link
                href={
                  light ? `${journey.href}?look=${platformLook}` : journey.href
                }
                className="direction-button"
                onClick={() => send({ type: "role", role: journey.role })}
              >
                {journey.action}
                <ArrowUpRight size={17} />
              </Link>
              <small>
                No signup needed. Workspaces use local demo roles, not live
                accounts.
              </small>
            </div>
          </div>
        </section>
        <section className="direction-faq" data-design-reveal>
          <div>
            <p className="direction-eyebrow">BEFORE YOU DIVE IN</p>
            <h2>
              A little clarity.
              <br />
              <em>A lot to explore.</em>
            </h2>
          </div>
          <div>
            {questions.map((q, i) => (
              <div className="direction-question" key={q.q}>
                <button
                  aria-expanded={faq === i}
                  aria-controls={`question-${i}`}
                  onClick={() => setFaq(faq === i ? null : i)}
                >
                  {q.q}
                  {faq === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                <div id={`question-${i}`} hidden={faq !== i}>
                  <p>{q.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="direction-finale">
          <p className="direction-eyebrow">THE NEXT WAVE IS ALREADY HERE.</p>
          <h2>
            Make your
            <br />
            <em>next move.</em>
          </h2>
          <Link
            className="direction-button"
            href={light ? `/marketplace?look=${platformLook}` : "/marketplace"}
          >
            Explore Marketplace
            <ArrowUpRight size={18} />
          </Link>
          <div className="finale-moving-mark" aria-hidden="true">
            ✳
          </div>
        </section>
      </div>
      <footer className="direction-footer">
        <Link href="/">SONIC EXCHANGE.</Link>
        <p>
          Real culture. Illustrative data. All transactions are simulations.
        </p>
        <Link href="/design-lab">
          Compare design options
          <ArrowRight size={15} />
        </Link>
      </footer>
      <aside className="direction-review" aria-label="Design comparison">
        <span>DESIGN OPTIONS</span>
        {directions.map((d) => (
          <Link
            key={d.id}
            href={`/design-lab/${d.id}`}
            aria-current={direction === d.id ? "page" : undefined}
          >
            {d.number}
            <span>{d.name}</span>
          </Link>
        ))}
      </aside>
    </div>
  );
}
export function DesignLab() {
  return (
    <div className="design-lab">
      <header>
        <Link href="/" className="direction-logo">
          SONIC EXCHANGE.
        </Link>
        <span>DESIGN STUDIES / MOTION INCLUDED</span>
      </header>
      <p className="direction-eyebrow">THREE DIFFERENT WORLDS. ONE EXCHANGE.</p>
      <h1>Choose a feeling.</h1>
      <p>
        Open an option to experience its motion, scrolling and working platform
        entry points.
      </p>
      <div className="design-lab-grid">
        {directions.map((d) => (
          <Link
            key={d.id}
            href={`/design-lab/${d.id}`}
            className={`design-lab-card lab-${d.id}`}
          >
            <span>{d.number} / LIVE DESIGN STUDY</span>
            <div className="lab-card-shape" />
            <h2>{d.name}</h2>
            <p>{d.summary}</p>
            <span>
              Experience the motion <ArrowUpRight size={20} />
            </span>
          </Link>
        ))}
      </div>
      <p className="lab-note">
        Review-only pages. Existing platform features and production remain
        unchanged.
      </p>
    </div>
  );
}
