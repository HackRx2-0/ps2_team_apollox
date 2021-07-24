// import React, { Component, useState, useEffect } from 'react';
// import { Text, View } from 'react-native';
// import { getUserdata } from '../../Functions/ApiFunction';
// import { storeData, getData } from '../../Utils/Utils';

// export default function AccountScreen() {

//     useEffect(async () => {
//         const authToken = await getData('authTokenServer')
//         console.log("account scren token", authToken)
//         getUserdata(authToken);

//     }, []);
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Account!</Text>
//         </View>
//     );
// }



// import { getUserdata } from '../../Functions/ApiFunction';
// import { storeData, getData } from '../../Utils/Utils';
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Image, ImageBackground } from 'react-native';
import { BackgroundImage } from "../../../Components/BackgroundImage"
import { customSize, height, getData, storeData, width } from '../../../Utils/Utils';
import { CustomInput } from '../../../Components/CustomInput';
import { Join } from '../../../Functions/AppFunctions';
import { getUserdata } from '../../../Functions/ApiFunction';
import Store from '../../../Store/Store';
import { Icon } from 'react-native-vector-icons/icon';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { apiBaseUrl } from '../../../Config/Config';


export default function AccountScreen({ navigation }) {


    const [userDetail, setUserDetail] = useState("");
    const [isLoading, setLoading] = useState(true);
    const [recommendedProductsArray, setRecommendedProductsArray] = useState([]);


    useEffect(async () => {
        const authToken = await getData('authTokenServer')
        console.log("account scren token", authToken)
        const getDetails = await getUserdata(authToken);
        console.log(getDetails)
        setUserDetail(getDetails)
        setLoading(false)
    }, []);
    useEffect(() => {
        axios.get(`${apiBaseUrl}/user/favorites/products/`, {
            headers: {
                "Authorization": `Bearer ${Store.authToken}`
            }
        },
        ).then((res) => {
            console.log("FROM SERVER", res.data)
            setRecommendedProductsArray(res.data)


        }).catch((err) => {
            console.log(err)
        })

    }, [])

    return (
        isLoading ?
            <View style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>


                <ActivityIndicator
                    color='#1d6ff2'
                    size={48}
                    animating={isLoading}
                />


            </View> :
            <View
                style={styles.mainContainer}

            >
                <View>
                    <View>
                        <ImageBackground
                            source={require("../../../Images/Background.jpg")}
                            style={{ width: width, height: height * .2, justifyContent: "center" }}
                        >
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignSelf: "center",
                                    //marginTop: props?.marginTop
                                }}
                            >



                            </View>

                        </ImageBackground>

                    </View>
                </View>
                <View style={styles.bottomCard}>
                    <View style={{
                        flex: 1, width: width * .3, height: width * .3,
                        borderRadius: (width * .3) / 2, alignSelf: 'center', marginTop: -50, elevation: 50
                    }}><Image source={{ uri: 'https://placeimg.com/140/140/any' }} style={{
                        width: width * .3, height: width * .3,
                        borderRadius: (width * .3) / 2
                    }} /></View>

                    <Text style={styles.text1}>

                        {userDetail.name}
                    </Text>

                    <View style={{ width: width - 74, flex: 1, alignSelf: "center" }}>
                        <View style={{ flexDirection: "row", marginVertical: "5%" }}>

                            <Image
                                source={require("../../../Images/email.png")}
                                style={{
                                    width: 24,
                                    height: 24, resizeMode: "contain",
                                    marginRight: 12
                                }}
                            />
                            <Text style={styles.text2}>
                                {userDetail.email_id}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Image
                                source={require("../../../Images/phone.png")}
                                style={{
                                    width: 20,
                                    height: 20, resizeMode: "contain",
                                    marginRight: 12
                                }}
                            />
                            <Text style={styles.text2}>
                                {userDetail.phone_no}
                            </Text>
                        </View>
                    </View>
                    <View style={{
                        width: width - 74,
                        alignSelf: "center",
                        height: 1.5,
                        marginTop: "6.4%",
                        backgroundColor: "#eeeeee"
                    }} />
                    <View style={{ width: width - 74, flex: 1, marginTop: "10%", alignSelf: "center" }}>
                        <Pressable style={{ flexDirection: "row", marginVertical: "10%" }}
                            onPress={() => {
                                navigation.navigate("SavedProducts")
                            }}

                        >
                            <Image
                                source={require("../../../Images/bookmark.png")}
                                style={{
                                    width: 30,
                                    height: 30, resizeMode: "contain",
                                    marginRight: 25
                                }}
                            />
                            <Text style={{
                                fontSize: customSize(16),
                                fontFamily: "Inter-Regular",
                                color: "#000000"
                            }}>
                                Saved Products ({recommendedProductsArray.length})
                            </Text>
                        </Pressable>
                        <View style={{ flexDirection: "row" }}>
                            <Image
                                source={require("../../../Images/edit.png")}
                                style={{
                                    width: 30,
                                    height: 30, resizeMode: "contain",
                                    marginRight: 25
                                }}
                            />
                            <Text style={{
                                fontSize: customSize(16),
                                fontFamily: "Inter-Regular",
                                color: "#000000"
                            }}>
                                You Posts (1)
                            </Text>
                        </View>
                    </View>
                    <Pressable
                        style={{
                            alignSelf: "center", width: width - 74, height: 54,
                            alignItems: "center", backgroundColor: "#eeeeee",
                            flexDirection: "row",
                            borderRadius: 10, marginTop: "25%",
                            marginBottom: "25%"

                        }}
                        onPress={() => {
                            auth().signOut()
                            AsyncStorage.clear()
                        }}
                    >
                        <Image
                            source={require("../../../Images/logout-icon.png")}
                            style={{
                                width: 24,
                                height: 24,
                                resizeMode: "contain",
                                marginLeft: "8%"
                            }}
                        />
                        <Text
                            style={{
                                fontSize: customSize(14),
                                color: "#737373",
                                fontFamily: "Inter-Regular",
                                marginLeft: "28%"
                            }}
                        >
                            Log Out
                        </Text>
                    </Pressable>
                </View>

            </View>
    )
}
const styles = StyleSheet.create({
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    codeInputFieldStyle: {
        width: 45,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 2,

        marginBottom: 5,
        color: "#303d4b",
        fontFamily: "Inter-Bold",
        fontSize: customSize(15)
    },

    codeInputHighlightStyle: {
        borderColor: "black",

    },
    mainContainer: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    bottomCard: {
        backgroundColor: "#ffffff",
        flex: 1,
        marginTop: -50,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    text1: {
        fontFamily: "Inter-Bold",
        textAlign: 'center',
        fontSize: 16,
        marginBottom: "3.4%",
        marginTop: "6.8%",
        color: "#303d4b"
    },
    text2: {
        fontFamily: "Inter-Regular",
        fontSize: 12,
        color: "#9b9b9b",
        alignSelf: "center"
    },

    buttonText: {
        alignSelf: "center",
        textAlignVertical: "center",
        flex: 1,
        fontFamily: "Inter-Medium",
        fontSize: 16,
        color: "#ffffff"
    },
    button: {
        width: "80%",
        height: 52,
        borderRadius: 10,
        alignSelf: "center",
        marginVertical: "10%"
    },
    otpContainer: {
        width: '80%', height: height / 11, padding: "5%",
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 10,
        backgroundColor: "#f9f9f9"
    },
    bold: {
        fontFamily: "Inter-Bold",
        fontSize: 12,
        color: "#9b9b9b",
        alignSelf: "center"
    }
});
