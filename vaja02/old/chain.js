class Chain {
    constructor(x, y, nSeg, segLen) {
        this.start = createVector(x, y);
        this.segs = [];
        this.initSegs(nSeg, segLen);
    }
    initSegs(nSeg, segLen) {
        this.segs.push(
            new Segment(1, this.start.x, this.start.y, segLen, 0)
        );
        let prevSeg = this.segs[0];
        for (let i = 1; i < nSeg; i++) {
            this.segs.push(
                new Segment(i + 1, prevSeg.end.x, prevSeg.end.y, segLen, 0)
            );
            this.segs[i].parent = prevSeg;
            prevSeg = this.segs[i];
        }
    }
    draw() {
        this.segs.forEach(seg => {
            seg.draw();
        })
    }
}