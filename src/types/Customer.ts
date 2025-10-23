import type { GenderType } from "@/types/Gender";
export interface Customer {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  nationalId: string;
  zipCode: string;
  country: string;
  birthdate: string;
  gender: GenderType;
  photoUrl: string;
}
