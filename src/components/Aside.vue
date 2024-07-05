<template>
  <a-layout>
    <a-layout-sider width="200">
      <a-menu
        :defaultSelectedKeys="[currentActiveKey]"
        mode="inline"
        :style="{ height: '100%' }"
      >
        <!-- 首页 -->
        <a-menu-item key="index" @click="navigateTo('index')">
          <a-icon type="home" />
          <span>首页</span>
        </a-menu-item>
        <!-- 分类管理 -->
        <a-menu-item key="category" @click="navigateTo('category')">
          <a-icon type="appstore" />
          <span>分类管理</span>
        </a-menu-item>
        <!-- 商品管理 -->
        <a-menu-item key="goods" @click="navigateTo('goods')">
          <a-icon type="shopping-cart" />
          <span>商品管理</span>
        </a-menu-item>
        <!-- 个人中心 -->
        <a-menu-item key="setting" @click="navigateTo('setting')">
          <a-icon type="user" />
          <span>个人中心</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
  </a-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute ,useRouter} from 'vue-router';

const router = useRouter();
const route = useRoute();
const currentActiveKey = ref(route.name);

const navigateTo = (key) => {
  router.push({ name: key });
};
</script>

<style lang="scss" scoped>
.a-menu {
  border: 0 !important;
  .is-active {
    background: linear-gradient(90deg, #1493fa, #01c6fa) !important
  }
  a {
    text-decoration: none;
    color: white;
  }
}
</style>