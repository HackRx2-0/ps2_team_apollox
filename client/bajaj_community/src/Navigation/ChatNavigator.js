import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import ChatRoom from "../Screens/HomeScreens/ChatRoomScreens/ChatRooms";
import ChatRoomHome from "../Screens/HomeScreens/ChatRoomScreens/ChatRoomHome";





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

                component={ChatRoom} />



        </Stack.Navigator>
    )


}