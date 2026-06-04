/* speak a Japanese phrase with the device's built-in text-to-speech */
export function speakJa(text) {
  try {
    if (!("speechSynthesis" in window)) return false;
    const clean = String(text).replace(/_+/g, "").replace(/／/g, "、").replace(/\s*\/\s*/g, " 、 ").trim();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = "ja-JP"; u.rate = 0.85;
    const vs = window.speechSynthesis.getVoices() || [];
    const jp = vs.filter((v) => /ja[-_]JP/i.test(v.lang) || /Japanese|Kyoko|Otoya/i.test(v.name))[0];
    if (jp) u.voice = jp;
    window.speechSynthesis.speak(u);
    return true;
  } catch (e) { return false; }
}
