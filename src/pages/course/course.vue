<template>
  <div id="containner">
    <SearchBar></SearchBar>
    <div id="choose-course">
      <span :class="isLike?'purchase-unselected':'purchase-selected'" @tap="handleChoosePurchase">已购</span>
      <span :class="isLike?'like-selected':'like-unselected'" @tap="handleChooseLike">喜欢</span>
      <span class="underline" :style="isLike?'left:408rpx':'310rpx'"></span>
    </div>
    <div class="showPurchaseCourse" v-show="!isLike">
      <NavClassList :cCourseItem="purchaseCourse" ></NavClassList>
    </div>
    <div class="showLikedCourse" v-show="isLike">
      <NavClassList :cCourseItem="likeCourse"></NavClassList>
    </div>
   
  </div>
  
</template>

<script>
////"navigationStyle": "custom",
import SearchBar from '../../components/search_bar/SearchBar'
import NavClassList from '../../components/nav_class_list/NavClassList'
import purchaseCourseData from '../../../static/purchaseCourseData.json'
import likeCourseData from '../../../static/likeCourseData.json'
export default {
  components: {
    SearchBar,
    NavClassList
  },
  data(){
    return{
      isLike:false,//判断用户是否点击了喜欢列表/已购列表
      likeCourse:[],
      purchaseCourse:[]
    }
  },
  mounted(){
    // this.likeCourse = likeCourseData
    // this.purchaseCourse = purchaseCourseData
    this.init()
  },
  methods:{
    handleChoosePurchase(){
      console.log("点击了已购")
      this.isLike = false
      this.init_purchase_list()
    },
    handleChooseLike(){
      console.log("点击了喜欢")
      this.isLike = true  
      this.init_like_list()    
    },

    // 获取已购和喜欢列表
    init(){
      this.init_purchase_list()
      this.init_like_list()    
    },

    // 获取已购列表
    init_purchase_list(){
      var that = this
      wx.request({
        url: 'https://wx.sc-edu.com/knsh/courselist/bought/',
        method:'POST',
        header:{
          'content-type':"application/x-www-form-urlencoded"
        },
        data: {
          api_token: "8c1eIPCvBusNPV2vpDEleaBNDSHlpephjhxy2njk",
          brand_id: 1
        },
        success(res){       
          console.log("已购课程",res) 
          that.purchaseCourse = res.data.data.list
          // 区分是否从已购课程列表进入
          for(let index in that.purchaseCourse){
            that.purchaseCourse[index].isPurchase = true         
          }
        }
      })

    },

    // 获取喜欢列表
    init_like_list(){
      var that = this
      wx.request({
        url: 'https://wx.sc-edu.com/knsh/courselist/prefer/',
        method:'POST',
        header:{
          'content-type':"application/x-www-form-urlencoded"
        },
        data: {
          api_token: "8c1eIPCvBusNPV2vpDEleaBNDSHlpephjhxy2njk",
        },
        success(res){       
          console.log("收藏课程",res) 
          that.likeCourse = res.data.data.list
        }
      })

    }



  }
}
</script>

<style scoped>
  #containner{
    box-sizing: content-box; 
    padding-bottom: 36rpx;
    /* width: 100%; */
    /* height: 100%; */
    position: relative;
  }
  #choose-course{
    /* width: 100%; */
    height: 88rpx;
    /* border: 2rpx solid pink; */
    text-align: center;
    line-height: 88rpx;
    position: relative;
  }
.purchase-selected{
  width: 68rpx;
  height: 48rpx;
  line-height: 48rpx;
  font-size: 34rpx;
  color: #2570D9;
  font-weight: 530;
  margin-right: 40rpx;
}
.like-unselected{
  width: 56rpx;
  line-height: 40rpx;
  color: #BDBDBD;
  font-size: 28rpx;
}
.purchase-unselected{
  width: 56rpx;
  line-height: 40rpx;
  color: #BDBDBD;
  font-size: 28rpx;
}
.like-selected{
  width: 68rpx;
  height: 48rpx;
  line-height: 48rpx;
  font-size: 34rpx;
  color: #2570D9;
  font-weight: 530;
  margin-left: 40rpx;
}
.underline{
  width: 28rpx;
  height: 2rpx;
  border: 2rpx solid #2570D9;
  border-radius: 20rpx;
  background-color: #2570D9;
  position: absolute;
  left: 310rpx;
  /* left: 420rpx; */
  top: 70rpx;
  transition:all 0.3s ease;
}
</style>