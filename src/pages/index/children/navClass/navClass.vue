<template>
  <div id="container">
    <SearchBar></SearchBar>
    <NavClassList :cCourseItem="courseItem"></NavClassList>
    <!-- <div class="test" >{{courseItem}}</div> -->

      
  </div>
</template>
<script>
//:cCourseItem="courseItem"
import SearchBar from '../../../../components/search_bar/SearchBar'
import NavClassList from '../../../../components/nav_class_list/NavClassList'
export default { 
  components: {
    SearchBar,
    NavClassList
  },

  data () {
   return{
      courseType: '',
      courseTypeText: '',
      courseItem: []
   }
  

  },
  computed:{


  },
  mounted () {

    this.courseType = this.$mp.query.tid

    console.log("页面传值type",this.courseType)
    if(this.courseType==1) this.courseTypeText = "线上课"
    else if(this.courseType==2) this.courseTypeText = "直播课"
    else if(this.courseType==3) this.courseTypeText = "面授课"
    else if(this.courseType==4) this.courseTypeText = "ai推荐"
    else if(this.courseType==5) this.courseTypeText = "线上商城"

    wx.setNavigationBarTitle({
      title: this.courseTypeText
    })

    var that = this
    wx.request({
        url: 'https://wx.sc-edu.com/knsh/courselist/type/',
        method:'POST',
        header:{
          'content-type':"application/x-www-form-urlencoded"
        },
        data: {
          type: that.courseType,
          api_token: "8c1eIPCvBusNPV2vpDEleaBNDSHlpephjhxy2njk"
        },
        success(res){       
          console.log(res)        
          that.courseItem = res.data.data.list;
        }
    }) 

    
  }
}
</script>
<style scoped>


  #container{
    box-sizing: content-box;
    margin: 10rpx 0;
    width: 100%; height: 100%;
    position: relative;
  }
  .test{
    position: absolute;
    width: 200rpx;
    height: 200rpx;
    background-color: pink;
    top: 800rpx;
  }
  

</style>