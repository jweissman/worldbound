import Grid from "../models/Grid";

export type StackLayers = {
    water: Grid<boolean>,
    grass: Grid<boolean>,
    // trees: Grid<boolean>, //VegetationCell>,
    clouds: Grid<boolean>,
}

class Stack {
    constructor(public layers: StackLayers) {};
}

export default Stack;