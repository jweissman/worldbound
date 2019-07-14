import Grid from "../models/Grid";

export type StackLayers = {
    water: Grid,
    grass: Grid,
    trees: Grid,
    animals: Grid,
    clouds: Grid,
    trail: Grid,
    path: Grid,
}

class Stack {
    constructor(public layers: StackLayers) {};
}

export default Stack;