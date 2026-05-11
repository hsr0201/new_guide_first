<script setup>
import { ref } from 'vue'
import AppTopBar from '../components/figma/AppTopBar.vue'
import RecommendGuideSection from '../components/figma/RecommendGuideSection.vue'
import FavoriteGuidesSection from '../components/figma/FavoriteGuidesSection.vue'

/** 推荐向导有值态示例（Figma 3827:68628）；改为 [] 即空态 */
const recommendGuides = ref([
  {
    id: 'r1',
    name: '林为茂',
    serveText: '为您服务过7次',
    avatarUrl: '/figma-assets/recommend-guide-avatar.png',
  },
  {
    id: 'r2',
    name: '林为茂',
    serveText: '为您服务过7次',
    avatarUrl: '/figma-assets/recommend-guide-avatar.png',
  },
  {
    id: 'r3',
    name: '林为茂',
    serveText: '为您服务过7次',
    avatarUrl: '/figma-assets/recommend-guide-avatar.png',
  },
])

function onRecommendRefresh() {
  // 预留：请求换一批推荐接口后更新 recommendGuides
}

function onRecommendOpenGuide(g) {
  // 预留：跳转向导详情或打开抽屉
  void g
}

/** 侧栏项：文案来自 Figma 3827:67965、3827:67977 等节点抽样，其余为占位便于扩展 */
const sideNav = [
  { id: 'cube', label: '定制魔方', active: false, expandable: true },
  { id: 'procure', label: '用车采购', active: false, expandable: true },
  { id: 'more', label: '常用向导库', active: true, expandable: true },
  { id: 'placeholder1', label: '订单管理', active: false, expandable: false },
  { id: 'placeholder2', label: '数据中心', active: false, expandable: false },
]
</script>

<template>
  <div class="page" data-node-id="3827:67933">
    <AppTopBar />
    <div class="shell">
      <aside class="sidebar" aria-label="侧栏导航">
        <nav class="side-nav">
          <button
            v-for="item in sideNav"
            :key="item.id"
            type="button"
            class="side-item"
            :class="{ 'side-item--active': item.active }"
          >
            <span class="side-item-label">{{ item.label }}</span>
            <span v-if="item.expandable" class="side-item-chevron" aria-hidden="true">›</span>
          </button>
        </nav>
      </aside>
      <main class="main">
        <div class="main-header" data-node-id="3827:68109">
          <h1 class="main-title" data-node-id="3827:68110">常用向导库</h1>
          <RouterLink class="main-demo-link" to="/payment-estimate">支付预估价页</RouterLink>
        </div>
        <div class="main-body">
          <RecommendGuideSection
            :guides="recommendGuides"
            @refresh="onRecommendRefresh"
            @open-guide="onRecommendOpenGuide"
          />
          <!-- 收藏常用向导：Figma 3827:68679，置于「推荐向导」模块下方 -->
          <FavoriteGuidesSection class="main-body-favorites" />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f4f5f7;
  color: #1d2129;
  font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: transparent;
}

.side-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.side-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  line-height: 22px;
  color: #1a1a1a;
  text-align: left;
}

.side-item:hover {
  background: rgba(255, 255, 255, 0.7);
}

.side-item--active {
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.side-item-label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.side-item-chevron {
  display: inline-block;
  transform: rotate(90deg);
  font-size: 12px;
  color: #999;
}

.main {
  flex: 1;
  min-width: 0;
  max-width: 960px;
}

.main-header {
  padding: 10px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.main-demo-link {
  font-size: 14px;
  font-weight: 500;
  color: #4e53e0;
  text-decoration: none;
}

.main-demo-link:hover {
  text-decoration: underline;
}

.main-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #000;
  line-height: 25px;
}

.main-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-body-favorites {
  flex-shrink: 0;
}
</style>
