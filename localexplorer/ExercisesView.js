import React from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import Exercise from "./Exercise";
import { getExercises } from "./DataFlow";

class ExercisesView extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      token: "",
      exercises: [],  // Ensure exercises is initialized as an empty array
      error: "",
    };
  }

  componentDidMount() {
    // Fetch user profile information
    const { username, token } = this.props.setAccessToken;
    console.log("Exercise: " + JSON.stringify(this.props.setAccessToken));
    console.log("token and username: " + token, username);

    this.setState({ token }, () => {
      this.loadExercises(token);
    });

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // Alert.alert('Refreshed');
      this.loadExercises(this.state.token);
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  loadExercises = async token => {
    console.log("loading exercises");
    try {
      let res = await getExercises(token);
      console.log("getExercises response:", JSON.stringify(res));

      if (Array.isArray(res)) {
        this.setState({ exercises: res }, () => {
          console.log("exercises state set to:", this.state.exercises);
        });
      } else {
        console.log("Invalid response format:", res);
        this.setState({ exercises: [] }, () => {
          console.log("exercises state set to an empty array due to invalid format");
        });
      }
    } catch (e) {
      console.log(e);
      const errorMessage = e && e.message ? e.message : (e ? e.toString() : "Unknown error");
      this.setState({
        error: errorMessage,
        exercises: []
      }, () => {
        console.log("exercises state set to an empty array due to error");
      });
    }
  };

  handleEdit = () => {
    console.log("handleedit");
    console.log("Exercises token: ", this.state.token);
    this.props.navigation.navigate("AddExercise", {
      edit: false,
      token: this.state.token
    });
  };

  handleDelete = (_item) => {
    this.setState({
      exercises: this.state.exercises.filter(item => item.id !== _item.id)
    });
  };

  render() {
    console.log("this.state.token", this.state.token);
    console.log("this.state.exercises", this.state.exercises);
    return (
      <View key={this.state.uniqueValue}>
        {this.state.exercises.length === 0 && (
          <View>
            <Text style={styles.title}>
              No activities. Add some exercises to see details.
            </Text>
          </View>
        )}
        <Button
          onPress={() => this.handleEdit()}
          title="Add Post"
        />
        {this.state.exercises.length !== 0 && (
          <View>
            <Text 
              style={{
                textAlign: "left",
                marginVertical: 10,
                marginLeft: 30
              }}>
              Posts List
            </Text>
          </View>
        )}
        <FlatList
          data={this.state.exercises}
          renderItem={({ item }) => (
            <View>
              <Exercise
                exerciseItem={item}
                token={this.state.token}
                navigation={this.props.navigation}
                handleDeleteList={this.handleDelete}
              />
            </View>
          )}
          keyExtractor={(item, index) => item.id.toString()}
        />
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

export default ExercisesView;
