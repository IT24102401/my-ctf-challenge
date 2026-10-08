(function(){
  var canvas = document.getElementById('fireflies');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  var palette = [
    'rgba(255,214,130,ALPHA)',
    'rgba(255,236,190,ALPHA)',
    'rgba(160,210,255,ALPHA)'
  ];

  var COUNT = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 14000));

  function rand(min, max){ return Math.random() * (max - min) + min; }

  function makeFly(){
    return {
      x: rand(0, canvas.width),
      y: rand(0, canvas.height),
      r: rand(0.6, 1.8),
      baseAlpha: rand(0.2, 0.75),
      phase: rand(0, Math.PI * 2),
      flickerSpeed: rand(0.01, 0.035),
      driftX: rand(-0.08, 0.08),
      driftY: rand(-0.1, -0.02),
      swaySpeed: rand(0.002, 0.008),
      swayPhase: rand(0, Math.PI * 2),
      color: palette[Math.random() < 0.15 ? 2 : (Math.random() < 0.5 ? 0 : 1)]
    };
  }

  var flies = [];
  for (var i = 0; i < COUNT; i++) flies.push(makeFly());

  var t = 0;

  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < flies.length; i++){
      var f = flies[i];
      f.phase += f.flickerSpeed;
      var flicker = (Math.sin(f.phase) + 1) / 2;
      var alpha = f.baseAlpha * (0.35 + 0.65 * flicker);

      f.x += f.driftX + Math.sin(t * f.swaySpeed + f.swayPhase) * 0.02;
      f.y += f.driftY;

      if (f.y < -10){ f.y = canvas.height + 10; f.x = rand(0, canvas.width); }
      if (f.x < -10) f.x = canvas.width + 10;
      if (f.x > canvas.width + 10) f.x = -10;

      var col = f.color.replace('ALPHA', alpha.toFixed(3));
      var glowCol = f.color.replace('ALPHA', (alpha * 0.35).toFixed(3));

      ctx.beginPath();
      ctx.fillStyle = glowCol;
      ctx.arc(f.x, f.y, f.r * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = col;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    t += 1;
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  if (reduceMotion){
    draw();
  } else {
    requestAnimationFrame(draw);
  }
})();
