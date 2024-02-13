// App.js

import { Button, Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserPage from './UserPage'; // Mengimpor komponen UserPage
import AdminPage from './AdminPage'; // Mengimpor komponen AdminPage

const Stack = createStackNavigator();

export default function App() {
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "303234411910-o14q47hrkme9c90tfaccjhj42gvip65h.apps.googleusercontent.com",
    });
  }, []);

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      if (user.user.email === 'posyanduedellweis@gmail.com') {
        setUserInfo(user);
        setError(null);
      } else {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        setError('Hanya akun admin posyandu yang dapat login admin');
      }
    } catch (e) {
      setError('Login gagal. Silakan coba lagi.');
    }
  };

  const logout = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUserInfo(null);
    } catch (e) {
      setError(e.message || "An error occurred");
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {props => <Home {...props} userInfo={userInfo} signin={signin} logout={logout} error={error} />}
        </Stack.Screen>
        <Stack.Screen name="UserPage" component={UserPage} options={{ title: 'User Page' }} />
        <Stack.Screen name="AdminPage" component={AdminPage} options={{ title: 'Admin Page' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Home({ navigation, userInfo, signin, logout, error }) {
  return (
    <ImageBackground source={require('./assets/background.jpg')} style={styles.background}>
      <View style={styles.container}>
        {userInfo ? (
          <>
            <Image source={{ uri: userInfo.user.photo }} style={styles.profileImage} />
            <Text>{userInfo.user.givenName}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Masuk aplikasi" onPress={() => navigation.navigate('AdminPage')} />
              <View style={styles.buttonSpacing} />
              <Button title="Logout" onPress={logout} />
            </View>
          </>
        ) : (
          <>
            <Text>{error}</Text>
            <Text style={styles.adminText}>Login sebagai admin</Text>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Standard}
              color={GoogleSigninButton.Color.Dark}
              onPress={signin}
            />
            <View style={styles.buttonContainer}>
              <Button title="Masuk sebagai peserta" onPress={() => navigation.navigate('UserPage')} />
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Warna latar belakang dengan opasitas 50%
    alignItems: "center",
    justifyContent: "center",
  },
  adminText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonSpacing: {
    marginVertical: 10,
  }
});
