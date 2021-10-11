import * as PIXI from 'pixi.js'
import { Init } from './init'


export class Background {

    stage: PIXI.Container
    backgroundContainer: PIXI.Container

    constructor(stage: PIXI.Container){
        this.stage = stage
        this.backgroundContainer = new PIXI.Container()

        this.addEvents()
    }

    addBackground(texture: PIXI.Texture){
        this.stage.addChild(this.backgroundContainer)
        
        let bkSprite = new PIXI.Sprite(texture)
        this.backgroundContainer.addChild(bkSprite)
        this.resize()
    }
    

    resize() {
        this.backgroundContainer.scale.set(1);
        let scale = Math.max(Init.initialHeight / this.backgroundContainer.height,  Init.initialWidth / this.backgroundContainer.width);
        this.backgroundContainer.scale.set(scale);
        this.backgroundContainer.position.set(0, 0)
    }

    addEvents(){
        document.addEventListener('initResized', () => {
            this.resize()
        })
    }

    
}