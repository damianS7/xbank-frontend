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
  <div v-if="account" class="grid grid-rows-[auto_1fr] h-full">
    <section
      class="pg-section-header flex items-center justify-between text-xl font-bold border-b border-gray-300 p-2 gap-2"
    >
      <div class="flex gap-2 items-center">
        <span>Banking account</span>
        <Badge
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
        <Button @click="transferTo" size="sm">TRANSFER TO</Button>
        <Button @click="requestCard" size="sm">REQUEST CARD</Button>
      </div>
    </section>

    <section
      class="pg-section-content flex flex-col gap-4 overflow-auto h-full"
    >
      <CustomAlert ref="alert" />

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
    </section>
  </div>
  <div class="grid grid-rows-[auto_1fr] h-full p-4" v-else>
    <p class="text-center">No account found.</p>
  </div>
</template>
