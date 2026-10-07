export { regBaseSchemaKindView, regSchemaTypeView } from './schemaView'
export * from './utility/locale'
export * from './utility/logger'
export * from './utility/toolset'

import { ArrayType, DataNode, EnumArrayNode, EnumType, EnumValueType, NS_SYSTEM_LOCALE_STRING, NS_SYSTEM_RANGE_DATE, NS_SYSTEM_RANGE_FULL_DATE, NS_SYSTEM_RANGE_MONTH, NS_SYSTEM_RANGE_YEAR, NS_SYSTEM_YEAR, NODE_KIND_ARRAY, NODE_KIND_BOOL, NODE_KIND_DATE, NODE_KIND_DECIMAL, NODE_KIND_ENUM, NODE_KIND_INT, NODE_KIND_OBJECT, NODE_KIND_STRING, NODE_KIND_STRUCT, StructType } from 'schema-node-core'

import schemaView from './schemaView.vue'
import arrayView from './view/arrayView.vue'
import boolView from './view/boolView.vue'
import dateView from './view/dateView.vue'
import yearView from './view/yearView.vue'
import flagsEnumView from './view/flagEnumView.vue'
import inputView from './view/inputView.vue'
import localeStringView from "./view/localeStringView.vue"
import anyView from './view/objectView.vue'
import rangeDateView from './view/rangeDateView.vue'
import structFieldView from './view/structFieldView.vue'
import structView from './view/structView.vue'
import tableView from './view/tableView.vue'
import pageTableView from './view/pageTableView.vue'
import { type App } from 'vue'
import { getSubNodeFormType, regBaseSchemaKindView, regSchemaTypeView, useSingleView } from './schemaView'

import { SchemaNodeFormType } from './enum/formType'
import { PageNode } from 'schema-node-app'

export { SchemaNodeFormType, getSubNodeFormType }

// base view
regBaseSchemaKindView(NODE_KIND_INT, inputView);
regBaseSchemaKindView(NODE_KIND_STRING, inputView);
regBaseSchemaKindView(NODE_KIND_DECIMAL, inputView);
regBaseSchemaKindView(NODE_KIND_ENUM, inputView, (node: DataNode, skin?: string) => {
  if ((node.type as EnumType).type === EnumValueType.Flags) return flagsEnumView;
  return undefined;
})
regBaseSchemaKindView(NODE_KIND_STRUCT, structView);
regBaseSchemaKindView(NODE_KIND_ARRAY, arrayView, (node: DataNode, skin?: string) => {
  if (node instanceof EnumArrayNode) return inputView;
  if (node instanceof PageNode) return pageTableView;
  if ((node.type as ArrayType).element instanceof StructType && !useSingleView((node.type as ArrayType).element!, skin)) return tableView;
  return undefined;
})
regBaseSchemaKindView(NODE_KIND_OBJECT, anyView);
regBaseSchemaKindView(NODE_KIND_BOOL, boolView);
regBaseSchemaKindView(NODE_KIND_DATE, dateView);

// type view
regSchemaTypeView(NS_SYSTEM_YEAR, yearView);
regSchemaTypeView(NS_SYSTEM_RANGE_YEAR, rangeDateView);
regSchemaTypeView(NS_SYSTEM_RANGE_MONTH, rangeDateView);
regSchemaTypeView(NS_SYSTEM_RANGE_DATE, rangeDateView);
regSchemaTypeView(NS_SYSTEM_RANGE_FULL_DATE, rangeDateView);
regSchemaTypeView(NS_SYSTEM_LOCALE_STRING, localeStringView, undefined, true);

schemaView.install = (app: App): void => { 
  app.component("SchemaView", schemaView);
  app.component("StructFieldView", structFieldView);
}

export {
  schemaView,
  arrayView,
  boolView,
  dateView,
  yearView,
  flagsEnumView,
  inputView,
  localeStringView,
  anyView,
  rangeDateView,
  structFieldView,
  structView,
  tableView,
  pageTableView,
}