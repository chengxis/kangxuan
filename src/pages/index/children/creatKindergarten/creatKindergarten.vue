<template>
  <div id="container">
    <div class="kindergarten-information">
      <input type="text" 
      class="kindergarten-name" 
      placeholder="请输入幼儿园名称" 
      v-model="title"
      @input="handleInput($event,0)"/>
      <input type="text" 
      class="user-name" 
      placeholder="请输入幼儿园联系人" 
      @input ="handleInput($event,1)"
      v-model="name">
      <input type="text" 
      class="user-contact" 
      placeholder="请输入联系人的联系方式" 
      @input="handleInput($event,2)"
      v-model="mobile"
      >     
    </div>
    <div class="split-line"></div>
    <div class="kindergarten-other-information">
      <div class="kindergarten-scale">
        <div class="text">请选择幼儿园规模</div>
        <span class="scale-button" v-for="item in kindergarten_scale" :key="item.id">
          <span @click="handleSelected($event,0)" :class="item.is_selected?'button-selected':'button'">{{item.scale}}</span>
        </span>     
      </div>
      <div class="teacher-amount">
        <div class="text">请选择幼儿园教师人数</div>
        <span class="scale-button" v-for="item in teacher_scale" :key="item.id">
          <span @click="handleSelected($event,1)" :class="item.is_selected?'button-selected':'button'">{{item.scale}}</span>
        </span>
      </div>
      <div class="kindergarten-type">
        <div class="text">请选择幼儿园类型</div>
        <span class="scale-button" v-for="item in kindergarten_type" :key="item.id">
          <span @click="handleSelected($event,2)" :class="item.is_selected?'button-selected':'button'">{{item.scale}}</span>
        </span>
      </div>
    </div>
    <div class="submit" @click="handleSubmit">立即提交</div>
  </div>
  
</template>
<script>
import request from '../../../../utils/request'
export default {
  data(){
    return{
      kindergarten_scale:[
        {id:0,scale:'100人以内',is_selected:true},
        {id:1,scale:'200人以内',is_selected:false},
        {id:2,scale:'300人以内',is_selected:false},
        {id:3,scale:'大于300',is_selected:false}],
      teacher_scale:[
        {id:0,scale:'10人以内',is_selected:true},
        {id:1,scale:'20人以内',is_selected:false},
        {id:2,scale:'30人以内',is_selected:false},
        {id:3,scale:'大于30',is_selected:false}],
      kindergarten_type:[
        {id:0,scale:'公立',is_selected:true},
        {id:1,scale:'私立',is_selected:false}],
      stu_range:'1',//标志幼儿园规模
      tea_range:'1',//标志幼儿园教师人数
      type:'1',//标志幼儿园类型
      title:'',//幼儿园名称
      name:'',//园长姓名
      mobile:'',//幼儿园园长联系方式
      kindergarten:'',//用于接收修改幼儿园时传过来的幼儿园信息
    }
  },
  computed:{

  },
  methods:{
    buttonShow(type,index){
      //用于处理显示哪个button，type=0,处理幼儿园规模，1处理幼儿园教师人数，2处理幼儿园类型
      if(type === 0){   
        //将选中的按钮的is_selected变为true，其他为false 
        let traverse = 0 //记录循环的此时
        for(let i of this.kindergarten_scale){
          if(traverse === index){
            i.is_selected = true
          }else{
            i.is_selected = false
          }
          traverse += 1 
        }
      }else if(type === 1){
        let traverse = 0
        for(let i of this.teacher_scale){
          if(traverse === index){
            i.is_selected = true
          }else{
            i.is_selected = false
          }
          traverse += 1     
        }
      }else{
        let traverse = 0
        for(let i of this.kindergarten_type){
          if(traverse === index){
            i.is_selected = true
          }else{
            i.is_selected = false
          }
          traverse += 1     
        }
      }
    },
    handleSelected(e,type){
      let select_index = parseInt(e.mp.currentTarget.dataset.eventid.split('_')[1])
      if(type===0){
        this.stu_range = String(select_index + 1)
        this.buttonShow(type,select_index) 
      }else if(type===1){
        this.tea_range = String(select_index + 1)
        this.buttonShow(type,select_index)      
      }else{
        this.type = String(select_index + 1)
        this.buttonShow(type,select_index)
      }    
    },
    //inputType{0:代表输入的是幼儿园名称，1:代表园长姓名，2：代表幼儿园园长的联系方式}
    handleInput(e,inputType){
      if(inputType==0){
        this.title = e.mp.detail.value
      }else if(inputType==1){
        this.name = e.mp.detail.value 
      }else{
        this.mobile = e.mp.detail.value    
      }
    },
    checkFormat(){
      let RegExp =  /^((1[0-9]{10}))$/ //设置手机号的正则匹配字符串
      if(this.title==''){
        wx.showToast({
          title: '幼儿园名称为必填项',
          icon: 'none',
          duration:2000
        })
        return false
      }else if(this.name==''){
        wx.showToast({
          title: '您的姓名为必填项',
          icon: 'none',
          duration:2000
        })
        return false
      }else if(this.mobile==''){
        wx.showToast({
          title: '您的联系方式为必填项',
          icon: 'none',
          duration:2000
        })
        return false
      }else if(!RegExp.test(this.mobile)){
        wx.showToast({
          title:'您的联系方式格式有误',
          icon:'none',
          duration:2000
        })
        return false
      }else{
        return true
      }
    },
    async handleSubmit(){
      let formate = this.checkFormat()
      if(formate&&this.$global.isUpdateKin){
        //如果是更新幼儿园，调用更新函数,并将isUpdateKin设置为false
        this.updateKin()
        this.$global.setisUpdateKin(false)
      }else if(formate&&!this.$global.isUpdateKin){
        //如果是创建幼儿园，调用创建函数
        this.createKin()
      }
    },
    async createKin(){
      let current_data = {
        api_token:this.$global.token,
        title:this.title,
        name:this.name,
        mobile:this.mobile,
        stu_range:this.stu_range,
        tea_range:this.tea_range,
        type:this.type
      }
      let result = await request('/brand/create/',current_data,'POST')
        if(result.state === 1){
          wx.showToast({
            title:'创建幼儿园成功',
            icon:'success',
            duration:2500,
          })
          //当重新创建一个brand_id时，本地将更新brand_id，代表更新机构，这时重新回到index页面，重新进行网络请求
          this.$global.setBrandId(result.data.brand_id)
          //重新进行login接口请求和机构请求
          this.$global.setGetLoginAgain(true)
          this.$global.setGetBrandAgain(true)
          //延迟2.5s跳转到index
          setTimeout(()=>{
            wx.switchTab({
            url: '/pages/index/main'
          }),2500})
        }else if(result.state === -1){
          wx.showToast({
            title:'登录失效，请重新登录',
            icon:'none',
            duration:2000
          })
        }else if(result.state === 0){
          wx.showToast({
            title:result.message,
            icon:'none',
            duration:2000
          })
        }
      

    },
    async getBrandInformation(){
      //获取机构信息
      let body_data = {
        api_token:this.$global.token,
        brand_id:this.kindergarten.brand_id
      }
      let result = await request('/brand/info/',body_data,'POST')
      if(result.state === 1){
        let brandInformation = result.data.list
        this.title = brandInformation.title
        this.name = brandInformation.name
        this.mobile = brandInformation.mobile
        this.tea_range = brandInformation.tea_range
        this.stu_range = brandInformation.stu_range
        this.type = brandInformation.type
        this.buttonShow(0,parseInt(this.stu_range)-1)
        this.buttonShow(1,parseInt(this.tea_range)-1)
        this.buttonShow(2,parseInt(this.type)-1)
      }else{
        console.log("createKindergaarten中获取机构信息失败")
      }
    },
    async updateKin(){
      let body_data = {
        api_token:this.$global.token,
        brand_id:this.kindergarten.brand_id,
        title:this.title,
        name:this.name,
        mobile:this.mobile,
        stu_range:this.stu_range,
        tea_range:this.tea_range,
        type:this.type
      }
      let result = await request('/brand/motify/',body_data,'POST')
      console.log("测试点",result)
      if(result.state === 1){
        wx.showToast({
          title:'修改幼儿园成功',
          icon:'success',
          duration:2000
        })
        this.$global.setGetLoginAgain(true)
        this.$global.setGetBrandAgain(true)

        wx.switchTab({
          url: '/pages/index/main'
        })
      }

    },
    init(){
      if(this.$global.isUpdateKin){
        this.kindergarten = JSON.parse(this.$mp.query.kindergarten)
        console.log("这里执行")
        this.getBrandInformation()
      }else{
      //用户第一次登录的话将输入框的name和mobile赋值到data中name和mobile上
        console.log("用户执行添加")
        this.mobile = this.$global.user_info.phone
        this.name = this.$global.user_info.name
      }  
    }

  },
  onShow(){
    this.init()
    console.log(this.$global.isUpdateKin)
  },
  onUnload(){
    console.log("onhide")
    //当用户点击修改页面，但是在当前页面并未提交而退出当前页面，将updateKin设为false
    this.$global.setisUpdateKin(false)
    //将用户存入的信息设为空
    this.title = ''
    this.stu_range = '1'
    this.buttonShow(0,parseInt(this.stu_range)-1)
    this.tea_range = '1'
    this.buttonShow(1,parseInt(this.tea_range)-1)
    this.type = '1'
    this.buttonShow(1,parseInt(this.type)-1)
    
  }
  
}
</script>
<style scoped>
  #container{
    width: 100%;
    position: relative;
  }
  .kindergarten-information{
    margin: 40rpx 32rpx;
    position: relative;
  }
  .kindergarten-information input{
    width: 686rpx;
    height: 88rpx;
    line-height: 44rpx;
    background-color: #FAFAFA;
    border-radius: 4rpx;
    margin-bottom: 32rpx;
  }
  .split-line{
    width: 750rpx;
    height: 12rpx;
    background-color: #F2F2F2;
    margin-bottom: 40rpx;
  }
  .text{
    font-family: Ping Fang SC;
    line-height: 44rpx;
    font-size: 32rpx;
    color: #333333;
    margin-left: 32rpx;
    margin-bottom: 24rpx;
  }
  .scale-button{
    display: inline-block;
    margin-left: 32rpx;
    margin-bottom: 40rpx;

  }
  .button-selected{
    display: inline-block;
    /* width: 134rpx; */
    height: 56rpx;
    color:#FFFFFF;
    font-size: 28rpx;
    line-height: 56rpx;
    text-align: center;
    /* margin-left: 32rpx; */
    border-radius: 4rpx;
    background: #2570D9;
    padding: 0 10rpx;
  }
  .button{
    display: inline-block;
    /* width: 134rpx; */
    height: 56rpx;
    color:#BDBDBD;
    font-size: 28rpx;
    line-height: 56rpx;
    text-align: center;
    /* margin-left: 32rpx; */
    border-radius: 4rpx;
    border: 2rpx solid #BDBDBD;
    padding: 0 10rpx;

  }
  .submit{
    width: 686rpx;
    height: 88rpx;
    margin: 80rpx 32rpx 88rpx 32rpx;
    line-height: 88rpx;
    color: #FFFFFF;
    font-size: 32rpx;
    font-family: Ping Fang SC;
    font-weight: 600;
    background: #2570D9;
    border-radius: 4rpx;
    text-align: center;


  }

</style>