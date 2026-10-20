"use client";
import { useEffect, useRef, useState } from "react";
import type { Artist } from "@/lib/data";

/** A failed remote photo falls back to that artist's own editorial artwork. */
export function ArtistImage({
  artist,
  decorative = false,
}: {
  artist: Artist;
  decorative?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const loaded = useRef(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!loaded.current) setFailed(true);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, []);
  const fallback = `/images/artists/${artist.id}.svg`;
  return (
    <img
      src={failed ? fallback : artist.image}
      alt={
        decorative
          ? ""
          : `${artist.name} · ${artist.imageSource && !failed ? "artist photograph" : "editorial artwork"}`
      }
      onLoad={() => {
        loaded.current = true;
      }}
      referrerPolicy="no-referrer"
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
