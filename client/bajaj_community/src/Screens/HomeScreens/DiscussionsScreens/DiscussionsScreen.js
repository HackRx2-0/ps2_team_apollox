import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import { required } from 'yargs';
import { height, showNotification, width } from '../../../Utils/Utils'
import { getPosts } from '../../../Functions/ApiFunction';
import { upVotePost } from '../../../Functions/ApiFunction';

export default function DiscussionsForum({ navigation }) {

    const [posts, setPosts] = useState();
    const [rend, setrend] = useState();

    useEffect(async () => {
        gettPost()
    }, [])
    async function gettPost() {
        const posts = await getPosts()
        console.log("cons post", posts)
        if (posts) {
            setPosts(posts)
        }
        else {
            showNotification("Something Went Wrong")
        }
    }
    async function upvote(id, type) {
        const ret = await upVotePost(id, type)
        if (ret) {

            gettPost()
        }
    }
    return (<View style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
        <View style={{ justifyContent: 'center', width: width, height: height * .2, backgroundColor: "#303d4b", padding: 10 }}>

            <Text style={{
                marginBottom: 10,
                alignSelf: 'flex-start',
                fontFamily: "Inter",
                fontSize: 22,
                fontWeight: "600",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#ffffff"
            }}>Discussions</Text>
            <Text style={{
                width: 343,
                height: 30,
                fontFamily: "Inter",
                fontSize: 12,
                fontWeight: "normal",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#b6b6b6"
            }}>Place where like minded people discuss about products they like and get more insights</Text>

        </View >
        {console.log("postsss", posts)}
        <FlatList
            data={posts}
            renderItem={({ item }) => (
                <View style={{
                    backgroundColor: "#ffffff", borderStyle: "solid", marginTop: 10,
                    borderWidth: 1, borderColor: "#eeeeee", justifyContent: 'center'
                }}><Text style={{
                    marginLeft: 10,
                    marginTop: 10,
                    fontFamily: "WorkSans",
                    fontSize: 15,
                    fontWeight: '500',
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#000000"
                }}>{item.title}</Text>{item.imageUrl ? <View style={{ backgroundColor: "#ffffff" }}>
                    <Image source={require("../../../Images/Background.jpg")}
                        style={{
                            alignSelf: 'center', marginTop: 10,
                            height: width - 180, width: width - 20, resizeMode: 'cover'
                        }} /></View> : null}
                    <Text style={{
                        marginLeft: 10, marginTop: 10, marginBottom: 5,
                        fontFamily: "Inter",
                        fontSize: 12,
                        fontWeight: "300",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: "#555555"
                    }}>{item.body}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={{ uri: 'https://placeimg.com/140/140/any' }} style={{
                            width: 30, marginLeft: 20, marginTop: 10,
                            height: 30, borderRadius: 30 / 2,
                            resizeMode: "contain", marginBottom: 10
                        }} />
                        <Text style={{
                            textAlignVertical: 'center',
                            marginLeft: 10,
                            fontFamily: "Inter",
                            fontSize: 12,
                            fontWeight: "normal",
                            fontStyle: "normal",
                            letterSpacing: 0,
                            textAlign: "left",
                            color: "#999999",
                        }}>{item.user_id}</Text>

                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', marginLeft: width * .23 }}
                            onPress={() => {
                                upvote(item._id, 'up')
                            }}>
                            <Image source={require("../../../Images/up.png")} style={{
                                width: 30, marginLeft: 60, marginTop: 10,
                                height: 30,
                                resizeMode: "contain",
                            }} /><Text style={{
                                textAlignVertical: 'center', marginLeft: 3,
                                fontFamily: "Inter",
                                fontSize: 15,
                                fontWeight: "normal",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                textAlign: "left",
                                color: "#555555"
                            }}> {item.upvotes.length}</Text>
                        </TouchableOpacity >
                        {/* <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Image source={require("../../../Images/down.png")} style={{
                                width: 30, marginLeft: 20, marginTop: 10,
                                height: 30,
                                resizeMode: "contain",
                            }} /><Text style={{
                                textAlignVertical: 'center', marginLeft: 3,
                                fontFamily: "Inter",
                                fontSize: 15,
                                fontWeight: "normal",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                textAlign: "left",
                                color: "#555555"
                            }}>{item.downvotes.length}</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }}
                            onPress={() => { navigation.navigate('FeedComment', { item }) }} >
                            <Image source={require("../../../Images/mesCircle.png")} style={{
                                width: 22, marginLeft: 20, marginTop: 13,
                                height: 22,
                                resizeMode: "contain",
                            }} /><Text style={{
                                textAlignVertical: 'center', marginLeft: 3,
                                fontFamily: "Inter",
                                fontSize: 15,
                                fontWeight: "normal",
                                fontStyle: "normal",
                                letterSpacing: 0,
                                textAlign: "left",
                                color: "#555555"
                            }}>{item.comments.length}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            )}
            keyExtractor={(item) => item._id} />
        <TouchableOpacity style={{
            position: 'absolute',
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            right: 30,
            bottom: 30,
            borderRadius: 56 / 2,
            backgroundColor: "#0bbc8a"
        }}
            onPress={() => {
                navigation.navigate('AddFeed')
            }}
        ><Image source={require('../../../Images/add.png')}
            style={{
                tintColor: 'white',
                resizeMode: 'contain',
                width: 50,
                height: 50,
            }} /></TouchableOpacity>

    </View >
    );
}