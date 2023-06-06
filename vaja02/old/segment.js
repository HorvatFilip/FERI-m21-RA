class Segment {
    constructor(id, x, y, len, angle) {
        this.id = id;
        this.color = {
            r: random(255),
            g: random(255),
            b: random(255)
        };
        this.start = createVector(x, y);
        this.end = null;
        this.len = len;
        this.angle = angle;
        this.parent = null;
        this.update();
    }
    update() {
        let d_x = cos(this.angle) * this.len;
        let d_y = sin(this.angle) * this.len;
        this.end = createVector(this.start.x + d_x, this.start.y + d_y);
    }
    draw() {
        line(this.start.x, this.start.y, this.end.x, this.end.y);
        strokeWeight(this.id);
        stroke(this.color.r, this.color.g, this.color.b);
        console.log("draw" + this.id);
    }

}