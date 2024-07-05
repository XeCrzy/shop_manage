<script setup>
import { ref, reactive } from 'vue' 
import defaultAvatarURL from '/images/avatar-default.png' 
import { changeAdminPassword, changeAdminAvatar,uploadPictureURL } from '../../api' 
import notification from '../../utils/notification'
import useToken from '../../stores/token' 
import useAdmin from '../../stores/admin' 
import router from '../../router'
const { admin, updateAdmin, removeAdmin } = useAdmin() 
const { token, removeToken } = useToken() 
const headers = { jwt: token }
const form = reactive({ 
 password: '', 
 password2: '' 
})

const avatarURL = ref(admin.avatar || defaultAvatarURL) 
const ruleFormRef = ref() 
const uploadRef = ref()

const uploadURL = uploadPictureURL()
const uploadData = { type: 'admin_avatar' }

// 修改密码 
const submitForm = async () => {
  try {
    // 使用Promise形式进行表单验证
    const valid = await ruleFormRef.value.validate();

    if (valid) {
      // 表单验证通过后的操作
      await changeAdminPassword({ password: form.password });

      resetForm();
      removeToken();
      removeAdmin();
      router.push({ name: 'login' });

      notification({
        message: '修改密码后，请重新登录',
        type: 'warning'
      });
    } else {
      notification({
          message: '表单填写有误，请检查输入',
          type: 'error'
        });
      // 表单验证未通过，这里通常不需要额外处理，因为错误信息会在表单项下自动展示
      // 但可以根据需要添加额外的通知或逻辑
    }
  } catch (error) {
    // 捕获并处理任何可能出现的异常
    console.error("Error during form submission:", error);
    notification({
      message: '提交过程中发生错误，请重试',
      type: 'error'
    });
  }
}



const resetForm = () => { 
 ruleFormRef.value.resetFields(); 
} 
 
const submitUpload = () => {
  if (!file.value) {
    notification({
      message: '请先选择一个文件',
      type: 'warning'
    })
    return
  }

  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('type', uploadData.type)

  fetch(uploadURL, {
    method: 'POST',
    headers,
    body: formData,
  })
    .then(response => response.json())
    .then(response => {
      uploadSuccess(response)
    })
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
  file.value = null
  fileName.value = ''
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
const fileInput = ref()
const fileName = ref('')
const file = ref(null)


const triggerUpload = () => {
  fileInput.value.click()
}
const handleFileChange = (event) => {
  const selectedFile = event.target.files[0]
  if (selectedFile) {
    fileName.value = selectedFile.name
    file.value = selectedFile
  }
}

</script>

<template> 
<div class="setting_content">
  <div class="touxiang_message">
     <a-card class="box-card">
        <template #title>
          <div class="card-header" style="text-align: center;"><h2>头像信息</h2></div>
          
        </template>
        
        <div class="text item">
          <div class="avatar">
            <a-avatar shape="square" :size="100" :src="avatarURL" />
          </div>
          <div class="button-group">
            <a-button type="primary" @click="triggerUpload">选择头像</a-button>
            <input type="file" ref="fileInput" style="display: none;" @change="handleFileChange" />
            <a-button type="success" @click="submitUpload">上传头像</a-button>
            <div v-if="fileName" class="file-name">{{ fileName }}</div>
          </div> 
        </div>
      </a-card>
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
      label="修改密码"
      name="password"
      
    >
      <a-input-password v-model:value="form.password" />
    </a-form-item>
      <a-form-item
      label="请在此输入密码"
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
.avatar {
  text-align: center;
}
.upload-demo {
  text-align: center;
}
.box-card {
  height: 316px;
}
.change-password-box {
  padding-top: 38px;
}
.file-name {
  margin-top: 10px;
  color: #888;
  text-align: center;
}
.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
</style>