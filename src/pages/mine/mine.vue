<template>
  <div id="container">
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
        <span class="user-name" v-if="isAuthentication&&isLogin&&isHasBrand">{{userInfo.name}}</span>
        <div class="user-name" v-if="isAuthentication&&isLogin&&!isHasBrand">{{userInfo.nickName}}</div>
        <img class="update-name" 
        src="https://cdn.sc-edu.com/img/2020/08/07/16/9ec19d49363a28d4fbb2d93aa0a959e2.png"
        v-if="isAuthentication&&isLogin&&isHasBrand"
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
        @getuserinfo="getUserInfo">点击授权</button> 
        <button class="user-switch-identity" 
        v-if="isAuthentication&&!isLogin"
        @click="handlePhoneAuthentication">点击登录</button>  
        <button class="user-switch-identity" 
        @tap="switchIdentity" 
        v-if="isAuthentication&&isLogin">身份切换</button>  
      </div>   
    </div>
    <div id="user-function">
      <div class="function-list" @click="seeMyEvaluation" v-show="isTeacher">
        <img class="list-icon" src="https://cdn.sc-edu.com/img/2020/08/06/10/ecffbbe569eb9fa6980fda20ef297064.png"/>
        <span class="list-title">我的评测</span>
        <span class="enter">
        </span>
      </div>
      <div class="function-list" @click="handleManageKindergarten(userInfo.title)" v-if="!isTeacher">
        <img class="list-icon" src="https://cdn.sc-edu.com/img/2020/07/31/09/55e1522cd0e29c0a36194f2279660105.png"/>
        <span class="list-title">幼儿园管理</span>
        <span class="enter">
        </span>
      </div>
      <div class="function-list" @click="seeStudyProgress" v-if="!isTeacher">
        <img class="list-icon" src="https://cdn.sc-edu.com/img/2020/07/31/09/14fe233864e069f74c9110b52cd88548.png"/>
        <span class="list-title">学习进度</span>
        <span class="enter">
        </span>
      </div>
      <div class="function-list" @click="seeCourseRecommand" v-if="!isTeacher">
        <img class="list-icon" src="https://cdn.sc-edu.com/img/2020/07/31/09/4a2d8b4c719de7c61126ee81e4b25162.png"/>
        <span class="list-title">课程推荐</span>
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
import request from '../../utils/request'
import InputBox from '../../components/input_box/InputBox'
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
    }
  },
  components:{
    InputBox

  },
  mounted(){
    let that = this
    //页面加载前判断用户是否绑定了机构号，如果绑定了则显示注册机构时用户填写的信息
    if(that.$global.kingarten_info.brand_id==null){
       wx.getUserInfo({
        success: function(res){
        that.userInfo = res.userInfo
        that.isAuthentication = true
        that.userInfo.title = "您还没有自己的幼儿园"
        that.userInfo.type = "教师"
        // console.log("测试这个数据",that.userInfo)
      }
    }) 
    }else{
      
      this.getKindergartenInformation()

    }
    
        
     
  },
  methods:{
    updateUserName(){
      console.log("修改名称")
      this.changeModel = true
      this.isModel = true

    },
    //子组件传来取消时间，父组件对相关数据改变
    cancleTap(){
      this.changeModel = false
      this.isModel = false

    },
    confirmTap(name){
      this.changeModel = false
      this.isModel = false
      console.log("父组件接受的name",name)
      this.updateName = name
    },
    getUserInfo(e){
      var that = this
      if(e.mp.detail.userInfo){
        this.userInfo = e.mp.detail.userInfo
        // console.log(this.userInfo)
        if(that.$global.kingarten_info.brand_id==null){
           this.userInfo.title = "您还没有自己的幼儿园"
           this.userInfo.type = "教师"
        }else{
          this.getKindergartenInformation()
        }      
        // console.log("测试",e.mp.detail.userInfo)
        this.isAuthentication = true     
        this.$global.setUserAvatar(this.userInfo.avatarUrl)
        this.$global.setUserNickName(this.userInfo.nickName)
        console.log("global中的userinfo",this.$global.user_info)
        wx.getStorage({
          key: 'api_token',
          success: function(res){
            wx.request({
              url: 'https://wx.sc-edu.com/knsh/oauth/',
              data: {
                api_token:res.data,
                avatar:that.userInfo.avatarUrl,
                nick_name:that.userInfo.nickName
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {'content-type': 'application/x-www-form-urlencoded'}, // 设置请求的 header
              success: function(res){
                console.log(res)
              },
              fail: function() {
                console.log("上传失败")
              },
            })
          }
        })
        wx.navigateTo({
        url: '/pages/mine/children/phoneAuthentication/main',   
      })
      }
      

    },
    
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
    handleProblemFeedback(){
      console.log("查看问题反馈")
      wx.navigateTo({
        url:'/pages/mine/children/problemFeedback/main'
      })
    },
    aboutUs(){
      console.log("关于我们")
      wx.navigateTo({
        url:'/pages/mine/children/aboutUs/main'
    })
    },
    //根据当前存放的brand_id获取相关幼儿园信息
    async getKindergartenInformation(){
      let that = this
      let current_data = {
        api_token:this.$global.token,
        brand_id:this.$global.kingarten_info.brand_id
      }
      let infromation = await request('/person/info/',current_data,'POST',{'content-type':'	application/x-www-form-urlencoded'})
      console.log("mine里面根据brand_id返回的信息",infromation)
      that.$global.setTitle(infromation.data.title)
      if(infromation.state==1){
        that.userInfo = infromation.data
        // console.log(that.userInfo)
        if(infromation.data.type=='1'){
          that.userInfo.type = '园长'
          that.isTeacher = false
        }else{
          that.userInfo.type = '教师'
          that.isTeacher = true
        }
        console.log("输出",that.userInfo)

      }
      


    }
  },
  onShow(){
    var that = this
    console.log("mine里面获取到的brand_id值",this.$global.kingarten_info.brand_id)
    if(this.$global.kingarten_info.brand_id!=null){
      this.isHasBrand = true
    }

    console.log("mine里面的is_bind",this.$global.is_bind)
    wx.getSetting({
      success: (res)=>{
        console.log(res)
          if(!res.authSetting['scope.userInfo']){
              that.isAuthentication = false;
              wx.setStorage({
                key: 'isBind',
                data: false,
              })
          }else{
              that.isAuthentication = true;
              wx.getStorage({
                key: 'isBind',
                success: function(res){
                  // success
                  if(res.data==true&&that.$global.is_bind == 1){
                    that.isLogin = true

                  }
                },
               
              })
            }
      },
    }); 
    //根据本地存储的isSwitch判断是否需要重新获取当前机构信息
    wx.getStorage({
      key: 'isSwitch',
      success: function(res){
        if(res.data == true){
          that.getKindergartenInformation()
          wx.setStorage({
            key: 'isSwitch',
            data: false,
          })
        }
      },
      fail: function() {
        console.log("当前未进行机构切换操作")
      }
    })
   
    

  
    

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
    width: 288rpx;
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



</style>