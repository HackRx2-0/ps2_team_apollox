import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import AddFeed from "../Screens/HomeScreens/DiscussionsScreens/AddFeed"
import DiscussionsForum from "../Screens/HomeScreens/DiscussionsScreens/DiscussionsScreen"
import FeedComment from '../Screens/HomeScreens/DiscussionsScreens/FeedComment';


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
            <Stack.Screen name="FeedComment"
                options={{ headerShown: false }}
                component={FeedComment} />




        </Stack.Navigator>
    )


}
