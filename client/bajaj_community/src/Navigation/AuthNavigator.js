import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import LoginScreen from "../Screens/AuthScreens/LoginScreen";
import OtpVerification from "../Screens/AuthScreens/OtpVerification";
import SignupScreen from "../Screens/AuthScreens/SignupScreen";
import { HeaderBackButton } from '@react-navigation/stack';
import Icon from "react-native-vector-icons/Feather"
import { View, Pressable } from 'react-native';
import Store from "../Store/Store";



const Stack = createStackNavigator();
function CustomBackButton(props) {
    return (
        <Pressable style={{
            width: 36,
            height: 36,
            opacity: 0.1,
            borderRadius: 10,
            backgroundColor: "#d4d4d4",
            marginLeft: 20,
            marginTop: 16,
            justifyContent: "center"
        }}>
            <Icon
                name={"arrow-left"}
                size={30}
                color={"#ffffff"}
                style={{ alignSelf: "center" }}
                {...props}
            />
        </Pressable>
    )
}

export function RegisterStack() {
    return (
        <Stack.Navigator initialRouteName={"Login"}
        // screenOptions={{
        //     cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        // }}
        >
            <Stack.Screen name="Signup"
                options={{
                    title: "",
                    headerTransparent: true,
                    // headerLeft: (props) => (
                    //     <CustomBackButton
                    //         {...props}
                    //     />
                    // ),
                }}
                component={SignupScreen} />
        </Stack.Navigator>
    )
}
export function AuthScreens() {

    return (

        <Stack.Navigator initialRouteName={"Login"}
        // screenOptions={{
        //     cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        // }}
        >

            <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
            <Stack.Screen name="OtpVerify"
                options={{
                    title: "",
                    headerTransparent: true,
                    headerLeft: (props) => (
                        <CustomBackButton
                            {...props}
                        />
                    ),
                }}
                component={OtpVerification} />
            <Stack.Screen name="Signup"
                options={{
                    title: "",
                    headerTransparent: true,
                    headerLeft: (props) => (
                        <CustomBackButton
                            {...props}
                        />
                    ),
                }}
                component={SignupScreen} />
        </Stack.Navigator>
    )


}