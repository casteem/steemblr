import styled from "styled-components";
import colors from "../../styles/colors";
export const AvatarStyles = {
  borderRadius: "0%"
};
export const StyledDiv = styled.div`
  background-color: white;
  width: 25vw;
  margin-bottom: 20px;
  padding: 0px !important;
  border-radius: 1%;
  text-align: left;
`;

export const buttonStyles = {
  fontSize: "10pt",
  position: "absolute",
  top: "0.5vw",
  right: "0vw"
};

export const cardHeaderStyle = {
  paddingRight: "0px"
};
export const cardActionStyles = {
  textAlign: "right",
  paddingTop: "0px",
  paddingBottom: "0px",
  paddingRight: "0px",
  paddingLeft: "8px",
  zIndex: 1000,

  svg: {
    paddingRight: "5px !important",
    cursor: "pointer"
  }
};
export const cardTextTagStyles = {
  paddingLeft: "8px",
  zIndex: 1000
};
export const sbdCounter = {
  float: "left",
  textAlign: "left"
};
export const tagStyles = {
  cursor: "pointer",
  paddingRight: "5px",
  color: colors.tags.normal,
  overflowWrap: "break-word"
};