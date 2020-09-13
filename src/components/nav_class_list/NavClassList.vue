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
          <span class="course-time pingFang_sc">{{item.date}}</span>
           <!-- 课程描述 -->
          <span class="course-describtion" >{{item.abstract}}</span>
          <!-- 如果是已购买课程，则显示进度条 -->
          <div class="progress-bar" v-if="item.isPurchase">
            <span class="progress-bar-text">已学{{item.percent}}%</span>
            <span class="progress-bar-frame"></span>
            <span class="progress-bar-learned" :style="'width:'+(item.percent/100)*244+'rpx'"></span>
            <img class="completed" v-if="item.learnProgress==1" src="https://cdn.sc-edu.com/img/2020/07/30/17/de31b320d8a9e13b087615ce7aa9ea1c.png">
          </div>
          <!-- 面授课显示地点,样式同course-people-->
          <div class="course-people" v-if="item.type === '3'">{{item.place}}</div>
          <!-- 开通人数 -->
          <span class="course-people">{{item.number}}人开通</span>
          <!-- 课程价格 -->
          <span class="course-price">￥{{item.price}}/年</span>
          <!-- 喜欢 -->
          <div class="expand-select-area" @tap=handleLove(item,index)>
            <img src="https://cdn.sc-edu.com/img/2020/09/03/10/ce9e78e105e98f68b5ce33872acf8ea5.png"
            class="iconfont-hellowlove" v-show="!item.is_prefer">
            <img src="https://cdn.sc-edu.com/img/2020/09/03/10/80011ac1c2870f54a0b1a1c17dc8d051.png"
            class="iconfont-solidlove" v-show="item.is_prefer">
          </div>      
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import request from '../../lib/utils/request'
export default {
  data(){
    return{
      newCourseItem:[]
    }
  },
  props:{
    cCourseItem:Array,
    cisLike:Boolean//是否是喜欢列表
  },
  methods:{
    async handleLove(item,index){
      item.is_prefer = !item.is_prefer
      if(this.cisLike){
        //对于喜欢列表前端做及时的渲染
        if(!item.is_prefer) {
          this.newCourseItem.splice(index,1)
          //如果长度长度为0，发送事件显示 您暂无喜欢课程页面
          if(this.newCourseItem.length === 0) this.$emit("hanleNoCourse")
        }
      }
      // console.log(item,index)
      var requestUrl = ''
      // 设置接口地址
      if(item.is_prefer){
        requestUrl = '/prefer/add/'
      }else{
        requestUrl = '/prefer/del/'
      }   

      let current_data = {
        api_token:this.$global.token,
        course_id: item.course_id,
      }
      let information = await request(requestUrl,current_data,'POST')
      // console.log("操作结果",information)
   
    },
    seeCourseDetail(courseDetailItem){
      // console.log("查看课程详情",courseDetailItem)
      var info = ''
      if(courseDetailItem.isPurchase){
        info = 'cid='+courseDetailItem.course_id+'&isPurchase=true'
      }else{
        info = 'cid='+courseDetailItem.course_id+'&isPurchase=false'
      }
      wx.navigateTo({
        url:'/pages/course/children/courseDetail/main?'+info
      })
    }

  },
  watch:{
      cCourseItem:function(newval,oldval){
        this.newCourseItem = newval
        for(let index in newval){
          // 默认没有进度条，之后修改
          // this.newCourseItem[index].isShowTime = true
          // 之后的ai和商场也在这里修改
          if(newval[index].type==1) this.newCourseItem[index].type_text = "线上课"
          else if(newval[index].type==2) this.newCourseItem[index].type_text = "直播课"
          else if(newval[index].type==3) this.newCourseItem[index].type_text = "面授课"           
        }
        // console.log("课程信息",this.newCourseItem)
    }
  }, 
}
</script>
<style scoped>
  .course{
    position: relative;
    /* width: 370rpx; */
  }
  .course-list{
    width: 100%;
    /* width: 710rpx; */
    /* margin-left: -10rpx; */
    margin:0 18rpx;
  } 
  .course-item{
    height: 220rpx;
    margin-bottom: 40rpx;
    /* border: 2rpx solid pink; */
    /* margin-left: -10rpx; */
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
    /* height: 220rpx; */
    position: relative;
    /* display: flex;
    flex-direction: column; */
  }
  .course-name{
    display: block;
    width: 314rpx;
    /* height: 88rpx; */
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
    margin-bottom: 10rpx;
  }
  .course-describtion{
    display: block;
    width: 348rpx;
    /* height: 32rpx; */
    font-size: 22rpx;
    line-height: 32rpx;
    color: #828282;
    font-family: Ping Fang SC;
    margin-bottom: 10rpx
  }
  .progress-bar{
    height: 55rpx;
    width: 260rpx;
    /* background-color: pink; */
    position: relative;
    margin-bottom: 10rpx;
    margin-top: -20rpx;
    margin-bottom: 0rpx;

  }
  .progress-bar-text{
    line-height: 34rpx;
    font-size: 22rpx;
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
    top:40rpx ;
    z-index: 2;

  }
  .progress-bar-learned{
    /* width: 102rpx; */
    height: 8rpx;
    background: #2570D9;
    border-radius: 14rpx;
    position:absolute;
    z-index: 3;
    left: 0rpx;
    margin-top: 5rpx;
    top: 40rpx;
    
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
    /* margin-top:-10rpx; */
  }
  .course-price{
    /* width: 122rpx; */
    height: 40rpx;
    font-family: Ping Fang SC;
    font-weight: 550;
    font-size: 28rpx;
    color: #FB2A36;
    position: absolute;
    right: 16rpx;
  }
  .expand-select-area{
    width:50rpx;
    height: 50rpx;
    /* background-color: pink; */
    position: absolute;
    top: 20rpx;
    right: 30rpx;

  }
  .iconfont-hellowlove{
    position: absolute;
    width: 50rpx;
    height: 50rpx;
    right: 4rpx;
  }
  .iconfont-solidlove{
    position: absolute;
    width: 50rpx;
    height: 50rpx;
    right: 4rpx;
  }

</style>
