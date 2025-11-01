<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAccountStore } from "@/stores/account";
import { useCardStore } from "@/stores/card";
import CustomAlert from "@/components/CustomAlert.vue";
import BankingAccount from "@/views/banking/account/components/BankingAccount.vue";
import BankingAccountCards from "@/views/banking/account/components/BankingAccountCardList.vue";
import BankingAccountTransactions from "@/views/banking/account/BankingAccountTransactions.vue";
import { useTransactionStore } from "@/stores/transaction";
import { useModalStore } from "@/stores/modal";
import Button from "@/components/ui/button/Button.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import type { BankingCardType } from "@/types/BankingCard";
import type { BankingAccountTransferForm } from "@/types/form/BankingAccountTransferForm";
import PageLayout from "@/layouts/PageLayout.vue";

// ----

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
  const transfer: BankingAccountTransferForm = (await modalStore.open(
    "BankingAccountTransfer",
    {
      title: "Transfer to",
    }
  )) as BankingAccountTransferForm;

  // if transfer modal is cancelled ...
  if (!transfer) {
    return;
  }

  const password = (await modalStore.open("ConfirmPassword", {
    title: "Confirm password",
  })) as string;

  // if password modal is cancelled ...
  if (!password) {
    return;
  }

  await transactionStore
    .createBankingTransaction(
      accountId.toString(),
      transfer.accountNumber,
      transfer.amount,
      transfer.description,
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
  await accountStore
    .updateBankingAccountAlias(accountId.toString(), alias)
    .then((newAccount) => {
      accountStore.setAccount(newAccount);
    })
    .catch((error) => {
      alert.value?.exception(error);
    });
}

// Request a new banking card
async function requestCard() {
  const cardType = (await modalStore.open("RequestBankingCard", {
    title: "Request card",
  })) as BankingCardType;

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
</script>
<template>
  <PageLayout>
    <template #header>
      <div class="flex gap-2 items-center">
        <h1>Banking account</h1>
        <Badge
          v-if="account"
          size="sm"
          :variant="
            account?.accountStatus === 'ACTIVE'
              ? 'default'
              : ['CLOSED', 'SUSPENDED'].includes(account?.accountStatus || '')
                ? 'destructive'
                : 'default'
          "
        >
          {{ account?.accountStatus }}
        </Badge>
      </div>
      <div class="flex gap-2 items-center">
        <Button @click="transferTo" size="sm">Transfer</Button>
        <Button @click="requestCard" size="sm">Request card</Button>
      </div>
    </template>

    <template #content>
      <CustomAlert ref="alert" />

      <div class="flex flex-col gap-2" v-if="account">
        <BankingAccount
          v-if="account"
          :id="account.id"
          @update="setAlias"
          :editable="true"
        />

        <BankingAccountCards :accountId="account.id" />

        <BankingAccountTransactions
          :id="account.id"
          :currency="account.accountCurrency"
          ref="transactionRefs"
          :fetch="
            (id: number, page: number, size: number) =>
              transactionStore.fetchAccountTransactions(id, page, size)
          "
        />
      </div>

      <div v-else-if="!account" class="text-gray-600 text-center">
        Loading account ...
      </div>

      <div v-else class="text-gray-600 text-center">No account found ...</div>
    </template>
  </PageLayout>
</template>
