import * as React from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, Pressable } from 'react-native';
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FriendsScreen from "../Screens/HomeScreens/Friends";

import { ChatRoomScreen } from './ChatNavigator';


import DiscussionRoomScreen from "./DiscussionNavigator";
import AccountScreen from "./AccountsNavigator";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { customSize } from '../Utils/Utils';


const Tab = createBottomTabNavigator();
function CustomTabItem(props) {
    const { label, isFocused } = props

    const imageSrc = label == "Discussions" ? require("../Images/discussion-icon-selected.png")
        : label == "Chat Rooms" ? require("../Images/chatroom-icon.png")
            : label == "Friends" ? require("../Images/friends-icon.png")
                : label == "Account" ? require("../Images/account-icon.png") : null


    return (
        <View style={{ flex: 1, alignItems: "center", marginTop: 7.5 }}>
            <Image
                source={imageSrc}
                style={{ width: 28, height: 28, resizeMode: "contain" }}
            />
            <Text style={isFocused ? styles.focus_textStyle : styles.TextStyle}>
                {label}
            </Text>
        </View>
    )
}
function CustomTabBar({ state, descriptors, navigation }) {
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    if (focusedOptions.tabBarVisible === false) {
        return null;
    }
    return (

        <View style={styles.TabBarMainContainer} >

            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <Pressable
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        style={isFocused ? styles.focus_button : styles.button} >


                        {
                            label == "Discussion" ?
                                <CustomTabItem label="Discussions" isFocused={isFocused} />
                                : label == "ChatRoom" ? <CustomTabItem label="Chat Rooms" isFocused={isFocused} />
                                    : label == "Friends" ? <CustomTabItem label="Friends" isFocused={isFocused} />
                                        : label == "Account" ? <CustomTabItem label="Account" isFocused={isFocused} />
                                            : null
                        }
                        {/* <Text style={isFocused ? styles.focus_textStyle : styles.TextStyle}> {label} </Text> */}

                    </Pressable>
                );
            })}

        </View>
    );
}
export function HomeScreens() {

    return (

        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            tabBarOptions={{
                tabStyle: {
                    height: 100
                },

            }}
            backBehavior={"initialRoute"}
        >
            <Tab.Screen name="Discussion" component={DiscussionRoomScreen}
                options={({ route }) => ({
                    tabBarVisible: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                        console.log(routeName)
                        if (routeName === "AddFeed" || routeName === 'FeedComment') {
                            return false
                        }

                        return true
                    })(route),
                })}
            />
            <Tab.Screen name="ChatRoom" component={ChatRoomScreen}

                options={({ route }) => ({
                    tabBarVisible: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? ""
                        console.log(routeName)
                        if (routeName === "ChatRoom" || routeName === "FriendChatRoom" || routeName === "Web" || routeName === "ChatRoomInfo") {
                            return false
                        }

                        return true
                    })(route),
                })}
            />
            <Tab.Screen name="Friends" component={FriendsScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
}
const styles = StyleSheet.create({

    TabBarMainContainer: {
        justifyContent: 'space-around',
        height: 62,
        flexDirection: 'row',
        width: '100%',
    },

    button: {
        height: 62,
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: "#303d4b",
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1
    },

    focus_button: {
        height: 62,
        borderTopWidth: 4,
        borderTopColor: "#18a0fb",
        backgroundColor: "#303d4b",
        justifyContent: 'center',
        alignItems: 'center',

        flexGrow: 1
    },

    TextStyle: {
        color: "#b8c2c8",
        textAlign: 'center',
        fontSize: customSize(11.5),
        fontFamily: "Inter-Light",
        opacity: 0.5,
    },

    focus_textStyle: {
        color: "#b8c2c8",

        textAlign: 'center',
        fontSize: customSize(11.5),
        fontFamily: "Inter-Light"

    }

});