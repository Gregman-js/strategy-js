import Field from "./Field.js";
import Resource from "../Resource.js";

export default class MineTree extends Field {
    name = 'mine-tree';
    resource = new Resource('wood', 1, 10, 'rgb(54,14,0)');
}
