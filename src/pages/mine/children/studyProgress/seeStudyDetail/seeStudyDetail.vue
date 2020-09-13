<template>
  <div id="container">
    <div id="content">
     
      <div class="course-detail-top">
        <swiper
          class="swiper-list"
          :indicator-dots="indicatorDots"
          :indicator-color="indicatorColor"
          :indicator-active-color="indicationActiveColor"
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
          :circular="circular">
          <swiper-item v-for="(item,index) in courseItem.banner" :key="index">
            <img class="swiper-image" :src="item.img"> 
          </swiper-item>
        </swiper>
        <div class="course-detail-top-content">
          <span class="course-name">{{courseItem.title}}</span>
          <span class="course-describtion">{{courseItem.abstract}}</span>
          <span class="course-people">已更新{{courseItem.stage}}期 | {{courseItem.number}}人订阅</span>
          <span class="effective-time">有效时长：{{courseItem.period}}</span>
        </div>
        <div class="expand-select-area" @tap=handleLike(courseItem)>
          <span class="iconfont-hellowlove" v-if="courseItem.prefer===0">&#xe606;</span>
          <span class="iconfont-solidlove" v-if="courseItem.prefer===1">&#xe60e;</span>
        </div> 
      </div>
      <div class="split-line"></div>
      <div class="course-detail-bottom">
        <div class="table">
          <div class="tr">
            <span class="th">教师姓名</span>
            <span class="th">学习进度</span>
            <!-- <span class="th">总考分</span> -->
          </div>
          <div class="tr" v-for="(teacher,teacherIndex) in courseItem.schedule " 
          :key="teacherIndex" @tap="seeTeacherDetail(teacher.teacher_id)">
            <span class="td">{{teacher.teacher_name}}</span>
            <span class="td">已完成{{teacher.plan}}%</span>
          </div>
        </div>
      </div>
    </div>
     
  </div>
</template>
<script>
import request from '../../../../../lib/utils/request'
export default {
  data(){
    return{
      courseId:'',
      courseItem:[],
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      indicatorColor: '#fff',
      indicationActiveColor: '#666',
      circular: true,
      isCourseDetail:true
    }
  },
  methods:{
    async getCourseProgress(){
      let body_data = {
        api_token:this.$global.token,
        course_id:this.courseId,
        brand_id:this.$global.kingarten_info.brand_id  
        // api_token:"d174UtqqUFtMsF2zd58W4YJxUPzRbn2ACaSQOZe7",
        // brand_id:10
      }
      let result = await request('/brand/schedule/course/',body_data,'POST')
      console.log("测试点",result)
      if(result.state === 1){
        console.log(result.data)
        if(result.data.type === '1') result.data.type = '线上课'
        else if(result.data.type === '2') result.data.type = '直播课'
        else if(result.data.type === '3') result.data.type = '面授课'
        else result.data.type = '课程包'
        result.data.period = parseFloat(result.data.period).toFixed(2)
        for(let i of result.data.schedule){
          i.plan = parseInt(i.plan)    
        }
        this.courseItem = result.data

      }

    },
    handleLike(courseItem){
      console.log("点击喜欢或取消喜欢")
      if(courseItem.prefer === 1){
        courseItem.prefer = 0
      }else{
        courseItem.prefer = 1
      }
    },
    seeTeacherDetail(teacher_id){
      wx.navigateTo({
        url:'/pages/mine/children/studyProgress/seeMore/main?teacher_id='+JSON.stringify(teacher_id)+
        '&&course_id='+JSON.stringify(this.courseId)
      })
    }

  },
  onShow(){
    this.courseId = JSON.parse(this.$mp.query.courseId)
    console.log("返回courseId",this.courseId)
    this.getCourseProgress()
  }
  
}
</script>
<style scoped>
  #container{
  width: 100%;
  height: 100%;
  position: relative;
}
  .course-detail-top{
    width: 100%;
    height: 650rpx;
    /* background-color: blanchedalmond; */
  }
  #container .swiper-list{
    position: relative;  
    background-color: white;
    height: 436rpx;
    margin-top: -10rpx;
  }
  .swiper-image{
    position: absolute;
    width: 100%;
    /* height: 662rpx; */
  }
  .course-detail-top-content{
    width: 100%;
    height: 214rpx;
    /* background-color: coral; */
    /* border: solid 2rpx plum; */
    position: relative;
  }
  .course-name{
    display: block;
    width: 400rpx;
    line-height: 44rpx;
    font-weight: 550;
    font-family: Ping Fang FC;
    margin: 32rpx 0 16rpx 32rpx;
    font-size: 32rpx;
  }
  .course-describtion{
    display: block;
    width: 686rpx;
    height: 40rpx;
    line-height: 40rpx;
    font-size: 28rpx;
    font-family: Ping Fang SC;
    color: #828282;
    margin: 0 0 16rpx 32rpx;
  }
  .course-people{
    /* display: block; */
    width: 480rpx;
    line-height: 34rpx;
    font-size: 24rpx;
    color: #4F4F4F;
    font-family: Ping Fang SC;
    margin:0 0 32rpx 32rpx
  }
  .effective-time{
    position: absolute;
    width: 200rpx;
    line-height: 34rpx;
    font-family: Ping Fang FC;
    font-size: 24rpx;
    color: #333333;
    right: 32rpx;
    bottom: 55rpx;
  }
  .expand-select-area{
    width:50rpx;
    height: 50rpx;
    position: absolute;
    top: 470rpx;
    right: 40rpx;

  }
  .iconfont-hellowlove{
    position: absolute;
    right: 4rpx;
    top: 4rpx;

  }

  .iconfont-solidlove{
    position: absolute;
    right: 1rpx;
  }
  .split-line{
    width: 750rpx;
    height: 8rpx;
    background-color: #E0E0E0;
    margin-bottom: 24rpx;
  }
  .course-detail-bottom{
    /* display: flex;
    align-items: center; */
    width: 100%;
    position: relative;
    /* background-color: pink; */
  }
  .table{
    width: 684rpx;
    margin-left: 32rpx;
  }
  .table .tr:nth-child(2n+1){
    background: #FAFCFF;
  }
  .tr .th{
    display:inline-block;
    width: 342rpx;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 28rpx;
    font-weight: 550;
    text-align: center;
    font-family: Ping Fang SC;
  }
  .tr .td{
    display:inline-block;
    width: 342rpx;
    line-height: 88rpx;
    font-size: 28rpx;
    text-align: center;
    font-family: Ping Fang SC;
  }
  
</style>