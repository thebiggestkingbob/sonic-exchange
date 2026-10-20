import test from "node:test";
import assert from "node:assert/strict";
import {
  assetPrice,
  initialMarket,
  marketTransition,
  musicAssets,
  readMarket,
} from "../src/lib/marketplace";
test("marketplace prices rights separately and rejects unavailable assets and licences", () => {
  const a = musicAssets[0];
  assert.equal(assetPrice(a, "master"), a.price * 4);
  assert.equal(assetPrice(a, "publishing"), a.price * 2);
  assert.throws(() =>
    marketTransition(initialMarket(), { type: "save", assetId: "missing" }),
  );
});
test("demo purchase is immutable and cannot purchase the same licence twice", () => {
  const before = initialMarket();
  const command = {
    type: "purchase",
    assetId: "after-hours",
    license: "sync",
  } as const;
  const next = marketTransition(before, command, "2026-10-21T00:00:00Z");
  assert.equal(before.purchases.length, 0);
  assert.equal(next.purchases[0].amount, musicAssets[0].price);
  assert.throws(() => marketTransition(next, command), /already/);
  assert.equal(
    marketTransition(next, { ...command, license: "master" }).purchases.length,
    2,
  );
});
test("offers validate integer cents and project context and never imply acceptance", () => {
  const command = {
    type: "offer",
    assetId: "after-hours",
    license: "sync",
    amount: 500000,
    message: "An independent short film project.",
  } as const;
  for (const amount of [NaN, -10, 1.5, 99, 100000001])
    assert.throws(() =>
      marketTransition(initialMarket(), { ...command, amount }),
    );
  assert.throws(() =>
    marketTransition(initialMarket(), { ...command, message: "short" }),
  );
  const next = marketTransition(initialMarket(), command);
  assert.equal(next.offers.length, 1);
  assert.equal(next.purchases.length, 0);
});
test("saved assets toggle and malformed persisted marketplace data recovers safely", () => {
  const command = { type: "save", assetId: "after-hours" } as const;
  assert.deepEqual(
    marketTransition(marketTransition(initialMarket(), command), command),
    initialMarket(),
  );
  for (const raw of [
    null,
    {},
    { ...initialMarket(), purchases: [null] },
    { ...initialMarket(), saved: ["unknown"] },
  ])
    assert.deepEqual(readMarket(raw), initialMarket());
  const valid = marketTransition(initialMarket(), {
    type: "purchase",
    assetId: "after-hours",
    license: "sync",
  });
  assert.deepEqual(readMarket(valid), valid);
  assert.deepEqual(marketTransition(valid, { type: "reset" }), initialMarket());
});
