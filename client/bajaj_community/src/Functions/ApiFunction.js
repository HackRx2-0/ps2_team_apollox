import axios from "axios";
import { apiBaseUrl } from "../Config/Config";
import Store from "../Store/Store";
import { storeData } from "../Utils/Utils";

export async function OtpLogin(token) {
    var res = null;
    console.log(apiBaseUrl)
    await axios.post(apiBaseUrl + '/auth/login/otp', {
        "token": token
    }).then(async (response) => {
        console.log("serverrrrr", response.data.token)
        res = response.data
        storeData("authTokenServer", response.data.token)
        Store.setAuthToken(response.data.token)
    }).catch((err) => {
        console.log(err)
    })
    return res;
}

export async function GoogleLogin(token) {
    var res = null;
    await axios.post(apiBaseUrl + '/auth/login/google', {
        "token": token
    }).then(async (response) => {
        console.log("Tooookennnnn", response.data.token)
        res = response.data
        storeData("authTokenServer", response.data.token)
        Store.setAuthToken(response.data.token)

    }).catch((err) => {
        console.log(err)
    })
    return res;
}

export async function updateData(name, email, phone, token) {
    console.log("apicalll", name, email, phone, token)
    await axios.put(apiBaseUrl + '/user', {
        "name": name,
        "email_id": email,
        "phone_no": phone
    }, {
        headers: {
            authorization: "Bearer " + token
        }
    }).then(async (response) => {
        console.log(response.data)
    }).catch((err) => {
        console.log(err)
    })
}