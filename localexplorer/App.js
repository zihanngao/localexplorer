import 'react-native-gesture-handler';
import React from "react";
import { Button} from "react-native";

import LoginView from "./LoginView";
import SignupView from "./SignupView";
import ProfileView from "./ProfileView";
import PostsView from "./PostsView";
import AddPost  from './AddPost';
import Home from "./Home"

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

class App extends React.Component {
  constructor() {
    super();

    // Feel free to add more states here
    this.state = {
      accessToken: undefined,
    };
  }

  // Set the access token
  setAccessToken = (newAccessToken) => {
    this.setState({ accessToken: newAccessToken });
  };

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginView {...props} setAccessToken={this.setAccessToken} />
            )}
          </Stack.Screen>

          <Stack.Screen name="SignUp" component={SignupView} />

          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}>
            {/* {(props) => <ProfileView {...props} />}
            {(props) => <PostsView {...props} />} */}
          </Stack.Screen>

          <Stack.Screen 
            name="AddPost" 
            component={AddPost} 
            options={{
              headerRight: () => (
              <Button
                  onPress={() => this.props.navigation.navigate("Login")}
                  title="Log out"
              />
              ),
              }}
            />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
