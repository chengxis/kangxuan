<template>
  <div id="container">
    <!-- 分享悬浮窗 -->
    <div id="monitor" :open-type="longPress?'':share" :style="'left:'+x+'rpx;top:'+y+'rpx'">
      <button open-type='share' 
      class="monitor-share-button" 
      plain='true' :id="1"
      @longpress="handleLongPress"
      @touchstart="touchStart"
      @touchend="touchEnd"
      @touchmove="touchMove"></button>
    </div>
    <!-- 课程详情 -->
    <div id="content">
      <div class="course-detail-top">
        <!-- 课程视频(线上课) -->
        <div v-if="courseDetailItem.type==1" >
          <!-- 蒙版：无权限时禁止观看，有权限时首次提示是否继续上次观看 -->
          <div v-if="courseDetailItem.is_limit === 0" class="mask" @click="prePlay"></div>
          <!-- 视频 -->
          <div v-if="courseDetailItem.source_url.length > 0">
            <video
              :autoplay="autoplayVideo" 
              id="courseVideo"
              :src="courseDetailItem.source_url " 
              style='width:100%' 
              :initial-time = "videoInitialTime"    
              @timeupdate = "videoRecord"
              @play = "videoPlay"
              @ended = "videoEnded"
              @pause = "videoPause">
            </video>
          </div>
        </div>
      
        <!-- 轮播图(非线上课) -->
        <swiper v-if="courseDetailItem.type!=1"
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
          <div class="course-name">{{courseDetailItem.title}}</div>
          <!-- 显示直播房间号-->
          <!-- <div class="course-describtion"
          v-if="!isCoursePackage&&courseDetailItem.type ==='2'">直播房间号:</div> -->
          <div class="course-describtion"
          v-if="courseDetailItem.type !=='3'">{{courseDetailItem.date}},{{courseDetailItem.abstract}}</div>
          <div class="course-describtion"
          v-if="courseDetailItem.type !=='3'">已更新{{courseDetailItem.stage}}期 | {{courseDetailItem.number}}人开通</div>
          <div class="course-describtion"
          v-if="courseDetailItem.type !=='3'"
          :style="!isCoursePackage&&courseDetailItem.type ==='2'?'':'position:absolute;right:32rpx;bottom:48rpx'">有效时长：{{courseDetailItem.period}}天</div>  
          <div class="course-describtion" v-if="courseDetailItem.type ==='3'">{{courseDetailItem.abstract}}</div>
          <div class="course-describtion" v-if="courseDetailItem.type==='3'">{{courseDetailItem.place}}</div>
          <div class="course-describtion"  
          v-if="courseDetailItem.type==='3'" style='position:absolute;right:32rpx;bottom:0rpx'>{{courseDetailItem.date}}开营</div>
          <button class="enter-live"  
          v-if="!isCoursePackage&&courseDetailItem.type ==='2'" :disabled="!hasLive" plain="true"
          @click="enterLive"
          :style="hasLive?'':'background:#D8D8D8;color:#ffffff'">{{hasLive?'进入直播间':'未开始'}}</button>
          <navigator 
            :url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id='+roomId+'&custom_params='+customParams">
          </navigator>
          <div class="expand-select-area" @click="handleLike(courseDetailItem)">
            <img src="https://cdn.sc-edu.com/img/2020/09/03/10/ce9e78e105e98f68b5ce33872acf8ea5.png"
                class="iconfont-hellowlove"
                v-show="!courseDetailItem.is_prefer">
            <img src="https://cdn.sc-edu.com/img/2020/09/03/10/80011ac1c2870f54a0b1a1c17dc8d051.png"
                class="iconfont-solidlove"
                v-show="courseDetailItem.is_prefer">
          </div>
        </div>
      </div>
      <div class="split-line"></div>
      <div class="course-detail-bottom">
        <!-- 如果是课程的话只显示课程详情，如果是课程包将会显示一个可供选择的buttom-->
        <!--选课程详情或者课程目录-->
        <div class="single-choose" v-if="!isCoursePackage">课程详情
          <div class="course-detail-show" style="margin:24rpx 0">
            <!-- 课程测评入口(非课程包且有测评) -->
            <div class="course-detail-test" v-if="hasTest" @click="handleCoureseTest">
              <span class="course-detail-test-title">章节评测</span>
              <span :class="courseDetailItem.is_fulfil?'course-detail-test-text-completed':'course-detail-test-text-uncompleted'">{{courseDetailItem.is_fulfil?'已完成':'立即评测'}}</span>
            </div>
            <!-- 课程内容(富文本) -->
            <div class="course-detail-show-richtext">
              <rich-text :nodes="courseDetailItem.content"></rich-text>
            </div>        
            <!-- <button class="course-detail-show-buttom" v-if="!courseDetailItem.is_limit" @click="handlePurchase">立即购买  {{courseDetailItem.price}}元</button> -->
          </div>
        </div>
         <!-- 课程包 -->
        <div class="choose-item" v-if="isCoursePackage">
          <span :class="isCourseDetail?'course-detail-selected':'course-detail-unselected'" @tap="handleChooseDetail">课程详情</span>
          <span :class="isCourseDetail?'course-detail-unselected':'course-detail-selected'" @tap="handleChooseDirectory">课程目录</span>
          <span class="underline" :style="isCourseDetail?'margin-left:38rpx':'margin-left:190rpx'"></span>
        </div>
        <!-- 课程详情 -->
        <div class="course-detail-show" v-show="isCoursePackage&&isCourseDetail">         
          <!-- 课程内容(富文本) -->
          <div class="course-detail-show-richtext">
            <rich-text :nodes="courseDetailItem.content"></rich-text>
          </div>
          <!-- <button class="course-detail-show-buttom" v-if="!coursePackage.is_pay" @click="handlePurchase">立即购买  {{courseDetailItem.price}}元</button>
          <button open-type='share' class="course-detail-show-buttom" v-if="coursePackage.is_pay" :id="2">还可分享{{coursePackage.share}}人</button> -->
        </div>    
      </div>
    </div>   
  </div>
   

</template>
<script>
import request from '../../../../lib/utils/request'
export default {
  data(){
    return{
      course_id: '',
      isPurchase: '',// 是否从已购列表进入
      courseDetailItem:[],// 课程详情
      coursePackage:[],// 课程包详情
      indicatorDots: true,
      autoplay: true,
      autoplayVideo:false,//设置video是否自动播放
      interval: 3000,
      duration: 1000,
      indicatorColor: '#fff',
      indicationActiveColor: '#666',
      circular: true,
      isCourseDetail:true,// 选择课程详情/课程目录
      isCoursePackage: false,
      purchaseInfo: [],
      shareInfo:'', // 分享页面携带信息
      share_token:'', // 获得分享链接的token
      isShare: false,// 是否有分享权限
      test_url:'https://qiniu-cdn-ssl-2.sc-edu.com/nbg/20190815000404_000000000000254.mp4',
      parent_id:'',
      isFirst:true,// 初打开页面，点击播放视屏后，置为false
      videoInitialTime: '0',
      videoDuration:'',
      // videoContext: wx.createVideoContext('courseVideo'),
      hasTest:false,//是否有测评
      longPress:false,
      x:600,//记录分享图标在page中x轴的位置
      y:900,//记录分享图标在page中y轴的位置
      screenWidth:'',
      screenHeight:'',
      multiple:1//px -> rpx 的换算比例   

    }
  },
  mounted(){
    /* 页面传递信息 */ 
    // 获取用户点击的课程的课程详情（必须）
    this.course_id = this.$mp.query.cid
    // 从已购列表进入（非必须）
    this.isPurchase = this.$mp.query.isPurchase
    console.log("页面传递参数(课程id)",this.course_id)
    //注意这里的isPurchase的数据类型是string true
    console.log("页面传递参数(是否从已购列表进入)",this.isPurchase)

    /* 页面初始化 */ 
    this.init() // 初始打开页面与页面刷新时调用
    this.init_video() // 只在初始打开页面调用,线上课获取观看记录
    this.getSysInfo()//获取屏幕的宽度和高度
  },
  onShareAppMessage: function (res) {
    console.log("页面分享",res)
    if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
        if(res.target.id==1){
          console.log("课程分享")
          this.shareInfo = 'cid='+this.course_id//分享前再次设置分享信息(若点击共享，最后未分享给对方，再点击分享，可能分享信息为共享)
          return {
            title: this.courseDetailItem.title,
            path: '/pages/course/children/courseDetail/main?'+this.shareInfo
          }
        }else{
          console.log("课程共享")
          this.handleShare()
          return {
            title: this.courseDetailItem.title,
            path: '/pages/course/children/courseDetail/main?'+this.shareInfo
          }
        }      
    }
    // 小程序上方分享(课程分享)
    this.shareInfo = 'cid='+this.course_id//待修改
    return {
        title: this.courseDetailItem.title,
        path: '/pages/course/children/courseDetail/main?'+this.shareInfo
    }
  },
  
  methods:{
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
    },
    handleLongPress(e){
      console.log(e)
      this.top = e.offsetTop
      this.longPress = true
    },
    init(){
      var request_url = ''
      if(this.isPurchase){
        request_url = '/coursedetail/buy/'
      }else{
        request_url = '/coursedetail/home/'
      } 
      this.init_courseDetail(request_url)
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
      console.log("触发滑动事件",e)
      if(e.clientX > this.screenWidth - (128/this.multiple)) e.clientX = this.screenWidth - (128/this.multiple)
      else if(e.clientX < 0) e.clientX = 0
      if(e.clientY > this.screenHeight - 160) e.clientY = this.screenHeight - 160
      else if(e.clientY < 0) e.clientY = 0
      this.x = e.clientX * this.multiple
      this.y =e.clientY * this.multiple

    },
    async init_courseDetail(coursedetailUrl){
      var that = this
      let current_data = {
        course_id: this.course_id,
        api_token: this.$global.token,//'8c1eIPCvBusNPV2vpDEleaBNDSHlpephjhxy2njk'
        brand_id:this.$global.kingarten_info.brand_id,
      }
      let information = await request(coursedetailUrl,current_data,'POST')
      console.log("测试information",information)
      information.data.detail.period = parseInt(information.data.detail.period)
      this.courseDetailItem = information.data.detail // 课程详情
      // 是否有测评
      if(this.courseDetailItem.is_ascess==1) {
        this.hasTest=true
      }else{
        this.hasTest=false
      }
    },
    prePlay(){      
      var that = this
      if(this.courseDetailItem.is_limit === 0){
        wx.showModal({
          title: '提示',
          content: '您暂无权限观看，请先购买课程',
          showCancel: false,
        })
        return
      }
    },
    init_video(){
      var that = this
      wx.getStorage({
        key: 'CurrentTime'+that.course_id,
        success: function(res){
          console.log("获取缓存成功！",res);
          // success               
          that.videoInitialTime = res.data
        }
      })
    },
    videoRecord(e){
      var that = this
      // console.log("时间记录",e)
      var detail = e.mp.detail;
      var currentTime = detail.currentTime
      this.videoDuration = detail.duration
      var duration = detail.duration
      wx.setStorage({
        key:"CurrentTime"+that.course_id,
        data:detail.currentTime,
        success(res){
          // console.log("保存成功！",res)
        }
      })
    },
    videoPlay(e){
      console.log("开始",e)
      // if(this.videoInitialTime!=0){
      //   wx.showToast({
      //     title:"已从上次观看位置继续观看",
      //     icon:'none',
      //     duration:2000
      //   })
      // }       
    },
    videoEnded(e){
      console.log("完毕",e)
      // 发出进度请求
      this.recordSchedule()
      this.videoInitialTime = '0'
    },
    videoPause(e){
      console.log("暂停",e)
      // 发出进度请求
      this.recordSchedule()
    },
    
    handleForward(){
      this.shareInfo = 'cid='+this.course_id//待修改
    },
    async handleLike(courseDetailItem){
      console.log("点击喜欢或取消喜欢")
      courseDetailItem.is_prefer = !courseDetailItem.is_prefer
      var that = this
      var requestUrl = ''
      // 设置接口地址
      if(courseDetailItem.is_prefer){
        requestUrl = '/prefer/add/'
      }else{
        requestUrl = '/prefer/del/'
      }   

      let current_data = {
        api_token:this.$global.token,
        course_id:this.course_id,
      }
      let information = await request(requestUrl,current_data,'POST')
      console.log("操作结果",information)
    },
    // 课程进度保存
    async recordSchedule(){
      // var that = this
      var currentTime = wx.getStorageSync('CurrentTime'+that.course_id); 
      var record = 100*currentTime/that.videoDuration  
      record = record.toFixed(2); 
      console.log("进度",record)

      let current_data = {
        api_token: that.$global.token,
        course_id: that.course_id,
        percent: record
      }
      let information = await request('/course/schedule/',current_data,'POST')
      console.log("记录",information)
    },
    handleCoureseTest(){
      console.log("进入测评")
      var that = this
      wx.navigateTo({
        url:'/pages/course/children/courseTest/main?cid='+that.course_id+"&isCompleted="+that.courseDetailItem.is_fulfil
      }) 
    },
    handleTest(courseItem){
      console.log("进入测评")
      wx.navigateTo({
        url:'/pages/course/children/courseTest/main?cid='+courseItem.course_id+"&isCompleted="+courseItem.is_fulfil
      })   
    },
    enterLive(){
      console.log("进入直播间")
      let customParams = encodeURIComponent(JSON.stringify({ path:'pages/course/children/courseDetail', pid: 1 }))
      wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${this.roomId}&custom_params=${customParams}`
    })
    }
  },
  onUnload(){
    console.log("页面消失")
    this.autoplayVideo = false
  }  
}
</script>
<style scoped>
.mask{
  position: absolute;
  top:0;
  right:0;
  width:100%;
  height:40%;
  z-index:1000;
}
  #container{
  width: 100%;
  height: 100%;
  }
  #monitor{
    position: fixed;
    width:128rpx;
    height:128rpx;
    z-index:20;
  }
  .monitor-share-button{
    background-size: 128rpx 128rpx;
    background-image: url(https://cdn.sc-edu.com/img/2020/08/28/15/a60fc10ab9f14fa227e9cd2b1dd67aa9.png);
    width:128rpx;
    height:128rpx;
    border:none;
  }
  #content{
    display:flex;
    flex-direction:column;
  }
  .course-detail-top{
    width: 100%;
    /* height: 650rpx; */
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
    /* height: 214rpx; */
    /* background-color: coral; */
    /* border: solid 2rpx plum; */
    position: relative;
  }
  .course-name{
    display: block;
    /* width: 400rpx; */
    line-height: 44rpx;
    font-weight: 550;
    font-family: Ping Fang FC;
    margin: 32rpx 0 16rpx 32rpx;
    font-size: 32rpx;
  }
  .course-describtion{
    display: block;
    line-height: 40rpx;
    font-size: 28rpx;
    font-family: Ping Fang SC;
    color: #828282;
    margin-left: 32rpx;
  }
  .enter-live{
    border:none;
    width: 282rpx;
    line-height: 64rpx;
    text-align: center;
    background: linear-gradient(180deg,#27C6FA 0%,#268AFa 100%);
    border-radius: 6rpx;
    font-family: Ping Fang SC;
    font-size: 30rpx;
    color: #ffffff;
    position: absolute;
    right: 32rpx;
    bottom:0rpx
  }
  .expand-select-area{
    width:50rpx;
    height: 50rpx;
    /* background-color: pink; */
    position: relative;
    left: 675rpx;
    bottom: 140rpx;
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
  .split-line{
    width: 750rpx;
    height: 8rpx;
    background-color: #E0E0E0;
    margin-bottom: 24rpx;
    margin-top: -24rpx;
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
  .course-detail-test{
    /* width: 696rpx; */
    position: relative;
    height: 118rpx;
    background: linear-gradient(116.02deg, #6360FF 0%, #2164C2 100%);
    border-radius: 2px;
    margin-bottom: 18rpx;
  }
  .course-detail-test-title{
    position: relative;
    top:36rpx;
    margin:32rpx;
    color: #FFFFFF;
    font-size: 16px;
    line-height: 22px;
  }
  .course-detail-test-text-uncompleted{
    position: absolute;
    top:38rpx;
    right:24rpx;
    background: #FFFFFF;   
    border-radius: 2px;
    padding:4rpx 10rpx;
    color: #2570D9;
    font-weight: 500;
    font-size: 24rpx;
    line-height: 34rpx;  
  }
  .course-detail-test-text-completed{  
    position: absolute;
    top:38rpx;
    right:24rpx;
    background: rgba(255,255,255,0.2);       
    border-radius: 2px;
    padding:4rpx 22rpx;
    color: #FFFFFF;
    font-weight: 500;
    font-size: 24rpx;   
    line-height: 34rpx;  
  }
  /* .course-detail-show-richtext{
    height: 430rpx;
    background-color: #E0E0E0;
  } */
  .course-detail-show-buttom{
    height: 88rpx;
    width: 686rpx;
    background: #2570D9;
    border-radius: 4rpx;
    color: #FFFFFF;
    font-weight: 530;
    font-size: 32rpx;
    font-family: Ping Fang SC;
    position: fixed;
    top: 90.15%;
    bottom: 4.43%;

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
    /* height: 242rpx; */
    position: relative;
  }
  .course-directory-click-area{
    width:700rpx;
    height: 140rpx;
    position: absolute;
    z-index:50;
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