<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAccountStore } from "@/stores/account";
import { useCardStore } from "@/stores/card";
import CustomAlert from "@/components/CustomAlert.vue";
import BankingAccount from "@/views/banking/account/components/BankingAccount.vue";
import BankingAccountCards from "@/views/banking/account/components/BankingAccountCards.vue";
import BankingTransactions from "@/components/BankingTransactions.vue";
import { useTransactionStore } from "@/stores/transaction";
import { useModalStore } from "@/stores/modal";
const route = useRoute();
const accountStore = useAccountStore();
const transactionStore = useTransactionStore();
const cardStore = useCardStore();
const accountId = parseInt(route.params.id as string, 10);
const account = computed(() => accountStore.getBankingAccount(accountId));
const transactionRefs = ref();
// alert
const alert = ref();

// modals to show
const modalStore = useModalStore();

async function transferTo() {
  const transferData = (await modalStore.open("TransferModal", {
    title: "Transfer to",
  })) as string;

  if (!transferData || !transferData.accountNumber) {
    return;
  }

  const password = (await modalStore.open("ConfirmPassword", {
    title: "Open account",
  })) as string;
  if (!password) {
    return;
  }

  await transactionStore
    .createBankingTransaction(
      accountId.toString(),
      transferData.accountNumber,
      transferData.amount,
      transferData.description,
      "TRANSFER_TO",
      password
    )
    .then((transaction) => {
      accountStore.setBalance(accountId, transaction.lastBalance);
      transactionRefs.value.reloadTransactions();
      alert.value?.success("Transfered funds.");
    })
    .catch((error) => {
      alert.value?.exception(error);
    });
}

// Set alias for the banking account
async function setAlias(alias: string) {
  if (alias.length < 5) {
    alert.value?.error("Alias must be at least 5 characters long.");
    return;
  }

  const password = await modals.confirmPassword.value.open();

  if (!password) {
    alert.value?.error("Invalid password format.");
    return;
  }

  await accountStore
    .updateBankingAccountAlias(accountId.toString(), alias, password)
    .then((newAccount) => {
      accountStore.setAccount(newAccount);
    })
    .catch((error) => {
      alert.value?.exception(error);
    });
}

// Request a new banking card
async function requestCard() {
  const cardType = await modals.requestCard.value.open();
  if (!cardType) {
    return;
  }

  await accountStore
    .requestBankingCard(accountId.toString(), cardType)
    .then((card) => {
      cardStore.addCard(card);
      alert.value.success("Card " + card.cardNumber + " created.");
    })
    .catch((error) => {
      alert.value?.exception(error);
    });
}

onMounted(() => {
  // isViewReady.value = true;
});
</script>
<template>
  <div v-if="account">
    <CustomAlert ref="alert" />

    <div class="flex flex-col sm:flex-row sm:justify-end gap-1 mb-6">
      <button @click="transferTo" class="btn-sm btn-blue">TRANSFER TO</button>
      <button @click="requestCard" class="btn-sm btn-blue">REQUEST CARD</button>
    </div>

    <div class="main-container">
      <div>
        <h1
          class="flex flex-col sm:flex-row items-center text-2xl font-bold gap-1"
        >
          <span class="flex items-center">Banking account</span>

          <span
            class="text-xs rounded-full px-1"
            :class="{
              'text-orange-100 bg-orange-500':
                account?.accountStatus === 'CLOSED',
              'text-red-100 bg-red-500': account?.accountStatus === 'SUSPENDED',
              'text-green-100 bg-green-500': account?.accountStatus === 'OPEN',
            }"
            >{{ account?.accountStatus }}
          </span>
        </h1>
      </div>

      <div>
        <BankingAccount
          v-if="account"
          :id="account.id"
          @update="setAlias"
          :editable="true"
        />
      </div>

      <div class="my-6">
        <BankingAccountCards :accountId="account.id" />
      </div>

      <div>
        <BankingTransactions
          :id="account.id"
          :currency="account.accountCurrency"
          ref="transactionRefs"
          :fetch="
            (id: number, page: number, size: number) =>
              transactionStore.fetchAccountTransactions(id, page, size)
          "
        />
      </div>
    </div>
  </div>
  <div v-else>Loading account</div>
</template>
