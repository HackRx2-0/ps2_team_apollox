import React, { useEffect, useState, useCallback } from 'react';
import { Button, Text, View, TouchableOpacity, Image } from 'react-native';
import io from "socket.io-client";
import Store from '../../../Store/Store';
import uuid from "react-native-uuid"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import Icon from "react-native-vector-icons/Entypo"
import Ionicons from "react-native-vector-icons/Ionicons"
import Feather from "react-native-vector-icons/Feather"

import { GiftedChat, Actions, ActionsProps, Send, Composer, InputToolbar, Bubble, BubbleProps } from 'react-native-gifted-chat'
import axios from 'axios';
import { apiBaseUrl } from '../../../Config/Config';
import { customSize, height, width } from '../../../Utils/Utils';

export default function FriendChatScreen({ route, navigation }) {
    const { user, socket } = route.params;
    console.log(user)

    const TOKEN = Store.authToken
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI5aVYzWldFUSIsIm5hbWUiOiJOYW1lIER1bW15IiwiZW1haWxfaWQiOiJhQGdtYWlsLmNvbSIsInBob25lX25vIjoiKzkxODEwMjY0NDM2NiIsInJvbGUiOiJ1c2VyIiwiaXNzIjoiQ3VyZS1NYWpvclByb2plY3QiLCJpYXQiOjE2MjY5NTc3NzUsImV4cCI6MTYyNzA0NDE3NX0.MlsIMMgsIE9l3wcDVF77z6KD4hZC30kraOuHeIpiDZY"
    console.log("WEB TOKEN", TOKEN)

    // const [socket, setSocket] = useState(null)

    const [messages, setMessages] = useState([]);
    const [unqid, setunqid] = useState(null)

    const [filePath, setFilePath] = useState(null);

    useEffect(() => {

        console.log("USEFECECT 2")
        console.log(Store.user_uid)
        console.log(Store.user_name)
        if (socket != null) {
            socket.on("connect", (res) => {
                console.log("CONNECTED", socket.id)
            })
            socket.on("PVT_MSG", (msg) => {

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
                            avatar: 'https://placeimg.com/140/140/any',
                        },
                    }


                    setMessages(previousState => GiftedChat.append(previousState, newMessage));
                }


            })
        }
    }, [socket])

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
                        {user.name}
                    </Text>
                    <View style={{
                        width: 38,
                        height: 38,
                        justifyContent: "center",
                        borderRadius: 10,
                        backgroundColor: "#404c59",
                    }}>
                        <Feather
                            name={"more-vertical"}
                            size={24}
                            color={"#ffffff"}
                            style={{ alignSelf: "center" }}
                            onPress={() => {

                                // navigation.navigate("ChatRoomInfo", { name, group_id })
                                console.log("I pressed")
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
            <Pressable
                onPress={() => {
                    setModalVisible(true)
                }}
            >
                <Image
                    source={{ uri: props.currentMessage?.image }}
                    style={{ height: 150, width: 200, resizeMode: "contain" }}

                />
                <Modal
                    visible={modalVisible}
                    transparent={false}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <Image
                        source={{ uri: props.currentMessage?.image }}
                        style={{ height: "50%", width: "100%" }}
                    />
                </Modal>
            </Pressable>
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
                        backgroundColor: props?.currentMessage?.image ? "transparent" : "#ffffff"
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
                    })
                    .catch(function (error) {
                        console.log("error from image :", error);
                    })
                // console.log(apiBaseUrl + '/chat/image')
                // console.log("group_id", group_id)
                // console.log(form)
                // fetch(
                //     apiBaseUrl + '/chat/image',
                //     {
                //         body: form,
                //         method: "POST",
                //         headers: {
                //             'Content-Type': 'multipart/form-data',
                //             'Authorization': 'Bearer ' + TOKEN
                //         }
                //     }
                // ).then((response) => response.json())
                //     .catch((error) => {
                //         alert("ERROR " + error)
                //     })
                //     .then((responseData) => {
                //         console.log("Success" + JSON.stringify(responseData))
                //         // this.props.navigation.pop();
                //         // ToastAndroid.show("Feed Posted Successfully", ToastAndroid.LONG)
                //     }).done();

                // var photo = {
                //     uri: this.state.uri,
                //     type: this.state.filetype,
                //     name: this.state.filename,
                // };
                // axios.post()
                // setFilePath(source);
                // onSend([], { image: source })
            }
        });

    }







    function _onSend(props) {
        props.onSend({ text: props.text.trim() }, true)
    }
    const onSend = useCallback((messages = [], imagE) => {

        console.log("ENETRED WITH IMAGE")
        if (imagE.image) {
            let imagelink = imagE.image.assets[0].uri
            let uniqueId = DeviceInfo.getUniqueId();
            let Mesuuid = uuid.v4();

            var newMessage = {
                _id: Mesuuid,
                text: "",
                createdAt: new Date(),
                image: imagelink,
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


        }
        console.log("MESSAGE IS", newMessage)

        socket.emit("PVT_MSG", {
            to: user._id,
            message: newMessage
        }, (res) => {
            console.log(res)
        })
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage))
        // console.log("ON SEND FUNC", unqid)
        setFilePath("")


    }, [])

    return (
        <View style={{ flex: 1 }}>
            <CustomHeader />
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
                    // renderSend={renderSend}
                    renderBubble={BubbleChat}
                    alwaysShowSend
                    renderAvatarOnTop
                    renderMessageImage={renderMessageImage}
                    renderInputToolbar={customtInputToolbar}
                    renderSend={renderSend}
                />
            </View>

        </View>
    );
}