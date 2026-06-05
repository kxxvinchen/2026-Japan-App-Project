/* iOS/Android keyboard handling for the announcements compose box:
   when the compose/name input is focused, hide the bottom nav and shrink the shell to the
   area above the keyboard, so the compose bar sits just above the keyboard. Driven by the
   actual viewport size (not blur), since iOS hides the keyboard without firing blur. */
export function setupKeyboard() {
  const vv = window.visualViewport;
  if (!vv) return;
  let composeFocused = false;
  const isCompose = (el) => el && (el.id === "msgText" || el.id === "chapName");
  const refresh = () => {
    const kbOpen = composeFocused && window.innerHeight - vv.height > 120;
    document.body.classList.toggle("kbd-open", kbOpen);
    if (kbOpen) document.documentElement.style.setProperty("--vvh", Math.round(vv.height) + "px");
    else document.documentElement.style.removeProperty("--vvh");
  };
  document.addEventListener("focusin", (e) => {
    if (isCompose(e.target)) { composeFocused = true; refresh(); setTimeout(() => { try { e.target.scrollIntoView({ block: "nearest" }); } catch (_) {} }, 120); }
  });
  document.addEventListener("focusout", (e) => {
    if (isCompose(e.target)) setTimeout(() => { if (!isCompose(document.activeElement)) { composeFocused = false; refresh(); } }, 60);
  });
  vv.addEventListener("resize", refresh);
  vv.addEventListener("scroll", refresh);
}
