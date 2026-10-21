"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  initialMarket,
  readMarket,
  marketTransition,
  type MarketState,
  type MarketCommand,
} from "@/lib/marketplace";
import { useDemo } from "./store";
const KEY = "sonic-exchange-market-demo-v1";
const Context = createContext<{
  state: MarketState;
  ready: boolean;
  act: (c: MarketCommand) => boolean;
} | null>(null);
export function MarketProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialMarket);
  const [ready, setReady] = useState(false);
  const current = useRef(state);
  const { notify } = useDemo();
  useEffect(() => {
    queueMicrotask(() => {
      try {
        current.current = readMarket(
          JSON.parse(localStorage.getItem(KEY) ?? "null"),
        );
      } catch {
        current.current = initialMarket();
      }
      setState(current.current);
      setReady(true);
    });
  }, []);
  const act = (command: MarketCommand) => {
    try {
      const next = marketTransition(current.current, command);
      current.current = next;
      setState(next);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        notify(
          "Browser storage is unavailable. Your collection lasts for this session only.",
        );
      }
      return true;
    } catch (error) {
      notify(error instanceof Error ? error.message : "Please try again.");
      return false;
    }
  };
  return (
    <Context.Provider value={{ state, ready, act }}>
      {children}
    </Context.Provider>
  );
}
export function useMarket() {
  const context = useContext(Context);
  if (!context) throw new Error("MarketProvider is required.");
  return context;
}
