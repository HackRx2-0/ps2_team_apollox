import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, Pressable, ScrollView } from 'react-native';
import { required } from 'yargs';
import { customSize, height, showNotification, width } from '../../../Utils/Utils'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Entypo from "react-native-vector-icons/Entypo"
import { postFeed } from '../../../Functions/ApiFunction';


export default function AddFeed({ navigation }) {

    const [topicSelected, setTopicSelected] = useState()
    const [postHeading, setPostHeading] = useState()
    const [postDesc, setPostDesc] = useState()

    const [imagePath, setImagePath] = useState(null)
    const [isDisabled, setIsDisabled] = useState(true)
    const ImgUrl = require('../../../Images/back-btn.png');

    async function addPostApiCall() {
        const retdata = await postFeed(postHeading, postDesc, topicSelected)
        if (retdata) {
            navigation.pop()
        }
        else {
            showNotification("Something Went Wrong")
        }
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
                setImagePath(source.assets[0].uri)
                var photo = {
                    uri: source.assets[0].uri,
                    type: source.assets[0].type,
                    name: source.assets[0].fileName,
                };

                // var form = new FormData();
                // form.append("image", photo);
                // form.append("group_id", group_id)
                // axios({
                //     url: `${apiBaseUrl}/chat/image`,
                //     method: 'POST',
                //     data: form,
                //     headers: {
                //         Accept: 'application/json',
                //         'Content-Type': 'multipart/form-data',
                //         'Authorization': `Bearer ${TOKEN}`
                //     }
                // })
                //     .then(function (response) {
                //         console.log("response :", response.data);
                //         setFilePath(source);
                //         onSend([], { image: `https://api.apollox.atifhossain.me/${response.data.imageUrl}` })
                //     })
                //     .catch(function (error) {
                //         console.log("error from image :", error);
                //     })


            }
        });

    }
    return (
        <ScrollView contentContainerStyle={{ backgroundColor: '#f1f1f1' }}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps={"handled"}
        >
            <View style={{ width: width, height: height / 14, backgroundColor: "#303d4b" }}>
                <View style={{
                    flexDirection: "row", flex: 1, justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: "4%",
                    marginRight: "4%",


                }}>
                    <TouchableOpacity style={{
                        width: 38,
                        height: 38,
                        justifyContent: "center",
                        borderRadius: 10,
                        backgroundColor: "#404c59",
                    }}
                        onPress={() => { navigation.pop() }}>
                        <Image source={ImgUrl} style={{ height: 38, width: 38 }} />
                    </TouchableOpacity>
                    <Text style={{
                        width: 96,
                        fontFamily: "WorkSans",
                        fontSize: 16,
                        fontWeight: "600",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "center",
                        color: "#ffffff"
                    }}>Make a post</Text>
                    <TouchableOpacity style={{
                        width: 61,
                        height: 38, justifyContent: "center", borderRadius: 10,

                    }}>
                    </TouchableOpacity>

                </View>

            </View >
            <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <Image source={{ uri: 'https://placeimg.com/140/140/any' }}
                    style={{
                        alignSelf: 'center',
                        width: 38, marginTop: 20, marginLeft: 15,
                        height: 38, borderRadius: 38 / 2
                    }} />
                <Text style={{
                    alignSelf: 'center',
                    paddingLeft: 10, paddingTop: 15,
                    fontFamily: "Inter",
                    fontSize: 20,
                    fontWeight: "normal",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "left",
                    color: "#000000"
                }}>Raghav</Text>
            </View>
            <TextInput style={{
                height: 50,
                borderRadius: 10,
                width: width * .95,
                marginTop: 20,
                backgroundColor: "#ffffff",
                paddingLeft: 10,
                paddingTop: 10,
                borderStyle: "solid",
                borderWidth: 1,
                alignSelf: 'center',
                borderColor: "#d4d4d4",
                textAlignVertical: "top",
            }}
                multiline={true}
                placeholder={'Post heading'}
                placeholderTextColor={'#999999'}
                onChangeText={res => {
                    setPostHeading(res)
                }}
            />
            <TextInput style={{
                height: 150,
                borderRadius: 10,
                width: width * .95,
                marginTop: 20,
                backgroundColor: "#ffffff",
                paddingLeft: 20,
                paddingTop: 20,
                borderStyle: "solid",
                borderWidth: 1,
                alignSelf: 'center',
                borderColor: "#d4d4d4",
                textAlignVertical: "top",

            }}
                multiline={true}
                placeholder={'Desc'}
                placeholderTextColor={'#999999'}
                onChangeText={res => {

                    if (res != "") {
                        setIsDisabled(false)
                    } else {
                        setIsDisabled(true)
                    }
                    setPostDesc(res)
                }}
            />
            {/* <Pressable style={{ flexDirection: "row", marginLeft: 18, marginTop: 20, alignItems: "center" }}
                onPress={() => {
                    handlePickImage()
                }}
            >
                <Entypo
                    name={"image"}
                    size={25}
                />
                <Text style={{ marginLeft: 10 }}>
                    Add Image
                </Text>
            </Pressable> */}
            {imagePath ?
                <View style={{ marginTop: -20 }}>
                    <Image
                        source={{ uri: imagePath }}
                        style={{ width: width - 20, height: width - 20, resizeMode: "contain", alignSelf: "center" }}
                    />
                </View> : null}
            <Text style={{
                marginTop: 20,
                paddingLeft: 10,
                fontFamily: "Inter",
                fontSize: 16,
                fontWeight: "normal",
                fontStyle: "normal",
                letterSpacing: 0,
                textAlign: "left",
                color: "#000000"
            }}>Select Topic</Text>
            <View style={{
                flexDirection: 'row',
                marginTop: 15, margin: 10,
                flexWrap: 'wrap',
                justifyContent: 'space-between'
            }}>
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        width: 93,
                        height: 38,
                        borderRadius: 20,
                        backgroundColor: topicSelected == "Mobile" ? '#0bbc8a' : "#ffffff",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#d4d4d4"
                    }} onPress={() => {
                        setTopicSelected('Mobile')
                    }}><Text style={{
                        alignSelf: 'center',
                        fontFamily: "Inter",
                        fontSize: 13,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: topicSelected == "Mobile" ? 'white' : "#000000"
                    }}>📱Mobile</Text></TouchableOpacity>
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        width: 93,
                        height: 38,
                        borderRadius: 20,
                        backgroundColor: topicSelected == "Laptop" ? '#0bbc8a' : "#ffffff",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#d4d4d4"
                    }} onPress={() => {
                        setTopicSelected('Laptop')
                    }}><Text style={{
                        alignSelf: 'center',
                        fontFamily: "Inter",
                        fontSize: 13,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: topicSelected == "Laptop" ? 'white' : "#000000"
                    }}>💻Laptops</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        width: 93,
                        height: 38,
                        borderRadius: 20,
                        backgroundColor: topicSelected == "Smart" ? '#0bbc8a' : "#ffffff",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#d4d4d4"
                    }} onPress={() => {
                        setTopicSelected('Smart')
                    }}>
                    <Text style={{
                        alignSelf: 'center',
                        fontFamily: "Inter",
                        fontSize: 13,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        color: topicSelected == "Smart" ? 'white' : "#000000"
                    }}>⌚Smartwatch</Text></TouchableOpacity>
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        height: 38,
                        borderRadius: 20,
                        backgroundColor: topicSelected == "AC" ? '#0bbc8a' : "#ffffff",
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#d4d4d4"
                    }} onPress={() => {
                        setTopicSelected('AC')
                    }}><Text style={{
                        padding: 10,
                        alignSelf: 'center',
                        fontFamily: "Inter",
                        fontSize: 13,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        letterSpacing: 0,
                        textAlign: "left",
                        color: topicSelected == "AC" ? 'white' : "#000000"
                    }}>❄️AC</Text></TouchableOpacity>
            </View>

            <Pressable
                style={{
                    alignSelf: "center", width: width - 74, height: 54,
                    alignItems: "center", backgroundColor: isDisabled ? "#cbcaca" : "#09bc8a",
                    flexDirection: "row",
                    borderRadius: 10, marginTop: "25%",
                    marginBottom: "25%",
                    justifyContent: "center"

                }}
                onPress={() => {
                    addPostApiCall()
                }}
            >
                <Text style={{
                    alignSelf: "center",
                    fontFamily: "Inter-Regular",
                    fontSize: customSize(14),
                    color: "#ffffff"
                }}>
                    Make Post
                </Text>
            </Pressable>

        </ScrollView>
    );
}