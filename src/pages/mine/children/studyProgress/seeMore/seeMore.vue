<template>
  <div id="containner">
    <div class="teacher-detail-top">
      <div class="teacher-photo"></div>
      <div class="teacher-name">张三</div>
    </div>
    <ul class="course-list">
      <div class="course-name">
        <span class="left">每周四 | 教师成长营</span>
        <span class="right">总考分：80分</span>
      </div>
      <li class="course-item" v-for="item in [1,2,3,4]" :key="item">
        <span class="item-left">【7月7日~开班导学】教师专业标准解读</span>
        <span class="item-right">80分</span>
      </li>

    </ul>
  </div>
  
</template>
<script>
export default {
  data(){
    return{
      teacherDetailItem:[]

    }
  },
  mounted(){
    //获取用户点击的课程的课程详情
    this.teacherDetailItem = JSON.parse(this.$mp.query.teacherDetailItem)
    console.log(this.teacherDetailItem)
  },
  
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
  background-color: brown;

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
  margin-left: -10rpx;
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
  margin-left: -10rpx;
}
.item-right{
  position: absolute;
  right: 64rpx;
}



</style>