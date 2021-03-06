import React from 'react';
import { WebView } from 'react-native-webview';

export default function showWeb({ route }) {
    return <WebView source={{ uri: route.params.link }} />
}