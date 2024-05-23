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
        goalDailyCalories: 0,
        goalDailyProtein: 0,
        goalDailyCarbohydrates: 0,
        goalDailyFat: 0,
        goalDailyActivity: 0,
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
          goalDailyCalories: res.goalDailyCalories,
          goalDailyProtein: res.goalDailyProtein,
          goalDailyCarbohydrates: res.goalDailyCarbohydrates,
          goalDailyFat: res.goalDailyFat,
          goalDailyActivity: res.goalDailyActivity
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
          this.state.goalDailyCalories,
          this.state.goalDailyProtein,
          this.state.goalDailyCarbohydrates,
          this.state.goalDailyFat,
          this.state.goalDailyActivity
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

          <Text style={styles.content}>Daily calories</Text>
          <TextInput style={styles.input} placeholder="Daily calories" value={this.state.goalDailyCalories.toString()} editable={this.state.edit} keyboardType={"phone-pad"} onChangeText={goalDailyCalories => this.setState({ goalDailyCalories })}/>

          <Text style={styles.content}>Daily protein</Text>
          <TextInput style={styles.input} placeholder="Daily protein" value={this.state.goalDailyCarbohydrates.toString()} editable={this.state.edit} keyboardType={"phone-pad"} onChangeText={goalDailyCarbohydrates => this.setState({ goalDailyCarbohydrates })}/>

          <Text style={styles.content}>Daily carbs</Text>
          <TextInput style={styles.input} placeholder="Daily carbs" value={this.state.goalDailyProtein.toString()} editable={this.state.edit} keyboardType={"phone-pad"} onChangeText={goalDailyProtein => this.setState({ goalDailyProtein })}/>

          <Text style={styles.content}>Daily fats</Text>
          <TextInput style={styles.input} placeholder="Daily fats" value={this.state.goalDailyFat.toString()} editable={this.state.edit} keyboardType={"phone-pad"} onChangeText={goalDailyFat => this.setState({ goalDailyFat })}/>

          <Text style={styles.content}>Daily activity</Text>
          <TextInput style={styles.input} placeholder="Daily activity" value={this.state.goalDailyActivity.toString()} editable={this.state.edit} keyboardType={"phone-pad"} onChangeText={goalDailyActivity => this.setState({ goalDailyActivity })}/>

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
