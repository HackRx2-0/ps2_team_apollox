import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Keyboard } from 'react-native';

import OTPInputView from '@twotalltotems/react-native-otp-input'
import { BackgroundImage } from '../../Components/BackgroundImage';
import { customSize, height } from '../../Utils/Utils';

import { confirmCode } from '../../Functions/AppFunctions';
import RNOtpVerify from "react-native-otp-verify";


function OtpScreen({ navigation }) {



    const [disabled, setDisabled] = useState(true);
    const [otp, setOtp] = useState("");
    useEffect(async () => {
        RNOtpVerify.getHash()
            .then(console.log)
            .catch(console.log);
        const data = await RNOtpVerify.getOtp()
        if (data) {
            RNOtpVerify.addListener(otpHandler)
        }
        // startListeningForOtp = () => {
        //     RNOtpVerify.getOtp()
        //     .then(p => {
        //         console.log(p)
        //     })
        //     .catch(p => console.log(p));
        // }
        console.log(data)


        return () => {
            RNOtpVerify.removeListener();
        }
    }, [])
    function otpHandler(message) {
        console.log("message", message)
        if (message == "Timeout Error.") {
            console.log("TIMED OUT")
            return
        }
        else {
            const otpVal = /(\d{6})/g.exec(message)[1];

            if (otpVal != "") {
                //Condition for button to set to true
                setDisabled(false)
                confirmCode(otpVal)

            } else {
                setDisabled(true)
            }
            setOtp(otpVal)

        }
    }

    // setOtp(otp)
    // RNOtpVerify.removeListener();
    // Keyboard.dismiss();


    let timer = () => { };


    const [timeLeft, setTimeLeft] = useState(30);

    const startTimer = () => {
        timer = setTimeout(() => {
            if (timeLeft <= 0) {
                clearTimeout(timer);
                return false;
            }
            setTimeLeft(timeLeft - 1);
        }, 1000)
    }

    useEffect(() => {
        startTimer();
        return () => clearTimeout(timer);
    });

    const start = () => {
        setTimeLeft(30);
        clearTimeout(timer);
        startTimer();
    }

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
                        Enter OTP
                    </Text>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <OTPInputView
                            style={styles.otpContainer}
                            pinCount={6}
                            // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                            // onCodeChanged = {code => { this.setState({code})}}
                            code={otp}
                            onCodeChanged={code => {
                                setOtp(code)

                            }}
                            autoFocusOnLoad
                            codeInputFieldStyle={styles.codeInputFieldStyle}
                            codeInputHighlightStyle={styles.codeInputHighlightStyle}

                            onCodeFilled={(code => {
                                console.log(`Code is ${code}, you are good to go!`)
                                if (code != "") {
                                    //Condition for button to set to true
                                    setDisabled(false)

                                } else {
                                    setDisabled(true)
                                }
                            })}
                        />
                    </View>
                    <Pressable
                        style={[styles.button, { backgroundColor: disabled ? "#cbcaca" : "#09bc8a", }]}
                        disabled={disabled}
                        onPress={() => {
                            // alert("clicked")
                            confirmCode(otp)

                        }}

                    >
                        <Text style={styles.buttonText}>
                            Proceed
                        </Text>
                    </Pressable>
                    <Text style={styles.text2}>
                        Resend OTP in {timeLeft}
                    </Text>
                </View>

            </View>
        </ScrollView>
    )
}
export default OtpScreen;
const styles = StyleSheet.create({
    borderStyleBase: {
        width: 30,
        height: 45
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    codeInputFieldStyle: {
        width: 30,
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
        marginBottom: "5%",
        marginTop: "6.8%",
        color: "#303d4b"
    },
    text2: {
        fontFamily: "Inter-Regular",
        fontSize: 14,
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


    }
});