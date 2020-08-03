
import { createGlobalStyle } from 'styled-components';

const duration = '10s';
const textColor = 'rgba(255, 255, 255, 0.3)';
const backgroundColor = '#333';

export const ChromeStyle = createGlobalStyle`
  .node__header {
    background-color: ${backgroundColor} !important;
    text-align: center;
    margin: 0 auto;
    font-weight: bold;
  }

  .shine {
    background: #333 -webkit-gradient(linear, left top, right top, from(#333), to(#333), color-stop(0.5, #fff)) 0 0 no-repeat;
    background-size: 150px;
    /* color: ${textColor}; */
    background-clip: text;
    animation-name: shine;
    animation-duration: ${duration};
    animation-iteration-count: infinite;
    text-shadow: 0 0px 0px rgba(255, 255, 255, 0.5);
  }

  .chrome {
    background: #333 -webkit-gradient(linear, left top, right top, from(#333), to(#333), color-stop(0.5, #fff)) 0 0 no-repeat;
    background-image: -webkit-linear-gradient(-40deg, transparent 0%, transparent 40%, #fff 50%, transparent 60%, transparent 100%);
    background-size: 100px;
    color: ${textColor};
    background-clip: text;
    animation-name: shine;
    animation-duration: ${duration};
    animation-iteration-count: infinite;
    // animation-iteration-count: infinite;
    text-shadow: 0 0px 0px rgba(255, 255, 255, 0.5);

    animation: shine 10s infinite;
  }

  @keyframes shine {
    0% {
      background-position: top right;
      background-position: -100px;
    }
    60% {
      /* background-position: 100px; */
      /* background-position: top left; */
    }
    70% {
      /* background-position: 180px; */
    }
    80% {
      /* background-position: 240px; */
    }
    100% {
      background-position: 520px;
    }
  }

  .glow {
    color: #fff;
    text-align: center;
    animation: glow 1s ease-in-out infinite alternate;
  }

  @keyframes glow {
    from {
      text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
    }

    to {
      text-shadow: 0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4da6, 0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #ff4da6, 0 0 80px #ff4da6;
    }
  }


  .glowing-box {
    animation: glowing-box 1s infinite alternate;
  }

  @-webkit-keyframes glowing-box {
    from {
      box-shadow:
          0 0 50px #fff,
          -10px 0 80px #f0f,
          10px 0 80px #0ff;
    }

    to {
      box-shadow:
          10px 0 80px #0ff,
          -10px 0 80px #f0f,
          0 0 50px #fff;
    }
  }
`