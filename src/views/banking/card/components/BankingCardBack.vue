<script setup lang="ts">
import { defineProps } from "vue";
import { BankingCard } from "@/types/BankingCard";
import { useCustomerStore } from "@/stores/customer";
const customerStore = useCustomerStore();

const props = defineProps<{
  card: BankingCard;
}>();
</script>
<template>
  <svg
    viewBox="0 0 400 250"
    class="rounded-xl shadow-lg"
    xmlns="http://www.w3.org/2000/svg"
    width="400"
  >
    <defs>
      <linearGradient
        id="gradient-fill2"
        x1="0"
        y1="0"
        x2="800"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#560ace" />
        <stop offset="0.2857142857142857" stop-color="#560ace" />
        <stop offset="0.42857142857142855" stop-color="#450bb4" />
        <stop offset="0.5714285714285714" stop-color="#360c9a" />
        <stop offset="0.7142857142857143" stop-color="#270b7f" />
        <stop offset="0.8571428571428571" stop-color="#1a0963" />
        <stop offset="1" stop-color="#0d0645" />
      </linearGradient>
    </defs>
    <rect width="400" height="250" rx="20" fill="url(#gradient-fill2)" />

    <!-- Franja magnética -->
    <rect x="0" y="30" width="400" height="40" fill="#393b3d" />

    <!-- Caja para la firma -->
    <rect x="20" y="120" width="260" height="40" fill="#eee" rx="4" />

    <!-- CVV -->
    <g>
      <!-- Etiqueta "CVV" -->
      <text x="290" y="135" font-size="10" fill="#fff">CVV</text>
      <text x="290" y="150" font-size="12" fill="#fff">
        {{ card.cardCVV }}
      </text>
    </g>

    <!-- PIN -->
    <g>
      <text x="320" y="135" font-size="10" fill="#fff">PIN</text>
      <text x="320" y="150" font-size="12" fill="#fff">
        {{ card.cardPIN }}
      </text>
    </g>

    <g width="400" height="300">
      <foreignObject x="20" y="170" width="400" height="100">
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="text-xs text-white break-words"
        >
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
          faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
          pretium tellus duis convallis.
        </div>
      </foreignObject>
    </g>
  </svg>
</template>
