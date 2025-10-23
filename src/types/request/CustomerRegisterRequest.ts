import type { GenderType } from "@/types/Customer";

export interface CustomerRegisterRequest {
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: string;
  gender: GenderType;
}
