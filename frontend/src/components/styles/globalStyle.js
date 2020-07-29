import { createGlobalStyle} from "styled-components"
export const GlobalStyles = createGlobalStyle`
  body {
    background-image: url(${({ theme }) => theme.body});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    height: 120vh;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    color: ${({ theme }) => theme.text};
    font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
    transition: all 0.50s linear;
  }  `