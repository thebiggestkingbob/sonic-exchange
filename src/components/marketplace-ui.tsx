"use client";
import Link from "next/link";
import { Heart, ArrowUpRight, Play, AudioLines, X, Check } from "lucide-react";
import {
  type MusicAsset,
  rand,
  licenses,
  musicAssets,
} from "@/lib/marketplace";
import { useMarket } from "./market-store";
import { Modal } from "./ui";
export function Cover({
  asset,
  className = "",
}: {
  asset: MusicAsset;
  className?: string;
}) {
  return (
    <div className={`asset-cover ${asset.theme} ${className}`}>
      <img src={asset.image} alt="" loading="lazy" />
      <div className="cover-lines" />
      <span className="cover-imprint">SONIC ORIGINALS / DEMO SERIES</span>
      <span className="cover-title">{asset.title}</span>
      <span className="cover-number">
        SE—0{(asset.bpm % 7) + 1} / {asset.city}
      </span>
    </div>
  );
}
export function AssetCard({
  asset,
  onPlay,
}: {
  asset: MusicAsset;
  onPlay: (a: MusicAsset) => void;
}) {
  const { state, ready, act } = useMarket();
  const saved = state.saved.includes(asset.id);
  return (
    <article className="market-asset-card">
      <div className="asset-card-art">
        <Link
          href={`/marketplace/${asset.id}`}
          aria-label={`View ${asset.title}`}
        >
          <Cover asset={asset} />
        </Link>
        <span className="asset-tag">{asset.tag}</span>
        <button
          className={`asset-save ${saved ? "saved" : ""}`}
          disabled={!ready}
          aria-label={`${saved ? "Unsave" : "Save"} ${asset.title}`}
          aria-pressed={saved}
          onClick={() => act({ type: "save", assetId: asset.id })}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        <button
          className="asset-play"
          aria-label={`Preview ${asset.title}`}
          onClick={() => onPlay(asset)}
        >
          <Play size={15} fill="currentColor" />
        </button>
      </div>
      <div className="asset-card-copy">
        <div className="asset-card-meta">
          <span>{asset.genre}</span>
          <span>{asset.kind}</span>
        </div>
        <h3>
          <Link href={`/marketplace/${asset.id}`}>{asset.title}</Link>
        </h3>
        <p>
          {asset.creator} <span>· Demo creator</span>
        </p>
        <div className="asset-price-row">
          <div>
            <small>Sync licence from</small>
            <strong>{rand(asset.price)}</strong>
          </div>
          <Link
            className="circle-link"
            href={`/marketplace/${asset.id}`}
            aria-label={`Explore ${asset.title}`}
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
export function PreviewPlayer({
  asset,
  onClose,
}: {
  asset: MusicAsset | null;
  onClose: () => void;
}) {
  if (!asset) return null;
  return (
    <aside className="market-preview-player" aria-label="Demo audio preview">
      <AudioLines size={23} />
      <div>
        <strong>{asset.title}</strong>
        <small>12-second synthesized demo · not an artist recording</small>
      </div>
      <audio
        key={asset.id}
        src="/audio/market-demo.wav"
        controls
        autoPlay
        aria-label={`Audio preview of ${asset.title}`}
      />
      <button
        className="icon-btn"
        onClick={onClose}
        aria-label="Close audio preview"
      >
        <X size={20} />
      </button>
    </aside>
  );
}
export function Collection({ onClose }: { onClose: () => void }) {
  const { state } = useMarket();
  return (
    <Modal title="Your demo collection" onClose={onClose}>
      <p className="muted">
        Saved in this browser. No money moved and no music rights were
        transferred.
      </p>
      <h3>Licences ({state.purchases.length})</h3>
      {state.purchases.length ? (
        state.purchases.map((p) => (
          <div className="collection-row" key={`${p.assetId}-${p.license}`}>
            <Check size={19} />
            <div>
              <Link href={`/marketplace/${p.assetId}`} onClick={onClose}>
                {musicAssets.find((a) => a.id === p.assetId)?.title}
              </Link>
              <small>
                {licenses.find((l) => l.id === p.license)?.label} · Demo
                purchase
              </small>
            </div>
            <strong>{rand(p.amount)}</strong>
          </div>
        ))
      ) : (
        <p>Your demo purchases will appear here.</p>
      )}
      <h3>Offers ({state.offers.length})</h3>
      {state.offers.map((o, i) => (
        <div className="collection-row" key={i}>
          <div>
            <Link href={`/marketplace/${o.assetId}`} onClick={onClose}>
              {musicAssets.find((a) => a.id === o.assetId)?.title}
            </Link>
            <small>
              {licenses.find((l) => l.id === o.license)?.label} · Pending
              locally, not sent
            </small>
          </div>
          <strong>{rand(o.amount)}</strong>
        </div>
      ))}
      {!state.offers.length && <p>No offers yet.</p>}
    </Modal>
  );
}
