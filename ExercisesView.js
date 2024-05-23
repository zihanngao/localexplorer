import React from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import Exercise from "./Exercise"
import { getExercises } from "./DataFlow";

class ExercisesView extends React.Component {
  static navigationOptions = {
    header: null
};
  constructor(props) {
    super(props);
    this.state = {
        token: "",
        exercises: [],
        error: "",
    };
}

componentDidMount() {
  //fetch user profile information
  console.log("Exercise: "+ JSON.stringify(this.props.setAccessToken))
  const { username, token } = this.props.setAccessToken;
  // console.log("token and username: " + token, username)
  
  // this.loadExercises(token);

  this._unsubscribe = this.props.navigation.addListener('focus', () => {
    // Alert.alert('Refreshed');
    this.loadExercises(token);
  });
}

componentWillUnmount() {
  this._unsubscribe();
}

loadExercises = async token => {
  // console.log("loading exercises")
  try {
      let res = await getExercises(token);
      
      // console.log("getExercises" + JSON.stringify(res))

      this.setState({
          token,
          exercises: res.activities
      });

      // console.log("exercises: " + this.state.exercises)
  } catch (e) {
      console.log(e);
      this.setState({
          error: e
      });
  }
};

handleEdit = () => {
  // console.log("handleedit");
  this.props.navigation.navigate("AddExercise", {
      edit: false,
      token: this.state.token
  });
};

handleDelete = (_item) => {
  this.setState({
    exercises: this.state.exercises.filter(item => item.id !== _item.id)
  })
}

  render() {
    console.log(this.state.token)
    return (
      <View key={this.state.uniqueValue}>
        {/* <Text style={styles.title}>Set up your exercises now!</Text> */}
        {this.state.exercises.length === 0 && (
                    <View>
                        <Text style={styles.title}>
                            No activites. Add some exercises to see details.
                        </Text>
                    </View>
                )}
         <Button
            onPress={() => this.handleEdit()}
            title="Add Exercise"
          />
        {this.state.exercises.length !== 0 && (
            <View>
                <Text 
                  style={{
                    textAlign: "left",
                    marginVertical: 10,
                    marginLeft: 30
                  }}>
                  Your Exercises
                </Text>
            </View>
                )}
          <FlatList
              data={this.state.exercises}
              renderItem={({ item }) => {
                return(
                <View>
                  <Exercise
                      exerciseItem={item}
                      token={this.state.token}
                      navigation={this.props.navigation}
                      handleDeleteList={this.handleDelete}
                  />
                </View>
                )
              }}
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
