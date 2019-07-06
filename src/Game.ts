import { Engine, ScrollPreventionMode, Color } from "excalibur";
import { Life } from "./scenes/Life";

export class Game extends Engine {
    constructor() {
        super();
        this.backgroundColor = Color.Black
        this.pageScrollPreventionMode = ScrollPreventionMode.None; //.None;
        this.addScene('life', new Life(this))
        this.goToScene('life')
    }
}