<template>
  <div class="editor" ref="container"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { monaco } from './customMonaco';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new JsonWorker();
    }
    return new EditorWorker();
  }
};
const container = ref<HTMLElement>();

let editor: monaco.editor.IStandaloneCodeEditor;

const props = defineProps<{ data: string }>();
const emit = defineEmits(['update:data']);

let stopWatch = watch(
  () => props.data,
  () => {
    if (!container.value?.contains(document.activeElement)) {
      editor.setValue(props.data);
    }
  }
);
onUnmounted(() => {
  stopWatch();
});
onMounted(async () => {
  const jsonModel = monaco.editor.createModel(props.data, 'json');
  editor = monaco.editor.create(container.value!, {
    model: jsonModel,
    tabSize: 2,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: 20,
    fontWeight: '900'
  });
  monaco.editor.defineTheme(
    'monokai',
    (await import('monaco-themes/themes/Monokai.json')) as monaco.editor.IStandaloneThemeData
  );
  monaco.editor.setTheme('monokai');

  editor.onDidChangeModelContent(() => {
    emit('update:data', editor.getValue());
  });
});
</script>
<style>
.editor {
  width: 100%;
  height: 100%;
}
</style>
