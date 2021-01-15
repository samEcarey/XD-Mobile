import React from "react";
import styled from "styled-components/native";
export const StyledTick = styled.View`

margin:10px;
  background-color: white;
  height: 1px;
  width: 20px;
 
`;

export const StyledPillBox = styled.View`
  flex-direction: row;
  background-color:red;
  width:100%;
`;
export const StyledMain = styled.View`
  flex: 1;
  flex-direction: row;
  height:100%;
  background-color: #1c1c1c;
 

`;

//PILL STYLES
export const StyledPill = styled.View`
  display: flex;
 
  flex-direction:row;
  margin: 1%;
  padding: 2%;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.main};
`;

export const StyledInvisibleItem = styled.View`
  display: flex;
  margin: 1%;
  padding: 10px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;

StyledPill.defaultProps = {
  theme: {
    main: "orange",
  },
};

export const StyledTimeline = styled.SectionList`
  flex: 40;
  border-left-color:white;
  border-left-width:5px;
`;
export const StyledTimelineBar = styled.View`
  display: flex;
 
  height:${(props) => props.size.main};
 justify-content:space-around;

`;

StyledTimelineBar.defaultProps = {
  size: {
    main: "200px",
  },
};
