import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {
    start() {
        this.playAnimationsInSequence();
    }

    update(deltaTime: number) {

    }
    @property(sp.Skeleton)
    private comp: sp.Skeleton = null!;
    private currentAnimIndex = 0;
    private isPlaying = false;

    playAnimationsInSequence() {
        if (this.isPlaying || !this.comp.skeletonData) return;

        this.isPlaying = true;
        const anims = this.comp.skeletonData.getRuntimeData()!.animations;

        const playNext = () => {
            if (this.currentAnimIndex >= anims.length) {
                this.currentAnimIndex = 0; // Loop back to first animation
            }

            const animName = anims[this.currentAnimIndex].name;
            this.comp.setAnimation(0, animName, false);

            this.currentAnimIndex++;
            this.comp.setCompleteListener(() => {
                playNext();
            });
        };

        playNext();
    }
}

