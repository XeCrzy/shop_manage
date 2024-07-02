<template>
  <a-layout>
    <a-layout-header class="header">
      <Header></Header>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #333">
        <Aside></Aside>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
 
        <a-layout-content
          :style="{ background: ' #e9eef3', color: '#333', padding: '24px', margin: 0, minHeight: '100vh' }"
        >
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script setup>
import Header from '../components/Header.vue' 
import Aside from '../components/Aside.vue'
import * as echarts from 'echarts'
import { ref } from 'vue';
const selectedKeys1 = ref(['2']);
const selectedKeys2 = ref(['1']);
const openKeys = ref(['sub1']);
</script>
<style scoped>
.header{
  width: 100%;
  height: 64px;
  background: #fff;
  line-height: 64px;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
  

#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
</style>