"use client";
import { artists, money, venues } from "@/lib/data";
import { type Deal } from "@/lib/domain";
import { useDemo } from "./store";
import { Badge, Empty, StatusSteps } from "./ui";
export function Agreements({
  kind,
  artistOnly = false,
}: {
  kind?: "license" | "booking";
  artistOnly?: boolean;
}) {
  const { state, send, notify } = useDemo();
  const deals = state.deals.filter(
    (d) =>
      (!kind || d.kind === kind) && (!artistOnly || d.artistId === "amara"),
  );
  function transition(d: Deal, status: Deal["status"]) {
    if (send({ type: "transition", id: d.id, status }))
      notify(
        status === "funded"
          ? "Demo escrow funded. No real funds moved."
          : status === "completed"
            ? "Simulated settlement recorded in the ledger."
            : status === "cancelled"
              ? "Agreement cancelled. Any held demo funds were returned."
              : "Offer accepted in this demo.",
      );
  }
  return deals.length ? (
    <div>
      {deals.map((d) => {
        const a = artists.find((a) => a.id === d.artistId)!;
        const canOwn =
          state.role === (d.kind === "license" ? "brand" : "venue");
        const canArtist = state.role === "artist" && d.artistId === "amara";
        return (
          <article className="agreement" key={d.id}>
            <div className="agreement-top">
              <div>
                <h3>{d.title}</h3>
                <p>
                  {a.name} ·{" "}
                  {d.kind === "license"
                    ? "Sync licensing offer"
                    : "Live booking request"}
                </p>
              </div>
              <strong className="money">{money(d.amount)}</strong>
              <Badge
                tone={
                  d.status === "completed"
                    ? "green"
                    : d.status === "cancelled"
                      ? "neutral"
                      : "purple"
                }
              >
                {d.status === "funded" ? "Demo escrow funded" : d.status}
              </Badge>
            </div>
            {d.kind === "booking" && (
              <p className="booking-meta">
                {venues.find((v) => v.id === d.venueId)?.name} · {d.date}
              </p>
            )}
            <StatusSteps
              steps={["Offered", "Accepted", "Escrow", "Settled"]}
              current={["offered", "accepted", "funded", "completed"].indexOf(
                d.status,
              )}
            />
            <p className="safety-caption" style={{ margin: 0 }}>
              Simulated agreement ·{" "}
              {d.status === "offered"
                ? "Awaiting artist acceptance."
                : d.status === "accepted"
                  ? "Accepted by the demo artist. Ready for simulated funding."
                  : d.status === "funded"
                    ? "Demo balance reserved. Complete to settle or cancel to refund."
                    : d.status === "completed"
                      ? "Settled to the artist’s simulated balance."
                      : "Closed. No outstanding hold."}
            </p>
            <div className="button-row">
              {canArtist && d.status === "offered" && (
                <button
                  className="btn primary"
                  onClick={() => transition(d, "accepted")}
                >
                  Accept offer
                </button>
              )}
              {canOwn && d.status === "accepted" && (
                <button
                  className="btn primary"
                  onClick={() => transition(d, "funded")}
                >
                  Fund demo escrow
                </button>
              )}
              {canOwn && d.status === "funded" && (
                <button
                  className="btn primary"
                  onClick={() => transition(d, "completed")}
                >
                  Complete simulated settlement
                </button>
              )}
              {(canArtist || canOwn) &&
                !["completed", "cancelled"].includes(d.status) && (
                  <button
                    className="btn secondary"
                    onClick={() => transition(d, "cancelled")}
                  >
                    Cancel agreement
                  </button>
                )}
            </div>
            {canOwn && d.status === "offered" && (
              <p className="safety-caption" style={{ margin: "14px 0 0" }}>
                Switch to the Artist demo role to accept Amara Sol’s offers.
                Other fictional artists have no active workspace in this
                prototype.
              </p>
            )}
          </article>
        );
      })}
    </div>
  ) : (
    <Empty
      title="Space for the next connection."
      description="New offers and booking requests will appear here as you create them in the demo."
    />
  );
}
