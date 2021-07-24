import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Image, Pressable } from 'react-native';
import axios from 'axios';
import FontAwesome from "react-native-vector-icons/FontAwesome"

import { apiBaseUrl } from '../../../Config/Config';
import Store from '../../../Store/Store';
import { height, width, customSize } from '../../../Utils/Utils';

export default function SavedProductsScreen({ navigation }) {
    const [recommendedProductsArray, setRecommendedProductsArray] = useState([]);

    useEffect(() => {
        axios.get(`${apiBaseUrl}/user/favorites/products/`, {
            headers: {
                "Authorization": `Bearer ${Store.authToken}`
            }
        },
        ).then((res) => {
            console.log("FROM SERVER", res.data)
            setRecommendedProductsArray(res.data)


        }).catch((err) => {
            console.log(err)
        })

    }, [])
    function renderItemProducts({ item, index }) {
        return (
            <Pressable style={{
                height: "auto",
                width: width - 20,
                backgroundColor: "#ffffff",

                paddingTop: "2%",
                paddingBottom: "2%",
                justifyContent: "center",

                opacity: 1, alignSelf: "center",
                marginBottom: 18,
                borderRadius: 10,
            }}
                onPress={() => {
                    navigation.navigate("Web", { link: item.produrl })
                }}
            >
                <View style={{ flexDirection: "row", flex: 1 }}>
                    <Image
                        source={{ uri: item.prodimageurl }}
                        style={{
                            height: height / 9, width: width / 3,
                            resizeMode: "contain",
                            marginLeft: 0, marginTop: 10
                        }}
                    />

                    <View style={{ flex: 1, paddingLeft: 0, paddingTop: 5 }}>

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

                            <Pressable
                                style={{
                                    width: 80,
                                    height: "70%",
                                    borderRadius: 5,
                                    marginTop: 5.5,
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

            </Pressable>
        )
    }
    return (
        <View style={{
            flex: 1, justifyContent: 'center', alignItems: 'center'
            , marginTop: 20
        }}>
            <FlatList
                data={recommendedProductsArray}
                pagingEnabled={true}
                // inverted={true}


                renderItem={renderItemProducts}
                keyExtractor={item => item._id}
            // showsHorizontalScrollIndicator={false}




            />
        </View>
    );
}