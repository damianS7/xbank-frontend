import { defineStore } from "pinia";
import type { BankingCard, BankingCardLockStatus } from "@/types/BankingCard";
import { computed, ref } from "vue";
import { cardService } from "@/services/cardService";

export const useCardStore = defineStore("card", () => {
  const bankingCards = ref<BankingCard[]>([]);
  const initialized = ref(false);

  const countCards = computed(() => {
    return bankingCards.value.length;
  });

  const countCardsByAccount = computed(() => {
    return (accountId: number) => {
      return bankingCards.value.filter(
        (card) => card.bankingAccountId === accountId
      ).length;
    };
  });

  const getBankingCard = computed(() => {
    return (id: number) => {
      return bankingCards.value.find((card) => card.id === id);
    };
  });

  const getBankingCards = computed(() => {
    return bankingCards.value;
  });

  const getBankingCardsByAccountId = computed(() => {
    return (accountId: number) => {
      return bankingCards.value.filter(
        (card) => card.bankingAccountId === accountId
      );
    };
  });

  async function fetchBankingCards() {
    const cards = await cardService.fetchCards();
    return cards.map((card: any) => ({
      ...card,
      transactions: [],
      expiredDate: new Date(card.expiredDate),
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
    }));
  }

  async function setCardPin(
    cardId: number,
    pin: string,
    password: string
  ): Promise<BankingCard> {
    const card: BankingCard = await cardService.setPIN(cardId, pin, password);

    return {
      ...card,
      expiredDate: new Date(card.expiredDate),
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
    };
  }

  async function setDailyLimit(
    cardId: number,
    dailyLimit: number,
    password: string
  ): Promise<BankingCard> {
    const card: BankingCard = await cardService.setDailyLimit(
      cardId,
      dailyLimit,
      password
    );

    return {
      ...card,
      expiredDate: new Date(card.expiredDate),
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
    };
  }

  async function setLockStatus(
    cardId: number,
    lockStatus: BankingCardLockStatus,
    password: string
  ): Promise<BankingCard> {
    const card: BankingCard = await cardService.setLockStatus(
      cardId,
      lockStatus,
      password
    );

    return {
      ...card,
      expiredDate: new Date(card.expiredDate),
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
    };
  }

  function setCards(cards: any) {
    bankingCards.value = cards;
  }

  function setCard(card: BankingCard) {
    const index = bankingCards.value.findIndex((a) => a.id === card.id);
    if (index !== -1) {
      // bankingCards[index] = card; // non reactive
      bankingCards.value.splice(index, 1, card); // reactive
    }
  }

  function addCard(card: BankingCard) {
    bankingCards.value.push(card);
  }

  function setCardTransactions(cardId: number, transactions: any) {
    const index = bankingCards.value.findIndex((a) => a.id === cardId);
    if (index !== -1) {
      // bankingCards.splice(index, 1, transactions);
      bankingCards.value[index].transactions = transactions;
    }
  }

  function removeCard(cardId: number) {
    const index = bankingCards.value.findIndex((a) => a.id === cardId);
    if (index !== -1) {
      bankingCards.value.splice(index, 1);
    }
  }

  async function initialize() {
    await fetchBankingCards().then((cards) => {
      setCards(cards);
      initialized.value = true;
    });
  }

  return {
    countCards,
    bankingCards,
    initialized,
    initialize,
    setCardPin,
    setDailyLimit,
    setLockStatus,
    getBankingCard,
    getBankingCards,
    getBankingCardsByAccountId,
    countCardsByAccount,
    setCards,
    setCard,
    addCard,
    setCardTransactions,
    removeCard,
  };
});
