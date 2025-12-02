// src/subtitles.js
export function parseSRT(srtText) {
  if (!srtText) return [];
  const blocks = srtText.trim().split(/\r?\n\r?\n/);
  const subtitleData = [];
  for (const block of blocks) {
    const lines = block.trim().split(/\r?\n/);
    // Some SRTs start with an index, some with time
    let idx = 0, timeLine = '', textLines = [];
    if (lines.length >= 2 && /\d+:\d+:\d+/.test(lines[1])) {
      idx = parseInt(lines[0]) || 0;
      timeLine = lines[1];
      textLines = lines.slice(2);
    } else if (lines.length >= 1 && /\d+:\d+:\d+/.test(lines[0])) {
      timeLine = lines[0];
      textLines = lines.slice(1);
    } else {
      continue;
    }
    subtitleData.push({ id: idx, time: timeLine, text: textLines.join(' ').trim() });
  }
  return subtitleData;
}

export function convertToSeconds(timeString) {
  // timeString like "00:01:23,456"
  const parts = timeString.replace(',', '.').split(':');
  const secs = parseFloat(parts.pop());
  const mins = parseInt(parts.pop() || '0', 10);
  const hrs = parseInt(parts.pop() || '0', 10);
  return hrs * 3600 + mins * 60 + secs;
}
