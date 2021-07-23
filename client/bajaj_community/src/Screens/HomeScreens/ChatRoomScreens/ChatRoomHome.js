import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { customSize, height, width } from '../../../Utils/Utils';
import axios from 'axios';
import { apiBaseUrl } from '../../../Config/Config';
import Store from '../../../Store/Store';
import io from "socket.io-client";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ChatRoomHome({ navigation }) {
    const [roomsData, setRoomsData] = useState("");
    const [isLoading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null)



    useEffect(() => {
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
        axios.get(`${apiBaseUrl}/groups/my`, {
            headers: {
                "Authorization": `Bearer ${Store.authToken}`
            }
        }).then((res) => {
            console.log(res.data)
            setRoomsData(res.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)

        })

    }, [])
    const renderItemFunc = ({ item }) => (

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
                console.log(item.name)
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
                        navigation.navigate("ChatRoom", { group_id: item.group_id, socket: socket })
                    }
                })

            }}

        >
            <Text
                style={{
                    fontFamily: "Inter-Bold",
                    fontSize: customSize(13),
                    color: "#295dc0",
                    marginLeft: "4%"

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


    return (

        <View style={styles.mainContainer}>
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
            {
                isLoading ?
                    <View style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>


                        <ActivityIndicator
                            color='#1d6ff2'
                            size={48}
                            animating={isLoading}
                        />


                    </View> :
                    <FlatList
                        data={roomsData}
                        numColumns={2}
                        // contentContainerStyle={{

                        //     alignContent: "space-around",
                        //     backgroundColor: "red"
                        // }}

                        renderItem={renderItemFunc}
                        keyExtractor={item => item.Uid}


                    />}

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