<template>
  <div id="container">
    <div class="course" v-if="isHasCourse">
      <ul class="course-list" >
        <li class="course-item" v-for="(item,index) in purchaseCourse" :key="index">
          <div class="click-area" @tap="seeCourseDetail(item.course_id)"></div>
          <div class="course-show">
            <img class="img-left" :src="item.img_url"> 
            <span class="course-type">{{item.type}}</span>
          </div>
          <div class="course-detail">
            <span class="course-name ">{{item.title}}</span>
            <div class="course-information">
              <div class="benefit">{{item.abstract}}</div>   
              <img class="completed" v-if="item.is_over===1" src="https://cdn.sc-edu.com/img/2020/07/30/17/de31b320d8a9e13b087615ce7aa9ea1c.png">
              <div class="is-learning">{{item.learn_num}}位教师在学</div>
            </div>
            <span class="course-people">{{item.people}}</span>
            <span class="course-price">￥{{item.price}}/年</span>
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
    <div class="none-course" v-if="!isHasCourse">
      <img src="https://cdn.sc-edu.com/img/2020/08/14/17/82e7731b458a0eca27dcfba862115d8b.png" alt="">
      <div class="none-describe">您暂无已购课程</div>
      <div class="evaluate-button" @click="gotoRecommand">去查看课程推荐</div>
    </div>
  </div> 
</template>
<script>
import request from '../../../../lib/utils/request'
export default {
  data(){
    return{
      purchaseCourse:[],
      isHasCourse:''

    }
  },
  mounted(){
  },
  methods:{
    async handleLove(item){
      // console.log("收藏或取消收藏",item)
      var requestUrl = ''
      if(item.is_prefer === 1){
        item.is_prefer = 0
        requestUrl = '/prefer/del/'   
      }else{
        item.is_prefer = 1
        requestUrl = '/prefer/add/'
      }
      let current_data = {
        api_token:this.$global.token,
        course_id: item.course_id,
      }
      let information = await request(requestUrl,current_data,'POST')  
    },
    gotoRecommand(){
      wx.navigateTo({
        url: '/pages/mine/children/courseRecommand/main',
      })

    },
    seeCourseDetail(courseId){
      wx.navigateTo({
        url:'/pages/mine/children/studyProgress/seeStudyDetail/main?courseId='+JSON.stringify(courseId)
      })
    },
    async getCourseList(){
      let body_data = {
        api_token:this.$global.token,
        brand_id:this.$global.kingarten_info.brand_id
        // api_token:"d174UtqqUFtMsF2zd58W4YJxUPzRbn2ACaSQOZe7",
        // brand_id:10  
      }
      let result = await request('/brand/schedule/study/',body_data,'POST')
      // console.log("测试点",result)
      if(result.state === 1){
        let courseList = result.data.list
        if(courseList.length === 0){
          this.isHasCourse = false
        }
        else{
          this.isHasCourse = true
          for(let i of courseList){
            //将price变成整数
            i.price = Number(i.price)
            //title最多显示9个字符
            if(i.title.length >= 9){
              i.title = i.title.substring(0,8) + '...'
            }
            if(i.type === 1) i.type = '线上课'
            else if(i.type === 2) i.type = '直播课'
            else if(i.type === 3) i.type = '面授课'
            else i.type = '课程包'
          }
        } 
        this.purchaseCourse = courseList
        // console.log(this.purchaseCourse)

      }else if(result.state === 0){
        wx.showToast({
          title: result.message,
          icon: 'none',
          duration:2000
        })
      }else{
        console.log("studyProgress获取课程列表失败")
      }
    }

  },
  onShow(){
    console.log("onshow")
    this.getCourseList()
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
    margin-left: 32rpx;
    margin-top: 20rpx;
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
    margin-bottom: 5rpx;
    position: relative;
  }
  .benefit{
    font-family: Ping Fang SC;
    font-size: 22rpx;
    line-height: 32rpx;
    color: #828282;

  }
  .completed{
    display: block;
    width: 155rpx;
    height:155rpx;
    /* border: 2rpx solid black; */
    /* background-color: pink; */
    position: absolute;
    border-radius: 50%;
    top: 30rpx;
    left: 170rpx;
    z-index: -9999;
   
    
  }
  .is-learning{
    font-family: Ping Fang SC;
    font-size: 22rpx;
    line-height: 30rpx;
    color: #2570D9;
    position: absolute;
    bottom: 0rpx;
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
    height: 40rpx;
    font-family: Ping Fang SC;
    font-weight: 550;
    font-size: 28rpx;
    margin-left: 180rpx;
    color: #FB2A36;
    position: absolute;
    bottom: 0rpx;
    right: 32rpx;
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
  .none-course{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .none-course img{
    width: 566rpx;
    height: 398rpx;
    margin-left: 92rpx;
    margin-top: 32rpx;
  }
  .none-describe{
    margin-top: 64rpx;
    line-height: 44rpx;
    font-size: 32rpx;
    font-family: Ping Fang SC;
    color: #333333;
  }
  .evaluate-button{
    width: 686rpx;
    height: 88rpx;
    line-height: 88rpx;
    background: #2570D9;
    border-radius: 4rpx;
    text-align: center;
    color: #FFFFFF;
    font-weight: 500;
    font-size: 32rpx;
    margin-top: 54rpx;

  }


</style>