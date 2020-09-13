<template>
  <div id="container">
    <div class="selected"> 
      <!-- 搜索栏 -->
      <img src="https://cdn.sc-edu.com/img/2020/09/03/14/487150cb5a32e3829ad790de5f3d2afd.png"
           class="ico-search-slected" >
      <input type="text" class="search-content-selected"  placeholder="搜索课程或关键字" 
      v-model="searchContent" confirm-type="搜索" @confirm="handleSearch" focus/>
      <text class="search-cancle" @click="unFocus">取消</text>
      <!-- 历史记录与热门搜索 -->
      <div class="search-list" v-if="!isResult">
          <div class="search-box" v-if="isHistory">
            <div class="search-title" v-if="isShowHisAndHot">搜索历史</div>
            <div class="search-item-box">
              <div class="search-item" v-for="item in history_list" :key="item" @click="clickHistorySearchItem(item)">{{item.search}}</div>
            </div>
          </div>
          <div class="search-box">
            <div class="search-title" v-if="isShowHisAndHot">热门搜索</div>
            <div class="search-item-box">
              <div class="search-item" v-for="item in hot_list" :key="item" @click="clickHotSearchItem(item)">{{item.title}}</div>
            </div>
          </div>
      </div>
    </div>
    <NavClassList v-if="isResult" :cCourseItem="searchResult_list"></NavClassList>
  </div>
</template>
<script>
import request from '../../../../lib/utils/request'
import {login} from '../../../../lib/utils/certification'
import NavClassList from '../../../../components/nav_class_list/NavClassList'
export default {
  data(){
    return{
      isResult: false,
      isHistory: true,
      searchContent: '',//搜索内容
      history_list: [],//历史搜索
      hot_list:[],//热门搜索
      searchResult_list:[],//搜索结果
      isShowHisAndHot:false,//是否显示历史搜索和热门搜索，主要用来做页面优化，等关键字出来后再显示历史搜索和热门搜索
    }
  },
  components:{
    NavClassList
  },
  async mounted () {
    var that = this
    // 获取历史和热门搜索记录
    await login()
    this.getSearchContent()   
  },
  methods:{
    unFocus () {
      console.log("点击取消")
      this.searchContent = ''
      this.isResult = false
      // console.log('失去焦点')
      this.getSearchContent()
    },
    handleSearch () {
      // console.log('搜索内容为:',this.searchContent)
      this.goSearch(this.searchContent)  
    },
    async goSearch(content){
      var that = this
      let current_data = {
        api_token:this.$global.token,
        title: content
      }
      let information = await request('/search/search/',current_data,'POST')
      this.searchResult_list = information.data.list
      // console.log("hahah",this.searchResult_list)  
      if(information.data.list.length === 0){
        wx.showToast({
          title:'未找到相关内容',
          icon:'none',
          duration: 2000
        })
      }else{
        that.isResult = true
        // console.log("哈哈哈",this.searchResult_list)
      } 
    },
    clickHistorySearchItem(historyItem){
      // console.log("历史记录搜索",historyItem.search)
      this.searchContent = historyItem.search
      this.goSearch(historyItem.search)
    },
    clickHotSearchItem(hotItem){
      // console.log("热门搜索",hotItem.title)
      this.searchContent = hotItem.search
      this.goSearch(hotItem.title)
    },
    goDetail(resultItem){
      wx.navigateTo({
        url:'/pages/course/children/courseDetail/main?cid='+resultItem.course_id
      })
    },
    async getSearchContent(){
      //获取热门搜索内容和历史搜索
      let current_data = {
        api_token:this.$global.token,
      }
      let information = await request('/search/init/',current_data,'POST')
      // console.log("获取搜索历史",information)
      this.history_list = information.data.history
      this.hot_list = information.data.hot_search
      this.isShowHisAndHot = true
      if(information.data.history.length === 0){
        this.isHistory = false
      } 
    }
  },
  onShow(){
    // console.log("搜索页面显示")
    this.searchContent = ''
  }
}
</script>
<style scoped>
.selected{
  background-color: white;
  position: relative;
  height: 72rpx;
  line-height: 72rpx;
  margin-top: 40rpx;
  margin-bottom: 40rpx;
}
.ico-search-slected{ 
  position:absolute;
  width: 40rpx;
  height: 40rpx;
  left:10%;
  z-index: 1;
  top: 20rpx; 
}  
.search-content-selected{
  background-color: #F2F2F2;
  position:absolute;
  top: 5.91%;
  border-radius: 54rpx;
  padding-left: 13%;
  font-family:PingFang SC;
  line-height: 72rpx;
  left: 4.27%;
  right: 4.27%;
  height: 72rpx;
  font-size: 28rpx;
}
.search-cancle{
  position: absolute;
  /* background: pink; */
  width: 100rpx;
  height: 40rpx;
  line-height: 40rpx;
  font-family:PingFang FC;
  top:20rpx;
  left: 633rpx;
  z-index: 2;
  color: #828282;
  font-size: 28rpx;
}
.search-list{
  position: absolute;
  height:5000rpx;
  width:100%;
  top:90rpx;
  z-index: 5;
  background-color: white;
  left: -10rpx;
}
.search-box{
  display: flex;
  margin:20rpx 0 20rpx 45rpx;
  flex-direction:column;
}
.search-title{
  display: flex;
  font-size: 28rpx;
  font-weight: bold;
  line-height: 44rpx;
  color: #333333;
}
.search-item-box{
  display: flex;
  flex-direction: row;
  flex-wrap:wrap;
}
.search-item{
  display: flex;
  flex-direction:row;
  background: #F2F2F2;
  border-radius: 20px; 
  margin: 24rpx 24rpx 24rpx 0;
  padding: 6rpx 12rpx;
  display: flex;
  font-size: 22rpx;
  line-height: 30rpx;
  color: #4F4F4F;
}
</style>