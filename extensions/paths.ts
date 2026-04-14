import { cpSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

const LEGACY_HOME = join(homedir(), ".pitagent");
const PI_HOME = join(homedir(), ".pi");
const GITAGENT_HOME = join(PI_HOME, "gitagent");
const CACHE_DIR = join(GITAGENT_HOME, "cache");
const MEMORY_DIR = join(GITAGENT_HOME, "memory");
const REGISTRY_PATH = join(GITAGENT_HOME, "installed.json");

const migrated = {
  cache: false,
  memory: false,
  registry: false,
};

function migrateIfMissing(from: string, to: string): void {
  if (!existsSync(from) || existsSync(to)) return;
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}

function ensureGitagentHome(): void {
  mkdirSync(GITAGENT_HOME, { recursive: true });
}

export function getGitagentHome(): string {
  return GITAGENT_HOME;
}

export function getCacheDir(): string {
  return CACHE_DIR;
}

export function getMemoryDir(): string {
  return MEMORY_DIR;
}

export function getRegistryPath(): string {
  return REGISTRY_PATH;
}

export function ensureCacheDir(): string {
  ensureGitagentHome();
  if (!migrated.cache) {
    migrateIfMissing(join(LEGACY_HOME, "cache"), CACHE_DIR);
    migrated.cache = true;
  }
  return CACHE_DIR;
}

export function ensureMemoryDir(): string {
  ensureGitagentHome();
  if (!migrated.memory) {
    migrateIfMissing(join(LEGACY_HOME, "memory"), MEMORY_DIR);
    migrated.memory = true;
  }
  return MEMORY_DIR;
}

export function ensureRegistryPath(): string {
  ensureGitagentHome();
  if (!migrated.registry) {
    migrateIfMissing(join(LEGACY_HOME, "installed.json"), REGISTRY_PATH);
    migrated.registry = true;
  }
  return REGISTRY_PATH;
}
