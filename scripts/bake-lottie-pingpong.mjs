import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/images/lottie-pet.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 1. Layer 6 (Layer 25 - head/body bounce)
const l6 = data.layers[6];
delete l6.ks.p.x;

const l6Keyframes = [];
let t6 = 68;
let state6 = 0; // 0 = low (1400.84), 1 = high (1360.84)
while (t6 <= 250) {
  if (state6 === 0) {
    l6Keyframes.push({
      i: { x: 0.667, y: 1 },
      o: { x: 0.333, y: 0 },
      t: t6,
      s: [852.282, 1400.84, 0],
      to: [0, -6.667, 0],
      ti: [0, 6.667, 0],
    });
    state6 = 1;
  } else {
    l6Keyframes.push({
      i: { x: 0.667, y: 1 },
      o: { x: 0.333, y: 0 },
      t: t6,
      s: [852.282, 1360.84, 0],
      to: [0, 6.667, 0],
      ti: [0, -6.667, 0],
    });
    state6 = 0;
  }
  t6 += 7;
}
// Add final boundary keyframe
l6Keyframes.push({
  t: 250,
  s: state6 === 1 ? [852.282, 1360.84, 0] : [852.282, 1400.84, 0],
});
l6.ks.p.k = l6Keyframes;

// 2. Layer 15 (Layer 19 - tail wag)
const l15 = data.layers[15];
delete l15.ks.r.x;

const l15Keyframes = [];
let t15 = 89;
let state15 = 0; // 0 = 0 deg, 1 = 20 deg
while (t15 <= 250) {
  if (state15 === 0) {
    l15Keyframes.push({
      i: { x: [0.667], y: [1] },
      o: { x: [0.333], y: [0] },
      t: t15,
      s: [0],
    });
    state15 = 1;
  } else {
    l15Keyframes.push({
      i: { x: [0.667], y: [1] },
      o: { x: [0.333], y: [0] },
      t: t15,
      s: [20],
    });
    state15 = 0;
  }
  t15 += 15;
}
l15Keyframes.push({
  t: 250,
  s: state15 === 1 ? [20] : [0],
});
l15.ks.r.k = l15Keyframes;

fs.writeFileSync(filePath, JSON.stringify(data));
console.log('Successfully baked pingpong keyframes into lottie-pet.json and removed all expressions.');
