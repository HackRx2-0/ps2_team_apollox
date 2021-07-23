import axios from "axios";
import { apiBaseUrl } from "../Config/Config";

export default function otpLogin(token) {
    await axios.post(apiBaseUrl + '/auth/login/otp', {
        "token": token
    }).then(async (res) => {
        console.log(rec)
    }).catch((err) => {
        console.log(err)
    })
}

export default function googleLogin(token) {
    await axios.post(apiBaseUrl + '/auth/login/google', {
        "token": token
    }).then(async (res) => {
        console.log(rec)
    }).catch((err) => {
        console.log(err)
    })
}