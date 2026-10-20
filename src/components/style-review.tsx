"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const looks = [
  ["original", "Current"],
  ["midnight", "Midnight violet"],
  ["studio", "Warm aubergine"],
  ["ocean", "Ocean blue"],
] as const;
type Look = (typeof looks)[number][0];
function isLook(value: string | null): value is Look {
  return looks.some(([id]) => id === value);
}

/** Review-only overlay: opened explicitly with ?look=..., never part of the product navigation. */
export function StyleReview() {
  const params = useSearchParams();
  const requested = params.get("look");
  const [active, setActive] = useState<Look>("original");
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!isLook(requested)) return;
    document.documentElement.dataset.look = requested;
    queueMicrotask(() => {
      setActive(requested);
      setVisible(true);
    });
  }, [requested]);
  if (!visible) return null;
  return (
    <aside className="style-review" aria-label="Visual style comparison">
      <span>COLOUR REVIEW</span>
      <div role="group" aria-label="Colour options">
        {looks.map(([id, name]) => (
          <button
            key={id}
            aria-pressed={active === id}
            onClick={() => {
              document.documentElement.dataset.look = id;
              setActive(id);
              const url = new URL(window.location.href);
              url.searchParams.set("look", id);
              window.history.replaceState(null, "", url);
            }}
          >
            <i className={`look-swatch ${id}`} aria-hidden="true" />
            {name}
          </button>
        ))}
      </div>
      <button
        aria-label="Close colour review"
        onClick={() => {
          document.documentElement.dataset.look = "original";
          setActive("original");
          setVisible(false);
          const url = new URL(window.location.href);
          url.searchParams.delete("look");
          window.history.replaceState(null, "", url);
        }}
      >
        ×
      </button>
    </aside>
  );
}
