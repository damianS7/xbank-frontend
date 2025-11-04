<script setup lang="ts">
import { useSettingStore } from "@/stores/setting";
import { TabsContent } from "@/components/ui/tabs";
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
  <TabsContent value="security" class="">
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription> CardDescription </CardDescription>
      </CardHeader>
      <CardContent class="space-y-2"> Security </CardContent>
      <CardFooter> </CardFooter>
    </Card>
  </TabsContent>
</template>
