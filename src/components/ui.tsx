"use client";
import {
  useEffect,
  useRef,
  useId,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  X,
  ArrowUpRight,
  AudioLines,
  ArrowRight,
  Search,
  ChevronRight,
  Check,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";
import { type Role } from "@/lib/data";
import { useDemo } from "./store";
export function tabKeyNavigation(event: KeyboardEvent<HTMLElement>) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  );
  const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
  if (index < 0) return;
  event.preventDefault();
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? buttons.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) %
          buttons.length;
  buttons[next]?.focus();
  buttons[next]?.click();
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "purple" | "amber";
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function PageIntro({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-intro">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>
          {title} {accent && <span className="lavender">{accent}</span>}
        </h1>
        <p className="intro-copy">{description}</p>
      </div>
      {children}
    </div>
  );
}
export function Waveform({ className = "" }: { className?: string }) {
  return (
    <div className={`waveform ${className}`} aria-hidden="true">
      {[
        32, 58, 84, 46, 112, 66, 94, 132, 83, 55, 98, 68, 118, 79, 42, 62, 36,
      ].map((n, i) => (
        <span key={i} style={{ height: n }} />
      ))}
    </div>
  );
}
export function SearchBox({
  value,
  onChange,
  placeholder = "Search artists, songs, genres or cities…",
  label = "Search artists",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <label className="search-box">
      <Search size={17} aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          aria-label={`Clear ${label.toLowerCase()}`}
          onClick={() => onChange("")}
        >
          <X size={15} />
        </button>
      )}
    </label>
  );
}
export function Empty({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <AudioLines size={30} />
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const node = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    node?.showModal();
    const cancel = (e: Event) => {
      e.preventDefault();
      close.current();
    };
    node?.addEventListener("cancel", cancel);
    return () => {
      node?.removeEventListener("cancel", cancel);
      node?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={heading}
      className="modal"
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-top">
        <h2 id={heading}>{title}</h2>
        <button
          className="icon-btn"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={21} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function DemoNote({ children }: { children?: ReactNode }) {
  return (
    <div className="demo-note">
      <span className="demo-dot" />
      <p>
        {children ??
          "South African artist references with simulated insights and transactions. No artist affiliation, live social feeds or real money movement."}
      </p>
    </div>
  );
}
export function RoleGate({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const { state, send } = useDemo();
  if (state.role === role) return children;
  return (
    <div className="role-gate">
      <span className="round-icon">
        <LockKeyhole size={25} />
      </span>
      <p className="eyebrow">YOUR WORKSPACE, YOUR PERSPECTIVE</p>
      <h2>Step into the {role} workspace.</h2>
      <p>
        Explore a fully interactive demo with sample data.
        <br />
        The role switch is a preview control; it is not a live account.
      </p>
      <button
        className="btn primary"
        onClick={() => send({ type: "role", role })}
      >
        Explore as {role}
        <ArrowRight size={17} />
      </button>
    </div>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="text-link">
      {children}
      <ArrowUpRight size={16} />
    </Link>
  );
}
export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: ReactNode;
}) {
  return (
    <div className="stat">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}
export function StatusSteps({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="status-steps">
      {steps.map((s, i) => (
        <li key={s} className={i <= current ? "done" : ""}>
          <span>{i < current ? <Check size={13} /> : i + 1}</span>
          {s}
          {i < steps.length - 1 && <ChevronRight size={13} />}
        </li>
      ))}
    </ol>
  );
}
export function MiniChart({ positive = true }: { positive?: boolean }) {
  return (
    <svg
      className={`mini-chart ${positive ? "" : "negative"}`}
      viewBox="0 0 100 30"
      aria-label={
        positive ? "Illustrative upward trend" : "Illustrative downward trend"
      }
      role="img"
    >
      <path
        d={
          positive
            ? "M1 24L13 21L20 24L30 14L40 18L48 12L56 16L65 6L75 10L85 3L99 5"
            : "M1 5L13 9L23 7L35 16L44 10L54 18L63 15L74 22L84 19L99 25"
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
