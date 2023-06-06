let koti = [];
let nSeg = 5;
let segLen = 30;
for (let i = 0; i < nSeg; i++) {
    koti.push(
        10
    );
}

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
}

function update_nSeg() {
    nSeg = int(this.value());
}

function update_lenInput() {
    segLen = int(this.value());
}

function create_rotation_matrix(angle, axis) {
    let c = cos(angle);
    let s = sin(angle);
    let t = 1 - c;
    let x = axis.x;
    let y = axis.y;
    let z = axis.z;

    // Create the rotation matrix using p5.Matrix
    let rotationMatrix = new p5.Matrix();
    rotationMatrix.set(
        t * x * x + c, t * x * y - s * z, t * x * z + s * y, 0,
        t * x * y + s * z, t * y * y + c, t * y * z - s * x, 0,
        t * x * z - s * y, t * y * z + s * x, t * z * z + c, 0,
        0, 0, 0, 1
    );

    return rotationMatrix;
}

function draw() {
    background(255);

    let pos = createVector(width / 2, height / 2);
    let accAngle = 0;
    let lineWidth = 1;
    for (let kot of koti) {
        let oldPos = pos.copy();
        let RM = new p5.Matrix();
        RM.rotate(accAngle + kot, createVector(0, 0, 1));
        console.log(RM);
        RM = p5.Vector.mult(RM, createVector(segLen, 0, 0, 1));
        //RM.mult(createVector(segLen, 0, 0, 1));
        console.log(RM);
        //let newPos = p5.Vector.add(pos, RM.mult(createVector(segLen, 0, 0, 1)));
        let newPos = createVector(pos.x + RM[0], pos.y + RM[1]);
        pos = newPos;
        accAngle += kot;
        line(oldPos.x, oldPos.y, pos.x, pos.y);

        lineWidth += 1;
        stroke(
            random(255),
            random(255),
            random(255)
        );
    }

    /**
     * 
     * 
     *
    let pos = createVector(width / 2, height / 2);
    let accAngle = 0;
    let lineWidth = 1;
    kChain.forEach(kot => {
        let oldPos = createVector(pos.x, pos.y);
        let RM = new p5.Matrix();
        RM.rotate(accAngle + kot, createVector(0, 0, 1));
        RM.mult(createVector(segLen, 0, 0, 1));
        pos.add(
            createVector(RM.x, RM.y)
        );
        accAngle += kot;
        console.log(oldPos);
        console.log(pos);
        line(oldPos.x, oldPos.y, pos.x, pos.y);
        strokeWeight(lineWidth);
        lineWidth += 1;
        stroke(
            random(255),
            random(255),
            random(255)
        );
    });
     * 
     */
}