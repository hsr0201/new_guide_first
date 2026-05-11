<script setup>
/** 顶部导航 — 来自 Figma 节点 3827:67960（row），图片已落盘至 public/figma-assets */
/** 静态资源位于 public/figma-assets，构建后以站点根路径访问 */
const LOGO_PART = '/figma-assets/topbar-logo-mark.svg'
const IMG_VECTOR = '/figma-assets/topbar-divider.svg'
const IMG_CHEVRON = '/figma-assets/topbar-dropdown.svg'
const IMG_AVATAR = '/figma-assets/topbar-avatar.svg'

const navItems = [
  { label: '首页', active: true },
  { label: '全球包车', active: false },
  { label: '接送机', active: false },
  { label: '酒店', active: false },
  { label: '当地小团', active: false },
  { label: '全球机票', active: false },
  { label: '定制魔方', active: false },
]
</script>

<template>
  <header class="topbar" data-node-id="3827:67960">
    <div class="topbar-inner">
      <div class="topbar-left">
        <div class="brand">
          <img class="brand-mark" :src="LOGO_PART" width="32" height="32" alt="" />
          <div class="brand-text">
            <span class="brand-cn">小云智能</span>
            <span class="brand-en">XIAOYUN AI</span>
          </div>
        </div>
        <nav class="nav" aria-label="主导航">
          <button
            v-for="(item, i) in navItems"
            :key="i"
            type="button"
            class="nav-item"
            :class="{ 'nav-item--active': item.active }"
          >
            {{ item.label }}
          </button>
        </nav>
      </div>
      <div class="topbar-right">
        <div class="balance-pill">我的余额：￥12,232</div>
        <div class="divider" aria-hidden="true">
          <img :src="IMG_VECTOR" alt="" />
        </div>
        <button type="button" class="orders">
          <span>我的订单</span>
          <img class="orders-chevron" :src="IMG_CHEVRON" width="16" height="16" alt="" />
        </button>
        <img class="avatar" :src="IMG_AVATAR" width="32" height="32" alt="账户" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #e5e6eb;
  font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.topbar-inner {
  /* 与下方主内容区 max-width 对齐，避免顶栏与正文宽度不一致 */
  max-width: 1200px;
  margin: 0 auto;
  min-height: 54px;
  padding: 11px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  display: block;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-cn {
  font-size: 14px;
  font-weight: 600;
  color: #1d2129;
}

.brand-en {
  font-size: 10px;
  letter-spacing: 0.04em;
  color: #1d2129;
}

.nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-item {
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: #1d2129;
  padding: 0;
}

.nav-item:hover {
  color: #4e53e0;
}

.nav-item--active {
  color: #4e53e0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.balance-pill {
  background: #f5f7f8;
  border-radius: 40px;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
  white-space: nowrap;
}

.divider {
  width: 1px;
  height: 16px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.divider img {
  height: 16px;
  width: auto;
}

.orders {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
  padding: 0;
}

.orders-chevron {
  display: block;
}

.avatar {
  border-radius: 50%;
  object-fit: cover;
}
</style>
