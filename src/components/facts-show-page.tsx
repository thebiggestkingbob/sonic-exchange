"use client";
import { useState } from "react";
import { ArrowRight, Play, ThumbsUp, MessageCircle, Mic2 } from "lucide-react";
import { episodes, artists, compact } from "@/lib/data";
import { useDemo } from "./store";
import { PageIntro, DemoNote, SectionTitle, Badge, Empty } from "./ui";
export default function FactsShowPage() {
  const { state, send, notify } = useDemo();
  const [active, setActive] = useState(episodes[0]);
  const [question, setQuestion] = useState("");
  return (
    <div className="content-wrap">
      <PageIntro
        eyebrow="THE CONVERSATION BEHIND THE CULTURE"
        title="Less noise."
        accent="More facts."
        description="Honest conversations about music, ownership and making a living. The people behind the sound, in their own words."
      />
      <DemoNote>
        Editorial prototype · Fictional episodes, guests and earnings. The
        player uses an original sample tone, not an actual interview. No
        earnings are independently verified.
      </DemoNote>
      <section className="episode-feature" id="episode">
        <div className="episode-image">
          <img
            src={active.image}
            alt="Monochrome music editorial illustrating this fictional episode"
          />
          <Badge tone="purple">FACTS SHOW · EPISODE {active.id}</Badge>
        </div>
        <div className="episode-content">
          <p className="eyebrow">
            {active.category.toUpperCase()} · EDITORIAL DEMO
          </p>
          <h2>{active.title}</h2>
          <p>{active.description}</p>
          <div className="audio-tag">
            <Mic2 size={14} />
            With {active.guest} · planned {active.duration} minutes
          </div>
          <audio
            key={active.id}
            controls
            preload="none"
            aria-label="Original sample tone player; episode audio not available"
          >
            <source src="/audio/sonic-demo-tone.wav" type="audio/wav" />
            Your browser does not support audio playback.
          </audio>
          <small>
            18-second original demonstration tone. Interview audio is not
            available.
          </small>
          <div className="button-row" style={{ marginTop: 20 }}>
            <button
              className={`btn ${state.votes.includes(active.id) ? "purple" : "secondary"} small`}
              aria-pressed={state.votes.includes(active.id)}
              onClick={() => send({ type: "vote", id: active.id })}
            >
              <ThumbsUp size={14} />
              {state.votes.includes(active.id)
                ? "You’re interested"
                : "I’d listen to this"}
            </button>
            <a className="text-link" href="#participate">
              Join the conversation
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
      <SectionTitle
        eyebrow="THE SERIES"
        title="Stories worth making space for."
        description="Explore the planned editorial direction."
      />
      <div className="episode-cards">
        {episodes.map((e) => (
          <button
            className="episode-card"
            key={e.id}
            aria-pressed={active.id === e.id}
            onClick={() => {
              setActive(e);
              document
                .getElementById("episode")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <img src={e.image} alt="" />
            <div>
              <span className="eyebrow">
                EPISODE {e.id} · {e.category.toUpperCase()}
              </span>
              <h3>{e.title}</h3>
              <p>With {e.guest}</p>
              <span className="audio-tag">
                <Play size={12} />
                View editorial preview
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="split-section">
        <section className="panel">
          <div className="panel-heading">
            <h3>Behind the fan response.</h3>
            <Badge tone="amber">Simulated fan activity</Badge>
          </div>
          <p className="muted">
            Real South African songs with illustrative fan likes. These are demo
            signals, not live social counts or claims about artist earnings.
          </p>
          {artists.slice(0, 4).map((a, i) => (
            <div className="numbered-row" key={a.id}>
              <strong>0{i + 1}</strong>
              <div>
                <p>{a.name}</p>
                <small>{a.track} · simulated likes</small>
              </div>
              <strong>{compact(a.songs[0].likes)}</strong>
            </div>
          ))}
          <p className="safety-caption" style={{ marginTop: 17 }}>
            A live fan leaderboard requires platform data connections and clear
            reporting periods. No social feeds are connected in this prototype.
          </p>
        </section>
        <section className="panel" id="participate">
          <p className="eyebrow">A SEAT AT THE TABLE</p>
          <h3>Your questions belong here.</h3>
          <p className="muted">
            What would you ask {active.guest}? Save a question for episode{" "}
            {active.id}.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                send({ type: "question", episode: active.id, text: question })
              ) {
                setQuestion("");
                notify(
                  "Question saved in this browser. It has not been submitted to a host.",
                );
              }
            }}
          >
            <label className="field">
              <span className="sr-only">Your question</span>
              <textarea
                aria-label="Your question"
                required
                minLength={10}
                maxLength={500}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="The conversation I’d love to hear…"
              />
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 15,
              }}
            >
              <small style={{ color: "#755d85" }}>
                {question.length}/500 · 10 characters minimum
              </small>
              <button className="btn primary small" type="submit">
                Save question
                <MessageCircle size={14} />
              </button>
            </div>
          </form>
          <p className="safety-caption" style={{ margin: "15px 0 0" }}>
            Questions and episode interest are local demo participation. Nothing
            is sent to a production team.
          </p>
        </section>
      </div>
      <section className="panel" style={{ marginTop: 25 }}>
        <SectionTitle
          title="Your side of the conversation."
          description="Questions saved in this browser."
        />
        {state.questions.length ? (
          state.questions.map((q) => (
            <article key={q.id} className="question-card">
              <p>{q.text}</p>
              <small>Episode {q.episode} · local demo question</small>
            </article>
          ))
        ) : (
          <Empty
            title="Start a conversation."
            description="Your saved questions will appear here."
          />
        )}
      </section>
    </div>
  );
}
