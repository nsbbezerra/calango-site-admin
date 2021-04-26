import styled from "@emotion/styled";
import { theme } from "@chakra-ui/react";

export const InputFile = styled.label`
  width: ${(props) => props.lar || 0}px;
  height: ${(props) => props.alt || 0}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 3px;
  font-size: 15px;
  border: 1px dashed #210024;
  text-align: center;
  transition: all 0.3s;
  &:hover {
    border: 2px dashed #210024;
  }
`;

export const InputFileFixed = styled.label`
  width: 100%;
  height: 20vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  cursor: ${(props) => (props.disabled === true ? "not-allowed" : "pointer")};
  transition: all 0.3s;
  color: ${(props) => (props.disabled === true ? theme.colors.gray[500] : "")};
  border-radius: 3px;
  font-size: 15px;
  border: 1px dashed
    ${(props) => (props.disabled === true ? "#887789" : "#210024")};
  text-align: center;
  transition: all 0.3s;
  &:hover {
    border: ${(props) => (props.disabled === true ? "" : "2px dashed #210024")};
  }
`;

export const File = styled.input`
  display: none;
`;
