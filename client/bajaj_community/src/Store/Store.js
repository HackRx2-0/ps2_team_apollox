import { makeAutoObservable, observable } from "mobx";
class Store {
    authState = "";
    authToken = "";
    user_uid = "";
    user_name = "";
    recommendation_Card = true;

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
    setRecommendationCard(val) {
        this.recommendation_Card = val;
    }

}
export default new Store();