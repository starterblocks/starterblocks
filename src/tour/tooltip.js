import styled from "styled-components";

export default styled.span`
  position: relative;
  color: #1c8f9e;
  cursor: pointer;
  
  &:after {
    content: attr(data-tooltip);
    position: absolute;
    transition: .3s;
    background-color: #1c8f9e;
    color: white;
    left: 0;
    bottom: 100%;
    box-shadow: 0 .5em 3em rgba(255,255,255,.3);
    opacity: 0;
    padding: .2em .5em;
    border-radius: 2px;
    font-size: .7em;
  }
  
  &:hover:after {
    opacity: 1;
  }
`;
