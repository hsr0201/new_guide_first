import { ref, onUnmounted } from 'vue'

/**
 * 轻量全局提示：多条队列或单条覆盖均可，此处为单条自动消失
 */
export function useToast(durationMs = 2400) {
  const visible = ref(false)
  const message = ref('')
  let timer = null

  function show(text) {
    message.value = text
    visible.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
      timer = null
    }, durationMs)
  }

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return { visible, message, show }
}
