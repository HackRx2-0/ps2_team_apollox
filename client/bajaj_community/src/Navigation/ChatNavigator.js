import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import ChatRoom from "../Screens/HomeScreens/ChatRoomScreens/ChatRoom";
import FriendChatRoom from "../Screens/HomeScreens/ChatRoomScreens/FriendChatRoom";

import ChatRoomHome from "../Screens/HomeScreens/ChatRoomScreens/ChatRoomHome";
import showWeb from "../Screens/CommonScreens/showWeb";
import ChatRoomInfo from '../Screens/HomeScreens/ChatRoomScreens/ChatRoomInfo';







const Stack = createStackNavigator();

export function ChatRoomScreen() {

    return (

        <Stack.Navigator initialRouteName={"ChatRoomHome"}
        // screenOptions={{
        //     cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        // }}
        >
            <Stack.Screen name="ChatRoomHome" options={{ headerShown: false }} component={ChatRoomHome} />
            <Stack.Screen name="ChatRoom"
                options={{ headerShown: false }}
                component={ChatRoom} />
            <Stack.Screen name="FriendChatRoom"
                options={{ headerShown: false }}
                component={FriendChatRoom} />
            <Stack.Screen name="ChatRoomInfo"
                options={{ headerShown: false }}
                component={ChatRoomInfo} />

            <Stack.Screen name="Web"
                options={{ headerTitle: "Product Info" }}
                component={showWeb} />



        </Stack.Navigator>
    )


}
