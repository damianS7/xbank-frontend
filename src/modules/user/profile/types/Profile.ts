import type { GenderType } from "@/modules/user/user/types/Gender";

export interface Profile {
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
