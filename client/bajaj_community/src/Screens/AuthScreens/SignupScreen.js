import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { BackgroundImage } from "../../Components/BackgroundImage"
import { customSize, height, getData, storeData } from '../../Utils/Utils';
import { CustomInput } from '../../Components/CustomInput';
import { Join } from '../../Functions/AppFunctions';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Store from '../../Store/Store';


function SignupScreen() {

    const [disabled, setDisabled] = useState(true);
    const [authState, setAuthState] = useState();
    const [name, setName] = useState(Store.userGoogleName);
    const [field, setField] = useState();


    useEffect(async () => {
        const authStateVal = await getData('authState')
        setAuthState(authStateVal);

    }, []);

    return (
        <ScrollView
            style={styles.mainContainer}
            keyboardShouldPersistTaps={"handled"}
            contentContainerStyle={{ paddingBottom: "10%", backgroundColor: "#ffffff" }}
        >
            <View>

                <BackgroundImage
                    imgHeight={height / 2.85}
                    marginTop={-40}
                />
            </View>
            <View style={styles.bottomCard}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.text1}>
                        Full Name
                    </Text>
                    {console.log("nameee", Store.userGoogleName)}
                    <CustomInput
                        IconName="user"
                        IconSize={24}
                        IconColor={"#c4c4c4"}
                        placeholder={"Your Name"}
                        placeholderTextColor={"#c4c4c4"}
                        feather={true}
                        value={name}
                        keyboardType={"default"}
                        onChangeText={(res) => {
                            setName(res)
                            if (res != "") {

                                //Condition for button to set to true
                                setDisabled(false)
                            } else {
                                setDisabled(true)
                            }
                        }}
                    />
                    <Text style={[styles.text1, { marginTop: "3.4%", }]}>
                        {authState == "1" ? "Email" : "Phone Number"}
                    </Text>
                    <CustomInput
                        IconName="mail"
                        IconSize={22}
                        IconColor={"#c4c4c4"}
                        placeholder={authState == "1" ? "Email Address" : "Phone Number"}
                        placeholderTextColor={"#c4c4c4"}
                        keyboardType={"email-address"}
                        feather={true}


                        onChangeText={(res) => {
                            if (res != "") {
                                setField(res)
                                //Condition for button to set to true
                                setDisabled(false)
                            } else {
                                setDisabled(true)
                            }
                        }}
                    />
                    <Pressable
                        style={[styles.button, { backgroundColor: disabled ? "#cbcaca" : "#09bc8a", }]}
                        // disabled={disabled}
                        onPress={() => {
                            // alert("clicked")
                            Join(name, field)
                        }}

                    >
                        <Text style={styles.buttonText}>
                            Join Community
                        </Text>
                    </Pressable>
                    <Text style={styles.text2}>
                        By joining the community you agree to our <Text style={styles.bold}>Terms & Conditions</Text>
                    </Text>
                </View>

            </View>
        </ScrollView>
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
        marginLeft: "10.75%",
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
export default SignupScreen;