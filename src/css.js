// src/css.js
export const EMBEDDED_CSS = `:root{--primary:#4f46e5;--bg:#ffffff;--text:#111111;--card:#f1f1f1;--inputbg:#ffffff;--shadow:1px 2px 6px 3px rgba(0,0,0,0.6)}
.primary-color{color:var(--primary)}.primary-bg{background:var(--primary)}
html.drK{--bg:#1c1c1c;--text:#f5f5f5;--card:#2c2c2c;--inputbg:#2c2c2c}
video{width:100%;height:100%;border-radius:12px;position:relative}
video::-webkit-media-controls-fullscreen-button{display:none}
video::-webkit-media-controls-play-button{background-color:#4caf50;border-radius:50%;transition:background-color .3s}
video::-webkit-media-controls-play-button:hover{background-color:#66bb6a}
video::-webkit-media-controls-mute-button{border-radius:50%;transition:color .3s}
video::-webkit-media-controls-mute-button:hover{color:#e57373}
video::-webkit-media-controls-timeline{color:red;border-radius:5px;height:6px;background:transparent}
video::-webkit-media-controls-timeline-container{background:transparent}
video::-webkit-media-controls-played-track{background:red}
video::-webkit-media-controls-buffered-track{background:#ccc!important}
video::-webkit-media-controls-unplayed-track{background:#666!important}
video::-webkit-media-controls-seek-back-button,
video::-webkit-media-controls-seek-forward-button{background:transparent}
video::-webkit-media-controls-current-time-display{color:#25db5d;font-weight:700}
video::-webkit-media-controls-time-remaining-display{color:#fff;font-weight:700}
video::-webkit-media-controls-enclosure{border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.5)}
.player{width:auto;height:80%;margin:0;padding:0;position:relative}
.subOverlay{width:100%;height:100%;display:flex;justify-content:center;align-items:center;position:absolute;border:1px solid red}
.fullsBtn{position:absolute;top:3%;right:3%;font-size:30px;font-weight:600;color:#fff}
.vsettingDiv{width:auto;height:auto;position:absolute;top:3%;left:3%;display:block}
.vsettingDiv.active{display:block}
.Vsettings{width:auto;height:auto;background:var(--bg);color:var(--text);display:none;padding:3px;border-radius:2px}
.Vsettings.active{display:block}
.setting-item{margin:0;border-top:2px solid #000;border-bottom:2px solid #000;font-weight:900;padding:0 3px}
.setting-item p{margin:2px}
.vsettingBtn{display:block;font-size:30px;font-weight:600;color:#fff;transition:transform .5s ease}
.vsettingBtn.active{transform:rotate(90deg)}
.subOnL{padding:2px 5px;border-radius:5px;background:green;color:#fff;text-align:center;font-weight:900;width:auto}
.subOnL.Off{background:red;color:#fff}
.subDiv{width:80%;max-height:200%;margin:auto;text-align:center;margin-top:0;position:absolute;height:auto;bottom:11%;left:10%}
.subtitle{color:#fff;font-size:20px;overflow-wrap:break-word;word-break:break-word;white-space:normal;font-weight:900;pointer-events:none}
.text-shadow-border{color:#fff;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000}
.subResetBtn,.subReBtn{background:#2bd5ff;color:#000;border-radius:5px;padding:2px;margin-left:5px}
.subResetBtn:hover,.subReBtn:hover{background:#7aff00}
.vcontrols{opacity:1;transition:opacity .3s ease;pointer-events:auto}
.vplayer.hide-controls .vcontrols{opacity:0;pointer-events:none}
.videoEpiContent #EpiTitle{text-align:center}
.imgs{width:100%;display:flex;scrollbar-width:none;-ms-overflow-style:none;align-items:center;gap:5px;overflow-y:scroll;scroll-snap-type:y mandatory;scroll-snap-align:center;box-sizing:border-box;padding:10px;margin-bottom:10px}
.imgs::-webkit-scrollbar{display:none}.img{width:90%;height:auto;border-radius:5px;border:2px solid var(--text)}
.buttons{display:flex;justify-content:center;align-items:center;gap:10px;width:fit-content;text-align:center;margin-top:20px;padding:10px}
.button-play{border-radius:5px;color:#fff;padding:5px;box-shadow:var(--shadow);width:auto;position:relative;gap:10px;margin-top:10px;display:flex;justify-content:center;align-items:center;transition:box-shadow .2s,transform .2s}
.play-button span{margin:0}.bold{font-weight:900}.bg-red{background:red}.bg-green{background:green}.bg-blue{background:blue}.bg-skyblue{background:skyblue}
.lastWatchContinue{display:none;justify-content:space-between;padding:5px 10px;align-items:center;background:var(--card);box-shadow:var(--shadow);border-radius:5px;margin-top:10px}
.lastWatchContinue.active{display:flex}.lastWatchContinue .closeLastW{color:var(--primary);font-weight:900}
.lastWatchContinue h3,.lastWatchContinue h5{margin:0}
.lastWatchContinue .imgh{width:30%;height:100%;display:flex;justify-content:center;align-items:center}
.lastWatchContinue img{border-radius:4px}.video-card{background:var(--card);color:var(--text)}
.video-card .detail,.season-card .detail,.epis-card .detail{font-weight:400;font-size:10px;display:inline-block}
#videoDetailContent .imgh{width:90%;position:relative;padding:10px;display:flex;align-items:center;overflow-y:scroll;scroll-snap-type:y mandatory;height:20%;flex-shrink:5px}
#videoDetailContent .imgh img{width:90%;flex-shrink:5px;border-radius:5px;border:2px solid var(--text);margin-left:5px}
.season-des{margin:10px;box-shadow:var(--shadow);border-radius:10px;padding:10px;font-size:15px;background:#fff;color:grey}
.seasons-c,.Episodes-c{display:flex;align-items:center;flex-direction:column;padding:15px 5px}
.epis-card{width:80%;border-radius:5px;padding:5px 10px;background:var(--card);color:var(--text);box-shadow:var(--shadow);margin:10px 0}
.epis-card img{width:100%;border-radius:5px}.epis-card h3{margin:0}
.season-card{width:80%;border-radius:5px;padding:5px 10px;background:var(--card);color:var(--text);box-shadow:var(--shadow);margin:10px 0;position:relative}
.season-card img{width:100%;border-radius:5px}.season-card h3{margin:0}.season-card .des{font-size:15px;padding:5px 10px}
.next-page-btnh{width:100%;display:none;justify-content:center;align-items:center;padding:10px}.next-page-btnh .active{display:flex}
.next-page-btnh button{font-weight:900}.no-data{width:100%;padding:10px;text-align:center;display:none}.no-data .active{display:block}
.no-data h3{text-align:center;color:#3bff00}.no-data p{color:gray;font-size:10px}
.get-start-h{width:100%;height:auto;position:relative;display:none;justify-content:center;align-items:center;margin-top:10px}
.get-start{border-radius:10px;box-shadow:var(--shadow);background:var(--card);color:var(--text);width:90%;min-height:200px;text-align:center}
.detail-embed-sec{width:95%;padding:10px}.detail-embed-sec .iframe{width:100%;height:100%}
select{padding:12px 16px;font-size:16px;border:2px solid #007bff;border-radius:8px;background-color:#fff;color:#333;outline:none;appearance:none;cursor:pointer;transition:.3s ease;background-image:url('data:image/svg+xml;utf8,<svg fill="black" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');background-repeat:no-repeat;background-position:right 12px center;background-size:16px}
select:hover{background-color:#eef2f7}.nothingh{width:100%;height:auto;display:none}.vholder{display:none}
.play-app{width:100%;height:auto;padding:5px 0;background:#0BDA51;text-align:center;border-radius:3px}
.Vsettings{font-family:Arial,sans-serif;background:#222;color:#fff;padding:10px;border-radius:8px;overflow-y:scroll;max-height:40vh}
.setting-item{margin-bottom:8px}.has-submenu{cursor:pointer;background:#333;padding:10px;border-radius:6px}
.submenu-toggle{margin:0}.submenu{overflow:hidden;max-height:0;opacity:0;transition:max-height .3s ease,opacity .3s ease}
.submenu.open{max-height:500px;opacity:1}
.setting-sub-item{padding:8px 10px;background:#2b2b2b;border-bottom:1px solid #444}
.setting-sub-item:last-child{border-bottom:none}.setting-sub-item:hover{background:#3b3b3b}
`;
export default EMBEDDED_CSS;
