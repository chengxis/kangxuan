<template>
  <div id="container">
    <div class="table">
      <div class="tr">
        <span class="th">教师姓名</span>
        <!-- <span class="th">推荐课程</span> -->
        <span class="th">提交时间</span>
      <!-- <span class="th">总考分</span> -->
      </div>
      <div class="tr" v-for="(teacher,teacherIndex) in evaluateList " 
          :key="teacherIndex"
          @click="seeEvaluateDetail(teacher.result_id)">
        <span class="td">{{teacher.name}}</span>
        <!-- <span class="td">{{teacher.title}}</span> -->
        <span class="td">{{teacher.add_time}}</span>
      </div>
    </div>
    
  </div>
</template>
<script>
export default {
  data(){
    return{
      evaluateList:[]

    }
  },
  methods:{
    seeEvaluateDetail(id){
      wx.navigateTo({
        url: '/pages/mine/children/courseRecommand/evaluateDetail/main?id='+JSON.stringify(id)
      })
    } 
  },
 
  onShow(){
    //接受从课程推荐传过来的参数
    this.evaluateList = JSON.parse(this.$mp.query.evaDetail)
    console.log("测试点",this.evaluateList)
  }
  
}
</script>
<style scoped>
  #container{
    margin: auto;
    text-align: center;
  }
  .table{
    margin-top: 32rpx;
  }
  .table .tr:nth-child(2n+1){
    background: #FAFCFF;
  }
  .table .tr .th{
    display: inline-block;
    width: 230rpx;
    line-height: 88rpx;
    font-family: Ping Fang SC;
    font-weight: 600;
    font-size: 28rpx;
    color: #333333;
    text-align: center;
  }
  .table .tr .td{
    display: inline-block;
    width: 230rpx;
    line-height: 88rpx;
    color: #4f4f4f;
    font-size: 22rpx;
    font-family: Ping Fang SC;
    text-align: center;

  }

</style>