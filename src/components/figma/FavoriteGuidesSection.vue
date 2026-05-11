<script setup>
import FavoriteGuideCard from './FavoriteGuideCard.vue'

/** 设计稿 3827:68679「常用向导」区块 — 收藏向导列表数据 */
const PHOTO = {
  a: '/figma-assets/guide-portrait-01.png',
  b: '/figma-assets/guide-portrait-02.png',
  c: '/figma-assets/guide-portrait-03.png',
  d: '/figma-assets/guide-portrait-04.png',
  e: '/figma-assets/guide-portrait-05.png',
  f: '/figma-assets/guide-portrait-06.png',
}

const guides = [
  {
    name: '李林',
    photoUrl: PHOTO.a,
    reviewSnippet: '真的态度就特别的让人舒服，真的态度就特别的让人舒服...',
    showStatsArrow: false,
  },
  {
    name: '杨凯',
    photoUrl: PHOTO.b,
    reviewSnippet: '真的态度就特别的让人舒服',
    showStatsArrow: true,
  },
  {
    name: '易烊千玺',
    photoUrl: PHOTO.c,
    reviewSnippet: '真的态度就特别的让人舒服，真的态度就特别的让人舒服...',
    showStatsArrow: true,
  },
  {
    name: '王珊珊',
    photoUrl: PHOTO.d,
    reviewSnippet: '真的态度就特别的让人舒服，真的态度就特别的让人舒服...',
    showStatsArrow: true,
  },
  {
    name: '杨凯',
    photoUrl: PHOTO.e,
    reviewSnippet: '真的态度就特别的让人舒服，真的态度就特别的让人舒服...',
    showStatsArrow: true,
  },
  {
    name: '杨凯',
    photoUrl: PHOTO.f,
    reviewSnippet: '真的态度就特别的让人舒服，真的态度就特别的让人舒服...',
    showStatsArrow: true,
  },
]
</script>

<template>
  <section class="section" data-node-id="3827:68679">
    <h2 class="section-title" data-node-id="3827:68680">常用向导</h2>
    <div class="grid">
      <FavoriteGuideCard
        v-for="(g, i) in guides"
        :key="`${g.name}-${i}`"
        :name="g.name"
        :photo-url="g.photoUrl"
        :review-snippet="g.reviewSnippet"
        :show-stats-arrow="g.showStatsArrow"
      />
    </div>
  </section>
</template>

<style scoped>
.section {
  width: 100%;
  background: #fff;
  border: 1px solid #e1e6ef;
  border-radius: 12px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.section-title {
  margin: 0;
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: normal;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
