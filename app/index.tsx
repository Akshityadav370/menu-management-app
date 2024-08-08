import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { app } from "@/firebase/index";
import { Ionicons } from "@expo/vector-icons";
import {
  User,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import HomeScreen from "./HomeScreen";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import logo from "@/assets/images/Viraaj Ventures Logo.png";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AuthScreen = ({
  email,
  setEmail,
  password,
  setPassword,
  handleAuthentication,
  authError,
}: any) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo}></Image>
      </View>
      <View style={styles.signInContainer}>
        <Text style={styles.title}>Login</Text>
        {authError ? (
          <Text style={styles.errorText}>Invalid Email/Password</Text>
        ) : null}
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email ID"
          autoCapitalize="none"
          placeholderTextColor="dimgrey"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!showPassword}
            placeholderTextColor="dimgrey"
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="dimgrey"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleAuthentication}>
            <Text style={styles.singInButton}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const AuthenticatedScreen = ({ user, handleAuthentication }: any) => {
  return <HomeScreen handleAuthentication={handleAuthentication} user={user} />;
};
export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Track user authentication state
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState("");

  // storing the expo push token
  const [expoPushToken, setExpoPushToken] = useState("");

  // Registering the push token
  // registerForPushNotificationsAsync().then(
  //   (token) => token && setExpoPushToken(token)
  // );

  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // async function registerForPushNotificationsAsync() {
  //   let token;

  //   if (Platform.OS === "android") {
  //     await Notifications.setNotificationChannelAsync("default", {
  //       name: "default",
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: "#FF231F7C",
  //     });
  //   }

  //   if (Device.isDevice) {
  //     const { status: existingStatus } =
  //       await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== "granted") {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== "granted") {
  //       alert("Failed to get push token for push notification!");
  //       return;
  //     }
  //     // Learn more about projectId:
  //     // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
  //     // EAS projectId is used here.
  //     try {
  //       const projectId =
  //         Constants?.expoConfig?.extra?.eas?.projectId ??
  //         Constants?.easConfig?.projectId;
  //       if (!projectId) {
  //         throw new Error("Project ID not found");
  //       }
  //       token = (
  //         await Notifications.getExpoPushTokenAsync({
  //           projectId,
  //         })
  //       ).data;
  //       console.log(token);
  //     } catch (e) {
  //       token = `${e}`;
  //     }
  //   } else {
  //     alert("Must use physical device for Push Notifications");
  //   }

  //   return token;
  // }

  const handleAuthentication = async () => {
    try {
      setAuthError(""); // Clear any previous errors
      if (user) {
        await signOut(auth);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Authentication error:", error.message);
      setAuthError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <AuthenticatedScreen
          user={user}
          handleAuthentication={handleAuthentication}
        />
      ) : (
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleAuthentication={handleAuthentication}
          authError={authError}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "black",
  },
  authContainer: {
    width: "85%",
    // backgroundColor: "darkgray",
    alignSelf: "center",
    margin: "auto",
    padding: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "goldenrod",
  },
  title: {
    fontSize: 40,
    marginBottom: "9%",
    textAlign: "center",
    color: "goldenrod",
    fontWeight: "400",
  },
  input: {
    height: 40,
    fontSize: 20,
    borderColor: "white",
    color: "black",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    width: "70%",
    alignSelf: "center",
    backgroundColor: "gainsboro",
  },
  buttonContainer: {
    marginBottom: 16,
    width: "70%",
    alignSelf: "center",
    marginTop: "10%",
    backgroundColor: "goldenrod",
    borderRadius: 10,
  },
  singInButton: {
    // padding: 50,
    textAlign: "center",
    fontSize: 20,
    padding: 13,
    fontWeight: "500",
    color: "white",
    textTransform: "uppercase",
  },
  toggleText: {
    color: "goldenrod",
    textAlign: "center",
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  signInContainer: {
    height: "65%",
    marginTop: "auto",
    backgroundColor: "whitesmoke",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    // paddingVertical: "10%",
    justifyContent: "center",
  },
  logoContainer: {
    height: "auto",
    width: "100%",
  },
  logo: {
    height: 100,
    width: "100%",
    margin: "auto",
    objectFit: "contain",
    marginTop: "20%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    alignSelf: "center",
    marginBottom: 16,
    backgroundColor: "gainsboro",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "white",
  },
  passwordInput: {
    flex: 1,
    height: 40,
    fontSize: 20,
    color: "black",
    padding: 8,
  },
  eyeIcon: {
    padding: 10,
  },
});
