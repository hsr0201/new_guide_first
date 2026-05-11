<script setup>
/**
 * 「推荐向导」模块：空态 3827:68113；有值态 3827:68628
 * hover / 收藏与换一换交互 + Toast（设计稿无细则时按 B 端后台常见行为推断）
 */
import { computed, ref, watch } from 'vue'
import { useToast } from '../../composables/useToast.js'

const props = defineProps({
  /** 推荐列表；无项时展示空状态 */
  guides: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['refresh', 'openGuide'])

const hasGuides = computed(() => Array.isArray(props.guides) && props.guides.length > 0)

const IMG_MASK = '/figma-assets/recommend-empty-mask.svg'
const IMG_ILLUSTRATION = '/figma-assets/recommend-empty-illustration.svg'

const IMG_REFRESH = '/figma-assets/recommend-refresh-icon.svg'
const HEART_OUTLINE = '/figma-assets/recommend-heart-outline.svg'
const HEART_FILLED = '/figma-assets/recommend-heart-filled.svg'
const HEART_FILLED_ALT = '/figma-assets/recommend-heart-filled-alt.svg'

const { visible: toastVisible, message: toastMessage, show: showToast } = useToast(2600)

/** 按向导 id 是否收藏；初始首卡 false，其余 true（对齐原设计稿） */
const favoritedById = ref({})

function guideKey(g, index) {
  return g.id != null ? String(g.id) : `idx-${index}`
}

watch(
  () => props.guides,
  (list) => {
    const next = {}
    list.forEach((g, i) => {
      const k = guideKey(g, i)
      if (g.favorited != null) next[k] = !!g.favorited
      else next[k] = i !== 0
    })
    favoritedById.value = next
  },
  { immediate: true, deep: true },
)

function heartSrc(item, index) {
  if (item.heartSrc) return item.heartSrc
  const k = guideKey(item, index)
  const fav = favoritedById.value[k]
  if (!fav) return HEART_OUTLINE
  return index === 1 ? HEART_FILLED : HEART_FILLED_ALT
}

function toggleFavorite(g, index) {
  const k = guideKey(g, index)
  const next = !favoritedById.value[k]
  favoritedById.value = { ...favoritedById.value, [k]: next }
  showToast(next ? '已收藏该向导' : '已取消收藏')
}

function onRefreshClick() {
  emit('refresh')
  showToast('已为你换一批推荐')
}

function onOpenGuide(g) {
  emit('openGuide', g)
  showToast(`查看向导：${g.name}`)
}
</script>

<template>
  <!-- 有推荐数据：Figma 3827:68628 -->
  <section v-if="hasGuides" class="card card--filled" data-node-id="3827:68628">
    <div class="filled-head" data-node-id="3827:68629">
      <h2 class="card-title" data-node-id="3827:68630">推荐向导</h2>
      <button type="button" class="refresh" data-node-id="3827:68631" @click="onRefreshClick">
        <span class="refresh-ico" data-node-id="3827:68632">
          <img :src="IMG_REFRESH" width="20" height="20" alt="" />
        </span>
        <span class="refresh-text" data-node-id="3827:68635">换一换</span>
      </button>
    </div>
    <div class="filled-row" data-node-id="3827:68636">
      <article
        v-for="(g, i) in guides"
        :key="g.id ?? `${g.name}-${i}`"
        class="mini-card"
        :data-node-id="i === 0 ? '3827:68637' : i === 1 ? '3827:68651' : '3827:68665'"
      >
        <div class="mini-card-inner">
          <div
            class="mini-left"
            role="button"
            tabindex="0"
            @click="onOpenGuide(g)"
            @keydown.enter.prevent="onOpenGuide(g)"
          >
            <div class="avatar-wrap">
              <img class="avatar" :src="g.avatarUrl" :alt="g.name" width="50" height="50" />
            </div>
            <div class="mini-text">
              <p class="mini-name">{{ g.name }}</p>
              <p class="mini-sub">{{ g.serveText }}</p>
            </div>
          </div>
          <button
            type="button"
            class="heart-wrap"
            :aria-label="favoritedById[guideKey(g, i)] ? '取消收藏' : '收藏'"
            :aria-pressed="favoritedById[guideKey(g, i)] ? 'true' : 'false'"
            @click.stop="toggleFavorite(g, i)"
          >
            <img :src="heartSrc(g, i)" width="24" height="24" alt="" />
          </button>
        </div>
      </article>
    </div>
  </section>

  <!-- 无推荐：3827:68113 -->
  <section v-else class="card card--empty" data-node-id="3827:68113">
    <h2 class="card-title">推荐向导</h2>
    <div class="empty">
      <div class="empty-visual" data-node-id="3827:68116">
        <div
          class="empty-mask"
          :style="{
            maskImage: `url('${IMG_MASK}')`,
            WebkitMaskImage: `url('${IMG_MASK}')`,
          }"
        >
          <img class="empty-img" :src="IMG_ILLUSTRATION" alt="" />
        </div>
      </div>
      <p class="empty-text" data-node-id="3827:68130">暂无可推荐向导</p>
    </div>
  </section>

  <Teleport to="body">
    <Transition name="toast-pop">
      <div v-if="toastVisible" class="toast" role="status" aria-live="polite">{{ toastMessage }}</div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.card {
  width: 100%;
  background: #fff;
  border: 1px solid #e1e6ef;
  border-radius: 12px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.card--empty {
  gap: 2px;
  transition: box-shadow 0.2s ease;
}

.card--empty:hover {
  box-shadow: 0 2px 12px rgba(13, 51, 128, 0.06);
}

.card--filled {
  gap: 20px;
  transition: box-shadow 0.2s ease;
}

.card--filled:hover {
  box-shadow: 0 2px 12px rgba(13, 51, 128, 0.06);
}

.card-title {
  font-size: 18px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: normal;
  margin: 0;
}

/* —— 有值态头部 —— */
.filled-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
}

.refresh {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  margin: -6px -10px -6px 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  transition:
    background-color 0.18s ease,
    box-shadow 0.18s ease;
}

.refresh:hover {
  background: rgba(78, 83, 224, 0.08);
}

.refresh:hover .refresh-text {
  text-decoration: underline;
}

.refresh:hover .refresh-ico img {
  opacity: 0.92;
  transform: rotate(-18deg);
}

.refresh:active {
  background: rgba(78, 83, 224, 0.14);
}

.refresh:focus-visible {
  outline: 2px solid #4e53e0;
  outline-offset: 2px;
}

.refresh-ico img {
  transition:
    opacity 0.18s ease,
    transform 0.22s ease;
}

.refresh-ico {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: block;
}

.refresh-ico img {
  display: block;
  width: 100%;
  height: 100%;
}

.refresh-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  color: #4e53e0;
  white-space: nowrap;
}

/* —— 有值态卡片行：三列等分，避免固定 298px 在 ~900px 容器内挤成两行 —— */
.filled-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
  align-items: stretch;
}

.mini-card {
  width: 100%;
  min-width: 0;
  background: #f6f8fa;
  border-radius: 6px;
  padding: 16px 20px;
  overflow: hidden;
  border: 1px solid transparent;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.mini-card:hover {
  border-color: #e1e6ef;
  box-shadow: 0 4px 14px rgba(13, 51, 128, 0.1);
  transform: translateY(-1px);
  background: #fafbfd;
}

.mini-card:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(13, 51, 128, 0.08);
}

.mini-card-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

.mini-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  cursor: pointer;
  border-radius: 6px;
  outline: none;
  transition: opacity 0.15s ease;
}

.mini-left:hover {
  opacity: 0.92;
}

.mini-left:focus-visible {
  box-shadow: 0 0 0 2px rgba(78, 83, 224, 0.35);
}

.avatar-wrap {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mini-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
}

.mini-name {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.mini-sub {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  color: #757575;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.heart-wrap {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin: -4px -4px -4px 0;
  padding: 4px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    transform 0.18s ease;
}

.heart-wrap:hover {
  background: rgba(0, 0, 0, 0.04);
}

.heart-wrap:hover img {
  transform: scale(1.08);
}

.heart-wrap:active {
  transform: scale(0.94);
}

.heart-wrap:focus-visible {
  outline: 2px solid #4e53e0;
  outline-offset: 1px;
}

.heart-wrap img {
  display: block;
  width: 24px;
  height: 24px;
  transition: transform 0.18s ease;
}

@media (max-width: 640px) {
  .filled-row {
    grid-template-columns: 1fr;
  }
}

/* —— 空态 —— */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 160px;
  height: 136px;
  margin: 0 auto;
}

.empty-visual {
  width: 100px;
  height: 100px;
  overflow: hidden;
  position: relative;
}

.empty-mask {
  position: absolute;
  inset: 0;
  mask-size: 99.224px 81.967px;
  mask-position: -12.943px -17.077px;
  mask-repeat: no-repeat;
  mask-mode: luminance;
  -webkit-mask-size: 99.224px 81.967px;
  -webkit-mask-position: -12.943px -17.077px;
  -webkit-mask-repeat: no-repeat;
}

.empty-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.empty-text {
  margin: 0;
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #999;
  line-height: normal;
}
</style>

<style scoped>
/* Toast：Teleport 到 body 后仍带 scoped，需单独块 */
.toast {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 96px;
  margin-inline: auto;
  width: max-content;
  max-width: min(90vw, 360px);
  z-index: 9999;
  padding: 12px 20px;
  border-radius: 10px;
  background: rgba(29, 33, 41, 0.92);
  color: #fff;
  font-size: 14px;
  line-height: 1.45;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  pointer-events: none;
}

.toast-pop-enter-active,
.toast-pop-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.toast-pop-enter-from,
.toast-pop-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
