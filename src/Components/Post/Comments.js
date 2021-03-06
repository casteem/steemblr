import React, { Component } from "react";
import Icon from "react-icons-kit";
import { ic_message } from "react-icons-kit/md/ic_message";
import Spinner from ".././Spinner";
import Comment from "./Comment";
import getContentReplies from "../.././Functions/getContentReplies";
import sendComment from "../.././Functions/sendComment";
import uuidv4 from "uuid/v4";
import delay from "../../Functions/delay";
import steemVote from "../.././Functions/steemVote";
import { hot } from "react-hot-loader";
import colors from "../../styles/colors";
import styled from "styled-components";
import Modal from "react-modal";
//REDUX
import store from "../../store";
import {
  postVoteToState,
  removeVoteFromState
} from "../../actions/stateActions";
const Title = styled.div`
  box-sizing: border-box;
  text-align: center;
  background-color: #fff;

  z-index: 9999;
  font-weight: 300;
  padding: 10px;
  border-bottom: 1px solid ${colors.borders.light};
`;
const Content = styled.div`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  padding-top: 20px;
  padding-bottom: 60px;
  padding-left: 15px;
  padding-right: 15px;
  background-color: #e1e2e1;
`;
const InputContainer = styled.div`
  box-sizing: border-box;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 5px;
  border-top: 1px solid ${colors.borders.light};
  width: 100%;
  min-height: 40px;
`;
const Input = styled.input`
  border: 0;
  outline: 0;
  width: 100%;
  top: 12px;
  left: 5px;
  background: rgba(255, 255, 255, 1);
  height: 30px;

  font-size: 16px;
  padding-left: 15px;
  z-index: 1000;

  &:focus {
    background: rgba(255, 255, 255, 1);
    transition: 0.2s;
  }
`;
const SendButton = styled.button`
  font-family: "Roboto", sans-serif;
  right: 0;
  bottom: 5px;
  font-weight: 300;
  font-size: 16px;
  background: transparent;
  outline: 0;
  border: 0;
  cursor: pointer;
`;
class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      comments: [],
      comment: "",
      votedComments: [],
      votesToPush: [],
      votesToRemove: [],
      isLoading: true,
      innerWidth: window.innerWidth
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSendComment = this.handleSendComment.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateComments = this.updateComments.bind(this);
    this.updateVotingState = this.updateVotingState.bind(this);
    this.handleVoting = this.handleVoting.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }
  async componentWillMount() {
    window.addEventListener("resize", this.updateDimensions);
    const apiCall = await getContentReplies(
      this.props.postAuthor,
      this.props.postPermlink
    );

    this.setState({
      comments: apiCall[0],
      open: true,
      votedComments: await store.getState().steemProfileVotes.votes,
      isLoading: false
    });
  }
  updateDimensions() {
    this.setState({
      innerWidth: window.innerWidth
    });
  }
  handleOpen = async () => {
    const apiCall = await getContentReplies(
      this.props.postAuthor,
      this.props.postPermlink
    );

    await this.setState({
      comments: apiCall[0],
      open: true
    });
  };

  handleClose = () => {
    this.state.votesToPush.map(vote => {
      this.updateVotingState(vote, true);
      return void 0;
    });

    this.state.votesToRemove.map(vote => {
      return this.updateVotingState(vote, false);
    });
    this.setState({ open: false });
  };

  async updateComments() {
    await delay(3000);
    const apiCall = await getContentReplies(
      this.props.postAuthor,
      this.props.postPermlink
    );
    this.setState({
      comments: apiCall[0]
    });
  }
  async handleSendComment() {
    const login = store.getState().login.status;
    if (login) {
      if (this.state.comment === "") {
        alert("Comment can't be empty");
      } else {
        sendComment(
          this.props.postAuthor,
          this.props.postPermlink,
          this.props.username,
          this.state.comment,
          uuidv4()
        );
        this.setState({
          comment: ""
        });
        this.updateComments();
      }
    } else {
      alert("You have to login first");
    }
  }
  handleInputChange(e) {
    const target = e.target;
    let value = e.target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async handleVoting(username, author, permlink, votePercent) {
    const login = store.getState().login.status;
    if (login) {
      const votePower = store.getState().votePower.power;
      if (votePercent === 0 || votePercent === undefined) {
        await steemVote(username, author, permlink, votePower);
        const state = this.state.votedComments;
        const newItem = [
          {
            permlink: author + "/" + permlink,
            percent: votePower
          }
        ];
        let newState = [];
        await this.setState({
          votedComments: newState.concat(state, newItem),

          votesToPush: this.state.votesToPush.concat(newItem)
        });
      } else if (votePercent > 0) {
        await steemVote(username, author, permlink, 0);

        const state = this.state.votedComments;
        const fullPermlink = author + "/" + permlink;
        let newState = state.filter(item => {
          return item.permlink !== fullPermlink;
        });
        const newItem = [
          {
            permlink: fullPermlink,
            percent: votePercent
          }
        ];
        this.setState({
          votedComments: newState,
          votesToRemove: this.state.votesToRemove.concat(newItem)
        });
      }
    } else {
      alert("You have to login first");
    }
  }
  async updateVotingState(props, action) {
    if (action === true) {
      store.dispatch(postVoteToState(props));
    } else if (action === false) {
      store.dispatch(removeVoteFromState(props));
    }
  }
  checkVoteStatus(props) {
    const find = this.state.votedComments.find(o => o.permlink === props);

    if (find) {
      return {
        status: true,
        percent: find.percent
      };
    } else {
      return {
        status: false,
        percent: 0
      };
    }
  }

  render() {
    const modalStyle = {
      content: {
        left: "20px",
        overflowY: "hidden",
        overflowX: "hidden",
        display: "flex",
        bottom: "none",
        flexDirection: "column",
        padding: "0",
        maxHeight: "60vh",
        width:
          this.state.innerWidth > 768
            ? "40vw"
            : this.state.innerWidth < 768 && this.state.innerWidth > 425
              ? "60vw"
              : "85vw"
      },
      overlay: {
        backgroundColor: "transparent"
      }
    };

    return (
      <span>
        <Icon
          icon={ic_message}
          size={20}
          style={{ cursor: "pointer" }}
          onClick={this.handleOpen}
        />
        <Modal
          title={
            this.props.likesNumber +
            " Likes " +
            this.state.comments.length +
            " Comments"
          }
          modal={false}
          isOpen={this.state.open}
          onRequestClose={this.handleClose}
          style={modalStyle}
        >
          <Title>
            {this.props.likesNumber +
              " Likes " +
              this.state.comments.length +
              " Comments"}
          </Title>

          <Content>
            {this.state.comments.length === 0 &&
            this.state.isLoading === false ? (
              <p>No comments yet :(</p>
            ) : (
              void 0
            )}
            {this.state.isLoading ? <Spinner marginTop="2" /> : void 0}
            {this.state.comments.map(comment => {
              return (
                <Comment
                  comment={comment}
                  author={comment.author}
                  body={comment.body}
                  key={comment.id}
                  handleVoting={this.handleVoting}
                  username={this.props.username}
                  permlink={comment.permlink}
                  fullPermlink={comment.author + "/" + comment.permlink}
                  voteStatus={this.checkVoteStatus(
                    comment.author + "/" + comment.permlink
                  )}
                />
              );
            })}
          </Content>
          <InputContainer>
            <Input
              placeholder="Send something"
              name="comment"
              type="text"
              value={this.state.comment}
              onChange={this.handleInputChange}
            />
            {this.state.comment.length > 1 ? (
              <SendButton onClick={this.handleSendComment}>Reply</SendButton>
            ) : (
              <SendButton disabled>Reply</SendButton>
            )}
          </InputContainer>
        </Modal>
      </span>
    );
  }
}

export default hot(module)(Comments);
