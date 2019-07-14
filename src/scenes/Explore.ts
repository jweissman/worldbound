import { Scene } from "excalibur";
import { World } from "../models/World";
import { Game } from "../Game";

export class Explore extends Scene {
    constructor(private game: Game, public world: World) {
        super(game);
    }
}