import Field from "./Field.js";
import Resource from "../Resource.js";

export default class Fortress extends Field {
    name = 'fortress';
    resource = new Resource('money', 1, 15, 'rgb(159,130,44)');
}
