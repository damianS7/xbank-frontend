import type { GenderType } from "@/types/Customer";

export interface CustomerRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthdate: string;
  gender: GenderType;
  address: string;
  zipCode: string;
  country: string;
  nationalId: string;
}
