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
  <TabsContent value="account" class="">
    <Card>
      <CardContent>
        <form class="grid gap-6">
          <!-- Lock account -->
          <div class="grid sm:grid-cols-[1fr_120px] items-center gap-4">
            <Field orientation="horizontal" class="flex justify-between">
              <FieldContent>
                <FieldLabel for="2fa"> Lock account </FieldLabel>
                <FieldDescription>
                  Lock your account for a few days. Useful when you go on
                  vacation.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Button
              size="xs"
              variant="default"
              class="data-[state=checked]:bg-blue-500"
              >Lock account</Button
            >
          </div>

          <!-- close account -->
          <div class="grid sm:grid-cols-[1fr_120px] items-center gap-4">
            <Field orientation="horizontal" class="flex justify-between">
              <FieldContent>
                <FieldLabel for="2fa"> Close account </FieldLabel>
                <FieldDescription>
                  It closes the account forever.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Button
              size="xs"
              variant="destructive"
              class="data-[state=checked]:bg-blue-500"
              >Delete account</Button
            >
          </div>
        </form>
      </CardContent>
    </Card>
  </TabsContent>
</template>
