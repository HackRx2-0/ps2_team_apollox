import React, { useEffect, useState, useCallback } from 'react';
import { Text, TouchableOpacity, View, Image, FlatList } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { customSize, height, showNotification, width } from '../../../Utils/Utils';
import axios from 'axios';
import Store from '../../../Store/Store';
import { apiBaseUrl } from "../../../Config/Config";
import { leaveGroup } from '../../../Functions/ApiFunction';

export default function ChatRoomInfo({ route, navigation }) {

    const [userList, setUserList] = useState();
    const { name, group_id } = route.params;
    const imageSRC = name == "mobiles" ? require("../../../Images/mobile-img.png")
        : name == "laptops" ? require("../../../Images/laptop-img.png")
            : name == "smart-watches" ? require("../../../Images/smartwatch-img.png")
                : name == "air-conditioners" ? require("../../../Images/ac-img.png")
                    : name == "home-appliances" ? require("../../../Images/appliances-img.png")
                        : null


    useEffect(async () => {
        await axios.get(apiBaseUrl + '/group/users/all/' + group_id, {
            headers: { authorization: 'Bearer ' + Store.authToken }
        }).then((res) => {
            setUserList(res.data)
            console.log("chat usersss", res.data)
        }).catch((err) => { console.log(err) })
    }, [])

    async function leave() {
        const exitGroup = await leaveGroup(group_id)
        if (exitGroup) {
            navigation.pop()
            navigation.pop()
        }
        else {
            showNotification("Something went wrong")
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ width: width, height: height / 14, backgroundColor: "#303d4b" }}>
                <View style={{
                    flexDirection: "row", flex: 1, justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: "4%",
                    marginRight: "4%",


                }}>
                    <View style={{
                        width: 38,
                        height: 38,
                        justifyContent: "center",
                        borderRadius: 10,
                        backgroundColor: "#404c59",
                    }}>
                        <Ionicons
                            name={"arrow-back"}
                            size={25}
                            color={"#ffffff"}
                            style={{ alignSelf: "center" }}
                            onPress={() => {
                                navigation.goBack()
                            }}
                        />
                    </View>

                    <TouchableOpacity style={{
                        width: 61,
                        height: 38, justifyContent: "center", borderRadius: 10,
                        backgroundColor: "#404c59",
                    }}
                        onPress={() => { leave() }}>
                        <Text style={{
                            color: "#ffffff", alignSelf: 'center', fontFamily: "WorkSans",
                            fontSize: 16, fontWeight: "normal", fontStyle: "normal",
                        }}>Leave</Text>
                    </TouchableOpacity>

                </View>
            </View>
            <View style={{ width: width, height: height * .25, backgroundColor: "#303d4b" }}>
                <Image source={imageSRC} style={{
                    width: 61,
                    height: 61,
                    resizeMode: "contain", alignSelf: 'center'
                }} />
                <Text
                    style={{ fontSize: customSize(16), alignSelf: 'center', color: "#ffffff", fontFamily: "Inter-SemiBold" }}
                >
                    #{name}
                </Text>
                <Text style={{
                    width: 343, height: 52, fontFamily: "Inter", fontSize: 14, fontWeight: "normal", marginTop: 10,
                    fontStyle: "normal", letterSpacing: 0, textAlign: "center", color: "#b6b6b6", alignSelf: 'center'
                }}>This chat-room is all about latest {name} devices, you can your views and share product information with fellow community members.</Text>
            </View><View style={{ height: height * .07, backgroundColor: "#f9f9f9", justifyContent: 'center' }}>
                <Text style={{
                    width: 110, height: 30, fontFamily: "Inter", fontSize: 16, fontWeight: "bold", fontStyle: "normal",
                    letterSpacing: 0, textAlign: "left", color: "#000000", alignSelf: 'flex-start', marginLeft: 10
                }}>All members</Text></View>
            <FlatList
                data={userList}
                renderItem={({ item }) => (<View style={{
                    height: 71, backgroundColor: "#ffffff", borderStyle: "solid",
                    borderWidth: 1, borderColor: "#eeeeee", justifyContent: 'center'
                }}><View style={{ flexDirection: 'row' }}>
                        <Image source={{ uri: 'https://placeimg.com/140/140/any' }} style={{
                            width: 40, marginLeft: 20,
                            height: 40, borderRadius: 40 / 2,
                            resizeMode: "contain",
                        }} />
                        <Text style={{
                            textAlignVertical: 'center', marginLeft: 10,
                            fontFamily: "Inter",
                            fontSize: 15,
                            fontWeight: "normal",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "left",
                            color: "#303d4b"
                        }}>{item.name}</Text>
                    </View>
                </View>)}
                keyExtractor={(item) => item.uid}>
            </FlatList>
        </View>
    );
}