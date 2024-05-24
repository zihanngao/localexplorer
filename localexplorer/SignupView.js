import React from "react";
import { StyleSheet, Text, View, ScrollView, Button, TextInput, Alert } from "react-native";
import {createUser} from "./DataFlow"

class SignupView extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
        userText: "",
        pwdText: "",
        fname: "",
        lname: "",
        cals: 0,
        prot: 0,
        carbs: 0,
        fat: 0,
        activity: 0,
        error: ""
    };
}

createAlert = () => {
  console.log("alert!");
  Alert.alert(
    "User created!",
    "",
    [
      { text: "OK", onPress: ()=> this.props.navigation.navigate("Login") }
    ]
  )
};

handleSignup = async () => {
  console.log("signing up");
  try {
      const res = await createUser(
          this.state.userText,
          this.state.pwdText,
          this.state.fname,
          this.state.lname,
          this.state.cals,
          this.state.prot,
          this.state.carbs,
          this.state.fat,
          this.state.activity
      );
      console.log(res);
      // this.props.navigation.navigate("Login");
      this.createAlert();
      // Alert.alert(
      //   "User created!",
      //   [
      //     { text: "OK", onPress: ()=> this.props.navigation.navigate("Login") }
      //   ]
      // );
  } catch (e) {
      console.log(e);
      this.setState({
          error: e
      });
  }
};

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Start with creating a new account!</Text>
        <TextInput style={styles.input} placeholder="Username" onChangeText={userText => this.setState({ userText })}/>
        <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={pwdText => this.setState({ pwdText })}/>
        {this.state.error !== "" && (
                    <Text style={{ color: "red" }}>{this.state.error}</Text>
        )}
        <Button title="Sign up!" onPress={this.handleSignup} />
      </ScrollView>
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

export default SignupView;
