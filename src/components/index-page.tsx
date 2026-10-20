"use client";
import { tabKeyNavigation } from "./ui";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  AudioLines,
  ChartNoAxesCombined,
  Radio,
  TrendingUp,
  Bell,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Disc3,
} from "lucide-react";
import { artists, genres, compact, type Artist } from "@/lib/data";
import { rankArtists } from "@/lib/domain";
import { useDemo } from "./store";
import {
  Badge,
  SectionTitle,
  SearchBox,
  Waveform,
  Modal,
  DemoNote,
  MiniChart,
  Empty,
} from "./ui";
export function ArtistProfile({
  artist,
  onClose,
}: {
  artist: Artist;
  onClose: () => void;
}) {
  const { state, send, notify } = useDemo();
  return (
    <Modal title="Artist profile" onClose={onClose}>
      <div className="profile-cover">
        <img
          src={artist.image}
          alt="Editorial music portrait used for this fictional artist"
        />
        <Badge tone="purple">Fictional artist · demo profile</Badge>
      </div>
      <p className="eyebrow">
        {artist.genre} · {artist.city}
      </p>
      <h2 className="profile-name">{artist.name}</h2>
      <p>{artist.bio}</p>
      <div className="profile-stats">
        <div>
          <strong>{artist.score}</strong>
          <span>Demo index score</span>
        </div>
        <div>
          <strong>{compact(artist.audience)}</strong>
          <span>Demo audience</span>
        </div>
        <div>
          <strong className="positive">+{artist.change}%</strong>
          <span>7-day demo velocity</span>
        </div>
      </div>
      <div className="profile-track">
        <Disc3 size={28} />
        <div>
          <strong>{artist.track}</strong>
          <small>Featured demo track · audio not licensed</small>
        </div>
      </div>
      <div className="button-row">
        <button
          className="btn primary"
          onClick={() => {
            send({ type: "alert", id: artist.id });
            notify(
              state.alerts.includes(artist.id)
                ? "Artist alert removed."
                : "Artist alert saved locally. No email is sent.",
            );
          }}
        >
          <Bell size={16} />
          {state.alerts.includes(artist.id)
            ? "Remove alert"
            : "Follow the movement"}
        </button>
        <Link className="btn secondary" href={"/brands?artist=" + artist.id}>
          Explore collaboration
          <ArrowUpRight size={16} />
        </Link>
      </div>
      <DemoNote />
    </Modal>
  );
}
export default function IndexPage({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState("All genres");
  const [sort, setSort] = useState("score");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Artist | null>(null);
  const [tab, setTab] = useState("Artist rankings");
  const [period, setPeriod] = useState("7 days");
  const { state, send, notify } = useDemo();
  const matches = rankArtists(query, genre, sort);
  const pages = Math.max(1, Math.ceil(matches.length / 5));
  const visible = matches.slice((page - 1) * 5, page * 5);
  function filter(fn: () => void) {
    fn();
    setPage(1);
  }
  return (
    <>
      <section className="index-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-line" /> THE PULSE OF INDEPENDENT MUSIC
          </p>
          <h1>
            The culture moves.
            <br />
            Be <span className="lavender">ahead of it.</span>
          </h1>
          <p>
            Discover the artists shaping what comes next.
            <br />
            One connected world of music, insight and opportunity.
          </p>
          <div className="button-row">
            <a className="btn primary" href="#the-index">
              Explore the INDEX
              <ArrowRight size={17} />
            </a>
            <Link className="btn secondary" href="/sonic-now">
              <AudioLines size={17} />
              Find your frequency
            </Link>
          </div>
          <div className="hero-footnote">
            <span className="mini-avatars">
              <img src="/images/artist-1.jpg" alt="" />
              <img src="/images/artist-2.jpg" alt="" />
              <img src="/images/artist-3.jpg" alt="" />
            </span>
            <span>Independent voices. Shared possibilities.</span>
          </div>
        </div>
        <div className="hero-art">
          <Waveform />
          <img
            className="hero-person"
            src="/images/hero.webp"
            alt="Music listener in headphones, photographed in black and white"
          />
          <div className="hero-glow" />
          <div className="floating-caption">
            <div>
              <span>SONIC EXCHANGE</span>
              <strong>
                Music. Culture.
                <br />
                Connection.
              </strong>
            </div>
            <AudioLines size={34} />
          </div>
          <span className="vertical-caption">
            A NEW FREQUENCY FOR MUSIC — 2026
          </span>
        </div>
      </section>
      <section className="value-strip" aria-label="Explore SONIC EXCHANGE">
        <Link href="#the-index">
          <span className="round-icon">
            <ChartNoAxesCombined size={22} />
          </span>
          <div>
            <h3>See the movement</h3>
            <p>Explore cultural signals and artist momentum.</p>
          </div>
          <ArrowUpRight size={16} />
        </Link>
        <Link href="/artists">
          <span className="round-icon">
            <AudioLines size={22} />
          </span>
          <div>
            <h3>Build your independence</h3>
            <p>Your music, your rights, your next chapter.</p>
          </div>
          <ArrowUpRight size={16} />
        </Link>
        <Link href="/brands">
          <span className="round-icon">
            <Globe2 size={22} />
          </span>
          <div>
            <h3>Make the connection</h3>
            <p>Bring artists, brands and audiences together.</p>
          </div>
          <ArrowUpRight size={16} />
        </Link>
      </section>
      <div className="content-wrap index-content" id="the-index">
        <SectionTitle
          eyebrow="CULTURE IN FOCUS"
          title="The INDEX"
          description="Independent talent. Measurable momentum. A different kind of signal."
          action={
            <div className="period-select">
              <span className="demo-dot" />
              Demo snapshot
              <label>
                <span className="sr-only">Ranking period</span>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option>7 days</option>
                  <option>30 days</option>
                </select>
              </label>
            </div>
          }
        />
        <DemoNote>
          Illustrative {period.toLowerCase()} snapshot · Fictional artists and
          seeded data. Scores and charts are not live or independently verified.
        </DemoNote>
        <div className="index-grid">
          <section className="ranking-panel">
            <div
              className="tabs"
              role="tablist"
              onKeyDown={tabKeyNavigation}
              aria-label="Index view"
            >
              {["Artist rankings", "Genre velocity", "Radio chart"].map((t) => (
                <button
                  key={t}
                  role="tab"
                  tabIndex={tab === t ? 0 : -1}
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                >
                  {t === "Artist rankings" ? (
                    <ChartNoAxesCombined size={16} />
                  ) : t === "Genre velocity" ? (
                    <TrendingUp size={16} />
                  ) : (
                    <Radio size={16} />
                  )}{" "}
                  {t}
                </button>
              ))}
            </div>
            {tab === "Artist rankings" ? (
              <>
                <div className="table-toolbar">
                  <SearchBox
                    value={query}
                    onChange={(v) => filter(() => setQuery(v))}
                  />
                  <label>
                    <span className="sr-only">Filter by genre</span>
                    <select
                      aria-label="Filter by genre"
                      value={genre}
                      onChange={(e) => filter(() => setGenre(e.target.value))}
                    >
                      <option>All genres</option>
                      {genres.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="sr-only">Sort ranking</span>
                    <select
                      aria-label="Sort ranking"
                      value={sort}
                      onChange={(e) => filter(() => setSort(e.target.value))}
                    >
                      <option value="score">Index score</option>
                      <option value="velocity">Top movers</option>
                      <option value="audience">Audience</option>
                    </select>
                  </label>
                </div>
                <div className="table-scroll">
                  <table className="ranking-table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">ARTIST</th>
                        <th scope="col">GENRE</th>
                        <th scope="col">INDEX SCORE</th>
                        <th scope="col">
                          {period === "7 days" ? "7D" : "30D"} CHANGE*
                        </th>
                        <th scope="col">TREND</th>
                        <th scope="col">
                          <span className="sr-only">Profile</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((a, i) => (
                        <tr key={a.id}>
                          <td className="rank-number">
                            {(page - 1) * 5 + i + 1 < 10 ? "0" : ""}
                            {(page - 1) * 5 + i + 1}
                          </td>
                          <td>
                            <button
                              className="artist-cell"
                              onClick={() => setSelected(a)}
                            >
                              <img src={a.image} alt="" />
                              <span>
                                <strong>{a.name}</strong>
                                <small>{a.city}</small>
                              </span>
                            </button>
                          </td>
                          <td>
                            <span className="genre-pill">{a.genre}</span>
                          </td>
                          <td className="score">
                            {a.score.toFixed(1)}
                            <span className="score-track">
                              <i style={{ width: a.score + "%" }} />
                            </span>
                          </td>
                          <td>
                            <span
                              className={
                                a.change >= 0 ? "positive" : "negative-text"
                              }
                            >
                              {a.change >= 0 ? (
                                <ArrowUp size={12} />
                              ) : (
                                <ArrowDown size={12} />
                              )}{" "}
                              {Math.abs(a.change).toFixed(1)}%
                            </span>
                          </td>
                          <td>
                            <MiniChart positive={a.change >= 0} />
                          </td>
                          <td>
                            <button
                              className="table-arrow"
                              aria-label={`View ${a.name} profile`}
                              onClick={() => setSelected(a)}
                            >
                              <ArrowUpRight size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!matches.length && (
                  <Empty
                    title="No artists on this frequency"
                    description="Try another artist, genre or city."
                  >
                    <button
                      className="btn secondary"
                      onClick={() =>
                        filter(() => {
                          setQuery("");
                          setGenre("All genres");
                        })
                      }
                    >
                      Clear filters
                    </button>
                  </Empty>
                )}
                <div className="pagination">
                  <span>
                    Showing {matches.length ? (page - 1) * 5 + 1 : 0}–
                    {Math.min(page * 5, matches.length)} of {matches.length}{" "}
                    artists
                  </span>
                  <div>
                    <button
                      aria-label="Previous page"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <ChevronLeft size={15} />
                    </button>
                    {Array.from({ length: pages }, (_, i) => (
                      <button
                        key={i}
                        aria-label={`Page ${i + 1}`}
                        aria-current={page === i + 1 ? "page" : undefined}
                        className={page === i + 1 ? "active" : ""}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      aria-label="Next page"
                      disabled={page === pages}
                      onClick={() => setPage(page + 1)}
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </>
            ) : tab === "Genre velocity" ? (
              <div className="genre-velocity">
                <p className="muted">
                  Illustrative genre momentum · seeded {period.toLowerCase()}{" "}
                  snapshot
                </p>
                {genres.map((g, i) => (
                  <div className="genre-row" key={g}>
                    <strong>{g}</strong>
                    <div>
                      <span style={{ width: 92 - i * 10 + "%" }} />
                    </div>
                    <span className="positive">
                      +{(24.2 - i * 2.7).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="radio-list">
                <p className="muted">
                  Illustrative radio rotation · no station feeds connected
                </p>
                {artists.slice(0, 5).map((a, i) => (
                  <button key={a.id} onClick={() => setSelected(a)}>
                    <span className="rank-number">0{i + 1}</span>
                    <img src={a.image} alt="" />
                    <span>
                      <strong>{a.track}</strong>
                      <small>
                        {a.name} · {a.genre}
                      </small>
                    </span>
                    <Radio size={18} />
                  </button>
                ))}
              </div>
            )}
          </section>
          <aside className="index-sidebar">
            <div className="gainer-card">
              <div className="card-label">
                <span>
                  <TrendingUp size={15} /> THE ONE TO WATCH
                </span>
                <Badge tone="purple">Demo</Badge>
              </div>
              <img
                src="/images/artist-4.jpg"
                alt="Editorial portrait for fictional artist Nalu"
              />
              <div className="gainer-content">
                <div>
                  <span className="eyebrow">THIS WEEK’S TOP MOVER</span>
                  <h3>Nalu</h3>
                  <p>Afro House · Durban</p>
                </div>
                <strong>
                  +24.2%<small>demo velocity</small>
                </strong>
              </div>
              <button
                className="btn white full"
                onClick={() => setSelected(artists[3])}
              >
                Meet the artist
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="alert-card">
              <span className="round-icon">
                <Bell size={22} />
              </span>
              <h3>Catch the next wave.</h3>
              <p>Keep an eye on the artists moving culture forward.</p>
              <button
                className="btn secondary full"
                onClick={() => {
                  send({ type: "alert", id: "nalu" });
                  notify(
                    state.alerts.includes("nalu")
                      ? "Nalu alert removed."
                      : "Nalu alert saved in this browser.",
                  );
                }}
              >
                {state.alerts.includes("nalu")
                  ? "Following Nalu"
                  : "Set a gainer alert"}
                <ArrowRight size={16} />
              </button>
              <small>
                Saved locally · {state.alerts.length} artist alert
                {state.alerts.length !== 1 ? "s" : ""}
              </small>
            </div>
          </aside>
        </div>
        <p className="table-footnote">
          *Period views use the same seeded snapshot; no live market feed. Index
          scores illustrate the product experience.
        </p>
        <section className="discovery-banner">
          <div>
            <p className="eyebrow">FROM DISCOVERY TO POSSIBILITY</p>
            <h2>
              Good music deserves
              <br />a bigger world.
            </h2>
            <p>Meet the people behind the sound. Build something together.</p>
            <Link className="btn primary" href="/artists">
              Find your next chapter
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="vinyl-composition">
            <div className="vinyl" />
            <img src="/images/artist-1.jpg" alt="Monochrome music editorial" />
            <span>
              INDEPENDENT
              <br />
              BY DESIGN.
            </span>
          </div>
        </section>
      </div>
      {selected && (
        <ArtistProfile artist={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
