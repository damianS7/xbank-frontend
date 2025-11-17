import { onMounted, onUnmounted, watch, type Ref } from "vue";

export function useScrollBottonDetect(
  element: Ref<HTMLDivElement | HTMLElement | null>,
  doOnBottom: () => any
) {
  watch(
    element,
    (el) => {
      if (!el) return;
      el.addEventListener("scroll", isScrollOnBottom);
    },
    { immediate: true }
  );

  // functions
  async function isScrollOnBottom() {
    if (!element.value) return;
    const { scrollTop, scrollHeight, clientHeight } = element.value;

    // detect when hits the bottom
    if (scrollTop + clientHeight >= scrollHeight) {
      // do something
      return doOnBottom();
    }
  }

  // lifecycle hooks
  onMounted(() => {});

  onUnmounted(() => {
    if (element.value) {
      element.value.removeEventListener("scroll", isScrollOnBottom);
    }
    // document.body.style.overflow = "";
  });

  return { isScrollOnBottom };
}
