<!-- ModalManager.vue -->
<script setup lang="ts">
import { Dialog } from "@/components/ui/dialog";
import { useModalStore } from "@/stores/modal";
import TransferModal from "@/views/banking/account/components/BankingAccountTransferModal.vue";
import RequestBankingCard from "@/views/banking/account/components/BankingAccountRequestCardModal.vue";
import ConfirmMessage from "@/components/modal/ConfirmMessageModal.vue";
import ConfirmPassword from "@/components/modal/ConfirmPasswordModal.vue";
import ConfirmNewPassword from "@/views/customer/profile/components/ProfileNewPasswordConfirmModal.vue";
import OpenAccount from "@/views/banking/account/components/BankingAccountOpenModal.vue";
const modalStore = useModalStore();

const modals = {
  OpenAccount,
  ConfirmMessage,
  ConfirmPassword,
  ConfirmNewPassword,
  RequestBankingCard,
  TransferModal,
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
