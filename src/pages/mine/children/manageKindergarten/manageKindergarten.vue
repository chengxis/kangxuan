<template>
  <div id="container">
    <div class="top-show">
      <span class="current-people">现有教师人数:</span>
      <span class="people-count">{{teaNumber}}</span>
      <button class="invite-member" open-type="share">邀请新成员</button>
    </div>
    <div class="split-line"></div>
    <div class="apply-join">
      <ul class="apply-join-list" :style="isOnlyTeaList?'margin-top:-68rpx':''">
        <li class="apply-join-item" v-for="item in applyList" :key="item.user_id">
          <img class="apply-join-pic" :src="item.avatar">
          <span class="apply-join-member-name">{{item.name}}</span>
          <span class="apply-join-agree" @click="agreeJoin(item.user_id)">同意</span>
          <span class="apply-join-ignore" @click="rejectJoin(item.user_id)">忽略</span>
        </li>
      </ul>
    </div>
    <div class="current-member">
      <ul class="current-member-list">
        <li class="current-member-item" v-for="item in teaList" :key="item.user_id">
          <img class="apply-join-pic" :src="item.avatar">
          <span class="apply-join-member-name">{{item.name}}</span>
          <!-- <span class="apply-join-agree" style="border:2rpx solid #2570D9;color:#2570D9;background:#FFFFFF">查看</span> -->
          <span class="apply-join-ignore" @click="deleteTeacher(item.user_id)">删除</span>
        </li>
      </ul>
    </div>
  </div>
  
</template>
<script>
import request from '../../../../utils/request'
export default {
  data(){
    return{
      kindergartenName:'',
      teaNumber:'',//当前已加入的教师人数
      teaList:[],//已加入教师的详细信息，包括头像和姓名
      applyList:[],//申请加入教师的详细信息，包括头像和姓名
      isOnlyTeaList:false

    }
  

  },
  methods:{
    async getTeacherList(){
      let body_data = {
        api_token:this.$global.token,
        brand_id:this.$global.kingarten_info.brand_id
      }
      let teacherList = await request('/brand/staff/',body_data,'POST',{'content-type':'	application/x-www-form-urlencoded'})
      console.log("teacherList",teacherList)
      if(teacherList.state==0){
        wx.showToast({
          title: teacherList.message,
          icon: 'none'
        })
      }else if(teacherList.state==1){
        this.teaNumber = teacherList.data.tea_num
        this.teaList = teacherList.data.tea_info
        this.applyList = teacherList.data.apply
        console.log(this.applyList)
        
        if(this.applyList === null) {
          this.isOnlyTeaList = true
        }else{
          this.isOnlyTeaList = false
        }
        console.log(this.isOnlyTeaList)
        
      }else{
        console.log("获取信息失败！")
      }

    },
    async agreeJoin(teacher_id){
      let body_data = {
        api_token:this.$global.token,
        brand_id:this.$global.kingarten_info.brand_id,
        teacher_id:teacher_id  
      }
      let result = await request('/teacher/agree/',body_data,'POST')
      console.log(result)
      if(result.state === 1){
        wx.showToast({
          title:result.message,
          icon:'success',
          duration:2000
        })
        this.getTeacherList()
      }else if(result.state === 0){
        wx.showToast({
          title:result.message,
          icon:'none',
          duration:2000
        })
      }else{
        console.log("manageKindergarten同意加入失败")
      }

    },
    async rejectJoin(teacher_id){
       let body_data = {
        api_token:this.$global.token,
        brand_id:this.$global.kingarten_info.brand_id,
        teacher_id:teacher_id  
      }
      let result = await request('/teacher/reject/',body_data,'POST')
      console.log(result)
      if(result.state === 1){
        wx.showToast({
          title:"拒绝成功",
          icon:'success',
          duration:2000
        })
        this.getTeacherList()
      }else if(result.state === 0){
        wx.showToast({
          title:result.message,
          icon:'none',
          duration:2000
        })
      }else{
        console.log("manageKindergarten拒绝加入失败")
      }

    },
    deleteTeacher(teacher_id){
      var that = this
      wx.showModal({
        title: '提示',
        content: '是否确定删除此教师',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.doDelete(teacher_id)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    async doDelete(teacher_id){
      let body_data = {
        api_token:this.$global.token,
        brand_id:this.$global.kingarten_info.brand_id,
        teacher_id:teacher_id  
      }
      let result = await request('/teacher/del/',body_data,'POST')
      console.log(result)
      if(result.state === 1){
        wx.showToast({
          title:"删除成功",
          icon:'success',
          duration:2000
        })
        this.getTeacherList()
      }else if(result.state === 0){
        wx.showToast({
          title:result.message,
          icon:'none',
          duration:2000
        })
      }else{
        console.log("manageKindergarten删除成员失败")
      }

    }

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
        // if (shareTickets.length == 0) {
        //   return false;
        // }
        // //可以获取群组信息
        // wx.getShareInfo({
        //   shareTicket: shareTickets[0],
        //   success: function (res) {
        //     console.log(res)
        //   }
        // })
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  },
  mounted(){
    this.kindergartenName = JSON.parse(this.$mp.query.kindergartenName)
    wx.setNavigationBarTitle({
      title: this.kindergartenName,
    })
    // this.getKingartenPic()
  },
  onShow(){
    this.getTeacherList()
  }
  
}
</script>
<style scoped>
  #container{
    width: 100%;
    position: relative;
  }
  .top-show{
    margin-top: 20rpx;
    width: 100%;
    height: 90rpx;
    /* background: pink; */
    position: relative;
  }
  .current-people{
    width: 168rpx;
    height: 34rpx;
    font-family: Ping Fang SC;
    font-size: 24rpx;
    line-height: 34rpx;
    color: #828282;
    position: absolute;
    margin:24rpx 8rpx 32rpx 36rpx;
  }
  .people-count{
    width: 70rpx;
    height: 44rpx;
    color: #333333;
    font-family: Ping Fang SC;
    font-size: 32rpx;
    line-height: 44rpx;
    position: absolute;
    margin-top: 16rpx;
    left: 208rpx;
  }
  .invite-member{
    display: inline-block;
    width: 136rpx;
    height: 42rpx;
    text-align: center;
    line-height: 42rpx;
    background: #2570D9;
    border-radius: 4rpx;
    position: absolute;
    margin-top: 16rpx;
    right: 32rpx;
    color: #FFFFFF;
    font-size: 24rpx;
    font-family: Ping Fang SC;
    padding:0 6rpx

  }
  .split-line{
    width: 750rpx;
    height: 4rpx;
    background: #E0E0E0;
    margin-bottom: 32rpx;
  }
  .apply-join-list{
    width: 686rpx;
    position: relative;
    margin-left:32rpx;
    margin-bottom: 88rpx;
    /* background: pink; */
  }
  .apply-join-item{
    width: 686rpx;
    height: 88rpx;
    line-height: 88rpx;
    position: relative;
    margin-bottom: 16rpx;
  }
  .apply-join-pic{
    position: absolute;
    width: 72rpx;
    height: 72rpx;
    top: 8rpx;
  }
  .apply-join-member-name{
    position: absolute;
    left: 88rpx;
    line-height: 34rpx;
    width: 180rpx;
    color: #333333;
    font-size: 24rpx;
    top: 28rpx;
  }
  .apply-join-agree{
    display: inline-block;
    position: absolute;
    right: 120rpx;
    width: 80rpx;
    line-height: 38rpx;
    background: #1CDAAC;
    color: #FFFFFF;
    font-size: 24rpx;
    text-align: center;
    top: 26rpx;
    line-height: 42rpx;
  }
  .apply-join-ignore{
    display: inline-block;
    width: 76rpx;
    height: 38rpx;
    text-align: center;
    line-height: 38rpx;
    border: 2rpx solid #828282;
    position: absolute;
    right: 6rpx;
    color: #828282;
    font-size: 24rpx;
    top: 26rpx;
  }
  .current-member{
    width: 100%;
    position: relative;
  }
  .current-member-list{
    width: 686rpx;
    position: relative;
    margin-left:32rpx;
    margin-bottom: 40rpx;
  }
  .current-member-item{
    width: 686rpx;
    height: 88rpx;
    line-height: 88rpx;
    position: relative;
    margin-bottom: 16rpx;

  }






</style>