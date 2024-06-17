import React from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";
import Post from "./Post";
import { getPosts } from "./DataFlow";

class PostsView extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      token: "",
      posts: [],
      error: "",
    };
  }

  componentDidMount() {
    const { username, token } = this.props.setAccessToken;
    console.log("Post: " + JSON.stringify(this.props.setAccessToken));
    console.log("token and username: " + token, username);

    this.setState({ token }, () => {
      this.loadPosts(token);
    });

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      Alert.alert('Refreshed');
      this.loadPosts(this.state.token);
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  loadPosts = async token => {
    console.log("loading posts");
    try {
      let res = await getPosts(token);
      console.log("getPosts response:", JSON.stringify(res));

      if (Array.isArray(res)) {
        this.setState({ posts: res }, () => {
          console.log("posts state set to:", this.state.posts);
        });
      } else {
        console.log("Invalid response format:", res);
        this.setState({ posts: [] }, () => {
          console.log("posts state set to an empty array due to invalid format");
        });
      }
    } catch (e) {
      console.log(e);
      const errorMessage = e && e.message ? e.message : (e ? e.toString() : "Unknown error");
      this.setState({
        error: errorMessage,
        posts: []
      }, () => {
        console.log("posts state set to an empty array due to error:", errorMessage);
      });
    }
  };

  handleEdit = () => {
    console.log("handleedit");
    console.log("Posts token: ", this.state.token);
    this.props.navigation.navigate("AddPost", {
      edit: false,
      token: this.state.token
    });
  };

  handleDelete = (_item) => {
    this.setState({
      posts: this.state.posts.filter(item => item.id !== _item.id)
    });
  };

  updatePostState = (updatedPost) => {
    console.log("Updating post state:", updatedPost);
    this.setState(prevState => {
      const updatedPosts = prevState.posts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      );
      return { posts: updatedPosts };
    }, () => {
      console.log("Updated posts state:", this.state.posts);
    });
  };

  render() {
    console.log("this.state.token", this.state.token);
    console.log("this.state.posts.length", this.state.posts.length);
    return (
      <View key={this.state.uniqueValue}>
        {this.state.posts.length === 0 && (
          <View>
            <Text style={styles.title}>
              No activities. Add some posts to see details.
            </Text>
          </View>
        )}
        <Button
          onPress={() => this.handleEdit()}
          title="Add Post"
        />
        {this.state.posts.length !== 0 && (
          <View>
            <Text 
              style={{
                textAlign: "left",
                marginVertical: 10,
                marginLeft: 30
              }}>
              Your Posts
            </Text>
          </View>
        )}
        <FlatList
          data={this.state.posts}
          renderItem={({ item }) => (
            <View>
              <Post
                postItem={item}
                token={this.state.token}
                navigation={this.props.navigation}
                handleDeleteList={this.handleDelete}
                updatePostState={this.updatePostState}
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

export default PostsView;
