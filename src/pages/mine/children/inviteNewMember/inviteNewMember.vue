<template>
    <div id="container">
      <img src="https://cdn.sc-edu.com/img/2020/08/09/13/abbbe2a475384e153f5ad63c2635d420.png" alt="">
      <div class="invite-describtion">欢迎加入{{kindergartenName}}</div>
      <div class="invite-describtion-more">和幼儿园的老师一起学习</div>
      <button class="login" 
      open-type="getUserInfo" 
      @getuserinfo="handleGetUserInfo"
      v-show="!isAuthentication&&!isLogin">立即授权</button>
      <button class="login" 
      open-type="getPhoneNumber"
      @getphonenumber="handlegetPhoneNumber"
      v-show="isAuthentication&&!isLogin">立即登录</button>
      <input class="teacher-name" placeholder="请在此处填写您的姓名" v-model="teacherName" v-if="isLogin&&isAuthentication">
      <button class="join" 
      v-show="isAuthentication&&isLogin"
      :disabled="teacherName==''?true:false"
      @click="tipToJoinKindergarten"
      >立即加入</button>
    </div>
</template>
<script>
import request from '../../../../utils/request'
import {login,getUserInfo,getPhoneNumber,isAuthentication} from '../../../../lib/utils/certification'
export default {
  data(){
    return{
      isLogin:false,
      isAuthentication:false,
      brandId:'',
      kindergartenName:'',
      kindergartenPic:'',
      teacherName:'',//获取用户输入的姓名
      inviteApiToken:'',//邀请人的api_token值
    }
  },
  methods:{
    async handleGetUserInfo(e){
      var isHasUserInfo = await getUserInfo(e)
      // console.log(isHasUserInfo)
      if(isHasUserInfo===true)
        this.isAuthentication = true
    },
    async handlegetPhoneNumber(res){
      res.api_token = this.inviteApiToken
      let isGetPhoneNumber = await(getPhoneNumber(res))
      if(isGetPhoneNumber) this.isLogin = true  
    },
    async joinKindergarte(){
      let body_data = {
        api_token:this.$global.token,
        name:this.teacherName,
        brand_id:this.brandId
        // brand_id:32
      } 
      let result = await request('/teacher/apply/',body_data,'POST')
      // console.log(result)
      if(result.state === 1){
        wx.showToast({
          title:"申请加入幼儿园成功",
          icon:'success',
          duration:2000
        })
        setTimeout(()=>{
          wx.switchTab({
          url: '/pages/index/main'
        })
        },2000)
      }else if(result.state === 0){
        wx.showToast({
          title:result.message,
          icon:"none",
          duration:2000
        })
        setTimeout(()=>{
          wx.switchTab({
          url: '/pages/index/main'
        })
        },1000)
      }else{
        console.log("inviteNewMember发送请求失败")
      }

    },
    tipToJoinKindergarten(){
      var that = this
      wx.showModal({
        title: '提示',
        content: `是否加入${this.kindergartenName}`,
        success (res) {
          if (res.confirm) {
            that.joinKindergarte()          
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    async init(){
      //用于判断该用户是否是该机构的成员
      let body_data = {
        api_token:this.$global.token,
        name:this.teacherName,
        brand_id:this.brandId
      }
      let result = await request('teacher/apply_init/',body_data,'POST')

    }


  },
  mounted(){
    var that = this
    this.brandId = JSON.parse(this.$mp.query.brand_id)
    this.kindergartenName = JSON.parse(this.$mp.query.kindergartenName)
    this.kindergartenPic = JSON.parse(this.$mp.query.kindergartenPic)
    this.inviteApiToken = JSON.parse(this.$mp.query.inviteApiToken)
    wx.getUserInfo({
      success: function(res){
        that.isAuthentication = true
      }
    }) 
  },
  async onShow(){
    let isAuth = await isAuthentication(await login())
    if(isAuth){
      this.isAuthentication = true
      this.isLogin = true
    }else{
      this.isAuthentication = false
      this.isLogin = false
    }
  }
  
}
</script>
<style scoped>
#container{
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  
}
img{
  margin-top: 30rpx;
  margin-bottom: 60rpx;
}
.invite-describtion{
  color: #000000;
  font-size: 32rpx;
  font-family: Ping Fang SC;
  font-weight: 600;
  margin-bottom: 16rpx;
}
.invite-describtion-more{
  color: #828282;
  font-size: 24rpx;
  font-family: Ping Fang SC;
  margin-bottom: 34rpx;
}
.login{
  width: 300rpx;
  height: 60rpx;
  line-height: 60rpx;
  background: #2570D9;
  color: #FFFFFF;
  text-align: center;
  border-radius: 30rpx;
  font-size: 30rpx;
}
.teacher-name{
  width: 622rpx;
  height: 88rpx;
  padding-left: 32rpx;
  font-size: 32rpx;
  line-height: 44rpx;
  margin-bottom: 300rpx;
  border: 2rpx solid #2570D9;
  border-radius: 4rpx;
  background: #FAFAFA;

}
.join{
  width: 686rpx;
  height: 88rpx;
  background: #2570D9;
  border-radius: 4rpx;
  font-size: 32rpx;
  line-height: 88rpx;
  text-align: center;
  font-weight: 600;
  font-family: Ping Fang SC;
  color: #FFFFFF;  
}

</style>