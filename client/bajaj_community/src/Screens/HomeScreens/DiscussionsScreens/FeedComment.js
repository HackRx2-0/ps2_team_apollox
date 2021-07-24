import React, { useEffect, useState, useCallback } from 'react';
import { Text, TouchableOpacity, View, Image, FlatList, TextInput } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { customSize, height, showNotification, width } from '../../../Utils/Utils';
import axios from 'axios';
import Store from '../../../Store/Store';
import { apiBaseUrl } from "../../../Config/Config";
import { leaveGroup } from '../../../Functions/ApiFunction';
import { flowResult } from 'mobx';

export default function FeedComment({ navigation }) {
    const [comments, setComments] = useState([{ "_id": "1", "name": "raghav", "date": "date" }, { "_id": "11", "name": "raghav1", "date": "date1" }])
    return (
        <View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
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

                </View>
            </View>
            <Text style={{
                marginLeft: 10,
                marginTop: 20,
                marginBottom: 10,
                fontFamily: "Inter",
                fontSize: 20,
                fontWeight: "normal",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#000000"
            }}>Comments</Text>
            <FlatList
                data={comments}
                renderItem={({ item }) => (
                    <View style={{
                        width: width * .95, alignSelf: 'center', borderRadius: 10,
                        backgroundColor: "#ffffff", borderStyle: "solid", marginTop: 10,
                        borderWidth: 1, borderColor: "#eeeeee", justifyContent: 'center'
                    }}>
                        <Text style={{
                            marginLeft: 10, marginTop: 10,
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "300",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "left",
                            color: "#555555"
                        }}>~userName</Text>
                        <Text style={{
                            marginLeft: 10,
                            marginTop: 10,
                            marginBottom: 10,
                            fontFamily: "WorkSans",
                            fontSize: 15,
                            fontWeight: '500',
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "left",
                            color: "#000000"
                        }}>Comment</Text>



                    </View>
                )}
                keyExtractor={(item) => item._id} />
            <View style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 10, }}>
                <TextInput style={{
                    height: height * .08,
                    borderRadius: 24,
                    borderStyle: "solid",
                    width: width * .8,
                    marginTop: 20,
                    backgroundColor: "#ffffff",
                    paddingLeft: 10,
                    borderWidth: 1,
                    alignSelf: 'center',
                    borderColor: "#d4d4d4"
                }}
                    multiline={true}
                    placeholder={'Post heading'}
                    placeholderTextColor={'#999999'} />
                <TouchableOpacity style={{

                    height: 56, backgroundColor: "#0bbc8a", alignSelf: 'flex-end', marginLeft: 10,
                    width: 56, borderRadius: 56 / 2, justifyContent: 'center'
                }}>
                    <Image source={require('../../../Images/send.png')}
                        style={{
                            tintColor: 'white', marginLeft: 5,
                            resizeMode: 'contain', alignSelf: 'center',
                            width: 25,
                            height: 25,
                        }} />
                </TouchableOpacity>
            </View>

        </View >
    );
}