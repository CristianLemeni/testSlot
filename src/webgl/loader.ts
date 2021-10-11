import * as PIXI from 'pixi.js'


export class Loader {

    public loaderManager: PIXI.Loader

    constructor() {
        this.loaderManager = new PIXI.Loader()
    }


    loadGraphics(graphics: Array<string>){
       for(let i = 0; i < graphics.length; i++){
           this.loaderManager.add(graphics[i])
       }

       this.loaderManager.load(() => {
           const event = new Event("graphicsLoaded")
           document.dispatchEvent(event)
       })
    }

    loadMusic(music: Array<string>){
        
    }

    getLoaderManager(){
        return this.loaderManager
    }

}