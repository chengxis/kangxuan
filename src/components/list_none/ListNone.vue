<template>
  <div class="none-course">
    <img :src="cpng">
    <div class="none-describe">{{cdescribe}}</div>
    <div class="evaluate-button" @click="gotoUrl(curl)">{{cbtnDescrib}}</div>
  </div>
  
</template>
<script>
export default {
  props:{
    cdescribe:String,//文字描述
    cpng:String,//图片路径
    curl:String,//要跳转的路由
    cbtnDescrib:String//button上的描述
  },
  methods:{
    gotoUrl(curl){
      console.log(curl)
      wx.navigateTo({
        url: curl,
      })
    }

  }
  
}
</script>
<style scoped>
.none-course{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .none-course img{
    width: 566rpx;
    height: 398rpx;
    margin-left: 92rpx;
    margin-top: 32rpx;
  }
  .none-describe{
    margin-top: 64rpx;
    line-height: 44rpx;
    font-size: 32rpx;
    font-family: Ping Fang SC;
    color: #333333;
  }
  .evaluate-button{
    width: 686rpx;
    height: 88rpx;
    line-height: 88rpx;
    background: #2570D9;
    border-radius: 4rpx;
    text-align: center;
    color: #FFFFFF;
    font-weight: 500;
    font-size: 32rpx;
    margin-top: 44rpx;

  }

</style>