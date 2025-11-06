<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import BankingAccountListItem from "@/views/banking/account/components/BankingAccountListItem.vue";
import { computed, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import Button from "@/components/ui/button/Button.vue";
import { useModalStore } from "@/stores/modal";
import type {
  BankingAccountCurrency,
  BankingAccountType,
} from "@/types/BankingAccount";
import PageLayout from "@/layouts/PageLayout.vue";
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
  <PageLayout>
    <template #header>
      <div class="flex justify-between items-center">
        <h1>Accounts</h1>
        <Button @click="openAccount" size="sm">Open account</Button>
      </div>
    </template>

    <template #content>
      <CustomAlert ref="alert" />

      <div v-if="accounts" v-for="account in accounts" :key="account.id">
        <router-link
          :to="{ name: 'banking-account', params: { id: account.id } }"
        >
          <BankingAccountListItem :id="account.id" />
        </router-link>
      </div>

      <div v-else-if="!accounts" class="text-gray-600 text-center">
        Loading accounts ...
      </div>

      <div v-else class="text-gray-600 text-center">
        No accounts to show ...
      </div>
    </template>
  </PageLayout>
</template>
