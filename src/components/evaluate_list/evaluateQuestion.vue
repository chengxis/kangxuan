<template>
  <!-- 这里主要是对题目的渲染-->
  <div id="container">
    <div class="no-evaluate" v-if="caiId===-2">
      <img src="https://cdn.sc-edu.com/img/2020/08/17/17/9fa939902977fbab8decc0c8649cd98c.png" alt="">
      <div class="no-evaluate-describe">您没有已完成的测评，赶快联系园长发放测评吧</div>
      <div class="goto-index-button" @click="backIndex">返回首页</div>
    </div>
    <ul class="question-list" v-if="caiId!==-2">
      <li class="question-item" v-for="question in cevaluateList" :key="question.question_id">
        <div class="question">{{question.title}}</div>
        <div class="type">{{question.type}}</div>
        <div class="answer-list">
          <div class="answer-item" v-for="(answer,index2) in question.options" :key="index2">
            <div class="options">{{answer.option_value}}</div>
              <img class="select-icon"
              v-if="!cdone"
              :src="answer.isSelect===true?'https://cdn.sc-edu.com/img/2020/08/14/18/41d3a03ecb164a76a7344b0839b1d796.png':'https://cdn.sc-edu.com/img/2020/08/14/18/f1db72e96122693e1240a35ea53e1a66.png'"
              @click="choseAnswer(question,answer)">
              <img class="select-icon"
              v-if="cdone"
              :src="answer.isSelect===true?'https://cdn.sc-edu.com/img/2020/08/14/18/41d3a03ecb164a76a7344b0839b1d796.png':'https://cdn.sc-edu.com/img/2020/08/14/18/f1db72e96122693e1240a35ea53e1a66.png'">  
            <div class="underline"></div>
          </div>
        </div>

      </li>
    </ul>
    <button class="submit-evaluate" v-if="!cdone&&caiId!==-2"
    @click="submitEvaluate" :style="cisShowComplte?'display:block':'display:none'">提交评测</button>
    <button class="submit-evaluate" v-if="cdone&&caiId!==-2"
    @click="backIndex" :style="cisShowComplte?'display:block':'display:none'">前往首页</button>
  </div>
  
</template>
<script>
import request from '../../lib/utils/request'
export default {
  data(){
    return{
      evaluateResult:[],//存放需要提交给接口的测评结果数据
      

    }
  },
  props:{
    cevaluateList:Array,
    caiId:Number,//若用户未做过测评，这是测评的id,若caiId=-1，则代表该用户已做过测评,若caiId=-2代表用户未做过测评，且并非点击园长分享的链接准备进行测评
    cdone:Boolean,
    cisShowComplte:Boolean//用于判断页面数据是否返回完成
  },
  methods:{
    handleSelectType(question,id){
      //用于判断是单选还是多选，若单选只可选择一个,多选可选择多个
      if(question.type==='单选题'){
        for(let i of question.options){
          //对于单选题，id记录当前用户点击的选项，其他选项的isSelect均设置为false
          if(i.option_key !== id) i.isSelect = false
        }

      }
    },
    choseAnswer(question,answer){
      answer.isSelect = ! answer.isSelect
      //selectId用于记录当前用户选择选项
      let selectId = answer.option_key
      console.log('选择',question.question_id,answer.option_value)
      this.handleSelectType(question,selectId)
    },
    checkOptions(){
      //这里判断是否每个地方是否都被选择，若用户答题存在遗漏则提示用户答完题，否则返回用户的选择数据
      let num = 0;//用于记录用户做到第几题
      for(let i of this.cevaluateList){
        //记录当前选项的个数和false的个数，当false的个数与当前选项的格式相同时，表示用户该题未做
        num += 1
        let opNum = i.options.length
        let falseNum = 0
        for(let j of i.options){
          if(j.isSelect === true) break
          else {
            falseNum += 1
            if(falseNum === opNum){
              console.log("测试")
              wx.showToast({
                title: `您第${num}题还没选择`,
                icon: 'none',
                duration:2000
              })
              return false
            }    
          }        
        }
      }
      return true
      
    },
    handleSubmitDate(){
      //isAll判断用户的需要填写的选项是否填写完整，填写完整后则进行数据处理
      let isAll = this.checkOptions()
      if(isAll){
        for(let i of this.cevaluateList){
          let answer = []
          for(let j of i.options){
            //获取答案
            if(j.isSelect === true){
              answer.push(j.option_key)
            }         
          }
          answer = answer.join(',')
          this.evaluateResult.push({"key":i.question_id,"value":answer})     
        }
        this.evaluateResult = JSON.stringify(this.evaluateResult)
      }
    },
    async submitEvaluate(){
      this.handleSubmitDate()
      // console.log("测试点",this.evaluateResult)
      let body_data = {
        api_token:this.$global.token,
        ai_id:this.caiId,
        answer:this.evaluateResult
      }
      // console.log("测试点2",body_data)
      let result = await request('/ai/result/',body_data,'POST')
      // console.log(result)
      if(result.state === 1){
        await wx.showToast({
          title:'测评提交成功',
          icon:'success',
          duration:2500
        })
        wx.switchTab({
          url: '/pages/index/main'
        })
      }else{
        console.log("evaluateQueation模块提交测评失败")
      }

    },
    backIndex(){
      wx.switchTab({
        url: '/pages/index/main'
      })
    }
  },
  mounted(){


  },

  onUnload(){
    // console.log("unload")
    // console.log(this.cevaluateList)
    this.$emit("updateEvaluateList",this.cevaluateList)
  }

  
}
</script>
<style  scoped>
.container{
  position: relative;
}
.question-list{
  position: relative;
  margin-top: 42rpx;
}
.question-item{
  position: relative;
  margin-left: 32rpx;
}
.question{
  font-family: Ping Fang SC;
  font-size: 32rpx;
  line-height: 44rpx;
  color: #333333;
  margin-right: 16rpx;
  display: inline-block;
  margin-top: 6rpx;
  margin-bottom: 32rpx;

}
.type{
  display: inline-block;
  /* width: 44rpx; */
  height: 30rpx;
  line-height: 30rpx;
  background: #2570D9;
  color: #FFFFFF;
  font-size: 22rpx;
  text-align: center;
  font-family: Ping Fang SC;
  padding: 0 4rpx;
}
.options{
  display: inline-block;
  font-family: Ping Fang SC;
  font-size: 28rpx;
  line-height: 40rpx;
  color: #828282;
}
.select-icon{
  width: 44rpx;
  height: 44rpx;
  position: absolute;
  right: 32rpx;
  margin-top: 0rpx;
}
.underline{
  width: 686rpx;
  border: 2rpx solid #000000;
  opacity: 0.1;
  margin-top: 16rpx;
  margin-bottom: 42rpx;
}
.submit-evaluate{
  margin-top: 50rpx;
  margin-bottom: 32rpx;
  background: #2570D9;
  width: 686rpx;
  line-height: 88rpx;
  border-radius: 4rpx;
  font-family: Ping Fang SC;
  font-weight: 600;
  text-align: center;
  font-size: 32rpx;
  color: #FFFFFF;
}
.no-evaluate{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .no-evaluate img{
    width: 566rpx;
    height: 398rpx;
    margin-left: 92rpx;
    margin-top: 32rpx;
  }
  .no-evaluate-describe{
    margin-top: 64rpx;
    line-height: 44rpx;
    font-size: 32rpx;
    font-family: Ping Fang SC;
    color: #333333;
  }
  .goto-index-button{
    width: 686rpx;
    height: 88rpx;
    line-height: 88rpx;
    background: #2570D9;
    border-radius: 4rpx;
    text-align: center;
    color: #FFFFFF;
    font-weight: 500;
    font-size: 32rpx;
    margin-top: 54rpx;

  }




</style>