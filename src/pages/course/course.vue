<template>
  <div id="containner">
    <SearchBar></SearchBar>
    <div id="choose-course">
      <span :class="isLike?'purchase-unselected':'purchase-selected'" @tap="handleChoosePurchase">已购</span>
      <span :class="isLike?'like-selected':'like-unselected'" @tap="handleChooseLike">喜欢</span>
      <span class="underline" :style="isLike?'left:408rpx':'310rpx'"></span>
    </div>
    <div class="showPurchaseCourse" v-show="!isLike">
      <ListNone v-if="noPurchaseCourse"
      :cdescribe="'您暂无购买课程'"
      :cpng="'https://cdn.sc-edu.com/img/2020/08/14/17/82e7731b458a0eca27dcfba862115d8b.png'"
      :curl="'/pages/index/children/showAllCourse/main'"
      :cbtnDescrib="'去看看'"></ListNone>
      <NavClassList :cCourseItem="purchaseCourse" ></NavClassList>

    </div>
    <div class="showLikedCourse" v-show="isLike">
      <ListNone v-if="noLikeCourse"
      :cdescribe="'您暂无喜欢课程'"
      :cpng="'https://cdn.sc-edu.com/img/2020/08/14/17/82e7731b458a0eca27dcfba862115d8b.png'"
      :curl="'/pages/index/children/showAllCourse/main'"
      :cbtnDescrib="'去看看'"></ListNone>
      <NavClassList :cCourseItem="likeCourse" :cisLike="isLike"
      @hanleNoCourse="handleNoCourse"></NavClassList>
    </div>
   
  </div>
  
</template>

<script>
////"navigationStyle": "custom",
import SearchBar from '../../components/search_bar/SearchBar'
import NavClassList from '../../components/nav_class_list/NavClassList'
import request from '../../lib/utils/request'
import ListNone from '../../components/list_none/ListNone'
export default {
  components: {
    SearchBar,
    NavClassList,
    ListNone
  },
  data(){
    return{
      isLike:false,//判断用户是否点击了喜欢列表/已购列表
      likeCourse:[],
      purchaseCourse:[],
      noPurchaseCourse:false,
      noLikeCourse:false
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    handleChoosePurchase(){
      this.isLike = false
      this.init_purchase_list()
    },
    handleChooseLike(){
      this.isLike = true
      this.init_like_list()    
    },
    handleNoCourse(){
      this.noLikeCourse = true

    },

    // 获取已购和喜欢列表
    init(){
      this.init_purchase_list()
      this.init_like_list()    
    },

    // 获取已购列表
    async init_purchase_list(){
      let current_data = {
        api_token:this.$global.token,
        brand_id:this.$global.kingarten_info.brand_id,
      }
      // console.log(current_data)
      let information = await request('/courselist/bought/',current_data,'POST')
      console.log("已购课程",information)
      this.purchaseCourse = information.data.list
      // 区分是否从已购课程列表进入
      if(this.purchaseCourse.length === 0){
        this.noPurchaseCourse = true
      }else{
        this.noPurchaseCourse = false
        this.handleData(this.purchaseCourse,true)
      }
     

    },

    // 获取喜欢列表
    async init_like_list(){
      let current_data = {
        api_token:this.$global.token,
      }
      let information = await request('/courselist/prefer/',current_data,'POST')
      console.log("收藏课程",information)
      this.likeCourse = information.data.list
      console.log(this.likeCourse,this.likeCourse)
      if(this.likeCourse.length === 0) this.noLikeCourse = true
      else {
        this.noLikeCourse = false
        this.handleData(this.likeCourse,false)
      }

    },
    handleData(data,purchase){
      for(let i of data){
        //若是已购课程，在列表后面加一个已购标识
        if(purchase) {
          i.isPurchase = true
          i.percent = parseInt(i.percent)
        }
        else i.isPurchase = false
        if(i.type === '1') i.type_text = "线上课"
        else if(i.type === '2') i.type_text = "直播课"
        else if(i.type === '3') i.type_text = "面授课"
        else i.type_text = "课程包"
        if(i.title.length >= 9){
          i.title = i.title.substring(0,8) + '...'
        }
      }

    }
  },
  onShow(){
    // console.log("onshow")
    if(this.$global.refresh){
      this.init_like_list() 

    }
    this.init_purchase_list()
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