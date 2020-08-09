<template>
  <div id="container">
    <div class="problem-top">
      <div class="common-problem">常见问题</div>
      <div class="contact">联系客服</div>
    </div>
    <ul class="problem-list">
      <li class="problem-item" v-for="item in [1,2,3,4]" :key="item">
        <div class="question">1、园长能一次购买多少课程</div>
        <div class="answer">xxxxxxx</div>
      </li>
    </ul>
  </div>
  
</template>
<script>
export default {
  
}
</script>
<style scoped>
#container{
  width: 100%;
  position: relative;
}
.problem-top{
  height: 50rpx;
  margin-top: 46rpx;
  margin-left: 32rpx;
  position: relative;
  margin-bottom: 60rpx;
}
.common-problem{
  width: 128rpx;
  height: 44rpx;
  font-size: 32rpx;
  line-height: 44rpx;
  color: #000000;
  display: inline-block;
}
.contact{
  display: inline-block;
  position: absolute;
  right: 32rpx;
  width: 132rpx;
  height: 52rpx;
  border-radius: 4rpx;
  background: #2570D9;
  font-family: Ping Fang SC;
  font-size: 24rpx;
  line-height:52rpx;
  color: #FFFFFF;
  text-align: center;
  top: -10rpx;

}
.problem-list{
  width: 100%;
  position: relative;
}
.problem-item{
  margin-left: -10rpx;
  margin-bottom: 124rpx;
}
.question{
  font-size: 28rpx;
  color: #000000;
  line-height: 40rpx;
  font-weight: 530rpx;
  font-family: Ping Fang SC;
}
.answer{
  margin-top: 4rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  color: #828282;
  font-family: Ping Fang SC;


}

</style>