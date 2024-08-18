<template>
  <div class="total">
    <rightAI @handleCloseAI="handleCloseAI" :dialogVisibleRobot="dialogVisibleRobot" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import rightAI from './rightAI.vue'


const dialogVisibleRobot = ref(false)

const handleCloseAI = () => {
  dialogVisibleRobot.value = false
}
</script>

<style scoped>
.total {
  height: 100vh;
  /* width: 100vh; */
  /* border:1px solid red */
}

.mask_c {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  background-color: rgba(0, 0, 0, 0.2);
}

.robotBox {
  /* padding: 15px 2px; */
  position: fixed;
  /* right: 23px; */
  right: 20px;
  bottom: 40px;
  cursor: pointer;
  z-index: 99;
}

.robotimg {
  /* width: 120px; */
  width: 70px;
  height: 60px;
  border-radius: 50%;
}

.tips_bubble {
  display: none;
}

.bubble_father:hover .tips_bubble {
  display: block;
  position: fixed;
  text-align: center;
  z-index: 88;
  height: 60px;
  width: 250px;
  padding: 14px 15px 14px 10px;
  /* background-image: url("./../assets/tips_new.png"); */
  border: 1px solid #ccc;
  background-repeat: no-repeat;
  background-size: 100%;
  font-size: 13px;
  right: 102px;
  bottom: 25px;
}

.right_AI {
  width: 680px;
  height: 90%;
  position: absolute;
  right: 24px;
  bottom: 10px;
  z-index: 9997;
  /* border: 0; */
}
</style>
