import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import Account from "../Screens/HomeScreens/AccountScreen/Account"
import SavedProducts from "../Screens/HomeScreens/AccountScreen/SavedProducts"
import Icon from "react-native-vector-icons/Feather"

import showWeb from "../Screens/CommonScreens/showWeb";
import { View } from 'react-native';


const Stack = createStackNavigator();

export default function AccountsScreen() {

    return (

        <Stack.Navigator initialRouteName={"Account"}
        // screenOptions={{
        //     cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        // }}
        >
            <Stack.Screen name="Account" options={{ headerShown: false }} component={Account} />
            <Stack.Screen name="SavedProducts"


                options={{
                    headerTitle: "My Favourites",
                    headerStyle: {
                        backgroundColor: "#303d4b"
                    },
                    headerTitleStyle: {
                        color: "#ffffff",
                        justifyContent: "center",
                        alignSelf: "center",
                        marginLeft: -50
                    },
                    headerLeft: (props) => (
                        <View
                            style={{
                                backgroundColor: "#404c59",
                                width: 36, height: 36,
                                borderRadius: 8,
                                justifyContent: "center", alignItems: "center",
                                marginLeft: 14
                            }}
                        >
                            <Icon
                                name={"arrow-left"}
                                size={28}
                                color={"#ffffff"}
                                style={{ alignSelf: "center" }}
                                {...props}
                            />
                        </View>
                    )


                }} component={SavedProducts} />

            <Stack.Screen name="Web"
                options={{
                    headerTitle: "Product Info",
                    headerStyle: {
                        backgroundColor: "#303d4b"
                    },
                    headerTitleStyle: {
                        color: "#ffffff",
                        justifyContent: "center",
                        alignSelf: "center",
                        marginLeft: -50
                    },
                    headerLeft: (props) => (
                        <View
                            style={{
                                backgroundColor: "#404c59",
                                width: 36, height: 36,
                                borderRadius: 8,
                                justifyContent: "center", alignItems: "center",
                                marginLeft: 14
                            }}
                        >
                            <Icon
                                name={"arrow-left"}
                                size={28}
                                color={"#ffffff"}
                                style={{ alignSelf: "center" }}
                                {...props}
                            />
                        </View>
                    )


                }}
                component={showWeb} />


        </Stack.Navigator>
    )


}
