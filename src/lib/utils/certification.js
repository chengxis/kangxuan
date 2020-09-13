/**
 * 这里存放了头像认证，手机认证，login时获取到的一些信息，以及判断用户是否进行了头像、手机授权
 * 
 */
import $global from '../global/global'
import request from './request'


export function login(){
  //login函数实现的功能是当用户进入首页或者被邀请进入时，
  //获取api_token,并且根据api_token获取用户昵称，头像，是否授权登录及brand_id
  return new Promise((resolve,rejecct)=>{
    wx.login({
      success: function(res){
        if(res.code){
          $global.setCode(res.code)
          // console.log("测试点code",res.code)
          wx.request({
            url: 'https://wx.sc-edu.com/knsh/login/',
            data: {
              code:$global.code
            },
            method: 'POST', 
            header: {'content-type': 'application/x-www-form-urlencoded'},       
            success: function(res){         
              resolve(res.data.data)
              // console.log("certification.js中login函数的输出",res)          
              $global.setToken(res.data.data.api_token)
              $global.setUserNickName(res.data.data.nick_name)
              $global.setUserAvatar(res.data.data.avatar)
              $global.setUserPhone(res.data.data.mobile)
              $global.setBrandId(res.data.data.brand_id)
              //设置用户身份
              $global.setIdentity(res.data.data.type)
              // console.log("测试点",$global.kingarten_info.identity)
              //若$global中的is_bind为空，有两种情况，（1）用户未登录授权；（2）用户已登录授权，退出小程序时global值被清空，下面是为了排除第二种情况
              if($global.is_bind === ''){
                $global.setIsBind(res.data.data.is_oauth && res.data.data.is_phone)
              }else if($global.is_bind === 0) {
                console.log("用户未进行头像认证或手机号认证")
              }
                      
            },
            fail: function() {
              rejecct("获取数据失败")
              console.log("获取数据失败")
            }
          })
        }    
      }
    })   
  })
}

export function isAuthentication(){
  return new Promise((resolve,rejecct)=>{
    //判断用户是否进行了头像、手机授权
    wx.getSetting({
      success:(res)=>{
        //判断是否进行了头像授权
        if(!res.authSetting['scope.userInfo'] || $global.user_info.avatar===''){
          //如果返回0代表用户头像未授权
          resolve(0)
        }else{
          // console.log(res)
          //判断是否进行了手机授权，如果返回true 或 false 则代表手机号未授权
          if($global.is_bind===1) resolve(true)
          else resolve(false)
        }
      }
    })
  })
}

  

export async function getUserInfo(e){
  //获取用户的昵称和头像信息
  var that = this 
  // console.log(e)   
  $global.setUserAvatar(e.mp.detail.userInfo.avatarUrl)
  $global.setUserNickName(e.mp.detail.userInfo.nickName)
  let body_data = {
    api_token:$global.token,
    avatar:$global.user_info.avatar,
    nick_name:$global.user_info.nickName
  }
  let result = await request('/oauth/',body_data,'POST',{'content-type':'	application/x-www-form-urlencoded'})
  // console.log("登录将头像，昵称传到服务器",result)
  if(result.state === 1) return true
}

export async function getPhoneNumber(res){
  if(res.mp.detail.errMsg == 'getPhoneNumber:fail user deny'){
    $global.setIsBind(0)
    return false
  }else{
    //判断传过来的res中是否有api_token属性，如果有api_token说明是受邀请来的用户
    let bodyData = ''
    if(res.hasOwnProperty('api_token')){
      console.log("该用户是被邀请来的")
      bodyData = {
        api_token:$global.token,
        encryptedData:res.mp.detail.encryptedData,
        iv:res.mp.detail.iv,
        invite_token:res.api_token
      }
    }else {
      console.log("不是被邀请来的")
      bodyData = {
        api_token:$global.token,
        encryptedData:res.mp.detail.encryptedData,
        iv:res.mp.detail.iv
      }
    }
    // 用户确定手机授权并将手机号发送给服务器
    let result = await request('/phone/',bodyData,'POST')
    console.log("手机认证",result)
    if(result.state === 1){
      $global.setIsBind(1)
      $global.setUserPhone(result.data.mobile)
      //设置手机注册完成后增加的积分值
      return {
        isGetPhoneNumber:true,
        point:result.data.point
      }     
    }else{
      wx.showToast({
        title:'短信验证失败',
        icon:'none'
      })
      $global.setIsBind(0)
      return false
    }
    
  }
}



