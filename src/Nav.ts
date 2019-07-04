import {
    Vector,
    Input,
    Engine,
    Camera,
} from "excalibur";

enum Pan { Up, Down, Left, Right }
export class NavController {

    private dragging: boolean = false
    private dragOrigin?: Vector

    private pointerMoveCallback?: (pos: Vector) => any
    private leftClickCallback?: (pos: Vector, holdingShift: boolean) => any
    private cameraPanCallback?: () => any
    private keyPressCallback?: (key: any) => any

    constructor(private game: Engine, private camera: Camera) {
        
    }

    onMove(cb: (pos: Vector) => any) {
        this.pointerMoveCallback = cb
    }

    onLeftClick(cb: (pos: Vector, holdingShift: boolean) => any) {
        this.leftClickCallback = cb
    }

    onCameraPan(cb: () => any) {
        this.cameraPanCallback = cb
    }

    onKeyPress(cb: (key: any) => any) {
        this.keyPressCallback = cb
    }

    moveCam = (direction: Pan) => {
        if (this.cameraPanCallback) {
            this.cameraPanCallback()
        }
        let camMoveSpeed = 10 * (1 / this.camera.getZoom())
        let dv = new Vector(0, 0)
        switch (direction) {
            case Pan.Left: dv.x = -camMoveSpeed; break
            case Pan.Right: dv.x = camMoveSpeed; break
            case Pan.Up: dv.y = -camMoveSpeed; break
            case Pan.Down: dv.y = camMoveSpeed; break
        }
        this.camera.move(this.camera.pos.add(dv), 0)
    }


    activate() {
        this.game.input.pointers.primary.on('move', (e: any) => { //} Input.PointerMoveEvent) => {
            if (this.dragging) {
                if (this.dragOrigin) {
                    this.camera.pos = this.camera.pos.add(
                        this.dragOrigin.sub(e.coordinates.worldPos)
                    )
                }
            } else {
                if (this.pointerMoveCallback) {
                    this.pointerMoveCallback(e.coordiantes.worldPos)
                }

            }
        })

        this.game.input.pointers.primary.on('up', () => {
            if (this.dragging) { this.dragging = false; }
        })

        this.game.input.pointers.primary.on('down', (e: any) => { //} Input.PointerDownEvent) => {
            if (e.target.button === Input.PointerButton.Left) {//} && this.leftClickCallback) {
                // if (this.leftClickCallback) {
                //     this.leftClickCallback(
                //         e.coordinates.worldPos,
                //         this.game.input.keyboard.isHeld(Input.Keys.Shift)
                //     )
                // } else {
                    // this.moveCam()
                    // this.pan
                    this.camera.move(e.coordinates.worldPos, 250)
                // }

            } else { //if (e.target.button === Input.PointerButton.Middle ||
                      // e.target.button === Input.PointerButton.Right) {
                          
                this.dragging = true;
                this.dragOrigin = e.coordinates.worldPos //.target.pos
                console.log("DRAG EM", e)
            }
        })

        window.addEventListener("wheel", (e: WheelEvent) => {
        // this.game.input.pointers.primary.on('wheel', (e: GameEvent<Input.WheelEvent>) => {
            let z = this.camera.getZoom()
            let step = 0.05
            let min = 0.5, max = 2
            if (e.deltaY < 0) { //}.target.deltaY < 0) {
                this.camera.zoom(Math.min(z + step, max))
            } else if (e.deltaY > 0) {
                this.camera.zoom(Math.max(z - step, min))
            }
        // })
            console.log('wheeee', e)
        }, { capture: true, passive: false });


        // let { Up, Down, Left, Right } = Orientation;

        this.game.input.keyboard.on('press', (e: Input.KeyEvent) => {
            if (e.key === Input.Keys.Up || e.key === Input.Keys.W) {
                this.moveCam(Pan.Up)
            } else if (e.key === Input.Keys.Left || e.key === Input.Keys.A) {
                this.moveCam(Pan.Left)
            } else if (e.key === Input.Keys.Down || e.key === Input.Keys.S) {
                this.moveCam(Pan.Down)
            } else if (e.key === Input.Keys.Right || e.key === Input.Keys.D) {
                this.moveCam(Pan.Right)
            } else {
                if (this.keyPressCallback) {
                    this.keyPressCallback(e.key)
                }
            }
        })

        this.game.input.keyboard.on('hold', (e: Input.KeyEvent) => {
            if (e.key === Input.Keys.Up || e.key === Input.Keys.W) {
                this.moveCam(Pan.Up)
            } else if (e.key === Input.Keys.Left || e.key === Input.Keys.A) {
                this.moveCam(Pan.Left)
            } else if (e.key === Input.Keys.Down || e.key === Input.Keys.S) {
                this.moveCam(Pan.Down)
            } else if (e.key === Input.Keys.Right || e.key === Input.Keys.D) {
                this.moveCam(Pan.Right)
            }
        })
    }

    deactivate(): any {
        this.game.input.keyboard.off('press')
        this.game.input.keyboard.off('hold')
        // this.game.input.pointers.primary.off('wheel') //, (e: Input.WheelEvent) => {
        this.game.input.pointers.primary.off('down') //, (e: Input.WheelEvent) => {
        this.game.input.pointers.primary.off('up') //, (e: Input.WheelEvent) => {
    }
}