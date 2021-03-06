import React, { Component } from "react";
import Text from "../NewPost/Text";
import Photo from "../NewPost/Photo";
import Quote from "../NewPost/Quote";
import Audio from "../NewPost/Audio";
import Video from "../NewPost/Video";
import styled from "styled-components";

import Modal from "react-modal";
import colors from "../styles/colors";

import Icon from "react-icons-kit";
import { ic_create } from "react-icons-kit/md/ic_create";
import { ic_camera_alt } from "react-icons-kit/md/ic_camera_alt";

import { ic_format_quote } from "react-icons-kit/md/ic_format_quote";
import { ic_format_align_left } from "react-icons-kit/md/ic_format_align_left";
import { ic_music_note } from "react-icons-kit/md/ic_music_note";
import { ic_videocam } from "react-icons-kit/md/ic_videocam";

const modalStyle = {
  postion: "fixed",
  height: "100%",
  overlay: {
    backgroundColor: "rgba(28, 49, 58, 0.95)"
  },
  content: {
    top: "30%",
    bottom: "none",
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "0"
  }
};

const modalStyleMobile = {
  postion: "fixed",
  overlay: {
    backgroundColor: "rgba(28, 49, 58, 0.95)"
  },
  content: {
    bottom: "none",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "0"
  }
};

const IconDiv = styled.div`
  svg: {
    margin-right: 0px;
  }
  span: {
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  color: white;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  height: 100px;
  width: 100px;
  border-radius: 20px;
  margin: 20px;
  transition: 0.5s;
  &:hover {
    transform: translate3d(0px, 4px, 0px);
    transition: 0.5s;
  }
  @media (max-width: 768px) {
    margin: 10px;
    width: 90px;
    height: 90px;
    border-radius: 10px;
  }
  @media (max-width: 425px) {
    margin: 10px;
    width: 70px;
    height: 70px;
    border-radius: 10px;
  }
`;

export default class AddNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      text: false,
      photo: false,
      audio: false,
      quote: false,
      video: false
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleNewModal = this.handleNewModal.bind(this);
    this.unMountChildren = this.unMountChildren.bind(this);
  }
  handleOpen() {
    this.setState({
      open: true,
      text: false,
      photo: false,
      audio: false,
      video: false
    });
  }
  handleClose() {
    this.setState({
      open: false
    });
  }
  handleNewModal(name) {
    this.setState({
      open: false,
      [name]: true
    });
  }
  unMountChildren(name) {
    this.setState({
      [name]: false
    });
  }
  render() {
    return (
      <div>
        {window.innerWidth > 425 ? (
          <Icon
            icon={ic_create}
            className="dashboardIcon"
            size={24}
            onClick={this.handleOpen}
          />
        ) : (
          <span style={{ width: "100%" }} onClick={this.handleOpen}>
            Create new post
          </span>
        )}

        {this.state.text === true ? (
          <Text isOpen={true} unMountChildren={this.unMountChildren} />
        ) : (
          void 0
        )}
        {this.state.photo === true ? (
          <Photo isOpen={true} unMountChildren={this.unMountChildren} />
        ) : (
          void 0
        )}
        {this.state.quote === true ? (
          <Quote isOpen={true} unMountChildren={this.unMountChildren} />
        ) : (
          void 0
        )}
        {this.state.audio === true ? (
          <Audio isOpen={true} unMountChildren={this.unMountChildren} />
        ) : (
          void 0
        )}
        {this.state.video === true ? (
          <Video isOpen={true} unMountChildren={this.unMountChildren} />
        ) : (
          void 0
        )}
        <Modal
          isOpen={this.state.open}
          onRequestClose={this.handleClose}
          style={window.innerWidth > 425 ? modalStyle : modalStyleMobile}
        >
          <IconDiv
            style={{ backgroundColor: colors.postTypes.text }}
            onClick={() => this.handleNewModal("text")}
          >
            <Icon icon={ic_format_align_left} size={50} />
            <span>Text</span>
          </IconDiv>

          <IconDiv
            style={{ backgroundColor: colors.postTypes.photo }}
            onClick={() => this.handleNewModal("photo")}
          >
            <Icon icon={ic_camera_alt} size={50} />
            <span>Photo</span>
          </IconDiv>
          <IconDiv
            style={{ backgroundColor: colors.postTypes.quote }}
            onClick={() => this.handleNewModal("quote")}
          >
            <Icon icon={ic_format_quote} size={50} />
            <span>Quote</span>
          </IconDiv>

          <IconDiv
            style={{ backgroundColor: colors.postTypes.audio }}
            onClick={() => this.handleNewModal("audio")}
          >
            <Icon icon={ic_music_note} size={50} />
            <span>Audio</span>
          </IconDiv>
          <IconDiv
            style={{ backgroundColor: colors.postTypes.video }}
            onClick={() => this.handleNewModal("video")}
          >
            <Icon icon={ic_videocam} size={50} />
            <span>Video</span>
          </IconDiv>
        </Modal>
      </div>
    );
  }
}
