import { StackLayers } from "../Stack";
import { flip } from "../../util/flip";
import { pick } from "../../util/pick";
import { count } from "../../util/count";

export type Evolution = (layers: StackLayers) => void

export class PlanetaryEvolution {

    static windPushesClouds = (dx: number, dy: number) => (layers: StackLayers) => {
        layers.clouds.shift(dx, dy, () => flip(true, false, 0.55));
        // PlanetaryEvolution.cloudsGather(layers)
        // layers.clouds.gol()
    }

    static cloudsGather(layers: StackLayers): void {
        let { clouds, water } = layers;
        clouds.noise(0.01)
        clouds.smooth(pick(1,2), 0.26)
        PlanetaryEvolution.cloudsForm(layers)
   }

    static oceanLevelsRise(layers: StackLayers): void {
        let { water } = layers;
        water.smooth(pick(1,2,4), 0.025)
   }

    static cloudsForm(layers: StackLayers): void {
        let { clouds, water } = layers;
        // clouds.gol()
        // let chance = Math.random() < 0.015;
        clouds.gol((cell, ns, loc) => {
            let neighbors = count(ns, Boolean);
            let ocean = water.at(loc);
            if (cell) {
                if (!ocean && neighbors <= 2 || neighbors == 0) { //} && chance) { //} && flip(true, false)) {
                    return 'death'
                }
            } else {
                if ((ocean && neighbors >= 5) || neighbors > 7) { //} && chance) {
                    return 'birth'
                }
            }
        })
    }

    static grassGrows(layers: StackLayers): void {
        let { grass, clouds, water } = layers
        grass.gol((cell, ns, location) => {
            let neighbors = count(ns, Boolean)
            let sky = clouds.at(location)
            let ocean = water.at(location)
            let waterNeighbors: number = count(water.gatherNeighbors(location), Boolean) // n => !!n)
            // let chance = Math.random() < 0.08
            if (cell) {
                if (ocean) {
                    return 'death';
                }
            } else {
                // if (chance) {
                    if (!ocean) {
                        if (
                            sky //&& waterNeighbors > 0
                        ) {
                            return 'birth';
                        }
                        if (waterNeighbors > 0 && neighbors > 2) {
                            return 'birth';
                        }

                        if (Math.random() < 0.05 && neighbors >= 2) {
                            return 'birth'
                        }
                    // }
                }
            }
        })
    }
}
