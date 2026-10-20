"use client";
import { tabKeyNavigation } from "./ui";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Wallet,
  Download,
  Disc3,
  CheckCircle2,
  Music2,
} from "lucide-react";
import { money } from "@/lib/data";
import { csvCell } from "@/lib/csv";
import { useDemo } from "./store";
import {
  PageIntro,
  RoleGate,
  DemoNote,
  Stat,
  SectionTitle,
  Badge,
  Empty,
  Modal,
} from "./ui";
import { Agreements } from "./agreements";
const tabs = [
  "Overview",
  "Wallet",
  "Releases",
  "Deals",
  "Royalties",
  "Distribution",
  "Ledger",
  "Opportunities",
  "Settings",
];
export function Ledger() {
  const { state } = useDemo();
  function download() {
    const csv = [
      ["Date", "Description", "Amount (ZAR cents)", "Balance (ZAR cents)"],
      ...state.ledger.map((e) => [e.date, e.description, e.amount, e.balance]),
    ]
      .map((row) => row.map(csvCell).join(","))
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "sonic-demo-ledger.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section className="panel">
      <SectionTitle
        title="Every movement, in view."
        description="An append-only record of this browser’s simulated wallet activity."
        action={
          <button className="download-link" onClick={download}>
            <Download size={15} />
            Export CSV
          </button>
        }
      />
      <div className="table-scroll">
        <table className="table-basic">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {state.ledger.map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.date).toLocaleDateString("en-ZA")}</td>
                <td>{e.description}</td>
                <td className="money">
                  {e.amount > 0 ? "+" : ""}
                  {money(e.amount)}
                </td>
                <td className="money">{money(e.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="safety-caption" style={{ margin: "18px 0 0" }}>
        All entries are simulated. This local ledger is not a financial
        statement, audited record or immutable blockchain.
      </p>
    </section>
  );
}
function RoyaltyChart() {
  return (
    <>
      <svg
        className="metric-chart"
        viewBox="0 0 700 185"
        role="img"
        aria-label="Illustrative royalty trend, not live earnings"
      >
        <defs>
          <linearGradient id="royalty-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d7b8ff" stopOpacity=".4" />
            <stop offset="100%" stopColor="#d7b8ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[35, 80, 125, 170].map((y) => (
          <line className="grid-line" key={y} x1="0" y1={y} x2="700" y2={y} />
        ))}
        <path
          d="M0 144L50 135L100 145L150 115L200 123L250 92L300 110L350 65L400 85L450 58L500 68L550 34L600 45L650 16L700 26L700 185L0 185Z"
          fill="url(#royalty-area)"
        />
        <path
          className="trend"
          d="M0 144L50 135L100 145L150 115L200 123L250 92L300 110L350 65L400 85L450 58L500 68L550 34L600 45L650 16L700 26"
        />
      </svg>
      <div className="chart-labels">
        {["MAY", "JUN", "JUL", "AUG", "SEP", "OCT"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <p className="chart-tooltip" style={{ marginTop: 14 }}>
        Illustrative shape only · no DSP earnings feeds connected
      </p>
    </>
  );
}
function Settings() {
  const { state, send, notify } = useDemo();
  const [form, setForm] = useState(state.preferences);
  return (
    <section className="panel">
      <SectionTitle
        title="Make this space yours."
        description="Demo preferences are stored in this browser only."
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (send({ type: "preferences", preferences: form }))
            notify("Demo preferences saved. No email is sent.");
        }}
      >
        <div className="form-grid">
          <label className="field">
            Display name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="field">
            Contact email
            <input
              type="email"
              value={form.email}
              placeholder="you@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
        </div>
        <label className="check-field">
          <input
            type="checkbox"
            checked={form.notify}
            onChange={(e) => setForm({ ...form, notify: e.target.checked })}
          />
          Save my notification preference (simulation; messages are not sent)
        </label>
        <div className="settings-message">
          Account authentication, bank details, identity verification and
          notification delivery require live integrations. Do not enter
          sensitive personal or financial information.
        </div>
        <div className="save-bar">
          <button className="btn primary" type="submit">
            Save preferences
          </button>
        </div>
      </form>
    </section>
  );
}
export default function ArtistsPage() {
  const { state, send, notify } = useDemo();
  const [tab, setTab] = useState("Overview");
  const [payout, setPayout] = useState(false);
  const [amount, setAmount] = useState("");
  const ownDeals = state.deals.filter((d) => d.artistId === "kabza");
  const earned = state.ledger
    .filter((e) => e.amount > 0 && e.id !== "opening")
    .reduce((n, e) => n + e.amount, 0);
  return (
    <div className="content-wrap">
      <PageIntro
        eyebrow="THE ARTIST TERMINAL"
        title="Your music."
        accent="Your next move."
        description="A clearer picture of your music, your rights and the possibilities ahead."
      />
      <DemoNote />
      <RoleGate role="artist">
        <div
          className="tabs workspace-tabs"
          role="tablist"
          onKeyDown={tabKeyNavigation}
          aria-label="Artist workspace"
        >
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              tabIndex={tab === t ? 0 : -1}
              aria-selected={tab === t}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "Overview" && (
          <>
            <div className="section-heading">
              <div>
                <p className="eyebrow">WELCOME BACK</p>
                <h2>{state.preferences.name}.</h2>
                <p className="muted">Let’s build the next chapter.</p>
              </div>
              <Link className="btn primary" href="/distribution">
                <Plus size={16} />
                Create a release
              </Link>
            </div>
            <div className="stat-grid">
              <Stat
                label="Available demo balance"
                value={money(state.wallet)}
                detail="Simulated funds only"
              />
              <Stat
                label="Your releases"
                value={String(state.releases.length).padStart(2, "0")}
                detail="Created in this browser"
              />
              <Stat
                label="Active connections"
                value={String(
                  ownDeals.filter(
                    (d) => !["completed", "cancelled"].includes(d.status),
                  ).length,
                ).padStart(2, "0")}
                detail="Demo offers & bookings"
              />
              <Stat
                label="Settled this demo"
                value={money(earned)}
                detail="Completed simulated agreements"
              />
            </div>
            <div className="workspace-grid">
              <div className="stack">
                <section className="panel">
                  <div className="panel-heading">
                    <h3>The shape of possibility</h3>
                    <Badge tone="purple">Illustrative</Badge>
                  </div>
                  <RoyaltyChart />
                </section>
                <section className="panel">
                  <SectionTitle
                    title="Your next connections"
                    action={
                      <button
                        className="text-link"
                        onClick={() => setTab("Deals")}
                      >
                        View all
                        <ArrowUpRight size={15} />
                      </button>
                    }
                  />
                  <Agreements artistOnly />
                </section>
              </div>
              <aside className="stack">
                <div className="callout">
                  <p className="eyebrow">OWN YOUR NEXT CHAPTER</p>
                  <h3>
                    A new release
                    <br />
                    starts with you.
                  </h3>
                  <p>
                    Bring the metadata, master and artwork together in one
                    release workspace.
                  </p>
                  <Link className="btn primary small" href="/distribution">
                    Open release manager
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <section className="panel">
                  <h3>Workspace checklist</h3>
                  <div className="row-list">
                    <div>
                      <div>
                        <strong>Make it personal</strong>
                        <small>Save your demo profile</small>
                      </div>
                      <button
                        className="icon-btn"
                        aria-label="Open settings"
                        onClick={() => setTab("Settings")}
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                    <div>
                      <div>
                        <strong>Know your rights</strong>
                        <small>Review rights before delivery</small>
                      </div>
                      <Link
                        href="/distribution"
                        aria-label="Open rights and distribution"
                      >
                        <CheckCircle2 size={18} style={{ color: "#b18ecf" }} />
                      </Link>
                    </div>
                    <div>
                      <div>
                        <strong>Follow the money</strong>
                        <small>Explore the transparency ledger</small>
                      </div>
                      <button
                        className="icon-btn"
                        aria-label="Open ledger"
                        onClick={() => setTab("Ledger")}
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}
        {tab === "Wallet" && (
          <>
            <div className="stat-grid three">
              <Stat label="Available demo funds" value={money(state.wallet)} />
              <Stat
                label="Settled simulated agreements"
                value={money(earned)}
              />
              <Stat
                label="Payouts requested"
                value={String(state.payouts.length)}
              />
            </div>
            <section className="panel">
              <div className="panel-heading">
                <h3>Your balance. Your perspective.</h3>
                <Wallet size={23} style={{ color: "#ad85ce" }} />
              </div>
              <p className="muted">
                Request a payout from the simulated balance. The amount is
                deducted and recorded locally; no bank or payment provider is
                contacted.
              </p>
              <button className="btn primary" onClick={() => setPayout(true)}>
                Request demo payout
                <ArrowUpRight size={16} />
              </button>
              {state.payouts.length > 0 && (
                <div className="row-list" style={{ marginTop: 25 }}>
                  {state.payouts.map((p) => (
                    <div key={p.id}>
                      <strong className="money">{money(p.amount)}</strong>
                      <Badge tone="purple">Simulated request</Badge>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <div style={{ marginTop: 24 }}>
              <Ledger />
            </div>
          </>
        )}
        {tab === "Releases" && (
          <section className="panel">
            <SectionTitle
              title="Your catalogue, taking shape."
              action={
                <Link className="btn primary small" href="/distribution">
                  <Plus size={15} />
                  New release
                </Link>
              }
            />
            {state.releases.length ? (
              <div className="row-list">
                {state.releases.map((r) => (
                  <div key={r.id}>
                    <span className="round-icon">
                      <Disc3 size={22} />
                    </span>
                    <div className="list-copy">
                      <strong>{r.title}</strong>
                      <small>
                        {r.genre} · {r.date || "Date not set"}
                      </small>
                    </div>
                    <Badge tone="purple">{r.status} · demo</Badge>
                    <Link href="/distribution" aria-label={`Manage ${r.title}`}>
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                title="A blank page. A new sound."
                description="Create your first demo release in the release manager."
              >
                <Link className="btn secondary" href="/distribution">
                  Create a release
                  <ArrowRight size={16} />
                </Link>
              </Empty>
            )}
          </section>
        )}
        {tab === "Deals" && (
          <>
            <SectionTitle
              title="Connections with a clear next step."
              description="Accept offers, follow escrow states and see settlements in your ledger."
            />
            <Agreements artistOnly />
          </>
        )}
        {tab === "Royalties" && (
          <>
            <div className="stat-grid three">
              <Stat
                label="Opening demo royalty balance"
                value={money(1245000)}
                detail="Seeded, fictional amount"
              />
              <Stat
                label="New demo settlements"
                value={money(earned)}
                detail="From completed agreements"
              />
              <Stat
                label="Live royalty statements"
                value="Not connected"
                detail="DSP and collecting society feeds required"
              />
            </div>
            <section className="panel">
              <SectionTitle
                title="The full picture starts with the source."
                description="Royalties will be attributed to tracks, rights holders and statements once a provider is connected."
              />
              <RoyaltyChart />
              <p className="safety-caption">
                Graph is decorative and illustrative; it does not represent the
                transaction ledger. Actual demo movements are in the Ledger tab.
              </p>
            </section>
          </>
        )}
        {tab === "Distribution" && (
          <section className="panel">
            <span className="round-icon">
              <Music2 size={25} />
            </span>
            <h2 style={{ marginTop: 20 }}>From your studio to the world.</h2>
            <p className="muted">
              Create a draft, validate rights and metadata, and walk through a
              simulated DSP delivery. No music is sent to streaming platforms.
            </p>
            <Link className="btn primary" href="/distribution">
              Open distribution
              <ArrowRight size={16} />
            </Link>
          </section>
        )}
        {tab === "Ledger" && <Ledger />}
        {tab === "Opportunities" && (
          <div className="workspace-grid">
            <section className="panel">
              <SectionTitle
                title="Open to possibility."
                description="Illustrative opportunities. No live applications or external submissions."
              />
              <div className="row-list">
                <div>
                  <div>
                    <strong>Independent voices · short film</strong>
                    <small>Sync licensing · brand demo</small>
                  </div>
                  <button
                    className="btn secondary small"
                    onClick={() => setTab("Deals")}
                  >
                    View offer
                    <ArrowUpRight size={13} />
                  </button>
                </div>
                <div>
                  <div>
                    <strong>A room for your next show</strong>
                    <small>Live booking · venue demo</small>
                  </div>
                  <Link className="btn secondary small" href="/venues">
                    Explore venues
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
                <div>
                  <div>
                    <strong>The story behind the sound</strong>
                    <small>Editorial participation · Facts Show</small>
                  </div>
                  <Link className="btn secondary small" href="/facts-show">
                    Join in
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </section>
            <div className="callout">
              <h3>A clearer connection.</h3>
              <p>
                In the demo, switch roles to explore how brands create offers
                and venues request bookings. Return to the Artist role to accept
                your offers.
              </p>
            </div>
          </div>
        )}
        {tab === "Settings" && <Settings />}
      </RoleGate>
      {payout && (
        <Modal
          title="Request a simulated payout"
          onClose={() => setPayout(false)}
        >
          <p>
            Available demo balance: <strong>{money(state.wallet)}</strong>. This
            records a request and deducts demo funds. No real payment occurs.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                send({
                  type: "payout",
                  amount: Math.round(Number(amount) * 100),
                })
              ) {
                setPayout(false);
                setAmount("");
                notify(
                  "Simulated payout request recorded. No bank transfer was made.",
                );
              }
            }}
          >
            <label className="field">
              Amount (ZAR)
              <input
                type="number"
                min="0.01"
                step="0.01"
                max={state.wallet / 100}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500.00"
              />
            </label>
            <div className="button-row">
              <button
                type="button"
                className="btn secondary"
                onClick={() => setPayout(false)}
              >
                Cancel
              </button>
              <button className="btn primary" type="submit">
                Confirm demo payout
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
