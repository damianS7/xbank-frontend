import type { Profile } from "./Profile";

export interface User {
  id: number;
  email: string;
  role: string;
  profile: Profile;
}
