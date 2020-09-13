<template>
  <div id="container" v-show="isShow">
    <div id="user-info">
      <InputBox :cChangeModel="changeModel" 
        :cIsModel="isModel"
        @cancleTap="cancleTap"
        @confirmTap="confirmTap"/>
      <img src="https://cdn.sc-edu.com/img/2020/07/30/17/9b4027b39cde651a636299c7536216a8.png" 
            class="top-background"
            alt="">
      <div class="user-info-frame">
        <img class="user-image" :src="isAuthentication&&isLogin?userInfo.avatarUrl:'https://cdn.sc-edu.com/img/2020/08/06/11/e50fe64282b02ee496ddb51716793768.png'">
        <div class="user-hello" v-if="!isLogin&&isAuthentication||isLogin&&!isAuthentication||!isLogin||!isAuthentication">尊敬的用户，您好！</div>
        <div class="user-name" v-if="isAuthentication&&isLogin">{{userInfo.name===''?userInfo.nickName:userInfo.name}}</div>
        <img class="update-name" 
        src="https://cdn.sc-edu.com/img/2020/08/07/16/9ec19d49363a28d4fbb2d93aa0a959e2.png"
        v-if="isAuthentication&&isLogin"
        @click="updateUserName">
        <span class="tip-to-authen-and-login" 
              v-if="!isAuthentication&&!isLogin">请点击右侧按钮授权</span>
        <span class="tip-to-authen-and-login" 
              v-if="isAuthentication&&!isLogin">请点击右侧按钮登录</span>
        <span class="user-identity" v-if="isAuthentication&&isLogin">{{userInfo.type}}</span>
        <span class="user-brand" v-if="isAuthentication&&isLogin">{{userInfo.title}}</span>
        <button class="user-switch-identity" 
        v-if="!isAuthentication&&!isLogin"
        open-type="getUserInfo" 
        @getuserinfo="handleUserInfo">点击授权</button> 
        <button class="user-switch-identity" 
        v-if="isAuthentication&&!isLogin"
        @click="handlePhoneAuthentication">点击登录</button>  
        <button class="user-switch-identity" 
        @tap="switchIdentity" 
        v-if="isAuthentication&&isLogin">身份切换</button>  
      </div>   
    </div>
    <div id="user-function">
      <div class="function-list" @click="seeMyEvaluation" v-show="isTeacher&&isHasBrand">
        <img class="list-icon" src="https://cdn.sc-edu.com/img/2020/08/06/10/ecffbbe569eb9fa6980fda20ef297064.png"/>
        <span class="list-title">我的评测</span>
        <span class="enter">
        </span>
      </div>
      <div class="function-list" @click="handleManageKindergarten(userInfo.title)" v-show="!isTeacher&&isLogin">
        <img class="list-icon" src="https://cdn.sc-edu.com/img/2020/07/31/09/55e1522cd0e29c0a36194f2279660105.png"/>
        <span class="list-title">幼儿园管理</span>
        <span class="enter">
        </span>
      </div>
      <div class="function-list" @click="seeStudyProgress" v-if="!isTeacher&&isLogin">
        <img class="list-icon" src="https://cdn.sc-edu.com/img/2020/07/31/09/14fe233864e069f74c9110b52cd88548.png"/>
        <span class="list-title">学习进度</span>
        <span class="enter">
        </span>
      </div>
      <div class="function-list" @click="seeCourseRecommand" v-if="!isTeacher&&isLogin">
        <img class="list-icon" src="https://cdn.sc-edu.com/img/2020/07/31/09/4a2d8b4c719de7c61126ee81e4b25162.png"/>
        <span class="list-title">课程推荐</span>
        <span class="enter">
        </span>
      </div>
      <div class="function-list" @click="seeMyRewardPoints" v-if="isLogin">
        <img class="list-icon" src="https://cdn.sc-edu.com/img/2020/09/08/14/b7c5f56d26cbec28be7a15f71869b4cc.png"/>
        <span class="list-title">我的积分</span>
        <span class="reward-points">{{point}}</span>
        <span class="enter">
        </span>
      </div>
      <div class="function-list" @click="handleProblemFeedback" >
        <img class="list-icon" src="https://cdn.sc-edu.com/img/2020/07/31/09/b3fd3a4c03948612ce89bdf2f3cf7b0c.png"/>
        <span class="list-title">问题反馈</span>
        <span class="enter">
        </span>
      </div>
        <div class="function-list" @click="aboutUs">
        <img class="list-icon" src="https://cdn.sc-edu.com/img/2020/07/31/09/d27611fdf904807580dacf1ee539ab68.png"/>
        <span class="list-title">关于我们</span>
        <span class="enter">
        </span>
      </div>
    </div>
  </div>

</template>

<script>
import request from '../../lib/utils/request'
import InputBox from '../../components/input_box/InputBox'
import {login,getUserInfo,isAuthentication} from '../../lib/utils/certification'
export default {
  data(){
    return{
      userInfo:[],
      isLogin:false,
      isAuthentication:false,
      isHasBrand:false,//是否有自己的机构
      isTeacher:false,//是否是教师身份，默认是教师身份
      changeModel:false,
      isModel:false,
      updateName:'',
      isHasName:false,
      isShow:false,//是否显示页面
      point:'',//显示积分
    }
  },
  components:{
    InputBox

  },
  mounted(){
    let that = this
    wx.getUserInfo({
      success: function(res){
      // console.log("测试点res",res)
      that.userInfo = res.userInfo
      that.isAuthentication = true
      }}) 
  },
  methods:{
    updateUserName(){
      // console.log("修改名称")
      this.changeModel = true
      this.isModel = true
    },
    async handleUserInfo(e){
      // console.log("执行这里")
      //第一次授权判断是否获取到信息，若获取到，对我的页面做一些处理
      var isHasUserInfo = await getUserInfo(e)
      if(isHasUserInfo===true)
        this.isAuthentication = true
        wx.navigateTo({
          url: '/pages/mine/children/phoneAuthentication/main',   
        })
    },
    async handleAuthentication(){
      //对用户的登录状态进行处理
      let isAuth = await isAuthentication(await login())
      console.log(isAuth)
      // console.log(isAuth)
      // console.log("测试点",isAuth)
      //当isAuth为true时，代表用户进行了头像与手机授权,false代表只进行了头像授权，0代表未进行头像授权
      if(isAuth === true){
        this.isAuthentication = true
        this.isLogin = true
        //当认证和授权俱在，则判断是否获取幼儿园信息,若未获取到则表明当前用户并没有自己的幼儿园
        this.getKindergartenInformation()
        if(this.$global.kingarten_info.brand_id ===null){
          // console.log("这里执行")
          this.userInfo.title = "您还没有自己的幼儿园"
          this.userInfo.type = "教师"
        }
      }else if(isAuth===0){
        wx.hideLoading()
        this.isShow = true
        this.isAuthentication = false
        this.isLogin = false
      }else{
        wx.hideLoading()
        this.isShow = true
        this.isAuthentication = true
        this.isLogin = false
      }
    },
    async getKindergartenInformation(){
      //根据当前存放的brand_id获取相关幼儿园信息
      let current_data = {
        api_token:this.$global.token,
        brand_id:this.$global.kingarten_info.brand_id
      }
      let infromation = await request('/person/info/',current_data,'POST')
      console.log("mine里面根据brand_id返回的信息",infromation)
      //数据加载完成隐蔽加载弹框
      wx.hideLoading()
      this.isShow = true
      //将当前幼儿园的名字存在本地
      console.log(infromation.data.title === '')
      if(infromation.data.title === '') {
        infromation.data.title = "您还没有自己的幼儿园"
        }
      else this.$global.setTitle(infromation.data.title)
      //将已做的ai测评的id号保存在本地
      this.$global.setResultId(infromation.data.result_id)
      if(infromation.state === 1){
        this.point = infromation.data.point
        this.userInfo = infromation.data
        // userInfo.nick_name = infromation.data.nickName
        if(infromation.data.name === ''){
          //将当前用户的姓名存在本地
          this.isHasName = false  
        }else if(infromation.data.name !== ''){
          this.$global.setUserName(infromation.data.name)
          this.isHasName = true      
        }
        // console.log(infromation.data.type === '1')
        if(infromation.data.type === '1') {
           //存储当前身份
          this.$global.setIdentity(infromation.data.type)
          this.userInfo.type = '园长'
          this.isTeacher = false
        }else {
         //存储当前身份
          this.$global.setIdentity(infromation.data.type);
          this.userInfo.type = '教师';
          this.isTeacher = true;
        }

      }else{
        wx.showToast({
          title: infromation.message,
          icon: 'none',
          duration:2000
        })
        this.isAuthentication = false
        this.lsLogin = false
      }
    },

   //子组件inputBox做出确定或取消操作，父组件对相关数据改变
    cancleTap(){
      this.changeModel = false
      this.isModel = false

    },
    async confirmTap(name){
      this.changeModel = false
      this.isModel = false
      this.updateName = name
      //将姓名保存在当前页面的userInfo信息上
      this.userInfo.name = this.updateName
      //将姓名上传到接口，并保存到本地的global
      let current_data = {
        api_token:this.$global.token,
        name:name
      }
      let uName = await request('/person/change/',current_data,'POST')
      if(uName.state === 1) {
        this.$global.setUserName(this.updateName)
        // console.log("ceshi",this.$global.user_info.name)
      }else{
        console.log("修改姓名失败")

      }
        
    },
    //下面都是进行界面切换的事件处理函数
    handlePhoneAuthentication(){
      wx.navigateTo({
        url:'/pages/mine/children/phoneAuthentication/main'
      })
    },
    switchIdentity(){
      console.log("这里进行切换身份")
      wx.navigateTo({
        url:'/pages/mine/children/switchIdentity/main'
        
      })
    },
    seeMyEvaluation(){
      console.log("查看我的评测")
      wx.navigateTo({
        url:'/pages/mine/children/seeMyEvaluation/main'
      })

    },
    handleManageKindergarten(kindergartenName){
      console.log("进行幼儿园管理")
      wx.navigateTo({
        url:'/pages/mine/children/manageKindergarten/main?kindergartenName='+JSON.stringify(kindergartenName)
      })
    },
    seeStudyProgress(){
      console.log("查看学习进度")
      wx.navigateTo({
        url:'/pages/mine/children/studyProgress/main'
      })
    },
    seeCourseRecommand(){
      console.log("查看课程推荐")
      wx.navigateTo({
        url:'/pages/mine/children/courseRecommand/main'
      })
    },
    seeMyRewardPoints(){
      console.log("查看我的积分")
      wx.navigateTo({
        url:'/pages/mine/children/myRewardPoints/main'
      })
    },
    handleProblemFeedback(){
      console.log("查看问题反馈")
      // wx.navigateTo({
      //   url:'/pages/mine/children/problemFeedback/main'
      // })
      wx.navigateToMiniProgram({
        appId: 'wx8abaf00ee8c3202e',
        extraData: {
          id:'193451'
        },
        // envVersion: 'develop',
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
      
    },
    aboutUs(){
      console.log("关于我们")
      wx.navigateTo({
        url:'/pages/mine/children/aboutUs/main'
    })
    },
  },
  onShow(){
    // console.log(this.$global.kingarten_info.brand_id)
    this.handleAuthentication()
    if(this.$global.kingarten_info.brand_id!=null) this.isHasBrand = true
    //根据$global中getBrandAgain判断是否为true判断是否需要重新获取当前机构信息
    if(this.$global.getBrandAgain === true){
      this.getKindergartenInformation()
      this.$global.setGetBrandAgain(false)
    }
  }
  
}
</script>

<style>
  page{
    width: 750rpx;
    background: #fdfdfd;
  }
  #container{
    box-sizing: content-box; padding-bottom: 36rpx;
    width: 750rpx; height: 100%;
  }
  #user-info{
    width: 100%;
    margin-bottom: 40rpx;
  }
  .top-background{
    height: 554rpx;
    width: 750rpx;
    position: relative;   
  }
  .user-info-frame{
    width: 750rpx;
    height: 218rpx;
    margin-top: -220rpx;
    /* background: #C4C4C4; */
    position: relative;
    z-index: 2;
    text-align: center;
  }
  .user-image{
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
    /* background-color: pink; */
    position: absolute;
    top: -170rpx;
    left: 300rpx;
  }
  .user-hello{
    font-size: 32rpx;
    color: #FFFFFF;
    font-weight: 500;
    font-family: Ping Fang SC;
    line-height: 44rpx;

  }
  .user-name{
    display: inline-block;
    font-size: 36rpx;
    line-height: 38rpx;
    font-family: Ping Fang SC;
    font-weight: 550;
    color: white;
  }
  .update-name{
    display: inline-block;
    width: 31.32rpx;
    height: 31.32rpx;
    margin-left: 15rpx;

  }
  .user-authentication{
    line-height: 40rpx;
    font-size: 20rpx;
    position: absolute;
    color: white;
    top: 6rpx;
    left: 420rpx;
    text-decoration: underline;

  }
  .login-button{
    width: 180rpx;
    height: 60rpx;
    font-size: 24rpx;
    line-height: 60rpx;
  }
  .user-identity{
    line-height: 38rpx;
    font-weight: 550;
    font-family: Ping Fang SC;
    font-size: 36rpx;
    /* margin: 126rpx 18 54rpx 92rpx; */
    color: #460909;
    position: absolute;
    left: 92rpx;
    top: 126rpx;
    /* margin-right: 18rpx; */
  }
  .tip-to-authen-and-login{
    position: absolute;
    left: 92rpx;
    top: 126rpx;
    line-height: 40rpx;
    color: #460909;

  }
  .user-brand{
    line-height: 24rpx;
    font-size: 24rpx;
    color: #460909;
    font-family: Ping Fang SC;
    opacity: 0.8;
    position: absolute;
    top: 137rpx;
    left: 182rpx;

  }
  .user-switch-identity{
    line-height: 42rpx;
    border-radius: 20rpx;
    background-color:#460909 ;
    color: #FFFFFF;
    font-size:22rpx;
    /* text-align: center; */
    position: absolute;
    right: 120rpx;
    /* position: absolute; */
    top: 127rpx;
    /* display: inline-block; */

   
  }
  .function-list{
    width: 740rpx;
    height: 112rpx;
    line-height: 112rpx;
    /* background: blanchedalmond; */
    position: relative;
  }
  .list-icon{
    display: inline-block;
    width: 50.34rpx;
    height: 51.06rpx;
    margin: 36.54rpx 17.34rpx 36.54rpx 97.34rpx;   
  }
  .list-title{
    line-height: 44rpx;
    font-size: 32rpx;
    font-family: Ping Fang SC;
    color: #000000;
    margin-right: 322.06rpx;
    position: absolute;
    top: 40rpx;
  }
  .enter{
    position: absolute;
    width: 6px;
    height: 6px;
    border-top: 1px solid #000000;
    border-right: 1px solid #000000;
    transform: rotate(45deg);
    top: 55rpx;
    right: 120rpx;
  }
  .reward-points{
    line-height: 44rpx;
    font-size: 36rpx;
    color: #2570D9;
    margin-left: 350rpx;
    font-weight: 550;
    position: absolute;
    top: 40rpx;

  }



</style>