// src/hls.js
export async function playM3u8(videoEl, videoSrc, poster) {
  if (poster) videoEl.poster = poster;
  if (window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(videoEl);
    return hls;
  } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    videoEl.src = videoSrc;
    return null;
  } else {
    console.warn('HLS not supported by this browser.');
    return null;
  }
}
