import WorldView from "./actors/WorldView";
import { Engine } from "excalibur";



export class Game extends Engine {
    constructor() {
        super();
        this.add(new WorldView());
        // this.
    }
}