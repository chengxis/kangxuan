<template>
    <div id="container">
      <img src="https://cdn.sc-edu.com/img/2020/08/09/13/abbbe2a475384e153f5ad63c2635d420.png" alt="">
      <div class="invite-describtion">欢迎加入我的幼儿园{{brandId}}</div>
      <div class="invite-describtion-more">和幼儿园的老师一起学习</div>
      <button class="login" 
      open-type="getUserInfo" 
      @getuserinfo="getUserInfo"
      v-if="!isAuthentication&&!isLogin">立即授权</button>
      <button class="login" 
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
      v-if="isAuthentication&&!isLogin">立即登录</button>
      <div class="join" v-if="isAuthentication&&isLogin" @click="joinKindergarten">加入{{kindergartenName}}</div>
    </div>
</template>
<script>
import request from '../../../../utils/request'
export default {
  data(){
    return{
      isLogin:false,
      isAuthentication:false,
      brandId:'',
      kindergartenName:'',
      kindergartenPic:''
    }
  },
  methods:{
    login(){
      let that = this
      wx.login({
        success: function(res){
          if(res.code){
            that.$global.setCode(res.code)
            wx.request({
              url: 'https://wx.sc-edu.com/knsh/login/',
              data: {
                code:that.$global.code
              },
              method: 'POST', 
              header: {'content-type': 'application/x-www-form-urlencoded'},       
              success: function(res){
                console.log(res.data)
                that.$global.setToken(res.data.data.api_token)
                that.$global.setUserNickName(res.data.data.nick_name)
                that.$global.setUserAvatar(res.data.data.avatar)    
              },
              fail: function() {
                console.log("获取数据失败")
              }
            })
          }    
        }
      })
    },
    async getUserInfo(e){
      var that = this
      this.isAuthentication = true     
      this.$global.setUserAvatar(e.mp.detail.userInfo.avatarUrl)
      this.$global.setUserNickName(e.mp.detail.userInfo.nickName)
      let body_data = {
        api_token:this.$global.token,
        avatar:this.$global.user_info.avatar,
        nick_name:this.$global.user_info.nickName
      }
      let result = await request('/oauth/',body_data,'POST',{'content-type':'	application/x-www-form-urlencoded'})
      // let result = await request('/oauth/',body_data,'POST',{'content-type':'application/x-www-form-urlencoded'})
      console.log("登录将头像，昵称传到服务器",result)
      
      

    },
    async getPhoneNumber(res){
      var that = this
      console.log(res)
      if(res.mp.detail.errMsg == 'getPhoneNumber:fail user deny'){
        console.log('手机号拒绝授权')
        wx.setStorage({
        key: 'isBind',
        data: false,
      })
      }else{
        let result = await request('/phone/',
        {
          api_token:that.$global.token,
          encryptedData:res.mp.detail.encryptedData,
          iv:res.mp.detail.iv
        },'POST',{'content-type': 'application/x-www-form-urlencoded'}) 
        if(result.state == 1){
          that.isLogin = true
          console.log("授权成功")
          that.$global.setIsBind(1)
          that.$global.setUserPhone(result.data.mobile)
          wx.setStorage({
            key: 'isBind',
            data: true,
          })
          this.joinKindergarten()
      

        }else{
          wx.showToast({
            title:'短信验证失败',
            icon:'none'
          })
        }
      }
     
    },
    joinKindergarten(){
      console.log("点击")
      wx.showModal({
        title: '提示',
        content: `是否加入${this.kindergartenName}`,
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            let body_data = {
              //递交申请
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
  mounted(){
    var that = this
    this.brandId = JSON.parse(this.$mp.query.brand_id)
    this.kindergartenName = JSON.parse(this.$mp.query.kindergartenName)
    this.kindergartenPic = JSON.parse(this.$mp.query.kindergartenPic)
    // this.brandId = '14'
    // this.kindergartenName = '康轩'
    wx.getUserInfo({
      success: function(res){
      that.isAuthentication = true
      }
    }) 
  },
  onShow(){
    var that = this
    this.login()
    //进入页面判断是否授权
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
                  if(res.data==true){
                    that.isLogin = true
                    // this.$global.kingarten_info.brand_id = this.brandId
                  }
                },
               
              })
            }
      },
    }); 
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
  margin-bottom: 20rpx;
}
.invite-describtion{
  color: #2570D9;
  font-size: 30rpx;
  font-family: Ping Fang SC;
  font-weight: 550;
  margin-bottom: 30rpx;
}
.invite-describtion-more{
  color: #828282;
  font-size: 25rpx;
  font-family: Ping Fang SC;
  margin-bottom: 100rpx;
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
.join{
  font-size: 30rpx;
  color: #2570D9;
  text-decoration: underline;
}

</style>