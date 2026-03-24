import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { BankingTransfer } from "@/modules/banking/transfers/types/BankingTransfer";
import { transferService } from "@/modules/banking/transfers/service/transferService";
import type { PaginatedResponse } from "@/types/api/response/PaginatedResponse";
export const useTransferStore = defineStore("transfer", () => {
  const initialized = ref(false);
  const transfers = ref<BankingTransfer[]>([]);
  const pagination = ref<PaginatedResponse>();

  async function initialize() {
    await fetchTransfers().then((ftransfers) => {
      ftransfers.content.forEach((t) => {
        t.createdAt = new Date(t.createdAt);
      });

      transfers.value = ftransfers.content;
      initialized.value = true;
    });
  }

  async function fetchTransfers(page: number = 0): Promise<PaginatedResponse> {
    const response: PaginatedResponse =
      await transferService.fetchTransfers(page);

    response.content = response.content.map((transfer: any) => ({
      ...transfer,
      createdAt: new Date(transfer.createdAt),
    }));

    pagination.value = response;
    // transfers.value.push(...response.content);
    transfers.value = response.content;

    return response;
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

  // async function fetchTransfers(): Promise<BankingTransfer[]> {
  //   const transfers: BankingTransfer[] = await transferService.fetchTransfers();
  //   return transfers;
  // }

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
    fetchTransfers,
    rejectTransfer,
    pagination,
    transfersSortedByDate,
    countPendingTransfers,
  };
});
