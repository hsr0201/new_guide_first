<script setup>
/**
 * 右侧费用明细 + 常用向导优先报价 + 协议与发单按钮
 * 设计节点 Figma 3827:69137
 */
import { ref, computed, watch, nextTick } from 'vue'
import { useToast } from '../../composables/useToast.js'

/** Figma 3869:49515 气泡正文（可按多语言覆盖） */
const DEFAULT_PRIORITY_TOOLTIP_BODY =
  '平台将优先向您的常用向导推送订单，并提供 20 分钟专属报价窗口；在此期间，订单暂不对外公开，等待常用向导响应。\n20 分钟后若未收到常用向导的有效报价，订单将自动同步推送至平台其他向导，确保您的订单能正常获取报价，不影响整体时效。'

const props = defineProps({
  /** 常用向导条目标签文案（单行横向滚动；总数见 guidePoolTotal） */
  guideTags: {
    type: Array,
    default: () => [
      '林为茂向导',
      '林为茂呀向导呀...',
      '林为茂',
      '林为茂',
      '张小云向导',
    ],
  },
  /** 可选向导池总人数，用于右下角「共 N 个向导可选」 */
  guidePoolTotal: {
    type: Number,
    default: 12,
  },
  /** 气泡标题，与 Figma 3869:49515 一致 */
  priorityTooltipTitle: {
    type: String,
    default: '常用向导优先报价',
  },
  /** 气泡正文，与 Figma 3869:49515 一致（支持 \\n 换行） */
  priorityTooltipBody: {
    type: String,
    default: DEFAULT_PRIORITY_TOOLTIP_BODY,
  },
  /**
   * 关→开时弹窗内可选向导（Figma 3863:47183）
   * 每项：{ id, name, avatarUrl? }
   * 列表条数由业务传入，不限制最多选择人数；确认时至少选 1 位。
   */
  priorityConfirmGuides: {
    type: Array,
    default: () => [
      { id: 'pc1', name: '李林-Lisa' },
      { id: 'pc2', name: '李林-Lisa' },
      { id: 'pc3', name: '易洋千玺-TFboy' },
      { id: 'pc4', name: '李林-Lisa' },
      { id: 'pc5', name: '易洋千玺-TFboyy...' },
      { id: 'pc6', name: '李林-Lisa' },
      { id: 'pc7', name: '张小云向导' },
      { id: 'pc8', name: '林为茂向导' },
      { id: 'pc9', name: '向导-示例九' },
      { id: 'pc10', name: '向导-示例十' },
      { id: 'pc11', name: '向导-示例十一' },
      { id: 'pc12', name: '向导-示例十二' },
    ],
  },
})

const emit = defineEmits(['prepay', 'freePrepay', 'priority-change'])

const { visible: toastVisible, message: toastMessage, show: showToast } = useToast(2600)

const priorityOn = ref(false)
const agreed = ref(true)

const avatarSrc = '/figma-assets/fee-avatar.png'

/** 关→开确认弹窗（Figma 3863:47183） */
const priorityModalOpen = ref(false)
const priorityModalPanelRef = ref(null)
/** 弹窗内勾选状态 id -> boolean */
const modalSelected = ref({})

/** 弹窗确认后展示的已选向导（Figma 3827:70718「开启后」态）；关开关时清空 */
const confirmedSelection = ref(null)

/** 弹窗列表规范化 */
const modalGuideList = computed(() =>
  props.priorityConfirmGuides.map((g, i) => {
    if (typeof g === 'string') {
      return { id: `pc-${i}`, name: g, avatarUrl: avatarSrc }
    }
    return {
      id: g.id != null ? String(g.id) : `pc-${i}`,
      name: String(g.name ?? ''),
      avatarUrl: g.avatarUrl || avatarSrc,
    }
  }),
)

const modalSelectedCount = computed(
  () => modalGuideList.value.filter((g) => modalSelected.value[g.id]).length,
)

const modalAllSelected = computed(() => {
  const n = modalGuideList.value.length
  return n > 0 && modalSelectedCount.value === n
})

/**
 * 打开确认弹窗
 * @param {string[] | undefined} presetIds 已选 id 列表；不传则默认全选（首次开启自动补全）
 */
function openPriorityConfirmModal(presetIds) {
  const next = {}
  modalGuideList.value.forEach((g) => {
    if (presetIds === undefined) {
      next[g.id] = true
    } else {
      next[g.id] = presetIds.includes(g.id)
    }
  })
  modalSelected.value = next
  priorityModalOpen.value = true
}

const confirmedList = computed(() => confirmedSelection.value ?? [])

const confirmedCount = computed(() => confirmedList.value.length)

function onEditPriorityClick() {
  const ids = confirmedList.value.map((g) => g.id)
  openPriorityConfirmModal(ids)
}

function closePriorityModal() {
  priorityModalOpen.value = false
}

function toggleModalGuide(id) {
  modalSelected.value = { ...modalSelected.value, [id]: !modalSelected.value[id] }
}

/** 一键勾选：全选 / 全不选 */
function toggleModalSelectAll() {
  const on = !modalAllSelected.value
  const next = {}
  modalGuideList.value.forEach((g) => {
    next[g.id] = on
  })
  modalSelected.value = next
}

function onPrioritySwitchClick() {
  if (priorityOn.value) {
    priorityOn.value = false
    confirmedSelection.value = null
    emit('priority-change', { on: false, guideIds: [] })
    showToast('已关闭常用向导优先报价')
    return
  }
  if (!modalGuideList.value.length) {
    priorityOn.value = true
    confirmedSelection.value = []
    emit('priority-change', { on: true, guideIds: [] })
    showToast('已开启常用向导优先报价')
    return
  }
  openPriorityConfirmModal(undefined)
}

function onConfirmPriorityModal() {
  if (modalSelectedCount.value < 1) {
    showToast('请至少选择一位常用向导')
    return
  }
  const picked = modalGuideList.value.filter((g) => modalSelected.value[g.id])
  const guideIds = picked.map((g) => g.id)
  confirmedSelection.value = picked.map((g) => ({
    id: g.id,
    name: g.name,
    avatarUrl: g.avatarUrl,
  }))
  priorityOn.value = true
  priorityModalOpen.value = false
  emit('priority-change', { on: true, guideIds })
  showToast('已开启常用向导优先报价')
}

watch(priorityModalOpen, async (open) => {
  if (!open) return
  await nextTick()
  priorityModalPanelRef.value?.focus?.()
})

/** 标题旁说明气泡：悬停/聚焦显示，移出短暂延迟避免误关 */
const priorityHintOpen = ref(false)
let priorityHintCloseTimer = 0

function openPriorityHint() {
  window.clearTimeout(priorityHintCloseTimer)
  priorityHintOpen.value = true
}

function scheduleClosePriorityHint() {
  window.clearTimeout(priorityHintCloseTimer)
  priorityHintCloseTimer = window.setTimeout(() => {
    priorityHintOpen.value = false
  }, 200)
}

function closePriorityHintNow() {
  window.clearTimeout(priorityHintCloseTimer)
  priorityHintOpen.value = false
}

function onPrepay() {
  emit('prepay')
  showToast('已选择预付发单')
}

function onFreePrepay() {
  emit('freePrepay')
  showToast('已选择免预付发单')
}

/** 单行 chip 数据：名称 + 头像（当前示例共用占位图，后续可改为对象数组 props） */
const chipItems = computed(() =>
  props.guideTags.map((name, i) => ({
    key: `chip-${i}`,
    name: String(name),
    avatarUrl: avatarSrc,
  })),
)

/** 双行条带：奇偶分两行，各行独立横向排列（列宽互不牵连） */
const chipItemsLine1 = computed(() => chipItems.value.filter((_, i) => i % 2 === 0))
const chipItemsLine2 = computed(() => chipItems.value.filter((_, i) => i % 2 === 1))

const confirmedChipsLine1 = computed(() => confirmedList.value.filter((_, i) => i % 2 === 0))
const confirmedChipsLine2 = computed(() => confirmedList.value.filter((_, i) => i % 2 === 1))

</script>

<template>
  <aside class="fee-card" data-node-id="3827:69137">
    <div class="fee-top" data-node-id="3827:69138">
      <h2 class="fee-title" data-node-id="3827:69139">费用明细</h2>
      <div class="fee-panel" data-node-id="3827:69140">
        <div class="fee-row fee-row--strong" data-node-id="3827:69142">
          <span data-node-id="3827:69143">预估用车</span>
          <span data-node-id="3827:69144">¥5,382</span>
        </div>
        <div class="fee-sub" data-node-id="3827:69145">
          <div class="fee-car" data-node-id="3827:69146">
            <div class="fee-line" data-node-id="3827:69147">
              <span class="fee-dotted" data-node-id="3827:69148">豪华5座 ‧ 无烟车 ‧ 营运车辆</span>
              <span class="fee-est" data-node-id="3827:69149">预估 ¥580</span>
            </div>
            <div class="fee-meta" data-node-id="3827:69150">
              <span class="fee-date" data-node-id="3827:69153">01/27</span>
              <span class="fee-tag" data-node-id="3827:69154">接送</span>
            </div>
          </div>
          <div class="fee-car" data-node-id="3827:69156">
            <div class="fee-line" data-node-id="3827:69157">
              <span class="fee-dotted" data-node-id="3827:69158">豪华7座</span>
              <span class="fee-est" data-node-id="3827:69159">预估 ¥580</span>
            </div>
            <div class="fee-meta" data-node-id="3827:69160">
              <div class="fee-dates" data-node-id="3827:69161">
                <span class="fee-date" data-node-id="3827:69163">01/28</span>
                <img class="fee-date-dash" src="/figma-assets/fee-vector48.svg" width="10" height="6" alt="" />
                <span class="fee-date" data-node-id="3827:69165">01/30</span>
              </div>
              <span class="fee-tag fee-tag--wide" data-node-id="3827:69166">连续3日，全天包车</span>
            </div>
          </div>
        </div>
        <div class="fee-other" data-node-id="3827:69168">
          <div class="fee-other-head" data-node-id="3827:69169">
            <div class="fee-other-title" data-node-id="3827:69172">
              <span data-node-id="3827:69173">其它服务需求</span>
              <img class="fee-ico-info" src="/figma-assets/fee-icon-hint.svg" width="14" height="14" alt="" />
            </div>
            <span class="fee-other-amt" data-node-id="3827:69175">预估 ¥0</span>
          </div>
          <p class="fee-other-sub" data-node-id="3827:69177">包含6项行程中所需服务</p>
        </div>
      </div>
    </div>

    <div class="fee-total" data-node-id="3827:69178">
      <div class="fee-total-row" data-node-id="3827:69203">
        <span data-node-id="3827:69204">合计</span>
        <span class="fee-total-num" data-node-id="3827:69205">¥5,182</span>
      </div>
    </div>

    <div
      class="fee-priority"
      :class="{ 'fee-priority--confirmed': priorityOn }"
      data-node-id="3827:69206"
    >
      <div
        class="fee-priority-inner"
        :class="{ 'fee-priority-inner--confirmed': priorityOn }"
        data-node-id="3827:69207"
      >
        <div class="fee-priority-head" data-node-id="3827:69209">
          <div class="fee-priority-title" data-node-id="3827:69210">
            <span data-node-id="3827:69211">常用向导优先报价</span>
            <span
              class="fee-hint-wrap"
              data-node-id="3869:49515"
              @mouseenter="openPriorityHint"
              @mouseleave="scheduleClosePriorityHint"
            >
              <button
                type="button"
                class="fee-hint-trigger"
                aria-label="查看常用向导优先报价说明"
                :aria-expanded="priorityHintOpen"
                aria-haspopup="true"
                aria-controls="fee-priority-hint-tooltip"
                @focus="openPriorityHint"
                @blur="scheduleClosePriorityHint"
                @keydown.escape.prevent="closePriorityHintNow"
              >
                <img
                  class="fee-hint"
                  src="/figma-assets/fee-icon-hint.svg"
                  width="12"
                  height="12"
                  alt=""
                />
              </button>
              <div
                v-show="priorityHintOpen"
                id="fee-priority-hint-tooltip"
                class="fee-hint-popover"
                role="tooltip"
                @mouseenter="openPriorityHint"
                @mouseleave="scheduleClosePriorityHint"
              >
                <p class="fee-hint-popover-title">{{ priorityTooltipTitle }}</p>
                <p class="fee-hint-popover-body">{{ priorityTooltipBody }}</p>
              </div>
            </span>
          </div>
          <button
            type="button"
            class="fee-switch"
            role="switch"
            :aria-checked="priorityOn"
            @click="onPrioritySwitchClick"
          >
            <span class="fee-switch-track" :class="{ 'fee-switch-track--on': priorityOn }">
              <span class="fee-switch-thumb" />
            </span>
          </button>
        </div>
        <!-- 关闭：候选池横向滚动 + 提示；开启后：Figma 3827:70718 -->
        <div v-if="!priorityOn" class="fee-guide-wrap" data-node-id="3859:37283">
          <div class="fee-guide-body">
            <div
              v-if="chipItems.length"
              class="fee-guide-row fee-guide-row--scroll"
              role="group"
              aria-label="向导列表，双行展示，可横向滑动查看"
            >
              <div class="fee-guide-row-2lines">
                <div class="fee-guide-line">
                  <div
                    v-for="item in chipItemsLine1"
                    :key="item.key"
                    class="fee-chip"
                  >
                    <div class="fee-chip-inner">
                      <div class="fee-chip-av">
                        <img :src="item.avatarUrl" width="24" height="24" alt="" />
                      </div>
                      <span class="fee-chip-text">{{ item.name }}</span>
                    </div>
                  </div>
                </div>
                <div class="fee-guide-line">
                  <div
                    v-for="item in chipItemsLine2"
                    :key="item.key"
                    class="fee-chip"
                  >
                    <div class="fee-chip-inner">
                      <div class="fee-chip-av">
                        <img :src="item.avatarUrl" width="24" height="24" alt="" />
                      </div>
                      <span class="fee-chip-text">{{ item.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p class="fee-guide-pool-hint">共 {{ guidePoolTotal }} 个向导可选</p>
        </div>
        <div v-else class="fee-pri-on" data-node-id="3827:70718">
          <div class="fee-pri-on-status" data-node-id="3827:70751">
            <div class="fee-pri-on-status-left">
              <span class="fee-pri-on-count">已选择{{ confirmedCount }}位向导优先报价</span>
            </div>
            <button type="button" class="fee-pri-on-edit" @click="onEditPriorityClick">
              <!-- Figma 3827:70755 Icon / EditTwoTone，矢量落盘 -->
              <img
                class="fee-pri-on-edit-ico"
                src="/figma-assets/icon-edit-twotone.svg"
                width="16"
                height="16"
                alt=""
              />
              <span>修改</span>
            </button>
          </div>
          <!-- 与未开启态一致：双行横向滚动 + 细滚动条 -->
          <div class="fee-guide-wrap">
            <div class="fee-guide-body">
              <div
                v-if="confirmedList.length"
                class="fee-guide-row fee-guide-row--scroll"
                role="group"
                aria-label="已选向导，双行展示，可横向滑动查看"
              >
                <div class="fee-guide-row-2lines">
                  <div class="fee-guide-line">
                    <div v-for="g in confirmedChipsLine1" :key="g.id" class="fee-chip">
                      <div class="fee-chip-inner">
                        <div class="fee-chip-av">
                          <img :src="g.avatarUrl" width="24" height="24" :alt="g.name" />
                        </div>
                        <span class="fee-chip-text">{{ g.name }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="fee-guide-line">
                    <div v-for="g in confirmedChipsLine2" :key="g.id" class="fee-chip">
                      <div class="fee-chip-inner">
                        <div class="fee-chip-av">
                          <img :src="g.avatarUrl" width="24" height="24" :alt="g.name" />
                        </div>
                        <span class="fee-chip-text">{{ g.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <label class="fee-agree" data-node-id="3827:69276">
      <input v-model="agreed" type="checkbox" class="fee-agree-input" />
      <span class="fee-agree-box" :class="{ 'fee-agree-box--on': agreed }">
        <img v-if="agreed" class="fee-agree-tick" src="/figma-assets/fee-check.svg" alt="" />
      </span>
      <span class="fee-agree-text" data-node-id="3827:69279">
        <span>我已阅读并同意</span>
        <a href="#" class="fee-link" @click.prevent="showToast('打开《退改规则说明》')">《退改规则说明》</a>
        <span>和</span>
        <a href="#" class="fee-link" @click.prevent="showToast('打开《费用包含说明》')">《费用包含说明》</a>
      </span>
    </label>

    <button type="button" class="fee-btn fee-btn--outline" data-node-id="3827:69280" @click="onPrepay">
      <span>预付发单</span>
      <img class="fee-btn-ico-single" src="/figma-assets/fee-btn1-v1.svg" width="16" height="16" alt="" />
    </button>
    <button type="button" class="fee-btn fee-btn--primary" data-node-id="3827:69281" @click="onFreePrepay">
      <span>免预付发单</span>
      <img class="fee-btn-ico-single fee-btn-ico-single--light" src="/figma-assets/fee-btn2-v1.svg" width="16" height="16" alt="" />
    </button>

    <Teleport to="body">
      <Transition name="fee-toast">
        <div v-if="toastVisible" class="fee-toast" role="status">{{ toastMessage }}</div>
      </Transition>
    </Teleport>

    <!-- 关→开：Figma 3863:47183 确认弹窗；打开时默认全选（自动补全） -->
    <Teleport to="body">
      <Transition name="fee-pri-modal">
        <div v-if="priorityModalOpen" class="fee-pri-modal-root" role="presentation">
          <div class="fee-pri-modal-backdrop" aria-hidden="true" @click="closePriorityModal" />
          <div
            ref="priorityModalPanelRef"
            class="fee-pri-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fee-pri-modal-title"
            tabindex="-1"
            data-node-id="3863:47183"
            @click.stop
            @keydown.escape.prevent="closePriorityModal"
          >
            <header class="fee-pri-modal-head">
              <h2 id="fee-pri-modal-title" class="fee-pri-modal-title">常用向导优先报价</h2>
              <button
                type="button"
                class="fee-pri-modal-close"
                aria-label="关闭"
                @click="closePriorityModal"
              >
                ×
              </button>
            </header>
            <div class="fee-pri-modal-body">
              <div class="fee-pri-modal-grid">
                <button
                  v-for="g in modalGuideList"
                  :key="g.id"
                  type="button"
                  class="fee-pri-modal-card"
                  :class="{ 'fee-pri-modal-card--on': modalSelected[g.id] }"
                  @click="toggleModalGuide(g.id)"
                >
                  <span
                    class="fee-pri-modal-check"
                    :class="{ 'fee-pri-modal-check--on': modalSelected[g.id] }"
                    aria-hidden="true"
                  >
                    <img
                      v-if="modalSelected[g.id]"
                      src="/figma-assets/fee-check.svg"
                      width="10"
                      height="8"
                      alt=""
                    />
                  </span>
                  <span class="fee-pri-modal-card-main">
                    <span class="fee-pri-modal-av">
                      <img :src="g.avatarUrl" width="36" height="36" :alt="g.name" />
                    </span>
                    <span class="fee-pri-modal-name">{{ g.name }}</span>
                  </span>
                </button>
              </div>
            </div>
            <footer class="fee-pri-modal-foot">
              <button type="button" class="fee-pri-modal-selectall" @click="toggleModalSelectAll">
                <span
                  class="fee-pri-modal-check fee-pri-modal-check--inline"
                  :class="{ 'fee-pri-modal-check--on': modalAllSelected }"
                  aria-hidden="true"
                >
                  <img
                    v-if="modalAllSelected"
                    src="/figma-assets/fee-check.svg"
                    width="10"
                    height="8"
                    alt=""
                  />
                </span>
                <span class="fee-pri-modal-selectall-text">一键勾选</span>
              </button>
              <button
                type="button"
                class="fee-pri-modal-confirm"
                :aria-label="`确认，当前已选 ${modalSelectedCount} 位常用向导`"
                @click="onConfirmPriorityModal"
              >
                确认选择
              </button>
            </footer>
          </div>
        </div>
      </Transition>
    </Teleport>
  </aside>
</template>

<style scoped>
.fee-card {
  width: 100%;
  max-width: 368px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 16px rgba(134, 134, 134, 0.25);
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.fee-top {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.fee-title {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #1a1a1a;
}

.fee-panel {
  background: #fafafa;
  border-radius: 6px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fee-row--strong {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  color: #444;
}

.fee-sub {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fee-car {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fee-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  color: #75798a;
}

.fee-dotted {
  font-size: 14px;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-style: dotted;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.fee-est {
  font-size: 12px;
  font-weight: 400;
  flex-shrink: 0;
}

.fee-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.fee-dates {
  display: flex;
  align-items: center;
  gap: 1px;
}

.fee-date {
  font-size: 12px;
  font-weight: 500;
  color: #4e53e0;
}

.fee-date-dash {
  display: block;
  flex-shrink: 0;
  align-self: center;
}

.fee-tag {
  border: 0.5px solid #4e53e0;
  border-radius: 2px;
  padding: 1px 5px;
  font-size: 10px;
  color: #4e53e0;
}

.fee-tag--wide {
  white-space: nowrap;
}

.fee-other {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fee-other-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.fee-other-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 500;
  color: #444;
}

.fee-ico-info {
  flex-shrink: 0;
  display: block;
}

.fee-other-amt {
  font-size: 14px;
  font-weight: 500;
  color: #444;
}

.fee-other-sub {
  margin: 0;
  font-size: 14px;
  color: #75798a;
  text-decoration: underline;
  text-decoration-style: dotted;
}

.fee-total {
  width: 100%;
}

.fee-total-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 12px;
  border-bottom: 0.5px solid #f2f5fa;
  font-weight: 500;
}

.fee-total-row span:first-child {
  font-size: 14px;
  color: #1a1a1a;
}

.fee-total-num {
  font-size: 20px;
  color: #4e53e0;
}

.fee-priority {
  position: relative;
  width: 100%;
  border-radius: 6px;
  padding: 16px 20px;
  background: linear-gradient(180deg, #f9f9ff 0%, #fff 100%);
  border: 1px solid #eef0ff;
}

/* 开启并确认后：Figma 3827:70718 渐变与间距 */
.fee-priority--confirmed {
  background: linear-gradient(180deg, #f8f8ff 0%, #fff 100%);
}

.fee-priority-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fee-priority-inner--confirmed {
  gap: 10px;
}

/* —— 已开启态：已选人数 + 修改 + 两行卡片 + 右侧淡边 —— */
.fee-pri-on {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

/* 对齐 Figma 3827:70751 Paragraph：横向 hug + gap 6，宽 272 */
.fee-pri-on-status {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  width: 100%;
  max-width: 272px;
  align-self: flex-start;
  box-sizing: border-box;
}

.fee-pri-on-status-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 0 1 auto;
}

.fee-pri-on-count {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: #75798a;
  line-height: 22px;
  text-align: left;
  white-space: nowrap;
}

.fee-pri-on-edit {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #4e53e0;
  cursor: pointer;
}

.fee-pri-on-edit:hover {
  background: rgba(78, 83, 224, 0.08);
}

.fee-pri-on-edit-ico {
  display: block;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.fee-priority-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.fee-priority-title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.fee-hint-wrap {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
}

.fee-hint-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  margin: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: help;
  line-height: 0;
}

.fee-hint-trigger:hover {
  background: rgba(78, 83, 224, 0.08);
}

.fee-hint-trigger:focus-visible {
  outline: 2px solid #4e53e0;
  outline-offset: 2px;
}

.fee-hint {
  display: block;
}

/* 气泡：对齐 Figma 3869:49515（白底、圆角 12、内边距 12、宽 296、投影） */
.fee-hint-popover {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 50;
  width: min(296px, calc(100vw - 32px));
  padding: 12px;
  border-radius: 12px;
  background: #fff;
  border: none;
  box-shadow: 0 4px 18px rgba(182, 182, 182, 0.3);
  box-sizing: border-box;
}

.fee-hint-popover-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  color: #444;
}

.fee-hint-popover-body {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #75798a;
  white-space: pre-line;
}

.fee-switch {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.fee-switch-track {
  display: block;
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: #dcdfe6;
  position: relative;
  transition: background 0.2s ease;
}

.fee-switch-track--on {
  background: #4e53e0;
}

.fee-switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.fee-switch-track--on .fee-switch-thumb {
  transform: translateX(16px);
}

.fee-guide-wrap {
  width: 100%;
}

.fee-guide-body {
  width: 100%;
}

.fee-guide-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
}

/* 双行横向滚动：上下两行各自 flex 横排，行与行宽度独立；外层统一横向滚动条 */
.fee-guide-row--scroll {
  display: block;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  padding-bottom: 4px;
  scrollbar-width: thin;
  scrollbar-color: #c9cdd4 #eef0f3;
}

.fee-guide-row-2lines {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: max-content;
  box-sizing: border-box;
}

.fee-guide-line {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
}

.fee-guide-row--scroll::-webkit-scrollbar {
  height: 7px;
}

.fee-guide-row--scroll::-webkit-scrollbar-track {
  background: #eef0f3;
  border-radius: 999px;
}

.fee-guide-row--scroll::-webkit-scrollbar-thumb {
  background: #c9cdd4;
  border-radius: 999px;
}

.fee-guide-row--scroll::-webkit-scrollbar-thumb:hover {
  background: #b0b6bf;
}

.fee-guide-row--scroll .fee-chip {
  flex: 0 0 auto;
  scroll-snap-align: start;
}

/* 双行条带内名称单行省略，避免某一格过高拉乱行高 */
.fee-guide-row--scroll .fee-chip-text {
  -webkit-line-clamp: 1;
}

.fee-guide-pool-hint {
  margin: 8px 0 0;
  padding: 0;
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  color: #86909c;
  text-align: right;
}

/* chip 完全不等宽：随文案 + 头像自然宽度，仅上限防止单条占满整行 */
.fee-chip {
  flex: 0 0 auto;
  max-width: 100%;
}

.fee-chip-inner {
  display: flex;
  align-items: center;
  gap: 6px;
  width: max-content;
  max-width: 236px;
  min-width: 0;
  padding: 6px 8px;
  background: #fff;
  border: 0.5px solid #d7e2f4;
  border-radius: 6px;
  box-sizing: border-box;
}

.fee-chip-av {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.fee-chip-av img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fee-chip-text {
  min-width: 0;
  max-width: 196px;
  font-size: 13px;
  line-height: 1.35;
  color: #1a1a1a;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  overflow-wrap: anywhere;
}

.fee-agree {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  cursor: pointer;
  font-size: 14px;
  color: #444;
  line-height: 1.5;
}

.fee-agree-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.fee-agree-box {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.fee-agree-box--on {
  background: #4e53e0;
  border-color: #4e53e0;
}

.fee-agree-tick {
  width: 9px;
  height: 7px;
}

.fee-link {
  color: #4e53e0;
  text-decoration: none;
}

.fee-link:hover {
  text-decoration: underline;
}

.fee-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition:
    opacity 0.15s,
    box-shadow 0.15s;
}

.fee-btn:hover {
  opacity: 0.95;
  box-shadow: 0 2px 10px rgba(78, 83, 224, 0.2);
}

.fee-btn--outline {
  border: 1px solid #4e53e0;
  background: #fff;
  color: #4e53e0;
}

.fee-btn--primary {
  border: none;
  background: #4e53e0;
  color: #fff;
}

.fee-btn-ico-single {
  flex-shrink: 0;
  display: block;
}

.fee-btn--primary .fee-btn-ico-single--light {
  filter: brightness(0) invert(1);
}

.fee-toast {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 96px;
  margin-inline: auto;
  width: max-content;
  max-width: min(90vw, 360px);
  z-index: 10000;
  padding: 12px 20px;
  border-radius: 10px;
  background: rgba(29, 33, 41, 0.92);
  color: #fff;
  font-size: 14px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  pointer-events: none;
}

.fee-toast-enter-active,
.fee-toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fee-toast-enter-from,
.fee-toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* —— 关→开确认弹窗 Figma 3863:47183 —— */
.fee-pri-modal-root {
  position: fixed;
  inset: 0;
  z-index: 10020;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}

.fee-pri-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.fee-pri-modal {
  position: relative;
  width: min(552px, calc(100vw - 32px));
  max-height: min(90vh, 720px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow:
    0 9px 28px 8px rgba(0, 0, 0, 0.05),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08);
  font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  outline: none;
}

.fee-pri-modal-head {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid #f2f5fa;
  box-sizing: border-box;
}

.fee-pri-modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.3;
}

.fee-pri-modal-close {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: #595959;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.fee-pri-modal-close:hover {
  background: rgba(0, 0, 0, 0.06);
}

/* 12 人等长列表：头尾固定，中间两列网格 + 纵向滚动 + 细滚动条 */
.fee-pri-modal-body {
  flex: 1 1 auto;
  min-height: 0;
  padding: 24px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c9cdd4 #eef0f3;
}

.fee-pri-modal-body::-webkit-scrollbar {
  width: 6px;
}

.fee-pri-modal-body::-webkit-scrollbar-track {
  background: #eef0f3;
  border-radius: 3px;
}

.fee-pri-modal-body::-webkit-scrollbar-thumb {
  background: #c9cdd4;
  border-radius: 3px;
}

.fee-pri-modal-body::-webkit-scrollbar-thumb:hover {
  background: #b0b6bf;
}

.fee-pri-modal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-content: start;
}

.fee-pri-modal-card {
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border: 0.5px solid #e1e6ef;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  box-sizing: border-box;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.fee-pri-modal-card:hover {
  border-color: #c9d4ef;
  box-shadow: 0 1px 4px rgba(78, 83, 224, 0.08);
}

.fee-pri-modal-card--on {
  border-color: #4e53e0;
  box-shadow: 0 0 0 1px rgba(78, 83, 224, 0.25);
}

.fee-pri-modal-check {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.fee-pri-modal-check--on {
  background: #4e53e0;
  border-color: #4e53e0;
}

.fee-pri-modal-check--on img {
  display: block;
}

.fee-pri-modal-card-main {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.fee-pri-modal-av {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 0.7px solid #e1e6ef;
  box-sizing: border-box;
}

.fee-pri-modal-av img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fee-pri-modal-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fee-pri-modal-foot {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 24px 20px;
  border-top: 1px solid #f2f5fa;
  box-sizing: border-box;
  background: #fff;
}

.fee-pri-modal-selectall {
  display: inline-flex;
  align-items: flex-end;
  gap: 6px;
  padding: 4px 6px;
  margin: -4px -6px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
}

.fee-pri-modal-selectall:hover {
  background: rgba(0, 0, 0, 0.04);
}

.fee-pri-modal-check--inline {
  margin-bottom: 1px;
}

.fee-pri-modal-selectall-text {
  font-size: 12px;
  font-weight: 400;
  color: #75798a;
}

.fee-pri-modal-confirm {
  width: 140px;
  min-height: 32px;
  padding: 0 16px;
  border: 1px solid #4e53e0;
  border-radius: 6px;
  background: #4e53e0;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
}

.fee-pri-modal-confirm:hover {
  opacity: 0.94;
}

.fee-pri-modal-enter-active,
.fee-pri-modal-leave-active {
  transition: opacity 0.2s ease;
}

.fee-pri-modal-enter-from,
.fee-pri-modal-leave-to {
  opacity: 0;
}
</style>
