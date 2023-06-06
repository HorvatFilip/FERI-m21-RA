let kChain;
let nSeg = 5;
let segLen = 30;

let segInput;
let lenInput;

function setup() {
    createCanvas(windowWidth, windowHeight);

    let segInputLabel = createDiv('Bone Nums:');
    segInputLabel.position(20, 0);

    segInput = createInput('5');
    segInput.position(20, 25);
    segInput.input(update_nSeg);

    let lenInputLabel = createDiv('Bone Length:');
    lenInputLabel.position(20, 50);

    lenInput = createInput('30');
    lenInput.position(20, 75);
    lenInput.input(update_lenInput);

    kChain = new Chain(width / 2, height / 2, nSeg, segLen);
}

function update_nSeg() {
    nSeg = int(this.value());
    kChain = new Chain(width / 2, height / 2, nSeg, segLen);
}

function update_lenInput() {
    segLen = int(this.value());
    kChain = new Chain(width / 2, height / 2, nSeg, segLen);
}

function draw() {
    background(255);

    kChain.draw();
}