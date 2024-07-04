<template> 
    <div class="setting">
       <div class="setting-box1">
           <div class="setting-title">
                <h2>头像信息</h2>
               <hr>
               <div class="avatar">
                 <a-space wrap :size="16">
                   <a-avatar  :size="50" :src="avatarURL"></a-avatar>
               </a-space>
               </div>
               <a-upload
               ref="uploadRef"
               class="upload-demo"
               :limit="1"
               :action="uploadURL"
               :headers="headers"
               :data="uploadData"
               :on-success="uploadSuccess">
               <p><a-button type="primary">选择头像</a-button></p>
               </a-upload>
               <div>
                 <a-button  type="primary" @click="submitUpload">上传头像</a-button>
                 </div>
                 <div class="el-upload__tip"><p>限制上传 1 个文件，且旧文件会被新文
                   件覆盖</p></div>
         </div>
       </div>
       <div class="setting-box2">
   
       </div>
    </div>
   </template> 
   <script setup>
   import { ref, reactive } from 'vue'
   import defaultAvatarURL from '/images/avatar-default.png'
   import {changeAdminPassword, changeAdminAvatar, uploadPictureURL } from '../../api'
   import useToken from '../../stores/token'
   import useAdmin from '../../stores/admin'
   const { admin,updateAdmin, removeAdmin } = useAdmin()
   const { token } = useToken()
   const headers = { jwt: token }
   const uploadURL = uploadPictureURL()
   const uploadData = { type: 'admin_avatar' }
   const form = reactive({
    password: '',
    password2: ''
   })
   const avatarURL = ref(admin.avatar || defaultAvatarURL)
   const ruleFormRef = ref()
   const uploadRef = ref()
   // 修改密码
   const submitForm = formEl => {
   }
   const resetForm = () => {
    ruleFormRef.value.resetFields();
   }
   const submitUpload = () => {
    uploadRef.value.submit()
   }
   // 上传成功
   const uploadSuccess = async response => {
    const { errno, errmsg, data } = response
    if (errno !== 0) {
    notification({
    message: errmsg,
    type: 'error'
    })
    } else {
    if (errmsg !== '') {
    notification({
    message: errmsg,
    type: 'success'
    })
    }
    await changeAdminAvatar({
    avatar: data.savepath
    })
    updateAdmin({
    avatar: data.url
    })
    avatarURL.value = data.url
    }
    uploadRef.value.clearFiles()
   }
   const validatePass = (rule, value, callback) => {
    if (value !== form.password) {
    callback(new Error('两次输入密码不一致！'))
    } else {
    callback()
    }
   }
   const rules = reactive({
    password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 24, message: '密码长度为 6~24 个字符', trigger: 'blur' },
    ],
    password2: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
    ]
   })
   </script>
   <style>
   .setting {
     display: flex;
     justify-content: space-between;
     width: 100%;
     height: 100%;
     background-color: #f5f5f5;    
   }
   .setting-box1 {
     width: 350px;
     height: 500px;
     background-color: #f5f5f5;
     border-radius: 10px;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
   }
   .setting-box2 {
     width: 540px;
     height: 500px;
     background-color: #f5f5f5;
     border-radius: 10px;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
   }
   .setting-title h2 {
     text-align: center;
     font-size: 24px;
     font-weight: bold;
     color: #333;
     line-height: 60px;
   }
   .avatar-uploader {
     margin: 10px 120px;
   }
   .btn{
     margin: 10px 100px;
    
   }
   .btn1{
     margin: 10px 10px;
   }
   </style>