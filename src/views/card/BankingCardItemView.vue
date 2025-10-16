<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useCardStore } from "@/stores/card";
import BankingCardFront from "@/views/card/components/BankingCardFront.vue";
import BankingCardBack from "@/views/card/components/BankingCardBack.vue";
import { MessageType } from "@/types/Message";
import BankingCardSetPinModal from "@/views/card/components/BankingCardSetPinModal.vue";
import BankingCardLockModal from "@/views/card/components/BankingCardLockModal.vue";
import BankingCardDailyLimitModal from "@/views/card/components/BankingCardDailyLimitModal.vue";
import ConfirmPasswordModal from "@/components/modal/ConfirmPasswordModal.vue";
import BankingTransactions from "@/components/BankingTransactions.vue";
import { FieldException } from "@/exceptions/FieldException";
import { useAccountStore } from "@/stores/account";
import { useTransactionStore } from "@/stores/transaction";
import Spinner from "@/components/ui/spinner/Spinner.vue";
const accountStore = useAccountStore();
const transactionStore = useTransactionStore();
const cardStore = useCardStore();
const route = useRoute();
const isViewReady = ref(false);

// alert
const alert = ref();

// modals to show
const modals = {
  confirmPassword: ref(),
  setPinModal: ref(),
  dailyLimitModal: ref(),
  lockModal: ref(),
};

const cardId = parseInt(route.params.id as string, 10);
const card = computed(() => cardStore.getBankingCard(cardId));
const currency = computed(() => {
  const bankingAccountId = card.value?.bankingAccountId;
  if (!bankingAccountId) return;
  return accountStore.getBankingAccount(bankingAccountId)?.accountCurrency;
});

async function setLock() {
  const userConfirmed = await modals.lockModal.value.open();
  if (!userConfirmed) {
    return;
  }

  const password = await modals.confirmPassword.value.open();
  if (!password) {
    return;
  }

  const newCardLockStatus =
    card.value?.lockStatus === "LOCKED" ? "UNLOCKED" : "LOCKED";

  await cardStore
    .setLockStatus(cardId, newCardLockStatus, password)
    .then((card) => {
      cardStore.setCard(card);
      alert.value.showMessage("Card lock status updated.", MessageType.SUCCESS);
    })
    .catch((error) => {
      if (error instanceof FieldException) {
        alert.value.showException(error);
        return;
      }
      alert.value.showMessage(error.message, MessageType.ERROR);
    });
}

async function setPin() {
  const pin = await modals.setPinModal.value.open();
  if (!pin) {
    return;
  }

  const password = await modals.confirmPassword.value.open();
  if (!password) {
    return;
  }

  await cardStore
    .setCardPin(cardId, pin, password)
    .then((card) => {
      cardStore.setCard(card);
      alert.value.showMessage("PIN updated.", MessageType.SUCCESS);
    })
    .catch((error) => {
      if (error instanceof FieldException) {
        alert.value.showException(error);
        return;
      }
      alert.value.showMessage(error.message, MessageType.ERROR);
    });
}

async function setDailyLimit() {
  const dailyLimit = await modals.dailyLimitModal.value.open();

  if (!dailyLimit) {
    return;
  }

  const password = await modals.confirmPassword.value.open();
  if (!password) {
    return;
  }

  await cardStore
    .setDailyLimit(cardId, dailyLimit, password)
    .then((card) => {
      cardStore.setCard(card);
      alert.value.showMessage("Daily limit updated.", MessageType.SUCCESS);
    })
    .catch((error) => {
      if (error instanceof FieldException) {
        alert.value.showException(error);
        return;
      }
      alert.value.showMessage(error.message, MessageType.ERROR);
    });
}

onMounted(async () => {
  isViewReady.value = true;
});
</script>
<template>
  <div>
    <ConfirmPasswordModal :ref="modals.confirmPassword" />
    <BankingCardSetPinModal :ref="modals.setPinModal" />
    <BankingCardLockModal
      :ref="modals.lockModal"
      :cardEnabled="card?.cardStatus === 'ENABLED'"
    />
    <BankingCardDailyLimitModal :ref="modals.dailyLimitModal" />
    <CustomAlert ref="alert" />

    <div v-if="card && isViewReady">
      <div class="flex flex-wrap justify-end gap-1 mb-6">
        <button @click="setPin" class="btn-sm btn-blue w-full sm:w-auto">
          SET PIN
        </button>
        <button @click="setLock" class="btn-sm btn-blue w-full sm:w-auto">
          {{ card?.lockStatus === "LOCKED" ? "UNLOCK" : "LOCK" }} CARD
        </button>
        <button @click="setDailyLimit" class="btn-sm btn-blue w-full sm:w-auto">
          SET DAILY LIMIT
        </button>
      </div>

      <div class="main-container">
        <div
          class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1 mb-1"
        >
          <h1>User Card</h1>
          <div class="flex flex-wrap gap-1 text-sm">
            <span
              class="pill-xs"
              :class="{
                'text-red-100 bg-red-500': card?.cardStatus === 'DISABLED',
                'text-green-100 bg-green-500': card?.cardStatus === 'ENABLED',
              }"
              >{{ card?.cardStatus }}
            </span>
            <span
              class="pill-xs"
              :class="{
                'text-gray-100 bg-gray-500': card?.lockStatus === 'LOCKED',
                'text-green-100 bg-green-500': card?.lockStatus === 'UNLOCKED',
              }"
              >{{ card?.lockStatus }}
            </span>
            <span class="pill-xs bg-blue-500 text-blue-100"
              >{{ card?.dailyLimit ? card?.dailyLimit + " LIMIT" : "NO LIMIT" }}
            </span>
          </div>
        </div>

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
  </div>
</template>
