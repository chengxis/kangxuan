export default{
  code:'',
  token:'',
  is_bind:0,//用户是否绑定了用户信息、手机号，0代表未绑定
  user_info:{
    avatar: '',
    nickName: '',
    phone: ''
  },
  kingarten_info:{//当前幼儿园信息
    brand_id:null,//当前机构的机构号
    name:'',//当前园长的姓名
    stu_range:'',//学生规模
    tea_range:'',//教师规模
    title:'',//幼儿园名称
    type:'',//幼儿园类型
    identity:'',//当前身份
    img:'',//当前幼儿园的图片
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
  setIndentity(indentity){
    this.kingarten_info.identity = this.indentity
  },
  setImage(image){
    this.kingarten_info.img = this.image
  }
  
}