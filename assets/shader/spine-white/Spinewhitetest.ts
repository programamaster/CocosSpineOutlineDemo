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
    @property(sp.Skeleton)
    private skeletonComp1: sp.Skeleton = null;

    // Separate states for each skeleton
    private flashAnimateStates: [FlashAnimateSate, FlashAnimateSate] = [FlashAnimateSate.none, FlashAnimateSate.none];
    private curFlashPercents: [number, number] = [0, 0];
    private currentAnimIndices: [number, number] = [0, 0];
    private isPlayings: [boolean, boolean] = [false, false];

    start() {
        this.playAnimationsInSequence(this.skeletonComp, 0);
        this.playAnimationsInSequence(this.skeletonComp1, 1);
        this.changeFlashPercent(this.skeletonComp, 0.0, 0);
    }

    protected update(dt: number): void {
        // Process both skeletons
        for (let i = 0; i < 2; i++) {
            const skeleton = i === 0 ? this.skeletonComp : this.skeletonComp1;
            if (this.flashAnimateStates[i] === FlashAnimateSate.fadeIn) {
                if (this.curFlashPercents[i] >= 1) {
                    this.flashAnimateStates[i] = FlashAnimateSate.fadeOut;
                    this.curFlashPercents[i] = 1;
                } else {
                    this.curFlashPercents[i] += dt * 5;
                    this.changeFlashPercent(skeleton, this.curFlashPercents[i], i);
                }
            } else if (this.flashAnimateStates[i] === FlashAnimateSate.fadeOut) {
                if (this.curFlashPercents[i] <= 0) {
                    this.flashAnimateStates[i] = FlashAnimateSate.none;
                    this.curFlashPercents[i] = 0;
                } else {
                    this.curFlashPercents[i] -= dt * 5;
                    this.changeFlashPercent(skeleton, this.curFlashPercents[i], i);
                }
            }
        }
    }

    private startAttack(): void {
        const index = 0;
        const skeleton = index === 0 ? this.skeletonComp : this.skeletonComp1;
        this.changeFlashPercent(skeleton, 0.0, index);
        this.flashAnimateStates[index] = FlashAnimateSate.fadeIn;
    }

    private startAttack1(): void {
        let index = 1;
        const skeleton = index === 0 ? this.skeletonComp : this.skeletonComp1;
        this.changeFlashPercent(skeleton, 0.0, index);
        this.flashAnimateStates[index] = FlashAnimateSate.fadeIn;
    }

    private changeFlashPercent(skeletonComp: sp.Skeleton, percent: number, index: number) {
        const spineMatCaches = skeletonComp['_materialCache'];
        for (let k in spineMatCaches) {
            spineMatCaches[k].setProperty('mixPercent', percent);
        }
    }

    playAnimationsInSequence(skeletonComp: sp.Skeleton, index: number) {
        if (this.isPlayings[index] || !skeletonComp.skeletonData) return;

        this.isPlayings[index] = true;
        const anims = skeletonComp.skeletonData.getRuntimeData()!.animations;

        const playNext = () => {
            if (this.currentAnimIndices[index] >= anims.length) {
                this.currentAnimIndices[index] = 0;
            }

            const animName = anims[this.currentAnimIndices[index]].name;
            skeletonComp.setAnimation(0, animName, false);

            this.currentAnimIndices[index]++;
            skeletonComp.setCompleteListener(() => {
                playNext();
            });
        };

        playNext();
    }
}
