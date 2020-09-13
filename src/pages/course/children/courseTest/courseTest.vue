<template>
  <div id="container">
    <div v-if="!isCompleted && seeTest" id="courese-test-title">{{courseTitle}}——章节测试</div>
    <div v-if="isCompleted && seeTest" id="courese-test-top">
      <div class="tip">恭喜您已完成本章节评测，您的评测得分为：</div>
      <div class="score">{{score}}</div>
      <div class="score-unit">分</div>
      <div class="top-split-line"></div>
    </div>
    <div class="tip-no-see" v-if="!seeTest">您暂无查看的权限</div>
  
    <div id="test-list" v-for="(question,quesIndex) in testList" :key="quesIndex">
      <!-- 题目 -->
      <div class="test-item">
        <!-- 问题 -->
        <div class="test-top">
          <span class="test-title">{{quesIndex+1}}、{{question.title}}</span>
          <span class="test-type">{{question.type}}</span>
        </div>
        
        <!-- 选项 -->
        <div class="test-option" v-for="(option,opIndex) in question.options" :key="opIndex" >
            <div class="option-item">
              <!-- 单选多选 选项 -->
              <span v-if="question.type==3" class="option-item-title"> {{option.option_value}}</span>
              <!-- 判断 选项 -->
              <span v-if="question.type!=3" class="option-item-title">{{option.option_key}}.{{option.option_value}}</span>
              <img v-if="!isCompleted" 
              class="option-icon-pic" 
              @click="selectAnswer(question,option,quesIndex,opIndex)" 
              :src="option.iconNum===0?optionIcon[0]:optionIcon[1]">
               <img v-if="isCompleted" 
               class="option-icon-pic"
               :src="option.iconNum===0?optionIcon[0]:option.iconNum===1?optionIcon[1]:optionIcon[2]">
            </div>
          <div class="split-line"></div>
        </div>
        <!-- 解析 -->
        <div v-if="isCompleted&&resultList[quesIndex]" class="test-analysis">答案解析：{{resultList[quesIndex].analy}}</div>
              
      </div>
    </div>

    <button v-if="!isCompleted && seeTest" class="test-submit" @click="handleSubmit">提交测评</button>
  
  </div>
</template>

<script>
import request from '../../../../lib/utils/request'
export default {
  data(){
    return{
      isCompleted:false,
      isLoad:false,//是否完成加载
      course_id: '',
      courseTitle:'',
      testList:[],
      optionIcon:[
        'https://cdn.sc-edu.com/img/2020/08/18/09/2db53b701b701b89107b225af2db1ea1.png',
        'https://cdn.sc-edu.com/img/2020/08/18/09/241ba7f34d1f957567fd8aba26587305.png',
        'https://cdn.sc-edu.com/img/2020/08/18/09/d73fc5fe48930558374681c9ef1bb4a7.png',
      ],
      score:[],
      seeTest:false,//是否有查看测评的权限
      refresh:false,//当用户点击提交后，退到上一级页面时，重新获取课程目录信息
      answerList:[],//记录用户填写完测评后要提交给服务器的题目-答案列表
      resultList:[],
    }
  },
  mounted(){
    /* 页面传递信息 */ 
    this.course_id = this.$mp.query.cid
    this.isCompleted = this.$mp.query.isCompleted==1?true:false
    // this.isCompleted = false
    //如果当前用户已经完成了测评，则用户可以查看测评
    //若用户没有完成测评，则判断用户是否有查看测评的权限，有则展示题目，没有显示用户没有查看的权限
    if(this.isCompleted){
      //获取做完后的题目列表
      this.seeTest  = true
      this.getResult()

    }else{
      this.getQuestionList()
    }
  },
  methods:{ 
    selectAnswer(question,option,quesIndex,opIndex){
      if(question.type === '单选' || question.type === '判断'){
        this.handleSingleChoose(question,option,quesIndex,opIndex)
      }else{
        if(option.iconNum === 0) option.iconNum = 1
        else option.iconNum = 0

      }

    },
    handleSingleChoose(question,option,quesIndex,opIndex){
      //处理单选题和判断题,只能有一个答案是对的
      let index = 0
      for(let i of question.options){
        if(index === opIndex) i.iconNum = 1
        else i.iconNum = 0
        index += 1
      }

    },
    async getQuestionList(){
      let bodyData = {
        api_token:this.$global.token,
        course_id:this.course_id,
        brand_id:this.$global.kingarten_info.brand_id
        // api_token:'c0e9NfsCRar5CDyte0Zab0BdptJQ1IDvUt41MOEKxw',
        // course_id:14,
        // brand_id:52
      }
      let result = await request('/course/ascess/init/',bodyData,'POST')
      console.log(result)
      if(result.state === 1){
        if(result.data.is_limit === 1){
          //判断用户是否有查看测评的权限
          this.seeTest = true
          this.courseTitle = result.data.title
          //处理数据
          this.handleData(result.data.list)
          this.testList = result.data.list
        }else{
          this.seeTest = false
        }     
      }else{
        console.log("courseTest中getQuestionList出错")
      }
    },
    handleData(data){
      for(let question of data){
        if(question.type === '1') question.type = '单选'
        else if(question.type === '2') question.type = '多选'
        else question.type = '判断'
        //当用户未做测试时，给每个option初始化一个字段 iconNum = 0，iconNum = 0未选，iconNum =1已选，iconNum =2 选错
        if(this.isCompleted === false){
          for(let option of question.options){
          option.iconNum = 0
          }
        }else{
          //若用户做过测评，遍历用户的答案
          for(let question of data){
            for(let option of question.result){
              if(option === 'A')  question.options[0].iconNum = 1
              else if(option === 'B') question.options[1].iconNum = 1
              else if(option === 'C') question.options[2].iconNum = 1
              else if(option === 'D') question.options[3].iconNum = 1
              else if(option === 'E') question.options[4].iconNum = 1
              else if(option === 'F') question.options[5].iconNum = 1
              else if(option === 'G') question.options[6].iconNum = 1
              else if(option === 'H') question.options[7].iconNum = 1
              else if(option === 'I') question.options[8].iconNum = 1
              else question.options[9].iconNum = 1
            }
            for(let option of question.options){
              if(option.hasOwnProperty('iconNum') === false) option.iconNum = 0
            }
          }
        }
      }
     
    },
    async getResult(){
      let bodyData = {
        api_token:this.$global.token,
        course_id:this.course_id,
        // api_token:'c0e9NfsCRar5CDyte0Zab0BdptJQ1IDvUt41MOEKxw',
        // course_id:14,
      }
      let result = await request('/course/ascess/view/',bodyData,'POST')
      // console.log(result)
      if(result.state === 1){
        this.score = parseInt(result.data.score)
        this.testList = result.data.list
        this.handleData(this.testList)
        // console.log(this.testList)
        this.resultList = result.data.list
        this.handleSubmitShow(this.resultList)
      }else{
        console.log("courseTest中getResult出错")
      }
      
    },
    checkAnswer(){
      let questionIndex = 1//记录题数
      for(let question of this.testList){
        let zeroNum = 0 //记录该题下用户未选的格式
        let optionLength = question.options.length //记录当前选项的个数
        // console.log(optionLength)
        for(let option of question.options){
          //遍历每个选项，只要有一个iconNum = 1，即退出当前循环
          if(option.iconNum === 1) break
          else{
            zeroNum += 1
            if(zeroNum === optionLength){
              wx.showToast({
                title: `您第${questionIndex}题还未做`,
                icon: 'none',
                duration:2500
              })
              return false
            }
          }
        }
        questionIndex += 1
      }
      return true
    },
    handleAnswer(){
      //处理要提交的答案
      for(let question of this.testList){
        let answer = []
        for(let option of question.options){
          //提取答案
          if(option.iconNum === 1) answer.push(option.option_key)
        }
        answer = answer.join(',')
        this.answerList.push({"key":question.question_id,"value":answer})
      }
      //要要上传的数据josn化
      this.answerList = JSON.stringify(this.answerList) 
    }, 
    async handleSubmit(){
      //处理提交,首先判断用户是否有题漏选
      let isAll = this.checkAnswer()
      if(isAll){
        //处理题目
        this.handleAnswer()
        //提交题目
        let bodyData = {
          api_token:this.$global.token,
          course_id:this.course_id,
          answer:this.answerList,
          // api_token:'c0e9NfsCRar5CDyte0Zab0BdptJQ1IDvUt41MOEKxw',
          // course_id:14
        }
        let result = await request('/course/ascess/result/',bodyData,'POST')
        console.log(result)
        if(result.state === 1){
          this.score = result.data.score
          this.isCompleted = true
          //将结果列表返回到testList上
          this.resultList = result.data.list
          //处理提交后的渲染
          this.handleSubmitShow(this.resultList)
        }else if(result.state === 0){
          wx.showToast({
            title:'您目前尚未完成该课程',
            icon:'none',
            duration:2500
          })
        }else{
          console.log("courseTest中handleSubmit出错")
        }

      }
    },
    handleSubmitShow(resultList){
      console.log(resultList,this.testList)
      let questionIndex = 0
      for(let question of this.testList){
        // console.log("这是问题",questionIndex)
        for(let option of question.options){
          // console.log(option)
          //记录答案中多选题的答案个数
          if(option.iconNum === 0){
            //如果用户未选，判断当前答案列表是否有这个选项，若有，iconNum = 1，否则不做任何操作
            if(resultList[questionIndex].answer.indexOf(option.option_key) !== -1) {
              option.iconNum = 1
            }
          }else{
            //如果用户选择，则判断当前答案列表是否有这个选项，若没有，iconNum = 2，否则不做任何操作
            if(resultList[questionIndex].answer.indexOf(option.option_key) === -1) option.iconNum = 2
          }
         
        }
         questionIndex += 1
        
      }
    }
  },
  onUnload(){
    // console.log("当前页面被销毁")
    if(this.refresh){
      //在页面销毁之前判断上一级页面的课程目录是否需要刷新,并将结果存储到全局变量中
      this.$global.setRefresh(true)
    }
  }
  
}
</script>

<style scoped>
#container{
  width: 100%;
  height: 100%;
}
#courese-test-title{
  margin:16rpx 32rpx 12rpx;
  font-size: 32rpx;
  line-height: 46rpx;
  color: #000000;
}
#courese-test-top{
  position: relative;
  height: 240rpx;
}
.tip{
  position: absolute;
  top:32rpx;
  left:50%;
  margin-left:-234rpx;  
  font-size: 24rpx;
  line-height: 34rpx;
  text-align: center;
  letter-spacing: -0.333333px;
  color: #828282;
}
.score{
  position: absolute;
  top: 74rpx;
  /* left:290rpx; */
  right:330rpx;  
  font-family: DIN Alternate;
  font-weight: bold;
  font-size: 64px;
  line-height: 74px;
  letter-spacing: -0.333333px;
  color: #2570D9;
}
.score-unit{
  position: absolute;
  top: 148rpx;
  left:428rpx;
  bottom: 80.1%;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  letter-spacing: -0.333333px;
  color: #2570D9;
}
.top-split-line{
  position: absolute;
  width: 375px;
  height: 4px;
  left: 0px;
  top: 240rpx;
  background: #F2F2F2;
}
#test-list{
  display: flex;
  flex-direction: column;
  margin:0 32rpx;
}
.test-item{
  margin-top:48rpx;
}
.test-title{
  font-weight: 500;
  font-size: 32rpx;
  line-height: 44rpx;
  font-weight: 500;
  /* text-align: center; */
  color: #333333;
}
.test-type{
  background: #2570D9;
  border-radius: 4rpx;
  padding:2rpx 8rpx;
  font-size: 22rpx;
  line-height: 30rpx;
  text-align: center;
  color: #FFFFFF;
  margin-left:16rpx;
}
.option-item{
  font-size: 28rpx;
  line-height: 40rpx;
  color: #828282;
  margin:16rpx 0;
}
.option-icon-pic{
  position: absolute;
  height:44rpx;
  width:44rpx;
  right:32rpx;

}
.split-line{
  opacity: 0.1;
  border: 1px solid #000000;
}
.test-analysis{
  font-size: 12px;
  line-height: 22px;
  color: #2570D9;
  margin-top: 16rpx;
}
.test-submit{
  margin: 50rpx auto;
  height: 88rpx;
  width: 686rpx;
  background: #2570D9;
  border-radius: 4rpx;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 32rpx;
  line-height: 88rpx;
}
.tip-no-see{
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
  color: #828282;
  font-size: 24rpx;
}




</style>
