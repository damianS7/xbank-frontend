<script setup lang="ts">
import CustomAlert from "@/components/CustomAlert.vue";
import Button from "@/components/ui/button/Button.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref } from "vue";
import { z } from "zod";
import { genderOptions, genderValues, type GenderType } from "@/types/Gender";
import type { CustomerRegisterRequest } from "@/types/request/CustomerRegisterRequest";
import { useCustomerStore } from "@/stores/customer";

const alert = ref<InstanceType<typeof CustomAlert>>();

// store
const customerStore = useCustomerStore();

type FieldItem = {
  type: "text" | "email" | "password" | "select" | "date" | "number";
  placeholder: string;
  value: string;
  options?: { value: any; label: any }[];
};

type Field = {
  [key: string]: FieldItem;
};

// form fields
const form = ref<Field>({
  email: {
    type: "email",
    placeholder: "Email",
    value: "",
  },
  password: {
    type: "password",
    placeholder: "Password",
    value: "",
  },
  firstName: {
    type: "text",
    placeholder: "First name",
    value: "",
  },
  lastName: {
    type: "text",
    placeholder: "Last name",
    value: "",
  },
  phoneNumber: {
    type: "text",
    placeholder: "Phone",
    value: "",
  },
  gender: {
    type: "select",
    placeholder: "Gender",
    value: "",
    options: genderOptions,
  },
  birthDate: {
    type: "date",
    placeholder: "Birthdate",
    value: "",
  },
  zipCode: {
    type: "text",
    placeholder: "Zip code",
    value: "",
  },
  address: {
    type: "text",
    placeholder: "Address",
    value: "",
  },
  country: {
    type: "text",
    placeholder: "Country",
    value: "",
  },
  nationalId: {
    type: "text",
    placeholder: "National Id",
    value: "",
  },
});

// form errors
const formErrors = ref<Record<keyof typeof form.value, string[]>>({
  email: [],
  password: [],
  firstName: [],
  lastName: [],
  phoneNumber: [],
  gender: [],
  birthDate: [],
  zipCode: [],
  address: [],
  country: [],
  nationalId: [],
});

const resolver = z.object({
  email: z.string().trim().email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)"
    ),

  firstName: z
    .string()
    .trim()
    .min(2, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name is required")
    .max(50, "Last name cannot exceed 50 characters"),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,20}$/, "Please enter a valid phone number"),

  gender: z.enum(genderValues, {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),

  birthDate: z
    .string()
    .refine(
      (val) => !Number.isNaN(Date.parse(val)),
      "Please provide a valid birth date"
    )
    .transform((val) => new Date(val)),

  zipCode: z
    .string()
    .trim()
    .regex(/^\d{4,10}$/, "Please enter a valid ZIP code"),

  address: z
    .string()
    .trim()
    .min(4, "Address must be at least 4 characters long")
    .max(100, "Address cannot exceed 100 characters"),

  country: z
    .string()
    .trim()
    .min(2, "Country is required")
    .max(56, "Country name cannot exceed 56 characters"),

  nationalId: z
    .string()
    .trim()
    .min(6, "Please enter a valid national ID")
    .max(20, "National ID cannot exceed 20 characters"),
});

// Convert form fields to key, value array
function getFormData() {
  return Object.fromEntries(
    Object.entries(form.value).map(([key, field]) => [key, field.value])
  );
}

function resetFormErrors() {
  Object.keys(formErrors.value).forEach(
    (key) => (formErrors.value[key as keyof typeof form.value] = [])
  );
}

const onFormSubmit = async () => {
  resetFormErrors();
  const formData = getFormData();
  const result = resolver.safeParse(formData);

  // if fails to validate fields
  if (!result.success) {
    const fieldErrors: any = result.error.flatten().fieldErrors;

    Object.keys(fieldErrors).forEach((key) =>
      formErrors.value[key as keyof typeof form.value].push(...fieldErrors[key])
    );

    return;
  }

  const request: CustomerRegisterRequest = {
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phoneNumber: formData.phoneNumber,
    birthdate: formData.birthDate,
    gender: formData.gender as GenderType,
    address: formData.address,
    zipCode: formData.zipCode,
    country: formData.country,
    nationalId: formData.nationalId,
  };

  await customerStore
    .register(request)
    .then(() => {
      alert.value?.success("Account created.");
    })
    .catch((error) => {
      alert.value?.exception(error);
    });
};
</script>
<template>
  <form :resolver="resolver" @submit.prevent="onFormSubmit">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl"> Register </CardTitle>
        <CardDescription> Fill every field to register </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div
          v-for="(field, fieldKey) in form"
          :key="fieldKey"
          class="grid gap-2"
        >
          <Label :for="String(fieldKey)" class="capitalize">{{
            field.placeholder
          }}</Label>
          <Input
            v-if="field.type !== 'select'"
            v-model="field.value"
            :name="fieldKey"
            :type="field.type"
            :placeholder="field.placeholder"
            class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            v-if="field.type === 'select'"
            v-model="field.value"
            :name="String(fieldKey)"
            class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option
              v-for="(option, index) in field.options"
              :key="index"
              :value="option.label"
            >
              {{ option.label }}
            </option>
          </select>
          <p
            v-if="formErrors[fieldKey]"
            v-for="(error, eIndex) in formErrors[fieldKey]"
            :key="eIndex"
            class="text-sm text-red-500 ml-2"
          >
            {{ error }}
          </p>
        </div>
      </CardContent>
      <CardFooter class="flex flex-col gap-2">
        <Button class="w-full" type="submit"> Submit </Button>
        <CustomAlert ref="alert" />
      </CardFooter>
    </Card>
  </form>
</template>
