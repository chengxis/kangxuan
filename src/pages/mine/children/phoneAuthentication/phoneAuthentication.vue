<template>
  <div id="container">
    <img class="user-box" :src="avatarUrl"/>
    <div class="hello-user">您好，{{nickName}}</div>
    <div class="text">为了您的账户，请绑定手机号</div>
    <button class="phone-authentication"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber">微信手机号一键绑定</button>
  </div>

  
</template>
<script>
import request from '../../../../utils/request'
export default {
  data(){
    return{
      avatarUrl:'',
      nickName:''
    }
  },
  mounted(){
    this.avatarUrl = this.$global.user_info.avatar
    this.nickName = this.$global.user_info.nickName
    console.log("手机认证中的token值",this.$global.token)
  },
  methods:{
    async getPhoneNumber(res){
      var that = this
      if(res.mp.detail.errMsg == 'getPhoneNumber:fail user deny'){
        console.log('手机号拒绝授权')
        wx.setStorage({
        key: 'isBind',
        data: false,
      })
      }else{
        // console.log(res.mp)
        let result = await request('/phone/',
        {
          api_token:that.$global.token,
          encryptedData:res.mp.detail.encryptedData,
          iv:res.mp.detail.iv
        },'POST',{'content-type': 'application/x-www-form-urlencoded'}) 
        console.log(result)
        if(result.state == 1){
          console.log("授权成功")
          that.$global.setIsBind(1)
          that.$global.setUserPhone(result.data.mobile)
          wx.setStorage({
            key: 'isBind',
            data: true,
          })
          wx.switchTab({
            url: '/pages/index/main',
          })      

        }else{
          wx.showToast({
            title:'短信验证失败',
            icon:'none'
          })
        }
        
       

      }
    }
    
  }
  
}
</script>
<style scoped>
  #container{
    position: relative;
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .user-box{
    width: 150rpx;
    height: 150rpx;
    border-radius: 50%;
    /* background-color: pink; */
    /* position: absolute;
    top: 170rpx;
    left: 300rpx; */
    margin-top: 170rpx;
    margin-bottom: 20rpx;
  }
  .hello-user{
    font-size: 30rpx;
    line-height: 50rpx;
    margin-bottom: 30rpx;
  }
  .text{
    font-size: 25rpx;
    color: #828282; 
    margin-bottom: 250rpx;
  }
  .phone-authentication{
    font-size: 35rpx;
    width: 90%;
  }

</style>