<script setup lang="ts">
import { useSettingStore } from "@/stores/setting";
import Switch from "@/components/ui/switch/Switch.vue";
import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Field,
  FieldSet,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import Button from "@/components/ui/button/Button.vue";
// store
const settingStore = useSettingStore();
</script>
<template>
  <TabsContent value="notifications">
    <Card>
      <CardContent>
        <div class="grid gap-6">
          <!-- Email Notifications -->
          <div class="grid grid-cols-[1fr_auto] items-center gap-4">
            <Field orientation="horizontal" class="flex justify-between">
              <FieldContent>
                <FieldLabel for="email_notification"
                  >Email notifications</FieldLabel
                >
                <FieldDescription>
                  Enable or disable emails with notifications.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Switch
              v-model="settingStore.settings.emailNotifications"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- App Notifications -->
          <div class="grid grid-cols-[1fr_auto] items-center gap-4">
            <Field orientation="horizontal" class="flex justify-between">
              <FieldContent>
                <FieldLabel for="2fa">App notifications</FieldLabel>
                <FieldDescription>
                  Enable or disable app with notifications.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Switch
              v-model="settingStore.settings.appNotifications"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
</template>
