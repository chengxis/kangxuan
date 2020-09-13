<template>
  <div id="containner">
    <div class="teacher-detail-top">
      <img class="teacher-photo" :src="teacherDetailItem.avatar"> 
      <div class="teacher-name">{{teacherDetailItem.name}}</div>
    </div>
    <ul class="course-list">
      <div class="course-name">
        <span class="left">{{teacherDetailItem.title}}</span>
        <!-- <span class="right">总考分：80分</span> -->
      </div>
      <li class="course-item" v-for="(item,index) in teacherDetailItem.list" :key="index">
        <span class="item-left">{{item.title}}</span>
        <span class="item-right">{{item.score}}</span>
      </li>

    </ul>
  </div>
  
</template>
<script>
import request from '../../../../../lib/utils/request'
export default {
  data(){
    return{
      teacherId:'',
      courseId:'',
      teacherDetailItem:[],
      isShowScore:false,//有测评时，如果进行测评则显示测评分数，否则显示未参加测评

    }
  },
  methods:{
    async getTeaDetailItem(){
      let body_data = {
        api_token:this.$global.token,
        api_token:'d174UtqqUFtMsF2zd58W4YJxUPzRbn2ACaSQOZe7',
        course_id:this.courseId,
        teacher_id:this.teacherId
        // course_id:11,
        // teacher_id:17
      }
      let result = await request('/brand/schedule/teacher/',body_data,'POST')
      if(result.state === 1){
        this.teacherDetailItem = result.data
        for(let i of this.teacherDetailItem.list){
          if(i.is_ascess === 1 && i.score === null) i.score = "未参加测评"
          else if(i.is_ascess ===0 && i.score === null) i.score = "没有测评"
          else i.score = i.score + '分'
        }
      }else if(result.state === 0){
        wx.showToast({
          title: result.message,
          icon: 'none',
          duration:2000
        })
      }else{
        console.log("seeMore中获取老师详细信息失败")
      }
      
    }

  },
  mounted(){
    //获取用户点击的课程的课程详情
    
  },
  onShow(){
    this.teacherId = JSON.parse(this.$mp.query.teacher_id)
    this.courseId = JSON.parse(this.$mp.query.course_id)
    this.getTeaDetailItem()
    

  }
  
  
}
</script>
<style scoped>
#container{
  width: 100%;
  position: relative;
}
.teacher-detail-top{
  margin-top: 50rpx;
  margin-bottom: 32rpx;

}
.teacher-photo{
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  margin-left: 304rpx;
  /* background-color: brown; */

}
.teacher-name{
  margin-top: 12rpx;
  margin-left: 336rpx;
  font-size: 32rpx;
  line-height: 44rpx;
  color: #000000;

}
.course-list{
  width: 100%;
  position: relative;
}
.course-name{
  margin-left: 32rpx;
  margin-bottom: 46rpx;
  line-height: 44rpx;
  font-size: 32rpx;
  color: #2570D9;
  font-weight: 550;
  font-family: Ping Fang SC;
  position: relative;
}
.right{
  display: inline-block;
  position: absolute;
  right: 82rpx;
}
.course-item{
  line-height: 40rpx;
  font-size: 28rpx;
  color: #4F4F4F;
  font-family: Ping Fang SC;
  margin-bottom: 46rpx;
  position: relative;
  margin-left: 32rpx;
}
.item-right{
  position: absolute;
  right: 64rpx;
}



</style>