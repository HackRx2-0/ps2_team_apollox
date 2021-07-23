import auth from '@react-native-firebase/auth';
import React, { useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from "../Config/Config"
import { showNotification, storeData } from '../Utils/Utils';
import Store from '../Store/Store';
GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
});
var confirmationData = null;
export async function SendOtp(phoneNumber) {
    console.log("OTP SENDING")
    const confirmation = await auth().signInWithPhoneNumber(`+91${phoneNumber}`);
    confirmationData = confirmation;
    return confirmation;
}
export async function confirmCode(code) {

    try {
        const data = await confirmationData.confirm(code);
        storeData('authState', "1")
        Store.setAuthStateVal("1")
        setTimeout(() => {

        }, 1000)


        return data;
    } catch (error) {
        showNotification("Invalid Code")
        console.log(error.message)
        return error;
    }
}

export async function onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    //return auth().signInWithCredential(googleCredential);
    if (auth().signInWithCredential(googleCredential)) {
        storeData("authState", "2")
        Store.setAuthStateVal("2")
    }
    return true
}