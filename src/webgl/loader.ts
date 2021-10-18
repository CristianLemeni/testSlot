import * as PIXI from 'pixi.js'
import { Howl } from 'howler';


export class Loader {

    public loaderManager: PIXI.Loader
    public sounds: Array<Howl>
    constructor() {
        this.loaderManager = new PIXI.Loader()
        this.sounds = []
    }


    loadGraphics(graphics: Array<string>) {
        for (let i = 0; i < graphics.length; i++) {
            this.loaderManager.add(graphics[i])
        }

        this.loaderManager.load(() => {
            const event = new Event("graphicsLoaded")
            document.dispatchEvent(event)
        })
    }

    loadSounds(sounds: Array<string>) {
        for (let i = 0; i < sounds.length; i++) {
            let sound = new Howl({
                src: [sounds[i]]
            });
            this.sounds.push(sound)
        }
    }

    getLoaderManager() {
        return this.loaderManager
    }

}