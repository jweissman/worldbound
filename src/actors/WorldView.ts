import { Actor, Events, Engine, Vector } from "excalibur";
import { World } from "../models/World";
import { Color, rgb } from "../types/Palette";

class WorldView extends Actor {
    world: World = new World();
    colorMap: Color[][] = [];
    sz: number = 8

    lastFilled: Color | null = null;
    private drawCell(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        color: Color,
    ) {
        if (color !== this.lastFilled) {
            ctx.fillStyle = rgb(color);
            this.lastFilled = color;
        }
        ctx.fillRect(x,y,this.sz,this.sz);
    }

    draw(ctx: CanvasRenderingContext2D, delta: number) {
        this.emit('predraw', new Events.PreDrawEvent(ctx, delta, this));
        let m = this.world.layers['clouds'].structure
        if (m.length) {
            this.lastFilled = null;

            let rows = m[1].length, cols = m.length;
            let x = this._onScreenXStart;
            const xEnd = Math.min(this._onScreenXEnd, cols);
            let y = this._onScreenYStart;
            const yEnd = Math.min(this._onScreenYEnd, rows);
            ctx.fillStyle='#642'
            ctx.fillRect(x, y, cols * this.sz, rows * this.sz)

            Object.entries(this.world.layers).forEach(([_layer, grid]) => {
                if (grid.config.translucent) {
                    ctx.globalAlpha = 0.6
                }
                for (let i = x; i < xEnd; i++) {
                    for (let j = y; j < yEnd; j++) {
                        let x = i, y = j;
                        let value = grid.at({ x, y })
                        if (value !== undefined && grid.isActive(value)) {
                            let color = grid.colorFor(value)
                            if (color) {
                                if (color !== this.lastFilled) {
                                    ctx.fillStyle = rgb(color);
                                    this.lastFilled = color;
                                }
                                ctx.fillRect(x * this.sz, y * this.sz, this.sz, this.sz);
                            }
                        }
                    }
                }

                if (grid.config.translucent) {
                    ctx.globalAlpha = 1.0
                }
            })
        }
        this.emit('postdraw', new Events.PreDrawEvent(ctx, delta, this));
    }

    update(engine: Engine, delta: number) {
        this.world.evolve()

        const worldCoordsUpperLeft = engine.screenToWorldCoordinates(new Vector(0, 0));
        const worldCoordsLowerRight = engine.screenToWorldCoordinates(new Vector(engine.canvas.clientWidth, engine.canvas.clientHeight));

        let cellWidth = this.sz, cellHeight = this.sz;
        let x = this.pos.x, y = this.pos.y;
        this._onScreenXStart = Math.max(Math.floor((worldCoordsUpperLeft.x - x) / cellWidth) - 2, 0);
        this._onScreenYStart = Math.max(Math.floor((worldCoordsUpperLeft.y - y) / cellHeight) - 2, 0);
        this._onScreenXEnd = Math.max(Math.floor((worldCoordsLowerRight.x - x) / cellWidth) + 2, 0);
        this._onScreenYEnd = Math.max(Math.floor((worldCoordsLowerRight.y - y) / cellHeight) + 2, 0);

    }
    private _onScreenXStart: number = 0;
    private _onScreenXEnd: number = 9999;
    private _onScreenYStart: number = 0;
    private _onScreenYEnd: number = 9999;
}

export default WorldView;