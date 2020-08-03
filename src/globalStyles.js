import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 14px;
  }

  .sticky__canvas {
    display: inline-block;
    font-family: 'Work Sans', sans-serif;
    border: 1px solid black;
    user-select: none;
    cursor: default;
  }

  .svg-content {
    background-color: #fff9da;
    background-color: #CCCCCC75;
    background-image: linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px);
    background-size: 50px 50px;
  }

  .sticky-node-html {
    min-width: 60px;
    overflow: visible;

    & > * {
      width: fit-content;
      max-width: fit-content;
      min-width: 60px;
    }


    body,
    > article {
      overflow: visible;
      background-color: red;
      border: 2px solid black;
      border-radius: 16px;
      margin: 0;
      min-width: 100%;
      min-height: 100%;
      box-sizing: border-box;
    }

    header {
      padding: 0.2em 0.6em;
      color: 'white';
      font-size: 1rem;
      border-bottom: 2px solid black;
      text-align: center;
      background-color: #c1c1c1;
      border-top-left-radius: 14px;
      border-top-right-radius: 14px;
      align-items: center;
      justify-content: center;
      display: flex;

      span {
        margin: 0 auto;
      }
    }

    section {
      margin: 0px 0px 10px;
      margin: 0;
    }

    input,
    select {
      width: 100%;
      height: 20px;
      font-size: 12px;
      box-sizing: border-box;
      font-size: 1rem;
    }

    input {
      padding: 0.6rem 0.2rem;
    }

    label {
      display: inline-block;
      font-size: 0.9rem;
      padding-top: 0.4rem;
      padding-bottom: 0.2rem;
    }
  }

  .sticky-node-section {
    display: flex;

    svg {
      width: 14px;
      height: 14px;
      overflow: visible;
      margin: auto;
    }

    aside {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 40px;
      min-width: 14px;
      margin: 10px 0;

      circle {
        transform: translate(7px, 7px);
      }

      &.left {
        position: relative;
        right: 7px;
      }

      &.right {
        position: relative;
        left: 7px;
      }
    }

    article {
      flex: 1;
      padding: 0.4rem 0.2rem;
    }

  }
`;

export const DefaultTheme = createGlobalStyle`
`