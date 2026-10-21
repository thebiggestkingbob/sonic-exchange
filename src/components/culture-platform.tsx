"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";

type Chapter = {
  number: string;
  label: string;
  title: string;
  accent: string;
  description: string;
  action: string;
  posters: [string, string];
  images: [string, string];
  stamp: string;
};
const chapters: Record<string, Chapter> = {
  "/marketplace": {
    number: "01",
    label: "THE MARKETPLACE",
    title: "SOUND WITH",
    accent: "POSSIBILITY.",
    description:
      "Dig a little deeper. Find original tracks, beats and creative possibilities from a fictional South African studio collection.",
    action: "Dig into the collection",
    posters: ["AFTER HOURS.", "FIND YOUR SOUND."],
    images: ["artist-1.jpg", "vinyl.jpg"],
    stamp: "CRATE / CULTURE",
  },
  "/index": {
    number: "02",
    label: "THE CULTURAL INDEX",
    title: "KNOW THE",
    accent: "NEXT WAVE.",
    description:
      "The artists. The songs. The signals. Explore South African music through illustrative cultural insights, all in one place.",
    action: "Explore the chart",
    posters: ["CULTURE MOVES.", "STAY IN THE KNOW."],
    images: ["artist-2.jpg", "artist-4.jpg"],
    stamp: "SA / ON REPEAT",
  },
  "/sonic-now": {
    number: "03",
    label: "SONIC NOW",
    title: "HEAR IT.",
    accent: "FEEL IT.",
    description:
      "Every discovery starts somewhere. Try the listening demo, meet the artist behind the sample and follow your curiosity.",
    action: "Find that feeling",
    posters: ["TURN IT UP.", "FEEL THE FREQUENCY."],
    images: ["artist-1.jpg", "crowd.jpg"],
    stamp: "SOUND / FOUND",
  },
  "/artists": {
    number: "04",
    label: "THE ARTIST SPACE",
    title: "YOUR SOUND.",
    accent: "YOUR WORLD.",
    description:
      "Make space for your next chapter. Your releases, royalties and collaborations, connected in one artist workspace.",
    action: "Open your workspace",
    posters: ["MAKE SOME NOISE.", "OWN YOUR NEXT MOVE."],
    images: ["artist-3.jpg", "studio.jpg"],
    stamp: "MADE / BY YOU",
  },
  "/brands": {
    number: "05",
    label: "THE BRAND EXCHANGE",
    title: "CULTURE IS",
    accent: "CONNECTION.",
    description:
      "Find the voices that move your idea forward. Discover South African talent and try a collaboration from first offer to agreement.",
    action: "Meet the talent",
    posters: ["IN YOUR ELEMENT.", "MAKE IT MEAN MORE."],
    images: ["artist-2.jpg", "artist-1.jpg"],
    stamp: "IDEAS / MEET SOUND",
  },
  "/venues": {
    number: "06",
    label: "THE VENUE NETWORK",
    title: "SET THE",
    accent: "SCENE.",
    description:
      "From a room to a movement. Explore spaces, understand illustrative local audiences and bring the next wave to your stage.",
    action: "Find your space",
    posters: ["ROOM FOR CULTURE.", "THE NIGHT IS YOURS."],
    images: ["crowd.jpg", "artist-4.jpg"],
    stamp: "LIVE / TOGETHER",
  },
  "/distribution": {
    number: "07",
    label: "THE RELEASE ROOM",
    title: "FROM HERE.",
    accent: "TO EVERYWHERE.",
    description:
      "Give your next release a clear path. Prepare the details, check your rights and walk through a simulated delivery to music platforms.",
    action: "Prepare your release",
    posters: ["MADE IN SA.", "LET THE WORLD HEAR."],
    images: ["studio.jpg", "artist-3.jpg"],
    stamp: "LOCAL / GLOBAL",
  },
  "/facts-show": {
    number: "08",
    label: "FACTS SHOW",
    title: "BEHIND THE",
    accent: "SOUND.",
    description:
      "The stories. The decisions. The people. Explore a new space for conversations about music, ownership and building a creative life.",
    action: "Join the conversation",
    posters: ["LESS NOISE.", "MORE REAL TALK."],
    images: ["artist-4.jpg", "artist-2.jpg"],
    stamp: "VOICES / UNFILTERED",
  },
};
export function CulturePlatform({ children }: { children: ReactNode }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const active = params.get("look") === "culture";
  const [paused, setPaused] = useState(false);
  const chapter = chapters[pathname];
  useEffect(() => {
    if (!active) return;
    document.documentElement.dataset.look = "culture";
    const navigate = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;
      const url = new URL(anchor.href, location.href);
      if (
        url.origin !== location.origin ||
        url.pathname.startsWith("/design-lab") ||
        (url.pathname === location.pathname && url.hash)
      )
        return;
      if (!url.pathname.startsWith("/")) return;
      event.preventDefault();
      event.stopPropagation();
      if (url.pathname === "/") router.push("/design-lab/culture");
      else {
        url.searchParams.set("look", "culture");
        router.push(url.pathname + url.search + url.hash);
      }
    };
    document.addEventListener("click", navigate, true);
    return () => {
      document.removeEventListener("click", navigate, true);
      if (document.documentElement.dataset.look === "culture")
        document.documentElement.dataset.look = "electric";
    };
  }, [active, router]);
  if (!active) return children;
  return (
    <div
      className={`culture-platform culture-${pathname.split("/")[1]} ${paused ? "culture-paused" : ""}`}
    >
      {chapter && (
        <section className="culture-hero" aria-labelledby="culture-title">
          <div className="culture-eyeline">
            <span>● MUSIC / CULTURE / POSSIBILITY</span>
            <span>SOUTH AFRICA → EVERYWHERE</span>
          </div>
          <div className="culture-copy">
            <p className="culture-kicker">
              {chapter.number} / {chapter.label}
            </p>
            <h1 id="culture-title">
              {chapter.title}
              <br />
              <span>{chapter.accent}</span>
            </h1>
            <p className="culture-description">{chapter.description}</p>
            <a className="culture-action" href="#culture-workspace">
              {chapter.action}
              <ArrowDown size={18} />
            </a>
          </div>
          <div className="culture-art" aria-hidden="true">
            <div className="culture-poster-track">
              {[0, 1, 0, 1].map((n, i) => (
                <div className={`culture-poster poster-tone-${n}`} key={i}>
                  <img src={`/images/${chapter.images[n]}`} alt="" />
                  <span>{chapter.posters[n]}</span>
                  <small>SONIC EXCHANGE / {chapter.number}</small>
                </div>
              ))}
            </div>
            <div className="culture-seal">
              {chapter.stamp.split(" / ").map((s) => (
                <span key={s}>{s}</span>
              ))}
              <ArrowUpRight size={22} />
            </div>
          </div>
          <div className="culture-hero-footer">
            <span>INDEPENDENT BY DESIGN. LOUD BY NATURE.</span>
            <button
              onClick={() => setPaused((v) => !v)}
              aria-pressed={paused}
              aria-label={
                paused ? "Resume artwork motion" : "Pause artwork motion"
              }
            >
              {paused ? <Play size={12} /> : <Pause size={12} />} MOTION{" "}
              {paused ? "OFF" : "ON"}
            </button>
            <a href="#culture-workspace">
              SCROLL TO EXPLORE <ArrowDown size={12} />
            </a>
          </div>
        </section>
      )}
      {chapter && (
        <div className="culture-chapter-bar">
          <span>
            {chapter.number} / {chapter.label}
          </span>
          <span>
            MAKE YOUR NEXT MOVE <ArrowUpRight size={17} />
          </span>
        </div>
      )}
      <div id="culture-workspace" className="culture-content">
        {children}
      </div>
      <nav className="culture-next" aria-label="Explore the next chapter">
        <p>THERE’S MORE TO YOUR WORLD.</p>
        <Link href="/marketplace?look=culture">
          FIND YOUR SOUND.
          <ArrowUpRight />
        </Link>
        <Link href="/index?look=culture">
          MEET THE NEXT WAVE.
          <ArrowUpRight />
        </Link>
      </nav>
    </div>
  );
}
