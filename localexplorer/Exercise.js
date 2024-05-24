import React, { Component } from "react";
import { Text, View, Button, StyleSheet, Alert } from "react-native";
import moment from "moment/moment.js";

import { deleteExercise } from "./DataFlow";

class Exercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            exerciseId: 0,
            name: "",
            calories: 0,
            duration: 0,
            date: moment().format()
        };
    }

    componentDidMount() {
        console.log("exercise: " + this.props.exerciseItem.date)
        const exerciseId = this.props.exerciseItem.id;
        const token = this.props.token;
        this.setState({
            token: token,
            exerciseId: exerciseId,
            name: this.props.exerciseItem.name,
            calories: this.props.exerciseItem.calories,
            duration: this.props.exerciseItem.duration,
            date: moment(this.props.exerciseItem.date).format()
        });
    }

    handleEdit = id => {
        console.log("handleedit");
        this.props.navigation.navigate("AddExercise", {
            id: this.state.exerciseId,
            name: this.state.name,
            calories: this.state.calories,
            duration: this.state.duration,
            date: this.state.date, 
            edit: true,
            token: this.state.token
        });
    };

    handleDelete = async id => {
        console.log("deleting exercise");
        console.log("deleting exercise: " + this.state.token);
        console.log("deleting exercise: " + this.props.exerciseItem.id)
        try {
            Alert.alert(
                "Do you want to delete this exercise?",
                "",
                [
                  { text: "OK", onPress: async res => {
                      await deleteExercise(this.state.token, this.props.exerciseItem.id),
                      this.props.handleDeleteList(this.props.exerciseItem)
                    } },
                  { text: "CANCEL", onPress: ()=> this.props.navigation.navigate("Exercises") }
                ]
              )
            // let res = await deleteExercise(this.state.token, this.state.exerciseId);
            // console.log(res);
        } catch (e) {
            console.log(e);
            this.setState({
                error: e
            });
        }
    };

    render() {
        const exerciseItem = this.props.exerciseItem
        // console.log("exerciseItemmmmm: " + JSON.stringify(exerciseItem.id))
        return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text>
                        Exercise Name: {exerciseItem.name.toUpperCase()}
                    </Text>
                    <Text>
                        Calories: {exerciseItem.calories} cals
                    </Text>
                    <Text>
                        Duration: {exerciseItem.duration} mins
                    </Text>
                    <Text>
                        Date: {moment(exerciseItem.date).utcOffset('-10:00').format('YYYY-MM-DD, HH:mm:ss')}
                    </Text>
                </View>
                <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            alignSelf: "baseline",
                            alignItems: "center",
                        }}>
                        <Button
                            onPress={() => this.handleDelete(exerciseItem.id)}
                            title="Delete"
                        />
                        <Button
                            onPress={() => this.handleEdit(exerciseItem.id)}
                            title="Edit"
                        />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   justifyContent: "flex-start",
      marginHorizontal: 30,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
    //   backgroundColor: "grey"
    },
    card: {
        backgroundColor: "skyblue",
        width: "100%"
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

export default Exercise;
