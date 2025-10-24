<script setup lang="ts">
import { defineProps } from "vue";
import type { BankingCard } from "@/types/BankingCard";
import { useCustomerStore } from "@/stores/customer";
const customerStore = useCustomerStore();

const props = defineProps<{
  card: BankingCard;
}>();

function formatCardNumber(number: string): string {
  return number.replace(/(.{4})/g, "$1 ").trim();
}
</script>
<template>
  <svg
    viewBox="0 0 400 250"
    class="rounded-xl shadow-lg"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:svgjs="http://svgjs.dev/svgjs"
    width="400"
  >
    <defs>
      <linearGradient id="gradient-fill" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#aa00ff" />
        <stop offset="25%" stop-color="#9600ff" />
        <stop offset="50%" stop-color="#6f00ff" />
        <stop offset="75%" stop-color="#5512fb" />
        <stop offset="100%" stop-color="#3c00ff" />
      </linearGradient>
    </defs>
    <rect width="400" height="250" fill="url(#gradient-fill)"></rect>

    <!-- Chip -->
    <rect x="30" y="60" width="50" height="35" rx="5" fill="#facc15" />
    <line x1="40" y1="60" x2="40" y2="95" stroke="#eab308" stroke-width="2" />
    <line x1="50" y1="60" x2="50" y2="95" stroke="#eab308" stroke-width="2" />

    <g
      xmlns="http://www.w3.org/2000/svg"
      transform="translate(330, 90) scale(2)"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFFFFF"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-nfc-icon lucide-nfc"
    >
      <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
      <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
      <path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" />
      <path d="M16.37 2a20.16 20.16 0 0 1 0 20" />
    </g>

    <!-- Nombre del banco -->
    <text x="30" y="40" fill="white" font-size="26" font-weight="bold">
      xBank
    </text>

    <!-- Marca ficticia (tipo VISA/MC) -->
    <circle cx="340" cy="210" r="20" fill="#ff5e00" />
    <circle cx="360" cy="210" r="20" fill="#fbbf24" fill-opacity="0.9" />

    <g transform="translate(30, 160)">
      <text fill="white" font-size="20" letter-spacing="3">
        {{ formatCardNumber(card?.cardNumber) }}
      </text>
      <text y="20" class="uppercase" fill="white" font-size="14">
        {{ customerStore?.getFullName }}
      </text>
    </g>

    <g transform="translate(220, 205)" fill="gray">
      <text font-size="12" y="0">Expired date</text>
      <text font-size="14" y="20">
        {{
          card?.expiredDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
          })
        }}
      </text>
    </g>
  </svg>
</template>
