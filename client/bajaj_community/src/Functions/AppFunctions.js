import auth from '@react-native-firebase/auth';
import React, { useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from "../Config/Config"
import { showNotification, storeData, getData } from '../Utils/Utils';
import Store from '../Store/Store';
import { OtpLogin, GoogleLogin, updateData } from './ApiFunction';

GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
});
var confirmationData = null;
export async function SendOtp(phoneNumber) {
    console.log("OTP SENDING")
    const confirmation = await auth().signInWithPhoneNumber(`+91${phoneNumber}`);
    confirmationData = confirmation;
    console.log("confirmDATA", confirmation)
    return confirmation;
}
export async function confirmCode(code) {

    try {
        const data = await confirmationData.confirm(code);

        if (auth().currentUser) {
            auth().currentUser.getIdToken().then(async (res) => {
                console.log("TOKEN at confirm CODE", res)
                const data = await OtpLogin(res);
                console.log("FROM SERVER", data)
                if (data.isNewUser) {

                    storeData('userPhone', data.phone_no)
                    storeData('authState', "1")
                    Store.setAuthStateVal("1")
                } else {
                    storeData('authState', "3")
                    Store.setAuthStateVal("3")
                }

            }).catch((err) => {
                console.log("ERR", err)

            })
        }


        return data;
    } catch (error) {
        showNotification("Invalid Code")
        console.log(error.message)
        return error;
    }
}
export async function Join(name, field) {
    const authState = await getData('authState')
    var token = await getData('authTokenServer')
    console.log(authState)
    console.log("tooooo", token)
    if (authState == '1') {
        var userUpdate = await getData('userPhone')
        updateData(name, field, userUpdate, token)

    }
    else {
        var userUpdate = await getData('userEmail')
        updateData(name, userUpdate, field, token)
    }
}

export async function onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    //return auth().signInWithCredential(googleCredential);

    const status = await auth().signInWithCredential(googleCredential)
    console.log("GOOGLE FUN", status.additionalUserInfo.profile.given_name)
    Store.setUserGoogleName(status.additionalUserInfo.profile.given_name)
    if (status) {
        // storeData("authState", "2")
        // Store.setAuthStateVal("2")
        if (auth().currentUser) {
            auth().currentUser.getIdToken().then(async (res) => {
                console.log("TOKEN at confirm CODE", res)
                const data = await GoogleLogin(res);
                console.log("FROM SERVER GOOGLE LOGIN", data)
                console.log("authdatat before set", Store.authState)
                if (data.isNewUser) {

                    storeData('userEmail', data.email_id)
                    storeData('authState', "2")
                    Store.setAuthStateVal("2")
                } else {
                    storeData('authState', "3")
                    Store.setAuthStateVal("3")
                }

            }).catch((err) => {
                console.log("ERR", err)

            })
        }
    }
    return true
}