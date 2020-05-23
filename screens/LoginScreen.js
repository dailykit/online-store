import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Platform,
  AsyncStorage,
  View,
  ScrollView,
  Alert,
  Text,
} from "react-native";

import { useAuth } from "../context/auth";
import { Input } from "@ui-kitten/components";

import { GradientButton } from "../components";
import { theme } from "../constants";

const isAndroid = Platform.OS == "android" ? true : false;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(false);

  const { login, setIsAuthenticated } = useAuth();

  const handleLogin = async () => {
    const errors = [];

    Keyboard.dismiss();
    setLoading(true);
    // check with backend API or with some static data
    try {
      await login(email, password);
      let user = await AsyncStorage.getItem("user");
      user = JSON.parse(user);
      if (user && user.token && user.token !== undefined) {
        const payload = user.token.split(".")[1];
        const decoded = JSON.parse(base64.decode(payload));
        await AsyncStorage.setItem("email", decoded["email"]);
        await AsyncStorage.setItem("userid", decoded["userid"]);
        setIsAuthenticated(true);
      } else {
        console.log("error");
        setErrors(true);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.login}>
        <View style={styles.content}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
          <View style={{ marginTop: 40 }}>
            {errors && (
              <Text style={{ color: "red", fontWeight: "bold" }}>
                username/password incorrect
              </Text>
            )}
            <Input
              label="Email"
              defaultValue={email}
              onChangeText={(email) => setEmail(email)}
            />
            <Input
              secureTextEntry
              label="Password"
              value={password}
              onChangeText={(password) => setPassword(password)}
            />
            <GradientButton gradient onPress={() => handleLogin()}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.text}>Login</Text>
              )}
            </GradientButton>

            <GradientButton onPress={() => navigation.navigate("Forgot")}>
              <Text style={styles.backtext}>Forgot your password?</Text>
            </GradientButton>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  login: {
    flex: 1,
    justifyContent: "center",
    marginTop: isAndroid ? 50 : 30,
  },
  InputAuth: {
    borderRadius: 0,
    borderWidth: 0,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  },
  constainer: { marginTop: 50 },
  content: { paddingHorizontal: theme.sizes.base * 2 },
  heading: { marginBottom: 20, fontSize: 24, fontWeight: "bold" },
  text: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  backtext: {
    color: "gray",
    textAlign: "center",
  },
});

export default LoginScreen;
