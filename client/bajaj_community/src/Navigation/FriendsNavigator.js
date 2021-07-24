import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import FriendsScreen from "../Screens/HomeScreens/FriendsChatScreens/Friends";
import PvtChat from "../Screens/HomeScreens/FriendsChatScreens/PvtChat";





const Stack = createStackNavigator();

export default function FriendScreen() {

    return (

        <Stack.Navigator initialRouteName={"FriendsScreen"}
        // screenOptions={{
        //     cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        // }}
        >
            <Stack.Screen name="FriendsScreen" options={{ headerShown: false }} component={FriendsScreen} />
            <Stack.Screen name="PvtChat"
                options={{ headerShown: false }}
                component={PvtChat} />





        </Stack.Navigator>
    )


}
