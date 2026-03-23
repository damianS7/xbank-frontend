<script setup lang="ts">
// import { useSettingStore } from "@/stores/setting";
import { TabsContent } from "@/components/ui/tabs";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldContent,
} from "@/components/ui/field";
import Button from "@/components/ui/button/Button.vue";
import { Card, CardContent } from "@/components/ui/card";

// store
// const settingStore = useSettingStore();
</script>
<template>
  <TabsContent value="privacy" class="">
    <Card>
      <CardContent>
        <div class="grid gap-6">
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
        </div>
      </CardContent>
    </Card>
  </TabsContent>
</template>
