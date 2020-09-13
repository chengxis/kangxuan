<template>
  <div id="container">
    <img class="user-box" :src="avatarUrl"/>
    <div class="hello-user">您好，{{nickName}}</div>
    <div class="text">为了您的账户，请绑定手机号</div>
    <button class="phone-authentication"
      open-type="getPhoneNumber"
      @getphonenumber="handlePhoneNumber">微信手机号一键绑定
    </button>
    <PointSuccessBullet 
    :cscreenShow="screenShow" 
    :cattrBoxShow="attrBoxShow"
    :cscore="score"
    @closePointSuccess="closePointSuccess"></PointSuccessBullet>
  </div>
</template>
<script>
import {getPhoneNumber} from '../../../../lib/utils/certification'
import PointSuccessBullet from '../../../../components/point_success_bullet/PointSuccessBullet' 
export default {
  data(){
    return{
      avatarUrl:'',
      nickName:'',
      screenShow:false,
      attrBoxShow:false,
      score:'',
    }
  },
  components:{
    PointSuccessBullet
  },
  mounted(){
    this.avatarUrl = this.$global.user_info.avatar
    this.nickName = this.$global.user_info.nickName
  },
  methods:{
    async handlePhoneNumber(res){
      //当手机认证成功后，跳转到首页
      let {isGetPhoneNumber,point} = await(getPhoneNumber(res))
      // console.log("测试点",isGetPhoneNumber,point)
      if(isGetPhoneNumber){
        this.score =  point
        if(this.score > 0){
          this.screenShow = true
          this.attrBoxShow = true
        }
      }
         
    },
    closePointSuccess(){
      this.screenShow = false
      this.attrBoxShow = false
      wx.switchTab({
        url: '/pages/index/main',
      })
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