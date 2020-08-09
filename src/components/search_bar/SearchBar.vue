<template>
<div class="search-bar">
  <!-- 搜索栏未展开 -->
  <div class="unselected" v-if="!isSearch" >
    <icon type="search" class="ico-search-unslected" size="20" />
    <text class="search-content-unslected" @tap="onFocus">
      搜索课程和关键字
    </text>
  </div>
  <!-- 搜索栏展开 -->
  <div class="selected" v-if="isSearch" > 
    <!-- 搜索栏 -->
    <icon type="search" class="ico-search-slected" size="20" />
    <input type="text" class="search-content-selected"  placeholder="搜索课程或关键字" 
     v-model="searchContent" confirm-type="搜索" @confirm="handleSearch" focus/>
    <text class="search-cancle" @tap="unFocus">取消</text>
    <!-- 历史记录与热门搜索 -->
    <div class="search-list" v-if="!isResult">
        <div class="search-box" v-if="isHistory">
          <div class="search-title" >搜索历史</div>
          <div class="search-item-box">
            <div class="search-item" v-for="item in history_list" :key="item" @click="clickHistorySearchItem(item)">{{item.search}}</div>
          </div>
        </div>
        <div class="search-box">
          <div class="search-title">热门搜索</div>
          <div class="search-item-box">
            <div class="search-item" v-for="item in hot_list" :key="item" @click="clickHotSearchItem(item)">{{item.title}}</div>
          </div>
        </div>
    </div>
    <!-- 搜索结果 -->
    <div class="search-list" v-if="isResult">
      <div class="search-box">
          <div class="search-title">搜索结果</div>
          <div class="search-item-box">
            <div class="search-item" v-for="item in searchResult_list" :key="item" @click="goDetail(item)">{{item.title}}</div>
          </div>
        </div>
    </div>
  </div>
</div>
  
</template>


<script>
export default {
  data () {
    return {
      isSearch: false,
      isResult: false,
      isHistory: true,
      searchContent: '',//搜索内容
      historyWords: ['园长管理成长营', '教师能力成长营', '线上课', '直播课'],
      history_list: [],//历史搜索
      hot_list:[],//热门搜索
      searchResult_list:[],//搜索结果
    }
  },
  mounted () {
    var that = this
    // 获取历史和热门搜索记录
    wx.request({
        url: 'https://wx.sc-edu.com/knsh/search/init/',
        method:'POST',
        header:{
          'content-type':"application/x-www-form-urlencoded"
        },
        data: {
          api_token: "8c1eIPCvBusNPV2vpDEleaBNDSHlpephjhxy2njk",
        },
        success(res){       
          // console.log(res) 
          that.history_list = res.data.data.history
          that.hot_list = res.data.data.hot_search
          if(res.data.data.history.length==0){
            that.isHistory = false
          }       
        }
    })
  },
  methods: {
    onFocus () {
      this.isSearch = !this.isSearch
      console.log('产生焦点')
    },
    unFocus () {
      this.isSearch = !this.isSearch
      this.searchContent = ''
    },
    handleSearch () {
      //async handleSearch
      var that = this
      console.log('搜索内容为:',this.searchContent)
      this.goSearch(this.searchContent)  
      // let data = {req:this.searchContent}
      // let result = await request('http://',data)   
    },
    goSearch(content){
      var that = this
      wx.request({
        url: 'https://wx.sc-edu.com/knsh/search/search/',
        method:'POST',
        header:{
          'content-type':"application/x-www-form-urlencoded"
        },
        data: {
          api_token: "8c1eIPCvBusNPV2vpDEleaBNDSHlpephjhxy2njk",
          title: content
        },
        success(res){       
          console.log(res) 
          that.searchResult_list = res.data.data.list    
          if(res.data.data.list.length==0){
            wx.showToast({
              title:'未找到相关内容',
              icon:'none',
              duration: 2000
            })
          }else{
            that.isResult = true
          } 
        }
      })
    },
    clickHistorySearchItem(historyItem){
        var that = this
        console.log("历史记录搜索",historyItem.search)
        this.searchContent = historyItem.search
        this.goSearch(historyItem.search)
    },
    clickHotSearchItem(hotItem){
        var that = this
        console.log("热门搜索",hotItem.title)
        this.searchContent = hotItem.search
        this.goSearch(hotItem.title)
    },
    goDetail(resultItem){
      wx.navigateTo({
        url:'/pages/course/children/courseDetail/main?cid='+resultItem.course_id
      })
    }
  }
}
</script>

<style>
page{
  width: 100%;
  background: #fdfdfd;
}

.search-bar{
  height:72rpx;
  /* width: 100%; */
  margin: 40rpx 0 20rpx 10rpx;

}
.unselected{
  /* width: 100%; */
  background-color: white;
  position: relative;
  line-height: 72rpx;

 
}
.search-content-unslected{
  height: 45rpx;
  background-color: #F2F2F2;
  position:absolute;
  left: 4.27%;
  right: 4.27%;
  height: 72rpx;
  border-radius: 54rpx;
  padding-left: 28%;
  font-family:PingFang SC;
  color: #808080;
  left: 20rpx;
  line-height: 72rpx;
 
}

.ico-search-unslected{  
  position:absolute;
  left:22%;
  z-index: 1;
  top:17rpx;
  
}

.selected{
  background-color: white;
  position: relative;
  height: 72rpx;
  line-height: 72rpx;
}

.ico-search-slected{ 
  position:absolute;
  left:5%;
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
  width: 550rpx;
  height: 72rpx;
}

.search-cancle{
  position: absolute;
  width: 100rpx;
  height: 40rpx;
  line-height: 40rpx;
  font-family:PingFang FC;
  top:20rpx;
  left: 663rpx;
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
  margin:35rpx;
  flex-direction:column;
}
.search-title{
  display: flex;
  font-size: 48rpx;
  line-height: 66rpx;
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
  margin: 6rpx 24rpx;
  padding: 6rpx 12rpx;
  display: flex;
  font-size: 33rpx;
  line-height: 45rpx;
  color: #4F4F4F;
}
</style>