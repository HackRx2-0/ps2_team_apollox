import React, { createContext } from 'react';
import { Dimensions, ToastAndroid, PixelRatio } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const width = Dimensions.get("screen").width
export const height = Dimensions.get("screen").height

export const AuthContext = createContext(null)


export const showNotification = (text) => {
    ToastAndroid.show(text, ToastAndroid.SHORT)
}

export const customSize = (size) => {
    const newSize = size * (Dimensions.get("window").width / 320)
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
}

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
        console.log('value set', key)
    } catch (e) {
        console.log(e)
    }
}


export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value
            // value previously stored
        }
    } catch (e) {
        console.log(e)
        // error reading value
    }
}


// export const clearData = async () => {
//     await AsyncStorage.clear();
// }


// export const saveData = (key, value) => {
//     AsyncStorage.setItem(key, JSON.stringify(value))
// }