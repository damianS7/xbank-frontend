import { defineStore } from "pinia";
import type { Customer } from "@/types/Customer";
import { computed, ref } from "vue";
import { customerService } from "@/services/customerService";
import type { CustomerRegisterRequest } from "@/types/request/CustomerRegisterRequest";

export const useCustomerStore = defineStore("customer", () => {
  const customer = ref<Customer>(null);
  const initialized = ref(false);

  const getLoggedCustomer = computed(() => {
    return customer.value;
  });

  const getFullName = computed(() => {
    return customer.value.firstName + " " + customer.value.lastName;
  });

  async function initialize() {
    await fetchCustomer().then((fcustomer) => {
      customer.value = fcustomer;
      initialized.value = true;
    });
  }

  async function fetchCustomer(): Promise<Customer> {
    const customer: Customer = await customerService.fetchCustomer();
    // TODO use then
    try {
      const resource = await customerService.fetchProfileImage(customer.id);
      customer.photoUrl = URL.createObjectURL(resource);
    } catch (error) {
      customer.photoUrl = "/default-avatar.jpg";
    }
    return customer;
  }

  async function updateCustomer(
    currentPassword: string,
    fieldsToUpdate: Record<string, any>
  ): Promise<Customer> {
    const updatedCustomer: Customer = await customerService.updateCustomer(
      currentPassword,
      fieldsToUpdate
    );

    // set the current avatar for the updated customer
    updatedCustomer.photoUrl = customer.value.photoUrl;
    customer.value = updatedCustomer;
    return updatedCustomer;
  }

  async function updateEmail(
    currentPassword: string,
    newEmail: string
  ): Promise<Customer> {
    const updatedCustomer = await customerService.updateEmail(
      currentPassword,
      newEmail
    );
    customer.value.email = updatedCustomer.email;
    return updatedCustomer;
  }

  async function updatePassword(currentPassword: string, newPassword: string) {
    await customerService.updatePassword(currentPassword, newPassword);
  }

  async function getPhoto(customerId?: number): Promise<Blob> {
    if (!customerId) {
      customerId = customer.value.id;
    }

    return await customerService.fetchProfileImage(customerId);
  }

  async function uploadPhoto(
    currentPassword: string,
    file: any
  ): Promise<Blob> {
    const blob = await customerService.uploadProfileImage(
      currentPassword,
      file
    );
    customer.value.photoUrl = URL.createObjectURL(blob);
    return blob;
  }

  async function register(fields: CustomerRegisterRequest) {
    return await customerService.register(fields);
  }

  return {
    initialized,
    customer,
    getLoggedCustomer,
    getFullName,
    fetchCustomer,
    updateCustomer,
    updateEmail,
    updatePassword,
    getPhoto,
    uploadPhoto,
    initialize,
    register,
  };
});
