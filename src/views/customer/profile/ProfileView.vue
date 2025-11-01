<script setup lang="ts">
import { useCustomerStore as useCustomerStore } from "@/stores/customer";
import CustomAlert from "@/components/CustomAlert.vue";
import { computed, ref } from "vue";
import ProfileEditableField from "./components/ProfileEditableField.vue";
import ProfilePhoto from "./components/ProfilePhotoUploader.vue";
import { genderOptions } from "@/types/Gender";
import { useModalStore } from "@/stores/modal";
import PageLayout from "@/layouts/PageLayout.vue";

// store
const modalStore = useModalStore();
const customerStore = useCustomerStore();

// message to show
const alert = ref<InstanceType<typeof CustomAlert>>();

// updatable fields to be displayed
const formFields = computed(() => [
  {
    name: "firstName",
    type: "text",
    placeholder: "First name",
    value: customerStore.customer.firstName,
    error: "",
    isEditing: false,
    edited: false,
    // validation: zod
  },
  {
    name: "lastName",
    type: "text",
    placeholder: "Last name",
    value: customerStore.customer.lastName,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email",
    value: customerStore.customer.email,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "phone",
    type: "text",
    placeholder: "Phone",
    value: customerStore.customer.phone,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "gender",
    type: "select",
    placeholder: "Gender",
    value: customerStore.customer.gender,
    options: genderOptions,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "birthdate",
    type: "date",
    placeholder: "Birthdate",
    value: customerStore.customer.birthdate,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "password",
    type: "password",
    placeholder: "New password",
    value: "*********",
    error: "",
    isEditing: false,
    edited: false,
  },
]);

// update a single field
async function updateField(field: { name: string; value: string }) {
  // updating email requires a different method
  if (field.name == "email") {
    updateEmail(field.value);
    return;
  }

  // updating password requires a different method
  if (field.name == "password") {
    updatePassword(field.value);
    return;
  }

  // wait for the user to input his password
  const currentPassword = (await modalStore.open("ConfirmPassword", {
    title: "Confirm Password",
  })) as string;

  // nothing to update
  if (field.value.length == 0 || !currentPassword) {
    return;
  }

  // request for update
  await customerStore
    .updateCustomer(currentPassword, {
      [field.name]: field.value,
    })
    .then((_profile) => {
      alert.value?.success("Field successfully updated.");
    })
    .catch((error) => {
      alert.value?.exception(error);
    });
}

// change the password
async function updatePassword(newPassword: string) {
  // wait for the user to input his password
  const currentPassword = (await modalStore.open("ConfirmPassword", {
    title: "Confirm current password",
  })) as string;

  // nothing to update
  if (currentPassword.length == 0 || newPassword.length == 0) {
    return;
  }

  // request for update
  await customerStore
    .updatePassword(currentPassword, newPassword)
    .then(() => {
      alert.value?.success("Password successfully updated.");
    })
    .catch((error) => {
      alert.value?.exception(error);
    });
}

// update profile photo
async function updatePhoto(photo: any) {
  // wait for the user to input his password
  const password = (await modalStore.open("ConfirmPassword", {
    title: "Confirm Password",
  })) as string;

  // if password is not set
  if (password.length == 0) {
    return;
  }

  await customerStore
    .uploadPhoto(password, photo)
    .then((_blob) => {
      alert.value?.success("Photo successfully updated.");
    })
    .catch((error) => {
      alert.value?.exception(error);
    });
}

// upade email field
async function updateEmail(newEmail: string) {
  const confirmed = await modalStore.open("ConfirmMessage", {
    title: "Confirm Email Change",
    message: "Session will be closed after you change your email.",
  });

  if (!confirmed) return;

  // wait for the user to input his password
  const currentPassword = (await modalStore.open("ConfirmPassword", {
    title: "Confirm Password",
  })) as string;

  // nothing to update
  if (newEmail.length == 0 || currentPassword.length == 0) {
    return;
  }

  // request for update
  await customerStore
    .updateEmail(currentPassword, newEmail)
    .then((_user) => {
      alert.value?.success("Field successfully updated.");
    })
    .catch((error) => {
      alert.value?.exception(error);
    });
}
</script>
<template>
  <PageLayout>
    <template #header>
      <h1>Profile</h1>
    </template>

    <template #content>
      <CustomAlert class="mb-4" ref="alert" />
      <div class="flex justify-center">
        <ProfilePhoto @update="updatePhoto" />
      </div>
      <div
        v-if="customerStore.customer"
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <ProfileEditableField
          v-for="(field, index) in formFields"
          :key="index"
          :index="index"
          :field="field"
          @update="updateField"
        />
      </div>

      <div
        v-else-if="!customerStore.customer"
        class="text-gray-600 text-center"
      >
        Loading profile ...
      </div>

      <div v-else class="text-gray-600 text-center">No profile to show ...</div>
    </template>
  </PageLayout>
</template>
