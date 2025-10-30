/**
 * Hook for autosaving data to local storage and syncing with Supabase
 */

import { useEffect, useRef, useState } from 'react';
import {
  saveToLocalStorage,
  markAsSynced,
  addToPendingQueue,
} from '@/lib/storage';

interface UseAutosaveOptions {
  delay?: number; // Delay in milliseconds before saving
  enabled?: boolean; // Whether autosave is enabled
  onSave?: (data: any) => Promise<void>; // Callback after successful save
  onError?: (error: Error) => void; // Callback on save error
}

export function useAutosave<T>(
  data: T,
  options: UseAutosaveOptions = {}
) {
  const {
    delay = 1000,
    enabled = true,
    onSave,
    onError,
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !data) {
      return;
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        setSaveStatus('saving');

        // Save to local storage first
        const savedData = await saveToLocalStorage('reflections', data);

        // Add to pending sync queue
        await addToPendingQueue('reflections', 'insert', savedData);

        // Mark as synced (will be synced with Supabase when online)
        await markAsSynced('reflections', savedData._local_id);

        if (onSave) {
          await onSave(savedData);
        }

        setSaveStatus('saved');
      } catch (error) {
        setSaveStatus('error');
        if (onError) {
          onError(error as Error);
        }
        console.error('Autosave error:', error);
      } finally {
        setIsSaving(false);
      }
    }, delay);

    // Cleanup on unmount or data change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, onSave, onError]);

  return {
    isSaving,
    saveStatus,
  };
}

/**
 * Hook for syncing local data with Supabase
 */
export function useSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  const sync = async () => {
    try {
      setIsSyncing(true);
      setSyncProgress(0);

      // Get all pending sync operations
      const { getPendingSync, removeFromPendingQueue } = await import(
        '@/lib/storage'
      );
      const pending = await getPendingSync();

      if (pending.length === 0) {
        setSyncProgress(100);
        return;
      }

      // Sync each pending operation
      for (let i = 0; i < pending.length; i++) {
        const operation = pending[i];
        try {
          // Sync to Supabase based on operation type
          const { supabase } = await import('@/lib/supabase');
          const { getCurrentUser } = await import('@/lib/supabase');

          const { user } = await getCurrentUser();
          if (!user) {
            throw new Error('User not authenticated');
          }

          switch (operation.action) {
            case 'insert': {
              const { data, error } = await supabase
                .from(operation.table)
                .insert(operation.data)
                .select()
                .single();

              if (error) throw error;

              // Remove from pending queue
              await removeFromPendingQueue(operation.id);
              break;
            }
            case 'update': {
              const { data, error } = await supabase
                .from(operation.table)
                .update(operation.data)
                .eq('id', operation.data.id)
                .select()
                .single();

              if (error) throw error;

              await removeFromPendingQueue(operation.id);
              break;
            }
            case 'delete': {
              const { error } = await supabase
                .from(operation.table)
                .delete()
                .eq('id', operation.data.id);

              if (error) throw error;

              await removeFromPendingQueue(operation.id);
              break;
            }
          }

          setSyncProgress(((i + 1) / pending.length) * 100);
        } catch (error) {
          console.error('Sync error for operation:', operation, error);
          // Continue with other operations even if one fails
        }
      }

      setSyncProgress(100);
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    syncProgress,
    sync,
  };
}


