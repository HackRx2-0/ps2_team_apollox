import * as React from 'react';
import { Text, View, Button } from 'react-native';

export default function DiscussionsForum({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Discussiondsdsd!</Text>
            <Button
                title="ADD FEED"
                onPress={() => {
                    navigation.navigate("AddFeed")
                }}
            />
        </View>
    );
}