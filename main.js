function donut() {
  const canvas = document.querySelector('#canvas');

  const canvasWidth = 80;
  const canvasHeight = 24;
  const canvasArea = canvasHeight * canvasWidth;
  const innerRadius = 2;
  const r1Points = 90;
  const r2Points = 314;
  const fov = 5;
  const what = 30;

  let A = 0;
  let B = 0;

  let shades = '.,-~:;=!*#$@'.split('');

  let b, z;

  let interval = setInterval(() => {
    b = Array(canvasArea).fill(' ');
    z = Array(7040).fill(0);

    for (let j = 0; j < 6.28; j += 6.28 / r1Points) {
      for (let i = 0; i < 6.28; i += 6.28 / r2Points) {
        let c = Math.sin(i);
        let d = Math.cos(j);
        let e = Math.sin(A);
        let f = Math.sin(j);
        let g = Math.cos(A);

        let h = d + innerRadius;

        let D = 1 / (c * h * e + f * g + fov);

        let l = Math.cos(i);
        let m = Math.cos(B);
        let n = Math.sin(B);
        let t = c * h * g - f * e;

        let x = Math.floor(canvasWidth / 2 + what * D * (l * h * m - t * n));
        let y = Math.floor(canvasHeight / 2 + (what / 2) * D * (l * h * n + t * m));
        let o = x + canvasWidth * y;
        let shadeConstant = Math.floor(((shades.length + 1) * 2) / 3);
        let N = Math.floor(shadeConstant * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n));

        if (canvasHeight > y && y > 0 && x > 0 && canvasWidth > x && D > z[o]) {
          z[o] = D;
          b[o] = shades[N > 0 ? N : 0];
        }
      }
    }

    canvas.innerHTML = '';
    let line = [];

    for (let k = 0; k < canvasArea + 1; k++) {
      if (k % canvasWidth) {
        line.push(b[k]);
      } else {
        canvas.innerHTML += line.join('') + '<br />';
        line = [];
      }

      A += 0.00004;
      B += 0.00002;
    }
  }, 17);
}

donut();
