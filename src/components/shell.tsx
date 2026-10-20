"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AudioLines,
  ArrowUpRight,
  Menu,
  X,
  Search,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { navigation, type Role } from "@/lib/data";
import { useDemo } from "./store";
import { useMarket } from "./market-store";
import { Modal } from "./ui";
export function Header() {
  const pathname = usePathname();
  const market = useMarket();
  const { state, send, ready } = useDemo();
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);
  const [reset, setReset] = useState(false);
  const router = useRouter();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="wordmark" aria-label="SONIC EXCHANGE home">
            SONIC EXCHANGE<span>.</span>
          </Link>
          <nav
            aria-label="Main navigation"
            className={menu ? "nav open" : "nav"}
          >
            {navigation.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenu(false)}
                aria-current={
                  pathname === href ||
                  (href === "/marketplace" &&
                    pathname.startsWith("/marketplace/"))
                    ? "page"
                    : undefined
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-btn global-search"
              aria-label="Open global search"
              onClick={() => setSearch(true)}
            >
              <Search size={18} />
            </button>
            <label className="role-switch">
              <span className="avatar">
                {ready ? state.role.slice(0, 1).toUpperCase() : "V"}
              </span>
              <span className="sr-only">Demo role</span>
              <select
                aria-label="Demo role"
                value={state.role}
                onChange={(e) =>
                  send({ type: "role", role: e.target.value as Role })
                }
              >
                <option value="visitor">Visitor demo</option>
                <option value="artist">Artist demo</option>
                <option value="brand">Brand demo</option>
                <option value="venue">Venue demo</option>
              </select>
              <ChevronDown size={12} aria-hidden="true" />
            </label>
            <button
              className="icon-btn menu-toggle"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label={menu ? "Close menu" : "Open menu"}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <div className="demo-ribbon">
        <div>
          <span className="demo-dot" />
          INDEPENDENT BY DESIGN. CONNECTED BY MUSIC.
        </div>
        <button onClick={() => setReset(true)}>
          <span>INTERACTIVE DEMO</span>
          <RotateCcw size={11} />
        </button>
      </div>
      {search && (
        <Modal
          title="Find your next discovery"
          onClose={() => setSearch(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/index?q=" + encodeURIComponent(query));
              setSearch(false);
            }}
          >
            <label className="field">
              Artist, genre or city
              <input
                autoFocus
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try Tyla, Imithandazo or Amapiano"
              />
            </label>
            <button className="btn primary" type="submit">
              Search INDEX
              <Search size={16} />
            </button>
          </form>
        </Modal>
      )}
      {reset && (
        <Modal title="Reset this demo?" onClose={() => setReset(false)}>
          <p>
            This clears saved alerts, releases, agreements, participation and
            demo wallet activity in this browser.
          </p>
          <div className="button-row">
            <button className="btn secondary" onClick={() => setReset(false)}>
              Keep my progress
            </button>
            <button
              className="btn primary"
              onClick={() => {
                send({ type: "reset" });
                market.act({ type: "reset" });
                setReset(false);
              }}
            >
              Reset demo
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link className="wordmark" href="/">
          SONIC EXCHANGE<span>.</span>
        </Link>
        <p>The culture. The creators. The connection.</p>
      </div>
      <div>
        <span className="footer-label">A NEW FREQUENCY FOR MUSIC</span>
        <p>
          Built for independent voices. Made for what’s next.
          <ArrowUpRight size={14} />
        </p>
      </div>
      <div className="footer-end">
        <AudioLines size={24} />
        <span>
          2026 · Prototype preview
          <br />
          Fictional data. Real possibilities.
        </span>
      </div>
    </footer>
  );
}
