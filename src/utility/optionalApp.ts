import type { DataNode } from "schema-node-core";

/**
 * Optional integration with schema-node-app.
 * schema-node-app is an optional peer dependency: the views work without it,
 * and the app-related features (PageNode pagination/filtering, AppNode lazy
 * loading) are activated only when the module is present.
 */

/** Structural mirror of schema-node-app's IArrayFieldFilter, keeps the optional dependency out of the public types */
export interface IArrayFieldFilter {
  /** The filter mode */
  mode: string;
  /** The filter name (function name or field name) */
  filter: string;
  /** The input nodes for the filter */
  nodes?: DataNode[];
  /** The subscription handlers for auto filter */
  handlers?: Function[];
}

/** The schema-node-app module shape */
export type SchemaNodeAppModule = typeof import("schema-node-app");

let appModule: SchemaNodeAppModule | undefined;
let probe: Promise<SchemaNodeAppModule | undefined> | null = null;

/**
 * Probes the optional schema-node-app module (cached, evaluated once).
 * Resolves with the module when present, or with undefined when absent.
 */
export function loadSchemaNodeApp(): Promise<SchemaNodeAppModule | undefined> {
  probe ??= import("schema-node-app")
    .then((mod: any) => (appModule = mod?.PageNode ? mod : (mod?.default ?? mod)))
    .catch(() => undefined);
  return probe;
}

/**
 * Gets the probed schema-node-app module.
 * Returns undefined before loadSchemaNodeApp resolves, or when the dependency is absent.
 */
export function getSchemaNodeApp(): SchemaNodeAppModule | undefined {
  return appModule;
}
