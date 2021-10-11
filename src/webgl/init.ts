import * as PIXI from 'pixi.js'
import * as particles from 'pixi-particles'
import {Loader} from './loader'
import { Background } from './background'
import { Reels } from './reels'

export class Init {

    private app!: PIXI.Application
    private loader!: Loader

    public static initialWidth: number
    public static initialHeight: number

    constructor(){
        Init.initialWidth = window.innerWidth
        Init.initialHeight = window.innerHeight
    }

    init(pixiApp: PIXI.Application, canvas: HTMLCanvasElement){
        this.app = pixiApp

        this.loader = new Loader()

        window.addEventListener('resize', () => {
            Init.initialWidth = window.innerWidth
            Init.initialHeight = window.innerHeight
            let evt = new Event("initResized")
            document.dispatchEvent(evt)
        })
    }

    loadGraphics(graphics: Array<string>){
        this.loader.loadGraphics(graphics)
    }

    addBackground(){
        let bk = new Background(this.app.stage)

        let bkTextures = this.loader.getLoaderManager().resources["assets/myAssets.json"].textures
        if(bkTextures){
            bk.addBackground(bkTextures["bk.png"])
        }
    }

    addReels(){
        let reels = new Reels(this.app.stage)

        let reelTextures = this.loader.getLoaderManager().resources["assets/symbols.json"].textures
        let uiTextures = this.loader.getLoaderManager().resources["assets/myAssets.json"].textures
        if(reelTextures && uiTextures){
            reels.initReels(reelTextures, uiTextures["Play.png"], uiTextures["Quit_Exit.png"])
        }

    }
}