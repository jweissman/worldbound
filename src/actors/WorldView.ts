import { Actor, Events } from "excalibur";
import { World } from "../models/World";
// import { eachMatrixEntry } from "../util/matrix";
import { Color, rgb } from "../types/Palette";

class WorldView extends Actor {
    world: World = new World();
    colorMap: Color[][] = [];
    sz: number = 4

    lastFilled: Color = 'white';
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
        let m = this.colorMap;
        for (let i = 0; i < m.length; i++) {
            for (let j = 0; j < m[i].length; j++) {
                let x=i, y=j;
                let color = this.colorMap[i][j];

                if (color !== this.lastFilled) {
                    ctx.fillStyle = rgb(color);
                    this.lastFilled = color;
                }
                ctx.fillRect(x * this.sz, y * this.sz, this.sz, this.sz);
            }
        }
        this.emit('postdraw', new Events.PreDrawEvent(ctx, delta, this));
    }

    update() {
        if (this.world.evolve()) {
            this.colorMap = this.world.colorMap;
        }
    }
}

export default WorldView;