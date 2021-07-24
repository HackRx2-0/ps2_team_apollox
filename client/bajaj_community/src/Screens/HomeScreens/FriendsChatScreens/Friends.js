import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { width, height, customSize } from '../../../Utils/Utils';
import Store from '../../../Store/Store';
import axios from 'axios';
import { apiBaseUrl } from "../../../Config/Config";

export default function FriendsScreen({ navigation }) {
    const [userList, setUserList] = useState();

    useEffect(() => {
        axios.get(apiBaseUrl + '/user/friends', {
            headers: { authorization: 'Bearer ' + Store.authToken }
        }).then((res) => {
            // setUserList(res.data)
            console.log("DATA", res.data)
            var arrayData = []
            for (let i = 0; i < res.data[0].friend_ids_list.length; i++) {

                arrayData.push({
                    uid: res.data[0].friend_ids_list[i],
                    name: res.data[0].friend_name_list[i],
                })
            }
            console.log(arrayData)
            setUserList(arrayData)
        }).catch((err) => { console.log(err) })
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View style={{
                backgroundColor: "#303d4b",
                width: width,
                height: height / 6,
                paddingTop: "12%",
                paddingLeft: "5%"
            }}>
                <Text style={styles.headingText}>
                    Friends
                </Text>
                <Text
                    style={styles.textDescription}
                >
                    Place where like minded people discuss about products they like and get more insights
                </Text>
            </View>
            <FlatList
                data={userList}
                renderItem={({ item }) => (<View style={{
                    height: 71, backgroundColor: "#ffffff", borderStyle: "solid",
                    borderWidth: 1, borderColor: "#eeeeee", justifyContent: 'center'
                }}><Pressable style={{ flexDirection: 'row' }}

                    onPress={() => {
                        navigation.navigate("PvtChat", { user: item, socket: Store.socket })
                    }}
                >
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
                    </Pressable>
                </View>)}
                keyExtractor={(item) => item.uid}>
            </FlatList>
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