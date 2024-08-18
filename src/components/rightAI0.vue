<!--
 * @Descripttion:智能客服机器人-同时支持页面操作
 * @Author: erised
 * @Date: 2024-03-04 10:56:40
-->
<template>
  <div class="container">
    <!-- <div class="title_AI">
      <span>AI智能助手</span>
      <span class="closeAI_img" @click="handleCloseAI">
        <i class="el-icon-close"></i>
      </span>
    </div> -->
    <div class="main">
      <div class="box">
        <div id="content" class="content">
          <div v-for="(item, index) in info" :key="index">
            <div class="info_r info_default" v-if="item.type == 'leftinfo'">
              <span class="circle circle_r">
                <img src="./../assets/AI.png" class="el-icon-s-custom" />
              </span>
              <div class="con_r con_text">
                <div class="chat-bubble transform" v-if="showTyping && index === info.length - 1">
                  <!-- <div style="white-space: pre-wrap;">{{ item.content }}</div> -->
                  <div v-html="item.content"></div>
                </div>
                <div class="chat-bubble" v-else>
                  <div v-html="item.content"></div>
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
                <span class="con_l">{{ item.content }}</span>
              </div>
              <div class="time_l">{{ item.time }}</div>
            </div>
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
            <el-button class="sendBtn" @click="sentMsgFirst()" type="primary">发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import axios from 'axios'
import request from '@/utils/request'
import { fetchEventSource } from "@microsoft/fetch-event-source";
export default {
  name: "right-AI",
  components: {},
  data() {
    return {
      responseState: 1,
      sendLock: false,
      queryH: {
        height: "0px",
        top: "0px"
      },
      searchedQueryLists: [],
      showTyping: false,
      intervalId: null,
      answerPage: "",
      stream: true,
      dialogVisible: false,
      customerText: "",
      info: [
        {
          type: "leftinfo",
          time: this.getTodayTime(),
          name: "robot",
          content:
            "您好，欢迎使用移动云测试平台，为保证信息安全，请勿在会话过程中透露账号密码等敏感信息",
          question: []
        }
      ],
      timer: null,
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
          content: "平台的邮箱出现问题应该找谁处理",
          index: 2
        },
        {
          id: 3,
          content: "忘记平台密码，在哪里修改呢？",
          index: 3
        },
        {
          id: 4,
          content: "测试报告发送审核发不出去",
          index: 4
        },
        {
          id: 5,
          content: "在平台跑接口测试时，怎么设置超时时间？",
          index: 5
        }
      ]
    };
  },
  computed: {
    userId() {
      return JSON.parse(sessionStorage.getItem('userInfo')).userId
    }
  },
  created() {
    this.showTimer();
    this.getFrequentQuestions().then(response => {
      if (response && response.code == 20000) {
        let datatemp = response.data
        let Qlist = []
        datatemp.forEach((item, index) => {
          Qlist.push(
            {
              id: index + 1,
              content: item,
              index: index + 1
            }
          )
        })
        this.robotQuestion = Qlist;
      } else {
        // this.robotQuestion = this.robotQuestionTotal;
        this.robotQuestion = [];
      }
      if (this.robotQuestion.length == 0) return
      let answerText = "您可能想问：";
      let obj = {
        type: "leftinfo",
        time: this.getTodayTime(),
        name: "robot",
        content: answerText,
        question: this.robotQuestion
      };
      this.info.push(obj);
      this.setLastScrollHeight();

    });

  },
  watch: {
    dialogVisibleRobot: {
      handler(val, oldVal) { }
    },
    customerText: {
      handler(val, oldVal) {
        // if (val) {
        this.searchQuery(val);
        // } else {
        //   this.searchedQueryLists = [];
        //   this.queryH = {
        //     height: "0px",
        //     top: "0px"
        //   }
        // }
      }
    }
  },
  mounted() {
    this.queryH = this.getQueryHeight();
  },
  methods: {
    // 获取联想高度
    getQueryHeight() {
      if (this.searchedQueryLists.length == 0) {
        return {
          height: "0px",
          top: "0px"
        };
      } else if (this.searchedQueryLists.length == 1) {
        return {
          height: "30px",
          top: "-30px"
        };
      } else if (this.searchedQueryLists.length == 2) {
        return {
          height: "60px",
          top: "-60px"
        };
      } else if (this.searchedQueryLists.length == 3) {
        return {
          height: "90px",
          top: "-90px"
        };
      } else {
        return {
          height: "100px",
          top: "-100px"
        };
      }
    },
    // 获取高频问题
    getFrequentQuestions() {
      let data = {
        project_name: "utp",
        top_k: 4, //匹配相似问题的数目
        days: 7, //从当前时间往前退days天数
      };
      return request.post(`/robotweb/knowledge_base/get_frequent_querys`, data)

    },
    // 获取机器人答复
    getHistroyList(input) {
      let data = {
        query: input,
        project_name: "utp",
        top_k: 1,
        score_threshold: 0.5,
        stream: this.stream, //响应输出是否为流式
        model_name: "Qwen-72B-Chat-Int8",
        temperature: 0.1,
        max_tokens: 0,
        prompt_name: "answer",
        user_id: this.userId
      };
      return request.post(`/robotwebchat/chat/qa_chat`, data);
    },
    // sse
    async getHistroyListStream(input) {
      let _this = this;
      let dataInput = {
        query: input,
        project_name: "utp",
        top_k: 1,
        score_threshold: 0.5,
        stream: this.stream, //响应输出是否为流式
        model_name: "Qwen-72B-Chat-Int8",
        temperature: 0.1,
        max_tokens: 0,
        prompt_name: "answer",
        user_id: this.userId
      };
      let url = "/robotwebchat/chat/qa_chat";

      // 空值填入
      this.answerPage = "";
      let obj_r_0 = {
        type: "leftinfo",
        time: this.getTodayTime(),
        name: "robot",
        content: " ",
        question: []
      };
      this.info.push(obj_r_0);
      //使光标闪烁
      this.showTyping = true;

      // 浏览器支持 SSE
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
    },
    // 输入联想
    searchQuery(input) {
      // if (input) {
      let data = {
        query: input,
        project_name: "utp",
        top_k: 5, //匹配相似问题的数目
        score_threshold: 0.5
      };
      request
        .post(`/robotweb/knowledge_base/search_querys_multi`, data)
        .then(response => {
          if (response && response.code == 20000) {
            this.searchedQueryLists = response.data;
            this.queryH = this.getQueryHeight();
            // 前端强制处理
            if (!input) {
              this.searchedQueryLists = [];
              this.queryH = {
                height: "0px",
                top: "0px"
              }
            }
          } else {
            this.searchedQueryLists = [];
            this.queryH = this.getQueryHeight();
          }
        });
      // } else {
      //   this.searchedQueryLists = [];
      //   this.queryH = this.getQueryHeight();
      //   console.log('input--',input)
      // }
    },
    // 点击了搜索条件之后，进行搜索
    handleClickQuery(item) {
      this.clickRobotFirst(item);
      this.searchedQueryLists = [];
      this.customerText = "";
      this.queryH = this.getQueryHeight();
    },
    // 用户发送消息
    sentMsg() {
      if (this.sendLock) return;
      clearTimeout(this.timer);
      this.showTimer();
      let text = this.customerText.trim();
      if (text != "") {
        this.appendRightInfo(text)
        this.appendRobotMsg(this.customerText);
        this.customerText = "";
        this.sendLock = true; // 发送信息之后开启锁
      }
    },
    // 机器人回答消息
    appendRobotMsg(text) {
      clearTimeout(this.timer);
      this.showTimer();
      text = text.trim();
      if (this.stream) {
        // sse
        this.getHistroyListStream(text);
      } else {
        // 全部获取到之后处理
        this.getHistroyList(text).then(result => {
          console.log("result---", result);
          if (this.stream) {
            this.handleStream(result);
          } else {
            this.handleJSON(result);
          }
        });
      }
    },
    // sse
    handleStreamSse(res) {
      let result = JSON.parse(res.data);
      if (!result || result.code != 20000) {
        this.$message.error(res.data.message);
        return;
      }

      if (result.data.answer) {
        console.log("answer---", result.data.answer);
        // this.answerPage = this.answerPage + result.data.answer;
        let valtemp = result.data.answer.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
        this.answerPage = this.answerPage + valtemp;
        let obj_r = {
          type: "leftinfo",
          time: this.getTodayTime(),
          name: "robot",
          content: this.answerPage,
          question: []
        };

        this.info.pop(); //删除最后一个obj_r_0，重新添加满值
        this.info.push(obj_r);

        this.setLastScrollHeight();
      }

      if (result.data.docs) {
        this.showTyping = false;
        this.sendLock = false;
      }
    },

    //（文本流式）响应输出为流式时---打印机流式回复
    handleStream(result) {
      this.answerPage = "";
      // 空值填入---使光标闪烁
      let obj_r_0 = {
        type: "leftinfo",
        time: this.getTodayTime(),
        name: "robot",
        content: " ",
        question: []
      };
      this.info.push(obj_r_0);

      if (result.includes("\r\n") > -1) {
        let lines = result
          .toString()
          .split("\r\n")
          .filter(line => line.trim() !== "");

        for (const line of lines) {
          const parsed_0 = line.replace("data: ", "");
          const parsed = JSON.parse(parsed_0);
          console.log("parsed----", parsed);
          if (parsed.code != 20000 || !parsed.data) return;
          if (parsed.data && parsed.data.docs && parsed.data.docs.length > 0) {
            console.log("this.answerPage---", this.answerPage);
            let obj_r = {
              type: "leftinfo",
              time: this.getTodayTime(),
              name: "robot",
              content: this.answerPage,
              question: []
            };
            // this.info.push(obj_r);
            this.info.pop(); //删除最后一个obj_r_0，重新添加满值
            this.startFlow(obj_r);

            this.setLastScrollHeight();
            return;
          } else {
            this.answerPage = this.answerPage + parsed.data.answer;
          }
        }
      }
    },
    //打字机效果
    startFlow(message) {
      this.info.push({ ...message, content: "" });
      let i = 0;
      const msgLength = message.content.length;
      const typeNextLetter = () => {
        this.info[this.info.length - 1].content += message.content.charAt(i);
        i++;

        this.setLastScrollHeight();

        if (i <= msgLength) {
          setTimeout(typeNextLetter, 100);
        } else {
          clearTimeout(this.intervalId);
          this.showTyping = false;
        }
      };
      clearTimeout(this.intervalId);
      this.showTyping = true;
      this.intervalId = setTimeout(typeNextLetter, 500);
    },
    // 页面位置定位到最底部
    setLastScrollHeight() {
      this.$nextTick(() => {
        var contentHeight = document.getElementById("content");
        contentHeight.scrollTop = contentHeight.scrollHeight;
      });
    },

    // 响应输出格式为json时--直接一次性输出
    handleJSON(result) {
      if (result && result.code == 20000) {
        let obj_r = {
          type: "leftinfo",
          time: this.getTodayTime(),
          name: "robot",
          content: result.data.answer,
          question: []
        };
        this.info.push(obj_r);
        this.setLastScrollHeight();
      } else {
        this.$message.warning(result.message);
      }
    },
    // 右边的问题push进去
    appendRightInfo(val) {
      // 处理xss
      let text = val.trim().replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("&lt;br/&gt;", "<br />")
      let obj_r = {
        type: "rightinfo",
        time: this.getTodayTime(),
        content: text,
        // question: []
      };
      this.info.push(obj_r);
      this.setLastScrollHeight();
    },
    // 结束语
    endMsg() {
      let happyEnding = {
        type: "leftinfo",
        time: this.getTodayTime(),
        content: "退下吧",
        question: []
      };
      this.info.push(happyEnding);
      this.setLastScrollHeight();
    },
    showTimer() {
      // this.timer = setTimeout(this.endMsg, 1000 * 60);
    },
    getTodayTime() {
      // 获取当前时间
      var day = new Date();
      let seconds = day.getSeconds();
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      let minutes = day.getMinutes();
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      let time =
        day.getFullYear() +
        "-" +
        (day.getMonth() + 1) +
        "-" +
        day.getDate() +
        " " +
        day.getHours() +
        ":" +
        minutes +
        ":" +
        seconds;
      return time;
    },
    handleCloseAI() {
      this.$emit("handleCloseAI");
    },
    ToBreak(val) {
      val = val && val.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(" ", "&nbsp;").replaceAll("\n", "<br />");
      return val
    },
    // （json格式）AI回复
    sentMsgJSON() {
      if (this.sendLock) return
      let text = this.customerText.trim().replace(/\n/g, '<br/>');
      if (text != "") {
        this.appendRightInfo(text)
        this.appendRobotMsgJSON(this.customerText);
        this.customerText = "";
        // this.sendLock = true // 发送信息之后开启锁
      }
    },
    // 2个数组交叉合并为新数组
    aryJoinAry(ary1, ary2) {
      let itemAry = [];
      let minLength;
      if (ary1.length > ary2.length) {
        minLength = ary2.length;
      } else {
        minLength = ary1.length;
      }
      //将两个数组中较长的数组记录下来
      let longAry = arguments[0].length > arguments[1].length ? arguments[0] : arguments[1];
      //循环范围为较短的那个数组的长度
      for (let i = 0; i < minLength; i++) {
        //将数组放入临时数组中
        itemAry.push(this.ToBreak(ary1[i]));
        itemAry.push("<img width=95% src=" + ary2[i] + "/>" + "<br />")
      }
      let leftContent = longAry.slice(minLength)
      let leftContentNew = []
      for (let j = 0; j < leftContent.length; j++) {
        leftContentNew.push(this.ToBreak(leftContent[j])); //剩下的内容也需要对特殊字符处理
      }
      return itemAry.concat(leftContentNew);//itemAry和多余的新数组拼接起来并返回。
    },
    // （json格式）机器人回复消息
    appendRobotMsgJSON(text) {
      clearTimeout(this.timer);
      this.showTimer();
      text = text.trim();
      let data = {
        query: text,
        project_name: "utp",
        user_id: this.userId
      };
      request.post(`/robotweb/chat/qa_ops_chat`, data).then(result => {
        if (result && result.code == 20000) {
          if (!result.data) return
          this.answerPage = ""; //文本和图片交叉展示
          let answertemp = result.data.answers  // 文本
          let imagepathstemp = result.data.image_paths // 图片
          if (!answertemp) answertemp = []
          if (!imagepathstemp) imagepathstemp = []
          let totaltemp = this.aryJoinAry(answertemp, imagepathstemp) //合并为新的
          console.log('totaltemp---', totaltemp)
          totaltemp.forEach(item => { this.answerPage = this.answerPage + item })
          let obj_r = {
            type: "leftinfo",
            name: "robot",
            time: this.getTodayTime(),
            content: this.answerPage,
            question: []
          };

          this.info.push(obj_r);
          this.setLastScrollHeight();

        } else {
          this.$message.warning(result.message)
        }

      });

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
          project_name: "utp",
        };
        return request.post(`/robotweb/knowledge_base/get_mode`, data)
      }
    },
    // 点击单个问题first
    clickRobotFirst(val) {
      this.getMode(val).then(response => {
        if (response && response.code == 20000) {
          if (response.data) {
            if (this.sendLock) return; // 锁住时忽略 
            this.appendRightInfo(val)
            let mode = response.data.mode //根据问题获取mode
            if (mode == 1) { //文本流式
              this.appendRobotMsg(val);
              this.sendLock = true;
            } else if (mode == 2) { //图文JSON
              this.appendRobotMsgJSON(val);
            }
          }

        } else {
          this.$message.error(response.message)
        }
      })
    },
    // 用户输入搜索
    sentMsgFirst() {
      if (this.sendLock) return
      let text = this.customerText.trim().replace(/\n/g, '<br/>');
      if (text == "") return
      this.getMode(text).then(response => {
        if (response && response.code == 20000) {
          if (response.data) {
            let mode = response.data.mode //根据问题获取mode
            if (mode == 1) { //文本流式
              this.sentMsg()
            } else if (mode == 2) { //图文JSON
              this.sentMsgJSON()
            }
          }
        } else {
          this.$message.error(response.message)
        }
      })

    },
  }
};
</script>
<style lang="less" scoped>
.container {
  box-shadow: 0 0 20px 1px rgba(19, 41, 75, 0.2);
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
    // border-top: 1px solid #ccc;
    overflow: hidden;
    background-color: #f8f8f8;

    .box {
      width: 100%;
      height: calc(100% - 122px);
      position: relative;

      #content {
        // height: 400px;
        height: 99%;
        overflow-y: scroll;
        width: 100%;
        background: #f4f2f5;
        padding: 10px;

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
            width: 65%;
            background: #fff;
            border-radius: 4px 20px 20px 20px !important;
            padding: 12px 16px;
            padding: 10px;
            margin-left: 40px;
            max-width: 91%;
            white-space: normal;
            word-break: break-all;

            .chat-bubble {
              color: #333;
              display: inline-block;
              word-break: break-word;
            }

            .remind {
              color: #000;
              // font-weight: bold;
              font-size: 14px;
            }

            .transform ::after {
              content: "|";
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
          }
        }

        .info_l {
          text-align: right;
          color: #ffffff;
          color: #3163c5;
          margin-bottom: 12px;
          width: 55%;
          margin-left: 45%;

          .time_l {
            color: #999999;
            margin-top: 5px;
          }

          .con_l {
            display: inline-block;
            background-color: rgba(225, 236, 255, 1);
            color: #337DFF;
            border-radius: 20px 4px 20px 20px;
            padding: 5px 12px;
            text-align: left;

            white-space: normal;
            word-break: break-all;
          }
        }
      }
    }
  }

  .setproblem {
    border: 1px solid #d9d9d9;
    width: 100%;
    height: 130px;
    background: #fff;
    position: relative;
    margin-top: 0rem;
    padding: 10px;
    box-sizing: border-box;

    .rewrite-input {
      // border: 1px solid #d9d9d9;
      height: 100px;

      textarea {
        padding: 10px;
        box-sizing: border-box;
        height: 60%;
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
        }
      }
    }
  }
}



.czkj-question-msg {
  float: left;
  // color: #555;
  color: #3163c5;
}

.czkj-question-msg:hover {
  color: #3163c5;
}

.reference {
  background: rgb(243, 245, 252);
  padding: 6px 10px;
  display: inline-block;
  border-radius: 6px;
  margin-bottom: 10px;
}
</style>