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
        storeData('authState', "3")
        Store.setAuthStateVal("3")

    }).catch((err) => {
        console.log(err)
    })
}

export async function getUserdata(token) {
    var sendResponse
    await axios.get(apiBaseUrl + '/user', {
        headers: { authorization: 'Bearer ' + token }
    }).then((res) => {
        console.log("userrrr data", res.data)
        sendResponse = res.data;

    }).catch((err) => {
        console.log(err)
    })
    return sendResponse
}

export async function leaveGroup(grpId) {
    console.log("groid", grpId)
    var returnValue
    await axios.post(apiBaseUrl + '/group/leave',
        {
            "group_id": grpId
        }, {
        headers: { authorization: 'Bearer ' + Store.authToken }
    }).then((res) => {
        returnValue = true
        console.log("grp leave then", res.data)
    }).catch((err) => {
        returnValue = false
        console.log("grp leave catch", err)
    })
    return returnValue
}

export async function getPosts() {
    var retVal
    await axios.get(apiBaseUrl + '/forum/posts/all', {
        headers: { authorization: 'Bearer ' + Store.authToken }
    }).then((res) => {
        retVal = res.data;
        console.log("post api then", res.data)
    }).catch((err) => {
        retVal = false;
        console.log("post api catch", err)
    })
    return retVal
}


export async function postFeed(title, body, topic) {
    var retVal
    console.log("post feed called", title, body, topic)
    await axios.post(apiBaseUrl + '/forum/post', {
        "title": title,
        "body": body,
        "topic": topic
    }, {
        headers: { authorization: 'Bearer ' + Store.authToken }
    }).then((res) => {
        retVal = res.data;
        console.log(res.data)
    }).catch((err) => {
        retVal = false;
        console.log(err)
    })
    return retVal
}

export async function upVotePost(id, type) {
    var retVal
    console.log("post upvote called", id, type)
    await axios.post(apiBaseUrl + '/forum/post/vote', {
        "forum_id": id,
        "type": type
    }, {
        headers: { authorization: 'Bearer ' + Store.authToken }
    }).then((res) => {
        retVal = res.data;
        console.log(res.data)
    }).catch((err) => {
        retVal = false;
        console.log(err)
    })
    return retVal
}