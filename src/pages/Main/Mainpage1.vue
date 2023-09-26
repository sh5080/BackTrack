<template>
  <div class="main-body">
    <h1 class="main-title">원하는 코드대로 반주를 생성해보세요</h1>
    <img
      src="https://assets-global.website-files.com/63285b1f388b5b69a1955703/646f929cea5db1c5a85a7ce8_Ellipse%2011.svg"
      loading="eager"
      style="
        transform: translate3d(116px, 323.456px, 0px) scale3d(1, 1, 1)
          rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
        transform-style: preserve-3d;
        will-change: transform;
      "
      data-w-id="22a479fd-9e6f-00c3-a3dc-9cf6bd805a6a"
      alt=""
      class="coso_blur3_right"
    />
    <img
      src="https://assets-global.website-files.com/63285b1f388b5b69a1955703/646f925b0ea32d4307183a6a_Ellipse%2010.svg"
      loading="eager"
      style="
        transform: translate3d(101.029px, 10.715px, 0px) scale3d(1, 1, 1)
          rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
        transform-style: preserve-3d;
        will-change: transform;
      "
      data-w-id="2014c99e-df53-a3ef-af34-9905c649e789"
      alt=""
      class="coso_blur2_right"
    />
    <img
      src="https://assets-global.website-files.com/63285b1f388b5b69a1955703/646f929eed5b6f52230a386d_Ellipse%2012.svg"
      loading="eager"
      style="
        transform: translate3d(-12.614px, 83.3182px, 0px) scale3d(1, 1, 1)
          rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
        transform-style: preserve-3d;
        will-change: transform;
      "
      data-w-id="2014c99e-df53-a3ef-af34-9905c649e78a"
      alt=""
      class="coso_blur1_right"
    />
    <img
      src="https://assets-global.website-files.com/63285b1f388b5b69a1955703/646f929cea5db1c5a85a7ce8_Ellipse%2011.svg"
      loading="eager"
      style="
        transform: translate3d(-3.99976px, 0.00876px, 0px) scale3d(1, 1, 1)
          rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
        transform-style: preserve-3d;
        will-change: transform;
      "
      data-w-id="2014c99e-df53-a3ef-af34-9905c649e788"
      alt=""
      class="coso_blur3_left"
    />
    <img
      src="https://assets-global.website-files.com/63285b1f388b5b69a1955703/646f925b0ea32d4307183a6a_Ellipse%2010.svg"
      loading="eager"
      style="
        transform: translate3d(-91.1283px, 590.684px, 0px) scale3d(1, 1, 1)
          rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
        transform-style: preserve-3d;
        will-change: transform;
      "
      data-w-id="7f95b65e-6828-810e-f998-cfe96d6d91ac"
      alt=""
      class="coso_blur2_left"
    />
    <img
      src="https://assets-global.website-files.com/63285b1f388b5b69a1955703/646f929eed5b6f52230a386d_Ellipse%2012.svg"
      loading="eager"
      style="
        transform: translate3d(115.88px, -492.279px, 0px) scale3d(1, 1, 1)
          rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
        transform-style: preserve-3d;
        will-change: transform;
      "
      data-w-id="3a8bf3e0-3079-a4e4-fb61-204052674644"
      alt=""
      class="coso_blur1_left"
    />
  </div>
</template>

<script>
export default {
  // 컴포넌트 로직이나 데이터를 추가할 수 있습니다.
};
</script>

<style scoped>
.main-title {
  color: #1d1d22;
  font-size: 10rem;
  line-height: 10rem;

  z-index: 999;
  /* width: 490px;
  max-width: 490px; */
  text-align: center;

  margin-left: 50px;
  margin-right: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.coso_blur1_right {
  animation: moveImage1Right 3s infinite alternate;
  margin-top: 300px;
}

.coso_blur2_right {
  /* 두 번째 이미지 애니메이션 스타일 */
  animation: moveImage2Right 8s infinite alternate;
}
.coso_blur3_right {
  animation: moveImage3Right 3s infinite alternate;
  margin-top: 700px;
}

.coso_blur1_left {
  /* 두 번째 이미지 애니메이션 스타일 */
  animation: moveImage1Left 3s infinite alternate;
}
.coso_blur2_left {
  /* 두 번째 이미지 애니메이션 스타일 */
  animation: moveImage2Left 13s infinite alternate;
  margin-top: 700px;
}
.coso_blur3_left {
  /* 두 번째 이미지 애니메이션 스타일 */
  animation: moveImage3Left 15s infinite alternate;
}

@keyframes moveImage1Right {
  0% {
    transform: translate3d(116px, 323.456px, 0px) scale3d(1, 1, 1) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  }
  50% {
    transform: translate3d(160px, 400px, 0px) scale3d(1.2, 1.2, 1.2)
      rotateX(10deg) rotateY(10deg) rotateZ(10deg) skew(10deg, 10deg);
  }
  100% {
    transform: translate3d(200px, 480px, 0px) scale3d(1.5, 1.5, 1.5)
      rotateX(20deg) rotateY(20deg) rotateZ(20deg) skew(20deg, 20deg);
  }
}

@keyframes moveImage2Right {
  0% {
    transform: translate3d(101.029px, 10.715px, 0px) scale3d(1, 1, 1)
      rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  }
  50% {
    transform: translate3d(200px, 150px, 0px) scale3d(1.3, 1.3, 1.3)
      rotateX(15deg) rotateY(15deg) rotateZ(15deg) skew(15deg, 15deg);
  }
  100% {
    transform: translate3d(300px, 200px, 0px) scale3d(1.5, 1.5, 1.5)
      rotateX(45deg) rotateY(45deg) rotateZ(45deg) skew(20deg, 20deg);
  }
}

@keyframes moveImage3Right {
  0% {
    transform: translate3d(-12.614px, 83.3182px, 0px) scale3d(1, 1, 1)
      rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  }
  50% {
    transform: translate3d(18px, 100px, 0px) scale3d(1.1, 1.1, 1.1)
      rotateX(5deg) rotateY(5deg) rotateZ(5deg) skew(5deg, 5deg);
  }
  100% {
    transform: translate3d(50px, 120px, 0px) scale3d(1, 1, 1) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  }
}

@keyframes moveImage1Left {
  0% {
    transform: translate3d(-3.99976px, 0.00876px, 0px) scale3d(1, 1, 1)
      rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  }
  50% {
    transform: translate3d(-12px, -15px, 0px) scale3d(0.9, 0.9, 0.9)
      rotateX(-5deg) rotateY(-5deg) rotateZ(-5deg) skew(-5deg, -5deg);
  }
  100% {
    transform: translate3d(-20px, -30px, 0px) scale3d(1, 1, 1) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  }
}

@keyframes moveImage2Left {
  0% {
    transform: translate3d(-91.1283px, 590.684px, 0px) scale3d(1, 1, 1)
      rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  }
  50% {
    transform: translate3d(-120px, -150px, 0px) scale3d(1.3, 1.3, 1.3)
      rotateX(-15deg) rotateY(-15deg) rotateZ(-15deg) skew(-15deg, -15deg);
  }
  100% {
    transform: translate3d(-150px, -200px, 0px) scale3d(1.5, 1.5, 1.5)
      rotateX(45deg) rotateY(45deg) rotateZ(45deg) skew(20deg, 20deg);
  }
}

@keyframes moveImage3Left {
  0% {
    transform: translate3d(115.88px, -492.279px, 0px) scale3d(1, 1, 1)
      rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  }
  50% {
    transform: translate3d(97px, -120px, 0px) scale3d(1.2, 1.2, 1.2)
      rotateX(-10deg) rotateY(-10deg) rotateZ(-10deg) skew(-10deg, -10deg);
  }
  100% {
    transform: translate3d(80px, -150px, 0px) scale3d(1, 1, 1) rotateX(0deg)
      rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  }
}
</style>
