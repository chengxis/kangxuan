<template>
  <div id="container" v-show="isShow">
    <!-- 搜索栏 -->
    <SearchBar></SearchBar>
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
      <swiper-item v-for="(item,index) in banner_list" :key="item">
        <img class="swiper-image" :src="banner_list[index].img_url" @click="clickBanner(item)"> 
      </swiper-item>
    </swiper>
    <!-- 模块导航 -->
    <div id="nav">
      <div id="nav-list" v-for="(item,index) in nav_list_name" :key="item">
        <img id="nav-list-pic" :src="nav_pic[index]" alt="" @click="seeMoreCourse(item)">
        <!-- </div> -->
        <div id="nav-list-name">{{item}}</div>
      </div>        
    </div>
    <!-- 推荐课程列表 -->
    <div id="lesson-recommand">
      <div class="lesson-recommand-innner">
        <div id="lesson-recommand-top-title">
          <div class="title-left" style="line-height:40rpx">
            <span>课程推荐</span>
          </div>
          <div class="title-right" >
            <span @tap="showAllCourses">查看更多</span>
          </div>
        </div>
        <div id="lesson-recommand-list">
          <div id="lesson-recommnd-content" v-for="(item,index) in course_list" :key="item" >
            <div>        
              <img id="lesson-recommand-pic" :src="course_list[index].img" @click="seeCourseDetail(item)">
              <span class="course-type">{{item.type_text}}</span>
            </div>
            <div id="lesson-recommand-title" @click="seeCourseDetail(item)">  
              {{course_list[index].title}}
            </div>
            <div class="expand-select-area" @tap=handleLove(item)>
              <img class="iconfont-hellowlove"  
              v-show="!item.is_prefer"
              src="https://cdn.sc-edu.com/img/2020/09/03/10/ce9e78e105e98f68b5ce33872acf8ea5.png">
              <img class="iconfont-solidlove" v-show="item.is_prefer"
              src="https://cdn.sc-edu.com/img/2020/09/03/10/80011ac1c2870f54a0b1a1c17dc8d051.png">
            </div>  
            <div id="other-information">
              <span class="lesson-recommand-people">{{course_list[index].number+"人开通"}}</span>
              <span class="lesson-recommand-price">{{"￥"+course_list[index].price+"/年"}}</span>
            </div>
          </div>      
        </div>
      </div>  
    </div> 
        
  </div>
 
</template>

<script>
import SearchBar from '../../components/search_bar/SearchBar'
import {login,isAuthentication} from '../../lib/utils/certification'
import request from '../../utils/request'
export default {
  components: {
    SearchBar,
    // data
  },
  data () {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      indicatorColor: '#fff',
      indicationActiveColor: '#666',
      circular: true,
      banner_list: [],
      nav_list_name:[],
      nav_pic: [],
      course_list: [],
      isShow:false,//是否显示页面
    }
  },
   async mounted () {
      this.isShow = false
      wx.showLoading({
        title: '加载中',
      })
     //提示用户是否需要创建幼儿园
     this.tipToCreateKindergarten()   
   },
  methods: {
    async init(){
      let result = await login()
      let isAuth = await isAuthentication()  
      //只有当用户登录且身份为园长时，显示ai推荐
      this.$global.setIsAuth(isAuth)
      if(isAuth && result.type === '1'){
        this.nav_list_name = ['线上课','直播课','面授课','ai推荐','线上商城']
        this.nav_pic = ['https://cdn.sc-edu.com/img/2020/07/30/17/4498e013b3f75ec7bfa42b0a004b3627.png', 
      'https://cdn.sc-edu.com/img/2020/07/30/17/33cf804de0ee5f061d9d5c2e2bc22761.png', 
      'https://cdn.sc-edu.com/img/2020/07/30/17/2c5382ebb4fd7e04306299bf0f8695c1.png', 
      'https://cdn.sc-edu.com/img/2020/07/30/17/53561e167ff63fc1650f6724b840dd2f.png', 
      'https://cdn.sc-edu.com/img/2020/07/30/17/68c650f33737e2e4a3a44222865e82bc.png']
      }else{
        this.nav_list_name = ['线上课','直播课','面授课','线上商城']
        this.nav_pic = ['https://cdn.sc-edu.com/img/2020/07/30/17/4498e013b3f75ec7bfa42b0a004b3627.png', 
      'https://cdn.sc-edu.com/img/2020/07/30/17/33cf804de0ee5f061d9d5c2e2bc22761.png', 
      'https://cdn.sc-edu.com/img/2020/07/30/17/2c5382ebb4fd7e04306299bf0f8695c1.png',  
      'https://cdn.sc-edu.com/img/2020/07/30/17/68c650f33737e2e4a3a44222865e82bc.png']
      }
      await this.getBanner()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      
    },
    async getBanner(){
      let current_data = {
        api_token:this.$global.token,
      }
      let information = await request('/home/',current_data,'POST')
      // console.log("测试information",information)        
      this.banner_list = information.data.banner;
      this.course_list = information.data.courses;
      this.isShow = true
      wx.hideLoading()
      for(let i of this.course_list){
        if(i.type === '1') i.type_text = "线上课"
        else if(i.type === '2') i.type_text = "直播课"
        else if(i.type === '3') i.type_text = "面授课"
        else i.type_text = "课程包"
        if(i.title.length >= 15){
          i.title = i.title.substring(0,14) + '...'
        }
      }
    },
    showAllCourses () {
      console.log('展示全部课程')
      wx.navigateTo({
        url:'/pages/index/children/showAllCourse/main',
      })
    },
    async handleLove(item){
      // console.log("收藏或取消收藏",item)
      item.is_prefer = !item.is_prefer
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
    },
    seeMoreCourse(type){
      //当typeIndex===4时，跳转到课程推荐页面,否则对课程进行渲染
      // console.log("typeIndex",type)
      if(type === 'ai推荐'){
        wx.navigateTo({
          url: '/pages/mine/children/courseRecommand/main',
      })
      }else{
        wx.navigateTo({
          url: '/pages/index/children/navClass/main?type='+type,
      })
      }
    },
    seeCourseDetail(courseDetailItem){
      // console.log("查看课程详情",courseDetailItem)
       wx.navigateTo({
        url:'/pages/course/children/courseDetail/main?cid='+courseDetailItem.course_id+'&isPurchase=false'
      })
    },
    clickBanner(bannerItem){
      // console.log("轮播图",bannerItem)  
      if(bannerItem.type == 1){
          wx.navigateTo({
            url:'/pages/course/children/courseDetail/main?cid='+bannerItem.course_id
          })
      }else{
          wx.navigateTo({
              url:'/pages/index/children/article/main?url='+bannerItem.article_url
          })
      }
    },
    async tipToCreateKindergarten(){
      //当用户登录完成，且当前名下没有任何幼儿园时，提示用户创建幼儿园
      let isAuth = await isAuthentication(await login())
      // console.log("测试点",isAuth)
      if(isAuth&&this.$global.kingarten_info.brand_id===null){
        wx.showModal({
        title: '',
        content: '您是否要创建幼儿园',
        success: function(res) {
          if(res.confirm){
            // console.log("用户点击确定")
            wx.navigateTo({
              url:'/pages/index/children/creatKindergarten/main'
            })
          }else if (res.cancel) {
            // console.log('用户点击取消')
          }       
        }
        })
      }
    },

   
  },
  async onShow(){
    //若用户创建幼儿园，重新请求login接口,请求完成后将其设为false
    // this.isShow = false
    if(this.$global.getLoginAgain){
      this.isShow = false
      wx.showLoading({
        title: '加载中',
      })
      await login()
      wx.hideLoading()
      this.$global.setGetLoginAgain(false)
    }
    this.init()
    
   },
  onPullDownRefresh:function(){
      wx.showNavigationBarLoading() //在标题栏中显示加载
      this.init()
     
    }
}
</script>

<style> 
  page{
    width: 100%;
    height: 100%;
    background-color: white;
  }

  #container{
    box-sizing: content-box; 
    padding-bottom: 36rpx;
    width: 100%; height: 100%;
    position: relative;
  }
  /**轮播图 */
  #container .swiper-list{
    position: relative;  
    background-color: white;
    height: 420rpx;
    top: 20rpx;
    padding-right: 10rpx;
  }
  .swiper-image{
    position: absolute;
    width: 690rpx;
    height: 662rpx;
    left: 4.27%;
    margin: auto;

  }
  /**nav */
  #nav{
    position: absolute;
    top: 575rpx;
    height: 168rpx;
    /* background-color:violet; */
    display: flex;
    justify-content: space-between;
    /* border: 2rpx solid violet; */
    left: 4.27%;
    right: 4.27%;
    
  }
  #nav-list{
    height: 168rpx;
    position: relative;
    text-align: center;
    display: flex;
    justify-content:center;
    width: 136rpx;
    /* border: 2rpx solid red; */
  }
  #nav-list-pic{
    width: 88rpx;
    height: 88rpx;
    /* background-color: yellow; */
    border-radius: 50%;
    position: relative;
    top: 15rpx;
  }
  .course-type{
    height: 40rpx;
    background-color:rgba(1,1,1,.5);
    text-align: center;
    line-height: 40rpx;
    position: absolute;
    color: white;
    font-size: 20rpx;
    /* bottom: 15rpx; */
    padding: 0 10rpx;
    border-radius: 10rpx;
    margin-left: 235rpx;
    bottom: 165rpx;
  }
  #nav-list-name{
    height: 30rpx;       
    /* background-color: aqua; */
    text-align: center;
    line-height: 30rpx;
    position: absolute;
    bottom: 20rpx;
    /* border:2rpx solid black; */
    font-size:25rpx
    
    }

  /* 推荐课程 */
  #lesson-recommand{
    position: relative;
    margin-top: 240rpx;
    height: 380rpx;
    margin-bottom: 50rpx;
  }
  .lesson-recommand-innner{
    position: absolute;
    left: 4.27%;
    right: 4.27%;
    top: -20rpx;

    
  }
  #lesson-recommand-top-title{
    position: absolute;
    width: 100%;
    /* background-color:yellow;  */
    height: 70rpx;
  }

  .title-left {
    position: absolute;
    font-size: 32rpx;
    top: 18rpx;
    left: 10rpx;  
  }
  .title-right{
    position: absolute; 
    line-height: 34rpx;
    color: #BDBDBD;
    font-size:25rpx ;
    right: 10rpx;
    top: 20rpx;
  }
  #lesson-recommand-list{
    position: absolute;
    top: 72rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  #lesson-recommnd-content{
    width:310rpx;
    /* height: 280rpx; */
    /* background-color: cornflowerblue; */
    padding: 16rpx 16rpx;
    /* border: 2rpx solid pink; */
  }
  #lesson-recommand-pic{
    width: 330rpx;
    height: 252rpx;
    /* background-color: chartreuse; */
  }
  #lesson-recommand-title{
    width: 228rpx;
    /* background-color: darkkhaki; */
    /* text-align: center; */
    height: 84rpx;
    line-height: 42rpx;
    font-size: 30rpx;
    margin-left: 10rpx;
  }
  #other-information{
    position: relative;
    margin-top: -40rpx;
    margin-bottom: 40rpx;

  }
  .lesson-recommand-people{
    position: absolute;
    line-height: 30rpx;
    font-size: 22rpx;
    color: #828282;
    left: 10rpx;
  }
  .lesson-recommand-price{
    position:absolute;
    line-height: 26rpx;
    font-size: 24rpx;
    color: #FB2A36;
    right: -15rpx;
    font-weight: 550;
    top: 1rpx;

  }

  .expand-select-area{
    width:50rpx;
    height: 50rpx;
    /* background-color: pink; */
    position: relative;
    left: 275rpx;
    top: 20rpx;
  }
  .iconfont-hellowlove{
    position: absolute;
    width: 50rpx;
    height: 50rpx;
    right: 8rpx;
    top: -105rpx;

  }

  .iconfont-solidlove{
     position: absolute;
    width: 50rpx;
    height: 50rpx;
    right: 8rpx;
    top: -105rpx;
  }
  
</style>