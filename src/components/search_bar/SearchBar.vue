<template>
<div class="area"> 
  <div class="search-bar">
    <!-- 搜索栏未展开 -->
    <div class="unselected">
      <img src="https://cdn.sc-edu.com/img/2020/09/03/14/487150cb5a32e3829ad790de5f3d2afd.png"
          class="ico-search-unslected">
      <text class="search-content-unslected" @tap="onFocus">
        搜索课程和关键字
      </text>
    </div>
  </div>
</div> 
</template>
<script>
import request from '../../utils/request'
import {login} from '../../lib/utils/certification'
import NavClassList from '../../components/nav_class_list/NavClassList'
export default {
  data () {
    return {
  
    }
  },
  methods: {
    onFocus () {
      console.log('产生焦点')
      wx.navigateTo({
        url: '/pages/index/children/search/main'
      })
    },
  

  }
}
</script>

<style>
page{
  width: 100%;
  background: #fdfdfd;
}
.area{
  width: 750rpx;
  height: 120rpx;
  position: relative;
  z-index: 9999;
  background: white;
}

.search-bar{
  height:72rpx;
  position: relative;
  padding-top: 40rpx;

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
  font-size: 28rpx;
}
.ico-search-unslected{  
  position:absolute;
  left:24%;
  z-index: 1;
  top:17rpx;
  width: 40rpx;
  height: 40rpx;  
}


</style>