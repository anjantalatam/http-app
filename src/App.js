import React, { Component } from "react";
import "./App.css";
import axios from "axios";

const apiEndpoint = "https://jsonplaceholder.typicode.com/posts";
class App extends Component {
  state = {
    posts: [],
  };

  async componentDidMount() {
    const { data: posts } = await axios.get(apiEndpoint);
    this.setState({ posts });
  }

  handleAdd = async () => {
    const obj = { title: "a", body: "b" };
    const { data: post } = await axios.post(apiEndpoint, obj);
    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  handleUpdate = async (post) => {
    post.title = "UPDATED";

    await axios.put(`${apiEndpoint}/${post.id}`, post);
    // to update the complete post use put
    // to update a field use patcha
    // await axios.put(`${apiEndpoint}/${post.id}`, {title:post.title})
    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = post;
    this.setState({ posts });
  };

  handleDelete = async (post) => {
    const originalState = this.state.posts;
    const posts = this.state.posts.filter((p) => p.id !== post.id);
    this.setState({ posts });

    try {
      // await axios.delete(apiEndpoint + "/" + post.id);

      // simulate expected error
      await axios.delete(apiEndpoint + "/" + "invalidId");

      // simulate unexpected erroe
      await axios.delete("s" + apiEndpoint + "/" + post.id);
    } catch (ex) {
      // Expected Error => 404 (Not Found), 400 ( Bad request )
      // Ex: 404 => Deleting already deleted Post, 400 => Submitting Form with invalid data

      // Unexpected Error => Network down, server down, db down, bug

      // ex.request => set to value if submitted a succesful request to server else to null
      // ex.response => set to null if there is an issue from code/server
      if (ex.response && ex.response.status === 404) {
        alert("This post has already been deleted!");
      } else {
        // This is log is not displayed to user but stored somewhere for debugging
        console.log("Logging Error", ex);
        alert("An unexpected error occured");
      }
      this.setState({ posts: originalState });
    }
  };

  render() {
    return (
      <React.Fragment>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
