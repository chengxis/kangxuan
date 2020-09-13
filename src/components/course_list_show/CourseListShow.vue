<template>
  <div class="course">  
    <!-- 课程列表 -->
    <ul class="course-list" >
      <!-- 课程信息 -->
      <li class="course-item" v-for="(item,index) in cCourseItem" :key="index">  
      <div class="show">
        <img class="select"
          v-if="item.is_pay===0&&!item.isSelect"
          src="https://cdn.sc-edu.com/img/2020/08/14/18/f1db72e96122693e1240a35ea53e1a66.png"
          @click="selectCourse(item)">
        <img class= "select" 
          v-if="item.is_pay===0&&item.isSelect"
          src="https://cdn.sc-edu.com/img/2020/08/14/18/41d3a03ecb164a76a7344b0839b1d796.png"
          @click="selectCourse(item)">
        <img class="select"
              v-if="item.is_pay===1"
              src="https://cdn.sc-edu.com/img/2020/08/18/17/8f9cc0d3409b698defaffdf1c8e26657.png">
      </div>     
        <div class="click-area" @tap="seeCourseDetail(item)">
        <!-- 左侧：图片与课程类型 -->
          <div class="course-show">
            <img class="img-left" :src="item.img_url"> 
            <span class="course-type">{{item.type}}</span>
          </div>
          <div class="course-detail" >
            <!-- 课程名字 -->
            <span class="course-name pingFang_sc">{{item.title}}</span>
            <!-- isShowTime用来控制是否显示时间和描述信息，不显示的话则显示进度条-->
            <!-- 上课时间 -->
            <span class="course-time pingFang_sc">{{item.date}}</span>
            <!-- 课程描述 -->
            <span class="course-describtion">{{item.abstract}}</span>
            <!-- 进度条 -->
        
            <!-- 开通人数 -->
            <span class="course-people">{{item.number}}人开通</span>
            <!-- 课程价格 -->
            <span class="course-price">￥{{item.price}}/年</span>
            <img class="course_purchase"
            v-if="item.is_pay=== 1"
            src="https://cdn.sc-edu.com/img/2020/08/18/16/b09a10a18e68e444bdb309d91d084ad1.png"> 
          </div>
        </div>
      </li>
      <div class="course-pay" v-if="showPay">
        <div left-count>
          <div class="top">费用合计:</div>
          <div class="bottom">￥{{totalPrice}}</div>
        </div>
        <button class="pay-button" @click="handlePurchase">立即支付</button>
      </div>
    </ul>
    
  </div>
</template>

<script>
import request from '../../lib/utils/request'
import wxPurchaseRequest from '../../lib/utils/pay'
export default {
  data(){
    return{
      showPay:false,
      totalPrice:0,
      numSelect:0,//选中的个数
      courseId:[],//用于记录选中的courseId
      orderIds:[],//用于记录用户支付的课程id
    }    
  },
  props:{
    cCourseItem:Array   
  },
  methods:{
    seeCourseDetail(courseDetailItem){
      console.log("查看课程详情",courseDetailItem)
      var info = ''
      if(courseDetailItem.isPurchase){
        info = 'cid='+courseDetailItem.course_id+'&isPurchase=1'
      }else{
        info = 'cid='+courseDetailItem.course_id
      }
      wx.navigateTo({
        url:'/pages/course/children/courseDetail/main?'+info
      })
    },
    selectCourse(item){
      // console.log("测试",item)
      item.isSelect = !item.isSelect
      if(item.isSelect === true){
        this.numSelect += 1
        this.totalPrice += Number(item.price)
        this.totalPrice = Math.round(this.totalPrice*100)/100
        this.courseId.push(item.course_id) 
        // console.log("测试点增加",this.totalPrice)
        // console.log(this.courseId)
        // console.log(this.numSelect)
      }else {
        this.totalPrice -= Number(item.price)
        this.totalPrice = Math.round(this.totalPrice*100)/100
        this.numSelect -= 1
        this.courseId.splice(this.courseId.indexOf(item.course_id))
        // console.log("测试点减少",this.totalPrice)
        // console.log(this.courseId)      
        // console.log(this.numSelect)
      }
      if(this.numSelect>0) {
        this.showPay = true
      }else{
        this.showPay = false
      }   
    },
 
    async handlePurchase(){
      //用于支付
      //1 向接口请求支付的相关数据
      let purchase = await this.getPurchaseDate()
      //2 调用微信支付接口
      let result = await wxPurchaseRequest(purchase)
      // console.log("w微信支付接口的result",result)
      if(result === true){
        //3 查询支付状态
        let orderStatus = await this.getPurchaseStatus()
        //当支付状态为true时代表完全支付成功,此时通知父组件重新获取课程列表，并显示支付成功页面
        if(orderStatus === true){
          //将之前设置的HasCourseRecommand设置为false即可
          this.$global.setHasCourseRecommand(false)
          wx.navigateTo({
            url:'/pages/common/paySuccess/main'
          })
        }
      }
    },
    async getPurchaseDate(){
      //向接口请求支付相关数据
      let body_data = {
      api_token:this.$global.token,
      course_ids:this.courseId.join(','),
      brand_id:this.$global.kingarten_info.brand_id,
      price:this.totalPrice,
      }
      // console.log(body_data)
      let result = await request('/pay/brand/order/',body_data,'POST')
      // console.log("测试点",result)
      if(result.state === 1){
        let purchaseDate = result.data
        // console.log("测试点",purchaseDate)
        this.orderIds = purchaseDate.order_ids
        return{
          timeStamp:purchaseDate.timeStamp,
          nonceStr:purchaseDate.nonceStr,
          package:purchaseDate.package,
          signType:purchaseDate.signType,
          paySign:purchaseDate.paySign
        } 
      }

    },
    async getPurchaseStatus(){
      //查询支付状态
      let body_data = {
        api_token:this.$global.token,
        order_ids:this.orderIds.join(',')
      }
      let result = await request('/pay/brand/status/',body_data,'POST')
      // console.log("测1",result)
      if(result.state === 1){
        // console.log("支付的状态",result)
        if(result.data.pay_state===1) return true
        return false
      }else if(result.state ===0 ){
        console.log("支付状态为0",result)

      }else{
        console.log("courseListShow中getPurchaseStatus失败")
      }

    }
   
   
   

  },
  onShow(){
    // console.log("测试点",this.cCourseItem)
    // console.log(this.totalPrice)
    // console.log(this.numSelect)
    // console.log(this.courseId)
    
  },
  onUnload(){
    // console.log("onunload")
    //用户点击退出之前将用户行为发送给父组件
    this.$emit("updateCorseList",this.cCourseItem)
    // console.log(this.cCourseItem)
  }


  
}
</script>
<style scoped>
  .course{
    position: relative;
    width: 700rpx;
   
  }
  .course-list{
    margin:0 18rpx;
    position: relative;
   
  } 
  .course-item{
    height: 220rpx;
    margin-bottom: 40rpx;
   
    display: flex;
    position: relative;

  }
.show{
  line-height: 220rpx;
  margin-left: 4rpx;
 
}
.select{
  width: 36rpx;
  height: 36rpx;
  margin-right: 14rpx;
}
.course-num{
  font-family: DIN;
  font-weight: bold;
  font-size: 24rpx;
  position: absolute;
  top: 30rpx;
  left: -2rpx;
}

.click-area{
  display: flex;
  position: relative;
  width: 660rpx;
  
}
.course-show{
  position: relative;
}
.img-left{
  width: 280rpx;
  height: 220rpx;
  margin-right: 20rpx;
}
.course-type{
  height: 40rpx;
  background-color:rgba(1,1,1,.5);
  text-align: center;
  line-height: 40rpx;
  position: absolute;
  color: white;
  font-size: 20rpx;
  right: 30rpx;
  bottom: 15rpx;
  padding: 0 10rpx;
  border-radius: 10rpx;
}

.course-name{
  display: block;
  width: 354rpx;
  /* height: 88rpx; */
  font-family: Ping Fang FC;
  line-height: 44rpx;
  font-size: 32rpx;
  font-weight: 550;
  color: #333333; 
  margin: 10rpx 0;
}
.course-time{
  display: block;
  width: 348rpx;
  height: 32rpx;
  font-size: 22rpx;
  line-height: 32rpx;
  color: #828282;
  font-family: Ping Fang SC;
  margin-bottom: 4rpx;
}
.course-describtion{
  display: block;
  width: 348rpx;
  /* height: 32rpx; */
  font-size: 22rpx;
  line-height: 32rpx;
  color: #828282;
  font-family: Ping Fang SC;
  margin-bottom: 5rpx
}
.course_purchase{
  width: 150rpx;
  height: 150rpx;
  position:absolute;
  z-index: -10;
  top: 20rpx;
  right: 40rpx;
}

.course-people{
  width: 102rpx;
  height: 30rpx;
  font-size: 22rpx;
  line-height: 30rpx;
  color: #4F4F4F;
  font-family: Ping Fang SC;
  margin-top:-10rpx;
}
.course-price{
  /* width: 122rpx; */
  height: 40rpx;
  font-family: Ping Fang SC;
  font-weight: 550;
  font-size: 28rpx;
  color: #FB2A36;
  position: absolute;
  right: 16rpx;

}

.course-pay{
  width: 750rpx;
  height: 98rpx;
  position: fixed;
  display: flex;
  bottom:0rpx;
  background: #FFFFFF;
  z-index: 2;
}
.left-count{
  margin-left: 32rpx;
}
.left-count .top{
  width: 120rpx;
  margin-top: 6rpx;
  line-height: 34rpx;
  font-size: 24rpx;
  font-family: Ping Fang SC;
  color:#333333;
}
.bottom{
  width: 60rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  color: #FB2A36;
  font-family: Ping Fang SC;
  margin-top: 10rpx;
}
.pay-button{
  width: 406rpx;
  line-height: 88rpx;
  background: #2570D9;
  border-radius: 4rpx;
  font-family: Ping Fang SC;
  font-weight: 500;
  font-size: 34rpx;
  color: #FFFFFF;
  margin-right: 48rpx;
}


</style>
