<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import BankingAccount from "@/views/banking/account/components/BankingAccount.vue";
import { computed, onMounted, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import Button from "@/components/ui/button/Button.vue";
import { useModalStore } from "@/stores/modal";
const accountStore = useAccountStore();

// message to show
const alert = ref();

const accounts = computed(() => accountStore.bankingAccounts);

const modalStore = useModalStore();

// function to handle the submission of the open account modal
async function openAccount() {
  const accountData = (await modalStore.open("OpenAccount", {
    title: "Open account",
  })) as string;

  // if modal is cancelled, accountData will be undefined
  if (!accountData.type) {
    return;
  }

  await accountStore
    .requestBankingAccount(accountData.type, accountData.currency)
    .then((account) => {
      accountStore.addAccount(account);
      alert.value.show(`Account ${account.accountNumber} created.`);
    })
    .catch((error) => {
      alert.value.exception(error);
    });
}

onMounted(() => {
  // accountStore.initialize();
});
</script>
<template>
  <div>
    <CustomAlert ref="alert" />

    <div class="flex justify-end rounded gap-1 mb-6">
      <Button @click="openAccount" size="sm"> Open account </Button>
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
