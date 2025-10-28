<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import BankingAccount from "@/views/banking/account/components/BankingAccount.vue";
import { computed, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import Button from "@/components/ui/button/Button.vue";
import { useModalStore } from "@/stores/modal";
import type {
  BankingAccountCurrency,
  BankingAccountType,
} from "@/types/BankingAccount";
const accountStore = useAccountStore();

// message to show
const alert = ref();

const accounts = computed(() => accountStore.bankingAccounts);

const modalStore = useModalStore();

// function to handle the submission of the open account modal
async function openAccount() {
  const accountData = (await modalStore.open("OpenAccountModal", {
    title: "Open account",
  })) as {
    type: BankingAccountType;
    currency: BankingAccountCurrency;
  };

  // if modal is cancelled, accountData will be undefined
  if (!accountData.type) {
    return;
  }

  await accountStore
    .requestBankingAccount(accountData.type, accountData.currency)
    .then((account) => {
      accountStore.addAccount(account);
      alert.value.success(`Account ${account.accountNumber} created.`, {
        timeout: 5,
      });
    })
    .catch((error) => {
      alert.value.exception(error);
    });
}
</script>
<template>
  <div class="grid grid-rows-[auto_1fr] h-full">
    <section
      class="pg-section-header flex items-center justify-between text-xl font-bold border-b border-gray-300 p-2"
    >
      <h1>Accounts</h1>
      <Button @click="openAccount" size="sm">Open account</Button>
    </section>

    <section
      class="pg-section-content flex flex-col gap-4 overflow-auto h-full"
    >
      <CustomAlert ref="alert" />
      <div v-for="account in accounts" :key="account.id">
        <router-link
          :to="{ name: 'banking-account', params: { id: account.id } }"
        >
          <BankingAccount :id="account.id" />
        </router-link>
      </div>
    </section>
  </div>
</template>
