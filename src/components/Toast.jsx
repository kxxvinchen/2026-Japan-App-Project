import React from "react";
import { useFB } from "../lib/useFB.js";
import { FB } from "../lib/firebase.js";

export default function Toast() {
  useFB();
  return <div className={"toast" + (FB.toastMsg ? " show" : "")}>{FB.toastMsg}</div>;
}
