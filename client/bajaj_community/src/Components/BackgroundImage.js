import React, { Component } from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import { customSize, height, width } from '../Utils/Utils.js';





export function BackgroundImage(props) {
    const { imgHeight, marginTop } = props;

    return (
        <View>
            <ImageBackground
                source={require("../Images/Background.jpg")}
                style={{ width: width, height: imgHeight, justifyContent: "center" }}
            >
                <View
                    style={{
                        justifyContent: "center",
                        alignSelf: "center",
                        marginTop: props?.marginTop
                    }}
                >


                    <Image
                        source={require("../Images/logo.png")}
                        style={{
                            width: 300, height: 60, resizeMode: "contain",

                        }}

                    />
                    <Text style={{
                        fontSize: customSize(14), alignSelf: "center",
                        fontFamily: "Inter-Bold"
                        , color: "#ffffff", letterSpacing: 6
                    }}>
                        COMMUNITY
                    </Text>
                </View>

            </ImageBackground>

        </View>
    )
}
