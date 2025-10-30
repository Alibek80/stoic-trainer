/**
 * IndexedDB storage helpers for offline data persistence
 */

import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

// Define database schema
interface StoicDB extends DBSchema {
  reflections: {
    key: string;
    value: any;
    indexes: { 'by-user-id': string; 'by-date': string };
  };
  virtues: {
    key: string;
    value: any;
    indexes: { 'by-user-id': string; 'by-date': string };
  };
  reframes: {
    key: string;
    value: any;
    indexes: { 'by-user-id': string; 'by-date': string };
  };
  challenges: {
    key: string;
    value: any;
    indexes: { 'by-user-id': string; 'by-date': string };
  };
  moodLogs: {
    key: string;
    value: any;
    indexes: { 'by-user-id': string; 'by-date': string };
  };
  pending: {
    key: string;
    value: {
      id: string;
      table: string;
      action: 'insert' | 'update' | 'delete';
      data: any;
      timestamp: number;
    };
    indexes: { 'by-timestamp': number };
  };
}

let db: IDBPDatabase<StoicDB> | null = null;

/**
 * Initialize the IndexedDB database
 */
export async function initDB() {
  if (db) {
    return db;
  }

  db = await openDB<StoicDB>('stoic-trainer', 1, {
    upgrade(db) {
      // Reflections store
      const reflectionsStore = db.createObjectStore('reflections', {
        keyPath: 'id',
      });
      reflectionsStore.createIndex('by-user-id', 'user_id');
      reflectionsStore.createIndex('by-date', 'created_at');

      // Virtues store
      const virtuesStore = db.createObjectStore('virtues', {
        keyPath: 'id',
      });
      virtuesStore.createIndex('by-user-id', 'user_id');
      virtuesStore.createIndex('by-date', 'date');

      // Reframes store
      const reframesStore = db.createObjectStore('reframes', {
        keyPath: 'id',
      });
      reframesStore.createIndex('by-user-id', 'user_id');
      reframesStore.createIndex('by-date', 'created_at');

      // Challenges store
      const challengesStore = db.createObjectStore('challenges', {
        keyPath: 'id',
      });
      challengesStore.createIndex('by-user-id', 'user_id');
      challengesStore.createIndex('by-date', 'date');

      // Mood logs store
      const moodLogsStore = db.createObjectStore('moodLogs', {
        keyPath: 'id',
      });
      moodLogsStore.createIndex('by-user-id', 'user_id');
      moodLogsStore.createIndex('by-date', 'date');

      // Pending sync operations store
      const pendingStore = db.createObjectStore('pending', {
        keyPath: 'id',
      });
      pendingStore.createIndex('by-timestamp', 'timestamp');
    },
  });

  return db;
}

/**
 * Get database instance
 */
export async function getDB() {
  if (!db) {
    return await initDB();
  }
  return db;
}

/**
 * Save data to IndexedDB
 */
type StoreName = 'reflections' | 'virtues' | 'reframes' | 'challenges' | 'moodLogs';

export async function saveToLocalStorage(
  storeName: StoreName,
  data: any,
  userId?: string
) {
  const database = await getDB();

  // Add local storage metadata
  const localData = {
    ...data,
    user_id: userId || 'anonymous',
    _local_id: data.id || crypto.randomUUID(),
    _synced: false,
    _created_at: new Date().toISOString(),
  };

  await database.put(storeName, localData);
  return localData;
}

/**
 * Get data from IndexedDB
 */
export async function getFromLocalStorage<T>(
  storeName: StoreName,
  userId?: string
): Promise<T[]> {
  const database = await getDB();
  const data = await database.getAll(storeName);

  if (userId && userId !== 'anonymous') {
    return data.filter((item: any) => item.user_id === userId) as T[];
  }

  return data as T[];
}

/**
 * Get data by ID from IndexedDB
 */
export async function getByIdFromLocalStorage<T>(
  storeName: StoreName,
  id: string
): Promise<T | undefined> {
  const database = await getDB();
  return (await database.get(storeName, id)) as T | undefined;
}

/**
 * Delete data from IndexedDB
 */
export async function deleteFromLocalStorage(
  storeName: StoreName,
  id: string
): Promise<void> {
  const database = await getDB();
  await database.delete(storeName, id);
}

/**
 * Clear all data from IndexedDB
 */
export async function clearLocalStorage(): Promise<void> {
  const database = await getDB();
  const storeNames: Array<StoreName | 'pending'> = [
    'reflections',
    'virtues',
    'reframes',
    'challenges',
    'moodLogs',
    'pending',
  ];

  for (const storeName of storeNames) {
    await database.clear(storeName);
  }
}

/**
 * Mark data as synced
 */
export async function markAsSynced(
  storeName: StoreName,
  id: string
): Promise<void> {
  const database = await getDB();
  const data = await database.get(storeName, id);

  if (data) {
    await database.put(storeName, {
      ...data,
      _synced: true,
    });
  }
}

/**
 * Get unsynced data
 */
export async function getUnsyncedData(
  storeName: StoreName
): Promise<any[]> {
  const database = await getDB();
  const allData = await database.getAll(storeName);
  return allData.filter((item: any) => !item._synced);
}

/**
 * Add to pending sync queue
 */
export async function addToPendingQueue(
  table: string,
  action: 'insert' | 'update' | 'delete',
  data: any
): Promise<void> {
  const database = await getDB();
  const id = crypto.randomUUID();

  await database.put('pending', {
    id,
    table,
    action,
    data,
    timestamp: Date.now(),
  });
}

/**
 * Get pending sync operations
 */
export async function getPendingSync(): Promise<any[]> {
  const database = await getDB();
  return await database.getAllFromIndex('pending', 'by-timestamp');
}

/**
 * Remove from pending sync queue
 */
export async function removeFromPendingQueue(id: string): Promise<void> {
  const database = await getDB();
  await database.delete('pending', id);
}

/**
 * Check if IndexedDB is supported
 */
export function isIndexedDBSupported(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

