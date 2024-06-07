<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import rightAI from './components/rightAI.vue'


const dialogVisibleRobot = ref(false)
const showRobotMan = ref(true)

const openRobot = () => {
  dialogVisibleRobot.value = true
}
const hiddenAI = () => {
  showRobotMan.value = false
}
const handleCloseAI = () => {
  dialogVisibleRobot.value = false
}
</script>

<template>
  <div>
    <div class="bubble_father" v-show="showRobotMan" ref="bubbleFather">
      <div class="robotBox" @click="openRobot">
        <img src="./assets/image5.jpg" class="robotimg" />
      </div>
      <div class="tips_bubble">
        您好！我是您的平台助手，有问题可点击我进行搜索。
      </div>
    </div>

    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <HelloWorld msg="Vite + Vue" />
    <div class="right_AI" v-if="dialogVisibleRobot">
      <rightAI @handleCloseAI="handleCloseAI" :dialogVisibleRobot="dialogVisibleRobot" />
    </div>

  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
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
  border-radius:50%;
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
  border:1px solid #ccc;
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
