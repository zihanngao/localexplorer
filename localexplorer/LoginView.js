import React from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
//import base64 from "base-64"; // Use this library to encode `username:password` to base64
import { login } from "./DataFlow";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationEvents } from 'react-navigation';

class LoginView extends React.Component {
  // Use Basic access authentication (https://en.wikipedia.org/wiki/Basic_access_authentication) to authenticate the user.
  // React Native 1 lecture covered a good example of how to do this.
  static navigationOptions = {
    header: null
};
  constructor(props){
    super(props);
        this.state = {
            username: "",
            password: "",
            error: ""
        };
  }

  handleLogin = async () => {
    try {
        const res = await login(this.state.username, this.state.password);
        const token = await AsyncStorage.getItem("token");
        console.log(res);
        console.log("login: " + JSON.stringify(this.props.navigation))
        this.props.navigation.navigate("Home", {
          username: this.state.username,
          token
        });
        this.setState({
          error: ""
        })
    } catch (e) {
        this.setState({
            error: e
        });
    }
};

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Log in to view your profile</Text>
        <TextInput style={styles.input} placeholder="Username" onChangeText={username => this.setState({ username })} />
        <TextInput style={styles.input} placeholder="Passowrd" secureTextEntry={true} onChangeText={password => this.setState({ password })}/>
        {this.state.error !== "" && (
                    <Text style={{ color: "red" }}>{this.state.error}</Text>
                )}
        {/* <Text style={{ color: "red" }}>
          {this.state.error ? this.state.error : ""}
          </Text> */}
        {/* <TextInput style={styles.input} placeholder="Enter an input" /> */}

        {/* To navigate to another component, use this.props.navigation.navigate().
            See https://reactnavigation.org/docs/navigating for more details.
          */}
        <Button onPress={this.handleLogin} title="Log in"/>
        <Button onPress={() => this.props.navigation.navigate('SignUp')} title="Create a new account"/>
        {/* <Button title="Log in!" onPress={() => console.log("I am a button!")} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    margin: 100,
    marginHorizontal: 30,
  },
  title: {
    textAlign: "center",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    height: 40,
    marginVertical: 10,
  },
});

export default LoginView;
