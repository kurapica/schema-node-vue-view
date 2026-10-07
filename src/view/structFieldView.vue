<template>
  <schema-view v-if="fldnode"
    :key="fldnode.id"
    :node="fldnode"
    :in-form="getSubNodeFormType(fldnode, inForm, skin)"
    :skin="skin"
    :readonly="readonly"
    :text="text">
    <template v-for="[name, slot] in slotEntries" :key="name" #[name]="slotProps">
      <component :is="slot" v-bind="slotProps" />
    </template>
  </schema-view>
</template>

<script setup lang="ts">
import { DataNode, IValueAccess, StructNode } from 'schema-node-core'
import { nextTick, onMounted, onUnmounted, shallowRef, toRaw, useSlots } from 'vue'
import schemaView from '../schemaView.vue'
import { SchemaNodeFormType } from '../enum/formType'
import { getSubNodeFormType } from '../schemaView'

const props = defineProps<{
  /** Struct Schema node */
  node: DataNode,

  /** field name */
  field: string,

  /** In-form settings */
  inForm?: SchemaNodeFormType

  /** Skin */
  skin?: string,

  /** Text */
  text?: any,

  /** Whether to show readonly */
  readonly?: boolean
}>()

const node = toRaw(props.node) as StructNode

// slots
const slots = useSlots()
const slotEntries = Object.entries(slots) as [string, (...args: any[]) => any][]

const fldnode = shallowRef<DataNode | undefined>(node.getAccessValue(props.field) as DataNode)

let sub: Function | undefined = undefined
const onNext =  async (next: IValueAccess) => {
  await nextTick();
  fldnode.value = next as DataNode;
  sub = fldnode.value?.subscribeMove(onNext);
}

onMounted(() => {  
  // When the field type is overrideable, the struct replaces the field node on
  // OverrideType changes (core's StructNode notifies subscribers when that happens).
  // Re-resolve the live field node by name on each struct notification.
  if (node.isFieldChangable(props.field)) {
    onNext(node.getAccessValue(props.field)!)
  }
})

onUnmounted(() => {
  sub?.()
  sub = undefined;
})
</script>

