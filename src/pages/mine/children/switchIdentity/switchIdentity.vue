<template>
  <div id="container">
    <ul class="identityList">
      <li class="identityItem" 
      @longpress="handleLongPress"
      @click="handleSwitchConstitude($event,item)" 
      v-for="(item,index) in constitudeList" 
      :key="item.brand_id"
      :style="index==0?'':'background-image:linear-gradient(105.04deg,#E0DFFF 0%,#DBE8FB 97.82%)'">
        <div class="identityTop">
          <span class="brand" :style="index==0?'':'color:#2570D9'">{{item.title}}</span>
          <span class="property" :style="index==0?'':'color:#2570D9;background:#C9D2FF'">{{item.type}}</span>
          <span class="identity" :style="index==0?'':'background:#93E3D0'">{{item.identity}}</span>
        </div>
        <div class="identityBottom">
          <span class="identity-scale" :style="index==0?'':'color:#2570D9'">教师人数:{{item.tea_range}}</span>
          <span class="identity-scale-stu" :style="index==0?'':'color:#2570D9'">{{item.stu_range}}</span>
        </div>
      </li>


    </ul>
    <div class="identity-update" >
      <div class="text-describtion" :style="isShowComplete?'display:block':'display:none'">长按可修改或删除身份</div>
    </div>
    <div class="identity-create" @click="createKindergarten" 
    :style="isShowComplete?'display:block':'display:none'">
      <div class="box-bottom"></div>
      <div class="box-left"></div>
    </div>

  </div>
  
</template>
<script>
import request from '../../../../utils/request'
export default {
  data(){
    return{
      constitudeList:[],
      isShowComplete:false,//判断页面机构列表是否渲染完成

    }
  },
  methods:{
    handleLongPress(){
      wx.showActionSheet({
        itemList: ['修改','删除'],
        itemColor: '',
        success(res){
          console.log(res.tapIndex)
        }
      })


    },
    createKindergarten(){
      console.log("创建幼儿园")
      wx.navigateTo({
        url:'/pages/index/children/creatKindergarten/main'
      })
    },
    handleSwitchConstitude(e,item){
      // console.log(item.brand_id)
      this.switchConstitude(item.brand_id)
    },
    //处理数据函数
    async getOwnConstitude(){
      //获取当前用户身份下所有的机构信息
      console.log('当前方法执行')
      let current_data = {
        api_token:this.$global.token
        }
      let allConstitude = await request('/person/brand/',current_data,'POST',{'content-type':'application/x-www-form-urlencoded'})
      console.log("返回的所有机构的信息",allConstitude.data)
      if(allConstitude.state==1){
        // console.log("执行")
        for(let i of allConstitude.data.list){
          if(i.type == 1){
            i.type = "公立"
          }else i.type= "私立"
          if(i.tea_range == 1){
            i.tea_range = "10人内"
          }else if(i.tea_range == 2){
            i.tea_range = "20人内"
          }else if(i.tea_range ==3){
            i.tea_range = "30人内"
          }else i.tea_range = '30人外'
          //更换stu_range
          if(i.stu_range == 1){
            i.stu_range = "100人内"
          }else if(i.stu_range == 2){
            i.stu_range = "200人内"
          }else if(i.stu_range ==3){
            i.stu_range = "300人内"
          }else i.stu_range = '300人外'
          if(i.identity == 1){
            i.identity = "园长"
          }else i.identity= "老师"
        }
        this.constitudeList = allConstitude.data.list
        this.constitudeList.name = allConstitude.data.name
        console.log(this.constitudeList)
        this.isShowComplete = true

      }
    },
    async switchConstitude(new_id){
      //将当前的幼儿园和要切换的幼儿园返给接口
      let current_data = {
        api_token:this.$global.token,
        old_id:this.$global.kingarten_info.brand_id,
        new_id:new_id
      }
      let newConstitude = await request('/brand/change/',current_data,'POST',{'content-type':'application/x-www-form-urlencoded'})
      this.$global.setBrandId(new_id)
      // console.log(new_id)
      console.log("newConstitude",newConstitude)
      if (newConstitude.state == 1){
        console.log("这里执行了")
        // wx.swichTab({      
        //   url: '/pages/index/main'
        // })
        wx.switchTab({
          url: '/pages/mine/main',
          success: function(res){
            console.log(res)
          },
          fail: function() {
            console.log("跳转失败")
          }
        })
        //当用户切换机构，mine需要重新获取幼儿园信息，通过isSwitch判断是否需要向接口请求数据
        wx.setStorage({
          key: 'isSwitch',
          data: true,

        })
      } 
    }
  },


  onShow(){
    this.getOwnConstitude()
  }
  
}
</script>
<style scoped>
  #container{
    width: 100%;
  }
  .identityList{
    margin: 32rpx 0 32rpx 32rpx;
    position: relative;
  }
  .identityItem{
    width: 686rpx;
    height: 180rpx;
    border-radius: 8rpx;
    background-image: linear-gradient(151.74deg,#6360FF 0%,#2164C2 100%);
    margin-bottom: 24rpx;
    /* background-image: linear-gradient(#e66465, #9198e5); */
  }
  .identityTop{
    width: 100%;
    height: 70rpx;
    position: relative;
    margin-bottom: 45rpx;
  }
  .brand{
    display:inline-block;
    line-height: 32rpx;
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: 530;
    font-family: Ping Fang SC;
    margin: 24rpx 16rpx 64rpx 24rpx;
    border-radius: 4rpx;
    /* position: absolute; */
  }
  .property{
    background: #2939A4;
    line-height: 30rpx;
    padding: 3rpx 14rpx;
    font-family: Ping Fang SC;
    font-weight: 530;
    font-size: 24rpx;
    color: #FFFFFF;
    margin-top: 25rpx;
    border-radius: 4rpx;
    position: absolute;
  }
  .identity{
    width: 104rpx;
    line-height: 56rpx;
    background: #1CDAAC;
    color: #FFFFFF;
    font-size: 32rpx;
    font-family: Ping Fang SC;
    position: absolute;
    top: 0;
    right: 0;
    text-align: center;
    border-bottom-left-radius: 8rpx;

  }
  .identityBottom{
    position: relative;
    /* background: cornsilk; */
  }
  .identity-scale{
    position: absolute;
    line-height: 28rpx;
    color: #FFFFFF;
    margin-left: 24rpx;
    font-family: Ping Fang SC;
    font-size: 28rpx;

  }
  .identity-scale-stu{
    position: absolute;
    top: -5rpx;
    right: 30rpx;

  }
  .identity-update{
    /* width: 100%; */
    height: 24rpx;
    margin: 32rpx 120rpx 24rpx 270rpx;

  }
  .text-describtion{
    font-family: Ping Fang SC;
    font-size: 24rpx;
    line-height: 24rpx;
    color: #828282;
  }
  .identity-create{
    width: 686rpx;
    height: 180rpx;
    margin: 0 32rpx 32rpx;
    line-height: 180rpx;
    text-align: center;
    color: #2570D9;
    border: 2rpx solid #2570D9;
    border-radius: 8rpx;
    position: relative;
  }
  .box-bottom{
    width: 88.86rpx;
    border-bottom: 2rpx solid #2570D9;
    position: absolute;
    left: 298.58rpx;
    top: 89rpx;
  }
  .box-left{
    height: 98rpx;
    border-left: 2rpx solid #2570D9;
    position: absolute;
    left: 343rpx;
    top: 40rpx;

  }
  



</style>