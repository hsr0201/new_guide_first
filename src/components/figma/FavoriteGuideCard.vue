<script setup>
/**
 * 收藏常用向导 — 单张向导卡片（设计稿 3827:68679 内卡片结构）
 */
defineProps({
  /** 向导姓名 */
  name: { type: String, required: true },
  /** 主图路径（建议使用 public/figma-assets 下本地文件） */
  photoUrl: { type: String, required: true },
  /** 相册角标，如 1/5 */
  photoBadge: { type: String, default: '1/5' },
  /** 副标题一行 */
  subtitle: { type: String, default: '东京生活2年 ‧ 女士 ‧ 30岁' },
  /** 评价摘要一行 */
  reviewSnippet: { type: String, required: true },
  /** 好评差评统计 */
  reviewStats: { type: String, default: '280条好评｜2条差评' },
  /** 是否在统计后显示小箭头 */
  showStatsArrow: { type: Boolean, default: true },
})

const IMG_HEART = '/figma-assets/icon-heart-outline.svg'
const IMG_V_BADGE = '/figma-assets/icon-v-badge.svg'
const IMG_INFO = '/figma-assets/icon-hint.svg'
const IMG_CHEVRON = '/figma-assets/icon-chevron-10.svg'

const tags = ['11年资深玩家', '山东人', '大阪生活9年']
</script>

<template>
  <article class="card">
    <div class="card-inner">
      <div class="photo-wrap" aria-hidden="true">
        <div class="photo-shadow" />
        <div class="photo-frame">
          <img class="photo" :src="photoUrl" :alt="name" />
        </div>
        <div class="photo-badge">{{ photoBadge }}</div>
      </div>
      <div class="body">
        <div class="body-top">
          <div class="title-row">
            <h3 class="name">{{ name }}</h3>
            <button type="button" class="heart-btn" aria-label="已收藏">
              <img :src="IMG_HEART" width="24" height="24" alt="" />
            </button>
          </div>
          <div class="level-row">
            <img class="v-icon" :src="IMG_V_BADGE" width="19" height="11" alt="" />
            <span class="level-text">超赞向导</span>
            <img class="info-icon" :src="IMG_INFO" width="12" height="12" alt="" />
          </div>
          <p class="subtitle">{{ subtitle }}</p>
          <div class="tags">
            <span v-for="(t, i) in tags" :key="i" class="tag">{{ t }}</span>
          </div>
        </div>
        <div class="review-box">
          <div class="score-row">
            <div class="score-left">
              <span class="score-bg" aria-hidden="true" />
              <span class="score-num" aria-label="评分 4.8">4.8</span>
              <span class="score-unit">分</span>
            </div>
            <div class="score-right">
              <span class="praise">超棒!</span>
              <span class="count">68位客人打分</span>
            </div>
          </div>
          <p class="snippet">{{ reviewSnippet }}</p>
          <div class="stats-row">
            <span class="stats">{{ reviewStats }}</span>
            <img v-if="showStatsArrow" class="stats-arrow" :src="IMG_CHEVRON" width="10" height="10" alt="" />
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: #fff;
  border: 0.5px solid #e1e6ef;
  border-radius: 12px;
  padding: 16px;
  min-width: 0;
}

.card-inner {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.photo-wrap {
  position: relative;
  width: 94px;
  height: 181px;
  flex-shrink: 0;
  display: inline-grid;
  place-items: start;
}

.photo-shadow {
  position: absolute;
  left: 19.5px;
  top: 9px;
  width: 81px;
  height: 160.5px;
  background: #ececec;
  border: 1px solid #fff;
  border-radius: 10px 10px 31px 10px;
  box-shadow: 0 1.78px 13.352px rgba(13, 51, 128, 0.2);
}

.photo-frame {
  position: relative;
  width: 94px;
  height: 181px;
  border: 1px solid #fff;
  border-radius: 12px 12px 36px 12px;
  overflow: hidden;
  box-shadow: 0 2.069px 15.514px rgba(13, 51, 128, 0.2);
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-badge {
  position: absolute;
  left: 6.5px;
  top: 154.5px;
  min-height: 20px;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 12px;
  line-height: normal;
  display: flex;
  align-items: center;
  justify-content: center;
}

.body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.body-top {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.name {
  margin: 0;
  flex: 1;
  min-width: 0;
  font-size: 20px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: normal;
}

.heart-btn {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.heart-btn img {
  display: block;
  width: 100%;
  height: 100%;
}

.level-row {
  display: flex;
  align-items: center;
  gap: 2.8px;
  padding-left: 1px;
}

.v-icon {
  display: block;
  flex-shrink: 0;
}

.level-text {
  font-size: 13px;
  font-weight: 600;
  color: #915e31;
  line-height: 1;
}

.info-icon {
  display: block;
}

.subtitle {
  margin: 0;
  font-size: 12px;
  color: #757575;
  line-height: normal;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.tag {
  background: #f5f7f8;
  color: #75798a;
  font-size: 10px;
  line-height: normal;
  padding: 2px 3px;
  border-radius: 4px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.review-box {
  width: 100%;
  background: #f6f8fa;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-row {
  display: flex;
  align-items: flex-end;
  gap: 7px;
  width: 100%;
}

.score-left {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 1px;
}

.score-bg {
  position: absolute;
  left: -0.13px;
  top: 11px;
  width: 45.5px;
  height: 9px;
  border-radius: 8px;
  background: linear-gradient(90deg, #ffb399, #fff3df);
  pointer-events: none;
}

.score-num {
  position: relative;
  font-family: 'Barlow', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 23px;
  font-weight: 600;
  letter-spacing: 0.23px;
  color: #1a1a1a;
  line-height: 1;
}

.score-unit {
  position: relative;
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1;
  padding-bottom: 1px;
}

.score-right {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-end;
  gap: 5px;
}

.praise {
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1;
}

.count {
  font-size: 10px;
  color: #444;
  line-height: 1;
}

.snippet {
  margin: 0;
  width: 100%;
  font-size: 12px;
  color: #444;
  line-height: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 2px;
}

.stats {
  font-size: 10px;
  color: #9a9a9a;
  line-height: normal;
  white-space: nowrap;
}

.stats-arrow {
  display: block;
  flex-shrink: 0;
}
</style>
