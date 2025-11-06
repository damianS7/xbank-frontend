<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAccountStore } from "@/stores/account";
import { useCardStore } from "@/stores/card";
import CustomAlert from "@/components/CustomAlert.vue";
import { ClipboardCopy, SquarePen, Save, SaveOff } from "lucide-vue-next";
import BankingAccountCards from "@/views/banking/account/components/BankingAccountCardList.vue";
import BankingAccountTransactions from "@/views/banking/account/components/BankingAccountTransactions.vue";
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
  formFields.value.isEditing = false;

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

const formFields = ref({
  name: "alias",
  type: "text",
  placeholder: "Alias",
  value: account.value?.alias,
  error: "",
  isEditing: false,
  edited: false,
});

function formatIban(iban: string): string {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

async function toClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}
</script>
<template>
  <PageLayout>
    <template #header>
      <div
        class="flex flex-col justify-center sm:flex-row items-center sm:justify-between gap-2"
      >
        <div
          class="flex flex-col justify-center sm:flex-row sm:justify-between items-center gap-2"
        >
          <h1>Banking account</h1>
          <div v-if="account" class="flex flex-1 items-center gap-1">
            <Badge
              size="sm"
              :variant="
                account?.accountStatus === 'ACTIVE'
                  ? 'success'
                  : ['CLOSED', 'SUSPENDED'].includes(
                        account?.accountStatus || ''
                      )
                    ? 'destructive'
                    : 'default'
              "
            >
              {{ account?.accountStatus }}
            </Badge>
            <Badge>{{ account?.accountType }}</Badge>
          </div>
        </div>
        <div
          v-if="account?.accountStatus === 'ACTIVE'"
          class="flex gap-2 items-center"
        >
          <Button @click="transferTo" size="sm">Transfer</Button>
          <Button @click="requestCard" size="sm">Request card</Button>
        </div>
      </div>
    </template>

    <template #content>
      <CustomAlert ref="alert" />

      <div class="flex flex-col gap-2" v-if="account">
        <div v-if="account" class="bg-white p-4 rounded shadow w-full">
          <div
            class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
          >
            <span
              class="flex items-center gap-2 text-xl font-semibold text-gray-800 break-all"
            >
              IBAN {{ formatIban(account.accountNumber) }}
              <ClipboardCopy
                @click="toClipboard(account.accountNumber)"
                :size="18"
              />
            </span>
          </div>

          <div
            class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-4"
          >
            <!-- Alias -->
            <div
              class="flex items-center gap-2 text-sm font-bold text-gray-700"
            >
              <div>
                <div
                  v-if="!formFields.isEditing"
                  class="flex gap-1 items-center"
                >
                  {{ account.alias || "" }}
                  <SquarePen
                    @click="formFields.isEditing = true"
                    class="cursor-pointer"
                  />
                </div>
                <div class="flex gap-1 items-center" v-else>
                  <input
                    type="text"
                    class="w-auto p-1 border rounded"
                    v-model="formFields.value"
                  />
                  <Save
                    class="text-green-500 cursor-pointer"
                    @click="
                      () => {
                        formFields.isEditing = false;
                        setAlias(formFields.value);
                      }
                    "
                  />
                  <SaveOff
                    class="text-red-500 cursor-pointer"
                    @click="formFields.isEditing = false"
                  />
                </div>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-green-600">
                {{ account.balance.toLocaleString() }}
                {{ account.accountCurrency }}
              </p>
            </div>
          </div>

          <div class="flex justify-end items-center mt-2">
            <span class="text-sm text-gray-500">
              Created at
              {{
                account.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </span>
          </div>
        </div>

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
