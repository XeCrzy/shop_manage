<template> 
 GoodsEdit 
</template> 
 
<script setup> 
const props = defineProps({ 
 id: { 
 type: Number 
 } 
}) 
 
const emit = defineEmits(['success']) 
</script>