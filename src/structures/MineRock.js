import Field from "./Field.js";
import Resource from "../Resource.js";

export default class MineRock extends Field {
    name = 'mine-rock';
    resource = new Resource('stone', 1, 8, 'rgb(79,79,79)');
}
