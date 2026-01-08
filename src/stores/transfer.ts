import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { BankingTransfer } from "@/types/BankingTransfer";
import { transferService } from "@/services/transferService";
export const useTransferStore = defineStore("transfer", () => {
  const initialized = ref(false);
  const transfers = ref<BankingTransfer[]>([]);

  async function initialize() {
    await fetchTransfers().then((ftransfers) => {
      ftransfers.forEach((t) => {
        t.createdAt = new Date(t.createdAt);
      });

      transfers.value = ftransfers;
      initialized.value = true;
    });
  }

  const countPendingTransfers = computed(() => {
    return transfers.value.concat().filter((t) => t.status === "PENDING")
      .length;
  });

  const transfersSortedByDate = computed(() =>
    [...transfers.value].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )
  );

  async function fetchTransfers(): Promise<BankingTransfer[]> {
    const transfers: BankingTransfer[] = await transferService.fetchTransfers();
    return transfers;
  }

  async function createTransfer(
    fromAccountId: string,
    toAccountNumber: string,
    amount: number,
    description: string
  ): Promise<BankingTransfer> {
    const transfer: BankingTransfer = await transferService.transfer(
      fromAccountId,
      toAccountNumber,
      amount,
      description
    );

    transfer.createdAt = new Date(transfer.createdAt);

    transfers.value.unshift(transfer);

    return transfer;
  }

  async function approveTransfer(
    transferId: number,
    password: string
  ): Promise<BankingTransfer> {
    const transfer: BankingTransfer = await transferService.approve(
      transferId,
      password
    );

    transfer.createdAt = new Date(transfer.createdAt);

    transfers.value = transfers.value.map((t) =>
      t.id === transfer.id ? transfer : t
    );

    return transfer;
  }

  async function rejectTransfer(
    transferId: number,
    password: string
  ): Promise<BankingTransfer> {
    const transfer: BankingTransfer = await transferService.reject(
      transferId,
      password
    );

    transfer.createdAt = new Date(transfer.createdAt);

    transfers.value = transfers.value.map((t) =>
      t.id === transfer.id ? transfer : t
    );

    return transfer;
  }

  return {
    initialized,
    initialize,
    createTransfer,
    approveTransfer,
    rejectTransfer,
    transfersSortedByDate,
    countPendingTransfers,
  };
});
