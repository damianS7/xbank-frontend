import type { GenderType } from "@/modules/user/user/types/Gender";

export interface UserRegisterRequest {
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
