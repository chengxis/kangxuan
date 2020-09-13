<template>
  <div id="input-box">
    <div class="modalMask" v-if="cIsModel"></div>
    <div class="modalDialog" v-if="cChangeModel">
      <div class="modalContent">
        <p class="contentTip">请输入您要修改的姓名</p>
        <input type="text" 
        placeholder="请输入姓名" 
        class="nameStyle" v-model="name"
        maxlength="11"
        placeholder-style="margin-left:12rpx;color:#e2e2e2">
      </div>
      <div class="modalFooter">
        <div class="btnCancel" @tap="tapCancel">取消</div>
        <div class="btnConfirm" @tap="confirmSend">确定发送</div>
      </div>
    </div>
  </div>
  
</template>
<script>
export default {
  data(){
    return{
      name: '',
    }
  },
  props:{
    cChangeModel:Boolean,
    cIsModel:Boolean
  },
  methods:{
    // 打开输入手机号的模态框
    tapSendTele(){
      this.changeModel = !this.changeModel;
      this.isModel = !this.isModel;
    },
    //  弹框取消
    tapCancel(){
      console.log("点击取消")
      this.name = '';
      this.$emit("cancleTap")
    },
    //  确认发送
    confirmSend(){
      console.log("点击确定发送");
      this.$emit('confirmTap',this.name);
      this.name='';
    },
  }
  
}
</script>
<style scoped>
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
.modalDialog {
  box-sizing: border-box;
  width: 686rpx;
  height: 310rpx;
  overflow: hidden;
  position: fixed;
  z-index: 9999;
  background: #fff;
  margin: 500rpx 32rpx;
  border-radius: 16rpx;
}
.modalContent {
  box-sizing: border-box;
  display: flex;
  padding: 50px 53px;
  font-size: 36px;
  align-items: center;
  justify-content: center;
  flex-direction: column;

}
.contentTip{
  text-align: center;
  font-size: 32rpx;
  color: #333333;
  font-family: Ping Fang SC;
  line-height: 44rpx;
  margin-left: 32rpx;
  margin-top: -70rpx;
}
.nameStyle{
  width:622rpx;
  height: 80rpx;
  background: #FAFAFA;
  border-radius: 8rpx;
  line-height: 80rpx;
  box-sizing: border-box;
  /* padding-left: 12rpx; */
  font-size: 32rpx;
  margin-top: 24rpx;
  /* margin-left: 32rpx; */
  text-align: left;
  padding-left: 16rpx;
}
.modalFooter {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  width: 686rpx;
  line-height: 88rpx;
  margin-top: -60rpx;
  border-top: 2rpx solid #E5E5E5;
}
.btnCancel {
  width: 50%;
  font-size: 32rpx;
  color: #333;
  text-align: center;
  border-right: 1px solid #E5E5E5;
}
.btnConfirm {
  font-size: 32rpx;
  width: 50%;
  color: #508CEE;
  text-align: center;
}

</style>