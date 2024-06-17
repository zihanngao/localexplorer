import React, { Component } from "react";
import { Text, View, Button, StyleSheet, Alert, TextInput } from "react-native";
import moment from "moment/moment.js";
import styled from 'styled-components/native';

import { deletePost, likePost, addComment, getPost } from "./DataFlow";

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            postId: 0,
            subject: "",
            content: "",
            likes: 0,
            comment: "",
            commentsVisible: false,
            date: moment().format(),
            comments: [],
            username: "",
        };
    }

    componentDidMount() {
        console.log("post: " + this.props.postItem.date);
        const postId = this.props.postItem.id;
        const token = this.props.token;
        this.setState({
            token: token,
            postId: postId,
            subject: this.props.postItem.subject,
            username: this.props.postItem.username,
            content: this.props.postItem.content,
            date: moment(this.props.postItem.date).format(),
            likes: this.props.postItem.likes.length,
            comments: this.props.postItem.comments,
        });
    }

    handleEdit = id => {
        console.log("handleedit");
        this.props.navigation.navigate("AddPost", {
            id: this.state.postId,
            subject: this.state.subject,
            content: this.state.content,
            date: this.state.date, 
            edit: true,
            token: this.state.token
        });
    };

    handleDelete = async id => {
        console.log("deleting post");
        console.log("deleting post: " + this.state.token);
        console.log("deleting post: " + this.props.postItem.id);
        try {
            Alert.alert(
                "Do you want to delete this post?",
                "",
                [
                  { text: "OK", onPress: async () => {
                      await deletePost(this.state.token, this.props.postItem.id);
                      this.props.handleDeleteList(this.props.postItem);
                    } },
                  { text: "CANCEL", onPress: ()=> this.props.navigation.navigate("Posts") }
                ]
              );
        } catch (e) {
            console.log(e);
            this.setState({
                error: e
            });
        }
    };

    handleLike = async () => {
        try {
            await likePost(this.state.token, this.state.postId);
            const updatedPost = await getPost(this.state.token, this.state.postId);
            console.log("Updated post after like:", updatedPost);
            this.setState({
                likes: updatedPost.likes.length
            });
            this.props.updatePostState(updatedPost);
            alert("Liked!");
        } catch (e) {
            console.log("Error liking post:", e);
        }
    };

    handleAddComment = async () => {
        try {
            await addComment(this.state.token, this.state.postId, this.state.comment);
            const updatedPost = await getPost(this.state.token, this.state.postId);
            console.log("Updated post after comment:", updatedPost);
            this.setState({
                comment: "",
                comments: updatedPost.comments
            });
            this.props.updatePostState(updatedPost);
            alert("Comment added!");
        } catch (e) {
            console.log("Error adding comment:", e);
        }
    };

    toggleComments = () => {
        this.setState(prevState => ({ commentsVisible: !prevState.commentsVisible }));
    };

    render() {
        const { postItem } = this.props;
        console.log("postItem name: " + postItem.username);
        console.log("this.props.username: " + this.props.username);
        return (
            <View style={styles.container}>
                <ButtonContainer>
                    {postItem.username === this.props.username && (
                        <>
                            <StyledButton onPress={() => this.handleEdit(postItem.id)}>
                                <ButtonText>Edit</ButtonText>
                            </StyledButton>
                            <StyledButton onPress={() => this.handleDelete(postItem.id)}>
                                <ButtonText>Delete</ButtonText>
                            </StyledButton>
                        </>
                    )}
                </ButtonContainer>
                <View style={styles.card}>
                    <Text>Username: {postItem.username}</Text>
                    <Text>Subject: {postItem.subject.toUpperCase()}</Text>
                    <Text>Content: {postItem.content}</Text>
                    <Text>Date: {moment(postItem.date).utcOffset('-10:00').format('YYYY-MM-DD, HH:mm:ss')}</Text>
                </View>
                <View style={styles.footer}>
                    <Text>Likes: {this.state.likes}</Text>
                    <Text>Comments: {this.state.comments.length}</Text>
                </View>
                <ButtonContainer>
                    <StyledButton onPress={this.handleLike}>
                        <ButtonText>Like</ButtonText>
                    </StyledButton>
                    <StyledButton onPress={this.toggleComments}>
                        <ButtonText>Comment</ButtonText>
                    </StyledButton>
                </ButtonContainer>
                {this.state.commentsVisible && (
                    <CommentsSection>
                        {this.state.comments.map((item, index) => (
                            <Comment key={index}>
                                <CommentText>{item.username}: {item.content} at {new Date(item.date).toLocaleString()}</CommentText>
                            </Comment>
                        ))}
                        <CommentInput
                            placeholder="Add a comment"
                            value={this.state.comment}
                            onChangeText={comment => this.setState({ comment })}
                        />
                        <StyledButton onPress={this.handleAddComment}>
                            <ButtonText>Submit Comment</ButtonText>
                        </StyledButton>
                    </CommentsSection>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 30,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "skyblue",
        width: "100%",
        padding: 15,
        borderRadius: 10,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
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

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: 10px;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #007BFF;
  padding: 10px;
  border-radius: 5px;
  margin-horizontal: 5px;
`;

const ButtonText = styled.Text`
  color: white;
`;

const CommentsSection = styled.View`
  margin-top: 10px;
`;

const Comment = styled.View`
  margin-bottom: 5px;
`;

const CommentText = styled.Text`
  font-size: 14px;
`;

const CommentInput = styled.TextInput`
  border-width: 1px;
  padding: 8px;
  height: 40px;
  margin-vertical: 10px;
`;

export default Post;
