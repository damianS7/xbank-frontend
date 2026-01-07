import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { UserRegisterRequest } from "@/types/request/UserRegisterRequest";
import type { User } from "@/types/User";
import { userService } from "@/services/userService";
import { profileService } from "@/services/profileService";
import type { Profile } from "@/types/Profile";

export const useUserStore = defineStore("user", () => {
  const user = ref<User>(null);
  const initialized = ref(false);

  const getLoggedUser = computed(() => {
    return user.value;
  });

  const getFullName = computed(() => {
    return user.value.profile.firstName + " " + user.value.profile.lastName;
  });

  async function initialize() {
    await fetchUser().then((fuser) => {
      user.value = fuser;
      initialized.value = true;
    });
  }

  async function fetchUser(): Promise<User> {
    const user: User = await userService.fetchUser();
    // TODO use then
    try {
      const resource = await profileService.fetchProfileImage(user.id);
      user.profile.photoUrl = URL.createObjectURL(resource);
    } catch (error) {
      user.profile.photoUrl = "/default-avatar.jpg";
    }
    return user;
  }

  async function updateProfile(
    currentPassword: string,
    fieldsToUpdate: Record<string, any>
  ): Promise<Profile> {
    const updatedProfile: Profile = await profileService.updateProfile(
      currentPassword,
      fieldsToUpdate
    );

    // set the current avatar for the updated user
    updatedProfile.photoUrl = user.value.profile.photoUrl;
    user.value.profile = updatedProfile;
    return updatedProfile;
  }

  async function updateEmail(
    currentPassword: string,
    newEmail: string
  ): Promise<User> {
    const updatedUser = await userService.updateEmail(
      currentPassword,
      newEmail
    );
    user.value.email = updatedUser.email;
    return updatedUser;
  }

  async function updatePassword(currentPassword: string, newPassword: string) {
    await userService.updatePassword(currentPassword, newPassword);
  }

  async function getPhoto(userId?: number): Promise<Blob> {
    if (!userId) {
      userId = user.value.id;
    }

    return await profileService.fetchProfileImage(userId);
  }

  async function uploadPhoto(
    currentPassword: string,
    file: any
  ): Promise<Blob> {
    const blob = await profileService.uploadProfileImage(currentPassword, file);
    user.value.profile.photoUrl = URL.createObjectURL(blob);
    return blob;
  }

  async function register(fields: UserRegisterRequest) {
    return await userService.register(fields);
  }

  return {
    initialized,
    user,
    getLoggedUser,
    getFullName,
    fetchUser,
    updateProfile,
    updateEmail,
    updatePassword,
    getPhoto,
    uploadPhoto,
    initialize,
    register,
  };
});
