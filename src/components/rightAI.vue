<!--
 * @Descripttion:智能客服机器人-同时支持页面操作
 * @Author: erised
 * @Date: 2024-07-14 10:56:40
-->
<template>
  <div class="container">
    <div class="main">
      <div class="box">
        <div id="content" class="content">
          <div v-for="(item, index) in info" :key="index">
            <div class="info_r info_default" v-if="item.type == 'leftinfo'">
              <span class="circle circle_r">
                <img src="./../assets/AI.png" class="el-icon-s-custom" />
              </span>
              <div class="con_r con_text">
                <!-- 能力1 智能问答-->
                <div v-if="item.activeAbilty == 1">
                  <div class="chat-bubble transform" v-if="showTyping && index === info.length - 1">
                    <!-- <div style="white-space: pre-wrap;">{{ item.content }}</div> -->
                    <div v-html="item.content"></div>
                  </div>
                  <div class="chat-bubble" v-else>
                    <div v-html="item.content"></div>
                  </div>
                </div>
                <!-- 能力2 文档总结/纠错 -->
                <div v-if="item.activeAbilty == 2" style="width:100%">
                  <!-- 文档能力有final_answer -->
                  <div class="result" v-if="item.final_answer" style="margin:7px;width:98%">
                    <span style="white-space: pre-wrap;">{{ item.final_answer }}</span>
                    <!-- <div class="cursor" v-if="showCursor"></div> -->
                  </div>
                  <div v-if="item.content" style="border:1px solid #aaa;border-radius:10px;width:100%">
                    <!-- 流式输出中 -->
                    <div v-if="showTyping && index === info.length - 1">
                      <div style="margin-bottom:5px;padding:8px;cursor:pointer"
                        @click="referenceVisibleLoading = !referenceVisibleLoading">
                        <span style="margin-left:5px;font-weight:bold">思考过程.....</span>
                        <el-icon style="margin-top:3px;float:right;cursor:pointer">
                          <ArrowDown v-if="referenceVisibleLoading" />
                          <ArrowUp v-else />
                        </el-icon>
                      </div>

                      <div v-if="referenceVisibleLoading">
                        <div class="chat-bubble cursorParent">
                          <!-- <v-md-preview :text="item.content" style="width:100%;"></v-md-preview> -->

                          <!-- 以mdview方式引入，会没有流式打字机效果  -->
                          <MdPreview :editorId="`preview_${uploadId + 1}`" :modelValue="item.content"
                            :previewTheme="'github'" :theme="'light'" :codeFoldable="false" :showCodeRowNumber="false"
                            style="width:100%;" />

                        </div>

                      </div>
                    </div>
                    <!-- 全量数据展示 -->
                    <div v-else>
                      <div style="margin-bottom:5px;padding:8px;cursor:pointer" @click="showReference(item)">
                        <span style="margin-left:5px;font-weight:bold">思考过程.....</span>
                        <el-icon style="margin-top:3px;float:right;cursor:pointer">
                          <ArrowDown v-if="item.referenceVisible" />
                          <ArrowUp v-else />
                        </el-icon>
                        <div v-if="item.referenceVisible">
                          <div class="chat-bubble">
                            <!-- <v-md-preview :text="item.content" style="width:100%"></v-md-preview> -->
                            <mdview :id="`preview_${uploadId + 2}`" :text="item.content" style="width:100%;" />
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                <div v-for="(item2, index) in item.question" :key="index">
                  <div class="con_que" @click="clickRobotFirst(item2.content, item2.id)">
                    <div class="czkj-question-msg" v-html="item2.index + ' ' + item2.content"></div>
                  </div>
                </div>
              </div>
              <div class="time_r">{{ item.time }}</div>
            </div>

            <div class="info_l" v-if="item.type == 'rightinfo'">
              <div class="con_l con_text">
                <span class="con_l" v-html="item.content"></span>
              </div>
              <div class="time_l">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="modeinput">
        <div class="modeitem">
          <div class="mode_ability">
            <!-- <el-popover placement="top-start" :width="310" trigger="click"> -->
            <el-popover placement="top-start" :width="310">
              <div class="abilty_popover">
                <div class="abilty_line">
                  <el-icon class="abilty_icon">
                    <ChatDotRound />
                  </el-icon>
                  <span class="ablity_title" @click="changeModeInput(1)">智能问答</span>
                  <span class="ablity_right_no ablity_right_yes" v-if="activeAbilty == 1">已启用</span>
                  <span class="ablity_right_no" v-else>未启用</span>
                </div>
                <div class="ablity_explain">涉及xx平台、环境运维</div>
                <el-divider />
                <div class="abilty_line">
                  <el-icon class="abilty_icon">
                    <Document />
                  </el-icon>
                  <span class="ablity_title" @click="changeModeInput(2)">文档纠错/总结能力</span>
                  <span class="ablity_right_no ablity_right_yes" v-if="activeAbilty == 2">已启用</span>
                  <span class="ablity_right_no" v-else>未启用</span>
                </div>
                <div class="ablity_explain">长文本理解与文本处理纠错能力</div>
              </div>
              <template #reference>
                <span class="font_ability">启用能力</span>
              </template>
            </el-popover>

            <span class="icon_ability">
              <el-icon v-if="activeAbilty == 1">
                <ChatDotRound />
              </el-icon>
              <el-icon v-else>
                <Document />
              </el-icon>
            </span>
          </div>
          <!-- :ref="`Uploader-${uploadId}`" -->
          <div class="attach-upload">
            <el-upload ref="uploaderRef" v-show="activeAbilty == 2" action :headers="{
              'x-access-token': getTokenValue(),
              'token': getTokenValue(),
              'content-type': 'multipart/form-data'
            }" :multiple="true" :auto-upload="false" :show-file-list="false" accept=".pdf, .doc, .docx"
              :name="uploadId" :before-upload="beforeUpload" :on-change="handleChange" :http-request="handleUpload"
              :on-error="fileUploadError" :file-list="fileList">
              <div class="mode_file">
                <span class="file_text">
                  <el-icon>
                    <Upload />
                  </el-icon>文件
                </span>
              </div>
            </el-upload>
          </div>
        </div>
      </div>
      <div class="setproblem">
        <div class="rewrite-input">
          <textarea placeholder="请描述您的问题" id="text" v-model="customerText" @keyup.enter="sentMsgFirst()"></textarea>
          <!-- 快捷搜索 -->
          <div class="queryWaiting" v-show="searchedQueryLists.length > 0" :style="queryH">
            <div v-for="(itemSerched, index) in searchedQueryLists" :key="index" class="allQuery">
              <div class="eachItemQ" @click="handleClickQuery(itemSerched)">
                <span class="eachQuery">{{ itemSerched }}</span>
              </div>
            </div>
          </div>

          <div class="composer">
            <!-- <span class="toasts">按 Enter 快捷发送</span> -->
            <el-button class="sendBtn" @click="sentMsgFirst()" type="primary">发 送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// import axios from 'axios'
import request from '@/utils/request'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { getToken } from '@/libs/util'
import { ElMessage } from 'element-plus'
import fetchStream from './fetchStream'
import { toRaw, ref, reactive, watch, nextTick, onMounted, getCurrentInstance } from 'vue'
import mdview from './mdview.vue'
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';


let robotQuestion = reactive([])
let retrieval_tool = reactive([])
let final_result = ref('')
let timer = ref(null)
let info = reactive([])

let customerText = ref('')
let dialogVisible = ref(false)
let stream = ref(true)
let answerPage = ref('')
let intervalId = ref(null)
let referenceVisibleLoading = ref(false)
let showTyping = ref(false)
let searchedQueryLists = reactive([])
let queryH = ref({
  height: '0px',
  top: '0px'
})
let sendLock = ref(false)
let responseState = ref(1)
let fileList = reactive([])
let activeAbilty = ref(1) //启用能力
let uploadUrl = ref('/robotweb/knowledge_base/upload_temp_docs_summ')
let isLoading = ref(false)
let fileTotal = ref(0) //上传文件总数
let fileFinalList = reactive([])  //待上传文件
let uploadId = ref(Math.random()
  .toString(36)
  .substr(2)
  .toLocaleUpperCase())
let showCursor = ref(false) //结果区单独做了光标闪烁
let userId = ref(localStorage.getItem('userId'))
const uploaderRef = ref(null)

// 方法
const getTokenValue = () => {
  return getToken()
}
const handleUpload = (uploadResources) => { }

const handleChange = (file, fileList) => {
  //获取添加文件进来的状态
  file.status == 'ready' && fileFinalList.push(file.raw)
  //获取原始文件的个数
  fileTotal = document.getElementsByName(uploadId.value)[0].files.length
  //如果原始文件和upload的个数相同的时候就说明已经添加完了，可以触发上传的方法了
  console.log('handleChange--', file, fileList, fileTotal,)

  if (fileFinalList.length == fileTotal) {
    // vue2 
    // const Uploader = this.$refs[`Uploader-${uploadId.value}`]
    // Uploader.submit()   

    //vue3 触发上传文件列表的方法
    uploaderRef.value.submit()
    handleUploadFinal()

  }

}
const handleUploadFinal = () => {
  // console.log('uploadResources---', uploadResources,  fileList, fileFinalList)
  let formData = new FormData()
  fileFinalList.forEach(file => {
    formData.append('files', file, file.name)
  })
  request.post(uploadUrl.value, formData).then(res => {
    isLoading.value = false
    if (res.code == 20000) {
      ElMessage.success('上传成功')
    } else {
      ElMessage.error('系统错误，请联系管理员')
    }

    // 初始化文档
    uploaderRef.value.clearFiles()  // vue2 this.$refs[`Uploader-${this.uploadId}`].clearFiles()
    fileList = []
    fileFinalList = []
  })
}
const fileUploadError = (err, file, fileList) => {
  isLoading.value = false
  ElMessage.error(err.message)
}
const beforeUpload = (file) => {
  let suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  if (suffix != 'doc' && suffix != 'docx' && suffix != 'pdf') {
    ElMessage.warning('上传文件只能是 doc、docx、pdf格式!')
    return false
  }
  isLoading.value = true
  return true
}
const changeModeInput = (modeIndex) => {
  activeAbilty.value = modeIndex
  customerText.value = ''
}
// 获取联想高度
const getQueryHeight = () => {
  if (searchedQueryLists.length == 0) {
    return {
      height: '0px',
      top: '0px'
    }
  } else if (searchedQueryLists.length == 1) {
    return {
      height: '30px',
      top: '-30px'
    }
  } else if (searchedQueryLists.length == 2) {
    return {
      height: '60px',
      top: '-60px'
    }
  } else if (searchedQueryLists.length == 3) {
    return {
      height: '90px',
      top: '-90px'
    }
  } else {
    return {
      height: '100px',
      top: '-100px'
    }
  }
}
// 获取高频问题
const getFrequentQuestions = () => {
  let data = {
    project_name: 'utp',
    top_k: 4, //匹配相似问题的数目
    days: 7 //从当前时间往前退days天数
  }
  return request.post(`/robotweb/knowledge_base/get_frequent_querys`, data)
}
// 获取机器人答复
const getHistroyList = (input) => {
  let data = {
    query: input,
    project_name: 'utp',
    top_k: 1,
    score_threshold: 0.5,
    stream: stream.value, //响应输出是否为流式
    model_name: 'Qwen-72B-Chat-Int8',
    temperature: 0.1,
    max_tokens: 0,
    prompt_name: 'answer',
    user_id: userId.value
  }
  return request.post(`qrobot-web/robotwebchat/chat/qa_chat`, data)
}
// sse
const getHistroyListStream = async (input) => {

  let dataInput = {
    query: input,
    project_name: 'utp',
    top_k: 1,
    score_threshold: 0.5,
    stream: stream.value, //响应输出是否为流式
    model_name: 'Qwen-72B-Chat-Int8',
    temperature: 0.1,
    max_tokens: 0,
    prompt_name: 'answer',
    user_id: userId.value
  }
  // let url = "qrobot-web/robotwebchat/chat/qa_chat";

  // 这个接口单独处理
  let urlDev = '/robotweb/chat/qa_chat'
  let urlProd = '/qrobot-web/robotwebchat/chat/qa_chat'
  let url = import.meta.env.VITE_NODE_ENV == 'development' ? urlDev : urlProd

  // 空值填入
  answerPage.value = ''
  let obj_r_0 = {
    type: 'leftinfo',
    time: getTodayTime(),
    name: 'robot',
    content: ' ',
    question: [],
    activeAbilty: activeAbilty.value,
  }
  info.push(obj_r_0)
  //使光标闪烁
  showTyping.value = true

  // // 浏览器支持 SSE
  await fetchEventSource(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": getToken()
    },
    body: JSON.stringify(dataInput),
    async onmessage(event) {
      handleStreamSse(event);
    },
    async onerror(event) {
      console.log("onerror---", event);
      //  message.error("链接失败,请刷新页面后重新尝试");
      return;
    }
  });

}
// 输入联想
const searchQuery = (input) => {
  // if (input) {
  let data = {
    query: input,
    project_name: 'utp',
    top_k: 5, //匹配相似问题的数目
    score_threshold: 0.5
  }
  request.post(`/robotweb/knowledge_base/search_querys_multi`, data).then(response => {
    if (response && response.code == 20000) {
      searchedQueryLists = response.data
      queryH.value = getQueryHeight()
      // 前端强制处理
      if (!input) {
        searchedQueryLists = []
        queryH.value = {
          height: '0px',
          top: '0px'
        }
      }

    } else {
      searchedQueryLists = []
      queryH.value = getQueryHeight()
    }

  })
  // } else {
  //    searchedQueryLists = [];
  //    queryH.value =  getQueryHeight();
  // }
}
// 点击了搜索条件之后，进行搜索
const handleClickQuery = (item) => {
  clickRobotFirst(item)
  searchedQueryLists = []
  customerText.value = ''
  queryH.value = getQueryHeight()
}
// 用户发送消息
const sentMsg = () => {
  if (sendLock.value) return
  clearTimeout(timer.value)
  showTimer()
  let text = customerText.value.trim()
  if (text != '') {
    appendRightInfo(text)
    appendRobotMsg(customerText.value)
    customerText.value = ''
    sendLock.value = true // 发送信息之后开启锁
  }
}
// 机器人回答消息
const appendRobotMsg = (text) => {
  clearTimeout(timer.value)
  showTimer()
  text = text.trim()
  if (stream.value) {
    // sse
    getHistroyListStream(text)
  } else {
    // 全部获取到之后处理
    getHistroyList(text).then(result => {
      if (stream.value) {
        handleStream(result)
      } else {
        handleJSON(result)
      }
    })
  }
}
/**
 * 将服务端格返回字符串尝试格式化为json
 * @param {String} str
 * @returns
 */
const setParase = (str) => {
  if (typeof str != 'string') {
    return str
  }
  try {
    return JSON.parse(str.substring(6))
  } catch (error) {
    return str
  }
}
// sse
const handleStreamSse = (res) => {
  console.log('res----', res)
  let result = JSON.parse(res.data);
  // let result =  setParase(res)
  if (!result || result.code != 20000) {
    if (res.data && res.data.message) {
      ElMessage.error(res.data.message)
    }
    return
  }

  if (result.data.answer) {
    console.log('answer---', result.data.answer)
    //  answerPage.value =  answerPage + result.data.answer;
    let valtemp = result.data.answer.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    answerPage.value = answerPage.value + valtemp
    let obj_r = {
      type: 'leftinfo',
      time: getTodayTime(),
      name: 'robot',
      content: answerPage.value,
      question: [],
      activeAbilty: activeAbilty.value,
    }

    info.pop() //删除最后一个obj_r_0，重新添加满值
    info.push(obj_r)

    setLastScrollHeight()
  }

  if (result.data.docs) {
    showTyping.value = false
    sendLock.value = false
  }
}

//（文本流式）响应输出为流式时---打印机流式回复
const handleStream = (result) => {
  answerPage.value = ''
  // 空值填入---使光标闪烁
  let obj_r_0 = {
    type: 'leftinfo',
    time: getTodayTime(),
    name: 'robot',
    content: ' ',
    question: [],
    activeAbilty: activeAbilty.value,
  }
  info.push(obj_r_0)

  if (result.includes('\r\n') > -1) {
    let lines = result
      .toString()
      .split('\r\n')
      .filter(line => line.trim() !== '')

    for (const line of lines) {
      const parsed_0 = line.replace('data: ', '')
      const parsed = JSON.parse(parsed_0)
      console.log('parsed----', parsed)
      if (parsed.code != 20000 || !parsed.data) return
      if (parsed.data && parsed.data.docs && parsed.data.docs.length > 0) {
        console.log(' answerPage---', answerPage.value)
        let obj_r = {
          type: 'leftinfo',
          time: getTodayTime(),
          name: 'robot',
          content: answerPage.value,
          question: []
        }
        //  info.push(obj_r);
        info.pop() //删除最后一个obj_r_0，重新添加满值
        startFlow(obj_r)

        setLastScrollHeight()
        return
      } else {
        answerPage.value = answerPage.value + parsed.data.answer
      }
    }
  }
}
//打字机效果
const startFlow = (message) => {
  info.push({ ...message, content: '' })
  let i = 0
  const msgLength = message.content.length
  const typeNextLetter = () => {
    info[info.length - 1].content += message.content.charAt(i)
    i++

    setLastScrollHeight()

    if (i <= msgLength) {
      setTimeout(typeNextLetter, 100)
    } else {
      clearTimeout(intervalId.value)
      showTyping.value = false
    }
  }
  clearTimeout(intervalId.value)
  showTyping.value = true
  intervalId.value = setTimeout(typeNextLetter, 500)
}
// 页面位置定位到最底部
const setLastScrollHeight = () => {
  nextTick(() => {
    var contentHeight = document.getElementById('content')
    contentHeight.scrollTop = contentHeight.scrollHeight
  })
}

// 响应输出格式为json时--直接一次性输出
const handleJSON = (result) => {
  if (result && result.code == 20000) {
    let obj_r = {
      type: 'leftinfo',
      time: getTodayTime(),
      name: 'robot',
      content: result.data.answer,
      question: [],
      activeAbilty: activeAbilty.value,
    }
    info.push(obj_r)
    setLastScrollHeight()
  } else {
    ElMessage.warning(result.message)
  }
}
// 右边的问题push进去
const appendRightInfo = (val) => {
  // 处理xss
  let text = val
    .trim()
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('&lt;br/&gt;', '<br />')
  let obj_r = {
    type: 'rightinfo',
    time: getTodayTime(),
    content: text
    // question: []
  }
  info.push(obj_r)
  setLastScrollHeight()
}
// 结束语
const endMsg = () => {
  let happyEnding = {
    type: 'leftinfo',
    time: getTodayTime(),
    content: '退下吧',
    question: []
  }
  info.push(happyEnding)
  setLastScrollHeight()
}
const showTimer = () => {
  // timer.value = setTimeout(endMsg, 1000 * 60);
}
const getTodayTime = () => {
  // 获取当前时间
  var day = new Date()
  let seconds = day.getSeconds()
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  let minutes = day.getMinutes()
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  let time =
    day.getFullYear() +
    '-' +
    (day.getMonth() + 1) +
    '-' +
    day.getDate() +
    ' ' +
    day.getHours() +
    ':' +
    minutes +
    ':' +
    seconds
  return time
}

const ToBreak = (val) => {
  val =
    val &&
    val
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll(' ', '&nbsp;')
      .replaceAll('\n', '<br />')
  return val
}
// （json格式）AI回复
const sentMsgJSON = () => {
  if (sendLock.value) return
  let text = customerText.value.trim().replace(/\n/g, '<br/>')
  if (text != '') {
    appendRightInfo(text)
    appendRobotMsgJSON(customerText.value)
    customerText.value = ''
    //  sendLock.value = true // 发送信息之后开启锁
  }
}
// 2个数组交叉合并为新数组
const aryJoinAry = (ary1, ary2) => {
  let itemAry = []
  let minLength
  if (ary1.length > ary2.length) {
    minLength = ary2.length
  } else {
    minLength = ary1.length
  }
  //将两个数组中较长的数组记录下来
  // let longAry = arguments[0].length > arguments[1].length ? arguments[0] : arguments[1]
  let longAry = ary1.length > ary2.length ? ary1 : ary2
  console.log('longAry====', longAry, arguments)
  //循环范围为较短的那个数组的长度
  for (let i = 0; i < minLength; i++) {
    //将数组放入临时数组中
    itemAry.push(ToBreak(ary1[i]))
    itemAry.push('<img width=95% src=' + ary2[i] + '/>' + '<br />')
  }
  let leftContent = longAry.slice(minLength)
  let leftContentNew = []
  for (let j = 0; j < leftContent.length; j++) {
    leftContentNew.push(ToBreak(leftContent[j])) //剩下的内容也需要对特殊字符处理
  }
  return itemAry.concat(leftContentNew) //itemAry和多余的新数组拼接起来并返回。
}
// （json格式）机器人回复消息
const appendRobotMsgJSON = (text) => {
  clearTimeout(timer.value)
  showTimer()
  text = text.trim()
  let data = {
    query: text,
    project_name: 'utp',
    user_id: userId.value
  }
  request.post(`/robotweb/chat/qa_ops_chat`, data).then(result => {
    if (result && result.code == 20000) {
      if (!result.data) return
      answerPage.value = '' //文本和图片交叉展示
      let answertemp = result.data.answers // 文本
      let imagepathstemp = result.data.image_paths // 图片
      if (!answertemp) answertemp = []
      if (!imagepathstemp) imagepathstemp = []
      let totaltemp = aryJoinAry(answertemp, imagepathstemp) //合并为新的
      console.log('totaltemp---', totaltemp)
      totaltemp.forEach(item => {
        answerPage.value = answerPage.value + item
      })
      let obj_r = {
        type: 'leftinfo',
        name: 'robot',
        time: getTodayTime(),
        content: answerPage.value,
        question: [],
        activeAbilty: activeAbilty.value,
      }

      info.push(obj_r)
      setLastScrollHeight()
    } else {
      ElMessage.error(result.message)
    }
  })
}

// 切换回复方式
const changeResponse = () => {
  responseState.value = responseState.value == 1 ? 2 : 1
}
// 后端确认回复方式
const getMode = (input) => {
  if (input) {
    let data = {
      query: input,
      project_name: 'utp'
    }
    return request.post(`/robotweb/knowledge_base/get_mode`, data)
  }
}
// 点击单个问题first
const clickRobotFirst = (val) => {
  activeAbilty.value = 1
  getMode(val).then(response => {
    if (response && response.code == 20000) {
      if (response.data) {
        if (sendLock.value) return // 锁住时忽略
        appendRightInfo(val)
        let mode = response.data.mode //根据问题获取mode
        if (mode == 1) {
          //文本流式
          appendRobotMsg(val)
          sendLock.value = true
        } else if (mode == 2) {
          //图文JSON
          appendRobotMsgJSON(val)
        }
      }
    } else {
      ElMessage.error(response.message)
    }
  })
}
// 用户搜索需要区分 不同的启用能力
const sentMsgFirst = () => {
  if (activeAbilty.value == 1) {
    sentMsgFirstOne()
  } else if (activeAbilty.value == 2) {
    sendMsgFirstTwo()
  }
}
// 用户输入搜索--默认智能问答
const sentMsgFirstOne = () => {
  if (sendLock.value) return
  let text = customerText.value.trim().replace(/\n/g, '<br/>')
  if (text == '') return
  getMode(text).then(response => {
    if (response && response.code == 20000) {
      if (response.data) {
        let mode = response.data.mode //根据问题获取mode
        if (mode == 1) {
          //文本流式
          sentMsg()
        } else if (mode == 2) {
          //图文JSON
          sentMsgJSON()
        }
      }
    } else {
      ElMessage.error(response.message)
    }
  })
}
// 用户上传文档后--文档纠错和总结
const sendMsgFirstTwo = () => {
  if (sendLock.value) return
  let input = customerText.value.trim().replace(/\n/g, '<br/>')
  if (input == '') return
  clearTimeout(timer.value)
  showTimer()
  appendRightInfo(input)
  appendRobotMsgForFile(customerText.value)
  customerText.value = ''
  sendLock.value = true // 发送信息之后开启锁
}
//上传文档后，用户发送消息,机器人回复  sse
const appendRobotMsgForFile = (text) => {
  clearTimeout(timer.value)
  showTimer()
  text = text.trim()
  if (stream.value) {
    getHistroyListStreamForFile(text)
  }
}
// 处理流式输出的数据
const handleStreamSseForFile = (res) => {
  let result = JSON.parse(res.data);
  // let result = setParase(res)
  console.log('res----result', result)

  if (!result || result.code != 20000) {
    if (result.code == 21000) {
      //21000 非报错造成的流式退出
      ElMessage.error(result.message)
    } else if (res.data && res.data.message) {
      ElMessage.error(res.data.message)
    }
    // 报错后退出锁
    showTyping.value = false
    sendLock.value = false
    showCursor.value = false

    return
  }

  // 思考的过程-流式
  if (result.data.answer) {
    // console.log('answer---', result.data.answer)
    let valtemp = result.data.answer.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    answerPage.value = answerPage.value + valtemp

  }

  // 最后的结果-非流式
  if (result.data.final_answer) {
    final_result.value = result.data.final_answer

    showTyping.value = false
    sendLock.value = false
    showCursor.value = false

  }

  // 最后填充
  let obj_r = {
    type: 'leftinfo',
    time: getTodayTime(),
    name: 'robot',
    content: answerPage.value,
    final_answer: final_result.value || '', //最终结果
    referenceVisible: referenceVisibleLoading.value,
    activeAbilty: activeAbilty.value,
    question: []
  }
  console.log('obj_r---fffff', obj_r, info)
  info.pop() //删除最后一个obj_r_0，重新添加满值
  info.push(obj_r)

  setLastScrollHeight()
}
// 文档 sse
const getHistroyListStreamForFile = async (input) => {
  let dataInput = {
    query: input,
    project_name: 'utp',
    stream: stream.value, //响应输出是否为流式
    user_id: userId.value
  }
  // 这个接口单独处理
  let urlDev = '/robotweb/chat/agent_chat'
  let urlProd = '/qrobot-web/robotwebchat/chat/agent_chat'
  let url = import.meta.env.VITE_NODE_ENV == 'development' ? urlDev : urlProd

  // 空值填入
  answerPage.value = ''
  final_result.value = '' //初始化结果
  referenceVisibleLoading.value = false //初始化
  let obj_r_0 = {
    type: 'leftinfo',
    time: getTodayTime(),
    name: 'robot',
    content: ' ',
    final_result: '', //最终结果
    referenceVisible: referenceVisibleLoading.value,  //默认关闭思考过程展示区
    question: [],
    activeAbilty: activeAbilty.value,
  }
  info.push(obj_r_0)
  //使光标闪烁
  showTyping.value = true
  showCursor.value = true //结果展示区
  // // 浏览器支持 SSE
  await fetchEventSource(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "token": getToken()
    },
    body: JSON.stringify(dataInput),
    async onmessage(event) {
      handleStreamSseForFile(event);
    },
    async onerror(event) {
      console.log("onerror---", event);
      // message.error("链接失败,请刷新页面后重新尝试");
      return;
    }
  });

}
const showReference = (item) => {
  item.referenceVisible = !item.referenceVisible
}

onMounted(() => {
  // 初始化
  info.push({
    type: 'leftinfo',
    time: getTodayTime(),
    name: 'robot',
    activeAbilty: 1,
    content:
      '您好，欢迎使用移动云测试平台，为保证信息安全，请勿在会话过程中透露账号密码等敏感信息',
    question: []
  })

  showTimer()
  getFrequentQuestions().then(response => {
    if (response && response.code == 20000) {
      let datatemp = response.data
      let Qlist = []
      datatemp.forEach((item, index) => {
        Qlist.push({
          id: index + 1,
          content: item,
          index: index + 1
        })
      })
      robotQuestion = Qlist
    } else {
      robotQuestion = []
    }

    if (robotQuestion.length == 0) return
    let answerText = '您可能想问：'
    let obj = {
      type: 'leftinfo',
      time: getTodayTime(),
      name: 'robot',
      content: answerText,
      question: robotQuestion,
      activeAbilty: activeAbilty.value,
    }
    info.push(obj)
    setLastScrollHeight()
  })

  queryH.value = getQueryHeight()
})



watch(customerText, (newVal, oldVal) => {
  console.log('监听的customerText改变了', newVal, oldVal)
  if (activeAbilty.value == 1) {
    searchQuery(newVal)
  }
})

</script>

<style lang="less" scoped>
.container {
  // box-shadow: 0 0 20px 1px rgba(19, 41, 75, 0.2);
  background-color: #fff;

  transition: all 0.6s;
  height: 100%;
  font-size: 14px;
  line-height: 1.7;

  .title_AI {
    height: 52px;
    line-height: 52px;
    padding: 0 10px;
    background-color: #f8f8f8;
    display: flex;
    justify-content: space-between;

    .closeAI_img {
      display: inline-block;
      margin-top: 6px;
      margin-right: 5px;
    }

    .closeAI_img :hover {
      cursor: pointer;
    }
  }

  .main {
    width: 100%;
    // height: calc(100% - 43px);
    height: calc(100%);
    overflow: hidden;
    // background-color: #f8f8f8;
    background-color: #f4f9ff;

    .box {
      width: 100%;
      height: calc(100% - 215px);
      // border: 1px solid green;
      position: relative;

      #content {
        width: 98%;
        height: 98%;
        overflow-y: scroll;
        margin: 3px;
        padding: 5px;
        // border: 1px solid blue;

        .circle {
          display: inline-block;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: #eff1f3;
        }

        .con_text {
          color: #333;
          margin-top: 4px;
          margin-bottom: 2px;
          display: inline-block;
        }

        .con_que {
          color: #1c88ff;
          height: 28px;
          line-height: 28px;
          cursor: pointer;
        }

        .info_r {
          margin-bottom: 12px;
          position: relative;
          // width: 100%;
          width: 90%;

          // border: 1px solid green;
          .circle_r {
            position: absolute;
            left: 0%;
            border: 1px solid #ccc;

            .el-icon-s-custom {
              width: 34px;
              height: 33px;
            }
          }

          .con_r {
            display: inline-block;
            width: 85%;
            background: #fff;
            border-radius: 4px;
            padding: 10px;
            margin-left: 40px;
            // max-width: 91%;
            white-space: normal;
            word-break: break-all;

            .chat-bubble {
              width: 100%;
              border-radius: 10px;
              // background: #eee;
              color: #333;
              display: inline-block;
              word-break: break-word;
            }

            .cursorParent {
              // overflow-y: auto;
              position: relative;
              margin-bottom: 3px;
              // display: flex;
              /* 使用flex布局 */
              // align-items: flex-end;
              /* 让光标紧跟文本 */

              // // 光标
              // .cursor {
              //   width: 2px;
              //   height: 1em;
              //   /* 光标的高度，与文本高度相同 */
              //   background-color: rgb(81, 81, 81);
              //   position: absolute;
              //   bottom: 0px;
              //   left: 0px;
              //   animation: blink 1s step-end infinite;

              //   /* 使用CSS动画替代JavaScript定时器也是可行的 */
              //   @keyframes blink {
              //     50% {
              //       opacity: 0;
              //     }
              //   }
              // }
            }

            .transform ::after {
              content: '|';
              animation: blink 1s infinite;
              overflow: hidden;
            }

            @keyframes blink {
              from {
                opacity: 0;
              }

              to {
                opacity: 1;
              }
            }

            .cursor {
              content: '|';
              animation: blink 1s infinite;
              overflow: hidden;
            }

            @keyframes blink {
              from {
                opacity: 0;
              }

              to {
                opacity: 1;
              }
            }
          }

          .time_r {
            margin-left: 45px;
            color: #999999;
            font-size: 12px;
          }
        }

        .info_l {
          text-align: right;
          color: #ffffff;
          color: #3163c5;
          margin-bottom: 12px;
          // width: 55%;
          // margin-left: 45%;

          .time_l {
            color: #999999;
            margin-top: 5px;
            font-size: 12px;
            margin-right: 20px;
          }

          .con_l {
            display: inline-block;
            width: 220px;
            background-color: #b9cdf0;
            // color: #337DFF;
            border-radius: 4px;
            // padding: 10px;
            padding: 5px;
            text-align: left;
            margin-right: 20px;

            max-width: 91%;
            white-space: normal;
            word-break: break-all;
          }
        }
      }
    }
  }

  .modeinput {
    border: 1px solid #ccc;
    background: #fff;
    border-bottom: 0;
    height: 35px;

    .modeitem {
      align-items: center;
      display: flex;
      height: 35px;

      .mode_ability {
        margin: 0 12px;
        padding: 6px 0;

        background: rgba(222, 227, 255, 0.5);
        align-items: center;
        border-radius: 12px;
        color: #625b88;
        cursor: pointer;
        display: flex;
        height: 25px;
        line-height: 25px;
        justify-content: center;
        padding: 0 8px;

        .font_ability {
          font-size: 12px;
          margin-right: 5px;
        }

        .icon_ability {
          line-height: 25px;
          font-size: 16px;
        }
      }

      .upload-demo {
        height: 35px;

        .mode_file {
          font-size: 12px;

          .file_text {
            display: inline-block;
            line-height: 35px;
          }
        }
      }
    }
  }

  .setproblem {
    border: 1px solid #d9d9d9;
    border-top: 1px solid #eee;
    width: 100%;
    height: 180px;
    background: #fff;
    position: relative;
    margin-top: 0rem;
    padding: 10px;
    box-sizing: border-box;

    .rewrite-input {
      // border: 1px solid #d9d9d9;
      height: 97%;

      textarea {
        // max-height: 100px;
        // padding: 10px;
        box-sizing: border-box;
        height: 75%;
        width: 100%;
        resize: none;
        border: none;
        outline: none;
        color: #333;
      }

      #text::placeholder {
        color: lightgray;
      }

      .composer {
        text-align: right;

        .toasts {
          color: #555555;
        }

        .sendBtn {
          margin: 0 10px;
          width: 3.8rem;
          height: 1.8rem;
          line-height: 1.8rem;
          background: #337dff;
          opacity: 1;
          font-size: 12px;
          color: #ffffff;
          cursor: pointer;
          border: none;
        }
      }
    }
  }

  .queryWaiting {
    position: absolute;
    left: 0;
    // top: -100px;
    width: 100%;
    // max-height: 100px;
    overflow: auto;
    margin: 5px 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #e4e7ed;
    box-sizing: border-box;
    background-color: #fff;

    .allQuery {
      z-index: 99;

      .eachItemQ {
        color: #606266;
        letter-spacing: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;

        .eachQuery {
          display: inline-block;
          margin: 7px 10px;
          font-size: 12px;
        }
      }
    }

    .allQuery :hover {
      cursor: pointer;
      background-color: #f5f7fa;
    }
  }
}

.czkj-question-msg {
  float: left;
  font-size: 14px;
  color: #3163c5;
}

.abilty_popover {
  height: 110px;

  .abilty_line {
    // border: 1px solid blue;
    align-items: center;
    color: #676c90;
    display: flex;
    height: 26px;
    margin-bottom: 2px;

    .abilty_icon {
      font-size: 17px;
    }

    .ablity_title {
      font-size: 14px;
      padding: 4px;
    }

    .ablity_title:hover {
      cursor: pointer;
      color: #337dff;
    }

    .ablity_right_no {
      font-size: 13px;
      position: absolute;
      right: 16px;
    }

    .ablity_right_no::before {
      background: rgba(103, 108, 144, 0.5);
      border-radius: 50%;
      content: '';
      height: 4px;
      left: -7px;
      position: absolute;
      top: 7px;
      width: 4px;
    }

    .ablity_right_yes {
      color: #06b25b;
    }

    .ablity_right_yes::before {
      background: #06b25b;
    }
  }

  .ablity_explain {
    color: rgba(103, 108, 144, 0.6);
    font-size: 12px;
    text-align: left;
  }

}
</style>
<style>
.el-divider--horizontal {
  margin: 8px 0;
}

.github-markdown-body {
  font-size: 14px;
}
</style>