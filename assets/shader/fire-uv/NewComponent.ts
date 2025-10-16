import { _decorator, Component, DynamicAtlasManager, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NewComponent')
export class NewComponent extends Component {
    start() {
        DynamicAtlasManager.instance.enabled = false;
    }

    update(deltaTime: number) {
        
    }
}

