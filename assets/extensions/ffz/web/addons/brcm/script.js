(()=>{var et=Object.defineProperty;var n=(T,F)=>et(T,"name",{value:F,configurable:!0});(()=>{"use strict";var C;var T={},F={};function c(s){var e=F[s];if(e!==void 0)return e.exports;var t=F[s]={exports:{}};return T[s](t,t.exports,c),t.exports}n(c,"__webpack_require__"),c.m=T,c.d=(s,e)=>{for(var t in e)c.o(e,t)&&!c.o(s,t)&&Object.defineProperty(s,t,{enumerable:!0,get:e[t]})},c.f={},c.e=s=>Promise.all(Object.keys(c.f).reduce((e,t)=>(c.f[t](s,e),e),[])),c.u=s=>"brcm/vue.js",c.g=function(){if(typeof globalThis=="object")return globalThis;try{return this||new Function("return this")()}catch{if(typeof window=="object")return window}}(),c.o=(s,e)=>Object.prototype.hasOwnProperty.call(s,e),(()=>{var s={},e="ffz-addons:";c.l=(t,r,o,a)=>{if(s[t]){s[t].push(r);return}var i,d;if(o!==void 0)for(var l=document.getElementsByTagName("script"),m=0;m<l.length;m++){var u=l[m];if(u.getAttribute("src")==t||u.getAttribute("data-webpack")==e+o){i=u;break}}i||(d=!0,i=document.createElement("script"),i.charset="utf-8",i.timeout=120,c.nc&&i.setAttribute("nonce",c.nc),i.setAttribute("data-webpack",e+o),i.src=t,i.src.indexOf(window.location.origin+"/")!==0&&(i.crossOrigin="anonymous")),s[t]=[r];var E=n((Te,Fe)=>{i.onerror=i.onload=null,clearTimeout(N);var Ae=s[t];if(delete s[t],i.parentNode&&i.parentNode.removeChild(i),Ae&&Ae.forEach(Qe=>Qe(Fe)),Te)return Te(Fe)},"onScriptComplete"),N=setTimeout(E.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=E.bind(null,i.onerror),i.onload=E.bind(null,i.onload),d&&document.head.appendChild(i)}})(),c.r=s=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(s,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(s,"__esModule",{value:!0})},(()=>{var s;c.g.importScripts&&(s=c.g.location+"");var e=c.g.document;if(!s&&e&&(e.currentScript&&e.currentScript.tagName.toUpperCase()==="SCRIPT"&&(s=e.currentScript.src),!s)){var t=e.getElementsByTagName("script");if(t.length)for(var r=t.length-1;r>-1&&(!s||!/^http(s?):/.test(s));)s=t[r--].src}if(!s)throw new Error("Automatic publicPath is not supported in this browser");s=s.replace(/^blob:/,"").replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),c.p=s+"../"})(),(()=>{var s={287:0};c.f.j=(r,o)=>{var a=c.o(s,r)?s[r]:void 0;if(a!==0)if(a)o.push(a[2]);else{var i=new Promise((u,E)=>a=s[r]=[u,E]);o.push(a[2]=i);var d=c.p+c.u(r),l=new Error,m=n(u=>{if(c.o(s,r)&&(a=s[r],a!==0&&(s[r]=void 0),a)){var E=u&&(u.type==="load"?"missing":u.type),N=u&&u.target&&u.target.src;l.message="Loading chunk "+r+` failed.
(`+E+": "+N+")",l.name="ChunkLoadError",l.type=E,l.request=N,a[1](l)}},"loadingEnded");c.l(d,m,"chunk-"+r,r)}};var e=n((r,o)=>{var[a,i,d]=o,l,m,u=0;if(a.some(N=>s[N]!==0)){for(l in i)c.o(i,l)&&(c.m[l]=i[l]);if(d)var E=d(c)}for(r&&r(o);u<a.length;u++)m=a[u],c.o(s,m)&&s[m]&&s[m][0](),s[m]=0},"webpackJsonpCallback"),t=globalThis.ffzAddonsWebpackJsonp=globalThis.ffzAddonsWebpackJsonp||[];t.forEach(e.bind(null,0)),t.push=e.bind(null,t.push.bind(t))})();var tt={},$={};c.r($),c.d($,{color_background:n(()=>Ce,"color_background"),color_border:n(()=>$e,"color_border"),color_header_background:n(()=>ke,"color_header_background"),color_header_separators:n(()=>Ne,"color_header_separators"),color_highlight:n(()=>Pe,"color_highlight"),color_menu_item_background:n(()=>Me,"color_menu_item_background"),color_menu_item_separators:n(()=>qe,"color_menu_item_separators"),color_text:n(()=>Re,"color_text"),config_borderRadius:n(()=>ye,"config_borderRadius"),config_borderWidth:n(()=>Ee,"config_borderWidth"),config_displayHeader:n(()=>be,"config_displayHeader"),config_displayHeaderSeparators:n(()=>we,"config_displayHeaderSeparators"),config_displayMenuItemSeparators:n(()=>_e,"config_displayMenuItemSeparators"),config_headerTextSize:n(()=>Se,"config_headerTextSize"),config_menuItemTextSize:n(()=>xe,"config_menuItemTextSize"),config_menuWidth:n(()=>ve,"config_menuWidth"),css_enabled:n(()=>We,"css_enabled"),pathCSS:n(()=>A,"pathCSS"),pathColors:n(()=>x,"pathColors"),pathConfig:n(()=>S,"pathConfig")});const Ie=n(s=>({x:s.pageX?s.pageX:s.clientX+(document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft),y:s.pageY?s.pageY:s.clientY+(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)}),"getMousePos"),z=n((s,e=Number.MAX_SAFE_INTEGER,t=0)=>`${s.className} ${t<e&&s.parentElement?z(s.parentElement,e,++t):""}`,"getParentClassNames"),he=n((s,e,t=1)=>s===e?[s]:[s,...he(s+1,e)].filter(r=>r%t===0),"range"),ze=n(s=>s.split("_").map(e=>e.charAt(0).toUpperCase()+e.substring(1).toLowerCase()).join(" "),"titlize"),ue=n(s=>(s.charAt(0).toUpperCase()+s.substring(1).toLowerCase()).split("_").join(" "),"capitalize"),f=n((s,e)=>`add_ons.brcm.module.${s}.module.config.${e}`,"getConfigKey");var Le=Object.defineProperty,pe=n(s=>{throw TypeError(s)},"__typeError"),Be=n((s,e,t)=>e in s?Le(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,"__defNormalProp"),me=n((s,e,t)=>Be(s,typeof e!="symbol"?e+"":e,t),"__publicField"),Oe=n((s,e,t)=>e.has(s)||pe("Cannot "+t),"__accessCheck"),w=n((s,e,t)=>(Oe(s,e,"read from private field"),t?t.call(s):e.get(s)),"__privateGet"),De=n((s,e,t)=>e.has(s)?pe("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(s):e.set(s,t),"__privateAdd"),g;const Ue=(C=class{constructor(){De(this,g,[])}addSegment(e,t,r){const o={};return t&&(o.sort=t),r&&(o.description=r),w(this,g).push(`${e}@${JSON.stringify(o)}`),this}copy(){const e=new C;return w(this,g).forEach(t=>w(e,g).push(t)),e}toString(){const e="Add-Ons > BRCM";switch(w(this,g).length){case 0:return e.replace(">",">>");case 1:return`${e} >> ${w(this,g)[0]}`;case 2:return`${e} > ${w(this,g)[0]} >> ${w(this,g)[1]}`;default:const t=w(this,g).pop();return`${e} > ${w(this,g).join(" > ")} >> ${t}`}}},n(C,"_ConfigPath2"),C);g=new WeakMap;let P=Ue;const J=class J{constructor(e,t=new P,r,o){me(this,"config"),me(this,"key"),this.key=e,this.config={ui:{path:t.toString(),title:r||ue(e)}},o&&(this.config.ui.description=o)}setTitle(e){return this.title=e,this}setDescription(e){return this.config.ui.description=e,this}setOnChangeEvent(e){return this.config.changed=e,this}setSort(e){return this.config.ui.sort=e,this}setPath(e){return this.config.ui.path=`${e}`,this}setProcess(e){return this.config.process=e,this}setUIProcess(e){return this.config.ui.process=e,this}};n(J,"Config");let _=J;const V=class V extends _{constructor(e,t,r,o,a){super(e,r,o,a),this.config.default=t,this.config.ui.component="setting-check-box"}};n(V,"BooleanConfig");let v=V;const Y=class Y extends _{constructor(e,t,r,o,a){super(e,r,o,a),this.config.default=t,this.config.ui.component="setting-color-box"}};n(Y,"ColorConfig");let b=Y;const K=class K extends _{constructor(e,t,r,o,a,i){super(e,o,a,i),this.config.default=t,this.config.ui.data=r,this.config.ui.component="setting-select-box"}};n(K,"SelectBoxConfig");let ge=K;const Z=class Z extends _{constructor(e,t,r,o,a,i=1,d,l,m){super(e,d,l,m),this.config.default=r,this.config.ui.data=he(o,a,i).map(u=>({value:u,title:t(u)})),this.config.ui.component="setting-select-box"}};n(Z,"IntSelectBoxConfig");let L=Z;const Q=class Q extends _{constructor(e,t,r,o,a,i,d){super(e,r,i,d),this.config.default=t,this.config.ui.component="setting-text-box",a&&(this.config.process=a),o&&(this.config.ui.process=o)}};n(Q,"TextBoxConfig");let k=Q;const ee=class ee extends _{constructor(e,t,r,o,a,i,d){super(e,a,i,d),this.config.default=t,this.config.ui.process=l=>(l=parseInt(l,10),o||(o=Number.MAX_SAFE_INTEGER),r||(r=Number.MIN_SAFE_INTEGER),isNaN(l)||!isFinite(l)?t:l>o?o:l<r?r:l),this.config.ui.component="setting-text-box"}};n(ee,"IntTextBoxConfig");let fe=ee;const q=n((s,e)=>{if(s.endsWith("rem")){const t=parseInt(s.split("rem")[0]);return isNaN(t)||!isFinite(t)?`${e}px`:s}else if(s.endsWith("px")){const t=parseInt(s.split("px")[0]);return isNaN(t)||!isFinite(t)?`${e}px`:s}else{const t=parseInt(s);return isNaN(t)||!isFinite(t)?`${e}px`:`${s}px`}},"process");let B=0;const S=new P().addSegment("Config",B++),be=new v("display_header",!0,S),we=new v("display_header_separator",!0,S),_e=new v("display_menu_item_separators",!1,S),Se=new k("header_text_size","15px",S).setUIProcess(s=>q(s,15)),xe=new k("menu_item_text_size","12px",S).setUIProcess(s=>q(s,12)),ye=new k("border_radius","3px",S).setUIProcess(s=>q(s,3)),Ee=new k("border_width","1px",S).setUIProcess(s=>q(s,1)),ve=new k("menu_width","150px",S).setUIProcess(s=>q(s,150)),x=new P().addSegment("Colors",B++),ke=new b("header_background","rgb(24,24,27)",x),Me=new b("menu_item_background","rgb(31,31,35)",x),Ce=new b("background","rgb(31,31,35)",x),$e=new b("border","rgb(54,54,57)",x),Pe=new b("highlight","rgb(76,76,79)",x),Ne=new b("header_separators","rgb(53,53,57)",x),qe=new b("menu_item_separators","rgb(53,53,57)",x),Re=new b("text","rgb(255,255,255)",x),A=new P().addSegment("Custom CSS",B++),We=new v("css_enabled",!1,A,"Enabled").setSort(0);var He=Object.defineProperty,je=n((s,e,t)=>e in s?He(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,"module_defNormalProp"),p=n((s,e,t)=>je(s,typeof e!="symbol"?e+"":e,t),"module_publicField");const te=class te{constructor(e,t,r){p(this,"key"),p(this,"path"),p(this,"title"),p(this,"description"),p(this,"clickFunc"),p(this,"requiresVIP",!1),p(this,"requiresMod",!1),p(this,"requiresBroadcaster",!1),this.key=e,this.path=t,this.clickFunc=r,this.title=ue(e)}setRequiresVIP(){return this.requiresVIP=!0,this}setRequiresMod(){return this.requiresMod=!0,this}setRequiresBroadcaster(){return this.requiresBroadcaster=!0,this}setTitle(e){return this.title=e,this}setDescription(e){return this.description=e,this}onClick(e){this.clickFunc(e)}};n(te,"RightClickSubModule");let h=te;const se=class se{constructor(e,t,r){p(this,"brcm"),p(this,"key"),p(this,"name"),p(this,"path"),p(this,"supportsHeader",!1),p(this,"injects",[]),p(this,"modules",[]),p(this,"configs",[]),p(this,"displayConfigRequirements",!0),p(this,"displayMenuRequirements",!0),this.brcm=e,this.key=t,this.name=r||ze(this.key)}checkElement(e){return!1}onClickElement(e,t){return!1}};n(se,"RightClickModule");let I=se;var Xe=Object.defineProperty,Ge=n((s,e,t)=>e in s?Xe(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,"chat_module_defNormalProp"),Je=n((s,e,t)=>Ge(s,typeof e!="symbol"?e+"":e,t),"chat_module_publicField");const re=class re extends I{constructor(e){super(e,"chat"),Je(this,"user"),this.supportsHeader=!0,this.displayConfigRequirements=!1,this.displayMenuRequirements=!1,this.path=new P().addSegment(this.name);const t=this.path.copy().addSegment("Config",1),r=this.path.copy().addSegment("Toggles (User)",2),o=this.path.copy().addSegment("Toggles (Moderation)",3),a=this.path.copy().addSegment("Toggles (Broadcaster)",4);this.configs.push(new L("timeout_duration",i=>`${i} Seconds`,300,30,1800,30).setPath(t)),this.modules.push(new h("block",r,i=>i.sendMessage(`/block ${this.user}`))),this.modules.push(new h("open_in_this_tab",r,i=>window.location.href=`https://twitch.tv/${this.user}`)),this.modules.push(new h("open_in_new_tab",r,i=>window.open(`https://twitch.tv/${this.user}`,"_blank"))),this.modules.push(new h("ping",r,i=>i.sendMessage(`@${this.user}`))),this.modules.push(new h("unblock",r,i=>i.sendMessage(`/unblock ${this.user}`))),this.modules.push(new h("ban",o,i=>i.sendMessage(`/ban ${this.user}`)).setRequiresMod()),this.modules.push(new h("purge",o,i=>i.sendMessage(`/timeout ${this.user} 1`)).setRequiresMod()),this.modules.push(new h("timeout",o,i=>i.sendMessage(`/timeout ${this.user} ${i.settings.get(f(this.key,"timeout_duration"))}`)).setRequiresMod()),this.modules.push(new h("unban",o,i=>i.sendMessage(`/unban ${this.user}`)).setRequiresMod()),this.modules.push(new h("mod",a,i=>i.sendMessage(`/mod ${this.user}`)).setRequiresBroadcaster().setTitle("Add Mod")),this.modules.push(new h("vip",a,i=>i.sendMessage(`/vip ${this.user}`)).setRequiresBroadcaster().setTitle("Add VIP")),this.modules.push(new h("host",a,i=>i.sendMessage(`/host ${this.user}`)).setRequiresBroadcaster()),this.modules.push(new h("raid",a,i=>i.sendMessage(`/raid ${this.user}`)).setRequiresBroadcaster()),this.modules.push(new h("unmod",a,i=>i.sendMessage(`/unmod ${this.user}`)).setRequiresBroadcaster().setTitle("Remove Mod")),this.modules.push(new h("unvip",a,i=>i.sendMessage(`/unvip ${this.user}`)).setRequiresBroadcaster().setTitle("Remove VIP")),this.modules=this.modules.sort((i,d)=>(i=i.title.toLowerCase(),d=d.title.toLowerCase(),i<d?-1:i>d?1:0))}checkElement(e){return z(e,5).includes("chat-line__message")}onClickElement(e,t){let r,o=e.target;for(;o.parentElement;)if(o.classList.contains("chat-line__message")){r=o;break}else o=o.parentElement;if(!r||!r.hasAttribute("data-user"))return!0;this.user=r.getAttribute("data-user"),this.userID=r.getAttribute("data-user-id"),this.room=r.getAttribute("data-room"),this.roomID=r.getAttribute("data-room-id");const a=t.getElementsByClassName("header");a.length===1&&(a[0].innerText=this.user,this.brcm.twitch_data.getUser(this.userID).then(i=>{i.stream&&(a[0].innerText+=" (Live)")}))}};n(re,"ChatModule");let O=re;const ie=class ie extends I{constructor(e){super(e,"video_player"),this.injects=["site.player"],this.path=new P().addSegment(this.name);const t=this.path.copy().addSegment("Config",1),r=this.path.copy().addSegment("Toggles",2);this.modules.push(new h("clip",r,o=>{const a=document.querySelectorAll('[data-a-target="player-clip-button"]');a.length===1?a[0].click():alert("ERROR: Couldn't find clip button.")})),document.pictureInPictureEnabled&&this.modules.push(new h("picture_in_picture",r,o=>o.player.Player.instances.forEach(a=>o.player.pipPlayer(a)))),this.modules.push(new h("reset_player",r,o=>o.player.Player.instances.forEach(a=>o.player.resetPlayer(a))))}checkElement(e){return z(e).includes("video-player__container")}onClickElement(e,t){}};n(ie,"VideoPlayerModule");let D=ie;var Ve=Object.defineProperty,Ye=n((s,e,t)=>e in s?Ve(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,"preset_defNormalProp"),U=n((s,e,t)=>Ye(s,typeof e!="symbol"?e+"":e,t),"preset_publicField");const ne=class ne{constructor(e,t,r){U(this,"key"),U(this,"name"),U(this,"css"),this.key=e,this.name=t,this.css=r.trim()}};n(ne,"Preset");let M=ne;const oe=class oe extends M{constructor(){super("ffdark","Firefox (Dark)",`#brcm-main-container .show {
	background-color: rgb(59,63,69);
	border:           1px solid rgb(95,98,102);
	border-radius:    0px;
	color:            rgb(255,255,255);
	box-shadow:       0 0 10px rgba(0,0,0,0.75);
	min-width:        190px;
	
	padding-top:      2px;
	padding-bottom:   2px;
	padding-left:     2px;
	padding-right:    2px;
}

#brcm-main-container .show li.separator-header {
	background-color: rgb(71,77,82);
	height:           1px;
	margin-left:      12px;
}

#brcm-main-container .show li.separator-menu-item {
	background-color: rgb(71,77,82);
	height:           1px;
	margin-left:      20px;
}

#brcm-main-container .show li.header {
	background-color: rgb(59,63,69);
	font-size:        14px;
	padding-top:      6px;
	padding-bottom:   6px;
	padding-left:     10px;
	padding-right:    10px;
}

#brcm-main-container .show li:not(.separator-menu-item):not(.separator-header):not(.header) {
	background-color: rgb(59,63,69);
	font-size:        12px;
	padding-top:      3px;
	padding-bottom:   2px;
	padding-left:     23px;
	padding-right:    6px;
}

#brcm-main-container .show li:not(.separator-menu-item):not(.separator-header):not(.header):hover {
	background-color: rgb(87,91,96);
}`)}};n(oe,"FirefoxDarkPreset");let W=oe;const ae=class ae extends M{constructor(){super("fflight","Firefox (Light)",`#brcm-main-container .show {
	background-color: rgb(242,242,242);
	border:           1px solid rgb(221,221,221);
	border-radius:    0px;
	color:            rgb(0,0,0);
	box-shadow:       0 0 10px rgba(0,0,0,0.75);
	min-width:        190px;
	
	padding-top:      2px;
	padding-bottom:   2px;
	padding-left:     2px;
	padding-right:    2px;
}

#brcm-main-container .show li.separator-header {
	background-color: rgb(221,221,221);
	height:           1px;
	margin-left:      12px;
}

#brcm-main-container .show li.separator-menu-item {
	background-color: rgb(221,221,221);
	height:           1px;
	margin-left:      20px;
}

#brcm-main-container .show li.header {
	background-color: rgb(242,242,242);
	font-size:        14px;
	padding:          6px 10px;
}

#brcm-main-container .show li:not(.separator-menu-item):not(.separator-header):not(.header) {
	background-color: rgb(242,242,242);
	font-size:        12px;
	padding-top:      3px;
	padding-bottom:   2px;
	padding-left:     23px;
	padding-right:    6px;
}

#brcm-main-container .show li:not(.separator-menu-item):not(.separator-header):not(.header):hover {
	background-color: rgb(144,201,246);
}`)}};n(ae,"FirefoxLightPreset");let H=ae;const ce=class ce extends M{constructor(){super("twitch","Twitch (Default)",`#brcm-main-container .show {
		border:           1px solid #232223;
		border-radius:    3px;
		color:            #FFFFFF;
		box-shadow:       0 0 3px rgb(0,0,0);
		min-width:        150px;
}

#brcm-main-container .show li.separator-header {
		background-color: #232223;
		height:           1px;
}

#brcm-main-container .show li.separator-menu-item {
		background-color: #232223;
		height:           1px;
}

#brcm-main-container .show li.header {
		background-color: #18181B;
		font-size:        15px;
		padding:          2px 6px;
}

#brcm-main-container .show li:not(.separator-menu-item):not(.separator-header):not(.header) {
		background-color: #1E1E22;
		font-size:        12px;
		padding:          4px 6px;
}

#brcm-main-container .show li:not(.separator-menu-item):not(.separator-header):not(.header):hover {
		background-color: #772CE8;
}`)}};n(ce,"TwitchDefaultPreset");let j=ce;const de=class de extends M{constructor(){super("twitch_ffz","Twitch (FFZ)",`#brcm-main-container .show {
    color:            var(--color-text-base) !important;
    background-color: var(--color-background-alt) !important;
    border:           var(--border-width-default) solid var(--color-border-base) !important;
    box-shadow:       var(--shadow-elevation-3) !important;
    border-radius:    var(--border-radius-small) !important;
    min-width:        150px !important;
}

#brcm-main-container .show li.separator-header {
    background-color: var(--color-border-base) !important;
    height:           var(--border-width-default) !important;
}

#brcm-main-container .show li.separator-menu-item {
    background-color: var(--color-border-base) !important;
    height:           var(--border-width-default) !important;
}

#brcm-main-container .show li.header {
    background-color: var(--color-background-base) !important;
    font-size:        var(--font-size-4) !important;
    padding:          var(--button-padding-y) var(--button-padding-x) !important;
}

#brcm-main-container .show li:not(.separator-menu-item):not(.separator-header):not(.header) {
    font-size:        var(--font-size-5) !important;
    padding:          var(--button-padding-y) var(--button-padding-x) !important;
}

#brcm-main-container .show li:not(.separator-menu-item):not(.separator-header):not(.header):hover {
    background-color: var(--color-background-button-text-hover) !important;
}`)}};n(de,"TwitchFZZPreset");let X=de;var Ke=Object.defineProperty,Ze=n((s,e,t)=>e in s?Ke(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,"brcm_defNormalProp"),R=n((s,e,t)=>Ze(s,typeof e!="symbol"?e+"":e,t),"brcm_publicField");const{createElement:y}=FrankerFaceZ.utilities.dom,le=class le extends FrankerFaceZ.utilities.addon.Addon{constructor(...e){super(...e),R(this,"modules",[new O(this),new D(this)]),R(this,"menuPresets",[new M("empty","Custom",""),new j,new X,new W,new H]),R(this,"customStyleElement"),R(this,"staticStyleElement"),R(this,"containerElement"),this.log.info("Constructing BRCM");const t=["chat.actions","chat.badges","site.chat","site.twitch_data"];this.modules.forEach(r=>r.injects.forEach(o=>t.push(o))),[...new Set(t)].forEach(r=>this.inject(r)),this.loadMenuSettings(),this.loadModuleSettings(),this.loadDevBadge(),this.log.info("Successfully constructed BRCM")}loadMenuSettings(){let e=0;for(const t in $)$[t]instanceof _&&this.settings.add(f("menu",$[t].key),$[t].setSort(e++).setOnChangeEvent(()=>this.reloadElements()).config);this.settings.addUI(f("menu","css"),{ui:{path:`${A}`,sort:999999,title:"Preset",description:"Presets require Custom CSS to be enabled. Twitch (FFZ) preset uses variables provided by FFZ to mimic the custom style set by yourself.",data:this.menuPresets.map(t=>({value:t.key,title:t.name})),component:n(()=>c.e(554).then(c.bind(c,9500)),"component"),getPreset:n(t=>this.menuPresets[t],"getPreset"),onChange:n(()=>this.reloadElements(),"onChange")}}),this.settings.add(f("menu","css"),{default:this.menuPresets[0].css,ui:{path:`${A}`,sort:Number.MAX_SAFE_INTEGER,value:this.getCSS(),component:n(()=>c.e(554).then(c.bind(c,7892)),"component"),isValid:n(t=>this._getCSS()!==t,"isValid"),changed:n(()=>{this.setCSS(),this.setHTML()},"changed")}})}loadModuleSettings(){let e=0,t=0;for(const r of this.modules){this.settings.add(f(r.key,"enabled"),new v("enabled",!0,r.path.copy().addSegment(`Main ${r.name} Toggle`,-100).toString()).setOnChangeEvent(()=>this.reloadElements()).config);for(const o of r.configs)this.settings.add(f(r.key,o.key),o.setSort(t++).setOnChangeEvent(()=>this.reloadElements()).config);for(const o of r.modules){const a={default:!0,ui:{sort:e++,path:`${o.path}`,title:(r.displayConfigRequirements?o.requiresMod?"(Moderator) ":o.requiresBroadcaster?"(Broadcaster) ":"":"")+o.title,component:"setting-check-box"},changed:n(()=>this.reloadElements(),"changed")};o.description&&(a.ui.description=o.description),this.settings.add(f(r.key,o.key),a)}}}onEnable(){this.log.info("Setting up BRCM"),document.body.appendChild(this.containerElement=y("div",{id:"brcm-main-container",className:"chat-shell"})),document.head.appendChild(this.staticStyleElement=y("style",null,this.getStaticCSS())),this.reloadElements(),document.addEventListener("contextmenu",e=>this.onRightClick(e)),document.addEventListener("click",e=>this.onLeftClick(e)),this.log.info("Successfully setup BRCM")}onDisable(){this.log.info("Disabling BRCM"),document.removeEventListener("contextmenu",e=>this.onRightClick(e)),document.removeEventListener("click",e=>this.onLeftClick(e)),this.containerElement&&(this.containerElement.remove(),this.containerElement=null),this.customStyleElement&&(this.customStyleElement.remove(),this.customStyleElement=null),this.staticStyleElement&&(this.staticStyleElement.remove(),this.staticStyleElement=null),this.log.info("Successfully disabled BRCM")}onRightClick(e){for(const t of this.containerElement.children)if(t===e.target.parentElement){this.onLeftClick(e),e.preventDefault();return}for(const t of this.containerElement.children)if(t.className==="show"){t.className="hide",e.preventDefault();return}for(const t of this.modules)if(this.settings.get(f(t.key,"enabled"))&&t.checkElement(e.target)){const r=document.getElementById(`brcm-${t.key}-menu`);if(t.onClickElement(e,r))continue;e.preventDefault();const o=Ie(e);r.className="show",r.style.top=`${o.y-(window.innerHeight-e.pageY>r.offsetHeight?0:r.offsetHeight)}px`,r.style.left=`${o.x-(window.innerWidth-e.pageX>r.offsetWidth?0:r.offsetWidth)}px`;break}}onLeftClick(e){for(const t of this.containerElement.children)if(t.className==="show"&&(t.className="hide"),e.target.parentElement===t&&t.id.split("-").length===3){const r=t.id.split("-")[1],o=this.modules.filter(a=>a.key===r);if(o.length===1){const i=o[0].modules.filter(d=>d.key===e.target.className);if(i.length===1){const d=i[0];(!d.requiresMod||this.isMod())&&d.onClick(this)}}}}reloadElements(){console.log("reloading"),this.setCSS(),this.setHTML();const e=document.getElementById("brcm-css-text-area");e&&!this.getMenuSetting("css")&&(e.textContent=this.getCSS())}setHTML(){this.containerElement&&(this.containerElement.remove(),document.body.appendChild(this.containerElement=y("div",{id:"brcm-main-container",className:"chat-shell"})),this.modules.forEach(e=>{const t=y("ul",{id:`brcm-${e.key}-menu`,className:"hide"});this.getMenuSetting(be)&&e.supportsHeader&&(t.appendChild(y("li",{className:"header"})),this.getMenuSetting(we)&&t.appendChild(y("li",{className:"separator-header"}))),e.modules.filter(r=>this.settings.get(f(e.key,r.key))).filter(r=>r.requiresVIP?this.isVIP():!0).filter(r=>r.requiresMod?this.isMod():!0).filter(r=>r.requiresBroadcaster?this.isBroadcaster():!0).forEach(r=>{this.getMenuSetting(_e)&&t.childElementCount>0&&(!t.lastElementChild||!t.lastElementChild.className.includes("separator"))&&t.appendChild(y("li",{className:"separator-menu-item"})),t.appendChild(y("li",{className:r.key},(e.displayMenuRequirements?r.requiresMod?"(Mod) ":r.requiresBroadcaster?"(Streamer) ":"":"")+r.title))}),this.containerElement.appendChild(t)}))}setCSS(){const e=this.getCSS();this.customStyleElement?this.customStyleElement.textContent=e:document.head.appendChild(this.customStyleElement=y("style",null,e))}getCSS(){return this.getMenuSetting("css_enabled")?this.getMenuSetting("css")?this.getMenuSetting("css"):this._getCSS():this._getCSS()}_getCSS(){return`#brcm-main-container .show {
	background-color: ${this.getMenuSetting(Ce)};
	border:           ${this.getMenuSetting(Ee)} solid ${this.getMenuSetting($e)};
	border-radius:    ${this.getMenuSetting(ye)};
	color:            ${this.getMenuSetting(Re)};
	box-shadow:       0 0 3px rgb(0,0,0);
	min-width:        ${this.getMenuSetting(ve)};
}

#brcm-main-container .show li.separator-header {
	background-color: ${this.getMenuSetting(Ne)};
	height:           1px;
}

#brcm-main-container .show li.separator-menu-item {
	background-color: ${this.getMenuSetting(qe)};
	height:           1px;
}

#brcm-main-container .show li.header {
	background-color: ${this.getMenuSetting(ke)};
	font-size:        ${this.getMenuSetting(Se)};
	padding-top:      2px;
	padding-bottom:   2px;
	padding-left:     6px;
	padding-right:    6px;
}

#brcm-main-container .show li:not(.separator-menu-item):not(.separator-header):not(.header) {
	background-color: ${this.getMenuSetting(Me)};
	font-size:        ${this.getMenuSetting(xe)};
	padding-top:      4px;
	padding-bottom:   4px;
	padding-left:     6px;
	padding-right:    6px;
}

#brcm-main-container .show li:not(.separator-menu-item):not(.separator-header):not(.header):hover {
	background-color: ${this.getMenuSetting(Pe)};
}`}getStaticCSS(){return`#brcm-css-text-area {
	font-family:        "Roboto Mono";
}

#brcm-main-container .show {
	display:            block;
	position:           absolute;
	z-index:            ${Number.MAX_SAFE_INTEGER};
}

#brcm-main-container .hide {
	display:            none;
}

#brcm-main-container .show li {
	list-style-type:    none;
}

#brcm-main-container .show li:not(.separator-menu-item):not(.separator-header):not(.header):hover {
	background-color: var(--color-background-accent);
	cursor:           default;
}`}sendMessage(e){this.chat.ChatService.first.sendMessage(e)}isVIP(e=!1){return(e?!1:this.isMod())||this.chat.ChatContainer.first.props.commandPermissionLevel===1}isMod(e){return(e?!1:this.isBroadcaster())||this.chat.ChatContainer.first.props.commandPermissionLevel===2}isBroadcaster(){return this.chat.ChatContainer.first.props.commandPermissionLevel===3}getMenuSetting(e){return this.settings.get(f("menu",e.key||e))}loadDevBadge(){this.badges.loadBadgeData("add_ons.brcm--badge-developer",{id:"brcm_developer",title:"BRCM Developer",slot:7,color:"#71D400",image:"https://i.imgur.com/OFA5S7d.png",urls:{1:"https://i.imgur.com/OFA5S7d.png",2:"https://i.imgur.com/bkIP2Sq.png",4:"https://i.imgur.com/rrD2aTS.png"}}),this.resolve("chat").getUser(523772148,"l3afme").addBadge("add_ons.brcm","add_ons.brcm--badge-developer")}};n(le,"BetterRightClickMenuAddon");let G=le;G.register("brcm",null,"1.0.0")})();})();

//# sourceMappingURL=script.js.map