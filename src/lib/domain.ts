import { artists, genres, venues, episodes, type Role } from "./data";
export type DealStatus =
  | "offered"
  | "accepted"
  | "funded"
  | "completed"
  | "cancelled";
export type Deal = {
  id: string;
  artistId: string;
  title: string;
  amount: number;
  status: DealStatus;
  kind: "license" | "booking";
  date?: string;
  venueId?: string;
};
export type Release = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  date: string;
  isrc: string;
  explicit: boolean;
  rights: boolean;
  share: number;
  audioName: string;
  artworkName: string;
  status: "draft" | "queued" | "delivered";
  progress: number;
};
export type Entry = {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance: number;
};
export type HistoryEntry = { id: string; artistId: string; date: string };
export type State = {
  version: 1;
  role: Role;
  alerts: string[];
  history: HistoryEntry[];
  deals: Deal[];
  releases: Release[];
  ledger: Entry[];
  wallet: number;
  brandWallet: number;
  venueWallet: number;
  votes: string[];
  questions: { id: string; episode: string; text: string }[];
  preferences: { name: string; email: string; notify: boolean };
  payouts: { id: string; amount: number; status: "requested" }[];
};
export function initialState(): State {
  return {
    version: 1,
    role: "visitor",
    alerts: [],
    history: [],
    deals: [
      {
        id: "seed-license",
        artistId: "kabza",
        title: "Independent voices · short film",
        amount: 350000,
        status: "offered",
        kind: "license",
      },
    ],
    releases: [],
    ledger: [
      {
        id: "opening",
        date: "2026-10-01T10:00:00Z",
        description: "Opening demo royalty balance",
        amount: 1245000,
        balance: 1245000,
      },
    ],
    wallet: 1245000,
    brandWallet: 5000000,
    venueWallet: 2000000,
    votes: [],
    questions: [],
    preferences: { name: "Kabza De Small", email: "", notify: false },
    payouts: [],
  };
}
export type Command =
  | { type: "role"; role: Role }
  | { type: "alert"; id: string }
  | { type: "history"; artistId: string }
  | {
      type: "offer";
      artistId: string;
      title: string;
      amount: number;
      kind: "license" | "booking";
      date?: string;
      venueId?: string;
    }
  | { type: "transition"; id: string; status: DealStatus }
  | { type: "payout"; amount: number }
  | {
      type: "release";
      release: Omit<Release, "id" | "status" | "progress">;
      id?: string;
    }
  | { type: "submitRelease"; id: string }
  | { type: "advanceRelease"; id: string }
  | { type: "vote"; id: string }
  | { type: "question"; episode: string; text: string }
  | { type: "preferences"; preferences: State["preferences"] }
  | { type: "reset" };
export function requireRole(s: State, role: Role) {
  if (s.role !== role)
    throw new Error(`Switch to the ${role} demo role to use this workspace.`);
}
function validAmount(amount: number) {
  if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 100000000)
    throw new Error("Enter a valid amount between R0.01 and R1,000,000.");
}
function validDate(value: string): boolean {
  const date = new Date(value + "T12:00:00Z");
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}
export function releaseErrors(
  r: Omit<Release, "id" | "status" | "progress">,
  now = new Date(),
): string[] {
  const e: string[] = [];
  if (!r.title.trim()) e.push("Release title is required.");
  if (!r.artist.trim()) e.push("Artist name is required.");
  if (!genres.includes(r.genre)) e.push("Choose a genre.");
  if (!validDate(r.date) || new Date(r.date + "T23:59:59Z") < now)
    e.push("Choose today or a future release date.");
  if (r.isrc && !/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(r.isrc))
    e.push("ISRC must contain 12 characters, for example ZAABC2600001.");
  if (!r.rights)
    e.push("Confirm you control the recording and artwork rights.");
  if (r.share !== 100) e.push("Royalty splits must total exactly 100%.");
  if (!/\.(wav|flac)$/i.test(r.audioName))
    e.push("Attach a WAV or FLAC audio file.");
  if (!/\.(jpg|jpeg|png)$/i.test(r.artworkName))
    e.push("Attach JPG or PNG artwork.");
  return e;
}
export function execute(
  state: State,
  c: Command,
  id = crypto.randomUUID(),
  now = new Date().toISOString(),
): State {
  const s = structuredClone(state);
  const entry = (description: string, amount: number) => {
    s.wallet += amount;
    s.ledger.unshift({ id, date: now, description, amount, balance: s.wallet });
  };
  switch (c.type) {
    case "role":
      if (!["visitor", "artist", "brand", "venue"].includes(c.role))
        throw new Error("Unknown role.");
      s.role = c.role;
      break;
    case "alert":
      if (!artists.some((a) => a.id === c.id))
        throw new Error("Artist not found.");
      s.alerts = s.alerts.includes(c.id)
        ? s.alerts.filter((x) => x !== c.id)
        : [...s.alerts, c.id];
      break;
    case "history":
      if (!artists.some((a) => a.id === c.artistId))
        throw new Error("Artist not found.");
      s.history.unshift({ id, artistId: c.artistId, date: now });
      s.history = s.history.slice(0, 30);
      break;
    case "offer": {
      requireRole(s, c.kind === "license" ? "brand" : "venue");
      validAmount(c.amount);
      if (!artists.some((a) => a.id === c.artistId))
        throw new Error("Choose an artist.");
      if (c.title.trim().length < 3)
        throw new Error("Add a project title with at least 3 characters.");
      if (
        c.kind === "booking" &&
        (!venues.some((v) => v.id === c.venueId) ||
          !c.date ||
          !validDate(c.date) ||
          c.date < now.slice(0, 10))
      )
        throw new Error("Choose a venue and a future booking date.");
      s.deals.unshift({
        id,
        artistId: c.artistId,
        title: c.title.trim(),
        amount: c.amount,
        status: "offered",
        kind: c.kind,
        date: c.date,
        venueId: c.venueId,
      });
      break;
    }
    case "transition": {
      const d = s.deals.find((d) => d.id === c.id);
      if (!d) throw new Error("Agreement not found.");
      const owner = d.kind === "license" ? "brand" : "venue";
      const wallet = d.kind === "license" ? "brandWallet" : "venueWallet";
      if (c.status === "accepted") {
        requireRole(s, "artist");
        if (d.artistId !== "kabza" || d.status !== "offered")
          throw new Error(
            "Only Kabza De Small’s pending offers can be accepted in this artist workspace.",
          );
      } else if (c.status === "funded") {
        requireRole(s, owner);
        if (d.status !== "accepted")
          throw new Error("The artist must accept before funding.");
        if (s[wallet] < d.amount) throw new Error("Insufficient demo funds.");
        s[wallet] -= d.amount;
      } else if (c.status === "completed") {
        requireRole(s, owner);
        if (d.status !== "funded")
          throw new Error("Fund the agreement before completing it.");
        if (d.artistId === "kabza")
          entry(`Simulated ${d.kind} settlement · ${d.title}`, d.amount);
      } else if (c.status === "cancelled") {
        if (s.role !== owner && s.role !== "artist")
          throw new Error("This role cannot cancel agreements.");
        if (s.role === "artist" && d.artistId !== "kabza")
          throw new Error("This agreement belongs to another artist.");
        if (!["offered", "accepted", "funded"].includes(d.status))
          throw new Error("This agreement is already closed.");
        if (d.status === "funded") s[wallet] += d.amount;
      } else throw new Error("Invalid agreement transition.");
      d.status = c.status;
      break;
    }
    case "payout":
      requireRole(s, "artist");
      validAmount(c.amount);
      if (c.amount > s.wallet)
        throw new Error("The requested amount exceeds your demo balance.");
      entry("Simulated payout request", -c.amount);
      s.payouts.unshift({ id, amount: c.amount, status: "requested" });
      break;
    case "release": {
      requireRole(s, "artist");
      if (!c.release.title.trim())
        throw new Error("Add a title before saving your draft.");
      const existing = c.id ? s.releases.find((r) => r.id === c.id) : undefined;
      if (c.id && (!existing || existing.status !== "draft"))
        throw new Error("Only drafts can be edited.");
      const r = {
        ...c.release,
        id: c.id ?? id,
        status: "draft" as const,
        progress: 0,
      };
      s.releases = existing
        ? s.releases.map((x) => (x.id === r.id ? r : x))
        : [r, ...s.releases];
      break;
    }
    case "submitRelease": {
      requireRole(s, "artist");
      const r = s.releases.find((r) => r.id === c.id);
      if (!r || r.status !== "draft")
        throw new Error("Only drafts can be submitted.");
      const errors = releaseErrors(r, new Date(now));
      if (errors.length) throw new Error(errors.join(" "));
      r.status = "queued";
      r.progress = 25;
      break;
    }
    case "advanceRelease": {
      requireRole(s, "artist");
      const r = s.releases.find((r) => r.id === c.id);
      if (!r || r.status !== "queued")
        throw new Error("Only queued releases can advance.");
      r.progress = Math.min(100, r.progress + 25);
      if (r.progress === 100) r.status = "delivered";
      break;
    }
    case "vote":
      if (!episodes.some((e) => e.id === c.id))
        throw new Error("Episode not found.");
      s.votes = s.votes.includes(c.id)
        ? s.votes.filter((x) => x !== c.id)
        : [...s.votes, c.id];
      break;
    case "question":
      if (!episodes.some((e) => e.id === c.episode))
        throw new Error("Episode not found.");
      if (c.text.trim().length < 10 || c.text.length > 500)
        throw new Error("Questions must be between 10 and 500 characters.");
      s.questions.unshift({ id, episode: c.episode, text: c.text.trim() });
      break;
    case "preferences":
      requireRole(s, "artist");
      if (!c.preferences.name.trim()) throw new Error("Name is required.");
      if (
        c.preferences.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.preferences.email)
      )
        throw new Error("Enter a valid email address.");
      s.preferences = c.preferences;
      break;
    case "reset":
      return initialState();
  }
  return s;
}
export function readState(value: unknown): State {
  const base = initialState();
  if (!value || typeof value !== "object") return base;
  const s = value as State;
  if (
    s.version !== 1 ||
    !["visitor", "artist", "brand", "venue"].includes(s.role) ||
    !Array.isArray(s.releases) ||
    !Array.isArray(s.deals) ||
    !Array.isArray(s.ledger) ||
    !Array.isArray(s.history) ||
    !Array.isArray(s.alerts) ||
    !Array.isArray(s.votes) ||
    !Array.isArray(s.questions) ||
    !Array.isArray(s.payouts) ||
    !s.preferences ||
    typeof s.preferences.name !== "string" ||
    typeof s.preferences.email !== "string" ||
    typeof s.preferences.notify !== "boolean"
  )
    return base;
  if (
    [s.wallet, s.brandWallet, s.venueWallet].some(
      (n) => !Number.isSafeInteger(n) || n < 0,
    )
  )
    return base;
  if (
    s.alerts.some((x) => typeof x !== "string") ||
    s.votes.some((x) => typeof x !== "string")
  )
    return base;
  if (
    s.deals.some(
      (d) =>
        !d ||
        typeof d.id !== "string" ||
        typeof d.title !== "string" ||
        !artists.some((a) => a.id === d.artistId) ||
        !Number.isSafeInteger(d.amount) ||
        d.amount <= 0 ||
        !["license", "booking"].includes(d.kind) ||
        !["offered", "accepted", "funded", "completed", "cancelled"].includes(
          d.status,
        ),
    )
  )
    return base;
  if (
    s.releases.some(
      (r) =>
        !r ||
        typeof r.id !== "string" ||
        typeof r.title !== "string" ||
        typeof r.artist !== "string" ||
        typeof r.genre !== "string" ||
        typeof r.date !== "string" ||
        typeof r.isrc !== "string" ||
        typeof r.rights !== "boolean" ||
        typeof r.explicit !== "boolean" ||
        !Number.isFinite(r.share) ||
        typeof r.audioName !== "string" ||
        typeof r.artworkName !== "string" ||
        !["draft", "queued", "delivered"].includes(r.status) ||
        !Number.isFinite(r.progress) ||
        r.progress < 0 ||
        r.progress > 100,
    )
  )
    return base;
  if (
    s.history.some(
      (h) =>
        !h ||
        typeof h.id !== "string" ||
        typeof h.date !== "string" ||
        !artists.some((a) => a.id === h.artistId),
    )
  )
    return base;
  if (
    s.questions.some(
      (q) =>
        !q ||
        typeof q.id !== "string" ||
        typeof q.text !== "string" ||
        typeof q.episode !== "string",
    )
  )
    return base;
  if (
    s.ledger.some(
      (e) =>
        !e ||
        typeof e.id !== "string" ||
        typeof e.description !== "string" ||
        typeof e.date !== "string" ||
        !Number.isSafeInteger(e.amount) ||
        !Number.isSafeInteger(e.balance),
    )
  )
    return base;
  if (
    s.payouts.some(
      (p) =>
        !p ||
        typeof p.id !== "string" ||
        !Number.isSafeInteger(p.amount) ||
        p.amount <= 0 ||
        p.status !== "requested",
    )
  )
    return base;
  return s;
}
export function rankArtists(query: string, genre: string, sort: string) {
  return artists
    .filter(
      (a) =>
        (genre === "All genres" || a.genre === genre) &&
        `${a.name} ${a.genre} ${a.city} ${a.songs.map((song) => song.title).join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "velocity"
        ? b.change - a.change
        : sort === "audience"
          ? b.audience - a.audience
          : b.score - a.score,
    );
}
export function pullEstimate(artistId: string, capacity: number) {
  const a = artists.find((a) => a.id === artistId);
  return a ? Math.min(capacity, Math.round(a.audience * 0.0018)) : 0;
}
