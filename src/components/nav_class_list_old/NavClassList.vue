<template> 
  <div class="course">
    <!-- 课程列表 -->
    <ul class="course-list" >
      <!-- 课程信息 -->
      <li class="course-item" v-for="(item,index) in cCourseItem" :key="index">
        <div class="click-area" @tap="seeCourseDetail(item)"></div>
        <!-- 左侧：图片与课程类型 -->
        <div class="course-show">
          <img class="img-left" :src="item.img_url"> 
          <span class="course-type">{{item.type_text}}</span>
        </div>
        <div class="course-detail" >
          <!-- 课程名字 -->
          <span class="course-name pingFang_sc">{{item.title}}</span>
          <!-- isShowTime用来控制是否显示时间和描述信息，不显示的话则显示进度条-->
          <!-- 上课时间 -->
          <span class="course-time pingFang_sc" v-if="item.isShowTime">{{item.data}}</span>
          <!-- 课程描述 -->
          <span class="course-describtion" v-if="item.isShowTime">{{item.abstract}}</span>
          <!-- 进度条 -->
          <div class="progress-bar" v-if="item.isShowProgress">
            <span class="progress-bar-text">已学{{item.learnProgress*100}}%</span>
            <span class="progress-bar-frame"></span>
            <span class="progress-bar-learned" :style="'width:'+item.learnProgress*244+'rpx'"></span>
            <img class="completed" v-if="item.learnProgress==1" src="https://cdn.sc-edu.com/img/2020/07/30/17/de31b320d8a9e13b087615ce7aa9ea1c.png">
          </div>
          <!-- 开通人数 -->
          <span class="course-people">{{item.number}}人开通</span>
          <!-- 课程价格 -->
          <span class="course-price">￥{{item.price}}/年</span>
          <!-- 喜欢 -->
          <div class="expand-select-area" @tap=handleLove(item)>
            <span class="iconfont-hellowlove"  v-show="!item.isprefer">&#xe606;</span>
            <span class="iconfont-solidlove" v-show="item.isprefer">&#xe60e;</span>
          </div>
         
        </div>
      </li>
      <!-- <li class="course-item"></li> -->
    </ul>
  
  </div>


</template>
<script>
export default {
  data(){
    return{
    

    }
  },
  props:{
    cCourseItem:Array   
  },
  computed:{
   
  },
  methods:{
    handleLove(item){
      console.log("收藏或取消收藏",item)
      item.isLove = !item.isLove
    },
    seeCourseDetail(courseDetailItem){
      console.log("查看课程详情",courseDetailItem)
      wx.navigateTo({
        url:'/pages/course/children/courseDetail/main?courseDetailItem='+JSON.stringify(courseDetailItem)
      })
    }
  },
  mounted(){
    console.log("进入2")
    for(let index in this.cCourseItem){
      var that = this
      console.log("进入")
      that.cCourseItem[index].isShowTime = true
      if(that.cCourseItem[index].type==1) that.cCourseItem[index].type_text = "线上课"
      else if(that.cCourseItem[index].type==2) that.cCourseItem[index].type_text = "直播课"
      else if(that.cCourseItem[index].type==3) that.cCourseItem[index].type_text = "面授课"           
    }
  }
  
}
</script>
<style scoped>
  .course{
    position: relative;
    /* width: 370rpx; */
  }
  .course-list{
    /* width: 100%; */
    width: 710rpx;
    margin-left: -10rpx;
  } 
  .course-item{
    height: 220rpx;
    margin-bottom: 40rpx;
    /* border: 2rpx solid pink; */
    margin-left: -10rpx;
    display: flex;
    position: relative;
  }
  .click-area{
    width: 580rpx;
    height: 220rpx;
    /* border: black 2rpx solid; */
    position: absolute;
    z-index: 50;
    /* background-color: pink; */
    /* position:absolute;
    z-index: 40rpx; */
    
  }
  .course-show{
    position: relative;
  }
  .img-left{
    width: 280rpx;
    height: 220rpx;
    margin-right: 20rpx;
  }
  .course-type{
    height: 40rpx;
    background-color:rgba(1,1,1,.5);
    text-align: center;
    line-height: 40rpx;
    position: absolute;
    color: white;
    font-size: 20rpx;
    right: 30rpx;
    bottom: 15rpx;
    padding: 0 10rpx;
    border-radius: 10rpx;
  }
  .course-detail{
    width: 430rpx;
    height: 220rpx;
    position: relative;
  }
  .course-name{
    display: block;
    width: 314rpx;
    height: 88rpx;
    font-family: Ping Fang FC;
    line-height: 44rpx;
    font-size: 32rpx;
    font-weight: 550;
    color: #333333; 
    margin: 10rpx 0;
  }
  .course-time{
    display: block;
    width: 348rpx;
    height: 32rpx;
    font-size: 22rpx;
    line-height: 32rpx;
    color: #828282;
    font-family: Ping Fang SC;
    margin-bottom: 4rpx;
  }
  .course-describtion{
    display: block;
    width: 348rpx;
    height: 32rpx;
    font-size: 22rpx;
    line-height: 32rpx;
    color: #828282;
    font-family: Ping Fang SC;
    margin-bottom: 5rpx
  }
  .progress-bar{
    height: 55rpx;
    width: 260rpx;
    /* background-color: pink; */
    position: relative;
    margin-bottom: 10rpx;

  }
  .progress-bar-text{
    line-height: 34rpx;
    font-size: 24rpx;
    color: #2570D9;
    font-weight: 500;
  }
  .progress-bar-frame{
    position:absolute;
    width: 244rpx;
    height: 8rpx;
    border-radius: 14rpx;
    background:#EBF3FF;
    display: block;
    margin-top: 5rpx;
    z-index: 2;

  }
  .progress-bar-learned{
    display: inline-block;
    /* width: 102rpx; */
    height: 8rpx;
    background: #2570D9;
    border-radius: 14rpx;
    position:absolute;
    top: 48rpx;
    z-index: 3;
    left: 0rpx;
    
  }
  .completed{
    display: block;
    width: 155rpx;
    height:155rpx;
    /* border: 2rpx solid black; */
    /* background-color: pink; */
    position: absolute;
    border-radius: 50%;
    top: -60rpx;
    right: -80rpx;
    /* background-image: '../../../static/imgs/course/complete.png';
    background-image: '/static/imgs/course/complete.png'; */
    /* background-image:url('../../../static/imgs/course/complete.png'); */
    
  }
  .course-people{
    width: 102rpx;
    height: 30rpx;
    font-size: 22rpx;
    line-height: 30rpx;
    color: #4F4F4F;
    font-family: Ping Fang SC;
  }
  .course-price{
    width: 122rpx;
    height: 40rpx;
    font-family: Ping Fang SC;
    font-weight: 550;
    font-size: 28rpx;
    margin-left: 180rpx;
    color: #FB2A36;
    position: absolute;

  }
  .expand-select-area{
    width:50rpx;
    height: 50rpx;
    /* background-color: pink; */
    position: absolute;
    top: 12rpx;
    right: 30rpx;

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

  


</style>