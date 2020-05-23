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

import * as base64 from "base-64";

const isAndroid = Platform.OS == "android" ? true : false;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(false);

  const { login, setIsAuthenticated } = useAuth();

  const handleLogin = async () => {
    const errors = [];

    // {
    //   "email": "sunnydhama@sunnydhama.com",
    //   "firstName": "sunny",
    //   "lastName": "dhama",
    //   "name": "sunny dhama",
    //   "password": "sunnydhama",
    //   "token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJfM19yU194My1KOW1CX2o1Qm91eGV6bzZucl81RUk5YWJnSGlxejJnYXZ3In0.eyJqdGkiOiIwZDE0MDRjNi04OWZhLTQ2YTEtYTM2Ny1kMGFhMDBkZGExMTAiLCJleHAiOjE1OTAxNjMwMzQsIm5iZiI6MCwiaWF0IjoxNTkwMTU5NDM0LCJpc3MiOiJodHRwczovL3NlY3VyZS5kYWlseWtpdC5vcmcvYXV0aC9yZWFsbXMvY29uc3VtZXJzIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjAzZWQ5NDNmLTUzYWEtNGE4YS1iMGFiLTk1NzNiOTVhYmY3ZSIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlc3RhdXJhbnRtZWFsa2l0IiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiM2U5NTE4OGYtMzgxZC00ZjQ2LWFiYWUtYWQ2NGZlMGExMWMxIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vcmVzdGF1cmFudG1lYWxraXRzLmNvbSIsImh0dHA6Ly93d3cucmVzdGF1cmFudG1lYWxraXRzLmNvbSJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJzdW5ueSBkaGFtYSIsInByZWZlcnJlZF91c2VybmFtZSI6InN1bm55ZGhhbWEiLCJnaXZlbl9uYW1lIjoic3VubnkiLCJmYW1pbHlfbmFtZSI6ImRoYW1hIiwidXNlcmlkIjoiMDNlZDk0M2YtNTNhYS00YThhLWIwYWItOTU3M2I5NWFiZjdlIiwiZW1haWwiOiJzdW5ueWRoYW1hQHN1bm55ZGhhbWEuY29tIn0.MX_uhWsy0B6aMuaQGUXCWY_LpgmU8G3W97be2YUENJlardp1jmQbOdgwDfBoyWYuDdNaIegZu0KyQ6IR-fHVpokGsz7_o4NOqwhCn2CaLLFTn1SNJnwjk1Qagl7LeOM1iYQ4FUXHuJj47v5rNl6VuvSiD3h7jc1a9l8x0sV8CTGGFISLCT_AAq5nsa7ZtKTKKiz1G6opfaHTKyQxNmDcR0VK5nxhZP487_HWVyNfp0XoMgQR0nv1mZeRGOEycLdjf9XE4OPKD7825TfNXEgnzP-OJLUKmEFc-bLRuOoglgXNbldxBVsNmq52NKal0iXPu8L8QI7MK9er8yjhAlTjyA",
    //   "username": "sunnydhama",
    // }

    // {"jti":"3a4c923d-96c2-4986-a131-bcf2d4b7a54f","exp":1590164004,"nbf":0,"iat":1590160404,"iss":"https://secure.dailykit.org/auth/realms/consumers","aud":"account","sub":"03ed943f-53aa-4a8a-b0ab-9573b95abf7e","typ":"Bearer","azp":"restaurantmealkit","auth_time":0,"session_state":"7a2f9d15-30bb-4146-9e05-a784bcda67c3","acr":"1","allowed-origins":["http://restaurantmealkits.com","http://www.restaurantmealkits.com"],"realm_access":{"roles":["offline_access","uma_authorization"]},"resource_access":{"account":{"roles":["manage-account","manage-account-links","view-profile"]}},"scope":"openid email profile","email_verified":false,"name":"sunny dhama","preferred_username":"sunnydhama","given_name":"sunny","family_name":"dhama","userid":"03ed943f-53aa-4a8a-b0ab-9573b95abf7e","email":"sunnydhama@sunnydhama.com"}

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
