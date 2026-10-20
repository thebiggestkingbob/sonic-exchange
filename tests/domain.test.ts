import { csvCell } from "../src/lib/csv";
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  execute,
  initialState,
  readState,
  releaseErrors,
  rankArtists,
  pullEstimate,
  type State,
} from "../src/lib/domain";
const now = "2026-10-20T10:00:00Z";
function role(s: State, r: State["role"]) {
  return execute(s, { type: "role", role: r }, "role", now);
}
test("ranking supports case insensitive search, genre and velocity ordering", () => {
  assert.equal(rankArtists("KABZA", "All genres", "score")[0].id, "kabza");
  assert.equal(rankArtists("", "Afro House", "score").length, 2);
  assert.equal(rankArtists("", "All genres", "velocity")[0].id, "a-reece");
  assert.deepEqual(rankArtists("missing", "All genres", "score"), []);
});
test("visitor cannot pay out, offer, or distribute", () => {
  const s = initialState();
  assert.throws(() => execute(s, { type: "payout", amount: 100 }));
  assert.throws(() =>
    execute(s, {
      type: "offer",
      artistId: "kabza",
      title: "Test",
      amount: 100,
      kind: "license",
    }),
  );
  assert.throws(() => execute(s, { type: "submitRelease", id: "missing" }));
});
test("escrow lifecycle debits once, settles once, and preserves source state", () => {
  const original = initialState();
  let s = role(original, "artist");
  s = execute(
    s,
    { type: "transition", id: "seed-license", status: "accepted" },
    "a",
    now,
  );
  s = role(s, "brand");
  s = execute(
    s,
    { type: "transition", id: "seed-license", status: "funded" },
    "b",
    now,
  );
  assert.equal(s.brandWallet, 4650000);
  assert.throws(() =>
    execute(s, { type: "transition", id: "seed-license", status: "funded" }),
  );
  s = execute(
    s,
    { type: "transition", id: "seed-license", status: "completed" },
    "c",
    now,
  );
  assert.equal(s.wallet, 1595000);
  assert.equal(s.ledger[0].amount, 350000);
  assert.throws(() =>
    execute(s, { type: "transition", id: "seed-license", status: "completed" }),
  );
  assert.equal(original.wallet, 1245000);
  assert.equal(original.deals[0].status, "offered");
});
test("funded cancellation refunds once without paying artist", () => {
  let s = role(initialState(), "artist");
  s = execute(s, {
    type: "transition",
    id: "seed-license",
    status: "accepted",
  });
  s = role(s, "brand");
  s = execute(s, { type: "transition", id: "seed-license", status: "funded" });
  s = execute(s, {
    type: "transition",
    id: "seed-license",
    status: "cancelled",
  });
  assert.equal(s.brandWallet, 5000000);
  assert.equal(s.wallet, 1245000);
  assert.throws(() =>
    execute(s, { type: "transition", id: "seed-license", status: "cancelled" }),
  );
});
test("cannot fund before artist acceptance and cannot spend beyond balance", () => {
  let s = role(initialState(), "brand");
  assert.throws(() =>
    execute(s, { type: "transition", id: "seed-license", status: "funded" }),
  );
  s = role(s, "artist");
  s = execute(s, {
    type: "transition",
    id: "seed-license",
    status: "accepted",
  });
  s = role(s, "brand");
  s.brandWallet = 1;
  assert.throws(() =>
    execute(s, { type: "transition", id: "seed-license", status: "funded" }),
  );
});
test("payout validates cents, role and balance and records append-only ledger", () => {
  let s = role(initialState(), "artist");
  for (const amount of [-1, 0, 1.4, NaN, Infinity, 2000000])
    assert.throws(() => execute(s, { type: "payout", amount }));
  s = execute(s, { type: "payout", amount: 100000 }, "payout", now);
  assert.equal(s.wallet, 1145000);
  assert.equal(s.ledger.length, 2);
  assert.equal(s.ledger[0].balance, s.wallet);
  assert.equal(s.payouts[0].status, "requested");
});
const release = {
  title: "Imithandazo",
  artist: "Kabza De Small",
  genre: "Afro Soul",
  date: "2027-01-01",
  isrc: "ZAABC2600001",
  explicit: false,
  rights: true,
  share: 100,
  audioName: "master.wav",
  artworkName: "cover.jpg",
};
test("distribution validates rights, assets, metadata and splits before queueing", () => {
  assert.deepEqual(releaseErrors(release, new Date(now)), []);
  assert.equal(
    releaseErrors(
      { ...release, rights: false, share: 90, audioName: "x.mp3" },
      new Date(now),
    ).length,
    3,
  );
  let s = role(initialState(), "artist");
  s = execute(s, { type: "release", release }, "release", now);
  s = execute(s, { type: "submitRelease", id: "release" }, "submit", now);
  assert.equal(s.releases[0].status, "queued");
  for (let i = 0; i < 3; i++)
    s = execute(s, { type: "advanceRelease", id: "release" }, "advance", now);
  assert.equal(s.releases[0].status, "delivered");
  assert.equal(s.releases[0].progress, 100);
  assert.throws(() => execute(s, { type: "advanceRelease", id: "release" }));
  assert.throws(() => execute(s, { type: "release", release, id: "release" }));
});
test("incomplete drafts save but cannot submit", () => {
  let s = role(initialState(), "artist");
  s = execute(
    s,
    { type: "release", release: { ...release, rights: false, audioName: "" } },
    "draft",
    now,
  );
  assert.equal(s.releases[0].status, "draft");
  assert.throws(() =>
    execute(s, { type: "submitRelease", id: "draft" }, "submit", now),
  );
});
test("booking requires venue role, date and venue", () => {
  let s = role(initialState(), "venue");
  assert.throws(() =>
    execute(
      s,
      {
        type: "offer",
        kind: "booking",
        artistId: "kabza",
        title: "Test show",
        amount: 10000,
      },
      "b",
      now,
    ),
  );
  s = execute(
    s,
    {
      type: "offer",
      kind: "booking",
      artistId: "kabza",
      title: "Test show",
      amount: 10000,
      date: "2027-01-01",
      venueId: "orbit",
    },
    "b",
    now,
  );
  assert.equal(s.deals[0].kind, "booking");
  assert.ok(pullEstimate("kabza", 100) <= 100);
});
test("demo artist cannot accept another artist’s offer", () => {
  let s = role(initialState(), "brand");
  s = execute(
    s,
    {
      type: "offer",
      kind: "license",
      artistId: "a-reece",
      title: "A project",
      amount: 10000,
    },
    "n",
    now,
  );
  s = role(s, "artist");
  assert.throws(() =>
    execute(s, { type: "transition", id: "n", status: "accepted" }),
  );
});
test("alerts and votes toggle, history persists and questions validate", () => {
  let s = initialState();
  s = execute(s, { type: "alert", id: "kabza" });
  assert.deepEqual(s.alerts, ["kabza"]);
  s = execute(s, { type: "alert", id: "kabza" });
  assert.equal(s.alerts.length, 0);
  s = execute(s, { type: "history", artistId: "kabza" }, "h", now);
  s = execute(s, { type: "vote", id: "01" });
  s = execute(
    s,
    { type: "question", episode: "01", text: "How do recording rights work?" },
    "q",
    now,
  );
  assert.equal(
    readState(JSON.parse(JSON.stringify(s))).history[0].artistId,
    "kabza",
  );
  assert.throws(() =>
    execute(s, { type: "question", episode: "01", text: "short" }),
  );
});
test("malformed storage falls back to a valid state", () => {
  for (const v of [
    null,
    {},
    [],
    { version: 1 },
    { ...initialState(), wallet: -1 },
    { ...initialState(), deals: [{}] },
    { ...initialState(), history: [{}] },
  ])
    assert.deepEqual(readState(v), initialState());
});

test("invalid calendar dates and unknown booking venues are rejected", () => {
  assert.ok(
    releaseErrors({ ...release, date: "2027-02-30" }, new Date(now)).length > 0,
  );
  assert.ok(
    releaseErrors({ ...release, date: "2027-99-99" }, new Date(now)).length > 0,
  );
  const s = role(initialState(), "venue");
  assert.throws(() =>
    execute(
      s,
      {
        type: "offer",
        kind: "booking",
        artistId: "kabza",
        title: "A show",
        amount: 10000,
        date: "2027-01-01",
        venueId: "missing",
      },
      "b",
      now,
    ),
  );
});

test("ledger CSV preserves negative cent amounts and escapes formulas in text", () => {
  assert.equal(csvCell(-50000), '"-50000"');
  assert.equal(csvCell("=1+1"), '"\'=1+1"');
  assert.equal(csvCell('a,"b"'), '"a,""b"""');
});
