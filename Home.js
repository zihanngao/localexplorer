import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
// import { createBottomTabNavigator } from "react-navigation-tabs";
import ProfileView from "./ProfileView";
import ExercisesView from "./ExercisesView"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

class Home extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
    }
    render() {
        console.log("home: " + JSON.stringify(this.props.route.params ))
        return (
            <Tab.Navigator screenProps={this.props.navigation} >
                <Tab.Screen 
                    name="Profile" 
                    options={{
                    headerRight: () => (
                    <Button
                        onPress={ async () => {
                            await AsyncStorage.removeItem("token");
                            await AsyncStorage.removeItem("username");
                            this.props.navigation.navigate("Login")  
                        }}
                        title="Log out"
                    />
                    ),
                    }}>
                    {(props) => (
                        <ProfileView {...props} setAccessToken={this.props.route.params} />
                    )}
                </Tab.Screen>
                {/* <Tab.Screen name="Profile" component={ProfileView} /> */}
                <Tab.Screen 
                    name="Exercises" 
                    options={{
                    headerRight: () => (
                    <Button
                        onPress={() => this.props.navigation.navigate("Login")}
                        title="Log out"
                    />
                    ),
                    }}>
                    {(props) => (
                        <ExercisesView {...props} setAccessToken={this.props.route.params} />
                    )}
                </Tab.Screen>
            </Tab.Navigator>
        )
    }
}

export default Home;
