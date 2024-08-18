<template>
  <MdPreview :editorId="id" :modelValue="text" :previewTheme="'github'" :theme="'light'" :codeFoldable="false"
    :showCodeRowNumber="false" />
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

// const id = 'preview-only';
// const text = ref(' \n```\n\n\n工具名称: summary\n\n工具状态: 调用成功\n\n工具输入: 培训.docx\n\n工具输出: 该文档总结了企业在IT系统管理和优化中的关键实践，重点关注以下几个方面：工具集成和自动化以提高效率，微服务架构与敏捷开发推动快速迭代；强调安全与风险管理，涵盖网络、API安全、权限管理及反诈措施，同时遵循法律法规，如个人信息保护法和数据安全法；架构治理通过团队协作进行规范化和问题解决；特别关注测试、网络安全以及账号权限管理，确保系统稳定和合规。在6月初和中旬，安全与架构治理有明确的实施计划。\n\n\n```\n ');
const scrollElement = document.documentElement;

// 接受的参数
const props = defineProps({
  text: String,
  id: String
})

const {
  id,
  text
} = props
 
</script>

<style>
.md-editor-preview-wrapper {
  padding: 5px 20px;
}

.hljs-deletion,
.hljs-name,
.hljs-section,
.hljs-selector-tag,
.hljs-subst {
  color: #444D56 !important
}

.md-editor-preview .md-editor-code .md-editor-code-head .md-editor-code-flag {
  display: none;
}

.md-editor-code-action {
  display: none;
}
</style>