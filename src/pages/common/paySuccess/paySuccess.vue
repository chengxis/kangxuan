<template>
  <div id="container">
    <img class="success-img"
    src="https://cdn.sc-edu.com/img/2020/08/19/14/b9fe2fd03a183345d0ddddce41de6740.png" alt="">
    <div success-describ>支付成功</div>
    <button class="backIndex" @click="backToIndex">返回学习进度</button>
    <PointSuccessBullet 
    :cscreenShow="screenShow" 
    :cattrBoxShow="attrBoxShow"
    :cscore="score"
    @closePointSuccess="closePointSuccess"></PointSuccessBullet>
  </div>
  
</template>
<script>
import PointSuccessBullet from '../../../components/point_success_bullet/PointSuccessBullet'
export default {
  data(){
    return{
      screenShow:true,
      attrBoxShow:true,
      score:'',
    }

  },
  components:{
    PointSuccessBullet
  },
  methods:{
    backToIndex(){
      // console.log("返回学习进度")
      wx.navigateTo({
        url: '/pages/mine/children/mine/studyProgress/main'
      })
    },
    closePointSuccess(){
      this.screenShow = false
      this.attrBoxShow = false
    }
     
  },
  mounted(){
    this.score = JSON.parse(this.$mp.query.score)
    console.log("获取到的积分",this.score)
    this.screenShow = true
    this.attrBoxShow = true
  }
  
}
</script>
<style scoped>
#container{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.success-img{
  width: 212rpx;
  height: 272rpx;
  margin-top: 60rpx;
}
.success-describ{
  font-family: Ping Fang SC;
  font-weight: 500;
  font-size: 32rpx;
  line-height: 44rpx;
  text-align: center;
  margin-bottom: 48rpx;
}
.backIndex{
  width: 686rpx;
  line-height: 88rpx;
  font-weight: 600;
  text-align: center;
  background: #2570D9;
  color: #FFFFFF;
  font-family: Ping Fang SC;
  font-size: 32rpx;
  position: fixed;
  bottom: 10rpx;
}

</style>