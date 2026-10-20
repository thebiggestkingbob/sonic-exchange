import Link from "next/link";
export default function NotFound() {
  return (
    <section className="error-page">
      <p className="eyebrow">404 · OFF FREQUENCY</p>
      <h1>Let’s get you back to the music.</h1>
      <p>This page isn’t part of the current experience.</p>
      <Link className="btn primary" href="/index">
        Explore the INDEX
      </Link>
    </section>
  );
}
