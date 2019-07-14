import WorldView from "../actors/WorldView";
import { Scene } from "excalibur";
import { Game } from "../Game";
import { NavController } from "../Nav";

export class Life extends Scene {
    private worldView: WorldView;
    private nav: NavController;
    constructor(private game: Game) {
        super(game);
        this.worldView = new WorldView(game.world);
        this.nav = new NavController(game, this.camera)
    }
    onInitialize() {
        this.add(this.worldView);
    }
    onActivate() {
        this.nav.activate()
    }
    onDeactivate() {
        this.nav.deactivate()
    }
}
