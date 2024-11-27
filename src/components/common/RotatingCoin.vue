<template>
  <div class="coin">
    <div class="coin-inner">
      <div class="coin-front">₿</div>
      <div class="coin-back">₿</div>
    </div>
  </div>
</template>

<style scoped>
.coin {
  width: 80px;
  height: 80px;
  margin: 20px auto;
  perspective: 1000px;
}

.coin-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: rotate 3s linear infinite;
}

.coin-front,
.coin-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: linear-gradient(45deg, #f7931a, #ffd700);
  border-radius: 50%;
  color: white;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.coin-back {
  transform: rotateY(180deg);
}

@keyframes rotate {
  from {
    transform: rotateY(0);
  }

  to {
    transform: rotateY(360deg);
  }
}
</style>
