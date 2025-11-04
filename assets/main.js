// Sidebar toggle (mobile)
(function(){
  const openBtn = document.getElementById('openSidebarBtn');
  const closeBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('mobileSidebar');

  if(openBtn && closeBtn && sidebar){
    openBtn.addEventListener('click', ()=> sidebar.classList.add('open'));
    closeBtn.addEventListener('click', ()=> sidebar.classList.remove('open'));
    // close on link click
    sidebar.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=> sidebar.classList.remove('open'));
    });
  }
})();

// Animated network canvas (lightweight, shared)
(function(){
  const canvas = document.getElementById('networkCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let DPR = Math.max(1, window.devicePixelRatio || 1);
  function resize(){
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  resize();
  window.addEventListener('resize', ()=> { DPR = Math.max(1, window.devicePixelRatio || 1); resize(); });

  // nodes
  const nodes = [];
  const NODE_COUNT = 36;
  const MAX_DIST = 160;
  function rand(min,max){return Math.random()*(max-min)+min}
  for(let i=0;i<NODE_COUNT;i++){
    nodes.push({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      vx: rand(-0.25,0.25),
      vy: rand(-0.25,0.25),
      r: rand(1.2,3.0),
      phase: Math.random()*Math.PI*2
    });
  }

  function step(){
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    // dark translucent overlay
    ctx.fillStyle = 'rgba(6,8,10,0.42)';
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);

    // links
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx,dy);
        if(dist < MAX_DIST){
          const alpha = 0.12*(1 - dist/MAX_DIST);
          ctx.strokeStyle = rgba(30,144,255,${alpha});
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    // nodes
    nodes.forEach((n, idx)=>{
      const pulse = 0.5 + Math.sin(Date.now()*0.002 + n.phase)*0.5;
      const r = n.r * (0.8 + pulse*0.6);
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 12);
      grad.addColorStop(0, 'rgba(30,144,255,0.95)');
      grad.addColorStop(0.3, 'rgba(30,144,255,0.28)');
      grad.addColorStop(1, 'rgba(30,144,255,0.02)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x,n.y, Math.abs(r), 0, Math.PI*2);
      ctx.fill();

      // move
      n.x += n.vx + Math.sin(Date.now()*0.0008 + idx)*0.08;
      n.y += n.vy + Math.cos(Date.now()*0.0007 + idx)*0.08;

      // wrap
      if(n.x < -20) n.x = window.innerWidth + 20;
      if(n.x > window.innerWidth + 20) n.x = -20;
      if(n.y < -20) n.y = window.innerHeight + 20;
      if(n.y > window.innerHeight + 20) n.y = -20;
    });

    requestAnimationFrame(step);
  }
  step();
})();
