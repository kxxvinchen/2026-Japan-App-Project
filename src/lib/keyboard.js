/* iOS/Android keyboard handling for all input and textarea elements:
   When any text input/textarea is focused, hide the bottom nav and shrink the shell
   to the area above the keyboard, so the input fields sit above the keyboard.
   Driven by the actual viewport size. Also prevents user zooming. */
export function setupKeyboard() {
  // Prevent multi-touch pinch zoom
  document.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  // Prevent iOS pinch zoom gesture specifically
  document.addEventListener("gesturestart", (e) => {
    e.preventDefault();
  });

  const vv = window.visualViewport;
  if (!vv) return;

  let inputFocused = false;
  let baseHeight = window.innerHeight;

  const isTextInput = (el) => el && (
    el.tagName === "TEXTAREA" ||
    (el.tagName === "INPUT" && !["checkbox", "radio", "button", "submit", "file"].includes(el.type))
  );

  // Keep the layout-viewport pinned to the very top so the header can never scroll
  // out of view behind the keyboard (iOS can offset either the window or the document
  // scroller when the keyboard opens).
  const pinTop = () => {
    if (window.scrollY !== 0) window.scrollTo(0, 0);
    const se = document.scrollingElement;
    if (se && se.scrollTop !== 0) se.scrollTop = 0;
  };

  const refresh = () => {
    if (!inputFocused) {
      baseHeight = window.innerHeight;
    }
    const kbOpen = inputFocused && (
      (window.innerHeight - vv.height > 120) || // iOS style (visual viewport shrinks, layout viewport does not)
      (baseHeight - window.innerHeight > 120)    // Android style (layout viewport shrinks)
    );
    document.body.classList.toggle("kbd-open", kbOpen);
    if (kbOpen) {
      // Shrink the shell to exactly the area above the keyboard on EVERY platform (not
      // just iOS). The shell is a flex column, so only the scrollable message list
      // shrinks — the header stays put and the compose bar rises with the keyboard.
      document.documentElement.style.setProperty("--vvh", Math.round(vv.height) + "px");
      pinTop();
    } else {
      document.documentElement.style.removeProperty("--vvh");
      pinTop();
    }
  };

  document.addEventListener("focusin", (e) => {
    if (isTextInput(e.target)) {
      inputFocused = true;
      refresh();
      // NOTE: intentionally no scrollIntoView here. Once the shell shrinks, the compose
      // box already sits just above the keyboard; forcing a scroll was what dragged the
      // header (and the rest of the screen) upward.
    }
  });

  document.addEventListener("focusout", (e) => {
    if (isTextInput(e.target)) {
      // Use a longer delay on iOS PWA: the visual viewport height doesn't update
      // synchronously when the keyboard animates away, so a short timeout races
      // against the animation and can leave kbd-open stuck (hiding the navbar).
      // The second timeout at 700ms is a safety net for slow/stuttering transitions
      // on devices like iPhone 16 Pro where the Dynamic Island changes safe area geometry.
      const tryRestore = () => {
        if (!isTextInput(document.activeElement)) {
          inputFocused = false;
          refresh();
        }
      };
      setTimeout(tryRestore, 400);
      setTimeout(tryRestore, 700);
    }
  });

  vv.addEventListener("resize", refresh);
  vv.addEventListener("scroll", refresh);

  // Prevent browser-level layout viewport scrolling when the keyboard is open
  window.addEventListener("scroll", () => {
    if (document.body.classList.contains("kbd-open") && window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
  });

  // Lock the document from being dragged while the announcements compose box is focused
  // with the keyboard up. Without this, dragging a NON-scrollable area (header, channel
  // bar, toolbar) lets iOS rubber-band the whole app below the screen — most noticeable
  // when the @-mention popup has grown the compose stack taller than the viewport.
  // Scoped tightly: it only engages when the compose itself is focused, so every other
  // screen (Add Activity, Settings, Translation search, etc.) scrolls exactly as before.
  // Touches that begin inside a real scroller are allowed through unchanged.
  document.addEventListener("touchmove", (e) => {
    if (!document.body.classList.contains("kbd-open")) return;
    const a = document.activeElement;
    const composeFocused = a && (a.id === "msgText" || (a.closest && a.closest(".ann-compose")));
    if (!composeFocused) return;                       // not the announcements compose → leave scrolling alone
    const t = e.target;
    if (t && t.closest && t.closest(".ann-body, .ann-mention-pop, .ann-compose-input")) return; // real scrollers OK
    e.preventDefault();                                // everything else: no document drag
  }, { passive: false });
}
