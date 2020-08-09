<template>
  <div id="container" >
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
        <!-- <div id="nav-list-pic" @click="seeMoreCourse(item)" :style="{backgroundColor: nav_background[index]}"> -->
        <img id="nav-list-pic" :src="nav_pic[index]" alt="" @click="seeMoreCourse(index+1)">
        <!-- </div> -->
        <div id="nav-list-name">{{item[0].type}}</div>
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
          <div id="lesson-recommnd-content" v-for="(item,index) in course_list" :key="item" @click="seeCourseDetail(item)">         
            <img id="lesson-recommand-pic" :src="course_list[index].img">
            <div id="lesson-recommand-title">  
              {{course_list[index].title}}
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
import data from '../../../static/data.json'
console.log(data,typeof data)
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
      nav_pic: ['https://cdn.sc-edu.com/img/2020/07/30/17/4498e013b3f75ec7bfa42b0a004b3627.png', 
      'https://cdn.sc-edu.com/img/2020/07/30/17/33cf804de0ee5f061d9d5c2e2bc22761.png', 
      'https://cdn.sc-edu.com/img/2020/07/30/17/2c5382ebb4fd7e04306299bf0f8695c1.png', 
      'https://cdn.sc-edu.com/img/2020/07/30/17/53561e167ff63fc1650f6724b840dd2f.png', 
      'https://cdn.sc-edu.com/img/2020/07/30/17/68c650f33737e2e4a3a44222865e82bc.png'],
      course_list: [],
    }
  },
   mounted () {
     this.nav_list_name = data
     var that = this;
      wx.request({
        url: 'https://wx.sc-edu.com/knsh/home/',
        method:'POST',
        header:{
          'content-type':"application/x-www-form-urlencoded"
        },
        data: {
          api_token: "8c1eIPCvBusNPV2vpDEleaBNDSHlpephjhxy2njk"
        },
        success(res){       
          console.log(res)        
          that.banner_list = res.data.data.banner;
          that.course_list = res.data.data.courses;
        }
      }) 
      this.getUserId()
   
   },
   computed: {
     carouel () {
       return [...this.nav_list_name].splice(0,2)
     }
   },
  methods: {
    showAllCourses () {
      console.log('展示全部课程')
      wx.navigateTo({
        url:'/pages/index/children/showAllCourse/main',
      })
    },
    seeMoreCourse(typeIndex){
      console.log("导航type",typeIndex)
      wx.navigateTo({
        url: '/pages/index/children/navClass/main?tid='+typeIndex,
      })

    },
    seeCourseDetail(courseDetailItem){
      console.log("查看课程详情",courseDetailItem)
       wx.navigateTo({
        url:'/pages/course/children/courseDetail/main?cid='+courseDetailItem.course_id
      })
    },
    clickBanner(bannerItem){
      console.log("轮播图",bannerItem)
      
      if(bannerItem.type == 1){
          wx.navigateTo({
            // url:'/pages/course/children/courseDetail/main?courseDetailItem='+JSON.stringify(bannerItem)
            url:'/pages/course/children/courseDetail/main?cid='+bannerItem.course_id
            // url:'/pages/course/children/courseDetail/main?courseId='+bannerItem.course_id
          })
      }else{
          wx.navigateTo({
              url:'/pages/index/children/article/main?url='+bannerItem.article_url
          })
      }
    },
    getUserId(){
      let that = this
      wx.login({
        success: function(res){
          // console.log(res.code)
          if(res.code){
            that.$global.setCode(res.code)
            // console.log("global中的res_code",that.$global.code)
            wx.request({
              url: 'https://wx.sc-edu.com/knsh/login/',
              data: {
                code:that.$global.code
              },
              method: 'POST', 
              header: {'content-type': 'application/x-www-form-urlencoded'},       
              success: function(res){
                // console.log(res.data)
                console.log("getUserId",res.data)
                that.$global.setToken(res.data.data.api_token)
                that.$global.setUserNickName(res.data.data.nick_name)
                that.$global.setUserAvatar(res.data.data.avatar)
                
                // console.log("global中的token值",that.$global.token)
                //如果当前全局变量的is_bind为0，从服务器更新一下is_bind值
                if(that.$global.is_bind==0){
                  that.$global.setIsBind(res.data.data.is_oauth && res.data.data.is_phone)
                }
                if(that.$global.kingarten_info.brand_id==null){
                  //存储当前幼儿园的信息，如机构号，创建人的姓名，学生规模，
                  //教师规模，幼儿园的名字幼儿园的类型及身份
                  that.$global.setBrandId(res.data.data.brand_id)
                  // console.log(that.$global.kingarten_info.brand_id)
                  // that.$global.setName(res.data.data.name)
                  // that.$global.setStuRange(res.data.data.stu_range)
                  // that.$global.setTeaRange(res.data.data.tea_range)
                  // that.$global.setTitle(res.data.data.title)
                  // that.$global.setType(res.data.data.type)
                  // that.$global.setIdentity(res.data.data.identity)
                }
              },
              fail: function() {
                console.log("获取数据失败")
              }
            })
          }      
        },
        fail: function() {
          console.log("登录失败")
      }
    })
    },
    tipToCreateKindergarten(){
      wx.showModal({
      title: '',
      content: '您是否要创建幼儿园',
      success: function(res) {
        if(res.confirm){
          console.log("用户点击确定")
          wx.navigateTo({
            url:'/pages/index/children/creatKindergarten/main'
          })
        }else if (res.cancel) {
            console.log('用户点击取消')
        }       
      }
      })
    }

  },
   onShow(){
    console.log("onshow")
    var that = this
    //当用户未登录时，将isBind设为false
    wx.getSetting({
      success: (res)=>{
        console.log(res)
          if(!res.authSetting['scope.userInfo']){
              wx.setStorage({
                key: 'isBind',
                data: false,
              })
          }
      }
    })
    // //当用户登录完成，且当前名下没有任何幼儿园时，提示用户创建幼儿园
    wx.getStorage({
      key: 'isBind',
      success: function(res){
        if(res.data==true&&that.$global.kingarten_info.brand_id==null){
          setTimeout(()=>{
            if(that.$global.kingarten_info.brand_id==null){
              that.tipToCreateKindergarten()
            }
          },3000)
          
        }
      },
      fail: function() {
        console.log("当前用户未登录")
      },
    })
    //若用户创建幼儿园，重新请求login接口,请求完成后将isCreate设为false
    wx.getStorage({
      key: 'isCreate',
      success: function(res){
        if(res.data==true){
          that.getUserId()
          wx.setStorage({
            key: 'isCreate',
            data: false,
          })

        }
      },
      fail: function() {
        console.log("当前缓存中没有isCreate")
      },
    })
    

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
    top: 560rpx;
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
    background-color: teal;

    
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
    height: 280rpx;
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
    width: 330rpx;
    /* background-color: darkkhaki; */
    /* text-align: center; */
    line-height: 42rpx;
    font-size: 28rpx;
    margin-left: 10rpx;
  }
  #other-information{
    position: relative;

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
    right: 1rpx;
    font-weight: 550;
    top: 1rpx;

  }
  
</style>