"use client";
import { tabKeyNavigation } from "./ui";
import { useState } from "react";
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  Users,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { artists, venues, money } from "@/lib/data";
import { pullEstimate } from "@/lib/domain";
import { useDemo } from "./store";
import {
  PageIntro,
  RoleGate,
  DemoNote,
  SearchBox,
  SectionTitle,
  Stat,
  Badge,
  Empty,
  Modal,
} from "./ui";
import { Agreements } from "./agreements";
export default function VenuesPage() {
  const { state, send, notify } = useDemo();
  const [tab, setTab] = useState("Explore venues");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All cities");
  const [artistId, setArtistId] = useState("amara");
  const [capacity, setCapacity] = useState(350);
  const [booking, setBooking] = useState<(typeof venues)[number] | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const matches = venues.filter(
    (v) =>
      `${v.name} ${v.city}`.toLowerCase().includes(query.toLowerCase()) &&
      (city === "All cities" || city === v.city),
  );
  const estimate = pullEstimate(artistId, capacity);
  return (
    <div className="content-wrap">
      <PageIntro
        eyebrow="THE VENUE PORTAL"
        title="A room."
        accent="A world of possibility."
        description="Bring independent music closer. Explore venues, understand the audience and build the next live connection."
      />
      <DemoNote />
      <RoleGate role="venue">
        <div className="stat-grid three">
          <Stat
            label="Venue demo balance"
            value={money(state.venueWallet)}
            detail="Simulated booking funds"
          />
          <Stat
            label="Booking requests"
            value={String(
              state.deals.filter((d) => d.kind === "booking").length,
            ).padStart(2, "0")}
            detail="Created in this browser"
          />
          <Stat
            label="Compliance status"
            value="Unverified"
            detail="No licensing bodies connected"
          />
        </div>
        <div
          className="tabs workspace-tabs"
          role="tablist"
          onKeyDown={tabKeyNavigation}
          aria-label="Venue workspace"
        >
          {["Explore venues", "Bookings", "Compliance"].map((t) => (
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
        {tab === "Explore venues" && (
          <div className="workspace-grid">
            <section>
              <SectionTitle
                title="Find your kind of room."
                description="Fictional venues. Real room for imagination."
              />
              <div className="filter-row">
                <SearchBox
                  label="Search venues"
                  placeholder="Search venues or cities…"
                  value={query}
                  onChange={setQuery}
                />
                <select
                  aria-label="Venue city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option>All cities</option>
                  {venues.map((v) => (
                    <option key={v.id}>{v.city}</option>
                  ))}
                </select>
              </div>
              {matches.length ? (
                <div className="stack">
                  {matches.map((v) => (
                    <article key={v.id} className="discovery-card">
                      <div className="card-image" style={{ height: 165 }}>
                        <img
                          src={v.image}
                          alt="Atmospheric editorial venue photograph"
                        />
                        <Badge tone="purple">Fictional venue</Badge>
                      </div>
                      <div className="card-body">
                        <h3>{v.name}</h3>
                        <p>{v.style}</p>
                        <div className="card-data">
                          <span>
                            <MapPin size={12} /> {v.city}
                          </span>
                          <span>
                            <Users size={12} /> {v.capacity} capacity
                          </span>
                          <Badge tone="amber">Compliance unverified</Badge>
                        </div>
                        <button
                          className="btn primary"
                          onClick={() => {
                            setBooking(v);
                            setTitle("");
                            setDate("");
                            setAmount("");
                          }}
                        >
                          Request a demo booking
                          <Plus size={15} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <Empty
                  title="No rooms on this frequency."
                  description="Try another city or clear your search."
                >
                  <button
                    className="btn secondary"
                    onClick={() => {
                      setQuery("");
                      setCity("All cities");
                    }}
                  >
                    Clear filters
                  </button>
                </Empty>
              )}
            </section>
            <aside className="stack">
              <section className="subtle-card">
                <p className="eyebrow">THE PULL PREDICTOR</p>
                <h3>Imagine the room.</h3>
                <p>
                  A simple illustration of audience potential. No ticketing,
                  location or live audience data is used.
                </p>
                <label className="field">
                  Artist
                  <select
                    value={artistId}
                    onChange={(e) => setArtistId(e.target.value)}
                  >
                    {artists.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Room capacity · {capacity}
                  <input
                    className="range-input"
                    aria-label="Room capacity"
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                  />
                </label>
                <div className="venue-predict">
                  <span className="micro-label">ILLUSTRATIVE ATTENDANCE</span>
                  <div className="predict-count">
                    {estimate}{" "}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 400,
                        letterSpacing: 0,
                      }}
                    >
                      of {capacity}
                    </span>
                  </div>
                  <div className="progress-track">
                    <span
                      style={{ width: (estimate / capacity) * 100 + "%" }}
                    />
                  </div>
                  <p>
                    Heuristic: 0.18% of fictional audience, capped by capacity.
                    Not a forecast or booking guarantee.
                  </p>
                </div>
              </section>
              <div className="callout">
                <CalendarDays
                  size={25}
                  style={{ color: "#a179bd", marginBottom: 15 }}
                />
                <h3>A clear path to the stage.</h3>
                <p>
                  Request a booking, explore artist acceptance and walk through
                  simulated booking escrow.
                </p>
                <button
                  className="btn secondary small"
                  onClick={() => setTab("Bookings")}
                >
                  Your bookings
                  <ArrowRight size={14} />
                </button>
              </div>
            </aside>
          </div>
        )}
        {tab === "Bookings" && (
          <>
            <SectionTitle
              title="The next show starts here."
              description="Bookings move from request to artist acceptance, demo funding and simulated settlement."
            />
            <div className="agreements-explainer" style={{ marginBottom: 22 }}>
              Amara Sol is the active demo artist. Request her booking, switch
              to Artist to accept, then return to Venue to fund and complete the
              simulation. Dates do not reserve a real venue.
            </div>
            <Agreements kind="booking" />
          </>
        )}
        {tab === "Compliance" && (
          <div className="workspace-grid">
            <section className="panel">
              <ShieldCheck size={30} style={{ color: "#ab83c4" }} />
              <h2 style={{ marginTop: 20 }}>
                The right foundations
                <br />
                for a live connection.
              </h2>
              <p className="muted">
                This preview does not verify public performance licences, safety
                compliance or venue identity. The checklist below shows the
                intended workflow.
              </p>
              <div className="integration-list">
                {[
                  "Venue identity",
                  "Public performance licensing",
                  "Occupancy & safety",
                  "Event insurance",
                  "Artist agreement",
                ].map((x) => (
                  <div key={x}>
                    <div>
                      <strong>{x}</strong>
                      <small>Evidence and independent review required</small>
                    </div>
                    <Badge tone="amber">Unverified</Badge>
                  </div>
                ))}
              </div>
            </section>
            <div className="callout">
              <h3>Confidence needs evidence.</h3>
              <p>
                Compliance providers and document review are not connected. Demo
                bookings do not establish legal permission to hold a
                performance.
              </p>
              <Badge tone="purple">Simulation only</Badge>
            </div>
          </div>
        )}
      </RoleGate>
      {booking && (
        <Modal
          title={`A night at ${booking.name}`}
          onClose={() => setBooking(null)}
        >
          <Badge tone="purple">Simulated booking request</Badge>
          <p style={{ marginTop: 16 }}>
            No real dates are reserved and no artist is contacted.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                send({
                  type: "offer",
                  artistId,
                  title,
                  amount: Math.round(Number(amount) * 100),
                  kind: "booking",
                  date,
                  venueId: booking.id,
                })
              ) {
                setBooking(null);
                setTab("Bookings");
                notify(
                  "Demo booking requested. Switch to Artist to accept Amara Sol’s request.",
                );
              }
            }}
          >
            <label className="field">
              Show name
              <input
                required
                minLength={3}
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="An evening of independent voices"
              />
            </label>
            <div className="form-grid">
              <label className="field">
                Artist
                <select
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                >
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Show date
                <input
                  required
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
            </div>
            <label className="field">
              Artist fee (ZAR)
              <input
                required
                type="number"
                min="1"
                step="0.01"
                max="1000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5000.00"
              />
            </label>
            {artistId !== "amara" && (
              <p className="safety-caption">
                Only Amara Sol has an active acceptance workspace in this
                prototype.
              </p>
            )}
            <div className="button-row">
              <button
                type="button"
                className="btn secondary"
                onClick={() => setBooking(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Create demo request
                <ArrowRight size={15} />
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
