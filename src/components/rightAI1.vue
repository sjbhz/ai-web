<!--
 * @Descripttion:智能客服机器人-同时支持页面操作--使用v-md-preview（@kangc/v-md-editor组件，需要在main.ts中引入）支持md预览
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
                  <!-- <div v-if="item.content" style="border:1px solid #aaa;border-radius:10px;width:100%">
                    <div style="margin-bottom:5px;padding:8px;cursor:pointer" @click="showReference(item)">
                      <span style="margin-left:5px;font-weight:bold">思考过程.....</span>
                      <el-icon style="margin-top:3px;float:right;cursor:pointer">
                        <ArrowDown v-if="item.referenceVisible" />
                        <ArrowUp v-else />
                      </el-icon>
                    </div>

                    <div v-if="item.referenceVisible">
                      <div class="chat-bubble cursorParent" v-if="showTyping && index === info.length - 1">
                        <v-md-preview :text="item.content" style="width:100%;"></v-md-preview>

                      </div>
                      <div class="chat-bubble" v-else>
                        <v-md-preview :text="item.content" style="width:100%"></v-md-preview>
                      </div>
                    </div>
                  </div> -->
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
                          <v-md-preview :text="item.content" style="width:100%;"></v-md-preview>

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
                            <v-md-preview :text="item.content" style="width:100%"></v-md-preview>
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

          <div class="attach-upload">
            <el-upload v-if="activeAbilty == 2" action :headers="{
              'x-access-token': getTokenValue(),
              'token': getTokenValue(),
              'content-type': 'multipart/form-data'
            }" :ref="`Uploader-${uploadId}`" :multiple="true" :auto-upload="false" :show-file-list="false"
              accept=".pdf, .doc, .docx" :name="uploadId" :before-upload="beforeUpload" :on-change="handleChange"
              :http-request="handleUpload" :on-error="fileUploadError" :file-list="fileList">
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
<script>
// import axios from 'axios'
import request from '@/utils/request'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { getToken } from '@/libs/util'
import fetchStream from './fetchStream'
import { toRaw } from 'vue'

export default {
  name: 'right-AI',
  components: {},
  data() {
    return {
      showCursor: false, //结果区单独做了光标闪烁
      uploadId: Math.random()
        .toString(36)
        .substr(2)
        .toLocaleUpperCase(),
      fileFinalList: [], //待上传文件
      fileTotal: 0, //上传文件总数
      isLoading: false,
      uploadUrl: '/robotweb/knowledge_base/upload_temp_docs_summ',
      activeAbilty: 1, //启用能力
      fileList: [],
      responseState: 1,
      sendLock: false,
      queryH: {
        height: '0px',
        top: '0px'
      },
      searchedQueryLists: [],
      showTyping: false,
      referenceVisibleLoading: false,
      intervalId: null,
      answerPage: '',
      stream: true,
      dialogVisible: false,
      customerText: '',
      info: [
        {
          type: 'leftinfo',
          time: this.getTodayTime(),
          name: 'robot',
          activeAbilty: 1,
          content:
            '您好，欢迎使用移动云测试平台，为保证信息安全，请勿在会话过程中透露账号密码等敏感信息',
          question: []
        }
      ],
      timer: null,
      final_result: '',
      retrieval_tool: [],
      robotQuestion: [],
      robotQuestionTotal: [
        {
          id: 1,
          // content: `平台的账号被注销了 <img src='/ylgl/resource/md/get/ba182328_H1.png' />`,
          content: `平台的账号被注销了`,
          index: 1
        },
        {
          id: 2,
          content: '平台的邮箱出现问题应该找谁处理',
          index: 2
        },
        {
          id: 3,
          content: '忘记平台密码，在哪里修改呢？',
          index: 3
        },
        {
          id: 4,
          content: '测试报告发送审核发不出去',
          index: 4
        },
        {
          id: 5,
          content: '在平台跑接口测试时，怎么设置超时时间？',
          index: 5
        }
      ]
    }
  },
  computed: {
    userId() {
      return localStorage.getItem('userId')
    }
  },
  created() {
    this.showTimer()
    this.getFrequentQuestions().then(response => {
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
        this.robotQuestion = Qlist
      } else {
        // this.robotQuestion = this.robotQuestionTotal;
        this.robotQuestion = []
      }

      if (this.robotQuestion.length == 0) return
      let answerText = '您可能想问：'
      let obj = {
        type: 'leftinfo',
        time: this.getTodayTime(),
        name: 'robot',
        content: answerText,
        question: this.robotQuestion,
        activeAbilty: this.activeAbilty,
      }
      this.info.push(obj)
      this.setLastScrollHeight()
    })
  },
  watch: {
    dialogVisibleRobot: {
      handler(val, oldVal) { }
    },
    customerText: {
      handler(val, oldVal) {
        if (this.activeAbilty == 1) {
          this.searchQuery(val)
        }
      }
    }
  },
  mounted() {
    this.queryH = this.getQueryHeight()
  },

  methods: {
    getTokenValue() {
      return getToken()
    },
    handleUpload(uploadResources) { },
    handleChange(file, fileList) {
      //获取添加文件进来的状态
      file.status == 'ready' && this.fileFinalList.push(file.raw)
      //获取原始文件的个数
      this.fileTotal = document.getElementsByName(this.uploadId)[0].files.length
      //如果原始文件和upload的个数相同的时候就说明已经添加完了，可以触发上传的方法了
      if (this.fileFinalList.length === this.fileTotal) {
        //获取上传文件的组件
        const Uploader = this.$refs[`Uploader-${this.uploadId}`]
        //触发上传文件列表的方法
        Uploader.submit()
        this.handleUploadFinal()
      }
    },
    handleUploadFinal() {
      // console.log('uploadResources---', uploadResources, this.fileList, this.fileFinalList)
      let formData = new FormData()
      this.fileFinalList.forEach(file => {
        formData.append('files', file, file.name)
      })
      request.post(this.uploadUrl, formData).then(res => {
        this.isLoading = false
        if (res.code == 20000) {
          this.$message.success('上传成功')
        } else {
          this.$message.error('系统错误，请联系管理员')
        }

        // 初始化文档
        this.$refs[`Uploader-${this.uploadId}`].clearFiles()
        this.fileList = []
        this.fileFinalList = []
      })
    },
    fileUploadError(err, file, fileList) {
      this.isLoading = false
      this.$message.error(err.message)
    },
    beforeUpload(file) {
      let suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (suffix != 'doc' && suffix != 'docx' && suffix != 'pdf') {
        this.$warning('上传文件只能是 doc、docx、pdf格式!')
        return false
      }
      this.isLoading = true
      return true
    },
    changeModeInput(modeIndex) {
      this.activeAbilty = modeIndex
      this.customerText = ''
    },
    // 获取联想高度
    getQueryHeight() {
      if (this.searchedQueryLists.length == 0) {
        return {
          height: '0px',
          top: '0px'
        }
      } else if (this.searchedQueryLists.length == 1) {
        return {
          height: '30px',
          top: '-30px'
        }
      } else if (this.searchedQueryLists.length == 2) {
        return {
          height: '60px',
          top: '-60px'
        }
      } else if (this.searchedQueryLists.length == 3) {
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
    },
    // 获取高频问题
    getFrequentQuestions() {
      let data = {
        project_name: 'utp',
        top_k: 4, //匹配相似问题的数目
        days: 7 //从当前时间往前退days天数
      }
      return request.post(`/robotweb/knowledge_base/get_frequent_querys`, data)
    },
    // 获取机器人答复
    getHistroyList(input) {
      let data = {
        query: input,
        project_name: 'utp',
        top_k: 1,
        score_threshold: 0.5,
        stream: this.stream, //响应输出是否为流式
        model_name: 'Qwen-72B-Chat-Int8',
        temperature: 0.1,
        max_tokens: 0,
        prompt_name: 'answer',
        user_id: this.userId
      }
      return request.post(`qrobot-web/robotwebchat/chat/qa_chat`, data)
    },
    // sse
    async getHistroyListStream(input) {
      let _this = this
      let dataInput = {
        query: input,
        project_name: 'utp',
        top_k: 1,
        score_threshold: 0.5,
        stream: this.stream, //响应输出是否为流式
        model_name: 'Qwen-72B-Chat-Int8',
        temperature: 0.1,
        max_tokens: 0,
        prompt_name: 'answer',
        user_id: this.userId
      }
      // let url = "qrobot-web/robotwebchat/chat/qa_chat";

      // 这个接口单独处理
      let urlDev = '/robotweb/chat/qa_chat'
      let urlProd = '/qrobot-web/robotwebchat/chat/qa_chat'
      let url = import.meta.env.VITE_NODE_ENV == 'development' ? urlDev : urlProd

      // 空值填入
      this.answerPage = ''
      let obj_r_0 = {
        type: 'leftinfo',
        time: this.getTodayTime(),
        name: 'robot',
        content: ' ',
        question: [],
        activeAbilty: this.activeAbilty,
      }
      this.info.push(obj_r_0)
      //使光标闪烁
      this.showTyping = true

      // // 浏览器支持 SSE
      await fetchEventSource(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": getToken()
        },
        body: JSON.stringify(dataInput),
        async onmessage(event) {
          _this.handleStreamSse(event);
        },
        async onerror(event) {
          console.log("onerror---", event);
          // _this.$message.error("链接失败,请刷新页面后重新尝试");
          return;
        }
      });

      // await fetchStream(url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     accept: 'text/event-stream',
      //     token: getToken()
      //   },
      //   body: JSON.stringify(dataInput),
      //   async onmessage(event) {
      //     _this.handleStreamSse(event)
      //   },
      //   async onerror(event) {
      //     console.log('onerror---22', event)
      //     this.$message.warning('用户所在企业未订阅或超时, 请关闭后重新访问')
      //     // _this.$message.error("链接失败,请刷新页面后重新尝试");
      //     return
      //   }
      // })
    },
    // 输入联想
    searchQuery(input) {
      // if (input) {
      let data = {
        query: input,
        project_name: 'utp',
        top_k: 5, //匹配相似问题的数目
        score_threshold: 0.5
      }
      request.post(`/robotweb/knowledge_base/search_querys_multi`, data).then(response => {
        if (response && response.code == 20000) {
          this.searchedQueryLists = response.data
          this.queryH = this.getQueryHeight()
          // 前端强制处理
          if (!input) {
            this.searchedQueryLists = []
            this.queryH = {
              height: '0px',
              top: '0px'
            }
          }
        } else {
          this.searchedQueryLists = []
          this.queryH = this.getQueryHeight()
        }
      })
      // } else {
      //   this.searchedQueryLists = [];
      //   this.queryH = this.getQueryHeight();
      //   console.log('input--',input)
      // }
    },
    // 点击了搜索条件之后，进行搜索
    handleClickQuery(item) {
      this.clickRobotFirst(item)
      this.searchedQueryLists = []
      this.customerText = ''
      this.queryH = this.getQueryHeight()
    },
    // 用户发送消息
    sentMsg() {
      if (this.sendLock) return
      clearTimeout(this.timer)
      this.showTimer()
      let text = this.customerText.trim()
      if (text != '') {
        this.appendRightInfo(text)
        this.appendRobotMsg(this.customerText)
        this.customerText = ''
        this.sendLock = true // 发送信息之后开启锁
      }
    },
    // 机器人回答消息
    appendRobotMsg(text) {
      clearTimeout(this.timer)
      this.showTimer()
      text = text.trim()
      if (this.stream) {
        // sse
        this.getHistroyListStream(text)
      } else {
        // 全部获取到之后处理
        this.getHistroyList(text).then(result => {
          console.log('result---', result)
          if (this.stream) {
            this.handleStream(result)
          } else {
            this.handleJSON(result)
          }
        })
      }
    },
    /**
     * 将服务端格返回字符串尝试格式化为json
     * @param {String} str
     * @returns
     */
    setParase(str) {
      if (typeof str != 'string') {
        return str
      }
      try {
        return JSON.parse(str.substring(6))
      } catch (error) {
        return str
      }
    },
    // sse
    handleStreamSse(res) {
      console.log('res----', res)
      let result = JSON.parse(res.data);
      // let result = this.setParase(res)
      if (!result || result.code != 20000) {
        if (res.data && res.data.message) {
          this.$message.error(res.data.message)
        }
        return
      }

      if (result.data.answer) {
        console.log('answer---', result.data.answer)
        // this.answerPage = this.answerPage + result.data.answer;
        let valtemp = result.data.answer.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
        this.answerPage = this.answerPage + valtemp
        let obj_r = {
          type: 'leftinfo',
          time: this.getTodayTime(),
          name: 'robot',
          content: this.answerPage,
          question: [],
          activeAbilty: this.activeAbilty,
        }

        this.info.pop() //删除最后一个obj_r_0，重新添加满值
        this.info.push(obj_r)

        this.setLastScrollHeight()
      }

      if (result.data.docs) {
        this.showTyping = false
        this.sendLock = false
      }
    },

    //（文本流式）响应输出为流式时---打印机流式回复
    handleStream(result) {
      this.answerPage = ''
      // 空值填入---使光标闪烁
      let obj_r_0 = {
        type: 'leftinfo',
        time: this.getTodayTime(),
        name: 'robot',
        content: ' ',
        question: [],
        activeAbilty: this.activeAbilty,
      }
      this.info.push(obj_r_0)

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
            console.log('this.answerPage---', this.answerPage)
            let obj_r = {
              type: 'leftinfo',
              time: this.getTodayTime(),
              name: 'robot',
              content: this.answerPage,
              question: []
            }
            // this.info.push(obj_r);
            this.info.pop() //删除最后一个obj_r_0，重新添加满值
            this.startFlow(obj_r)

            this.setLastScrollHeight()
            return
          } else {
            this.answerPage = this.answerPage + parsed.data.answer
          }
        }
      }
    },
    //打字机效果
    startFlow(message) {
      this.info.push({ ...message, content: '' })
      let i = 0
      const msgLength = message.content.length
      const typeNextLetter = () => {
        this.info[this.info.length - 1].content += message.content.charAt(i)
        i++

        this.setLastScrollHeight()

        if (i <= msgLength) {
          setTimeout(typeNextLetter, 100)
        } else {
          clearTimeout(this.intervalId)
          this.showTyping = false
        }
      }
      clearTimeout(this.intervalId)
      this.showTyping = true
      this.intervalId = setTimeout(typeNextLetter, 500)
    },
    // 页面位置定位到最底部
    setLastScrollHeight() {
      this.$nextTick(() => {
        var contentHeight = document.getElementById('content')
        contentHeight.scrollTop = contentHeight.scrollHeight
      })
    },

    // 响应输出格式为json时--直接一次性输出
    handleJSON(result) {
      if (result && result.code == 20000) {
        let obj_r = {
          type: 'leftinfo',
          time: this.getTodayTime(),
          name: 'robot',
          content: result.data.answer,
          question: [],
          activeAbilty: this.activeAbilty,
        }
        this.info.push(obj_r)
        this.setLastScrollHeight()
      } else {
        this.$message.warning(result.message)
      }
    },
    // 右边的问题push进去
    appendRightInfo(val) {
      // 处理xss
      let text = val
        .trim()
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('&lt;br/&gt;', '<br />')
      let obj_r = {
        type: 'rightinfo',
        time: this.getTodayTime(),
        content: text
        // question: []
      }
      this.info.push(obj_r)
      this.setLastScrollHeight()
    },
    // 结束语
    endMsg() {
      let happyEnding = {
        type: 'leftinfo',
        time: this.getTodayTime(),
        content: '退下吧',
        question: []
      }
      this.info.push(happyEnding)
      this.setLastScrollHeight()
    },
    showTimer() {
      // this.timer = setTimeout(this.endMsg, 1000 * 60);
    },
    getTodayTime() {
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
    },
    handleCloseAI() {
      this.$emit('handleCloseAI')
    },
    ToBreak(val) {
      val =
        val &&
        val
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll(' ', '&nbsp;')
          .replaceAll('\n', '<br />')
      return val
    },
    // （json格式）AI回复
    sentMsgJSON() {
      if (this.sendLock) return
      let text = this.customerText.trim().replace(/\n/g, '<br/>')
      if (text != '') {
        this.appendRightInfo(text)
        this.appendRobotMsgJSON(this.customerText)
        this.customerText = ''
        // this.sendLock = true // 发送信息之后开启锁
      }
    },
    // 2个数组交叉合并为新数组
    aryJoinAry(ary1, ary2) {
      let itemAry = []
      let minLength
      if (ary1.length > ary2.length) {
        minLength = ary2.length
      } else {
        minLength = ary1.length
      }
      //将两个数组中较长的数组记录下来
      let longAry = arguments[0].length > arguments[1].length ? arguments[0] : arguments[1]
      //循环范围为较短的那个数组的长度
      for (let i = 0; i < minLength; i++) {
        //将数组放入临时数组中
        itemAry.push(this.ToBreak(ary1[i]))
        itemAry.push('<img width=95% src=' + ary2[i] + '/>' + '<br />')
      }
      let leftContent = longAry.slice(minLength)
      let leftContentNew = []
      for (let j = 0; j < leftContent.length; j++) {
        leftContentNew.push(this.ToBreak(leftContent[j])) //剩下的内容也需要对特殊字符处理
      }
      return itemAry.concat(leftContentNew) //itemAry和多余的新数组拼接起来并返回。
    },
    // （json格式）机器人回复消息
    appendRobotMsgJSON(text) {
      clearTimeout(this.timer)
      this.showTimer()
      text = text.trim()
      let data = {
        query: text,
        project_name: 'utp',
        user_id: this.userId
      }
      request.post(`/robotweb/chat/qa_ops_chat`, data).then(result => {
        if (result && result.code == 20000) {
          if (!result.data) return
          this.answerPage = '' //文本和图片交叉展示
          let answertemp = result.data.answers // 文本
          let imagepathstemp = result.data.image_paths // 图片
          if (!answertemp) answertemp = []
          if (!imagepathstemp) imagepathstemp = []
          let totaltemp = this.aryJoinAry(answertemp, imagepathstemp) //合并为新的
          console.log('totaltemp---', totaltemp)
          totaltemp.forEach(item => {
            this.answerPage = this.answerPage + item
          })
          let obj_r = {
            type: 'leftinfo',
            name: 'robot',
            time: this.getTodayTime(),
            content: this.answerPage,
            question: [],
            activeAbilty: this.activeAbilty,
          }

          this.info.push(obj_r)
          this.setLastScrollHeight()
        } else {
          this.$message.warning(result.message)
        }
      })
    },

    // 切换回复方式
    changeResponse() {
      this.responseState = this.responseState == 1 ? 2 : 1
    },
    // 后端确认回复方式
    getMode(input) {
      if (input) {
        let data = {
          query: input,
          project_name: 'utp'
        }
        return request.post(`/robotweb/knowledge_base/get_mode`, data)
      }
    },
    // 点击单个问题first
    clickRobotFirst(val) {
      this.activeAbilty = 1
      this.getMode(val).then(response => {
        if (response && response.code == 20000) {
          if (response.data) {
            if (this.sendLock) return // 锁住时忽略
            this.appendRightInfo(val)
            let mode = response.data.mode //根据问题获取mode
            if (mode == 1) {
              //文本流式
              this.appendRobotMsg(val)
              this.sendLock = true
            } else if (mode == 2) {
              //图文JSON
              this.appendRobotMsgJSON(val)
            }
          }
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 用户搜索需要区分 不同的启用能力
    sentMsgFirst() {
      if (this.activeAbilty == 1) {
        this.sentMsgFirstOne()
      } else if (this.activeAbilty == 2) {
        this.sendMsgFirstTwo()
      }
    },
    // 用户输入搜索--默认智能问答
    sentMsgFirstOne() {
      if (this.sendLock) return
      let text = this.customerText.trim().replace(/\n/g, '<br/>')
      if (text == '') return
      this.getMode(text).then(response => {
        if (response && response.code == 20000) {
          if (response.data) {
            let mode = response.data.mode //根据问题获取mode
            if (mode == 1) {
              //文本流式
              this.sentMsg()
            } else if (mode == 2) {
              //图文JSON
              this.sentMsgJSON()
            }
          }
        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 用户上传文档后--文档纠错和总结
    sendMsgFirstTwo() {
      if (this.sendLock) return
      let input = this.customerText.trim().replace(/\n/g, '<br/>')
      if (input == '') return
      clearTimeout(this.timer)
      this.showTimer()
      this.appendRightInfo(input)
      this.appendRobotMsgForFile(this.customerText)
      this.customerText = ''
      this.sendLock = true // 发送信息之后开启锁
    },
    //上传文档后，用户发送消息,机器人回复  sse
    appendRobotMsgForFile(text) {
      clearTimeout(this.timer)
      this.showTimer()
      text = text.trim()
      if (this.stream) {
        this.getHistroyListStreamForFile(text)
      }
    },
    // 处理流式输出的数据
    handleStreamSseForFile(res) {
      // console.log('res----', res)
      let result = JSON.parse(res.data);
      // let result = this.setParase(res)
      console.log('res----result', result)

      if (!result || result.code != 20000) {
        if (result.code == 21000) {
          //21000 非报错造成的流式退出
          this.$message.error(result.message)
        } else if (res.data && res.data.message) {
          this.$message.error(res.data.message)
        }
        // 报错后退出锁
        this.showTyping = false
        this.sendLock = false
        this.showCursor = false

        return
      }

      // 思考的过程-流式
      if (result.data.answer) {
        // console.log('answer---', result.data.answer)
        let valtemp = result.data.answer.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
        this.answerPage = this.answerPage + valtemp

      }

      // 最后的结果-非流式
      if (result.data.final_answer) {
        this.final_result = result.data.final_answer

        this.showTyping = false
        this.sendLock = false
        this.showCursor = false

      }
      // let referenceVisibleTemp = 
      // 最后填充
      let obj_r = {
        type: 'leftinfo',
        time: this.getTodayTime(),
        name: 'robot',
        content: this.answerPage,
        final_answer: this.final_result || '', //最终结果
        referenceVisible: this.referenceVisibleLoading,
        activeAbilty: this.activeAbilty,
        question: []
      }
      console.log('obj_r---fffff', obj_r, this.info)
      this.info.pop() //删除最后一个obj_r_0，重新添加满值
      this.info.push(obj_r)

      this.setLastScrollHeight()
    },
    // 文档 sse
    async getHistroyListStreamForFile(input) {
      let _this = this
      let dataInput = {
        query: input,
        project_name: 'utp',
        stream: this.stream, //响应输出是否为流式
        user_id: this.userId
      }
      // 这个接口单独处理
      let urlDev = '/robotweb/chat/agent_chat'
      let urlProd = '/qrobot-web/robotwebchat/chat/agent_chat'
      let url = import.meta.env.VITE_NODE_ENV == 'development' ? urlDev : urlProd

      // 空值填入
      this.answerPage = ''
      this.final_result = '' //初始化结果
      this.referenceVisibleLoading = false //初始化
      let obj_r_0 = {
        type: 'leftinfo',
        time: this.getTodayTime(),
        name: 'robot',
        content: ' ',
        final_result: '', //最终结果
        referenceVisible: this.referenceVisibleLoading,  //默认关闭思考过程展示区
        question: [],
        activeAbilty: this.activeAbilty,
      }
      this.info.push(obj_r_0)
      //使光标闪烁
      this.showTyping = true
      this.showCursor = true //结果展示区
      // // 浏览器支持 SSE
      await fetchEventSource(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": getToken()
        },
        body: JSON.stringify(dataInput),
        async onmessage(event) {
          _this.handleStreamSseForFile(event);
        },
        async onerror(event) {
          console.log("onerror---", event);
          // _this.$message.error("链接失败,请刷新页面后重新尝试");
          return;
        }
      });

    },
    showReference(item) {
      item.referenceVisible = !item.referenceVisible
    }
  }
}
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