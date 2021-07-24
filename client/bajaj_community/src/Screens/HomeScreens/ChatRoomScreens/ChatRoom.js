import React, { useEffect, useState, useCallback } from 'react';
import { Button, Alert, FlatList, Text, View, TouchableOpacity, Image, LogBox, Pressable, ActivityIndicator, Modal, Linking } from 'react-native';
import io from "socket.io-client";
import Store from '../../../Store/Store';
import uuid from "react-native-uuid"
import Icon from "react-native-vector-icons/Entypo"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"


import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import ImageView from "react-native-image-viewing";
import { GiftedChat, Actions, ActionsProps, Send, MessageImage, Composer, InputToolbar, Bubble, BubbleProps } from 'react-native-gifted-chat'
import axios from 'axios';
import { apiBaseUrl } from '../../../Config/Config';
import { customSize, height, showNotification, width } from '../../../Utils/Utils';
import { Observer } from 'mobx-react';

export default function ChatScreen({ route, navigation }) {
    const { group_id, socket, name } = route.params;


    const TOKEN = Store.authToken
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5aVYzWldFUSIsIm5hbWUiOiJOYW1lIER1bW15IiwiZW1haWxfaWQiOiJhQGdtYWlsLmNvbSIsInBob25lX25vIjoiKzkxODEwMjY0NDM2NiIsInJvbGUiOiJ1c2VyIiwiaXNzIjoiQ3VyZS1NYWpvclByb2plY3QiLCJpYXQiOjE2MjY5NTc3NzUsImV4cCI6MTYyNzA0NDE3NX0.MlsIMMgsIE9l3wcDVF77z6KD4hZC30kraOuHeIpiDZY"
    console.log("WEB TOKEN", TOKEN)

    // const [socket, setSocket] = useState(null)

    const [messages, setMessages] = useState([]);
    const [unqid, setunqid] = useState(null)

    const [filePath, setFilePath] = useState(null);
    const [msgLoading, setMsgLoading] = useState(true)

    const [recommendedProductsArray, setRecommendedProductsArray] = useState([]);

    useEffect(() => {
        LogBox.ignoreLogs([
            'Non-serializable values were found in the navigation state',
        ]);
        LogBox.ignoreLogs([
            "Animated.event now requires a second argument for options"
        ])
        LogBox.ignoreLogs(['Warning: ...']);
        LogBox.ignoreLogs(["Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`"])
        // console.log("USEFECECT 2")
        // console.log(Store.user_uid)
        // console.log(Store.user_name)
        getOldChats(group_id)
        axios.get(`${apiBaseUrl}/recommendation/products/latest/${group_id}`, {
            headers: {
                "Authorization": `Bearer ${Store.authToken}`
            }
        },
        ).then((res) => {
            // console.log("FROM SERVER", res.data)
            setRecommendedProductsArray(res.data)


        }).catch((err) => {
            console.log(err)
        })

        if (socket != null) {
            console.log("INSIDE SOCKET")
            socket.on("connect", (res) => {
                console.log("CONNECTED", socket.id)
            })
            socket.on("RECOMMEND_PRODUCT", (res) => {

                if (res) {
                    axios.get(`${apiBaseUrl}/recommendation/products/latest/${group_id}`, {
                        headers: {
                            "Authorization": `Bearer ${Store.authToken}`
                        }
                    },
                    ).then((res) => {
                        // console.log("FROM SERVER", res)

                        setRecommendedProductsArray(res.data)
                    }).catch((err) => {
                        console.log(err)
                    })
                }
                // setRecommendedProductsArray((prev) => [res, ...prev])
                // console.log("RECOMMENDED PRODUCT", res)
            })
            socket.on("GRP_MSG", (msg) => {

                console.log("RES", msg)


                if (Store.user_uid != msg.message.user._id) {
                    console.log("HERERERERERE")
                    const newMessage = {
                        _id: msg.message._id,
                        text: msg.message.text,
                        createdAt: msg.message.createdAt,
                        image: msg.message.image,
                        user: {
                            _id: msg.message.user._id,
                            name: msg.message.user.name,
                            avatar: msg.message.user.name == "Recommended Product" ?
                                msg.message.user.avatar
                                : 'https://placeimg.com/140/140/any',
                        },
                    }


                    setMessages(previousState => GiftedChat.append(previousState, newMessage));
                }


            })
        }
    }, [socket])
    function getOldChats(id) {
        axios.get(`${apiBaseUrl}/chats/${id}`, {
            headers: {
                "Authorization": `Bearer ${Store.authToken}`
            }
        }).then((res) => {
            // console.log("all rooms", res.data)
            // setMessages(previousState => GiftedChat.append(previousState, res.data));
            var mes = [];
            for (let i = res.data.length - 1; i >= 0; i--) {
                // console.log(res.data[i])
                const newMessage = {
                    _id: res.data[i].message._id,
                    text: res.data[i].message.text,
                    createdAt: res.data[i].message.createdAt,
                    image: res.data[i].message.image,
                    user: {
                        _id: res.data[i].message.user._id,
                        name: res.data[i].message.user.name,
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                }
                mes.push(newMessage)
            }
            setMessages(mes)
            setMsgLoading(false)

        }).catch((err) => {
            console.log(err)


        })
    }
    function CustomHeader() {
        return (
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
                    <Text
                        style={{ fontSize: customSize(16), color: "#ffffff", fontFamily: "Inter-SemiBold" }}
                    >
                        #{name}
                    </Text>
                    <View style={{
                        width: 38,
                        height: 38,
                        justifyContent: "center",
                        borderRadius: 10,
                        backgroundColor: "#404c59",
                    }}>
                        <MaterialCommunityIcons
                            name={"information-outline"}
                            size={25}
                            color={"#ffffff"}
                            style={{ alignSelf: "center" }}
                            onPress={() => {

                                navigation.navigate("ChatRoomInfo", { name, group_id })
                            }}
                        />
                    </View>
                </View>
            </View>
        )
    }

    function fireMessage() {
        console.log("FIRED", socket)
        let Mesuuid = uuid.v4();
        var newMessage = {
            _id: Mesuuid,
            text: "DEMO MESSAGE",
            createdAt: new Date(),
            image: "",
            user: {
                _id: "gi37ny7t",
                name: "EMULATOR",
                avatar: 'https://placeimg.com/140/140/any',
            },
        }
        socket.emit("GRP_MSG", {
            group_id: group_id,
            message: newMessage
        }, (res) => {
            console.log(res)
        })
    }

    const customtInputToolbar = props => {
        return (
            <InputToolbar
                {...props}

                containerStyle={{
                    backgroundColor: "#eeeeee",




                }}
            />
        );
    };

    function renderSend(props) {
        return (
            <TouchableOpacity
                style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#0bbc8a",
                    borderRadius: 48 / 2,
                    justifyContent: "center",
                    marginBottom: 10,
                    marginRight: 10
                }}
                onPress={() => {
                    _onSend(props)
                }}
            >
                <Image source={require('../../../Images/send-icon.png')}
                    style={{
                        width: 24,
                        height: 24, resizeMode: "contain",
                        alignSelf: "center"
                    }}
                />
            </TouchableOpacity>
        );

    }
    function renderMessageImage(props) {

        return (
            <MessageImage
                imageStyle={{ borderRadius: 5 }}

                lightboxProps={{ springConfig: { tension: 0, friction: 0 } }}
                {...props}

            />

        )
    }

    function renderComposer(props) {

        return (

            <Composer
                {...props}

                composerHeight={50}

                textInputStyle={{
                    color: '#222B45',
                    backgroundColor: "#ffffff",
                    borderRadius: 24,
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    borderColor: '#E4E9F2',
                    marginTop: 10,
                    marginBottom: 10,
                    marginRight: 10,
                    marginLeft: 0,
                }}
            />

        )
    }
    function BubbleChat(props) {
        return (
            <Bubble
                {...props}
                textStyle={{
                    right: {
                        color: "#ffffff"
                    },
                    left: {
                        color: "#000000",
                    },
                }}
                wrapperStyle={{

                    right: {
                        backgroundColor: props?.currentMessage?.image ? "transparent" : "#0bbc8a",
                    },
                    left: {
                        backgroundColor: props?.currentMessage?.image ? "#ffffff" : "#ffffff"
                    },
                }}

            />

        )
    }
    function renderActions(props) {
        return (
            <>

                <Actions
                    {...props}
                    containerStyle={{
                        width: 44,
                        height: 44,


                        marginBottom: 5,
                    }}
                    icon={() => (
                        <Icon
                            name={"image"}
                            size={28}
                        />
                    )}
                    onPressActionButton={() => {
                        handlePickImage()
                    }}
                    optionTintColor="#222B45"
                />
            </>
        )
    }

    function handlePickImage() {


        let options = {
            title: 'Select Image',
            customButtons: [
                {
                    name: 'customOptionKey',
                    title: 'Choose Photo from Custom Option'
                },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log(
                    'User tapped custom button: ',
                    response.customButton
                );
                alert(response.customButton);
            } else {
                let source = response;
                console.log(source.assets[0])
                var photo = {
                    uri: source.assets[0].uri,
                    type: source.assets[0].type,
                    name: source.assets[0].fileName,
                };

                var form = new FormData();
                form.append("image", photo);
                form.append("group_id", group_id)
                axios({
                    url: `${apiBaseUrl}/chat/image`,
                    method: 'POST',
                    data: form,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${TOKEN}`
                    }
                })
                    .then(function (response) {
                        console.log("response :", response.data);
                        setFilePath(source);
                        onSend([], { image: `https://api.apollox.atifhossain.me/${response.data.imageUrl}` })
                    })
                    .catch(function (error) {
                        console.log("error from image :", error);
                    })


            }
        });

    }







    function _onSend(props) {
        props.onSend({ text: props.text.trim() }, true)
    }
    const onSend = useCallback((messages = [], imageVal) => {

        console.log(JSON.stringify(imageVal.image))
        if (imageVal.image) {

            let Mesuuid = uuid.v4();

            var newMessage = {
                _id: Mesuuid,
                text: "",
                createdAt: new Date(),
                image: imageVal.image,
                user: {
                    _id: Store.user_uid,
                    name: Store.user_name,
                    avatar: 'https://placeimg.com/140/140/any',
                },
            }


        }
        else {
            console.log("ENETRED WITH MESSAGE")

            // let uniqueId = DeviceInfo.getUniqueId();
            console.log("SENT ONE", messages[0])
            if (!messages[0].text == "") {

                let Mesuuid = uuid.v4();

                var newMessage = {
                    _id: Mesuuid,
                    text: messages[0].text,
                    createdAt: messages[0].createdAt,
                    image: "",
                    user: {
                        _id: Store.user_uid,
                        name: Store.user_name,
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                }

                console.log("MESSAGE IS", newMessage)

                socket.emit("GRP_MSG", {
                    group_id: group_id,
                    message: newMessage
                }, (res) => {
                    console.log(res)
                })
                setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage))
                // console.log("ON SEND FUNC", unqid)
                setFilePath("")

            }
            else showNotification("Can't send empty message")




        }



    }, [])
    function addToFavourites(product_id) {
        console.log("PRODUCT ID", product_id)
        axios.post(`${apiBaseUrl}/recommendation/product/favorite`, {
            product_id: product_id
        }, {
            headers: {
                "Authorization": `Bearer ${Store.authToken}`
            }
        },
        ).then((res) => {
            console.log("FROM SERVER LIKES", res.data)
            showNotification("Product added to favorites")
            // setRecommendedProductsArray(res.data)


        }).catch((err) => {
            showNotification("Product has already been added")
            console.log(err)
        })
    }
    function renderItemProducts({ item, index }) {
        return (
            <View style={{
                height: height / 7, width: width - 55,
                backgroundColor: "#ffffff",
                justifyContent: "center",
                marginLeft: 25,
                marginRight: 30,
                opacity: 1, alignSelf: "center",
                marginBottom: 18,
                borderRadius: 10,
            }}>
                <View style={{ flexDirection: "row", flex: 1 }}>
                    <Image
                        source={{ uri: item.prodimageurl }}
                        style={{
                            height: height / 10, width: width / 4,
                            resizeMode: "contain",
                            marginLeft: 10, marginTop: 10
                        }}
                    />

                    <View style={{ flex: 1, paddingLeft: 10, paddingTop: 5 }}>
                        <Text style={{
                            alignSelf: "flex-end", marginTop: -4, marginRight: 12
                        }}>
                            {`${index + 1}/${recommendedProductsArray.length}`}
                        </Text>
                        <Text style={{
                            fontFamily: "Inter-SemiBold",
                            marginTop: 5,

                            paddingRight: 5

                        }}
                            numberOfLines={2}
                        >
                            {item.prodname}
                        </Text>
                        <View style={{
                            flexDirection: "row", justifyContent: "space-between",
                            marginRight: 20, marginTop: 5
                        }}>
                            <Text style={{
                                fontFamily: "Inter-Bold",
                                fontSize: customSize(14),
                                marginTop: "4%",

                            }}>
                                ₹{item.prodprice}
                            </Text>
                            <Pressable style={{ marginTop: "4%" }}>
                                <FontAwesome
                                    name={"star"}
                                    size={20}
                                    onPress={() => {

                                        addToFavourites(item._id)

                                    }}
                                />
                            </Pressable>
                            <Pressable
                                style={{
                                    width: 80,
                                    height: "70%",
                                    borderRadius: 5,
                                    marginTop: 1.5,
                                    backgroundColor: "#0bbc8a",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onPress={() => {
                                    navigation.navigate("Web", { link: item.produrl })
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Inter-Bold",
                                        fontSize: customSize(12),

                                        color: "#ffffff"

                                    }}
                                >
                                    BUY NOW
                                </Text>
                            </Pressable>

                        </View>

                    </View>


                </View>

            </View>
        )
    }
    function RecommendationCard(props) {
        console.log("RECOMMENDED ARRAY STATE", recommendedProductsArray)


        return (
            <View style={{
                height: height / 4.8, width: width,
                backgroundColor: "#d6f1e9",
                opacity: 1, zIndex: 1000
            }}>
                <View style={{
                    flexDirection: "row", flex: 1, justifyContent: "space-between",
                    marginLeft: "5%", marginRight: "8%",
                    marginTop: "2.8%",

                }}>
                    <Text
                        style={{
                            color: "#555555",
                            fontFamily: "Inter-Regular",
                            fontSize: customSize(12),

                        }}
                    >
                        Product recommendations for you
                    </Text>
                    <Text
                        style={{
                            color: "#555555",
                            fontFamily: "Inter-Bold",
                            fontSize: customSize(12)
                        }}
                        onPress={() => {
                            console.log("PRESSED")
                            Store.setRecommendationCard(false)
                        }}
                    >
                        HIDE
                    </Text>
                </View>
                <View>
                    <FlatList
                        data={recommendedProductsArray}
                        pagingEnabled={true}
                        // inverted={true}

                        horizontal={true}
                        renderItem={renderItemProducts}
                        keyExtractor={item => item._id}
                    // showsHorizontalScrollIndicator={false}




                    />

                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <CustomHeader />
            <Observer>{
                () => (
                    recommendedProductsArray.length > 0 ?
                        Store.recommendation_Card ? <RecommendationCard /> :
                            <View style={{
                                height: 50, width: width,
                                backgroundColor: "#d6f1e9",
                                opacity: 1, zIndex: 1000
                            }}>
                                <View style={{
                                    flexDirection: "row", flex: 1, justifyContent: "space-between",
                                    marginLeft: "5%", marginRight: "8%",
                                    marginTop: "2.8%",

                                }}>
                                    <Text
                                        style={{
                                            color: "#555555",
                                            fontFamily: "Inter-Regular",
                                            fontSize: customSize(12),

                                        }}
                                    >
                                        Product recommendations for you
                                    </Text>
                                    <Text
                                        style={{
                                            color: "#555555",
                                            fontFamily: "Inter-Bold",
                                            fontSize: customSize(12)
                                        }}
                                        onPress={() => {
                                            console.log("PRESSED")
                                            Store.setRecommendationCard(true)
                                        }}
                                    >
                                        SHOW
                                    </Text>
                                </View>


                            </View> : null
                )
            }</Observer>
            {msgLoading ?
                <View style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>


                    <ActivityIndicator
                        color='#1d6ff2'
                        size={48}
                        animating={msgLoading}
                    />


                </View> :
                <View style={{ flex: 1 }}>
                    <GiftedChat
                        messages={messages}

                        onSend={messages => onSend(messages, { image: filePath })}
                        // onSend={messages => onSend(messages, { image: filePath })}

                        user={{
                            _id: Store.user_uid,
                            name: Store.user_name,
                            avatar: 'https://placeimg.com/140/140',
                        }}
                        renderUsernameOnMessage={true}
                        showAvatarForEveryMessage
                        renderComposer={renderComposer}
                        renderActions={renderActions}
                        messagesContainerStyle={{
                            paddingBottom: filePath ? 100 : "5%"

                        }}
                        onPressAvatar={(user) => {
                            Alert.alert(
                                "",
                                `Do you want to chat with ${user.name}`,
                                [
                                    {
                                        text: "Cancel",
                                        onPress: () => showNotification("Action Cancelled"),
                                        style: "cancel"
                                    },
                                    {
                                        text: "OK", onPress: () => {


                                            navigation.navigate("FriendChatRoom", { user: user, socket: socket })
                                        }
                                    }
                                ]
                            );

                        }}
                        // renderSend={renderSend}
                        renderBubble={BubbleChat}
                        alwaysShowSend
                        renderAvatarOnTop

                        renderMessageImage={
                            renderMessageImage
                        }
                        renderInputToolbar={customtInputToolbar}
                        renderSend={renderSend}
                        parsePatterns={(item) => [
                            {
                                type: "url",
                                style: {
                                    textDecorationLine: "underline",
                                    color:
                                        item && item[0].color === "black"
                                            ? "#18a0fb"
                                            : "white"
                                },
                                onPress: async (res) => {
                                    console.log("rES", res)
                                    navigation.navigate("Web", { link: res })
                                }
                            }

                        ]}
                    />
                </View>}

        </View>
    );
}