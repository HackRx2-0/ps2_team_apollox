import React, { useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import AddFeed from "../Screens/HomeScreens/DiscussionsScreens/AddFeed"
import DiscussionsForum from "../Screens/HomeScreens/DiscussionsScreens/DiscussionsScreen"
<<<<<<< HEAD
import FeedComment from '../Screens/HomeScreens/DiscussionsScreens/FeedComment';
=======
>>>>>>> a36406d8754f245bc27516358559b23f16847ff4


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
<<<<<<< HEAD
            <Stack.Screen name="FeedComment"
                options={{ headerShown: false }}
                component={FeedComment} />
=======
>>>>>>> a36406d8754f245bc27516358559b23f16847ff4




        </Stack.Navigator>
    )


}
