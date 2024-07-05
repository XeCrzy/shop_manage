<script setup>
import { ref, reactive } from 'vue' 
import defaultAvatarURL from '/images/avatar-default.png' 
import { changeAdminPassword, changeAdminAvatar,uploadPictureURL } from '../../api' 
import notification from '../../utils/notification'
import useToken from '../../stores/token' 
import useAdmin from '../../stores/admin' 

const { admin, updateAdmin, removeAdmin } = useAdmin() 
const { token, removeToken } = useToken() 

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
 const submitForm = formAnt =>{
formAnt.validateFields() // 手动的表单验证事件
 .then(async valid => { // 异步函数 
 if (valid) { 
 await changeAdminPassword({ password: form.password })
 resetForm() 
 // 退出登录 
 removeToken() 
 removeAdmin() 
 router.push({ name: 'login' }) 
message({
  type:'warning',
  data:'密码修改成功！请重新登录'
 })
 } else { 
 message({
  type:'error',
  data:'表单错误！'
 }) 
 } 
 }) 
 } 



const resetForm = () => { 
 ruleFormRef.value.resetFields(); 
} 
 
const submitUpload = async () => {
   try {
    // 调用上传文件的 API
    const response = await uploadRef.value.submit();
    // 处理上传成功的响应
    uploadSuccess(response);
  } catch (error) {
    // 处理上传失败的错误
    notification({
      message: '上传失败',
      type: 'error'
    });
  }

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

import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
const fileList = ref([]);
const loading = ref(false);
const imageUrl = ref('');
const handleChange = info => {
   if (info.file.status === 'done') {
    if (info.file.response.errno === 0) {
     form.picture = info.file.response.data.savepath
    } else {
     notification({
      message: info.file.response.errmsg,
      type: 'error'
     })
    }
   }
}



</script>

<template> 
<div class="setting_content">
  <div class="touxiang_message">
    <div class="box_card">
      <h2 style="text-align: center; height: 40px; line-height: 40px;">头像信息</h2>
      <hr>
      <div class="touxiang_content">
  <div class="avatar">
  <a-space>
    <a-avatar shape="square" :size="50" :src="avatarURL">
    </a-avatar>
  </a-space>
  </div>
  <a-upload 
      v-model:file-list="fileList"
      ref="uploadRef" 
       :action="uploadURL"
       :headers="headers" 
        :data="uploadData"
        :multiple="false"
        :on-success="uploadSuccess"

        >
       <a-button title="图片文件大小不超过500KB"><upload-outlined></upload-outlined>选择图片</a-button>
      </a-upload>
      <a-button type="success" @click="submitUpload">上传头像</a-button>

      </div>
    </div>
  </div>
<div class="geren_message">
    <div class="person_header">
    <h2 style="height: 40px; line-height: 40px; text-align: center;">个人信息</h2>
    <hr>
  <div style="margin-top: 50px;  display: flex; justify-content: center; align-items: center; height: 100%;" class="person_content">
      <div class="form_content">
    <a-form :model="form"
    ref="ruleFormRef"
    :rules="rules"
   
    @validate="handleValidate"
    @finishFailed="handleFinishFailed"
    >
  <a-form-item
      label="密码"
      name="password"
      
    >
      <a-input-password v-model:value="form.password" />
    </a-form-item>
      <a-form-item
      label="密码"
      name="password2"
      
    >
      <a-input-password v-model:value="form.password2" />
    </a-form-item>
    <a-form-item style="margin-top: 30px; text-align: center ; width: 100%">
      <a-button type="primary" html-type="submit" @click="submitForm(ruleFormRef)">提交</a-button>
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
.setting_content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.touxiang_message {
  width: 40%;
  height: 60%;
  background-color: #fff;
}
.geren_message {
  width: 55%;
  height: 60%;
  background-color: #fff;
}

.text_content{
  margin-top: 50px;
}


.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>