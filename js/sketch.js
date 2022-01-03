let _aryObjects = [];

function setup() {
  var canvas = createCanvas(500, 500);

canvas.parent('abc');
  let canvasSize;
  if (windowWidth <= windowHeight) {
    canvasSize = windowWidth;
  } else {
    canvasSize = windowHeight;
  }
  createCanvas(canvasSize, canvasSize);
  frameRate(30);
  noStroke();

  let objectNum = 80*random(0.2, 1);
  let rMax = width/10*12;
  let yGap = height/objectNum/1.5;

  let divideNum = 128;
  let noiseSeedRad = random(10);
  let noiseStepObj = random(0.001, 0.1);
  let rOffset = -0.5;
  let noiseSeedT = random(10);
  let noiseSpeedT = 0.01;

  for (let i = 0; i < objectNum; i++) {
    let myArc = new Arc(rMax, i, objectNum, yGap,
      divideNum, noiseSeedRad, noiseSeedT + i*noiseStepObj,
      noiseSpeedT, rOffset);
    _aryObjects.push(myArc);
  }
}

class Arc {
  constructor(rMax, obj_i, objectNum, yGap,
    divideNum, noiseSeedRad, noiseSeedT, 
    noiseSpeedT, rOffset) {
    this.centX = 0;
    this.centY = yGap * (objectNum - obj_i) - height/3;
    this.objectNum = objectNum;
    this.rMax = rMax;
    this.color = color(random([0, 250]), random([0, 100]), random([100, 200]), 255);
    this.obj_i = obj_i;
    this.divideNum = divideNum;
    this.noiseSeedRad = noiseSeedRad;
    this.noiseSeedT = noiseSeedT;
    this.noiseSpeedT = noiseSpeedT;
    this.rOffset = rOffset;
  }
  drawMe() {
    this.noiseSeedT += this.noiseSpeedT;
    fill(this.color);
    let d = 1;
    let rx_0;
    let ry_0;
    let rx_last;
    let ry_last;
    beginShape();
    let currentNoiseVal = 0;
    for (let i = 0; i < this.divideNum; i++) {
      let tgt_i = i;
      if (tgt_i >= this.divideNum) { tgt_i -= this.divideNum; }
      let maxAng = 2*PI/this.divideNum*tgt_i;
      let rx = this.rMax * (noise(this.noiseSeedRad, this.noiseSeedT)+this.rOffset)**d * cos(maxAng);
      let ry = this.rMax * (noise(this.noiseSeedRad, this.noiseSeedT)+this.rOffset)**d * sin(maxAng)/2.5;
      if (tgt_i == 0) {
        rx_0 = rx;
        ry_0 = ry; 
      } else if (tgt_i == this.divideNum - 2) {
        rx_last = rx;
        ry_last = ry;
      } else if (tgt_i == this.divideNum - 1) {
        rx = (rx_0 + rx_last) / 2;
        ry = (ry_0 + ry_last) / 2;
      }
      vertex(this.centX + rx, this.centY + ry);
    }
      beginContour();
      currentNoiseVal = 0;
      for (let i = 0; i < this.divideNum; i++) {
        let tgt_i = i;
        if (tgt_i >= this.divideNum) { tgt_i -= this.divideNum; }
        let maxAng = 2*PI/this.divideNum*tgt_i;
        let rx = this.rMax * (noise(this.noiseSeedRad, this.noiseSeedT+0.1)+this.rOffset)**d * cos(-maxAng+PI/2);
        let ry = this.rMax * (noise(this.noiseSeedRad, this.noiseSeedT+0.1)+this.rOffset)**d * sin(-maxAng+PI/2)/2.5;
        if (tgt_i == 0) {
          rx_0 = rx;
          ry_0 = ry; 
        } else if (tgt_i == this.divideNum - 2) {
          rx_last = rx;
          ry_last = ry;
        } else if (tgt_i == this.divideNum - 1) {
          rx = (rx_0 + rx_last) / 2;
          ry = (ry_0 + ry_last) / 2;
        }
        vertex(this.centX + rx/1.1, this.centY + ry/1.1);
      }
      endContour();
    endShape();
  }
}

function draw() {
  background(0);
  push();
  translate(width/2, height/2);
  for(let i = 0; i < _aryObjects.length; i++) {
    _aryObjects[i].drawMe();
  }
  pop();
}