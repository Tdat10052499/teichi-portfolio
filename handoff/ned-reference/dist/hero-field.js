// A lightweight elastic field. Shared with the page's RAF; no cursor overlay.
export function initHeroField(hero, canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { update() {} };
  let width = 0, height = 0, points = [], columns = 0, visible = true;
  let time = 0, dirty = true, wasMoving = true;
  const pointer = { x: 0, y: 0, active: false };
  let ripples = [];
  const coarse = matchMedia('(pointer: coarse)');
  function resize() {
    width = hero.clientWidth; height = hero.clientHeight;
    const dpr = Math.min(devicePixelRatio, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    columns = Math.ceil(width / 42) + 3;
    const rows = Math.ceil(height / 38) + 3;
    points = Array.from({ length: columns * rows }, (_, i) => ({
      x: (i % columns) * 42 - 42, y: Math.floor(i / columns) * 38 - 38,
      dx: 0, dy: 0, px: 0, py: 0, light: 0,
    }));
    dirty = true;
  }
  function locate(e) {
    const r = hero.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
  }
  hero.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    locate(e); pointer.active = true;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.active = false; });
  hero.addEventListener('pointerdown', e => {
    if (document.body.classList.contains('motion-off') || e.target.closest('a,button,select,input,[role="button"]')) return;
    locate(e); ripples.push({ x: pointer.x, y: pointer.y, age: 0 });
    ripples = ripples.slice(-3);
  }, { passive: true });
  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(hero);
  resize();
  return {
    update(dt, moving) {
      if (!visible) return;
      if (moving !== wasMoving) { dirty = true; wasMoving = moving; ripples = []; }
      if (!moving && !dirty) return;
      if (moving) time += dt;
      dirty = false;
      ctx.clearRect(0, 0, width, height);
      const blend = 1 - Math.exp(-dt * 9);
      ripples.forEach(r => r.age += dt);
      ripples = ripples.filter(r => r.age < 2.4);
      for (const p of points) {
        // Broad contours feel like a sheet of fabric, rather than a particle cloud.
        const wave = Math.sin(p.x / 205 + p.y / 190 + (moving ? time * .14 : 0));
        const baseY = p.y + wave * 30 + Math.sin(p.x / 340 - p.y / 210) * 26;
        const dx = p.x - pointer.x, dy = baseY - pointer.y;
        const distance = Math.hypot(dx, dy), influence = pointer.active && moving && !coarse.matches ? Math.max(0, 1 - distance / 190) : 0;
        const push = influence * influence * 34;
        let targetX = distance > 1 ? dx / distance * push : 0;
        let targetY = distance > 1 ? dy / distance * push : 0;
        let rippleLight = 0;
        for (const r of ripples) {
          const rx = p.x - r.x, ry = baseY - r.y, d = Math.hypot(rx, ry);
          const force = Math.exp(-Math.pow((d - r.age * 230) / 48, 2)) * 19 * (1 - r.age / 2.4);
          if (d > 1) { targetX += rx / d * force; targetY += ry / d * force; }
          rippleLight += force / 100;
        }
        p.dx = moving ? p.dx + (targetX - p.dx) * blend : 0;
        p.dy = moving ? p.dy + (targetY - p.dy) * blend : 0;
        p.px = p.x + p.dx; p.py = baseY + p.dy;
        // Leave the headline quiet. Keep the brighter field around Mây.
        const right = Math.min(1, Math.max(0, (p.x / width - .35) * 2));
        const bottom = Math.min(1, Math.max(0, (p.y / height - .48) * 3));
        p.light = .025 + Math.max(right * .17, bottom * .10) + influence * .28 + Math.min(rippleLight, .15);
      }
      ctx.lineWidth = .65;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        ctx.strokeStyle = `rgba(190,213,136,${p.light})`;
        ctx.beginPath();
        if (i % columns < columns - 1) { const n = points[i + 1]; ctx.moveTo(p.px,p.py);ctx.lineTo(n.px,n.py); }
        if (i + columns < points.length) { const n = points[i + columns];ctx.moveTo(p.px,p.py);ctx.lineTo(n.px,n.py); }
        ctx.stroke();
        if (i % 3 === 0) {
          ctx.fillStyle = `rgba(217,255,98,${Math.min(.75,p.light * 2.3)})`;
          ctx.fillRect(p.px - 1, p.py - 1, 2, 2);
        }
      }
    },
  };
}
