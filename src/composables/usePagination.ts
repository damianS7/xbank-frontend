import type { PaginatedResponse } from "@/types/response/PaginatedResponse";
import { onMounted, ref } from "vue";

export function usePagination(onPageUpdate: () => any) {
  // pagination
  const currentPage = ref(0); // Spring usa 0-indexed
  const pagination = ref<PaginatedResponse>();

  function previousPage() {
    if (currentPage.value > 0) {
      currentPage.value--;
      onPageUpdate();
    }
  }

  function nextPage() {
    if (
      pagination.value &&
      currentPage.value < pagination.value?.totalPages - 1
    ) {
      currentPage.value++;
      onPageUpdate();
    }
  }

  let initialized = ref(false);

  function isInitialized() {
    return initialized.value;
  }

  onMounted(async () => {
    initialized.value = true;
  });

  return { isInitialized, nextPage, previousPage, currentPage, pagination };
}
