<template>
  <div id="container">
    <EvaluateQuestion 
    :cevaluateList="evaluateList"
    :caiId="aiId"
    :cdone="done"
    cisShowComplte="isShowComplte"
    @updateEvaluateList="updateEvaluateList"></EvaluateQuestion>
  </div>
  
</template>

<script>
import EvaluateQuestion from '../../../components/evaluate_list/evaluateQuestion'
export default {
  data(){
    return{
      evaluateList:[],
      aiId:'',
      done:'',
      isShowComplte:''//这4个值都是从evaluateIndex传过来的

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
      this.aiId = JSON.parse(this.$mp.query.aiId)
      this.done = JSON.parse(this.$mp.query.done)
      this.isShowComplte = JSON.parse(this.$mp.query.isShowComplte)
      this.$global.sethasEvaluateList(true)
    }
    

  },
 onShow(){
  //  console.log("onshow")
  //  console.log(this.evaluateList)
   

 }
}
</script>

<style scoped>

</style>