<template>
  <div id="container">
    <EvaluateQuestion 
    :cevaluateList="evaluateList"
    :caiId="aiId"
    :cdone="done"
    :cisShowComplte="isShowComplte"
    @updateEvaluateList="updateEvaluateList">
    </EvaluateQuestion>
  </div>
</template>
<script>
import EvaluateQuestion from '../../../../../components/evaluate_list/evaluateQuestion'
import request from '../../../../../utils/request'

export default {
  data(){
    return{
      evaluateList:'',
      resultId:'',//记录测评传过来的id
      aiId:'',
      done:'',
      isShowComplte:false,
     
    }
  },
  components:{
    EvaluateQuestion
  },
  mounted(){
    // console.log("mounted")
    this.resultId = JSON.parse(this.$mp.query.id)
    this.getDoAitest()
 
  },
  methods:{
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
          // for(let j = 0;j<answerLength;j++){
          //   console.log(i.answer[j] === 'A') i.options[0].isSelect = true
          // }

          for(let j = 0;j < answerLength;j++){
            if(i.answer[j] === 'A') i.options[0].isSelect = true
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
        }
      }
      // console.log(serverData)
      // console.log("eenne")
      },
    updateEvaluateList(updateEvaluateList){
      //console.log("测试点",updateEvaluateList)
      this.evaluateList = updateEvaluateList
      console.log(this.evaluateList)
    },
    async getDoAitest(){
      //获取已经做过的ai测试题
      let body_data = {
        api_token:this.$global.token,
        result_id:this.resultId
      }
      console.log(body_data)
      let result = await request('/ai/view/',body_data,'POST')
      console.log(result)
      if(result.state === 1){
        this.handleDate(result.data.list)
        // console.log("测试点4")
        this.evaluateList = result.data.list
        this.done = true
        this.aiId = -1
        this.isShowComplte = true
      }else{
        console.log("seeMyEvaluation中获取ai测试题失败")
      }
    }
   
  },
  
}
</script>
<style scoped>


</style>