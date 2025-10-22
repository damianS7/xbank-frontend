export type GenderType = "MALE" | "FEMALE";
export interface Customer {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  nationalId: string;
  postalCode: string;
  birthdate: string;
  gender: GenderType;
  photoUrl: string;
}
