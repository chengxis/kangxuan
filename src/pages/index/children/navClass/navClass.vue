<template>
  <div id="container">
    <div v-if="courseTypeNumber !== 5?true:false">
      <SearchBar></SearchBar>
      <NavClassList :cCourseItem="courseItem"></NavClassList>
    </div>
    <!-- 如果type是直播课则进入直播课-->
    <div v-if="courseTypeNumber === 5?true:false" >
      <button @click="enterLive(item)" v-for="(item,index) in roomId" :key="index">
        进入{{item}}号直播间
      </button>
      <navigator 
      :url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id='+roomId+'&custom_params='+customParams">
      </navigator>
    </div>
    
         
  </div>
</template>
<script>
//:cCourseItem="courseItem"
import SearchBar from '../../../../components/search_bar/SearchBar'
import NavClassList from '../../../../components/nav_class_list/NavClassList'
import request from '../../../../lib/utils/request'
export default { 
  components: {
    SearchBar,
    NavClassList,
    
  },

  data () {
   return{
      courseType: '',
      courseTypeText: '',
      courseItem: [],
      roomId:[8,9,10,11,12,13,14,15,16,17],//直播的房间号
      customParams:'',
      courseTypeNumber:''
   }  

  },
  methods:{
    enterLive(roomId){
    // console.log("进入直播间",roomId)
    let customParams = encodeURIComponent(JSON.stringify({ path:'pages/index/children/navClass', pid: 1 }))
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
    })
    }

  },
  async mounted () {
    this.courseType = this.$mp.query.type
    // console.log("页面传值type",this.courseType)
    if(this.courseType === '线上课') this.courseTypeNumber = 1
    else if(this.courseType === '直播课') this.courseTypeNumber = 2
    else if(this.courseType === '面授课') this.courseTypeNumber = 3
    else if(this.courseType === 'ai推荐') this.courseTypeNumber = 4
    else this.courseTypeNumber = 5
   

    wx.setNavigationBarTitle({
      title: this.courseType
    })

   

    let current_data = {
      api_token:this.$global.token,
      type: this.courseTypeNumber,
    }
    console.log(current_data)
    let information = await request('/courselist/type/',current_data,'POST')
    console.log("测试这里",information)
    //对title字数做一个判断，若超过了8，则后面用...拼接
    for(let i of information.data.list){
      // console.log(i.title.length >= 8)
      if(i.title.length >= 9){
        i.title = i.title.substring(0,8) + '...'
      }
    }    
    this.courseItem = information.data.list;
  
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
  button{
    width: 686rpx;
    line-height: 88rpx;
    border-radius: 4rpx;
    background: #2570D9;
    color: #ffffff;
    font-family: Ping Fang SC;
    font-size: 32rpx;
    font-weight: 550;
    text-align: center;
    margin-bottom: 32rpx;
  }

  

</style>