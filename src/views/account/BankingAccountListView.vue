<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import BankingAccount from "@/views/account/components/BankingAccount.vue";
import { computed, onMounted, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import { MessageType } from "@/types/Message";
import OpenAccountModal from "@/views/account/components/BankingAccountOpenModal.vue";
import { FieldException } from "@/exceptions/FieldException";
const accountStore = useAccountStore();

// message to show
const alert = ref();

const accounts = computed(() => accountStore.getBankingAccounts);

const modals = {
  openAccount: ref(),
};

// function to handle the submission of the open account modal
async function openAccount() {
  const accountData = await modals.openAccount.value.open();
  // if modal is cancelled, accountData will be undefined
  if (!accountData.type) {
    return;
  }

  await accountStore
    .requestBankingAccount(accountData.type, accountData.currency)
    .then((account) => {
      accountStore.addAccount(account);
      alert.value.showMessage(
        `Account ${account.accountNumber} created.`,
        MessageType.SUCCESS
      );
    })
    .catch((error) => {
      if (error instanceof FieldException) {
        alert.value.showException(error);
        return;
      }
      alert.value.showMessage(error.message, MessageType.ERROR);
    });
}

onMounted(() => {
  // accountStore.initialize();
});
</script>
<template>
  <div>
    <OpenAccountModal :ref="modals.openAccount" />
    <CustomAlert ref="alert" />

    <div class="flex justify-end rounded gap-1 mb-6">
      <button type="button" @click="openAccount" class="btn btn-blue btn-sm">
        Open account
      </button>
    </div>

    <div class="main-container">
      <section
        class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1 mb-1"
      >
        <h1>Accounts</h1>
        <div class="flex flex-wrap gap-1 text-sm"></div>
      </section>

      <div v-for="account in accounts" :key="account.id">
        <router-link :to="`/account/${account.id}`">
          <BankingAccount :id="account.id" />
        </router-link>
      </div>
    </div>
  </div>
</template>
