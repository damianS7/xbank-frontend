<script setup lang="ts">
import { computed, ref } from "vue";
import { useCardStore } from "@/stores/card";
import BankingCardFront from "@/views/banking/card/components/BankingCardFront.vue";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
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
  <div v-if="cards && currentCard" class="main-container">
    <section
      class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1 mb-1"
    >
      <h1>Cards</h1>
      <div class="flex flex-wrap gap-1 text-sm"></div>
    </section>

    <section class="flex flex-col items-center justify-center mt-4">
      <div class="flex flex-col items-center">
        <router-link
          :to="{ name: 'banking-card', params: { id: currentCard.id } }"
        >
          <BankingCardFront class="shadow-md w-full" :card="currentCard" />
        </router-link>
      </div>

      <div class="flex items-center mt-4 p-0 text-white bg-blue-500 rounded-lg">
        <button class="btn-sm cursor-pointer" @click="previousCard">
          <ChevronLeft />
        </button>
        <span> {{ currentCardIndex + 1 }} / {{ cards.length }} </span>
        <button class="btn-sm cursor-pointer" @click="nextCard">
          <ChevronRight />
        </button>
      </div>
    </section>
  </div>
  <div v-else>No cards</div>
</template>
