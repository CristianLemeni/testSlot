//@ts-nocheck
import './style.css'
import * as PIXI from 'pixi.js'
import * as particles from 'pixi-particles'
import { Init } from './webgl/init';
window.PIXI = PIXI;

export class MainApp {

	private init: Init

	constructor(pixiApp) {
		this.init = new Init(pixiApp);
	}

    load(pixiApp, canvas, assets, sfx){
        this.init.init(pixiApp, canvas)
        this.init.loadGraphics(assets)
        this.init.loadSounds(sfx)
        document.addEventListener("graphicsLoaded", () => {
            this.init.addBackground()
            this.init.addReels()
        })
    }
}

let pixiApp, renderer

document.addEventListener("DOMContentLoaded", () => {
	let canvas = document.getElementById("gameCanvas");
	pixiApp = new PIXI.Application();
	canvas.appendChild(pixiApp.view);

	renderer = new PIXI.Renderer({
        view: canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio,
        autoDensity: true,
        resizeTo: window
    });
    const ticker = new PIXI.Ticker();


    ticker.add(animate);
    ticker.start();

    const graphics = [
        "assets/symbols.json",
        "assets/myAssets.json"
    ]

    const sounds = [
        "assets/Start_Button.mp3",
        "assets/Reel_Stop_1.mp3",
        "assets/Reel_Stop_2.mp3",
        "assets/Reel_Stop_3.mp3",
        "assets/Reel_Stop_4.mp3",
        "assets/Reel_Stop_5.mp3"
    ]

	let app = new MainApp(pixiApp);
    app.load(pixiApp, canvas, graphics, sounds)
})

function animate() {
	renderer.render(pixiApp.stage);
}

