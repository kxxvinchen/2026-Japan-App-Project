import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, FB } from "./firebase.js";

/* re-renders the component whenever the Firebase/messaging store notifies */
export function useFB() {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return FB;
}
