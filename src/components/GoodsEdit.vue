<template> 

  <a-form ref="formRef" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
    <!-- 商品名称 -->
    <a-form-item label="商品名称" name="name">
      <a-input v-model:value="form.name" placeholder="请填写商品名称" />
    </a-form-item>

    <!-- 商品分类 -->
    <a-form-item label="分类名称" name="category_id">
      <a-select v-model:value="form.category_id" placeholder="请选择二级分类名称">
        <a-select-opt-group v-for="category in categoryList" :key="category.id" :label="category.name">
          <a-select-option v-for="item in category.children" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select-opt-group>
      </a-select>
    </a-form-item>
    <!-- 商品价格 -->
    <a-form-item label="商品价格" name="price">
      <a-input v-model:value="form.price" placeholder="请填写商品价格" />
    </a-form-item>
    <!-- 商品图片 -->
       <!-- 商品图片 -->
    <a-form-item label="商品图片">
      <input type="file" @change="handleFileChange" accept="image/*" />
      <div class="ant-upload__tip">图片文件大小不超过500KB</div>
    </a-form-item>
    <!-- 商品相册 -->
    <a-form-item label="图片相册" name="album">
      <input type="file" multiple @change="handleAlbumChange" accept="image/*" />
    </a-form-item>

    <!-- 商品库存 -->
    <a-form-item label="商品库存" name="stock" style="width: 92%">
      <a-input v-model:value="form.stock" placeholder="请填写库存数量" />
    </a-form-item>

    <!-- 商品规格 -->
    <a-form-item label="商品规格" name="spec" style="width: 92%">
      <a-input v-model:value="form.spec" placeholder="请填写商品规格" />
    </a-form-item>

    <!-- 商品简介 -->
    <a-form-item label="商品简介" name="description" style="width: 92%" class="desc">
      <Editor :init="initEditor" v-model="form.description"></Editor>
    </a-form-item>

    <!-- 操作按钮 -->
    <a-form-item>
      <a-button type="primary" @click="editSubmit" v-if="form.id">修改</a-button>
      <a-button type="primary" @click="addSubmit" v-else>新增</a-button>
      <a-button @click="btnCancel">重置</a-button>
    </a-form-item>
  </a-form>



</template> 
 
<script setup> 
import { reactive, ref, onMounted } from 'vue'
import { getCategoryList, uploadPictureURL, getGoods, addGoods, editGoods } from '../api'
import useToken from '../stores/token'
import notification from '../utils/notification'


const props = defineProps({
  id: {
    type: Number
  }
})

const emit = defineEmits(['success'])

const form = reactive({
  id: props.id,
  name: '',
  category_id: '',
  price: '',
  picture: '',
  album: [],
  stock: '',
  spec: '',
  description: ''
})
const formRef = ref()
const categoryList = ref([])
const albumPreviewList = ref([])

const uploadURL = uploadPictureURL()
const { token } = useToken()
const headers = { jwt: token }

onMounted(() => {
  loadGoods()
})

const resetForm = id => {
  form.id = id
  btnCancel()
}

defineExpose({ resetForm })

const loadGoods = async () => {
  if (form.id) {
    const goods = await getGoods({ id: form.id })
    form.picture = goods.picture
    form.album = goods.album
    albumPreviewList.value = goods.album.map(item => `${uploadURL}/${item}`)
    Object.assign(form, goods)
  }
  const data = await getCategoryList()
  categoryList.value = convertToTree(data)
}

const convertToTree = data => {
  const treeData = []
  const map = {}
  for (const item of data) {
    map[item.id] = { ...item, children: [] }
  }
  for (const item of data) {
    const node = map[item.id]
    if (item.pid === 0) {
      treeData.push(node)
    } else {
      const parent = map[item.pid]
      parent.children.push(node)
    }
  }
  return treeData
}

// 新增商品
const addSubmit = async () => {
  const data = {
    name: form.name,
    category_id: form.category_id,
    price: form.price,
    picture: form.picture,
    album: form.album,
    stock: form.stock,
    spec: form.spec,
    description: form.description
  }
  console.log(data);
  if (await addGoods(data)) {
    emit('success')
  }
}

// 修改商品
const editSubmit = async () => {
  if (await editGoods(form)) {
    emit('success')
  }
}

// 重置表单
const btnCancel = () => {
  formRef.value.resetFields()
  form.picture = ''
  form.album = []
  albumPreviewList.value = []
  form.description = ''
  loadGoods()
}

// 处理单文件选择
const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (file && file.size <= 500 * 1024) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'goods_picture')
    try {
      const response = await fetch(uploadURL, {
        method: 'POST',
        headers: headers,
        body: formData
      })
      const result = await response.json()
      if (result.errno === 0) {
        form.picture = result.data.savepath
        notification({
          message: '上传成功',
          type: 'success'
        })
      } else {
        notification({
          message: result.errmsg,
          type: 'error'
        })
      }
    } catch (error) {
      notification({
        message: '上传失败',
        type: 'error'
      })
    }
  } else {
    notification({
      message: '图片文件大小超过限制',
      type: 'error'
    })
  }
}

// 处理多文件选择
const handleAlbumChange = async (event) => {
  const files = Array.from(event.target.files)
  const newAlbum = []
  const newAlbumPreview = []
  for (const file of files) {
    if (file.size <= 500 * 1024) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'goods_album')
      try {
        const response = await fetch(uploadURL, {
          method: 'POST',
          headers: headers,
          body: formData
        })
        const result = await response.json()
        if (result.errno === 0) {
          newAlbum.push(result.data.savepath)
          newAlbumPreview.push(URL.createObjectURL(file))
        } else {
          notification({
            message: result.errmsg,
            type: 'error'
          })
        }
      } catch (error) {
        notification({
          message: '上传失败',
          type: 'error'
        })
      }
    } else {
      notification({
        message: '图片文件大小超过限制',
        type: 'error'
      })
    }
  }
  form.album = form.album.concat(newAlbum)
  albumPreviewList.value = albumPreviewList.value.concat(newAlbumPreview)
}

import Editor from '@tinymce/tinymce-vue'

import 'tinymce/tinymce'
import 'tinymce/models/dom'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/plugins/image'

// 编辑器配置
let initEditor = {
  width: '100%',
  skin_url: '/tinymce/skins/ui/oxide',
  content_css: '/tinymce/skins/content/default/content.css',
  language_url: '/tinymce/langs/zh-Hans.js',
  language: 'zh-Hans',
  menubar: false,
  statusbar: false,
  toolbar: 'bold underline italic strikethrough image undo redo',
  plugins: 'image',
}
</script> 

<style scoped>
.album-preview img {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
.upload-demo {
  text-align: left;
  width: 91%;
}
</style>