"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  AudioLines,
  ArrowRight,
  Headphones,
  History,
  ShieldCheck,
  Play,
  ArrowUpRight,
} from "lucide-react";
import { artists } from "@/lib/data";
import { useDemo } from "./store";
import { Badge, Waveform, SectionTitle, DemoNote, Empty } from "./ui";
import { ArtistProfile } from "./index-page";
export default function SonicNowPage() {
  const { state, send, notify } = useDemo();
  const [status, setStatus] = useState<
    "idle" | "requesting" | "listening" | "sample" | "result"
  >("idle");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      stream.current?.getTracks().forEach((t) => t.stop());
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  function stop() {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    if (timer.current) clearTimeout(timer.current);
    setStatus("idle");
  }
  async function listen() {
    setError("");
    setStatus("requesting");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "Microphone access requires a supported browser and a secure HTTPS connection. You can still try the sample journey.",
      );
      setStatus("idle");
      return;
    }
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = media;
      setStatus("listening");
      timer.current = setTimeout(() => {
        media.getTracks().forEach((t) => t.stop());
        stream.current = null;
        if (mounted.current) {
          setStatus("idle");
          setError(
            "Microphone check complete. Recognition is not configured; no audio was uploaded or stored. Try the sample identification below.",
          );
        }
      }, 8000);
    } catch (e) {
      if (!mounted.current) return;
      setStatus("idle");
      const name = e instanceof DOMException ? e.name : "";
      setError(
        name === "NotAllowedError"
          ? "Microphone permission was denied. Allow access in browser settings or try the sample journey."
          : name === "NotFoundError"
            ? "No microphone was found. Connect one or use the sample journey."
            : "Microphone access failed. Check your device settings or try the sample journey.",
      );
    }
  }
  function sample() {
    stop();
    setError("");
    setResult(null);
    setStatus("sample");
    timer.current = setTimeout(() => {
      if (mounted.current) {
        send({ type: "history", artistId: "amara" });
        setResult("amara");
        setStatus("result");
        notify("Sample identification saved to your listening history.");
      }
    }, 1200);
  }
  const found = artists.find((a) => a.id === result);
  return (
    <div className="content-wrap">
      <section className="sonic-hero">
        <div>
          <p className="eyebrow">EVERY SOUND HAS A STORY</p>
          <h1>
            SONIC <span className="lavender">NOW.</span>
          </h1>
          <p className="intro-copy">
            Hear something that stays with you?
            <br />
            Find the artist. Follow the sound. Discover what comes next.
          </p>
          <div className="button-row">
            <button
              className="btn primary"
              disabled={status === "requesting" || status === "sample"}
              onClick={status === "listening" ? stop : listen}
            >
              {status === "listening" ? (
                <MicOff size={17} />
              ) : (
                <Mic size={17} />
              )}{" "}
              {status === "requesting"
                ? "Requesting microphone…"
                : status === "listening"
                  ? "Stop microphone"
                  : "Check microphone"}
            </button>
            <button
              className="btn secondary"
              disabled={status === "sample" || status === "requesting"}
              onClick={sample}
            >
              <Play size={14} />
              {status === "sample"
                ? "Identifying sample…"
                : "Try sample identification"}
            </button>
          </div>
          <p
            className="safety-caption"
            style={{ marginTop: 18, maxWidth: 430 }}
          >
            Live music recognition is not configured. The microphone button
            checks permission and input only. Sample identification uses a
            predetermined fictional result.
          </p>
          {error && (
            <div className="form-error listen-error" role="alert">
              {error}
            </div>
          )}
        </div>
        <div className="listen-device">
          <Waveform />
          <div
            className={`listen-orb ${status === "listening" || status === "sample" ? "is-listening" : ""}`}
          >
            <AudioLines />
          </div>
          <p className="listening-status" role="status">
            {status === "listening"
              ? "Microphone active · permission check"
              : status === "requesting"
                ? "Waiting for permission…"
                : status === "sample"
                  ? "Playing the sample journey…"
                  : status === "result"
                    ? "A new discovery. A familiar feeling."
                    : "The next discovery starts with a sound."}
          </p>
          <Badge tone="purple">
            {status === "listening"
              ? "No audio stored or uploaded"
              : "Recognition demo · not a live service"}
          </Badge>
        </div>
      </section>
      {found && (
        <section className="panel" aria-label="Sample identification result">
          <div className="panel-heading">
            <h2>A match, by way of example.</h2>
            <Badge tone="purple">Simulated result</Badge>
          </div>
          <div className="history-row">
            <img
              src={found.image}
              alt="Editorial portrait for fictional artist Amara Sol"
            />
            <div>
              <strong>{found.track}</strong>
              <small>
                {found.name} · {found.genre} · fictional demo track
              </small>
            </div>
            <button
              className="btn primary small"
              onClick={() => setProfile(true)}
            >
              Meet the artist
              <ArrowUpRight size={14} />
            </button>
          </div>
          <p
            className="safety-caption"
            style={{ marginTop: 14, marginBottom: 0 }}
          >
            This result is predetermined and unrelated to microphone input. No
            confidence score or real recognition is implied.
          </p>
        </section>
      )}
      <div className="feature-grid">
        <div className="feature-item">
          <Headphones size={23} />
          <h3>From sound to discovery</h3>
          <p>A listening journey that puts the artist at the centre.</p>
        </div>
        <div className="feature-item">
          <History size={23} />
          <h3>Keep the songs that find you</h3>
          <p>Your sample discoveries, saved in this browser.</p>
        </div>
        <div className="feature-item">
          <ShieldCheck size={23} />
          <h3>Your microphone, your choice</h3>
          <p>Permission required. No recording, storage or upload.</p>
        </div>
      </div>
      <div className="workspace-grid">
        <section className="panel">
          <SectionTitle
            title="Your listening history"
            description="A little collection of moments worth returning to."
          />
          {state.history.length ? (
            <div>
              {state.history.map((h) => {
                const a = artists.find((a) => a.id === h.artistId)!;
                return (
                  <div className="history-row" key={h.id}>
                    <img src={a.image} alt="" />
                    <div>
                      <strong>{a.track}</strong>
                      <small>{a.name} · sample identification</small>
                    </div>
                    <time dateTime={h.date}>
                      {new Date(h.date).toLocaleString("en-ZA", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                    <Badge tone="purple">Demo</Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty
              title="Your next discovery is waiting."
              description="Try a sample identification to start your listening history."
            />
          )}
        </section>
        <aside className="callout">
          <AudioLines
            size={30}
            style={{ color: "#af87d0", marginBottom: 17 }}
          />
          <p className="eyebrow" style={{ marginTop: 10 }}>
            FOLLOW THE FREQUENCY
          </p>
          <h3>
            Go beyond
            <br />
            the moment.
          </h3>
          <p>
            Discover the independent artists creating the next wave of culture.
          </p>
          <Link className="btn primary" href="/index#the-index">
            Explore the INDEX
            <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
      <div style={{ marginTop: 25 }}>
        <DemoNote>
          Recognition provider, licensed audio catalogue and DSP links are not
          connected. Microphone access is optional and stops automatically after
          eight seconds or when leaving this page.
        </DemoNote>
      </div>
      {profile && (
        <ArtistProfile artist={artists[0]} onClose={() => setProfile(false)} />
      )}
    </div>
  );
}
