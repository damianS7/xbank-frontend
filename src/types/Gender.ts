export const genderValues = ["MALE", "FEMALE"] as const;

export type GenderType = (typeof genderValues)[number];

export const genderOptions = genderValues.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1),
}));
