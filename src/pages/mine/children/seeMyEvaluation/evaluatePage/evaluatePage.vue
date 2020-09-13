<template>
  <div id="container">
    <EvaluateQuestion 
    :cevaluateList="evaluateList"
    @updateEvaluateList="updateEvaluateList"></EvaluateQuestion>
  </div>
  
</template>

<script>
import EvaluateQuestion from '../../../../../components/evaluate_list/evaluateQuestion'
export default {
  data(){
    return{
      evaluateList:[]
    }

  },
  components:{
    EvaluateQuestion
  },
  methods:{
    updateEvaluateList(updateEvaluateList){
      // console.log("测试点",updateEvaluateList)
      this.evaluateList = updateEvaluateList
      console.log(this.evaluateList)
    }

  },
  mounted(){ 
    if(this.$global.hasEvaluateList === '' || this.$global.hasEvaluateList === false){
      //当用户加载过，就不需要重新获取，记录用户之前的点击行为
      this.evaluateList = JSON.parse(this.$mp.query.evaluateList)
      this.$global.sethasEvaluateList(true)
    }
    

  },
 onShow(){
   console.log("onshow")
   console.log(this.evaluateList)
   

 }
}
</script>

<style scoped>

</style>