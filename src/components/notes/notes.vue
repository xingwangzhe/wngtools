<template>
  <el-input
    v-model="textcontent"
    style="width: 100%"
    :autosize="{ minRows: 5 }"
    type="textarea"
    placeholder="Please input"
  />
</template>
<script lang="ts" setup>
const textcontent = ref('');
</script>
