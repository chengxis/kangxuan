<template>
  <div id="container">
    <div class="kindergarten-information">
      <input type="text" class="kindergarten-name" placeholder="请输入幼儿园名称" @input="handleInput($event,0)"/>
      <input type="text" class="user-name" placeholder="请输入您的姓名" @input ="handleInput($event,1)">
      <input type="text" class="user-contact" placeholder="请输入您的联系方式" @input="handleInput($event,2)">     
    </div>
    <div class="split-line"></div>
    <div class="kindergarten-other-information">
      <div class="kindergarten-scale">
        <div class="text">请选择幼儿园规模</div>
        <span class="scale-button" v-for="item in kindergarten_scale" :key="item.scale">
          <span @click="handleSelected($event,0)" :class="item.is_selected?'button-selected':'button'">{{item.scale}}</span>
        </span>

        
        <!-- <span class="button" @click="handleSelected">200人以内</span> -->
      </div>
      <div class="teacher-amount">
        <div class="text">请选择幼儿园教师人数</div>
        <span class="scale-button" v-for="item in teacher_scale" :key="item.scale">
          <span @click="handleSelected($event,1)" :class="item.is_selected?'button-selected':'button'">{{item.scale}}</span>
        </span>
      </div>
      <div class="kindergarten-type">
        <div class="text">请选择幼儿园类型</div>
        <span class="scale-button" v-for="item in kindergarten_type" :key="item.scale">
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
        {scale:'100人以内',is_selected:true},
        {scale:'200人以内',is_selected:false},
        {scale:'300人以内',is_selected:false},
        {scale:'大于300',is_selected:false}],
      teacher_scale:[
        {scale:'10人以内',is_selected:true},
        {scale:'20人以内',is_selected:false},
        {scale:'30人以内',is_selected:false},
        {scale:'大于30',is_selected:false}],
      kindergarten_type:[
        {scale:'公立',is_selected:true},
        {scale:'私立',is_selected:false}],
      stu_range:'1',//标志幼儿园规模
      tea_range:'1',//标志幼儿园教师人数
      type:'1',//标志幼儿园类型
      title:'',//幼儿园名称
      name:'',//园长姓名
      mobile:'',//幼儿园园长联系方式



    }
  },
  methods:{
    //type{0:代表操作 stu_range 1:代表操作tea_range 2代表操作type}
    handleSelected(e,type){
      let select_index = parseInt(e.mp.currentTarget.dataset.eventid.split('_')[1])
      // console.log(select_index)
      if(type==0){
        this.stu_range = String(select_index + 1)
        //将选中的按钮的is_selected变为true，其他为false            
        for(let i in this.kindergarten_scale){
          if(i==select_index){
            this.kindergarten_scale[i].is_selected = true
          }else{
            this.kindergarten_scale[i].is_selected = false
          }        
        }

      }else if(type==1){
        this.tea_range = String(select_index + 1)
        for(let i in this.kindergarten_scale){
          if(i==select_index){
            this.teacher_scale[i].is_selected = true
          }else{
            this.teacher_scale[i].is_selected = false
          }        
      }
      }else{
        this.type = String(select_index + 1)
        for(let i in this.kindergarten_type){
          if(i==select_index){
            this.kindergarten_type[i].is_selected = true
          }else{
            this.kindergarten_type[i].is_selected = false
          }        
      }
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
    async handleSubmit(){
      console.log("提交")
      let RegExp =  /^((1[0-9]{10}))$/ //设置手机号的正则匹配字符串
      // console.log("点击提交")
      // console.log("要发送的幼儿园名称",this.title)
      // console.log("要发送的园长姓名",this.name)
      // console.log("要发送的园长联系方式",this.mobile)
      // console.log("要发送幼儿园规模的数据",this.stu_range)
      // console.log("要发送的教师人数数据",this.tea_range)
      // console.log("要发送的幼儿园类型数据",this.type)
      //幼儿园名称，园长姓名，联系方式均不能为空
      if(this.title==''){
        wx.showToast({
          title: '幼儿园名称为必填项',
          icon: 'none',
          duration:2000
        })
      }else if(this.name==''){
        wx.showToast({
          title: '您的姓名为必填项',
          icon: 'none',
          duration:2000
        })
      }else if(this.mobile==''){
        wx.showToast({
          title: '您的联系方式为必填项',
          icon: 'none',
          duration:2000
        })
      }else if(!RegExp.test(this.mobile)){
        wx.showToast({
          title:'您的联系方式格式有误',
          icon:'none',
          duration:2000
        })
      }else{
        let current_data = {
          api_token:this.$global.token,
          title:this.title,
          name:this.name,
          mobile:this.mobile,
          stu_range:this.stu_range,
          tea_range:this.tea_range,
          type:this.type
        }
        let current_header = {'content-type':'application/x-www-form-urlencoded'}
        let result = await request('/brand/create/',current_data,'POST',current_header)
        console.log(result)
        if(result.state==1){
          wx.showToast({
            title:'创建幼儿园成功',
            icon:'success',
            duration:2000
          })
          //当重新创建一个brand_id时，本地将更新brand_id，代表更新机构，这时重新回到index页面，重新进行网络请求
          this.$global.setBrandId(result.data.brand_id)
          //本地设置一个新的key,用来告诉首页需要重新进行网络请求，更新数据
          wx.setStorage({
            key: 'isCreate',
            data: true
          })
          console.log("打印global中的brand_id值",this.$global.brand_id)
          wx.switchTab({
            url: '/pages/index/main'
          })
        }else if(result.state==-1){
          wx.showToast({
            title:'登录失效，请重新登录',
            icon:'none',
            duration:2000
          })
        }else if(result.state == 0){
          wx.showToast({
            title:result.message,
            icon:'none',
            duration:2000
          })
        }
        

      }

      

    }

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