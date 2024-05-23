import React, { Component } from "react";
import { View, Text, Button, Alert, StyleSheet, TextInput } from "react-native";
import moment from "moment/moment.js";
import { addExercise, getExercise, updateExercise } from "./DataFlow";

export default class AddExercise extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            token: "",
            name: "",
            duration: 0,
            date: moment().format(),
            calories: 0,
            error: "",
            edit: false,
            exerciseId: 0
        };
    }

    componentDidMount() {
        const edit = this.props.route.params.edit;
        let token = "";
        let exerciseId = 0;
        if (edit) {
            token = this.props.route.params.token;
            exerciseId = this.props.route.params.id;
            this.loadExercise(token, exerciseId);
            // console.log(edit);
            this.setState({
                token: token,
                edit: edit,
                exerciseId: exerciseId
            });
        } else {
            token = this.props.route.params.token;
            // console.log(edit, token);
            this.setState({
                token: token,
                edit: edit,
            });
        }
    }

    loadExercise = async (token, exerciseId) => {
        try {
            let res = await getExercise(token, exerciseId);
            // console.log(res);
            this.setState({
                name: res.name,
                duration: res.duration,
                date: moment(res.date).format(),
                calories: res.calories
            });
        } catch (e) {
            console.log(e);
            this.setState({
                error: e
            });
        }
    };

    handleAddExercise = async () => {
        if (this.state.edit) {
            // console.log("updating exercise");
            try {
                Alert.alert(
                    "Do you want to update this exercise?",
                    "",
                    [
                      { text: "OK", onPress: async () => {
                        let newDate = new Date();
                        this.setState({date: newDate});
                        const res = await updateExercise(
                            this.state.token,
                            this.state.exerciseId,
                            this.state.name,
                            this.state.duration,
                            this.state.date,
                            this.state.calories
                        );
                        // console.log(res);
                        this.setState({
                            name: "",
                            duration: 0,
                            date: "",
                            calories: 0,
                            edit: false,
                            exerciseId: 0
                        });
                        this.props.navigation.navigate("Home");
                        } },
                      { text: "CANCEL", onPress: ()=> this.props.navigation.navigate("AddExercise") }
                    ]
                  )
            } catch (e) {
                console.log(e);
                this.setState({
                    error: e
                });
            }
        } else {
            // console.log("adding exercise");
            try {
                Alert.alert(
                    "Do you want to add this exercise?",
                    "",
                    [
                      { text: "OK", onPress: async () => {
                        let newDate = new Date();
                        this.setState({date: newDate});
                        const res = await addExercise(
                            this.state.token,
                            this.state.name,
                            this.state.duration,
                            this.state.date,
                            this.state.calories
                        );
                        // console.log(res);
                        this.setState({
                            name: "",
                            duration: 0,
                            date: "",
                            calories: 0
                        });
                        this.props.navigation.navigate("Home");
                        } },
                      { text: "CANCEL", onPress: ()=> this.props.navigation.navigate("Exercises") }
                    ]
                  )
            } catch (e) {
                console.log(e);
                this.setState({
                    error: e
                });
            }
        }
    };

    clearFields = () => {
        this.setState({
            name: "",
            duration: 0,
            date: "",
            calories: 0,
            edit: false,
            exerciseId: 0
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    {this.state.edit ? "Edit activity" : "Add a new activity"}
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Exercise Name (running, strength training...)"
                    value={this.state.name}
                    onChangeText={name => this.setState({ name })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Calories burned (kcal)"
                    value={
                        this.state.edit ? this.state.calories.toString() : null
                    }
                    keyboardType={"phone-pad"}
                    onChangeText={calories => this.setState({ calories })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Duration (min)"
                    keyboardType={"phone-pad"}
                    value={
                        this.state.edit ? this.state.duration.toString() : null
                    }
                    onChangeText={duration => this.setState({ duration })}
                />
                <Button
                    onPress={this.handleAddExercise}
                    title="Add Exercise"
                />
                <Button
                    onPress={this.clearFields}
                    title="Reset"
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
