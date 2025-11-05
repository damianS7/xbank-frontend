<script setup lang="ts">
import { computed, ref } from "vue";
import { useCardStore } from "@/stores/card";
import BankingCardFront from "@/views/banking/card/components/BankingCardFront.vue";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
import PageLayout from "@/layouts/PageLayout.vue";
import CustomAlert from "@/components/CustomAlert.vue";

// ---

const cardStore = useCardStore();
const cards = cardStore.bankingCards;
const currentCardIndex = ref(0);
const currentCard = computed(() => {
  return cards[currentCardIndex.value];
});

function previousCard() {
  if (currentCardIndex.value <= 0) {
    return;
  }
  currentCardIndex.value--;
}

function nextCard() {
  if (currentCardIndex.value >= cards.length - 1) {
    return;
  }
  currentCardIndex.value++;
}
</script>
<template>
  <PageLayout>
    <template #header>
      <h1>Cards</h1>
    </template>

    <template #content>
      <CustomAlert ref="alert" />

      <div class="flex flex-col my-auto mx-auto gap-2">
        <slot v-if="cards && currentCard">
          <div class="flex flex-col items-center">
            <router-link
              :to="{ name: 'banking-card', params: { id: currentCard.id } }"
            >
              <BankingCardFront class="shadow-md w-full" :card="currentCard" />
            </router-link>
          </div>

          <div
            class="flex mx-auto items-center p-1 text-white bg-blue-500 rounded-lg"
          >
            <button class="btn-sm cursor-pointer" @click="previousCard">
              <ChevronLeft />
            </button>
            <span> {{ currentCardIndex + 1 }} / {{ cards.length }} </span>
            <button class="btn-sm cursor-pointer" @click="nextCard">
              <ChevronRight />
            </button>
          </div>
        </slot>

        <div v-else-if="!currentCard" class="text-gray-600 text-center">
          Loading card ...
        </div>

        <div v-else class="text-gray-600 text-center">No card to show ...</div>
      </div>
    </template>
  </PageLayout>
</template>
