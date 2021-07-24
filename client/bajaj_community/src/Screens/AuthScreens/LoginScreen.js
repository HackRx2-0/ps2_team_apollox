import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TextInput, Pressable } from 'react-native';
import { BackgroundImage } from "../../Components/BackgroundImage"
import { height } from '../../Utils/Utils';
import { CustomInput } from '../../Components/CustomInput';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { onGoogleButtonPress, SendOtp } from "../../Functions/AppFunctions";

function LoginScreen({ navigation }) {
    const [disabled, setDisabled] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState("");
    return (
        <ScrollView
            style={styles.mainContainer}
            keyboardShouldPersistTaps={"handled"}
            contentContainerStyle={{ paddingBottom: "10%", backgroundColor: "#ffffff" }}
        >
            <View>
                <BackgroundImage
                    imgHeight={height / 1.32}
                    marginTop={80}
                />
            </View>
            <View style={styles.bottomCard}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.text1}>
                        Login/Signup
                    </Text>
                    {/* <CustomInput
                        IconName="phone-alt"
                        IconSize={20}
                        IconColor={"#c4c4c4"}
                        placeholder={"Mobile Number"}
                        placeholderTextColor={"#c4c4c4"}
                        keyboardType={"number-pad"}
                        onChangeText={(res) => {
                            if (res != "") {
                                //Condition for button to set to true
                                if (res.length == 10) {
                                    console.log(10)
                                    setDisabled(false)
                                    setPhoneNumber(res)
                                } else {
                                    setDisabled(true)
                                }

                            } else {

                            }
                        }}
                    />
                    <Pressable
                        style={[styles.button, { backgroundColor: disabled ? "#cbcaca" : "#09bc8a", }]}
                        disabled={disabled}
                        onPress={() => {
                            // alert("clicked")
                            navigation.navigate("OtpVerify")
                            SendOtp(phoneNumber)
                        }}

                    >
                        <Text style={styles.buttonText}>
                            NEXT
                        </Text>
                    </Pressable>


                    <Text style={styles.text2}>
                        OR
                    </Text> */}
                    <GoogleSigninButton
                        style={{
                            width: "82%",
                            height: 50,
                            borderRadius: 10,
                            elevation: 0,
                            alignSelf: "center", marginLeft: "0.8%",
                            marginTop: "5%"
                        }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={async () => {
                            // console.log(await onGoogleButtonPress())

                            onGoogleButtonPress().then(async (res) => {
                                console.log(res)
                                const data = await GoogleSignin.getTokens();
                                // console.log(data)
                            }).catch((err) => {
                                console.log(err)
                            })
                        }}
                    />
                </View>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
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
        marginLeft: "10%",
        fontSize: 16,
        marginBottom: "5%",
        marginTop: "6.8%",
        color: "#303d4b"
    },
    text2: {
        fontFamily: "Inter-Bold",
        fontSize: 16,
        color: "#303d4b",
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
        height: 46,
        borderRadius: 10,
        alignSelf: "center",
        marginVertical: "6%"
    }
})
export default LoginScreen;