<template>
  <div id="container">
    <div id="content">
      <div class="course-detail-top">
        <!-- 轮播图 -->
        <swiper
          class="swiper-list"
          :indicator-dots="indicatorDots"
          :indicator-color="indicatorColor"
          :indicator-active-color="indicationActiveColor"
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
          :circular="circular">
          <swiper-item v-for="(item,index) in courseDetailItem.banner" :key="item"> 
            <img class="swiper-image" :src="courseDetailItem.banner[index].img">
          </swiper-item>
        </swiper>
        <!-- 课程信息 -->
        <div class="course-detail-top-content">
          <span class="course-name">{{courseDetailItem.title}}</span>
          <span class="course-describtion">{{courseDetailItem.date}},{{courseDetailItem.abstract}}</span>
          <span class="course-people">已更新48期 | {{courseDetailItem.number}}人开通</span>
          <span class="effective-time">有效时长：{{courseDetailItem.period}}天</span>
          <div class="expand-select-area" @click="handleLike(courseDetailItem)">
            <span class="iconfont-hellowlove" v-show="!courseDetailItem.is_prefer">&#xe606;</span>
            <span class="iconfont-solidlove" v-show="courseDetailItem.is_prefer">&#xe60e;</span>
          </div>
        </div>
      </div>
      <div class="split-line"></div>
      <div class="course-detail-bottom">
        <!-- 如果是课程的话只显示课程详情，如果是课程包将会显示一个可供选择的buttom-->
        <!--选课程详情或者课程目录-->
        <div class="single-choose" v-if="!isCoursePackage">课程详情
          <div class="course-detail-show" style="margin:24rpx 0">
            <div class="course-detail-show-richtext">
              <rich-text>{{courseDetailItem.content}}</rich-text>
            </div>        
            <button class="course-detail-show-buttom" v-if="!courseDetailItem.is_limit" @click="handlePurchase">立即购买</button>
            <!-- <button class="course-detail-show-buttom" v-if="courseDetailItem.isBuy" @click="handleShare">还可分享8人</button> -->
          </div>
        </div>
        <div class="choose-item" v-if="isCoursePackage">
          <span :class="isCourseDetail?'course-detail-selected':'course-detail-unselected'" @tap="handleChooseDetail">课程详情</span>
          <span :class="isCourseDetail?'course-detail-unselected':'course-detail-selected'" @tap="handleChooseDirectory">课程目录</span>
          <span class="underline" :style="isCourseDetail?'margin-left:38rpx':'margin-left:190rpx'"></span>
        </div>
        <div class="course-detail-show" v-show="isCoursePackage&&isCourseDetail">
          <div class="course-detail-show-richtext">
            <rich-text>{{courseDetailItem.content}}</rich-text>
          </div>
          <button class="course-detail-show-buttom" v-if="!coursePackage.is_pay" @click="handlePurchase">立即购买</button>
          <button class="course-detail-show-buttom" v-if="coursePackage.is_pay" @click="handleShare">还可分享{{coursePackage.share}}人</button>
        </div>
        <div class="course-directory-show" v-show="isCoursePackage&&!isCourseDetail">
          <img class="course-directory-show-complete" v-if="courseDetailItem.learnProgress==1" 
                src="https://cdn.sc-edu.com/img/2020/07/30/17/91b9a418a21542363114ebd7d50c5941.png">
          <ul class="course-directory">
            <li class="course-directory-item" v-for="item in coursePackage.pack_detial" :key="item">
              <div class="course-directory-title">{{item.title}}</div>
              <sapn class="course-directory-type">{{item.type_text}}</sapn>
              <span class="course-directory-date">{{item.date}}</span>
              <div class="course-directory-test">章节评测</div>
              <span class="course-directory-score">未开始</span>
              <div class="course-directory-split"></div>
            </li>
            <!-- <li class="course-directory-item">
              <div class="course-directory-title">【7月7日~开班导学】 园长专业标准解读</div>
              <sapn class="course-directory-type">视频</sapn>
              <span class="course-directory-date">2020.07.07</span>
              <div class="course-directory-test">章节评测</div>
              <span class="course-directory-score">80分</span>
              <div class="course-directory-split"></div>
            </li> -->
            <!-- <li class="course-directory-item">
              <div class="course-directory-title">【7月14日~招生政策】 幼儿园招生系统测评与诊断</div>
              <sapn class="course-directory-type">直播</sapn>
              <span class="otherpeople-completed">本幼儿园已有6人完成</span>
              <span class="course-directory-date">2020.07.14 19：30</span>
              <div class="course-directory-test">章节评测</div>
              <span class="course-directory-score" style="color:red">待完成</span>
              <div class="course-directory-split"></div>
            </li> -->
            <!-- <li class="course-directory-item">
              <div class="course-directory-title">【7月21日~招生策略】 幼儿园招生管理</div>
              <sapn class="course-directory-type">视频</sapn>
              <span class="course-directory-date">2020.07.07</span>
              <div class="course-directory-test">章节评测</div>
              <span class="course-directory-score">未开始</span>
              <div class="course-directory-split"></div>
            </li> -->
          </ul>
          </div>
        </div>
      </div>
     
    </div>
   

</template>
<script>
export default {
  data(){
    return{
      course_id: '',
      isPurchase: '',
      courseDetailItem:[],
      coursePackage:[],
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      indicatorColor: '#fff',
      indicationActiveColor: '#666',
      circular: true,
      isCourseDetail:true,
      isCoursePackage: false
    }
  },
  mounted(){
    //获取用户点击的课程的课程详情
    this.course_id = this.$mp.query.cid
    this.isPurchase = this.$mp.query.isPurchase
    // this.courseDetailItem = JSON.parse(this.$mp.query.courseDetailItem)
    console.log("页面传递参数(课程id)",this.course_id)
    console.log("页面传递参数(是否购买)",this.isPurchase)
    this.init()
  },
  methods:{
    init(){
      var request_url = ''
      if(this.isPurchase){
        request_url = 'https://wx.sc-edu.com/knsh/coursedetial/buy/'
      }else{
        request_url = 'https://wx.sc-edu.com/knsh/coursedetial/home/'
      } 
      this.init_courseDetail(request_url)
    },
    init_courseDetail(courseDetialUrl){
      var that = this
      wx.request({
        url: courseDetialUrl,
        method:'POST',
        header:{
          'content-type':"application/x-www-form-urlencoded"
        },
        data: {
          course_id: that.course_id,
          api_token: "8c1eIPCvBusNPV2vpDEleaBNDSHlpephjhxy2njk",
          brand_id: ''
        },
        success(res){       
          console.log(res)        
          that.courseDetailItem = res.data.data.detail
          that.coursePackage = res.data.data.pack
          console.log(res.data.data.pack.pack_detial)
          if(res.data.data.pack.pack_detial.length!=0){
            that.isCoursePackage = true
            for(let index in that.coursePackage.pack_detial){
              if(that.coursePackage.pack_detial[index].type==1){
                that.coursePackage.pack_detial[index].type_text = '视频'
              }else if(that.coursePackage.pack_detial[index].type==2){
                that.coursePackage.pack_detial[index].type_text = '直播'
              }else if(that.coursePackage.pack_detial[index].type==3){
                that.coursePackage.pack_detial[index].type_text = '面授'
              }
            }
          }
          
        }
      }) 
    },
    handleChooseDetail(){
      console.log("选择了课程详情")
      this.isCourseDetail = true
    },
    handleChooseDirectory(){
      console.log("选择了课程目录")
      this.isCourseDetail = false
    },
    handleShare(){
      console.log("点击了分享")
    },
    handlePurchase(){
      console.log("点击了购买")
    },
    handleLike(courseDetailItem){
      console.log("点击喜欢或取消喜欢")
      courseDetailItem.is_prefer = !courseDetailItem.is_prefer
      var that = this
      var requestUrl = ''
      // 设置接口地址
      if(courseDetailItem.is_prefer){
        requestUrl = 'https://wx.sc-edu.com/knsh/prefer/add/'
      }else{
        requestUrl = 'https://wx.sc-edu.com/knsh/prefer/del/'
      }   
      wx.request({
        url: requestUrl,
        method:'POST',
        header:{
          'content-type':"application/x-www-form-urlencoded"
        },
        data: {
          api_token: "8c1eIPCvBusNPV2vpDEleaBNDSHlpephjhxy2njk",
          course_id: that.course_id,
        },
        success(res){       
          console.log("操作结果",res) 
        }
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
    height: 590rpx;
    /* background-color: pink; */
  }
  .single-choose{
    width: 128rpx;
    line-height: 44rpx;
    color: #333333;
    font-weight: 500;
    font-size: 32rpx;
    margin:0 0 16rpx 32rpx
  }
  .choose-item{
    width: 400rpx;
    line-height: 44rpx;
    margin: 0 0 24rpx 32rpx;
  }
  .course-detail-selected{
    font-size: 32rpx;
    font-weight: 550;
    font-family: Ping Fang SC;
    color: #2570D9;
    margin-right: 24rpx;
  }
  .course-detail-unselected{
    font-size: 32rpx;
    font-family: Ping Fang SC;
    color: #BDBDBD;
    margin-right: 24rpx;
  }
  .underline{
    display: block;
    width: 46rpx;
    height: 4rpx;
    border-radius: 20rpx;
    background:#2570D9;
    transition:all 0.3s ease;
    margin-top: 2rpx;

  }
  .course-detail-show{
    height: 518rpx;
    width: 686rpx;
    /* border: 2rpx solid red; */
    margin: 0 32rpx 32rpx 32rpx;
  }
  .course-detail-show-richtext{
    height: 430rpx;
    /* background-color: #E0E0E0; */
  }
  .course-detail-show-buttom{
    height: 88rpx;
    background: #2570D9;
    border-radius: 4rpx;
    color: #FFFFFF;
    font-weight: 530;
    font-size: 32rpx;
    font-family: Ping Fang SC;

  }
  .course-directory-show{
    width:100%;
    position: relative;
  }
  .course-directory-show-complete{
    width: 686rpx;
    height: 118rpx;
    margin:4rpx 32rpx 24rpx 32rpx

  }
  .course-directory{
    /* width: 700rpx; */
    width: 100%;
    margin:0 38rpx;
    position: relative;
  }
  .course-directory-item{
    width: 700rpx;
    height: 242rpx;
    position: relative;

  }
  .course-directory-title{
    width: 478rpx;
    height: 88rpx;
    color: #333333;
    font-size: 32rpx;
    font-family: Ping Fang SC;
    line-height: 44rpx;
    margin: 32rpx 0 16rpx 0rpx;

  }
  .course-directory-type{
    width: 48rpx;
    line-height: 34rpx;
    font-size: 24rpx;
    font-family: Ping Fang SC;
    color:#333333;
    margin-bottom: 14rpx;
  }
  .course-directory-date{
    /* width: 116rpx; */
    line-height: 30rpx;
    font-size: 22rpx;
    color: #828282;
    margin: 0 0 14rpx 0;
    position: absolute;
    right: 30rpx;
  }
  .course-directory-test{
    /* width: 96rpx; */
    line-height: 34rpx;
    color: #2570D9;
    font-weight: 530;
    font-size: 24rpx;
    margin: 14rpx 0 24rpx 0;
    width: 200rpx;
    
  }
  .course-directory-score{
    position: absolute;
    right:30rpx;
    color: #2570D9;
    font-size: 24rpx;
    font-family: Ping Fang SC;
    line-height: 34rpx;
    top: 150rpx;
  }
  .course-directory-split{
    width: 650rpx;
    height: 0;
    border: 1px solid #000000;
    padding-left: 24rpx;
    opacity: 0.1;
  }
  .otherpeople-completed{
    margin-left: 20rpx;
    line-height: 30rpx;
    color: #FB2A36;
    font-size: 22rpx;
    font-family: Ping Fang FC;

  }



</style>