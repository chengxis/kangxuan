<template>
  <div id="container">
    <div class="evaluate-information">
      <div class="describ-num">已收集测评数量</div>
      <div class="num">{{EvaluateNum}}</div>
      <div class="detail-buttom" @click="seeEvaDetail">查看详情</div>
    </div>
    <div class="split-line"></div>
    <div class="recommand-list">
      <div class="recommand-describ">根据AI评测结果，我们为您推荐以下课程:</div>
        <CourseListShow :cCourseItem="recommandCourseList" @updateCorseList="updateCorseList"></CourseListShow>
        <!-- <button class="share-evaluate" open-type="share" plain='true'></button> -->
        <button :open-type="longPress?'':'share'" :style="'left:'+x+'rpx;top:'+y+'rpx'"
        class="share-evaluate"
        plain='true'
        @longpress="handleLongPress"
        @touchstart="touchStart"
        @touchend="touchEnd"
        @touchmove="touchMove"></button>    
    </div>
  </div>
  
</template>
<script>
import CourseListShow from '../../../../components/course_list_show/CourseListShow'
import request from '../../../../lib/utils/request'
export default {
  data(){
    return{
      EvaluateNum :'',
      recommandCourseList:[],
      longPress:false,//长按事件触发后，share事件不触发
      x:600,//记录分享图标在page中x轴的位置
      y:900,//记录分享图标在page中y轴的位置
      screenWidth:'',
      screenHeight:'',
      multiple:1//px -> rpx 的换算比例   
      
    }
  },
  components:{
    CourseListShow
  },
  methods:{
    async getRecommandCourse(){
      let body_data = {
        api_token:this.$global.token,
        brand_id:this.$global.kingarten_info.brand_id
        // api_token: "d174UtqqUFtMsF2zd58W4YJxUPzRbn2ACaSQOZe7",
        // brand_id:5
      }
      let result = await request('/brand/recommend/',body_data,'POST')
      // console.log("测试点",result.data.list instanceof Array)
      if(result.state === 1){
        for(let i of result.data.list){
          if(i.type === 1) i.type = '线上课'
          else if(i.type === 2) i.type = '直播课'
          else if(i.type === 3) i.type = '面授课'
          else i.type = '课程包'
          // i.price = parseInt(i.price)
          //为每个推荐的课程新增加一个isSelect，用来标志该课程是否被选中了
          i.isSelect = false
        }
      }
      // console.log("测试点",result.data)
      this.EvaluateNum = result.data.num
      if(this.$global.hasCourseRecommand === false || this.$global.hasCourseRecommand === ''){
        //判断是否需要重新获取课程推荐列表，若为true代表用户已经有了课程推荐列表，不需要重新推荐
        //这样做的目的是为了记录用户之前点击的行为
        this.recommandCourseList = result.data.list
        this.$global.setHasCourseRecommand(true)
      }
    },
    async seeEvaDetail(){
      let body_data = {
        api_token:this.$global.token,
        brand_id:this.$global.kingarten_info.brand_id
        // api_token: "d174UtqqUFtMsF2zd58W4YJxUPzRbn2ACaSQOZe7",
        // brand_id:5
      }
      let result = await request('/brand/ai/',body_data,'POST')
      // console.log("测试点",result)
      if(result.state === 1){
        let evaluateList = result.data.list
        // console.log("测试点")
        // console.log(evaluateList)
        wx.navigateTo({
          url:'/pages/mine/children/courseRecommand/evaluateList/main?evaDetail='+JSON.stringify(evaluateList)
        })

      }

    },
    updateCorseList(updateCourseList){
      // 当子组件中的数据发生改变时，父组件传过去的数据做相应的改变
      // console.log("测试点",updateCourseList)
      this.recommandCourseList = updateCourseList

    },
    getSysInfo(){
      var that = this
      wx.getSystemInfo({
        success: function(res) {
          // console.log(res)
          that.screenWidth = res.windowWidth
          that.screenHeight = res.screenHeight
          that.multiple = 750 / res.windowWidth
        }
      })
      console.log(this.multiple)
    },
    handleLongPress(e){
      this.longPress = true
      // console.log("触发长按事件",e)
    },
    touchStart(e){
      console.log("触发开始触摸事件",e)

    },
    touchEnd(e){
      console.log("触发结束触摸事件",e)
      this.x = 600
      this.longPress = false

    },
    touchMove(e){
      // console.log("触发滑动事件",e)
      if(e.clientX > this.screenWidth - (128/this.multiple)) e.clientX = this.screenWidth - (128/this.multiple)
      else if(e.clientX < 0) e.clientX = 0
      if(e.clientY > this.screenHeight - 160) e.clientY = this.screenHeight - 160
      else if(e.clientY < 0) e.clientY = 0
      this.x = e.clientX * this.multiple
      this.y =e.clientY * this.multiple

    },
  },
  onShareAppMessage: function(ops) {
    if (ops.from === "button") {
      // 来自页面内转发按钮
      console.log(ops.target);
    }
    return {
      title: "康轩幼教AI评测系统",//这里是定义转发的标题
      path: '/pages/common/evaluateIndex/main?brand_id='+JSON.stringify(this.$global.kingarten_info.brand_id),
      imageUrl:'https://cdn.sc-edu.com/img/2020/08/17/17/9fa939902977fbab8decc0c8649cd98c.png',
      success: function(res) {
        console.log(this.$global.kingarten_info.brand_id)
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
},
  onShow(){
    // console.log(this.$global.kingarten_info.brand_id)
    this.getRecommandCourse()
    this.getSysInfo()//获取屏幕的宽度和高度
      
    
    
  },
  
}
</script>
<style scoped>
#container{
  position: relative;
  width: 100%;
}
.evaluate-information{
  width: 710rpx;
  position: relative;
  margin-left: 32rpx;
  margin-bottom: 24rpx;
  margin-top: 24rpx;
}
.describ-num{
  font-size: 20rpx;
  line-height: 28rpx;
  color: #828282;
  font-family: Ping Fang SC;
  margin-bottom: 12rpx;
}
.num{
  display: inline-block;
  line-height: 68rpx;
  font-family: DIN;
  font-weight: bold;
  font-size: 64rpx;
  color: #333333;
}
.detail-buttom{
  display: inline-block;
  width: 134rpx;
  line-height: 52rpx;
  background-color: #2570D9;
  border-radius: 4rpx;
  font-family: Ping Fang SC;
  text-align: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 24rpx;
  position: absolute;
  right: 16rpx;
}
.split-line{
  width: 100%;
  height: 8rpx;
  background: #E0E0E0;
  margin-bottom: 32rpx;
}
.recommand-list{
  width: 700rpx;
}
.recommand-describ{
  width: 700rpx;
  margin-left: 32rpx;
  color: #828282;
  font-size: 28rpx;
  line-height: 40rpx;
  margin-bottom: 52rpx;
}
.share-evaluate{  
  background-size: 128rpx 128rpx;
  background-image: url(https://cdn.sc-edu.com/img/2020/08/28/15/c7ffbccdca2f794ffe2da7d496270f04.png);
  width:128rpx;
  height:128rpx;
  border:none;
  position: fixed;
  z-index: 10;
}



</style>