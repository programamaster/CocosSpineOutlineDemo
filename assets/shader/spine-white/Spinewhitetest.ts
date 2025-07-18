import { _decorator, Component, Material, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

enum FlashAnimateSate {
    none = 0,
    fadeIn = 1,
    fadeOut = 2,
}

@ccclass('Spinewhitetest')
export class Spinewhitetest extends Component {
    @property(sp.Skeleton)
    private skeletonComp: sp.Skeleton = null;
    private flashAnimateState: FlashAnimateSate = FlashAnimateSate.none;
    private curFlashPercent: number = 0;
    start() {
        this.playAnimationsInSequence();
        this.changeFlashPercent(0.0);
    }

    protected update(dt: number): void {
        if (this.flashAnimateState === FlashAnimateSate.fadeIn) {  // 淡入
            if (this.curFlashPercent >= 1) {
                this.flashAnimateState = FlashAnimateSate.fadeOut;
                this.curFlashPercent = 1;
            } else {
                this.curFlashPercent += dt * 5;
                this.changeFlashPercent(this.curFlashPercent);
            }
        } else if (this.flashAnimateState === FlashAnimateSate.fadeOut) {  // 淡出
            if (this.curFlashPercent <= 0) {
                this.flashAnimateState = FlashAnimateSate.none;
                this.curFlashPercent = 0;
            } else {
                this.curFlashPercent -= dt * 5;
                this.changeFlashPercent(this.curFlashPercent);
            }
        }
    }

    private startAttack(): void {
        this.changeFlashPercent(0.0);  // 先重置
        this.flashAnimateState = FlashAnimateSate.fadeIn;
    }

    // 改变 mixPercent 的值
    private changeFlashPercent(percent: number) {
        const spineMatCaches = this.skeletonComp['_materialCache'];
        for (let k in spineMatCaches) {
            spineMatCaches[k].setProperty('mixPercent', percent);
        }
    }

    private currentAnimIndex = 0;
    private isPlaying = false;

    playAnimationsInSequence() {
        if (this.isPlaying || !this.skeletonComp.skeletonData) return;

        this.isPlaying = true;
        const anims = this.skeletonComp.skeletonData.getRuntimeData()!.animations;

        const playNext = () => {
            if (this.currentAnimIndex >= anims.length) {
                this.currentAnimIndex = 0; // Loop back to first animation
            }

            const animName = anims[this.currentAnimIndex].name;
            this.skeletonComp.setAnimation(0, animName, false);

            this.currentAnimIndex++;
            this.skeletonComp.setCompleteListener(() => {
                playNext();
            });
        };

        playNext();
    }

}

