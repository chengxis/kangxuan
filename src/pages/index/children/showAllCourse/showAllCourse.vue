<template>
  <div id="container">
    <SearchBar></SearchBar>
    <div class="set-margin"></div>
    <NavClassList :cCourseItem="allCourse"></NavClassList>
  </div>
  
</template>

<script>
import allCourse from '../../../../../static/allCourse.json'
import NavClassList from '../../../../components/nav_class_list/NavClassList'
import SearchBar from '../../../../components/search_bar/SearchBar'
export default {
   components: {
    NavClassList,
    SearchBar
  },
  data(){
    return{
      allCourse:[]
    }
  },
  mounted(){
    // this.allCourse = allCourse
    var that = this
    wx.request({
        url: 'https://wx.sc-edu.com/knsh/courselist/total/',
        method:'POST',
        header:{
          'content-type':"application/x-www-form-urlencoded"
        },
        data: {
          api_token: "8c1eIPCvBusNPV2vpDEleaBNDSHlpephjhxy2njk",
        },
        success(res){       
          console.log("全部课程",res) 
          that.allCourse = res.data.data.list
        }
      })   
  }

  
}
</script>

<style scoped>
.set-margin{
  height: 20rpx;
}

</style>