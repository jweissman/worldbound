import WorldView from "../actors/WorldView";
import { Scene, Actor, Color, LockCameraToActorStrategy } from "excalibur";
import { NavController } from "../Nav";
import { Game } from "../Game";

// class Player extends Actor {}

export class Life extends Scene {
    // private nav: NavController;
    private worldView: WorldView;
    // private player: Player;
    constructor(private game: Game) {
        super(game);
        // this.nav = new NavController(game, this.camera);
        this.worldView = new WorldView();
        // this.player = new Player(100,100,10,10,Color.Red)
        // this.camera.addStrategy(new LockCameraToActorStrategy(this.player))
        // this.camera.zoom(8)
    }
    onInitialize() {
        this.add(this.worldView);
        // this.add(this.player)
    }
    onActivate() {
        // this.nav.activate();
    }
    onDeactivate() {
        // this.nav.deactivate();
    }
}
