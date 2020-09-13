<template>
  <!-- 当用户点击如何获取积分出现弹框-->
  <div id="container">
    <!-- 蒙态框-->
    <div class="modalMask" v-if="cIsModel"></div>
    <div class="modalDialog" v-if="cChangeModel">
      <div class="get-point-title">如何获取积分</div>
      <div class="get-point-item">
        <div class="tr" v-for="(taskItem,index) in taskList" :key="index">
          <div class="td-text">{{taskItem.remark}}</div>
          <div class="td-point">{{taskItem.point}}</div>
          <div class="td-buy" @click="goToOther(taskItem,index)" >
            <button class="buy-text" 
            plain="true"
            :open-type="index === 4?'share':''">{{taskItem.describ}}</button>
            <span class="buy-enter"></span>
          </div>
        </div>
      </div>
      <img class="bottom-pic" src="https://cdn.sc-edu.com/img/2020/09/08/17/5a3e0b90c5b8825ca4d998e109e8bd93.png">
      <div class="close" @click="closePoint"></div>
      <img class="close-picture" 
      src="https://cdn.sc-edu.com/img/2020/09/08/17/cc9fb1acf2c8042fcb21de93b5f286ce.png"
      @click="closePoint">
    </div>
  </div>
</template>
<script>
import request from '../../lib/utils/request'
export default {
  data(){
    return{
      taskList:[],
    }
  },
  props:{
    cChangeModel:Boolean,
    cIsModel:Boolean
  },
  methods:{
    closePoint(){
      this.$emit('doClose')
    },
    goToOther(taskItem,taskIndex){
      console.log("点击其他页面",taskItem,taskIndex)
      this.$emit('doClose')
      if(taskIndex === 0){
        wx.switchTab({
          url: '/pages/mine/main',
        })
      }else if(taskIndex === 1 || taskIndex === 2){
        wx.navigateTo({
          url: '/pages/index/children/showAllCourse/main',
        })
      }else if(taskIndex === 3){
        wx.navigateTo({
          url: '/pages/index/children/creatKindergarten/main',
        })
      }else if(taskIndex === 5){
        wx.navigateTo({
          url: '/pages/course/children/courseDetail/main',
        })
      }
    },
    async getPointTask(){
      //获取哪些任务可以获得积分的列表
      let bodyData = {
        //api_token:this.$global.token
        api_token:"c863wAEll9KIvUKc3saSy8iSe2QhwVRp3Xn0/19ohQ",   
      }
      let result = await request('/point_mission/',bodyData,'POST')
      console.log("hhaha",result)
      if(result.state === 1){
        this.taskList = result.data
        let index = 0
        for(let i of this.taskList){
          if((index === 0 || index === 1 || index===3)&& i.status === 1){
            i.isShow = false
          }else {
            i.isShow = true
          }
          if(index === 0) i.describ = "去注册"
          else if(index === 1) i.describ = "去购买"
          else if(index === 2) i.describ = "去购买"
          else if(index === 3) i.describ = "去创建"
          else if(index === 4) i.describ = "去邀请"
          else i.describ = "去评测"
          index += 1
        }
      }
    }

  },
  mounted(){
    console.log("弹框加载")
    this.getPointTask()
  },
  onShareAppMessage: function(ops) {
    if (ops.from === "button") {
      // 来自页面内转发按钮
      console.log(ops.target);
    }
    return {
      title: `快来加入${this.$global.kingarten_info.title}`,//这里是定义转发的标题
      path: '/pages/mine/children/inviteNewMember/main?brand_id='
      +JSON.stringify(this.$global.kingarten_info.brand_id)
      +'&&kindergartenName='+JSON.stringify(this.$global.kingarten_info.title)
      +'&&kindergartenPic='+JSON.stringify(this.$global.kingarten_info.pic)
      +'&&inviteApiToken='+JSON.stringify(this.$global.api_token),//这里是定义转发的地址
      imageUrl:'https://cdn.sc-edu.com/img/2020/08/09/13/abbbe2a475384e153f5ad63c2635d420.png',
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  },
  
}
</script>
<style scoped>
#container{
  position: relative;
}
.modalMask{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.5;
  overflow: hidden;
  z-index: 3;
  color:#fff;
}
.modalDialog{
  position: fixed;
  width: 638rpx;
  height: 812rpx;
  border-radius: 12rpx;
  /* background: pink; */
  margin-left: 56rpx;
  top: 146rpx; 
  z-index: 5;
  background: #fff;
}
.get-point-title{
  margin: 32rpx 0 32rpx 32rpx;
  font-size: 36rpx;
  font-family: Ping Fang SC;
  color: #333333;
  font-weight: 550;
}
.get-point-item{
  position: relative;
  /* justify-content: center */
}
.tr{
  margin-top: 10rpx;
  line-height: 44rpx;
  margin-bottom: 28rpx;
}

.td-text{
  display: inline-block;
  font-family: Ping Fang SC;
  color: #333333;
  font-size: 32rpx;
  margin-left: 32rpx;
  font-weight: 530;
}
.td-point{
  position: absolute;
  display: inline-block;
  left: 344rpx;
  font-family: Ping Fang SC;
  font-size: 32rpx;
  color: #333333;
  font-weight: 530;
}
.td-buy{
  position: absolute;
  display: inline-block;
  height: 36rpx;
  right: 44rpx;
}
.buy-text{
  display: inline-block;
  color: #2570D9;
  font-family: Ping Pang SC;
  font-size: 32rpx;
  font-weight: 530;
  border: none;
  line-height: 36rpx;
}
.buy-enter{
  position: absolute;
  width: 12rpx;
  height: 12rpx;
  border-top: 1px solid #2570D9;
  border-right: 1px solid #2570D9;
  transform: rotate(45deg);
  right: 10rpx;
  margin-top: 12rpx;
}
.close{
  width:50rpx;
  height: 50rpx;
  /* background: crimson; */
  position: absolute;
  right: 30rpx;
  top: 30rpx;
  z-index: 4;
}
.close-picture{
  width: 24rpx;
  height: 24rpx;
  position: absolute;
  right: 40rpx;
  top: 40rpx;
  z-index: 99;
}
.bottom-pic{
  width: 606rpx;
  height: 282rpx;
  margin-left: 16rpx;
}



</style>