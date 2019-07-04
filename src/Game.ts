import WorldView from "./actors/WorldView";
import { Engine, Scene, ScrollPreventionMode, Color } from "excalibur";
import { NavController } from "./Nav";

class Life extends Scene {
    private nav: NavController
    constructor(private game: Game) {
        super(game);
        this.nav = new NavController(game, this.camera);
    }

    onInitialize() {
        this.add(new WorldView());
    }

    onActivate() {
        this.nav.activate()
    }

    onDeactivate() {
        this.nav.deactivate()
    }

}


export class Game extends Engine {
    constructor() {
        super();
        this.backgroundColor = Color.Black
        this.pageScrollPreventionMode = ScrollPreventionMode.None; //.None;
        this.addScene('life', new Life(this))
        this.goToScene('life')

        // this.
    }
}