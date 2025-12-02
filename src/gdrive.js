// src/gdrive.js
// Utilities for extracting Google Drive direct stream URLs (best-effort)
export async function getDriveVideoURLs(fileId, itagMap = {}) {
  try {
    // Using corsproxy.io for CORS — you can replace with your own proxy
    const url = `https://corsproxy.io/?https://drive.google.com/get_video_info?docid=${encodeURIComponent(fileId)}`;
    const res = await fetch(url, { headers: { 'accept': '*/*', 'referer': 'https://drive.google.com/' } });
    const text = await res.text();
    const params = new URLSearchParams(text);
    if (params.get('status') !== 'ok') {
      console.warn('Drive info status is not ok', params.get('status'));
      return [];
    }
    const streamMap = params.get('fmt_stream_map') || params.get('url_encoded_fmt_stream_map');
    if (!streamMap) return [];
    const streams = streamMap.split(',').map(entry => {
      const [itag, url] = entry.split('|');
      return { itag, url, quality: itagMap[itag] || `itag-${itag}` };
    });
    return streams;
  } catch (err) {
    console.error('getDriveVideoURLs error', err);
    return [];
  }
}
