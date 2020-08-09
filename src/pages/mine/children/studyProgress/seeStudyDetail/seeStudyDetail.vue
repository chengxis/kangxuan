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
          <swiper-item>
            <img class="swiper-image" :src="courseDetailItem.pic"> 
          </swiper-item>
          <swiper-item>
            <img class="swiper-image" :src="courseDetailItem.pic"> 
          </swiper-item>
        </swiper>
        <div class="course-detail-top-content">
          <span class="course-name">{{courseDetailItem.week}} | {{courseDetailItem.name}}</span>
          <span class="course-describtion">{{courseDetailItem.time}},{{courseDetailItem.describtion}}</span>
          <span class="course-people">已更新48期 | {{courseDetailItem.people}}</span>
          <span class="effective-time">有效时长：365天</span>
          <div class="expand-select-area" @click="handleLike(courseDetailItem)">
            <span class="iconfont-hellowlove" v-show="!courseDetailItem.isLove">&#xe606;</span>
            <span class="iconfont-solidlove" v-show="courseDetailItem.isLove">&#xe60e;</span>
          </div>

        </div>
      </div>
      <div class="split-line"></div>
      <div class="course-detail-bottom">
        <div class="table">
          <div class="tr">
            <span class="th">教师姓名</span>
            <span class="th">学习进度</span>
            <span class="th">总考分</span>
          </div>
          <div class="tr" v-for="item in [1,2,3,4,5]" :key="item" @tap="seeTeacherDetail(item)">
            <span class="td">张三</span>
            <span class="td">已完成60%</span>
            <span class="td">80分</span>
          </div>
        </div>
      </div>
    </div>
     
  </div>
</template>
<script>
export default {
  data(){
    return{
      courseDetailItem:[],
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
  mounted(){
    //获取用户点击的课程的课程详情
    this.courseDetailItem = JSON.parse(this.$mp.query.courseDetailItem)
    console.log(this.courseDetailItem)
  },
  methods:{
    handleLike(courseDetailItem){
      console.log("点击喜欢或取消喜欢")
      courseDetailItem.isLove = !courseDetailItem.isLove
    },
    seeTeacherDetail(teacherDetailItem){
      wx.navigateTo({
        url:'/pages/mine/children/studyProgress/seeMore/main?teacherDetailItem='+JSON.stringify(teacherDetailItem)
      })
    }

  }
  
}
</script>
<style scoped>
  #container{
  width: 100%;
  height: 100%;
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
  }
  .iconfont-hellowlove{
    position: absolute;
    top: 50rpx;
    right: 40.16rpx;

  }
  .iconfont-solidlove{
    position: absolute;
    top: 47rpx;
    right: 37rpx;

  }
  .split-line{
    width: 750rpx;
    height: 8rpx;
    background-color: #E0E0E0;
    margin-bottom: 24rpx;
  }
  .course-detail-bottom{
    width: 100%;
    position: relative;
    /* background-color: pink; */
  }
  .table{
    width: 684rpx;
    margin-left: 32rpx;
    position: relative;
  }
  .table .tr:nth-child(2n+1){
    background: #FAFCFF;
  }
  .tr .th{
    display:inline-block;
    width: 228rpx;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 28rpx;
    font-weight: 550;
    text-align: center;
    font-family: Ping Fang SC;
  }
  .tr .td{
    display:inline-block;
    width: 228rpx;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 28rpx;
    text-align: center;
    font-family: Ping Fang SC;
  }
  
</style>