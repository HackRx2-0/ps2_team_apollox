import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import AddFeed from "../Screens/HomeScreens/DiscussionsScreens/AddFeed"
import DiscussionsForum from "../Screens/HomeScreens/DiscussionsScreens/DiscussionsScreen"


const Stack = createStackNavigator();

export default function DiscussionRoomScreen() {

    return (

        <Stack.Navigator initialRouteName={"DiscussionsForum"}
        // screenOptions={{
        //     cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        // }}
        >
            <Stack.Screen name="DiscussionsForum" options={{ headerShown: false }} component={DiscussionsForum} />
            <Stack.Screen name="AddFeed"
                options={{ headerShown: false }}
                component={AddFeed} />




        </Stack.Navigator>
    )


}
