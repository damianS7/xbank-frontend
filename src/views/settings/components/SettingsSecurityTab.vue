<script setup lang="ts">
import { useSettingStore } from "@/stores/setting";
import { TabsContent } from "@/components/ui/tabs";
import Button from "@/components/ui/button/Button.vue";
import Switch from "@/components/ui/switch/Switch.vue";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldSet,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
// store
const settingStore = useSettingStore();
</script>
<template>
  <TabsContent value="security">
    <Card>
      <CardContent>
        <div class="grid gap-6">
          <!-- Sign operations -->
          <div class="grid grid-cols-[1fr_auto] items-center gap-4">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel for="sign_operations"> Sign operations </FieldLabel>
                <FieldDescription>
                  Request for sign every operation such as transfers. Need to
                  establish a global PIN.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Switch
              v-model="settingStore.settings.signOperations"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- Sign operation PIN -->
          <div
            v-if="settingStore.settings.signOperations"
            class="grid sm:grid-cols-[1fr_120px] items-center gap-4"
          >
            <Field orientation="horizontal" class="flex justify-between">
              <FieldContent>
                <FieldLabel for="cache">Sing operations PIN</FieldLabel>
                <FieldDescription>
                  It sets a PIN for sign operations.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Button
              size="xs"
              variant="default"
              class="data-[state=checked]:bg-blue-500"
              >Config</Button
            >
          </div>

          <!-- Multifactor -->
          <div class="grid grid-cols-[1fr_auto] items-center gap-4">
            <Field orientation="horizontal" class="flex justify-between">
              <FieldContent>
                <FieldLabel for="2fa"> Multi-factor authentication </FieldLabel>
                <FieldDescription>
                  Enable multi-factor authentication. If you do not have a
                  two-factor device, you can use a one-time code sent to your
                  email.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Switch
              v-model="settingStore.settings.multifactor"
              class="data-[state=checked]:bg-blue-500"
            />
          </div>

          <!-- 2FA Method -->
          <div class="grid sm:grid-cols-[1fr_120px] items-center gap-4">
            <Field orientation="horizontal" class="flex justify-between">
              <FieldContent>
                <FieldLabel for="language">Multifactor Method</FieldLabel>
                <FieldDescription>
                  Select the multifactor method to be used.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Select
              v-model="settingStore.settings.multifactorMethod"
              :disabled="!settingStore.settings.multifactor"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Multifactor method</SelectLabel>
                  <SelectItem value="EMAIL"> Email </SelectItem>
                  <SelectItem value="SMS"> SMS </SelectItem>
                  <SelectItem value="GOOGLE_AUTHENTICATOR">
                    Google Auth
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <!-- Session timeout -->
          <div class="grid sm:grid-cols-[1fr_120px] items-center gap-4">
            <Field orientation="horizontal" class="flex justify-between">
              <FieldContent>
                <FieldLabel for="2fa"> Session timeout </FieldLabel>
                <FieldDescription>
                  Choose a timeout for session expiring. Timeout is given on
                  minutes.
                </FieldDescription>
              </FieldContent>
            </Field>
            <NumberField
              id="timeout"
              v-model="settingStore.settings.sessionTimeout"
              :default-value="60"
              :min="1"
              :max="180"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
</template>
