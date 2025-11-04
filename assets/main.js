/* assets/main.js
   Mobile sidebar toggle + mid-speed canvas matrix (0/1) + subtle nodes/lines
*/

(() => {
  /* Sidebar toggle */
  const openBtn = document.getElementById('openSidebarBtn');
  const closeBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('mobileSidebar');

  if (openBtn && closeBtn && sidebar) {
    openBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      sidebar.setAttribute('aria-hidden', 'false');
    });
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebar.setAttribute('aria-hidden', 'true');
    });
    sidebar.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebar.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* Canvas background */
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = w * DPR;
  canvas.height = h * DPR;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(DPR, DPR);

  // nodes
  const nodes = [];
  const NODE_COUNT = Math.min(60, Math.floor((w * h) / 150000));
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2
    });
  }

  // binary columns
  const cols = Math.floor(w / 18);
  const colY = new Array(cols).fill(0);
  const binaryChars = ['0', '1'];

  function draw() {
    // dim overlay
    ctx.fillStyle = 'rgba(3,6,10,0.45)';
    ctx.fillRect(0, 0, w, h);

    // links
    const MAX_DIST = 160;
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MAX_DIST) {
          const alpha = 0.12 * (1 - dist / MAX_DIST);
          ctx.strokeStyle = rgba(30,144,255,${alpha});
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }

    // nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const pulse = 0.6 + Math.sin(Date.now() * 0.002 + n.phase) * 0.6; // mid-speed
      const r = n.r * (0.8 + pulse * 0.7);
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 12);
      grad.addColorStop(0, 'rgba(30,144,255,0.95)');
      grad.addColorStop(0.3, 'rgba(30,144,255,0.28)');
      grad.addColorStop(1, 'rgba(30,144,255,0.02)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(n.x, n.y, Math.abs(r), 0, Math.PI * 2); ctx.fill();

      // move & wrap
      n.x += n.vx + Math.sin(Date.now() * 0.0008 + i) * 0.06;
      n.y += n.vy + Math.cos(Date.now() * 0.0009 + i) * 0.06;
      if (n.x < -20) n.x = w + 20;
      if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20;
      if (n.y > h + 20) n.y = -20;
    }

    // binary rain (mid-speed)
    ctx.font = '14px monospace';
    for (let c = 0; c < cols; c++) {
      const x = c * 18 + 8;
      const y = colY[c] * 16;
      const char = binaryChars[Math.floor(Math.random() * binaryChars.length)];
      ctx.fillStyle = 'rgba(30,144,255,0.9)';
      ctx.fillText(char, x, y);
      if (Math.random() > 0.995) colY[c] = 0;
      colY[c] += 0.6; // mid-speed increment
      if (colY[c] * 16 > h && Math.random() > 0.98) colY[c] = 0;
    }

    requestAnimationFrame(draw);
  }
  draw();

  // resize handler
  let to;
  window.addEventListener('resize', () => {
    clearTimeout(to);
    to = setTimeout(() => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      canvas.width = w * DPR; canvas.height = h * DPR;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }, 150);
  });
})();
