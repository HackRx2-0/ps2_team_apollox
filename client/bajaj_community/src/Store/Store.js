import { makeAutoObservable, observable } from "mobx";
class Store {
    authState = "";
    constructor() {
        makeAutoObservable(this);
    }
    setAuthStateVal(val) {
        this.authState = val;
    }

}
export default new Store();