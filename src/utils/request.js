export default function(url,data={},method='',header={}){
 return new Promise((resolve,reject)=>{
  wx.request({
    url:"https://wx.sc-edu.com/knsh"+url,
    data,
    method,
    header,
    success: res => {
      resolve(res.data)    
    },
    fail: err => {
      reject(err)
      
    }
  })
 })
}