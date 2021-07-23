import React, { useEffect, useState, createRef } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Pressable, Image, ScrollView, Alert, LogBox } from 'react-native';
import { customSize, height, showNotification, width } from '../../../Utils/Utils';
import axios from 'axios';
import { apiBaseUrl } from '../../../Config/Config';
import Store from '../../../Store/Store';
import io from "socket.io-client";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionSheet from "react-native-actions-sheet";
const actionSheetRef = createRef();
export default function ChatRoomHome({ navigation }) {

    const [roomsData, setRoomsData] = useState("");
    const [allroomsData, setAllRoomsData] = useState("");

    const [isLoading, setLoading] = useState(true);
    const [isLoadingAllrooms, setLoadingAllRooms] = useState(true);

    const [socket, setSocket] = useState(null)
    const [groupID, setGroupID] = useState(null)
    const [groupName, setGroupName] = useState(null)



    useEffect(() => {

        LogBox.ignoreLogs([
            'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
        ]);
        const TOKEN = Store.authToken
        const newSocket = io("https://www.api.apollox.atifhossain.me", {
            auth: {
                token: `Bearer ${TOKEN}`
            },
        });
        console.log(newSocket)
        setSocket(newSocket)


        return () => { newSocket.close() }
    }, [])




    useEffect(() => {
        console.log(Store.authToken)
        axios.get(`${apiBaseUrl}/groups/all`, {
            headers: {
                "Authorization": `Bearer ${Store.authToken}`
            }
        }).then((res) => {
            console.log("all rooms", res.data)
            setAllRoomsData(res.data)
            setLoadingAllRooms(false)


        }).catch((err) => {
            console.log(err)

        })
        navigation.addListener("focus", () => {
            getMyGroup()

        })


    }, [])

    function joinGroup(id, name) {

        console.log(id, name)
        let payload = {
            group_id: id
        }


        axios.post(`${apiBaseUrl}/group/join`, {
            group_id: id
        }, {
            headers: {
                "Authorization": `Bearer ${Store.authToken}`
            }
        },
        ).then((res) => {
            actionSheetRef.current?.hide();
            console.log("all rooms", res.data)
            socket.emit("JOIN_ROOM", payload, (res) => {
                if (res.status == "NOK") {
                    showNotification("Error Try Again")
                    return
                } else {

                    showNotification("Joined Successfully")
                    // console.log("ID", item.uid)
                    // console.log("ID", socket)
                    // console.log("ID", item.name)

                    navigation.navigate("ChatRoom", {
                        group_id: id,
                        socket: socket, name: name
                    })
                }
            })

            // setAllRoomsData(res.data)
            // setLoadingAllRooms(false)

        }).catch((err) => {
            actionSheetRef.current?.hide();
            console.log(err)
            showNotification("Error Try Again")

        })

    }
    function getMyGroup() {
        axios.get(`${apiBaseUrl}/groups/my`, {
            headers: {
                "Authorization": `Bearer ${Store.authToken}`
            }
        }).then((res) => {
            console.log("JOINED ROOOM", res.data)
            setRoomsData(res.data)
            setLoading(false)

        }).catch((err) => {
            console.log(err)

            setLoading(false)

        })
    }
    function renderItemFunc({ item }) {
        const imageSRC = item.name == "mobiles" ? require("../../../Images/mobile-img.png")
            : item.name == "laptops" ? require("../../../Images/laptop-img.png")
                : item.name == "smart-watches" ? require("../../../Images/smartwatch-img.png")
                    : item.name == "air-conditioners" ? require("../../../Images/ac-img.png")
                        : item.name == "home-appliances" ? require("../../../Images/appliances-img.png")
                            : null

        return (

            <Pressable style={{
                width: width / 2 - 20,
                height: "auto",
                marginLeft: "3.5%",
                marginTop: "6%",
                borderRadius: 5,
                alignItems: "center",
                paddingTop: "8%",
                paddingBottom: "8%",
                borderWidth: 1,
                borderColor: "#d4d4d4",

            }}
                onPress={() => {
                    console.log("sdasdsadsadsadsadasd", item)
                    // alert("NAME " + item.name)
                    let payload = {
                        group_id: item.uid
                    }
                    console.log(payload)
                    socket.emit("JOIN_ROOM", payload, (res) => {
                        console.log("JOIN ROOM", res)
                        //if NOKAY USER IS NOT ADDED IN ROOM
                        if (res.status == "NOK") {
                            actionSheetRef.current?.setModalVisible();
                            setGroupID(item.uid)
                            setGroupName(item.name)
                            // console.log("ID PASSED", item.uid)
                            // console.log("dsadsadasdsadsadsad", Store.authToken)



                        } else {

                            navigation.navigate("ChatRoom", { group_id: item.uid, socket: socket, name: item.name })
                        }
                    })

                }}

            >
                <Image
                    source={imageSRC}
                    style={{
                        width: 44,
                        height: 44,
                        resizeMode: "contain",
                        marginLeft: "5%",
                        marginBottom: "5%"
                    }}
                />
                <Text
                    style={{
                        fontFamily: "Inter-Bold",
                        fontSize: customSize(13),
                        color: "#303d4b",
                        marginLeft: "4%",


                    }}
                >
                    #{item.name}
                </Text>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    <Icon
                        name={"people"}
                        size={18}
                        color={"#999999"}
                    />
                    <Text style={{
                        fontFamily: "Inter-Regular",
                        fontSize: customSize(13),
                        color: "#999999",
                        marginLeft: "4%"

                    }}>
                        {item.user_count} members
                    </Text>
                </View>
            </Pressable>

        );
    }
    function renderItemJoinedFunc({ item }) {
        const imageSRC = item.name == "mobiles" ? require("../../../Images/mobile-img.png")
            : item.name == "laptops" ? require("../../../Images/laptop-img.png")
                : item.name == "smart-watches" ? require("../../../Images/smartwatch-img.png")
                    : item.name == "air-conditioners" ? require("../../../Images/ac-img.png")
                        : item.name == "home-appliances" ? require("../../../Images/appliances-img.png")
                            : null


        return (

            <Pressable style={{
                width: width,
                height: "auto",
                borderRadius: 0,
                alignItems: "center",
                paddingTop: "5%",
                paddingBottom: "5%",
                borderBottomWidth: 1,


                // borderWidth: 1,
                borderColor: "#d4d4d4",
                flexDirection: "row"

            }}
                onPress={() => {
                    console.log(item)
                    // alert("NAME " + item.name)
                    let payload = {
                        group_id: item.group_id
                    }
                    console.log(payload)
                    socket.emit("JOIN_ROOM", payload, (res) => {
                        console.log("JOIN ROOM", res)
                        //if NOKAY USER IS NOT ADDED IN ROOM
                        if (res.status == "NOK") {
                            alert("USER NOT IN THIS GROUP")
                        } else {
                            navigation.navigate("ChatRoom", { group_id: item.group_id, socket: socket, name: item.name })
                        }
                    })

                }}

            >
                <Image
                    source={imageSRC}
                    style={{
                        width: 38,
                        height: 38,
                        resizeMode: "contain",
                        marginLeft: "5%"
                    }}
                />
                <Text
                    style={{
                        fontFamily: "Inter-Bold",
                        fontSize: customSize(13),
                        color: "#303d4b",
                        marginLeft: "4%"
                    }}
                >
                    #{item.name}
                </Text>
                {/* <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <Icon
                    name={"people"}
                    size={18}
                    color={"#999999"}
                />
                <Text style={{
                    fontFamily: "Inter-Regular",
                    fontSize: customSize(13),
                    color: "#999999",
                    marginLeft: "4%"

                }}>
                    {item.user_count} members
                </Text>
            </View> */}
            </Pressable>

        );
    }

    function FlatListItemSeparator() {
        return (
            <View
                style={{
                    height: 0,
                    width: "100%",
                    backgroundColor: "#d4d4d4",
                }}
            />
        );
    }


    return (
        isLoading ?
            <View style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>


                <ActivityIndicator
                    color='#1d6ff2'
                    size={48}
                    animating={isLoading}
                />


            </View> :
            <View
                style={styles.mainContainer}

            >
                <ScrollView contentContainerStyle={{

                    paddingBottom: 25
                }}>

                    <View style={{
                        backgroundColor: "#303d4b",
                        width: width,
                        height: height / 6,
                        paddingTop: "12%",
                        paddingLeft: "5%"
                    }}>
                        <Text style={styles.headingText}>
                            Chat Rooms
                        </Text>
                        <Text
                            style={styles.textDescription}
                        >
                            Place where like minded people discuss about products they like and get more insights
                        </Text>
                    </View>

                    <View>
                        <Text style={{
                            color: "#000000",
                            fontFamily: "Inter-Bold",
                            fontSize: customSize(15),

                            padding: "4%"
                        }}>
                            Joined chat rooms
                        </Text>
                        <View
                            style={{
                                height: 1,
                                width: "100%",
                                backgroundColor: "#d4d4d4",
                            }}
                        />
                        <FlatList
                            data={roomsData}
                            numColumns={1}
                            // contentContainerStyle={{

                            //     alignContent: "space-around",
                            //     backgroundColor: "red"
                            // }}

                            renderItem={renderItemJoinedFunc}
                            keyExtractor={item => item.group_id}

                            ItemSeparatorComponent={FlatListItemSeparator}


                        />
                    </View>


                    <View >
                        <Text style={{
                            color: "#000000",
                            fontFamily: "Inter-Bold",
                            fontSize: customSize(15),

                            padding: "4%",
                            marginBottom: -20
                        }}>
                            All chat rooms
                        </Text>
                        <FlatList
                            data={allroomsData}
                            numColumns={2}
                            // contentContainerStyle={{

                            //     alignContent: "space-around",
                            //     backgroundColor: "red"
                            // }}

                            renderItem={renderItemFunc}
                            keyExtractor={item => item.uid}


                        />

                    </View>

                </ScrollView>
                <ActionSheet ref={actionSheetRef}
                    containerStyle={{
                        height: 150, width: width,
                        borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: "#303d4b",
                        justifyContent: "center", flex: 1

                    }}
                >
                    <View style={{
                        height: 150, width: width, borderTopRightRadius: 20,
                        borderTopLeftRadius: 20, backgroundColor: "#303d4b"
                    }}>
                        <Pressable onPress={() => {
                            actionSheetRef.current?.hide();
                            showNotification("Action Cancelled")

                        }}
                            style={{ alignSelf: "center", marginTop: "6%" }}
                        >
                            <Text style={{
                                color: "#ffffff",
                                fontSize: customSize(14),
                                fontFamily: "Inter-SemiBold"
                            }}>
                                Go Back
                            </Text>
                        </Pressable>
                        <Pressable style={{
                            alignSelf: "center",
                            width: width - 60,
                            marginTop: "5%",
                            height: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                            backgroundColor: "#09bc8a"
                        }}
                            onPress={() => {
                                console.log("passed group id", groupID)
                                joinGroup(groupID, groupName)

                            }}
                        >
                            <Text>
                                JOIN ROOM
                            </Text>
                        </Pressable>
                    </View>
                </ActionSheet>
            </View>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    headingText: {
        fontFamily: "Inter-SemiBold",
        fontSize: customSize(18),
        color: "#ffffff"
    },
    textDescription: {
        fontFamily: "Inter-Regular",
        fontSize: customSize(12.5),
        color: "#ffffff",
        marginTop: "2%"
    }
})