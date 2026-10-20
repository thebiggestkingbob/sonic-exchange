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
  execute,
  initialState,
  readState,
  type Command,
  type State,
} from "@/lib/domain";
const KEY = "sonic-exchange-demo-v1";
type Context = {
  state: State;
  ready: boolean;
  send: (command: Command) => boolean;
  notify: (message: string) => void;
};
const Store = createContext<Context | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState(false);
  const current = useRef(state);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(KEY);
        const s = raw ? readState(JSON.parse(raw)) : initialState();
        current.current = s;
        setState(s);
      } catch {
        setStorageError(true);
      }
      setReady(true);
    });
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  const notify = (message: string) => {
    setNotice(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(""), 5500);
  };
  const send = (command: Command) => {
    try {
      const next = execute(current.current, command);
      current.current = next;
      setState(next);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        setStorageError(true);
      }
      return true;
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      return false;
    }
  };
  return (
    <Store.Provider value={{ state, ready, send, notify }}>
      {storageError && (
        <div className="storage-notice" role="status">
          Browser storage is unavailable. Changes last for this session only.
        </div>
      )}
      {children}
      <div
        className={`toast ${notice ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice}
      </div>
    </Store.Provider>
  );
}
export function useDemo() {
  const s = useContext(Store);
  if (!s) throw new Error("DemoProvider is required");
  return s;
}
