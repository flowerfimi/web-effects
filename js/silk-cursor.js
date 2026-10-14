/* Silk cursor — flowerfimi/web-effects. See README for usage. */
(() => {
  'use strict';
  const script = document.currentScript;
  const options = {
    color: script?.dataset.color || '',
    zIndex: script?.dataset.zIndex || '9999'
  };

  function init() {
    if (window.SilkCursor || !document.body) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'silk-cursor';
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'fixed', inset: '0', width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: options.zIndex
    });
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    document.body.appendChild(canvas);

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = matchMedia('(pointer: coarse)').matches;
    const count = coarse ? 10 : 20;
    const length = coarse ? 30 : 50;
    const target = { x: 0, y: 0 };
    const step = 1000 / 60;
    const listeners = [];
    let width = 0, height = 0, trails = [], hue = 180;
    let frame = null, previousTime = null, accumulated = 0, idle = 0;

    function listen(object, event, handler, opts) {
      object.addEventListener(event, handler, opts);
      listeners.push(() => object.removeEventListener(event, handler, opts));
    }

    function stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previousTime = null;
      accumulated = 0;
      ctx.clearRect(0, 0, width, height);
    }

    function resize() {
      stop();
      width = innerWidth;
      height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function tick() {
      for (const trail of trails) {
        let spring = trail.spring;
        trail.nodes.forEach((node, i) => {
          const leader = i ? trail.nodes[i - 1] : target;
          node.vx += (leader.x - node.x) * spring;
          node.vy += (leader.y - node.y) * spring;
          if (i) {
            node.vx += leader.vx * 0.25;
            node.vy += leader.vy * 0.25;
          }
          node.vx *= trail.friction;
          node.vy *= trail.friction;
          node.x += node.vx;
          node.y += node.vy;
          spring *= 0.98;
        });
      }
      hue = (hue + 0.5) % 360;

      // Fade only this transparent canvas, leaving the website untouched.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = options.color || `hsla(${hue},90%,60%,0.3)`;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      for (const { nodes } of trails) {
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        for (let i = 1; i < nodes.length - 2; i++) {
          const a = nodes[i], b = nodes[i + 1];
          ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
        }
        const a = nodes[nodes.length - 2], b = nodes[nodes.length - 1];
        ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
        ctx.stroke();
      }
    }

    function animate(time) {
      if (document.hidden || motion.matches) return stop();
      if (previousTime === null) previousTime = time;
      accumulated += Math.min(time - previousTime, 50);
      previousTime = time;
      while (accumulated >= step) {
        tick();
        accumulated -= step;
        idle++;
      }
      if (idle > 180) return stop();
      frame = requestAnimationFrame(animate);
    }

    function move(event) {
      if (document.hidden || motion.matches) return;
      target.x = event.clientX;
      target.y = event.clientY;
      idle = 0;
      if (frame !== null) return;
      trails = Array.from({ length: count }, (_, i) => ({
        spring: 0.45 + 0.025 * (i / count) + Math.random() * 0.1 - 0.05,
        friction: 0.5 + Math.random() * 0.01 - 0.005,
        nodes: Array.from({ length }, () => ({ ...target, vx: 0, vy: 0 }))
      }));
      frame = requestAnimationFrame(animate);
    }

    listen(window, 'pointermove', move, { passive: true });
    listen(window, 'resize', resize);
    listen(document, 'visibilitychange', () => { if (document.hidden) stop(); });
    listen(motion, 'change', stop);
    resize();
    window.SilkCursor = {
      destroy() {
        stop();
        listeners.forEach(remove => remove());
        canvas.remove();
        delete window.SilkCursor;
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
