(function () {
  if (document.getElementById('overlay-bar')) return;

  const mkSvg = (d) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    svg.appendChild(p);
    return svg;
  };

  const mkBtn = (cls, title, icon, label) => {
    const btn = document.createElement('button');
    btn.className = cls;
    btn.title = title;
    btn.appendChild(mkSvg(icon));
    if (label) btn.appendChild(document.createTextNode(' ' + label));
    return btn;
  };

  const icons = {
    lock: 'M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6zM18 20H6V10h12v10z',
    pin: 'M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z',
    close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  };

  const bar = document.createElement('div');
  bar.id = 'overlay-bar';

  const channel = document.createElement('span');
  channel.className = 'ch';
  const match = location.pathname.match(/\/popout\/([^/]+)\//);
  if (match) channel.textContent = match[1];
  bar.appendChild(channel);

  const ctrls = document.createElement('div');
  ctrls.className = 'ctrls';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0.2';
  slider.max = '1';
  slider.step = '0.05';
  slider.value = window.__TWITCHDOCK_OPACITY__ || 1;
  slider.title = 'Opacity';
  slider.id = 'td-opacity';
  slider.setAttribute('style', 'width:60px !important;height:14px !important;cursor:pointer !important;accent-color:#9147ff !important;-webkit-appearance:auto !important;appearance:auto !important;opacity:1 !important;display:inline-block !important;visibility:visible !important;position:relative !important;');
  slider.oninput = () => console.log('__opacity__' + slider.value);

  const bLock = mkBtn('b', 'Lock position', icons.lock, 'Lock');
  const bPin = mkBtn('b', 'Always on top', icons.pin, 'Pin');
  const bClose = mkBtn('x', 'Close', icons.close);

  bLock.onclick = () => console.log('__lock__');
  bPin.onclick = () => console.log('__pin__');
  bClose.onclick = () => window.close();

  ctrls.appendChild(slider);
  ctrls.appendChild(bLock);
  ctrls.appendChild(bPin);
  ctrls.appendChild(bClose);
  bar.appendChild(ctrls);

  document.body.prepend(bar);
})();
