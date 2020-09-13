export default{
  code:'',
  token:'',
  is_bind:'',//用户是否绑定了用户信息、手机号，默认为空，代表未进行授权，若为0表示用户曾拒绝授权
  getBrandAgain:'',//判断是否需要重新请求机构的相关数据
  getLoginAgain:'',//判断是否需要重新请求登录接口的相关数据
  isUpdateKin:'',//判断是否是修改幼儿园
  refresh:false,//用来控制页面是否需要重新刷新数据
  isAuth:false,
  user_info:{
    avatar: '',
    nickName: '',
    phone: '',
    name:'',//用户的真实姓名，默认为空，表示没有更改姓名
  },
  hasEvaluateList:'',//判断是否需要重新获取测评题目，空代表需要，true代表不需要，目的是为了获取用户以前做题的选项
  hasCourseRecommand:'',//判断是否需要重新获取推荐列表，空和false代表需要，true代表不需要，
  kingarten_info:{//当前幼儿园信息
    brand_id:'',//当前机构的机构号，默认为空字符串，当为null时，代表未创建幼儿园
    name:'',//当前园长的姓名
    stu_range:'',//学生规模
    tea_range:'',//教师规模
    title:'',//幼儿园名称
    type:'',//幼儿园类型
    identity:'',//当前身份，1代表园长，0代表教师
    img:'',//当前幼儿园的图片
    resultId:''//若做过AI测试则返回测评的id
  },
  setCode(code){
    this.code = code
  },
  setToken(token){
    this.token = token
  },
  setUserInfo(user_info){
    this.user_info = user_info;
  },
  setUserAvatar(avatar){
    this.user_info.avatar = avatar;
  },
  setUserNickName(nickName){
    this.user_info.nickName = nickName;
  },
  setUserPhone(phone){
    this.user_info.phone = phone;
} ,
  setUserName(name){
    this.user_info.name = name
  },

  setIsBind(is_bind){
    this.is_bind = is_bind;
},
  setBrandId(brand_id){
    this.kingarten_info.brand_id = brand_id
  },
  setName(name){
    this.kingarten_info.name = name

  },
  setStuRange(stu_range){
    this.kingarten_info.stu_range = stu_range
  },
  setTeaRange(tea_range){
    this.kingarten_info.tea_range = tea_range
  },
  setTitle(title){
    this.kingarten_info.title = title
  },
  setType(type){
    this.kingarten_info.type = type
  },
  setIdentity(indentity){
    this.kingarten_info.identity = indentity
  },
  setImage(image){
    this.kingarten_info.img = image
  },
  setResultId(resultId){
    this.kingarten_info.resultId = resultId
  },
  setGetBrandAgain(getBrandAgain){
    this.getBrandAgain = getBrandAgain

  },
  setGetLoginAgain(getLoginAgain){
    this.getLoginAgain = getLoginAgain

  },
  setisUpdateKin(isUpdateKin){
    this.isUpdateKin = isUpdateKin
  },
  sethasEvaluateList(hasEvaluateList){
    this.hasEvaluateList = hasEvaluateList
  },
  setHasCourseRecommand(hasCourseRecommand){
    this.hasCourseRecommand = hasCourseRecommand

  },
  setRefresh(refresh){
    this.refresh = refresh
  },
  setIsAuth(isAuth){
    this.isAuth = isAuth
  }
 
}