<script setup>
import { ref, reactive } from 'vue' 
import { login } from '../api'
import { useRouter } from 'vue-router' 
import useToken from '../stores/token' 
import notification from '../utils/notification' 
 
const router = useRouter() 
const { updateToken } = useToken()

const handleFinish = values => {
  console.log(values, formState);
};
const handleFinishFailed = errors => {
  console.log(errors);
};
const handleValidate = (...args) => {
  console.log(args);
};

const message = notification('error') 
const form = reactive({ 
 username: '', 
 password: '' 
})
const ruleFormRef = ref() 
// 表单提交 
const submitForm=formAnt=>{
 // 前端验证
 formAnt.validateFields() // 手动的表单验证事件
 .then(async values => { // 异步函数
 
 const data=await login(values) // 登录向后端，提交表单信息 （返回用户token信息）
 // 验证token 是否存在
 
 if(data){
  updateToken(data.token)// 更新用户token
  router.push({name:'index'})// 首页跳转
 }else{
  message({
  type:'error',
  data:'密码填写错误！'
 })  
 }
 
 }) 
 .catch(errorInfo => { 
  //resetForm()//重置表单
  message({
   type:'error',
   data:'表单填写错误！'
  }) 
  console.log(errorInfo) 
 }); 
 
 
}

// 表单重置 
const resetForm = () => { 
 ruleFormRef.value.resetFields() 
}

const rules = reactive({ 
 username: [ 
 { required: true, message: '请输入用户名', trigger: 'blur' }, 
 { min: 3, max: 12, message: '用户名长度为 3~12 个字符', trigger: 'blur' }, 
 ], 
 password: [ 
 { required: true, message: '请输入密码', trigger: 'blur' }, 
 { min: 6, max: 24, message: '密码长度为 6~24 个字符', trigger: 'blur' }, 
 ]
 })

</script>

<template> 
<div class="login_content">
  <div class="login_bgcolor">
    <div class="login_container">
    <div class="login_title" style="margin-bottom: 100px">
      <div class="login_title">
            <h1>“微商城”后台管理系统</h1>
      </div>
        <div class="login_form">
    <a-form :model="form"
    ref="ruleFormRef"
    :rules="rules"
   
    @validate="handleValidate"
    @finishFailed="handleFinishFailed"
    >
      <a-form-item ref="username" label="用户名" name="username" style="line-height: 60px;" >
        <a-input style="height: 60px; font-size: 30px;" v-model:value="form.username" placeholder="请输入你的用户名" />
      </a-form-item>
      
    <a-form-item
      label="密码"
      name="password"
      style="line-height: 80x; height:90px; font-size: 24px;"
    >
      <a-input-password style="height: 50px;" v-model:value="form.password" />
    </a-form-item>

    <a-form-item style="margin-top: 50px; text-align: center ; width: 100%" >
      <a-button style="width: 100px;height: 50px;" type="primary" html-type="submit" @click="submitForm(ruleFormRef)">登录</a-button>
      <a-button type="link" @click="resetForm">重置</a-button>
    </a-form-item>
    </a-form>

  </div>
  </div>

    </div>

  </div>
  
  
</div>

</template> 

<style scoped>
.login_content {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #f0f2f5;
  background: rgba(38, 72, 176) url('/images/loginBg.jpg') center / cover
 no-repeat; 
}
.login_bgcolor{
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: center; */
  flex-wrap: wrap;
  width: 100%;
  width:40%;
  height:50%;
  background-color: #fff;
  border-radius: 20px;
}
.login_container{
  width: 100%;
  height: 100%;
  display: flex;
  /* flex-direction: column; */
  /* align-items: center; */
  justify-content: center;
}
.login_title{

width: 100%;
height: 200px;
text-align: center;
line-height: 200px;

}
.login_form{
  width: 80%;
  height: 50px;
  text-align: center;
  margin: 0 auto;
}
</style>

