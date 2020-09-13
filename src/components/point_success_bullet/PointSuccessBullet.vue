<template>
<div id="container">
    <!-- 弹出框高亮 -->
    <div class="commodity_screen" v-if="cscreenShow"></div>
    <!-- 积分详情窗口 -->
    <div class="commodity_attr_box" v-if="cattrBoxShow">
      <div id="pop_up">
        <div id="check_point_details">
          <img class="point_image" src="https://cdn.sc-edu.com/img/2020/09/09/10/6a7c7d3d8ec25b5aee031b7624c772c1.png" alt="">
          <span class="congratulations">-恭喜获得-</span>
          <span class="points">积分</span>
          <span class="score">+{{cscore}}</span>
        </div>
        <div id="button_checkpoint">
          <img class="button_checkpoint" src="https://cdn.sc-edu.com/img/2020/09/09/11/39868d67d42942c560eb60d850904f21.png" alt="">
          <span class="checkpoint" @click="seePointDetail">查看积分详情</span>
        </div>
      </div>
    <!-- 关闭按钮 -->
      <div id="close" @click="closeClick">
        <img class="close_img" src="https://cdn.sc-edu.com/img/2020/09/09/15/ef6fffdd65361022f8c249b4962e57bb.png" alt="">
      </div>
    </div>
</div>
</template>
<script>
export default {
  data(){
    return{
    }
  },
  props:{
    cscreenShow:Boolean,
    cattrBoxShow:Boolean,
    cscore:Number

  },
  methods:{
    closeClick(){
      this.$emit("closePointSuccess")
    },
    seePointDetail(){
      wx.navigateTo({
        url: '/pages/mine/children/myRewardPoints/main',
      })
    }
  } 
}
</script>
<style scoped>
  .point_image{
    width: 496rpx;
    height: 546rpx;
    /* left: 64px; */
    top:0px;
    margin: 0 auto;
    position:absolute;  
  }
  .congratulations{
    width: 96px;
    height: 25px;
    left: 76px; 
    top:109px;
    /* text-align: center; */
    position:absolute;  
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #FF6E0A;
    letter-spacing: 0.21px;
    text-align: right;
  }
  .points{
    width: 65px;
    height: 45px;
    left: 58px;
    top:142px;
    /* margin: 0 auto; */
    position:absolute;
    font-family: PingFangSC-Semibold;
    font-size: 32px;
    color: #FF6E0A;
    letter-spacing: 0.37px;
    text-align: right;   
  }
  .score{
    width: 59px;
    height: 45px;
    left: 131px;
    top:142px;
    /* margin: 0 auto; */
    position:absolute;
    font-family: PingFangSC-Semibold;
    font-size: 32px;
    color: #FF6E0A;
    letter-spacing: 0.37px;
  }
  .button_checkpoint{
    width: 195px;
    height: 41px;
    left: 27px;  
    top:204px;
    /* margin: 0 auto; */
    position:absolute; 
  }
  .checkpoint{
    width: 100px;
    height: 22px;
    left: 75px; 
    top:212px;
    margin: 0 auto;
    position:absolute; 
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #AD5A03;
    letter-spacing: 0.18px;
    text-align: right;  
  }
  .close_img{
    width: 28px;
    height: 28px;
    top:285px;
    left:110px;
    /* margin: 0 auto; */
    position:absolute;
  }
  .commodity_screen{
    width: 100%;
    height:100%;
    position: fixed;
    top:0;
    left:0;
    background: #000;
    opacity:0.2;
    overflow: hidden;
    z-index: 1000;
    color: #fff;
  }
  .commodity_attr_box{
    color: #fff;
    height: 315px;
    width: 248px;
    overflow: hidden;
    position: fixed;
    top: 20%;
    left: 64px; 
    z-index: 2000;
    
   
    /* padding-top: 20rpx; */
  }

</style>