<template lang="pug">
div.container.heatmap
    slider.zoomslider(v-model="zoom")
    canvas(ref="canvas")
</template>

<script>
import slider from 'vue/slider.vue'

var $ = require('jquery');
export default {
    name: 'heatmap',
    components: { slider },
    data() {
        return {
            offsetHeight: 0,
            zoom: 50,
            gridX: 0,
            gridY: 0,
            map: {
                walls: [
                    [
                        {x: 0, y: 0, c: 'rl'},
                        {x: 1, y: 0, c: 'rl'},
                        {x: 2, y: 0, c: 'lt'},
                        {x: 2, y: 1, c: 'b'},
                        {x: -1, y: 0, c: 'rl'},
                        {x: -2, y: 0, c: 'br'},
                        {x: -2, y: -1, c: 't'}
                    ]
                ]
            }
        }
    },
    mounted() {
        let $el = $(this.$el);
        this.offsetHeight = $el.offset().top + parseInt($el.css('marginTop'));

        this.init();
        this.fixSize();
        this.draw();

        window.addEventListener('resize', () => {
            this.fixSize();
            this.draw();
        });
        this.$refs.canvas.addEventListener('mousedown', this.gridMouseDown);
        this.$refs.canvas.addEventListener('mouseup', this.gridMouseUp);
        this.$refs.canvas.addEventListener('mousemove', this.gridMouseMove);
        this.$refs.canvas.addEventListener('mousewheel', this.gridScroll);
    },
    computed: {
        componentHeight() {
            let maxHeight = $(window).height() - this.offsetHeight;
            return maxHeight + "px";
        }
    },
    watch: {
        zoom() {
            this.draw();
        }
    },
    methods: {
        init() {
            this.ctx = this.$refs.canvas.getContext('2d');
            this.gSize = 50;

            this.gridDragging = false;
            this.gridDraggingLastPos = null;
        },
        fixSize() {
            let maxHeight = $(window).height() - this.offsetHeight;
            let c = $(this.$refs.canvas);
            c.css('height', maxHeight + 'px');
            c.attr('width', c.width());
            c.attr('height', c.height());
            $(this.$el).css('height', maxHeight + 'px');
            this.gridWidth = Math.ceil(this.$refs.canvas.width / 50);
            this.gridHeight = Math.ceil(this.$refs.canvas.height / 50);
			this.canvasCenterX = this.$refs.canvas.width / 2;
            this.canvasCenterY = this.$refs.canvas.height / 2;
            this.gridCenterX = Math.ceil(this.gridWidth / 2);
            this.gridCenterY = Math.ceil(this.gridHeight / 2);
        },
        gridScroll(e) {
            this.$data.zoom -= e.deltaY / 10;
            if (this.$data.zoom < 5)
            	this.$data.zoom = 5;
            if (this.$data.zoom > 100)
            	this.$data.zoom = 100;
        },
        gridMouseDown(e) {
            this.gridDragging = true;
            this.gridDraggingLastPos = {x: e.clientX, y: e.clientY};
        },
        gridMouseUp(e) {
            this.gridDragging = false;
            this.gridDraggingLastPos = null;
        },
        gridMouseMove(e) {
            if (this.gridDragging && this.gridDraggingLastPos) {
                this.$data.gridX -= e.clientX - this.gridDraggingLastPos.x;
                this.$data.gridY -= e.clientY - this.gridDraggingLastPos.y;
                this.gridDraggingLastPos = {x: e.clientX, y: e.clientY};
                this.draw();
            }
        },
        gridPos(x,y) {
            return {
                x: this.canvasCenterX + (x * this.$data.zoom) - this.$data.gridX,
                y: this.canvasCenterY + (-y * this.$data.zoom) - this.$data.gridY
            }
        },
        draw() {
            this.ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
            this._drawGrid();
            this._drawWalls();
        },
        _drawWalls() {
            this.ctx.strokeStyle = "#6f6f6f";
            for (var i in this.$data.map.walls) {
                for (var w in this.$data.map.walls[i]) {
                    let wall = this.$data.map.walls[i][w];
                    let pos1 = this.gridPos(wall.x, wall.y);
                    let pos2 = this.gridPos(wall.x + 1, wall.y);
                    let pos3 = this.gridPos(wall.x + 1, wall.y + 1);
                    let pos4 = this.gridPos(wall.x, wall.y + 1);
                    this.ctx.beginPath();
                    this.ctx.moveTo(pos1.x, pos1.y);
                    if (wall.c.indexOf('b') != -1)
                        this.ctx.moveTo(pos2.x, pos2.y);
                    else
                        this.ctx.lineTo(pos2.x, pos2.y);
                    if (wall.c.indexOf('r') != -1)
                        this.ctx.moveTo(pos3.x, pos3.y);
                    else
                        this.ctx.lineTo(pos3.x, pos3.y);
                    if (wall.c.indexOf('t') != -1)
                        this.ctx.moveTo(pos4.x, pos4.y);
                    else
                        this.ctx.lineTo(pos4.x, pos4.y);
                    if (wall.c.indexOf('l') == -1)
                    	this.ctx.lineTo(pos1.x, pos1.y);
                    this.ctx.stroke();
                }
            }
        },
        _drawGrid() {
            let yMin = this.canvasCenterY - (this.gridCenterY * this.$data.zoom) - this.$data.gridY;
            let yMax = this.canvasCenterY + (this.gridCenterY * this.$data.zoom) - this.$data.gridY;
            let xMin = this.canvasCenterX - (this.gridCenterX * this.$data.zoom) - this.$data.gridX;
            let xMax = this.canvasCenterX + (this.gridCenterX * this.$data.zoom) - this.$data.gridX;

            for (var x = -this.gridCenterX; x <= this.gridCenterX; x ++) {
                if (x == 0) {
                    this.ctx.strokeStyle = "#97ddb9";
                } else {
                    this.ctx.strokeStyle = "#cde9fb";
                }

                let xLine = this.gridPos(x, 0).x;
                this.ctx.beginPath();
                this.ctx.moveTo(xLine, yMin);
                this.ctx.lineTo(xLine, yMax);
                this.ctx.stroke();
            }
            for (var y = -this.gridCenterY; y <= this.gridCenterY; y ++) {
                if (y == 0) {
                    this.ctx.strokeStyle = "#97ddb9";
                } else {
                    this.ctx.strokeStyle = "#cde9fb";
                }
                let yLine = this.gridPos(0, y).y;
                this.ctx.beginPath();
                this.ctx.moveTo(xMin, yLine);
                this.ctx.lineTo(xMax, yLine);
                this.ctx.stroke();
            }
        }
    }
}
</script>
