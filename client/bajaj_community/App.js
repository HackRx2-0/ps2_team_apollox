import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ToastAndroid, Button, StyleSheet, SafeAreaView, LogBox } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';

import { AuthScreens, RegisterStack } from "./src/Navigation/AuthNavigator";
import { getData, storeData } from "./src/Utils/Utils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Store from "./src/Store/Store";
import { Observer } from "mobx-react";
import { HomeScreens } from './src/Navigation/HomeNavigator';
import axios from "axios";
import { apiBaseUrl } from './src/Config/Config';


LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs(['MobX']);



function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [authState, setAuthState] = useState()

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;

  useEffect(async () => {
    const authStateVal = await getData('authState')
    const authTokenServer = await getData('authTokenServer')
    getUserDetails()
    console.log("WEB TOKEN", authTokenServer)
    Store.setAuthToken(authTokenServer)

    setAuthState(authStateVal);
    Store.setAuthStateVal(authStateVal);
    // Store.setAuthStateVal("3");

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    if (auth().currentUser) {
      auth().currentUser.getIdToken().then((res) => {
        // console.log("Firebase TOKEN", res)

      }).catch((err) => {
        console.log("ERR", err)

      });
    }

    return subscriber; // unsubscribe on unmount
  }, []);

  async function getUserDetails() {
    const authTokenServer = await getData('authTokenServer')
    if (authTokenServer) {
      axios.get(`${apiBaseUrl}/user`, {
        headers: {
          "Authorization": `Bearer ${authTokenServer}`
        }
      }).then((res) => {
        console.log("USER DATA", res.data)
        Store.setUserUid(res.data.uid)
        Store.setUserName(res.data.name)


        // setRoomsData(res.data)
        // setLoading(false)
      }).catch((err) => {
        console.log(err)

      })
    }
  }

  function onAuthStateChanged(user) {
    console.log(user)
    setUser(user);
    if (initializing) setInitializing(false);
  }

  if (initializing) return null;
  //authstate 1 = otp success but email not given
  //authstate 2 = email success but phone not given
  //authstate 3 = both Success
  return (
    <Observer>
      {() => (
        <NavigationContainer>
          {user && Store.authState == '1' ?
            // <View>
            //   <TouchableOpacity onPress={() => {
            //     AsyncStorage.clear()
            //     Store.setAuthStateVal("0")
            //     auth().signOut()
            //   }}>
            //     <Text>
            //       Otp SuccessSign Out
            //     </Text>
            //   </TouchableOpacity>
            // </View> 
            <RegisterStack />

            : user && Store.authState == '2' ?
              // <View>
              //   <TouchableOpacity onPress={() => {
              //     AsyncStorage.clear()
              //     Store.setAuthStateVal("0")
              //     auth().signOut()
              //   }}>
              //     <Text>
              //       Email SuccessSign Out
              //     </Text>
              //   </TouchableOpacity>
              // </View>
              <RegisterStack />
              : user && Store.authState == '3' ?
                <HomeScreens />
                :
                <AuthScreens />}
        </NavigationContainer>
      )}
    </Observer>
  );
}

export default App;



// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, ToastAndroid, Button, StyleSheet, SafeAreaView, LogBox } from 'react-native';
// import { NavigationContainer, useNavigation } from '@react-navigation/native';

// import auth from '@react-native-firebase/auth';

// import { AuthScreens } from "./src/Navigation/AuthNavigator";



// LogBox.ignoreLogs(['Warning: ...']);
// LogBox.ignoreLogs(['MobX']);



// function App() {

//   let timer = () => { };

//   const myTimer = () => {
//     const [timeLeft, setTimeLeft] = useState(30);

//     const startTimer = () => {
//       timer = setTimeout(() => {
//         if (timeLeft <= 0) {
//           clearTimeout(timer);
//           return false;
//         }
//         setTimeLeft(timeLeft - 1);
//       }, 1000)
//     }

//     useEffect(() => {
//       startTimer();
//       return () => clearTimeout(timer);
//     });

//     const start = () => {
//       setTimeLeft(30);
//       clearTimeout(timer);
//       startTimer();
//     }

//     return (
//       <View style={{ flex: 1 }}>
//         <Text >{timeLeft}</Text>
//         <Button onPress={start} title="Press" />
//       </View>
//     )
//   }
//   return (myTimer())
// }
// export default App;