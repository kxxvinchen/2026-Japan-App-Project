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
      setTimeout(() => {
        if (!isTextInput(document.activeElement)) {
          inputFocused = false;
          refresh();
        }
      }, 300);
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
}
