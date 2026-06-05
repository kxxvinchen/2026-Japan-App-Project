import React from "react";
import { useStore } from "../store.jsx";
import { useFB } from "../lib/useFB.js";
import { FB, clearToast, setActiveChannel } from "../lib/firebase.js";

export default function Toast() {
  const { dispatch } = useStore();
  useFB();

  const handleClick = () => {
    if (!FB.toastMsg) return;
    if (FB.toastNav) {
      if (FB.toastNav === "messages" && FB.toastChannel) {
        setActiveChannel(FB.toastChannel);
      }
      dispatch({ type: "nav", screen: FB.toastNav });
    }
    clearToast();
  };

  return (
    <button
      className={"toast" + (FB.toastMsg ? " show" : "")}
      onClick={handleClick}
      disabled={!FB.toastMsg}
    >
      {FB.toastMsg}
    </button>
  );
}
