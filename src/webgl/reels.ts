import * as gsap from 'gsap'
import * as PIXI from 'pixi.js'
import { Init } from './init'
import { MotionBlurFilter } from '@pixi/filter-motion-blur';
import { Howl } from 'howler';


export class Reels {

    stage: PIXI.Container
    reelsContainer: PIXI.Container
    state: string = "normalState"
    spinTimeline: gsap.TimelineMax
    reelsJson: any
    ids: any
    idsDict: any
    sounds: Array<Howl>

    constructor(stage: PIXI.Container, sounds: Array<Howl>) {
        this.stage = stage
        this.reelsContainer = new PIXI.Container()

        this.stage.addChild(this.reelsContainer)

        this.spinTimeline = new gsap.TimelineMax({ paused: true, duration: 3 })
        this.spinTimeline.eventCallback("onComplete", this.checkForWin, [this]);
        this.addEvents()

        this.reelsJson = require('/public/assets/reels.json').reels;

        this.ids = []
        this.idsDict = {}

        this.sounds = sounds
    }

    initReels(reelsTextures: any, spinBtnTexture: any, skipBtnTexture: any) {
        this.addReels(reelsTextures)
        this.addSpinButton(spinBtnTexture)
        this.addSkipButton(skipBtnTexture)
        let mask = new PIXI.Graphics().beginFill(0xffffff, 1)
        mask.drawRect(-350, -10, 1000, 350);
        this.reelsContainer.mask = mask;
        this.reelsContainer.addChild(mask)
        this.reelsContainer.setChildIndex(mask, this.reelsContainer.children.length - 3)
    }

    addReels(textures: any) {
        let symbWidth = 0
        let y = 0
        let x = 0
        let soundInd = 0
       
        for(let i = 0; i < 3; i++){
            x = 0
            let reelRow = new PIXI.Container()
            this.ids.push([])
            for(let j = 0; j < 5; j++){
                let reelSymbol = new PIXI.Sprite(textures["icon" + this.getIconId(this.reelsJson[i].reel.icons) + ".png"]);

                reelSymbol.position.set(x, y)
                reelRow.addChild(reelSymbol)

                this.reelsContainer.addChild(reelRow)
                x += reelSymbol.width * 1.15
                symbWidth = reelSymbol.width
            }
            this.addID.bind(this)
            this.spinTimeline.add(() => {
                //@ts-ignore
                reelRow.filters = [new MotionBlurFilter([1, 2], 9)]
            }, 0)
            this.spinTimeline.fromTo(reelRow.position, 0.5, { y: reelRow.y }, { y: reelRow.height * 1.25, ease: "back.inOut(1.7)" }, i * 0.15)
            this.spinTimeline.add(() => {
                reelRow.position.y = - reelRow.height * 1.25
                for (let r = 0; r < reelRow.children.length; r++) {
                    let id = this.getIconId(this.reelsJson[i].reel.icons)
                    this.addID(id, i);
                    (reelRow.children[r] as PIXI.Sprite).texture = textures["icon" + id + ".png"]
                }
            })
            this.spinTimeline.to(reelRow.position, 0.5, { y: 0, ease: "back.inOut(1.7)" })
            this.spinTimeline.add(() => {
                reelRow.filters = []
                soundInd++
                if(soundInd >= 5){
                    soundInd = 0 
                }
                this.sounds[soundInd].play()
            })
            reelRow.position.x = 0
            y += symbWidth! * 1.15
        }

        this.resize()
    }

    addSpinButton(texture: any) {
        let spinButton = new PIXI.Sprite(texture);
        spinButton.interactive = true
        spinButton.scale.set(0.5)
        spinButton.position.x = this.reelsContainer.children[0].position.x - spinButton.width * 1.5
        spinButton.position.y = this.reelsContainer.children[0].position.y + spinButton.height / 6
        this.reelsContainer.addChild(spinButton)
        this.resize()

        spinButton.on("pointerdown", (e: any) => {
            let evt = new Event("spinPressed")
            document.dispatchEvent(evt)
            this.sounds[0].play()
        });
        
    }

    addSkipButton(texture: any) {
        let skipButton = new PIXI.Sprite(texture);
        skipButton.interactive = true
        skipButton.scale.set(0.5)
        skipButton.position.x = this.reelsContainer.children[0].position.x - skipButton.width * 1.5
        skipButton.position.y = this.reelsContainer.children[0].position.y + skipButton.height / 6
        this.reelsContainer.addChild(skipButton)
        skipButton.visible = false
        this.resize()

        skipButton.on("mousedown", function (e: any) {
            let evt = new Event("skipPressed")
            document.dispatchEvent(evt)
        });
    }

    getIconId(arr: any) {
        let parsedArr = arr.split(",")
        let randInt = Math.floor(Math.random() * ((parsedArr.length - 1) + 1));
        return parsedArr[randInt].toString()
    }

    resize() {
        this.reelsContainer.scale.set(1);
        this.reelsContainer.scale.set(Math.min(Init.initialWidth * 0.5 / this.reelsContainer.width, Init.initialHeight * 0.5 / this.reelsContainer.height))
        this.reelsContainer.position.set(Init.initialWidth / 4, window.innerHeight / 3)
    }

    addEvents() {
        document.addEventListener('initResized', () => {
            this.resize()
        })

        document.addEventListener("spinPressed", () => {
            this.spin()
        })

        document.addEventListener("skipPressed", () => {
            this.skip()
        })

        document.addEventListener("specialState", () => {
            gsap.gsap.globalTimeline.then(() => {
                this.spinTimeline.duration(1.5)
                this.spin()
            })
        })
        document.addEventListener("normalState", () => {
            this.spinTimeline.duration(3)
        })
    }

    changeState(newState: string) {
        this.state = newState

        let evt = new Event(this.state)
        document.dispatchEvent(evt)
    }

    spin() {
        gsap.gsap.globalTimeline.timeScale(1)
        this.spinTimeline.restart()
        this.reelsContainer.children[this.reelsContainer.children.length - 1].visible = true
    }

    skip() {
        console.log(this.state)
        if (this.state == "normalState") {
            gsap.gsap.globalTimeline.timeScale(100)
        }
    }

    resetArrs(self: Reels, winTimeline: gsap.TimelineMax) {
        if (!winTimeline.isActive()) {
            for (let i = 0; i < self.ids.length; i++) {
                for (let j = 0; j < self.ids[i].length; j++) {
                    (self.reelsContainer.children[i] as PIXI.Container).children[j].alpha = 1
                }
            }
            for (let i = 0; i < self.ids.length; i++) {
                self.ids[i] = []
            }
            for (let key in self.idsDict) {
                self.idsDict[key] = []
            }
            self.reelsContainer.children[self.reelsContainer.children.length - 1].visible = false
            self.changeState("normalState")
        }
    }

    checkForWin(self: Reels) {
        let time = 0
        let winTimeline = new gsap.TimelineMax({ paused: true, autoRemoveChildren: true })
        for (let i = 0; i < self.ids.length; i++) {
            for (let j = 0; j < self.ids[i].length; j++) {
                (self.reelsContainer.children[i] as PIXI.Container).children[j].alpha = 0.5
            }
        }
        for (let key in self.idsDict) {
            let unq = new Set(self.idsDict[key])
            if (unq.size > 2) {
                self.winAnimation(key, unq, self, time, winTimeline)
                time += 0.7
            }
        }

        if (time == 0) {
            self.resetArrs(self, winTimeline)
        }
    }

    winAnimation(val: any, cols: Set<unknown>, self: Reels, time: number, winTimeline: gsap.TimelineMax) {
        let winArr = []
        for (let id of cols) {
            for (let i = 0; i < self.ids[id as any].length; i++) {
                if (self.ids[id as any][i] == val) {
                    winArr.push({ id: val, col: id, row: i });
                    (self.reelsContainer.children[id as any] as PIXI.Container).children[i].alpha = 1
                    winTimeline.to((self.reelsContainer.children[id as any] as PIXI.Container).children[i], 0.1, { x: "+=4", yoyo: true, repeat: 5 }, time);
                    winTimeline.to((self.reelsContainer.children[id as any] as PIXI.Container).children[i], 0.1, { x: "-=4", yoyo: true, repeat: 5 }, time);
                }
            }
        }
        winTimeline.play()
        winTimeline.eventCallback("onComplete", self.resetArrs, [self, winTimeline])
        if (val == "1") {
            self.changeState("specialState")
        }


    }

    addID(id: any, reelId: any) {
        this.ids[reelId].push(id)
        if (this.idsDict[id]) {
            this.idsDict[id].push(reelId)
        }
        else {
            this.idsDict[id] = [reelId]
        }
    }

}