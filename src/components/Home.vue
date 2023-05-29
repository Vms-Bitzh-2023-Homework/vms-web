<template>
  <h1>欢迎您，{{ userName }}</h1>
  <h1>今天是：{{ dateString }}</h1>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FormatDate from "../common/FormatDate";
import { FormatDateInfo } from "../common/FormatDate";
const dateString = ref<string>("");
const userName = ref<string>("");

userName.value = JSON.parse(
  atob(localStorage.getItem("token")?.split(".")[1] as string)
).userName;

dateString.value = FormatDate(new Date(), (formatDateInfo: FormatDateInfo) => {
  const { yyyy, MM, dd, w } = formatDateInfo;
  const weekDay: Array<String> = ["天", "一", "二", "三", "四", "五", "六"];
  return `${yyyy}年${MM}月${dd}日 星期${weekDay[Number(w)]}`;
});
</script>

<style scoped></style>
