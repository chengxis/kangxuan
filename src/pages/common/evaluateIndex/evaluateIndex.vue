<template>
  <div id="container">
    <div id="evaluate-index" v-if="!isEvaluate">
      <img src="https://cdn.sc-edu.com/img/2020/08/17/17/9fa939902977fbab8decc0c8649cd98c.png" alt="">
      <div class="constitude">康轩幼教AI评测系统</div>
      <div class="more-describe">本系统将根据您的评测结果通过AI分析为您推荐合适的课程</div>
      <button class="evaluate-button" @click="startEvaluate" :disabled="canEvaluate?false:true" v-if="!done">开始测评</button>
      <button class="evaluate-button" v-if="done" @click="startEvaluate">查看测评</button>

    </div>
  </div>
  
</template>
<script>
import request from '../../../lib/utils/request'
import {login} from '../../../lib/utils/certification'
export default {
  data(){
    return{
      evaluateList:[],//评测的题目
      brandIdShare:'',//从分享页分享过来brand_id
      brandIduser:'',//用户自己的brandid
      canEvaluate:false,//标记该用户能否进行测评
      aiId:'',//若用户没填写过ai记录，记录ai测评的id
      resultId:'',//若用户已经填写过ai测评，记录ai测评的id
      done:'',//表示用户是否填写过测评，false代表未填写过
      isShowComplte:''
      // test:''
    }
  },
  async mounted(){
    //获取评测的题目
    console.log("mounted")
    this.brandIdShare = JSON.parse(this.$mp.query.brand_id)
    let result = await login()
    // console.log(result)
    this.brandIduser = result.brand_id
    // if(result.brand_id === this.brandIdShare){
      //当用户的brand_id和园长分享过来的id相同时，才有资格进行答题
    this.getEvaluateSubject()
       
    // }else{
    //   wx.showToast({
    //     title:"您不是此幼儿园的教师",
    //     icon:"none",
    //     duration:2500
    //   })
    // }
     
  },
  methods:{
    startEvaluate(){
      wx.navigateTo({
        url: '/pages/common/doEvaluate/main?evaluateList='+JSON.stringify(this.evaluateList)+
        '&&aiId='+JSON.stringify(this.aiId)+'&&done='+JSON.stringify(this.done)+
        '&&isShowComplte='+JSON.stringify(this.isShowComplte), 
      })
      
    },
    handleDate(serverData){
      //将从服务器获取来的数据做一些处理
      for(let i of serverData){
        if(i.type === '1') i.type = '单选题'
        else i.type = '多选题'
        if(i.hasOwnProperty('answer')){
          //若serverData中有answer时，将answer的答案赋值给isSelect(用户做过题了)
          let optionLength = i.options.length
          let answerLength = i.answer.length
          // console.log(optionLength,answerLength)
          //遍历答案，若答案为A，则将对应options的第一个的isSelect置为true，后面依次
          for(let j = 0;j < answerLength;j++){
            if(i.answer[j] === 'A') {i.options[0].isSelect = true}
            else if(i.answer[j] === 'B') i.options[1].isSelect = true
            else if(i.answer[j] === 'C') i.options[2].isSelect = true
            else if(i.answer[j] === 'D') i.options[3].isSelect = true
            else if(i.answer[j] === 'E') i.options[4].isSelect = true
            else if(i.answer[j] === 'F') i.options[5].isSelect = true
            else if(i.answer[j] === 'G') i.options[6].isSelect = true
            else i.options[7].isSelect === true        
          }
          for(let j of i.options){
            //遍历options，如果option没有isSelect，说明它未被选中
            if(j.hasOwnProperty('isSelect')===false) j.isSelect = false
          }
        }else{
          for(let j of i.options){
            //为每个题目的options增加一个字段值isSelect,用于标记用户的选择，默认都为false
          
            j.isSelect = false
          } 
        }    
      }
        
    },
    async getEvaluateSubject(){
      //用户未进行评测时，获取评测的题目，需要用户填写答案
      let body_data = {
        api_token:this.$global.token,
        brand_id:this.brandIdShare
      }
      let result = await request('/ai/init/',body_data,'POST')
      if(result.state === 1){
          this.canEvaluate = true
        // console.log(result.data.is_suc)
        if(result.data.is_suc === 0){
          //若is_suc=0代表用户做过测评,则获取做过评测列表
          this.getDoAitest(result.data.result_id)
        }else{
          this.handleDate(result.data.list)
          this.evaluateList = result.data.list
          this.aiId = result.data.ai_id
          this.done = false
          this.isShowComplte = true
        }
        // console.log("测试点",this.evaluateList)
      }else if(result.state === 0){
        this.canEvaluate = false
        // console.log(result.message)
        wx.showToast({
          title: result.message,
          icon: 'none',
          duration:2000})
      }else{
        console.log("seeMyEvaluation里getEvaluateSubject出错")
      }
    },
    async getDoAitest(id){
      //获取已经做过的ai测试题
      let body_data = {
        api_token:this.$global.token,
        result_id:id
      }
      let result = await request('/ai/view/',body_data,'POST')
      // console.log("测试点",result)
      if(result.state === 1){
        this.handleDate(result.data.list)
        this.evaluateList = result.data.list
        // console.log("测试点2",this.evaluateList)
        //用户填写过测评
        this.done = true
        this.isShowComplte = true
      }
    }
  }

}
</script>
<style scoped>
#evaluate-index{
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#evaluate-index img{
  width: 636rpx;
  height: 564rpx;
  margin-bottom: 60rpx;
  margin-top: 60rpx;
}
.constitude{
  font-family: Ping Fang SC;
  font-weight: 500;
  font-size: 32rpx;
  line-height: 44rpx;
  color:#333333;
  margin-bottom: 24rpx;
}
.more-describe{
  font-family: Ping Fang SC;
  line-height: 34rpx;
  font-size: 24rpx;
  margin-bottom: 300rpx;
  color: #828282;
}
.evaluate-button{
  width: 686rpx;
  line-height: 88rpx;
  background: #2570D9;
  text-align: center;
  border-radius: 4rpx;
  font-family: Ping Fang SC;
  font-weight: 600;
  font-size: 32rpx;
  color:#FFFFFF
}

</style>