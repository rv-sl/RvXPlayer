// src/html.js
export function playerHTML() {
  return `
  <div class="rvx-wrap">
    <h1 style="text-align:center;"><span class="videoTitle" id="videoTitle" style="font-family: Josefin Sans;">Loading...</span></h1>
    <div class="vholder" style="display:block;">
      <div class="imgs"></div>
      <div class="vplayer player">
        <video controls controlslist="nodownload" id="fullscreenVideo"></video>
        <div class="subtitle text-shadow-border subDiv" id="subT">here...</div>
        <div class="vcontrols">
          <span preload="true" class="fullsBtn material-icons">fullscreen</span>
          <div class="vsettingDiv">
            <span class="vsettingBtn material-icons">settings</span>
            <div class="Vsettings">
              <div class="setting-item subtitle-setting-sec has-submenu">
                <p class="submenu-toggle">🎬 Subtitle Settings ▼</p>
                <div class="submenu">
                  <div class="setting-sub-item">
                    <p>Change Subtitle Size</p>
                    <input id="subSizeChange" min="1" max="38" type="range" value="20" />
                    Size: <span class="subSizeDisplay" id="subSizeDisplay">20px</span>
                    <span class="subResetBtn">Reset</span>
                  </div>
                  <div class="setting-sub-item">
                    <p>On/Off - Subtitles</p>
                    <input checked class="subOnOff" hidden id="subOn" name="subOn" type="checkbox" />
                    <label for="subOn" class="subOnL">On</label>
                  </div>
                  <div class="setting-sub-item">
                    <p>Color for Subs</p>
                    <label for="color">Choose a color:</label>
                    <input type="color" id="color" name="color" value="#ffffff">
                    <span class="subReBtn">Reset color</span>
                  </div>
                </div>
              </div>
              <div class="setting-item quality-section has-submenu">
                <p class="submenu-toggle">⚡ Quality Settings ▼</p>
                <div class="submenu"></div>
              </div>
              <div class="setting-item vibration-subm has-submenu">
                <p class="submenu-toggle">🔥 Vibration Settings ▼</p>
                <div class="submenu"><div class="setting-sub-item vb-s">on</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="des"></div>
      <div class="play-app">Open in app</div>
    </div>
    <div class="nothingh" style="display:none;">
      <center>
        <img src="https://raw.githubusercontent.com/Ravindu2355/Img/refs/heads/main/Gif/ladyvampire_agadmaqaasxusqk-ezgif.com-gif-to-webp-converter.webp" width="80%">
      </center>
    </div>
  </div>`;
}
