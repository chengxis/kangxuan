<template>
  <div id="container">
    <button @click="enterLive">进入直播</button>
    <navigator :url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id='+roomId+'&custom_params='+customParams"></navigator>
  </div>
</template>
<script>
export default {
  data(){
    return{
      roomId:'',//直播的房间号
      customParams:'',
    }
  },
  methods:{
    enterLive(){
      console.log("进入直播间")
      let roomId = 8 // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
      let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/pages/course/children/Live', pid: 1 }))
      wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
      })
    }
      
  },
  onShow(){
    // let roomId = 7 // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
    // let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/pages/course/children/Live', pid: 1 }))
    // wx.navigateTo({
    //   url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
    //   })

  }
  
}
</script>
<style scoped>

</style>