// src/helpers.js
export function ensureLink(href, rel = 'stylesheet') {
  return new Promise((resolve) => {
    const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .some(l => (l.href || '').includes(href));
    if (exists) return resolve();
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}

export function ensureScript(src, testFn) {
  return new Promise((resolve) => {
    if (typeof testFn === 'function') {
      try { if (testFn()) return resolve(); } catch (_) {}
    }
    const already = Array.from(document.scripts).some(s => (s.src || '').includes(src));
    if (already) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

export function injectStyle(css, id) {
  if (id && document.getElementById(id)) return;
  const st = document.createElement('style');
  if (id) st.id = id;
  st.textContent = css;
  document.head.appendChild(st);
}

// small util
export function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) return `${hrs}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  return `${mins}:${String(secs).padStart(2,'0')}`;
        }
