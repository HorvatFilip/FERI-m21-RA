let nSeg = 5;
let segLen = 30;

let segInput;
let lenInput;
let dInput;
let gInput;
let maxIterCountInput;
let d = 10;
let g = 180;
let maxIterCount = 3000;
let chainStartingPos;

let currentAngles = [];
let chainDrawInfo = [];
let chainPoints = [];

function setup() {
    createCanvas(windowWidth, windowHeight);

    let segInputLabel = createDiv('Number of segments in chain:');
    segInputLabel.position(20, 0);

    segInput = createInput(nSeg.toString());
    segInput.position(20, 25);
    segInput.input(update_nSeg);

    let lenInputLabel = createDiv('Segment length:');
    lenInputLabel.position(20, 50);

    lenInput = createInput(segLen.toString());
    lenInput.position(20, 75);
    lenInput.input(update_lenInput);

    let dInputLabel = createDiv('d:');
    dInputLabel.position(20, 125);

    dInput = createInput(d.toString());
    dInput.position(20, 150);
    dInput.input(update_d);

    let gInputLabel = createDiv('g:');
    gInputLabel.position(20, 175);

    gInput = createInput(g.toString());
    g = g * 0.017453
    gInput.position(20, 200);
    gInput.input(update_g);

    let maxIterCountInputLabel = createDiv('Max iter count:');
    maxIterCountInputLabel.position(20, 225);

    maxIterCountInput = createInput(maxIterCount.toString());
    maxIterCountInput.position(20, 250);
    maxIterCountInput.input(update_maxIterCount);

    updateChainConfig();
}

function updateChainConfig() {
    chainStartingPos = createVector(width / 2, height / 2);
    currentAngles = [];
    chainDrawInfo = [];
    let lineWidth = nSeg + 1;
    for (let i = 0; i < nSeg; i++) {
        currentAngles.push(
            random(0, PI)
        );
        let color = {
            r: random(255),
            g: random(255),
            b: random(255)
        }
        lineWidth -= 1;
        chainDrawInfo.push(
            {
                color: color,
                thickness: lineWidth
            }
        );
    }
}

function update_nSeg() {
    nSeg = int(this.value());
    updateChainConfig();
}

function update_lenInput() {
    segLen = int(this.value());
    updateChainConfig();
}

function update_d() {
    d = int(this.value());
    updateChainConfig();
}

function update_g() {
    g = int(this.value());
    g = g * 0.017453
    updateChainConfig();
}

function update_maxIterCount() {
    maxIterCount = int(this.value());
    updateChainConfig();
}

function distance(p1, p2) {
    return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
    );
}

function err(angles, target) {
    let chain = generateChain(chainStartingPos, angles);
    let lastElement = chain[chain.length - 1];
    return distance(target, lastElement.pos);
    return Math.sqrt(
        Math.pow(target.x - lastElement.pos.x, 2) + Math.pow(target.y - lastElement.pos.y, 2)
    );
}

function optimization_IK(d, g, maxIterCount, target) {
    let iterCount = 0;
    let gradients = Array(currentAngles.length).fill(0);
    while (err(currentAngles, target) > d && iterCount < maxIterCount) {
        iterCount++;
        let anglesA;
        let anglesB;

        /*
        for (let i = currentAngles.length - 1; i >= 0; i--) {
            anglesA = currentAngles.slice();
            anglesB = currentAngles.slice();
            anglesA[i] = anglesA[i] + g;
            anglesB[i] = anglesB[i] - g;
            gradients[i] = err(anglesA, target) - err(anglesB, target);
        }
        for (let i = currentAngles.length - 1; i >= 0; i--) {
            currentAngles[i] = currentAngles[i] - gradients[i];
        }
        */
        for (let i = 0; i < currentAngles.length; i++) {
            anglesA = currentAngles.slice();
            anglesB = currentAngles.slice();
            anglesA[i] = anglesA[i] + g;
            anglesB[i] = anglesB[i] - g;
            gradients[i] = err(anglesA, target) - err(anglesB, target);
            if (Math.abs(gradients[i]) > g) {
                if (gradients[i] > 0) {
                    gradients[i] = g;
                } else {
                    gradients[i] = -g;
                }
            }
        }
        currentAngles = currentAngles.map((angle, indx) => {
            return angle - gradients[indx];
        });
    }
    if (iterCount >= maxIterCount) {
        return false;
    } else {
        return true;
    }

}

function generateChain(start, angles) {
    let pos = createVector(start.x, start.y);
    let accAngle = 0;

    let chainInfo = [];
    //for (let i = angles.length - 1; i >= 0; i--) {
    for (let i = 0; i < angles.length; i++) {
        let oldPos = createVector(pos.x, pos.y);
        pos = createVector(
            pos.x + segLen * cos(accAngle + angles[i]),
            pos.y + segLen * sin(accAngle + angles[i])
        );
        accAngle += angles[i];
        chainInfo.push(
            {
                oldPos: oldPos,
                pos: pos
            }
        );
    }
    return chainInfo;
}

function drawChain(chainPoints, chainDrawInfo) {
    ellipse(chainPoints[chainPoints.length - 1].pos.x, chainPoints[chainPoints.length - 1].pos.y, d * 2, d * 2);
    for (let i = 0; i < chainPoints.length; i++) {
        strokeWeight(chainDrawInfo[i].thickness);
        stroke(
            chainDrawInfo[i].color.r,
            chainDrawInfo[i].color.g,
            chainDrawInfo[i].color.b
        );
        line(chainPoints[i].oldPos.x, chainPoints[i].oldPos.y,
            chainPoints[i].pos.x, chainPoints[i].pos.y);
    }
}

let prevTarget = null;
function mouseClicked() {
    let target = {
        x: mouseX,
        y: mouseY
    }
    let chainDrawRadius = nSeg * segLen;

    if (distance(chainStartingPos, target) <= chainDrawRadius) {
        console.log("Draw");
        background(255);
        stroke(0);
        ellipse(chainStartingPos.x, chainStartingPos.y, nSeg * segLen * 2, nSeg * segLen * 2);

        if (currentAngles.length > 0) {
            let generateNew = optimization_IK(d, g, maxIterCount, target);
            chainPoints = [];
            if (generateNew) {
                chainPoints = generateChain(chainStartingPos, currentAngles);
            }
            if (chainPoints.length > 0 && chainDrawInfo.length > 0) {
                drawChain(chainPoints, chainDrawInfo);
            }
        }
    }
}

let drawOnce = true;
function draw() {
    if (drawOnce) {
        drawOnce = false;
        background(255);
        stroke(0);
        ellipse(chainStartingPos.x, chainStartingPos.y, nSeg * segLen * 2, nSeg * segLen * 2);
        chainPoints = generateChain(chainStartingPos, currentAngles);

        if (chainPoints.length > 0 && chainDrawInfo.length > 0) {
            drawChain(chainPoints, chainDrawInfo);
        }

    }
}