
import React, { Component } from 'react';
import { View, Text, Image, TextInput } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';


import { customSize, height, width } from '../Utils/Utils.js';





export function CustomInput(props) {
    const { IconName, IconSize, IconColor, placeholder, placeholderTextColor, onChangeText, keyboardType, feather } = props;

    return (
        <View style={{
            flexDirection: "row", alignContent: "center",
            width: "80%", alignSelf: "center", paddingLeft: "3.2%",
            paddingRight: "4%",
            borderRadius: 10,
            backgroundColor: "#fbfbfb",
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#d4d4d4"



        }}>
            {feather ?
                <Feather
                    name={IconName}
                    size={IconSize}
                    color={IconColor}
                    style={{ alignSelf: "center" }}
                />
                : <Icon
                    name={IconName}
                    size={IconSize}
                    color={IconColor}

                    style={{ alignSelf: "center" }}
                />
            }
            <TextInput
                style={{ width: "88%", marginLeft: "5%" }}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
            />
        </View>
    )
}
