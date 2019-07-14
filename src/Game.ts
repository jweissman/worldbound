import { Engine, ScrollPreventionMode, Color } from "excalibur";
import { Life } from "./scenes/Life";
import { World } from "./models/World";

export class Game extends Engine {
    constructor(public world: World) {
        super();
        this.backgroundColor = Color.Black
        this.pageScrollPreventionMode = ScrollPreventionMode.None; //.None;
        this.addScene('life', new Life(this))
        this.goToScene('life')

        console.log("W O R L D     B O U N D")
        console.log("Are you ready???")
    }

    onPreUpdate() {
        this.world.evolve()
    }
}