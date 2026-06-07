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
      document.documentElement.style.setProperty("--vvh", Math.round(vv.height) + "px");
      // Prevent visual viewport/layout viewport scrolling offset on iOS
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    } else {
      document.documentElement.style.removeProperty("--vvh");
    }
  };

  document.addEventListener("focusin", (e) => {
    if (isTextInput(e.target)) {
      inputFocused = true;
      refresh();
      // Scroll the active input into view instantly (no smooth behavior to avoid iOS scroll offsets)
      setTimeout(() => {
        try {
          e.target.scrollIntoView({ block: "nearest" });
        } catch (_) {}
      }, 120);
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
}
