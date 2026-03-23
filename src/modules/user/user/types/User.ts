import type { Profile } from "@/modules/user/profile/types/Profile";

export interface User {
  id: number;
  email: string;
  role: string;
  profile: Profile;
}
