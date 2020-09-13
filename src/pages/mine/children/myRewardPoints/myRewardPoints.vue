<template>
  <div id="container">
    <div class="top">
      <img class="top-background"
      src="https://cdn.sc-edu.com/img/2020/09/08/14/efe6e587209c5e6b6cf10ae8c565a44c.png">
      <img class="user-avatar" :src="userInfo.avatarUrl">
      <div class="user-name">{{userInfo.name===''?userInfo.nickName:userInfo.name}}</div>
      <div class="get-points" @click="wayToGetPoints">如何获取积分?</div>
      <div class="current-points">当前积分</div>
      <div class="points-number">{{userInfo.point}}</div>
    </div>
    <GetPointBullet :cChangeModel="changeModel" :cIsModel="isModel"
    @doClose="doClose"/>
    <div class="function-select">
      <div class="function-select-left" 
      :style="isLeft?'font-weight:550':''"
      @click="clickPointDetail">积分明细</div>
      <div class="function-select-middle" ></div>
      <div class="function-select-right" 
      :style="isLeft?'':'font-weight:550'"
      @click="clickInvitePerson">已受邀人</div>
      <div class="function-select-underline" :style="isLeft?'left:220rpx':'left:383rpx'"></div>   
    </div>
    <div class="point-detail-list" v-show="isLeft">
      <div class="point-detail-item" v-for="pointItem in pointList" :key="pointItem.remark">
        <div class="point-title">{{pointItem.remark}}</div>
        <div class="point-date">{{pointItem.add_time}}</div>
        <div class="point-score">+{{pointItem.num}}</div>
        <div class="point-underline"></div>
      </div>
    </div>
    <div class="invite-people-list" v-show="!isLeft">
      <div class="has-invite" v-if="hasInvite">
        <div class="invite-describ">共{{inviteNum}}人，再邀请<span style="color:#5584DE">{{reInviteNum}}</span>人注册，即可获取积分</div>
        <button class="invite-button" plain="true" open-type="share">去邀请</button>
        <span class="enter"></span>
        <div class="invite-people-table">
          <div class="invite-tr" v-for="invitePeople in inviteList" :key="invitePeople.id">
            <img class="invite-avatar" :src="invitePeople.avatar">
            <div class="invite-name">{{invitePeople.title}}</div>
            <div class="invite-time">{{invitePeople.add_time[1]}}</div>
            <div class="invite-date">{{invitePeople.add_time[0]}}</div>
          </div>
        </div>
      </div>
      <div class="no-invite" v-if="!hasInvite">
        <img class="no-invite-pic"
        src="https://cdn.sc-edu.com/img/2020/09/09/14/6705aafa8e48f620445349beb565c126.png">
      </div>
      
    </div>
  </div>
</template>
<script>
import request from '../../../../lib/utils/request'
import GetPointBullet from '../../../../components/get_point_bullet/GetPointBullet'
export default {
  data(){
    return{
      userInfo:'',//存储用户的基本信息
      changeModel:false,
      isModel:false,
      isLeft:true,//判断用户是否点击了积分明细
      pointList:[],//存储积分明细的信息
      inviteList:[],//存储已受邀人的信息
      reInviteNum:'',//还需邀请的人数
      inviteNum:'',//已经邀请的人数
      hasInvite:'',//邀请列表的人数是否为0
    }
  },
  components:{
    GetPointBullet
  },
  methods:{
    wayToGetPoints(){
      console.log("点击如何获取积分")
      this.isModel = !this.isModel
      this.changeModel = !this.changeModel
    },
    async getBasicInformation(){
      //获取用户的基本信息，包括头像、积分、昵称等
      let bodyData = {
        // api_token:this.$global.token,
        // brand_id:this.$global.kingarten_info.brand_id
        api_token:"c863wAEll9KIvUKc3saSy8iSe2QhwVRp3Xn0/19ohQ",
        brand_id:65
      }
      let infromation = await request('/person/info/',bodyData,'POST')
      this.userInfo = infromation.data
      // console.log(infromation)
    },
    doClose(){
      this.changeModel = false
      this.isModel = false
    },
    clickPointDetail(){
      this.isLeft = true
      this.getPointDetail()
    },
    clickInvitePerson(){
      this.isLeft = false
    },
    async getPointDetail(){
      let bodyData = {
        //api_token:this.$global.token
        api_token:"c863wAEll9KIvUKc3saSy8iSe2QhwVRp3Xn0/19ohQ",   
      }
      let result = await request('/point_log/',bodyData,'POST')
      // console.log(result)
      if(result.state === 1){
        this.pointList = result.data.data.list
      }else{
        console.log("myRewardPoint中getPointDetail获取数据失败")
      }
    },
    async getInvitePerson(){
      let bodyData = {
        //api_token:this.$global.token
        api_token:"c863wAEll9KIvUKc3saSy8iSe2QhwVRp3Xn0/19ohQ",  
      }
      let result = await request('/person/invite/',bodyData,'POST')
      // console.log("获取邀请人",result)
      if(result.state === 1){
        this.inviteNum = result.data.total
        this.reInviteNum = 5 - result.data.total
        this.inviteList = result.data.list
        for(let i of this.inviteList){
          i.add_time = i.add_time.split(" ")
        }
        if(result.data.total <=0) this.hasInvite = false
        this.hasInvite = true
      }else{
        console.log("myRewardPoints中 getInvitePerson获取数据失败")
      }

    }
  },
    
  mounted(){
    // console.log("页面加载")
    this.getBasicInformation()
    this.getPointDetail()
    this.getInvitePerson()
    
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
    }
  },
  
}
</script>
<style scoped>
.top{
  width: 686rpx;
  height: 384rpx;
  margin: 16rpx 32rpx 48rpx 32rpx;
  position: relative;
}
.top-background{
  width: 686rpx;
  height: 384rpx;
}
.user-avatar{
  width:80rpx;
  height: 80rpx;
  position: absolute;
  top: 40rpx;
  left: 40rpx;
  border-radius: 50%;
}
.user-name{
  position: absolute;
  top: 56rpx;
  color: #ffffff;
  font-size: 34rpx;
  margin-left: 144rpx;
}
.get-points{
  position: absolute;
  top: 14rpx;
  right: 20rpx;
  font-size: 26rpx;
  color: #ffffff;
  text-decoration: underline;
}
.current-points{
  top: 182rpx;
  left: 40rpx;
  position: absolute;
  color: #ffffff;
  font-size: 28rpx;
  line-height: 40rpx;
}
.points-number{
  position: absolute;
  left: 40rpx;
  top: 208rpx;
  line-height: 168rpx;
  font-size: 118rpx;
  color: #ffffff;
  font-family: Ping Fang SC;
}
.function-select{
  width: 100%;
  line-height: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 48rpx;
}
.function-select-left{
  width: 114rpx;
  line-height: 40rpx;
  font-family: Ping Fang SC;
  color: #333333;
  font-size: 28rpx;
  margin-right: 26rpx;
}
.function-select-middle{
  border: 2rpx solid #eeeeee;
  height: 26rpx;
  margin-right: 26rpx;
}
.function-select-right{
  width: 114rpx;
  line-height: 40rpx;
  font-family: Ping Fang SC;
  color: #333333;
  font-size: 28rpx;
  margin-right: 26rpx;
}
.function-select-underline{
  width: 114rpx;
  border-bottom: 6rpx solid #2570D9;
  position: absolute;
  top: 485rpx;
  transition:all 0.3s ease;
}
.point-detail-list{
  margin-top: 45rpx;
  position: relative;
}
.point-detail-item{
  margin-bottom: 17rpx;
  margin-left: 40rpx;

}
.point-title{
  line-height: 44rpx;
  font-size: 32rpx;
  font-family: Ping Fang SC;
  color: #333333;
  margin-bottom: 8rpx;
}
.point-date{
  line-height: 40rpx;
  font-size: 28rpx;
  color:#999999;
}
.point-score{
  width: 100rpx;
  line-height: 84rpx;
  position: absolute;
  right: 95rpx;
  color: #2570D9;
  font-size: 60rpx;
  font-weight: 550;
  text-align: center;
  margin-top: -85rpx;

}
.point-underline{
  width: 670rpx;
  border: 2rpx solid #eeeeee;  
  margin-top: 15rpx;
}
.enter{
  position: absolute;
  width: 12rpx;
  height: 12rpx;
  border-top: 1px solid #2570D9;
  border-right: 1px solid #2570D9;
  transform: rotate(45deg);
  margin-top: 25rpx;
  margin-left: 260rpx;
}
.invite-people-list{
  margin-top: 35rpx;
  margin-left: 40rpx;
  position: relative;
}
.invite-describ{
  display: inline-block;
  line-height: 34rpx;
  font-family: Ping Fang SC;
  font-size: 24rpx;
}
.invite-button{
  border: none;
  display: inline-block;
  font-size: 28rpx;
  color: #2570D9;
  font-family: Ping Fang SC;
  margin-left: 139rpx;
  position: absolute;
  font-weight: 550;
}
.no-invite{
  margin-top: 114rpx;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-left: -40rpx;

}
.no-invite-pic{
  width: 558rpx;
  height: 406rpx;
}
.invite-people-table{
  margin-top: 24rpx;
  position: relative;
 
}
.invite-tr{
  margin-bottom: 32rpx;
  
  height: 64rpx;
}
.invite-avatar{
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: inline-block;
}
.invite-name{
  position: absolute;
  display: inline-block;
  margin-left: 16rpx;
  line-height: 64rpx;
  color: #333333;
  font-family: Ping Fang SC;
  font-size: 32rpx;
}
.invite-time{
  position: absolute;
  display: inline-block;
  margin-left: 236rpx;
  line-height: 64rpx;
  font-size: 28rpx;
  color: #333333;
  font-family: Ping Fang SC;
}
.invite-date{
  display: inline-block;
  line-height: 64rpx;
  position: absolute;
  right: 40rpx;
  font-size: 28rpx;
  color: #333333;
  font-family: Ping Fang SC;

}





</style>