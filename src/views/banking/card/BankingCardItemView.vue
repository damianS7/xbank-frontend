<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useCardStore } from "@/stores/card";
import BankingCardFront from "@/views/banking/card/components/BankingCardFront.vue";
import BankingCardBack from "@/views/banking/card/components/BankingCardBack.vue";
import Button from "@/components/ui/button/Button.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import BankingCardTransactions from "./components/BankingCardTransactions.vue";
import { useAccountStore } from "@/stores/account";
import { useModalStore } from "@/stores/modal";
import PageLayout from "@/layouts/PageLayout.vue";

// ---

// store
const accountStore = useAccountStore();
const cardStore = useCardStore();
const modalStore = useModalStore();

const route = useRoute();

// alert
const alert = ref();

const cardId = parseInt(route.params.id as string, 10);
const card = computed(() => cardStore.getBankingCard(cardId));
const currency = computed(() => {
  const bankingAccountId = card.value?.bankingAccountId;
  if (!bankingAccountId) return;
  return accountStore.getBankingAccount(bankingAccountId)?.accountCurrency;
});

async function setLock() {
  const confirm: string = (await modalStore.open("ConfirmMessage", {
    title: "Card lock",
    message: "Do you wish to lock this card?",
  })) as string;

  // if modal is cancelled ...
  if (!confirm) {
    return;
  }

  const password = (await modalStore.open("ConfirmPassword", {
    title: "Confirm password",
  })) as string;

  // if modal is cancelled ...
  if (!password) {
    return;
  }

  const newCardLockStatus =
    card.value?.lockStatus === "LOCKED" ? "UNLOCKED" : "LOCKED";

  await cardStore
    .setLockStatus(cardId, newCardLockStatus, password)
    .then((card) => {
      cardStore.setCard(card);
      alert.value.success("Card lock status updated.");
    })
    .catch((error) => {
      alert.value.exception(error.message);
    });
}

async function setPin() {
  const pin: string = (await modalStore.open("BankingCardSetPin", {
    title: "Set card PIN",
  })) as string;

  if (!pin) {
    return;
  }

  const password = (await modalStore.open("ConfirmPassword", {
    title: "Confirm password",
  })) as string;

  // if modal is cancelled ...
  if (!password) {
    return;
  }

  await cardStore
    .setCardPin(cardId, pin, password)
    .then((card) => {
      cardStore.setCard(card);
      alert.value.success("PIN updated.");
    })
    .catch((error) => {
      alert.value.exception(error.message);
    });
}

async function setDailyLimit() {
  const dailyLimit: number = (await modalStore.open("BankingCardDailyLimit", {
    title: "Card daily limit",
  })) as number;

  // if modal is cancelled ...
  if (!dailyLimit) {
    return;
  }

  const password = (await modalStore.open("ConfirmPassword", {
    title: "Confirm password",
  })) as string;

  // if modal is cancelled ...
  if (!password) {
    return;
  }

  await cardStore
    .setDailyLimit(cardId, dailyLimit, password)
    .then((card) => {
      cardStore.setCard(card);
      alert.value.success("Daily limit updated.");
    })
    .catch((error) => {
      alert.value.exception(error.message);
    });
}
</script>
<template>
  <PageLayout>
    <template #header>
      <div
        class="flex flex-col justify-center sm:flex-row items-center sm:justify-between gap-2"
      >
        <div
          class="flex flex-col justify-center sm:flex-row sm:justify-between items-center gap-2"
        >
          <h1>Banking card</h1>
          <div v-if="card" class="flex flex-1 items-center gap-1">
            <Badge
              size="sm"
              :variant="
                card?.cardStatus === 'ENABLED' ? 'success' : 'destructive'
              "
            >
              {{ card?.cardStatus }}
            </Badge>
            <Badge
              :variant="
                card.lockStatus === 'UNLOCKED' ? 'default' : 'destructive'
              "
              >{{ card?.lockStatus }}
            </Badge>
            <Badge :variant="card.dailyLimit > 0 ? 'destructive' : 'default'"
              >{{ card?.dailyLimit ? card?.dailyLimit + " LIMIT" : "NO LIMIT" }}
            </Badge>
          </div>
        </div>
        <div class="flex gap-1">
          <Button @click="setPin" size="sm"> PIN </Button>
          <Button @click="setLock" size="sm">
            {{ card?.lockStatus === "LOCKED" ? "UNLOCK" : "LOCK" }}
          </Button>
          <Button @click="setDailyLimit" size="sm"> LIMIT </Button>
        </div>
      </div>
    </template>

    <template #content>
      <CustomAlert ref="alert" />
      <slot v-if="card">
        <div
          class="flex flex-col sm:flex-row justify-center items-center gap-1"
        >
          <div class="aspect-[1.585/1] w-full sm:w-1/2 max-w-sm">
            <BankingCardFront :card="card" />
          </div>
          <div class="aspect-[1.585/1] w-full sm:w-1/2 max-w-sm">
            <BankingCardBack :card="card" />
          </div>
        </div>
        <BankingCardTransactions :card-id="card.id" :currency="currency" />
      </slot>

      <div
        v-if="!card"
        class="flex justify-center items-center p-4 rounded shadow bg-red-50"
      >
        <div class="text-center">
          <h1 class="text-2xl font-bold mb-4">Card not found</h1>
          <p class="text-red-600">Please check the card ID and try again.</p>
          <p class="text-red-600">
            If you think this is a mistake, please contact support.
          </p>
        </div>
      </div>
    </template>
  </PageLayout>
</template>
