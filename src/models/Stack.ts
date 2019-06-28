import { Grid } from "../models/Grid";

class Stack {
    constructor(public layers: { [key: string]: Grid<any> }) {};
}

export default Stack;