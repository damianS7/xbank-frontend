<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { LineChart } from "@/components/ui/chart-line";
import { accountService } from "@/services/accountService";
interface CurrencyBalanceEndOfDay {
  balance: number;
  createdAt: Date;
}

const props = defineProps({
  currency: {
    type: String,
    required: true,
  },
});

// data
const rawData = ref<CurrencyBalanceEndOfDay[]>([]);

const data = computed(() =>
  rawData.value.map((transaction) => {
    const date = transaction.createdAt;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    // const formattedDate = `${year}-${month}-${day}`;

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    return {
      date: formattedDate, // x axis
      Balance: transaction.balance, // categoría (nombre visible)
    };
  })
);

onMounted(async () => {
  const data = await accountService.chartData(props.currency);
  rawData.value = data
    .map(([createdAt, balance]: [string, string]) => ({
      createdAt: new Date(createdAt),
      balance: Number(balance),
    }))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
});
</script>
<template>
  <LineChart
    v-if="rawData"
    index="date"
    :data="data"
    :show-legend="false"
    :categories="['Balance']"
    :colors="['blue', 'red']"
  />
</template>
<style scoped>
.unovis .label,
.unovis text {
  font-size: 6px !important;
}
</style>
