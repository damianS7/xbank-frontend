<script setup lang="ts">
import { useSettingStore } from "@/stores/setting";
import Switch from "@/components/ui/switch/Switch.vue";
import { TabsContent } from "@/components/ui/tabs";
import {
  Field,
  FieldSet,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import Button from "@/components/ui/button/Button.vue";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

// store
const settingStore = useSettingStore();
</script>
<template>
  <TabsContent value="privacy" class="">
    <Card>
      <CardContent>
        <form class="grid gap-6">
          <div class="grid grid-cols-[1fr_120px] items-center gap-4">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel for="2fa"> Hide account. </FieldLabel>
                <FieldDescription>
                  It closes the account forever.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Button size="xs" class="data-[state=checked]:bg-blue-500"
              >Close</Button
            >
          </div>
        </form>
      </CardContent>
    </Card>
  </TabsContent>
</template>
