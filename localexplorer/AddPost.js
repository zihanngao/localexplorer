import React, { Component } from "react";
import { View, Text, Button, Alert, StyleSheet, TextInput } from "react-native";
import moment from "moment/moment.js";
import { addPost, getPost, updatePost } from "./DataFlow";

export default class AddPost extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            token: "",
            subject: "",
            content: "",
            date: moment().format(),
            error: "",
            edit: false,
            postId: 0
        };
    }

    componentDidMount() {
        const edit = this.props.route.params.edit;
        let token = "";
        let postId = 0;
        if (edit) {
            token = this.props.route.params.token;
            postId = this.props.route.params.id;
            this.loadPost(token, postId);
            console.log(edit);
            this.setState({
                token: token,
                edit: edit,
                postId: postId
            });
        } else {
            token = this.props.route.params.token;
            console.log("token: ", token);
            this.setState({
                token: token,
                edit: edit,
            });
        }
    }

    loadPost = async (token, postId) => {
        try {
            let res = await getPost(token, postId);
            console.log(res);
            this.setState({
                subject: res.subject,
                content: res.content,
                date: moment(res.date).format()
            });
        } catch (e) {
            console.log(e);
            this.setState({
                error: e
            });
        }
    };

    handleAddPost = async () => {
        if (this.state.edit) {
            console.log("updating post");
            try {
                Alert.alert(
                    "Do you want to update this post?",
                    "",
                    [
                        {
                            text: "OK", onPress: async () => {
                                let newDate = new Date();
                                this.setState({ date: newDate });
                                const res = await updatePost(
                                    this.state.token,
                                    this.state.postId,
                                    this.state.subject,
                                    this.state.content,
                                    this.state.date,
                                );
                                console.log(res);
                                this.setState({
                                    subject: "",
                                    content: "",
                                    date: "",
                                    edit: false,
                                    postId: 0
                                });
                                this.props.navigation.navigate("Home");
                            }
                        },
                        { text: "CANCEL", onPress: () => this.props.navigation.navigate("AddPost") }
                    ]
                )
            } catch (e) {
                console.log(e);
                this.setState({
                    error: e
                });
            }
        } else {
            console.log("adding post, token:", this.state.token);
            try {
                Alert.alert(
                    "Do you want to add this post?",
                    "",
                    [
                        {
                            text: "OK", onPress: async () => {
                                let newDate = new Date();
                                this.setState({ date: newDate });
                                const res = await addPost(
                                    this.state.token,
                                    this.state.subject,
                                    this.state.content,
                                    this.state.date,
                                );
                                console.log("Add post response:", res);
                                this.setState({
                                    subject: "",
                                    content: "",
                                    date: ""
                                });
                                this.props.navigation.navigate("Home");
                            }
                        },
                        { text: "CANCEL", onPress: () => this.props.navigation.navigate("Posts") }
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
            subject: "",
            content: "",
            date: "",
            edit: false,
            postId: 0
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    {this.state.edit ? "Edit posy" : "Add a new post"}
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Subject of your post"
                    value={this.state.subject}
                    onChangeText={subject => this.setState({ subject })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Content of your post"
                    value={
                        this.state.content
                    }
                    onChangeText={content => this.setState({ content })}
                />
                <Button
                    onPress={this.handleAddPost}
                    title="Add Post"
                />
                <Button
                    onPress={this.clearFields}
                    title="Reset"
                />
                {this.state.error ? <Text style={{ color: "red" }}>{this.state.error}</Text> : null}
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
