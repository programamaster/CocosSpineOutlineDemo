import { Material, sp } from 'cc';
import { Color } from 'cc';
import { _decorator, Component, Node, RenderTexture, Sprite, Camera, SpriteFrame } from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('RTCapture')
@menu('RenderTexture/RTCapture')
export class RTCapture extends Component {
    @property(Sprite)
    public sprite: Sprite = null!;
    @property(Camera)
    public camera: Camera = null!;

    static _renderTex: RenderTexture | null = null;

    @property(Color)
    public get glowColor(): Color {
        return this._glowColor;
    }
    public set glowColor(value: Color) {
        this._glowColor = value;
        this.updateMaterial();
    }
    private _glowColor: Color = new Color(255, 215, 0, 255)

    @property
    public get glowColorSize(): number {
        return this._glowColorSize;
    }
    public set glowColorSize(value: number) {
        this._glowColorSize = value;
        this.updateMaterial();
    }
    private _glowColorSize: number = 0.012;

    @property
    public get glowThreshold(): number {
        return this._glowThreshold;
    }
    public set glowThreshold(value: number) {
        this._glowThreshold = value;
        this.updateMaterial();
    }
    private _glowThreshold: number = 1.0;
    private updateMaterial() {
        const material = this.sprite?.getSharedMaterial(0);
        if (material) {
            material.setProperty('glowColor', this._glowColor);
            material.setProperty('glowColorSize', this._glowColorSize);
            material.setProperty('glowThreshold', this._glowThreshold);
        }
    }

    @property(sp.Skeleton)
    private comp: sp.Skeleton = null!;

    private _showOutterGlow: boolean = true;


    toggleGlowEffect() {
        this._showOutterGlow = !this._showOutterGlow;
        const material = this.sprite?.getSharedMaterial(0);
        if (material) {
            material.setProperty('SHOW_OUTTER_GLOW', this._showOutterGlow ? 1 : 0);
        }
    }


    start() {
        const spriteFrame = this.sprite.spriteFrame!;
        const sp = new SpriteFrame();
        sp.reset({
            originalSize: spriteFrame.originalSize,
            rect: spriteFrame.rect,
            offset: spriteFrame.offset,
            isRotate: spriteFrame.rotated,
            borderTop: spriteFrame.insetTop,
            borderLeft: spriteFrame.insetLeft,
            borderBottom: spriteFrame.insetBottom,
            borderRight: spriteFrame.insetRight,
        });

        const renderTex = RTCapture._renderTex = new RenderTexture();
        renderTex.reset({
            width: 256,
            height: 256,
        });
        this.camera.targetTexture = renderTex;
        sp.texture = renderTex;
        this.sprite.spriteFrame = sp;
        this.sprite.node.setScale(2, 2); // 放大2倍（根据需求调整值）




        const material = this.sprite.getSharedMaterial(0);
        if (material) {
            material.setProperty('glowColor', this.glowColor);
            material.setProperty('glowColorSize', this._glowColorSize);
            material.setProperty('glowThreshold', this._glowThreshold);
        }

        this.playAnimationsInSequence()
    }

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


    onDestroy() {
        if (RTCapture._renderTex) {
            RTCapture._renderTex.destroy();
            RTCapture._renderTex = null;
        }
    }
}

