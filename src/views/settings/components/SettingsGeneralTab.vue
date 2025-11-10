<script setup lang="ts">
// vue core
import { ref } from "vue";

// store
import { useSettingStore } from "@/stores/setting";

// ui
import Button from "@/components/ui/button/Button.vue";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// state
const settingStore = useSettingStore();
</script>
<template>
  <TabsContent value="general">
    <Card>
      <CardContent>
        <div class="grid gap-6">
          <!-- theme Selector -->
          <div class="grid sm:grid-cols-[1fr_120px] items-center gap-4">
            <Field orientation="horizontal" class="flex justify-between">
              <FieldContent>
                <FieldLabel for="language">Theme</FieldLabel>
                <FieldDescription> Select the app theme. </FieldDescription>
              </FieldContent>
            </Field>
            <Select v-model="settingStore.settings.theme">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Theme</SelectLabel>
                  <SelectItem value="LIGHT"> Light </SelectItem>
                  <SelectItem value="DARK"> Dark </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <!-- Language Selector -->
          <div class="grid sm:grid-cols-[1fr_120px] items-center gap-4">
            <Field orientation="horizontal" class="flex justify-between">
              <FieldContent>
                <FieldLabel for="language">Language</FieldLabel>
                <FieldDescription> Select the app language. </FieldDescription>
              </FieldContent>
            </Field>
            <Select v-model="settingStore.settings.language">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Language</SelectLabel>
                  <SelectItem value="EN"> EN </SelectItem>
                  <SelectItem value="ES"> ES </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <!-- Cache clear -->
          <div class="grid sm:grid-cols-[1fr_120px] items-center gap-4">
            <Field orientation="horizontal" class="flex justify-between">
              <FieldContent>
                <FieldLabel for="cache">Delete cache</FieldLabel>
                <FieldDescription>
                  It clear session storage data.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Button
              size="xs"
              variant="destructive"
              class="data-[state=checked]:bg-blue-500"
              @click="$emit('deleteCache')"
              >Delete</Button
            >
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
</template>
