<script setup>
/**
 * 支付预估价步骤页 — 左栏对应 Figma 3827:68996 整页语境，右侧完整挂载费用明细 3827:69137
 */
import AppTopBar from '../components/figma/AppTopBar.vue'
import FeeDetailsCard from '../components/figma/FeeDetailsCard.vue'

const steps = [
  { id: 1, label: '编辑行程', state: 'done' },
  { id: 2, label: '选车与服务', state: 'done' },
  { id: 3, label: '支付预估价', state: 'current' },
  { id: 4, label: '选向导', state: 'pending' },
]

const serviceRows = [
  { title: '豪华5座 · 无烟车 · 营运车辆', sub: '01/27 · 接送', price: '预估 ¥580' },
  { title: '豪华7座', sub: '01/28 — 01/30 · 连续3日，全天包车', price: '预估 ¥580' },
]
</script>

<template>
  <div class="pay-page" data-node-id="3827:68996">
    <AppTopBar />
    <div class="pay-shell">
      <div class="pay-main">
        <nav class="steps" aria-label="下单步骤">
          <template v-for="(s, i) in steps" :key="s.id">
            <div
              class="step"
              :class="{
                'step--done': s.state === 'done',
                'step--current': s.state === 'current',
                'step--pending': s.state === 'pending',
              }"
            >
              <span class="step-dot" aria-hidden="true">
                <span v-if="s.state === 'done'" class="step-check">✓</span>
                <span v-else class="step-num">{{ s.id }}</span>
              </span>
              <span class="step-label">{{ s.label }}</span>
            </div>
            <div v-if="i < steps.length - 1" class="step-connector" aria-hidden="true" />
          </template>
        </nav>

        <header class="pay-head">
          <h1 class="pay-title">支付预估价</h1>
          <p class="pay-sub">请核对行程与费用，确认后可预付或免预付发单</p>
        </header>

        <RouterLink class="pay-back" to="/">
          <img class="pay-back-ico" src="/figma-assets/icon-chevron-10.svg" width="10" height="10" alt="" />
          返回选车与服务
        </RouterLink>

        <section class="pay-card" aria-label="行程与车辆服务摘要">
          <div class="pay-card-head">
            <h2 class="pay-trip">东京 — 大阪 包车行程</h2>
            <p class="pay-trip-meta">2026年1月27日 至 2026年1月30日 · 共4天</p>
          </div>
          <div class="pay-card-divider" />
          <h3 class="pay-section-title">车辆与服务</h3>
          <ul class="pay-service-list">
            <li v-for="(row, idx) in serviceRows" :key="idx" class="pay-service-row">
              <div class="pay-service-text">
                <span class="pay-service-title">{{ row.title }}</span>
                <span class="pay-service-sub">{{ row.sub }}</span>
              </div>
              <span class="pay-service-price">{{ row.price }}</span>
            </li>
          </ul>
        </section>
      </div>

      <div class="pay-fee-col">
        <FeeDetailsCard />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pay-page {
  min-height: 100vh;
  background: #f5f5f5;
  color: #1d2129;
  font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.pay-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.pay-main {
  flex: 1;
  min-width: 0;
}

.pay-fee-col {
  width: 368px;
  flex-shrink: 0;
}

.steps {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
  margin-bottom: 24px;
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 22px;
}

.step-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step--done .step-dot {
  background: #e8e9ff;
  color: #4e53e0;
}

.step--current .step-dot {
  background: #4e53e0;
  color: #fff;
}

.step--pending .step-dot {
  background: #e5e6eb;
  color: #86909c;
}

.step-check {
  font-size: 12px;
  line-height: 1;
}

.step-num {
  font-size: 12px;
}

.step--done .step-label,
.step--current .step-label {
  color: #1d2129;
  font-weight: 500;
}

.step--pending .step-label {
  color: #86909c;
  font-weight: 400;
}

.step-connector {
  width: 24px;
  height: 1px;
  background: #e5e6eb;
  margin: 0 8px;
  flex-shrink: 0;
}

.pay-head {
  margin-bottom: 12px;
}

.pay-title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 600;
  color: #000;
  line-height: 30px;
}

.pay-sub {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: #86909c;
}

.pay-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #4e53e0;
  text-decoration: none;
  font-weight: 500;
}

.pay-back:hover {
  text-decoration: underline;
}

.pay-back-ico {
  display: block;
  transform: rotate(180deg);
}

.pay-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.pay-card-head {
  margin-bottom: 16px;
}

.pay-trip {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 25px;
}

.pay-trip-meta {
  margin: 0;
  font-size: 14px;
  color: #86909c;
  line-height: 22px;
}

.pay-card-divider {
  height: 1px;
  background: #f2f3f5;
  margin-bottom: 16px;
}

.pay-section-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 500;
  color: #444;
}

.pay-service-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pay-service-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.pay-service-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.pay-service-title {
  font-size: 14px;
  font-weight: 500;
  color: #75798a;
  text-decoration: underline;
  text-decoration-style: dotted;
}

.pay-service-sub {
  font-size: 12px;
  color: #4e53e0;
  font-weight: 500;
}

.pay-service-price {
  flex-shrink: 0;
  font-size: 12px;
  color: #75798a;
}

@media (max-width: 1024px) {
  .pay-shell {
    flex-direction: column;
  }

  .pay-fee-col {
    width: 100%;
    max-width: 368px;
  }
}
</style>
