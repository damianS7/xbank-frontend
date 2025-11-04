<!-- ModalManager.vue -->
<script setup lang="ts">
import { Dialog } from "@/components/ui/dialog";
import { useModalStore } from "@/stores/modal";
import BankingAccountTransfer from "@/views/banking/account/components/modal/BankingAccountTransferModal.vue";
import RequestBankingCard from "@/views/banking/account/components/modal/BankingAccountRequestCardModal.vue";
import ConfirmMessage from "@/components/modal/ConfirmMessageModal.vue";
import ConfirmPassword from "@/components/modal/ConfirmPasswordModal.vue";
import ConfirmNewPassword from "@/views/profile/components/ProfileNewPasswordConfirmModal.vue";
import OpenAccountModal from "@/views/banking/account/components/modal/BankingAccountOpenModal.vue";
import BankingCardSetPin from "@/views/banking/card/components/modal/BankingCardSetPinModal.vue";
import BankingCardDailyLimit from "@/views/banking/card/components/modal/BankingCardDailyLimitModal.vue";
const modalStore = useModalStore();

const modals = {
  OpenAccountModal,
  ConfirmMessage,
  ConfirmPassword,
  ConfirmNewPassword,
  RequestBankingCard,
  BankingAccountTransfer,
  BankingCardSetPin,
  BankingCardDailyLimit,
};

function handleUpdateOpen() {
  modalStore.resolve(false);
}
</script>
<template>
  <Dialog v-model:open="modalStore.visible" @update:open="handleUpdateOpen">
    <component
      :is="modals[modalStore.component as keyof typeof modals]"
      v-bind="modalStore.props"
    />
  </Dialog>
</template>
