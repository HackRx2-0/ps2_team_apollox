import { makeAutoObservable, observable } from "mobx";
class Store {
    authState = "";
    authToken = "";
    user_uid = "";
    user_name = "";

    constructor() {
        makeAutoObservable(this);
    }
    setAuthStateVal(val) {
        this.authState = val;
    }
    setAuthToken(val) {
        this.authToken = val;
    }
    setUserUid(val) {
        this.user_uid = val;
    }
    setUserName(val) {
        this.user_name = val;
    }

}
export default new Store();