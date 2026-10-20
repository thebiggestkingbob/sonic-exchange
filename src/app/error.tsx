"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="error-page">
      <p className="eyebrow">LET’S FIND THE FREQUENCY AGAIN</p>
      <h1>A moment of interference.</h1>
      <p>Something interrupted this page. Try again to return to the music.</p>
      <button className="btn primary" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
