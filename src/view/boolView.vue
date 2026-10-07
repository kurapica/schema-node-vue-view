<template>
   <span v-if="text && state.readonly" 
    :style="{'width': '100%', 'min-width': '120px', 'display': 'inline-block', 'text-align': text === true ? state.defaultAlign : text }">
      {{ state.data ? _L['YES'] : _L['NO'] }}
  </span>
  <el-switch v-else-if="state.require || !isNull(state.default)"  
  :style="{ 'width': '100%', 'text-align': text === true ? 'center' : text }"
      v-model="data" 
      :disabled="state.readonly || state.disable"
      active-color="#13ce66" 
      inactive-color="#ff4949">
  </el-switch>
  <el-select v-else 
      v-model="data" 
      style="width: 100%;" 
      clearable
      :placeholder="state.selectPlaceHolder"
      :disabled="state.readonly || state.disable">
      <el-option :label="_L['YES']" :value="true" />
      <el-option :label="_L['NO']" :value="false" />
  </el-select>
</template>

<script lang="ts" setup>
import { DataNode, Default, Disable, Display, formatLocaleString, isNull, IValueAccess, PropertyCtor, ReadOnly, Require, subscribeLanguage } from 'schema-node-core'
import { computed, onMounted, onUnmounted, reactive, toRaw } from 'vue'
import { _L } from '../utility/locale'
import { subscribeAncestorProperty } from '../utility/toolset';

// ── Template ──────────────────────────────────────────────────────
const props = defineProps<{
  /** Scalar schema node */
  node: DataNode,
  
  /** The readonly mode */
  readonly?: boolean,
  
  /** Display readon only value as plain text */
  text?: boolean | 'left' | 'right' | 'center',

  /** Debug mode */
  debug?: boolean
}>()
const node = toRaw(props.node)

// ── UI State ──────────────────────────────────────────────────────
/** Display state */
const state = reactive<{
  /** Data */
  data?: any,

  /** Default align */
  defaultAlign?: 'left' | 'right' | 'center',

  /** Select placeholder */
  selectPlaceHolder?: string,

  /** Default value */
  default?: any

  /** Disable */
  disable?: boolean,

  /** Require */
  require?: boolean,

  /** Readonly */
  readonly?: boolean
}>({ defaultAlign: 'left' })

/** Data Model */
const data = computed({
  get(): any { return state.data },
  set(value: any) { 
    if (!isNull(value)) {
      node.value = value
    }
    else if (state.require || !isNull(state.default)) {
      node.value = value ?? false
    }
    else {
      node.value = undefined
    }
  }
})

// ── Life Cycle ────────────────────────────────────────────────────
/** Subscription */
const subs: Function[] = []

onMounted(() => {
  subs.push(node.subscribe(() => {
    state.data = isNull(node.value) ? null : node.value
  }, true))
  
  // state change
  if (props.readonly) {
    state.readonly = true;
  }
  else {
    subs.push(subscribeAncestorProperty(node, ReadOnly, (values: boolean[]) => state.readonly = values.some(v => v), true))
    subs.push(subscribeAncestorProperty(node, Disable, (values: boolean[]) => state.disable = values.some(v => v), true))
  }
  subs.push(node.subscribeProperty(Default, (owner: IValueAccess, propCtor: PropertyCtor, newValue: any) => state.default = newValue as boolean, true))
  subs.push(node.subscribeProperty(Require, (owner: IValueAccess, propCtor: PropertyCtor, newValue: any) => state.require = newValue as boolean, true))

  // display
  subs.push(subscribeLanguage(async () => {
    state.selectPlaceHolder = formatLocaleString("PLACEHOLDER_SELECT", node.getPropertyValue(Display) ?? node.name);
  }, true));
})

onUnmounted(() => {
  subs.forEach(sub => sub())
})
</script>
