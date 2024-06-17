import React from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getUser } from "./DataFlow";
import { Ionicons } from "@expo/vector-icons";
import { updateUser } from "./DataFlow";
import styled from "styled-components";

class ProfileView extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
        username: "",
        token: "",
        firstName: "",
        lastName: "",
        address: "",
        error: "",
        edit: false
    };
}

componentDidMount() {
  //fetch user profile information
  // console.log("Good: "+ JSON.stringify(this.props.setAccessToken))
  const { username, token } = this.props.setAccessToken;
  // console.log("token and username: " + token, username)
  
  this.loadProfile(token, username);
}

loadProfile = async (token, username) => {
  // console.log("loadprofile: " + token, username)
  try {
      let res = await getUser(token, username);
      console.log("loadprofile: " + JSON.stringify(res));

      this.setState({
          token,
          username,
          firstName: res.firstName,
          lastName: res.lastName,
          address: res.address,
      });

      console.log('firstName: ' + firstname)
  } catch (e) {
      console.log("getUserError: " + e);
      this.setState({
          error: e
      });
  }
};

handleEdit = () => {
  // console.log("editing");
  this.setState({
      edit: true
  });
};

handleSave = async () => {
  // console.log("saving");
  try {
      const res = await updateUser(
          this.state.token,
          this.state.username,
          this.state.firstName,
          this.state.lastName,
          this.state.address
      );
      // console.log(res);
      this.setState({
          edit: false
      });
  } catch (e) {
      console.log(e);
      this.setState({
          error: e,
          edit: false
      });
    }
};

  render() {
    return (
      <KeyboardAwareScrollView>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Profile</Text> */}
        {this.state.edit ? (
        <Button onPress={this.handleSave} title="Save"/>
        ) : (<Button onPress={this.handleEdit} title="Press here to begin editing your profile"/>
        )}

        
          <Text style={styles.content}>First name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="First name" 
            value={this.state.firstName} 
            editable={this.state.edit} 
            onChangeText={firstName => this.setState({ firstName })}
          />
        
          <Text style={styles.content}>Last name</Text>
          <TextInput style={styles.input} placeholder="Last name" value={this.state.lastName} editable={this.state.edit} onChangeText={lastName => this.setState({ lastName })}/>

          <Text style={styles.content}>Address</Text>
          <TextInput style={styles.input} placeholder="Address" value={this.state.address} editable={this.state.edit} onChangeText={address => this.setState({ address })}/>

        {/* <TextInput style={styles.input} placeholder="Enter an input" /> */}

        {/* <Button
          title="Button"
          onPress={() => console.log("I am a button from ProfileView!")}
        /> */}
      </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
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
  content:{
    flex: 0.4,
  }
});

export default ProfileView;
