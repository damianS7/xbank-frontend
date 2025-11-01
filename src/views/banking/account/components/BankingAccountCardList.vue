<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { defineProps } from "vue";
import { useCardStore } from "@/stores/card";
import {
  CreditCard,
  CircleChevronDown,
  CircleChevronUp,
} from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";
import Badge from "@/components/ui/badge/Badge.vue";

const cardStore = useCardStore();
const props = defineProps({
  accountId: {
    type: Number,
    required: true,
  },
});

const cards = computed(() =>
  cardStore.getBankingCardsByAccountId(props.accountId)
);

const showCards = ref(true);
const toggleCards = () => {
  showCards.value = !showCards.value;
};

function formatCardNumber(number: string): string {
  return number.replace(/(.{4})/g, "$1 ").trim();
}

onMounted(() => {
  if (!props.accountId) {
    return;
  }

  // if transactions are empty fetch them
  // if (account.value?.transactions?.length === 0) {
  //   // fetch transactions

  // }
  //   fetchTransactions();
  // isViewReady.value = true;
});
</script>
<template>
  <div v-if="cards">
    <div class="p-4 bg-white rounded shadow w-full">
      <div class="flex justify-between items-center border-b pb-2 mb-4">
        <h3 class="text-base sm:text-lg font-semibold text-gray-800">
          Associated cards
        </h3>
        <button v-if="showCards">
          <CircleChevronUp
            class="cursor-pointer text-gray-600 hover:text-gray-800 transition"
            @click="toggleCards"
          />
        </button>
        <button v-else>
          <CircleChevronDown
            class="cursor-pointer text-gray-600 hover:text-gray-800 transition"
            @click="toggleCards"
          />
        </button>
      </div>

      <div
        :visible="showCards"
        class="overflow-hidden transition-all duration-300 ease-in-out"
        :class="showCards ? 'max-h-96' : 'max-h-0'"
      >
        <ul class="space-y-2">
          <li v-for="(card, index) in cards" :key="index">
            <router-link
              :to="{ name: 'banking-card', params: { id: card.id } }"
              class="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-md p-3"
            >
              <!-- Número de tarjeta a la izquierda -->
              <div class="flex items-center font-medium text-gray-700">
                <CreditCard class="text-blue-600" />
                &nbsp;
                <span class="text-gray-500">
                  {{ formatCardNumber(card.cardNumber) }}
                </span>
              </div>

              <!-- Datos a la derecha -->
              <div class="flex flex-wrap gap-1 text-sm font-medium justify-end">
                <Badge variant="default">
                  {{ card.cardType }}
                </Badge>
                <Badge variant="default">
                  {{
                    card?.expiredDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                    })
                  }}
                </Badge>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div v-else class="grid grid-rows-[auto_1fr] h-full p-4">
    <p class="text-center">Loading account cards.</p>
  </div>
</template>
