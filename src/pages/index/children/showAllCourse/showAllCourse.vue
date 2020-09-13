<template>
  <div id="container">
    <SearchBar ></SearchBar>
    <div class="modalMask" v-if="showType"></div>
    <div id="choose-bar">
      <div class="choose-item" @click="handleShowType()">
        <span :class="sortType!='0'||showType ? 'choose-text-selected':''">{{type}}</span>
        <span class="arrow-box">
          <img class="choose-arrow single-arrow" 
          :src="sortType!='0'||showType ? 'https://cdn.sc-edu.com/img/2020/08/11/13/dfd73cb887012d288a324dec29d5d447.png':'https://cdn.sc-edu.com/img/2020/08/11/13/bdd95acbd1ff318689c57358db739da2.png'" >
        </span>       
      </div>
      <div class="choose-item" @click="handleSortSales()">
        <span :class="sortSales=='0'?'':'choose-text-selected'">销量</span>
        <span class="arrow-box">
          <img class="choose-arrow arrow-up" 
          :src="sortSales=='1'?'https://cdn.sc-edu.com/img/2020/08/11/13/5fa0459e9874be1e46b947dabbe1f02b.png':'https://cdn.sc-edu.com/img/2020/08/11/13/d147d0e714341d73a4ab67f728a586a4.png'" >
          <img class="choose-arrow arrow-down" 
          :src="sortSales=='-1'?'https://cdn.sc-edu.com/img/2020/08/11/13/dfd73cb887012d288a324dec29d5d447.png':'https://cdn.sc-edu.com/img/2020/08/11/13/bdd95acbd1ff318689c57358db739da2.png'" >
        </span>
      </div>       
      <div class="choose-item" @click="handleSortPrice()">
        <span :class="sortPrice=='0'?'':'choose-text-selected'">价格</span>
        <span class="arrow-box">
          <img class="choose-arrow arrow-up" 
          :src="sortPrice=='1'?'https://cdn.sc-edu.com/img/2020/08/11/13/5fa0459e9874be1e46b947dabbe1f02b.png':'https://cdn.sc-edu.com/img/2020/08/11/13/d147d0e714341d73a4ab67f728a586a4.png'" >
          <img class="choose-arrow arrow-down" 
          :src="sortPrice=='-1'?'https://cdn.sc-edu.com/img/2020/08/11/13/dfd73cb887012d288a324dec29d5d447.png':'https://cdn.sc-edu.com/img/2020/08/11/13/bdd95acbd1ff318689c57358db739da2.png'" >
        </span>
      </div>
    </div>

    <div v-if="showType" id="choose-type-bar">
      <div id="mask"></div>
      <div id="choose-type-list">
        <div class="choose-type-item" @click="handleSortType('0')">全部课程</div>
        <div class="line"></div>
        <div class="choose-type-item" @click="handleSortType('1')">线上课</div>
        <div class="line"></div>
        <div class="choose-type-item"  @click="handleSortType('2')">直播课</div>
        <div class="line"></div>
        <div class="choose-type-item"  @click="handleSortType('3')">面授课</div>
        <div class="line"></div>
        <div class="choose-type-item"  @click="handleSortType('4')">课程包</div>
      </div>
    </div>
   
    <div id="lesson">
      <div id="lesson-list">
        <div id="lesson-content" v-for="(item,index) in allCourse" :key="item" > 
          <div class="click-area-1" @click="seeCourseDetail(item)"></div> 
          <div class="click-area-2" @click="seeCourseDetail(item)"></div>       
          <div id="lesson-show">
           <img id="lesson-pic" :src="allCourse[index].img_url">
           <span class="course-type">{{item.type_text}}</span>
           <!-- <span class="course-type">线上课</span> -->
          </div>
          <div id="lesson-info">
            <div id="lesson-title">  
              {{allCourse[index].title}}
            </div>
          <div class="expand-select-area" @tap=handleLove(item)>
            <img class="iconfont-hellowlove"  
            v-show="!item.is_prefer"
            src="https://cdn.sc-edu.com/img/2020/09/03/10/ce9e78e105e98f68b5ce33872acf8ea5.png">
            <img class="iconfont-solidlove" v-show="item.is_prefer"
            src="https://cdn.sc-edu.com/img/2020/09/03/10/80011ac1c2870f54a0b1a1c17dc8d051.png">
          </div>  
          </div>
          <div id="other-information">
            <span class="lesson-people">{{allCourse[index].number+"人开通"}}</span>
            <span class="lesson-price">{{"￥"+allCourse[index].price+"/年"}}</span>
          </div>
        </div>
      </div>      
    </div>
    
  </div>
  
</template>

<script>
import NavClassList from '../../../../components/nav_class_list/NavClassList'
import SearchBar from '../../../../components/search_bar/SearchBar'
import request from '../../../../utils/request'
export default {
   components: {
    NavClassList,
    SearchBar
  },
  data(){
    return{
      allCourse:[],
      sortPrice: '0',
      sortSales: '0',
      sortType: '0',
      is_ascend: '0',
      showType: false,
      type:'全部课程',
      // cIsModel:false//增加蒙版
      refresh:false//设置一个刷新字段，当用户将某个课程置为喜欢时，退出到课程页面时喜欢页面应自动刷新

    }
  },
  mounted(){
    // this.allCourse = allCourse
    this.getLessonList()

       
  },
  methods:{
    getUrl(){
      if(this.sortType!='0'){
        return '/courselist/type/'
      }         
      else if(this.sortSales!='0'){
        this.is_ascend = this.sortSales
        return '/courselist/sale/'
      }   
      else if(this.sortPrice!='0'){
        this.is_ascend = this.sortPrice
        return '/courselist/price/'
      }   
      else{
        return '/courselist/total/'
      }
    },
    async getLessonList(){
      var that = this
      var requestUrl = this.getUrl()
      let current_data = {
        api_token: this.$global.token,//'8c1eIPCvBusNPV2vpDEleaBNDSHlpephjhxy2njk'
        type: this.sortType, // 课程类别
        is_ascend: this.is_ascend, // 价格、销量排序
      }
      let information = await request(requestUrl,current_data,'POST')
      console.log("全部课程",information)
      that.allCourse = information.data.list
      for(let index in that.allCourse){
        if(that.allCourse[index].type==1) that.allCourse[index].type_text = "线上课"
        else if(that.allCourse[index].type==2) that.allCourse[index].type_text = "直播课"
        else if(that.allCourse[index].type==3) that.allCourse[index].type_text = "面授课"
        else that.allCourse[index].type_text = "课程包"
      }
    },
    handleShowType(){
      // console.log("哈哈哈")
      this.showType = !this.showType
      // this.cIsModel = !this.cIsModel
    },
    handleSortType(chooseType){
      this.sortType = chooseType
      if(chooseType==='0') this.type = '全部课程' 
      else if(chooseType==='1') this.type = '线上课' 
      else if(chooseType==='2') this.type = '直播课'
      else if(chooseType==='3') this.type = '面授课'
      else this.type = '课程包'
      this.sortSalse = '0'
      this.sortPrice = '0' 
      this.getLessonList()
      this.showType = false
    },
    handleSortSales(){
      this.sortType = '0'
      this.sortPrice = '0'
      if(this.sortSales=='0') this.sortSales = '1'
      else if(this.sortSales=='1') this.sortSales = '-1'
      else if(this.sortSales=='-1') this.sortSales = '0'
      this.is_ascend = this.sortSales
      this.getLessonList()
    },
    handleSortPrice(){
      this.sortType = '0'
      this.sortSales = '0'
      if(this.sortPrice=='0') this.sortPrice = '1'
      else if(this.sortPrice=='1') this.sortPrice = '-1'
      else if(this.sortPrice=='-1') this.sortPrice = '0'
      this.is_ascend = this.sortPrice
      this.getLessonList()
    },
    async handleLove(courseItem){
      console.log("点击喜欢或取消喜欢")
      courseItem.is_prefer = !courseItem.is_prefer
      if(courseItem.is_prefer){
        this.refresh = true
      }else{
        this.refresh = false
      }
      var that = this
      var requestUrl = ''
      // 设置接口地址(这里喜欢和不喜欢已经相反了)
      if(courseItem.is_prefer){
        requestUrl = '/prefer/add/'
      }else{
        requestUrl = '/prefer/del/'
      }   


      let current_data = {
        api_token: this.$global.token,//'8c1eIPCvBusNPV2vpDEleaBNDSHlpephjhxy2njk'
        course_id: courseItem.course_id,
      }
      let information = await request(requestUrl,current_data,'POST')
      console.log("操作结果",information)
    },
    seeCourseDetail(courseDetailItem){
      console.log(courseDetailItem)
      wx.navigateTo({
        url:'/pages/course/children/courseDetail/main?cid='+courseDetailItem.course_id+'&isPurchase=false'
      })
    }
  },
  onUnload(){
    // console.log("页面销毁")
    if(this.refresh){
      this.$global.setRefresh(true)
    }
  }
}
</script>

<style scoped>
.set-margin{
  height: 20rpx;
}
#choose-bar{
  position: absolute;
  /* margin-top:8rpx; */
  height: 88rpx;
  width:100%;  
  display:flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  line-height: 34rpx;
  color: #BDBDBD;
  z-index: 9999;
  background: #FFFFFF;
}
.choose-item{
  width:250rpx;
  text-align: center;
}
.choose-text-selected{
  color: #2570D9;
}
.arrow-box{
  position: relative;
}
.single-arrow{
  position:absolute;
  top:45%;
}
.arrow-up{
  position:absolute;
  top: 25%;
}
.arrow-down{
  position:absolute;
  top: 60%;
}
.choose-arrow{
  margin-left: 9rpx;
  height:8rpx;
  width:12rpx
}
#choose-type-bar{
  position: absolute;
  top: 200rpx;
  width:100%;
}
#mask{
  position: absolute;
  top: 10rpx;
  width:100%;
  /* height:10000rpx; */
  height:100%;
  background: rgba(0, 0, 0, 0.58);
  z-index: 100;
}
#choose-type-list{
  position: absolute;
  height:360rpx;
  width:100%;
  background: #FFFFFF;
  border-radius: 0px 0px 10px 10px;
  z-index: 9999;
  overflow: hidden;
}
.choose-type-item{
  font-size: 12px;
  line-height: 17px;
  color: #828282;
  margin: 20rpx 98rpx;
}
.line{
  width: 100%;
  opacity: 0.1;
  border: 1px solid #000000;
}
#lesson{
  position: absolute;
  top: 200rpx;
  width:100%;
  /* padding:16rpx; */
}
#lesson-list{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
#lesson-content{
  width:330rpx;
  height: 405rpx;
  background: #FFFFFF;
  box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.05);
  /* padding: 16rpx 16rpx; */
  padding: 16rpx 8rpx;
  margin:12rpx 12rpx;
}
.click-area-1{
  width: 250rpx;
  height: 424rpx;
  position: absolute;
  z-index: 50;
}
.click-area-2{
  width: 330rpx;
  height: 252rpx;
  position: absolute;
  z-index: 50;
}
#lesson-show{
  position: relative;
}
.course-type{
  height: 40rpx;
  background-color:rgba(1,1,1,.5);
  text-align: center;
  line-height: 40rpx;
  position: absolute;
  color: white;
  font-size: 20rpx;
  right: 22rpx;
  bottom: 22rpx;
  padding: 0 10rpx;
  border-radius: 4rpx;
}
#lesson-pic{
  width: 330rpx;
  height: 252rpx;
  /* background-color: chartreuse; */
}
#lesson-info{
  width: 330rpx;
  position:relative;
  height: 84rpx;
}
#lesson-title{
  width: 240rpx;
  /* background-color: darkkhaki; */
  /* text-align: center; */
  line-height: 42rpx;
  font-size: 30rpx;
  /* margin-left: 10rpx; */
  margin: 10rpx;
}
  .expand-select-area{
    width:50rpx;
    height: 50rpx;
    /* background-color: pink; */
    position: relative;
    left: 275rpx;
    bottom: 88rpx;

  }
  .iconfont-hellowlove{
    position: absolute;
    width: 50rpx;
    height: 50rpx;
    right: 4rpx;
    /* top: 4rpx; */

  }

  .iconfont-solidlove{
    position: absolute;
    width: 50rpx;
    height: 50rpx;
    right: 4rpx;
  }
#other-information{
  position: relative;

}
.lesson-people{
  position: absolute;
  line-height: 30rpx;
  font-size: 22rpx;
  color: #828282;
  left: 10rpx;
  margin-top: 18rpx;
}
.lesson-price{
  position:absolute;
  line-height: 26rpx;
  font-size: 24rpx;
  color: #FB2A36;
  right: 1rpx;
  font-weight: 550;
  top: 1rpx;
}
.modalMask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.5;
  overflow: hidden;
  z-index: 9000;
  color: #fff;
}

</style>