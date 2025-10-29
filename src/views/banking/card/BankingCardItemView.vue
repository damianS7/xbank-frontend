<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useCardStore } from "@/stores/card";
import BankingCardFront from "@/views/banking/card/components/BankingCardFront.vue";
import BankingCardBack from "@/views/banking/card/components/BankingCardBack.vue";
import Button from "@/components/ui/button/Button.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import BankingTransactions from "@/views/banking/account/BankingAccountTransactions.vue";
import { useAccountStore } from "@/stores/account";
import { useTransactionStore } from "@/stores/transaction";
import Spinner from "@/components/ui/spinner/Spinner.vue";
import { useModalStore } from "@/stores/modal";
const accountStore = useAccountStore();
const transactionStore = useTransactionStore();
const cardStore = useCardStore();
const route = useRoute();
const isViewReady = ref(false);

// alert
const alert = ref();

// modals to show
const modalStore = useModalStore();

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

onMounted(async () => {
  isViewReady.value = true;
});
</script>
<template>
  <div v-if="card" class="grid grid-rows-[auto_1fr] h-full">
    <section
      class="pg-section-header flex items-center justify-between text-xl font-bold border-b border-gray-300 p-2 gap-2"
    >
      <div class="flex items-center gap-2">
        <span>Banking card</span>
        <Badge
          size="sm"
          :variant="card?.cardStatus === 'ENABLED' ? 'default' : 'destructive'"
        >
          {{ card?.cardStatus }}
        </Badge>
        <Badge
          :variant="card.lockStatus === 'UNLOCKED' ? 'default' : 'destructive'"
          >{{ card?.lockStatus }}
        </Badge>
        <Badge :variant="card.dailyLimit > 0 ? 'destructive' : 'default'"
          >{{ card?.dailyLimit ? card?.dailyLimit + " LIMIT" : "NO LIMIT" }}
        </Badge>
      </div>
      <div class="flex gap-2">
        <Button @click="setPin" size="sm"> SET PIN </Button>
        <Button @click="setLock" size="sm">
          {{ card?.lockStatus === "LOCKED" ? "UNLOCK" : "LOCK" }} CARD
        </Button>
        <Button @click="setDailyLimit" size="sm"> SET DAILY LIMIT </Button>
      </div>
    </section>

    <section
      class="pg-section-content flex flex-col gap-4 overflow-auto h-full"
    >
      <CustomAlert ref="alert" />
      <div v-if="card && isViewReady">
        <div class="main-container">
          <div class="flex justify-center my-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
              <div class="flex jusfity-center">
                <BankingCardFront v-if="card" :card="card" />
              </div>
              <div class="flex jusfity-center">
                <BankingCardBack v-if="card" :card="card" />
              </div>
            </div>
          </div>

          <div>
            <BankingTransactions
              :id="card.id"
              :currency="currency"
              :fetch="
                (id: number, page: number, size: number) =>
                  transactionStore.fetchCardTransactions(id, page, size)
              "
            />
          </div>
        </div>
      </div>
      <div v-else>
        <Spinner v-if="!isViewReady" />
      </div>

      <div
        v-if="!card && isViewReady"
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
    </section>
  </div>
  <!-- <ConfirmPasswordModal :ref="modals.confirmPassword" />
    <BankingCardSetPinModal :ref="modals.setPinModal" />
    <BankingCardLockModal
      :ref="modals.lockModal"
      :cardEnabled="card?.cardStatus === 'ENABLED'"
    />
    <BankingCardDailyLimitModal :ref="modals.dailyLimitModal" /> -->
</template>
