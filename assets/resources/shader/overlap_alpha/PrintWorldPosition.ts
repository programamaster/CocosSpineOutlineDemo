import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PrintWorldPosition')
export class PrintWorldPosition extends Component {
    update(deltaTime: number) {
        const worldPos = this.node.worldPosition;
        console.log(`World Position: (${worldPos.x}, ${worldPos.y}, ${worldPos.z})`);
    }
}