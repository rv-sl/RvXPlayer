// src/player.js
import EMBEDDED_CSS from './css.js';
import { playerHTML } from './html.js';
import { ensureLink, ensureScript, injectStyle, formatTime } from './helpers.js';
import { parseSRT, convertToSeconds } from './subtitles.js';
import { getDriveVideoURLs } from './gdrive.js';
import { playM3u8 } from './hls.js';

const DEFAULT_ID_BASE = 'https://raw.githubusercontent.com/Ravindu2355/RxVJson/main/files/';

class RvXInstance {
  constructor(opts = {}) {
    this.container = typeof opts.container === 'string' ? document.querySelector(opts.container) : opts.container;
    if (!this.container) throw new Error('RvXPlayer: container not found');
    this.idBaseURL = (opts.idBaseURL || DEFAULT_ID_BASE).replace(/\/+$/, '/');
    this.onError = typeof opts.onError === 'function' ? opts.onError : null;

    this.itagMap = {
      18: "360p", 59: "480p", 22: "720p", 37: "1080p", 38: "2160p",
      133: "240p", 134: "360p", 135: "480p", 136: "720p", 137: "1080p",
      264: "1440p", 266: "2160p", 160: "144p", 298: "720p60", 299: "1080p60"
    };
    this.gdriveDefaultItag = '18';
    this.vibrate = 1;
    this.vibrations = [];
    this.lastCheckTime = 0;
    this.currentData = null;
    this.currentId = null;
    this.setQuic = true;
    this.lastWatchData = null;
    this.subtitles = [];
    this.depsReady = this.loadDependencies();

    // inject style once
    injectStyle(EMBEDDED_CSS, 'rvxplayer-v1-styles');

    // build dom
    this.container.innerHTML = playerHTML();
    this.hookElements();
    this.bindUI();

    if (opts.data) {
      this.depsReady.then(() => this.load(opts.data));
    }
  }

  async loadDependencies() {
    // load icons + sweet alert + crypto + hls
    await ensureLink('https://fonts.googleapis.com/icon?family=Material+Icons');
    await ensureLink('https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css');
    await ensureScript('https://cdn.jsdelivr.net/npm/sweetalert2@11', () => !!(window.Swal || window.swal));
    await ensureScript('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js', () => !!window.CryptoJS);
    await ensureScript('https://cdn.jsdelivr.net/npm/hls.js@latest', () => !!window.Hls);
  }

  hookElements() {
    const root = this.container;
    this.video = root.querySelector('#fullscreenVideo');
    this.titleEl = root.querySelector('#videoTitle');
    this.des = root.querySelector('.des');
    this.imgs = root.querySelector('.imgs');
    this.playApp = root.querySelector('.play-app');
    this.subtitleDisplay = root.querySelector('#subT');
    this.colorInput = root.querySelector('#color');
    this.subSizeIn = root.querySelector('#subSizeChange');
    this.subSizeDisplay = root.querySelector('#subSizeDisplay');
    this.subOnOff = root.querySelector('.subOnOff');
    this.subOnL = root.querySelector('.subOnL');
    this.qualitySection = root.querySelector('.quality-section');
    this.vibrateSection = root.querySelector('.vibration-subm');
    this.subtitleSection = root.querySelector('.subtitle-setting-sec');
    this.vbBtn = root.querySelector('.vb-s');
    this.fullsBtn = root.querySelector('.fullsBtn');
    this.settingsBtn = root.querySelector('.vsettingBtn');
    this.settingsBox = root.querySelector('.Vsettings');
    this.player = root.querySelector('.vplayer');
    this.controls = root.querySelector('.vcontrols');

    // spinner convenience
    this.spinner = {
      inject: (container) => {
        const el = (container instanceof Element) ? container : this.container;
        if (!el._rvx_spinner) {
          const ov = document.createElement('div');
          ov.className = 'loading-overlay in-container';
          ov.style.position = 'absolute';
          ov.style.top = 0; ov.style.left = 0; ov.style.right = 0; ov.style.bottom = 0;
          ov.style.display = 'flex';
          ov.style.alignItems = 'center';
          ov.style.justifyContent = 'center';
          ov.style.background = 'rgba(255,255,255,0.2)';
          if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
          ov.innerHTML = `<svg width="88" height="88"><defs><linearGradient id="filler" x1="0%" x2="100%"><stop offset="0%" stop-color="#9839E2"/><stop offset="100%" stop-color="#F75DB8"/></linearGradient></defs><circle cx="44" cy="44" r="40" stroke="url(#filler)" fill="none" style="stroke-dasharray:20,251.1853;stroke-width:8px;animation:circle-spin 2s linear infinite;"></circle></svg>`;
          el.appendChild(ov);
          el._rvx_spinner = ov;
        }
        el._rvx_spinner.style.display = 'flex';
      },
      remove: (container) => {
        const el = (container instanceof Element) ? container : this.container;
        if (el._rvx_spinner) el._rvx_spinner.style.display = 'none';
      }
    };
  }

  bindUI() {
    // settings toggle
    this.settingsBtn.addEventListener('click', () => {
      const dv = this.settingsBox;
      this.settingsBtn.textContent = !dv.classList.contains('active') ? 'cancel' : 'settings';
      dv.classList.toggle('active');
      this.settingsBtn.classList.toggle('active');
    });

    this.fullsBtn.addEventListener('click', () => this.toggleFullScreen());
    ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange'].forEach(evt => {
      document.addEventListener(evt, () => {
        const el = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        this.fullsBtn.textContent = (el && el.classList.contains('player')) ? 'fullscreen_exit' : 'fullscreen';
      });
    });

    // subtitle color/size/reset
    this.colorInput.addEventListener('input', () => { this.subtitleDisplay.style.color = this.colorInput.value; });
    this.container.querySelector('.subReBtn').addEventListener('click', () => {
      this.subtitleDisplay.style.color = '#ffffff';
      this.colorInput.value = '#ffffff';
    });

    const saved = Number(localStorage.getItem('playerFont')) || 20;
    this.subtitleDisplay.style.fontSize = saved + 'px';
    this.subSizeDisplay.textContent = saved + 'px';
    this.subSizeIn.addEventListener('input', (e) => {
      localStorage.setItem('playerFont', e.target.value);
      this.subtitleDisplay.style.fontSize = e.target.value + 'px';
      this.subSizeDisplay.textContent = e.target.value + 'px';
    });
    this.container.querySelector('.subResetBtn').addEventListener('click', () => {
      this.subSizeIn.value = 20;
      localStorage.setItem('playerFont', 20);
      this.subtitleDisplay.style.fontSize = '20px';
      this.subSizeDisplay.textContent = '20px';
    });

    // sub on/off
    const subBh = () => {
      if (this.subOnOff.checked) {
        this.subOnL.textContent = 'On';
        this.subOnL.classList.remove('Off');
        this.subtitleDisplay.style.display = 'block';
      } else {
        this.subOnL.textContent = 'Off';
        this.subOnL.classList.add('Off');
        this.subtitleDisplay.style.display = 'none';
      }
    };
    this.subOnOff.addEventListener('input', subBh); subBh();

    // submenus expand/collapse
    this.container.querySelectorAll('.submenu-toggle').forEach(t => {
      t.addEventListener('click', () => {
        const submenu = t.parentElement.querySelector('.submenu');
        submenu.classList.toggle('open');
      });
    });

    // vibration toggle
    this.vbBtn.addEventListener('click', () => this.vibrationToggle());

    // controls auto-hide
    let controlTimer;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const showControls = () => { this.player.classList.remove('hide-controls'); resetTimer(); };
    const hideControls = () => this.player.classList.add('hide-controls');
    const resetTimer = () => {
      clearTimeout(controlTimer);
      controlTimer = setTimeout(() => {
        hideControls();
        this.settingsBox.classList.remove('active');
        this.settingsBtn.textContent = 'settings';
        this.settingsBtn.classList.remove('active');
      }, 3000);
    };
    if (!isMobile) {
      this.player.addEventListener('mousemove', showControls);
      this.player.addEventListener('mouseleave', hideControls);
      this.controls.addEventListener('mouseenter', () => clearTimeout(controlTimer));
      this.controls.addEventListener('mouseleave', resetTimer);
    } else {
      this.player.addEventListener('touchstart', () => {
        if (this.player.classList.contains('hide-controls')) showControls(); else hideControls();
      });
      this.controls.addEventListener('touchstart', () => {
        if (this.player.classList.contains('hide-controls')) showControls(); else hideControls();
      });
    }
    this.player.addEventListener('click', showControls);
    this.video.addEventListener('play', resetTimer);
    this.video.addEventListener('pause', showControls);
    showControls();

    // subtitle sync + save time
    this.video.addEventListener('timeupdate', () => this.highlightSubtitle());

    // open in app
    this.playApp.addEventListener('click', () => {
      if (!this.currentId) return (window.Swal || window.swal || { fire: ()=>{} }).fire?.('ID missing', 'Load a video by ID first.', 'warning');
      const encodedId = encodeURIComponent(this.currentId);
      const u = `https://thukai.github.io/redir/?link=rplayer%3A%2F%2Fopen%3Ffile%3Dindex%26id%3D${encodedId}`;
      const newTab = window.open(u, '_blank');
      if (newTab) newTab.focus();
      else (window.Swal || window.swal || { fire: ()=>{} }).fire?.('Popup blocked! Please allow popups for this site.');
    });
  }

  async load(data, id = null) {
    await this.depsReady;
    this.currentData = data || {};
    this.currentId = id || this.currentId;
    this.titleEl.innerHTML = data.title || 'Now Playing';
    this.des.innerHTML = data.description || '';

    // images
    const imgs = [];
    if (Array.isArray(data.imgs) && data.imgs.length) imgs.push(...data.imgs);
    else if (this.des.querySelectorAll('img').length) imgs.push(...Array.from(this.des.querySelectorAll('img')).map(e => e.src));
    else if (data.poster) imgs.push(data.poster);
    this.imgs.innerHTML = '';
    imgs.forEach(src => {
      const im = document.createElement('img');
      im.className = 'img';
      im.src = src;
      im.width = '100%';
      this.imgs.appendChild(im);
    });

    if (data.poster) this.video.poster = data.poster;
    await this.checkAndPromptForResume(data);
    localStorage.setItem("videoD", JSON.stringify(data));

    // sources
    if (data.srcType === 'gdrive') {
      await this.setupGdrive(data.src);
    } else if (typeof data.src === 'string' && data.src.includes('.m3u8')) {
      await playM3u8(this.video, data.src, data.poster);
      this.qualitySection.hidden = true;
    } else if (data.src) {
      this.qualitySection.hidden = true;
      this.video.src = data.src;
      this.video.onabort = () => {
        if (this.video.src.includes('/api/') && !this.video.src.includes('?download')) {
          this.video.src = this.video.src + '?download';
        }
      };
      this.video.onerror = () => {
        if (this.video.src.includes('/api/') && !this.video.src.includes('?download')) {
          this.video.src = this.video.src + '?download';
        }
      };
    }

    await this.setSubtitle(data.subfile || '');
    if (data.vbfile) {
      await this.setVibrate(data.vbfile);
      this.vibrateSection.hidden = false;
    } else {
      this.vibrateSection.hidden = true;
    }
  }

  async checkAndPromptForResume(data) {
    const lastWatchDataStr = localStorage.getItem('videoD');
    const lastWatchTime = parseFloat(localStorage.getItem('videoT') || '0');
    const lastWatchDuration = parseFloat(localStorage.getItem('videoDu') || '0');

    if (lastWatchDataStr && lastWatchTime > 0 && lastWatchDuration > 0) {
      try {
        const lastData = JSON.parse(lastWatchDataStr);
        const isSameVideo = (this.currentId && localStorage.getItem('lastVideoId') === this.currentId) || (lastData.title === data.title);
        if (isSameVideo && lastWatchTime > 30) {
          this.lastWatchData = {
            time: lastWatchTime,
            duration: lastWatchDuration,
            percentage: Math.round((lastWatchTime / lastWatchDuration) * 100)
          };
          await this.showResumePrompt();
        }
      } catch (e) {
        console.error('Error parsing last watch data:', e);
      }
    }

    if (this.currentId) localStorage.setItem('lastVideoId', this.currentId);
  }

  async showResumePrompt() {
    if (!this.lastWatchData) return;
    const Swal = window.Swal || window.swal;
    if (!Swal) return;
    const result = await Swal.fire({
      title: 'Continue Watching?',
      html: `<div style="text-align:center;">
        <p>You were <b>${this.lastWatchData.percentage}%</b> through this video</p>
        <p style="font-size:14px;color:#888;">${formatTime(this.lastWatchData.time)} / ${formatTime(this.lastWatchData.duration)}</p>
      </div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Continue',
      cancelButtonText: 'Start Over',
      reverseButtons: true
    });
    if (result.isConfirmed) {
      this.video.addEventListener('loadedmetadata', () => {
        this.video.currentTime = this.lastWatchData.time;
      }, { once: true });
    }
  }

  formatTime(t) { return formatTime(t); }

  showError(title = "Error", message = "Something went wrong!") {
    const Swal = window.Swal || window.swal || { fire: () => {} };
    Swal.fire({ icon: 'error', title, text: message });
  }

  async loadById(id, spinnerEl) {
    await this.depsReady;
    this.spinner.inject(spinnerEl || this.container);
    try {
      const url = `${this.idBaseURL}${encodeURIComponent(id)}.txt`;
      const raw = await fetch(url).then(r => r.text());
      if (!raw || raw.includes("404")) {
        this.onError ? this.onError("Not Found!", "I think its not a valid url.please check again!") : this.showError('Not Found!', 'Invalid id file.');
        return;
      }
      const sp = raw.split('RvX');
      const encrypted = sp[0];
      const key = sp[1];
      // decrypt using CryptoJS
      const dataStr = this.En.decry(encrypted, key);
      const j = JSON.parse(dataStr);
      await this.load(j, id);
      localStorage.setItem('videoD', dataStr);
      localStorage.setItem('videoT', '0');
      this.currentId = id;
    } catch (e) {
      (window.Swal || window.swal || { fire: () => {} }).fire?.('Load failed', String(e), 'error');
      throw e;
    } finally {
      this.spinner.remove(spinnerEl || this.container);
    }
  }

  play() { this.video.play(); }
  pause() { this.video.pause(); }
  toggleFullScreen() {
    if (!document.fullscreenElement) this.player.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
  destroy() { this.pause(); this.container.innerHTML = ''; }

  // Crypto helpers (via CryptoJS)
  En = {
    generateKey() {
      return window.CryptoJS.enc.Base64.stringify(window.CryptoJS.lib.WordArray.random(16));
    },
    encry(text) {
      const key = this.generateKey();
      const encrypted = window.CryptoJS.AES.encrypt(text, key).toString();
      return { text: encrypted, key };
    },
    decry(encryptedText, key) {
      const bytes = window.CryptoJS.AES.decrypt(encryptedText, key);
      return bytes.toString(window.CryptoJS.enc.Utf8);
    }
  };

  // Subtitles
  async setSubtitle(url) {
    if (!url) {
      this.subtitleDisplay.style.display = 'none';
      this.subtitleSection.hidden = true;
      this.subtitles = [];
      return;
    }
    this.subtitleDisplay.textContent = '';
    this.subtitleDisplay.style.display = 'block';
    this.subtitleSection.hidden = false;
    try {
      const txt = await fetch(url).then(r => r.text());
      this.subtitles = parseSRT(txt);
    } catch {
      this.subtitles = [];
    }
  }

  highlightSubtitle() {
    this.vibrateUp();
    const currentTime = this.video.currentTime;
    localStorage.setItem('videoT', String(currentTime));
    localStorage.setItem('videoDu', String(this.video.duration || 0));
    if (!this.subtitles || !this.subtitles.length) {
      this.subtitleDisplay.textContent = '';
      return;
    }
    for (const sub of this.subtitles) {
      const times = sub.time.split(' --> ');
      const start = convertToSeconds(times[0]);
      const end = convertToSeconds(times[1]);
      if (currentTime >= start && currentTime <= end) {
        this.subtitleDisplay.innerHTML = (sub.text || '').replace(/{\\(.*?)}/g, '');
        return;
      }
    }
    this.subtitleDisplay.textContent = '';
  }

  // Vibrations
  vibrateUp() {
    if (this.vibrate === 0) return;
    const now = this.video.currentTime * 1000;
    this.vibrations.forEach(v => {
      if (this.lastCheckTime < v.start && now >= v.start) {
        if ('vibrate' in navigator) navigator.vibrate(v.duration);
      }
    });
    this.lastCheckTime = now;
  }
  async setVibrate(url) {
    try {
      const txt = await fetch(url).then(r => r.text());
      this.vibrations = JSON.parse(txt);
      (window.Swal || window.swal || { fire: ()=>{} }).fire?.('Loaded!', '', 'success');
    } catch (er) {
      (window.Swal || window.swal || { fire: ()=>{} }).fire?.('Invalid JSON!', `${er}`, 'error');
    }
  }
  vibrationToggle() {
    this.vibrate = this.vibrate === 1 ? 0 : 1;
    this.vbBtn.textContent = this.vibrate === 1 ? 'on' : 'off';
    this.vbBtn.style.background = this.vibrate === 1 ? 'green' : 'red';
  }

  // GDrive quality
  async setupGdrive(fileId) {
    this.qualitySection.hidden = false;
    const streams = await getDriveVideoURLs(fileId, this.itagMap);
    const submenu = this.qualitySection.querySelector('.submenu');
    submenu.innerHTML = '';
    if (!streams.length) return;
    streams.forEach(stream => {
      const div = document.createElement('div');
      div.className = 'setting-sub-item';
      div.textContent = stream.quality;
      div.addEventListener('click', () => this.setQualityWhenBuffered(stream.url));
      submenu.appendChild(div);
    });
    const def = streams.find(e => e.itag == this.gdriveDefaultItag) || streams[0];
    this.video.src = def.url;
  }

  async setQualityWhenBuffered(newQualityUrl) {
    const currentTime = this.video.currentTime;
    var vids = Array.from(document.querySelectorAll('video'));
    var isOnQ = vids.length > 0 ? vids.find(vel => vel.src == newQualityUrl) : null;
    if (isOnQ == null && !this.setQuic) {
      const preloader = document.createElement('video');
      preloader.src = newQualityUrl;
      preloader.preload = 'auto';
      preloader.muted = true;
      preloader.style.display = 'none';
      document.body.appendChild(preloader);
      const checkBuffer = setInterval(() => {
        try {
          if (preloader.buffered.length > 0) {
            const bufferedEnd = preloader.buffered.end(preloader.buffered.length - 1);
            if (bufferedEnd >= currentTime) {
              clearInterval(checkBuffer);
              this.video.src = newQualityUrl;
              this.video.currentTime = currentTime;
              this.video.play();
              preloader.remove();
            }
          }
        } catch {}
      }, 500);
    } else {
      if (this.setQuic) {
        this.video.src = newQualityUrl;
        this.video.currentTime = currentTime;
        this.video.play();
      }
    }
  }
}

export default {
  create(opts) { return new RvXInstance(opts); }
};
