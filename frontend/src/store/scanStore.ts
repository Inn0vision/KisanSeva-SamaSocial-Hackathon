import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ScanRecord {
  id: string;
  date: string;
  summary: string;
}

interface ScanState {
  scans: ScanRecord[];
  addScan: (scan: Omit<ScanRecord, 'id' | 'date'>) => void;
  clearScans: () => void;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set) => ({
      scans: [],
      addScan: (scan) => set((state) => ({
        scans: [
          {
            ...scan,
            id: Date.now().toString(),
            date: new Date().toISOString()
          },
          ...state.scans
        ].slice(0, 10) // Keep only the 10 most recent scans
      })),
      clearScans: () => set({ scans: [] }),
    }),
    {
      name: 'recent-scans-storage',
    }
  )
)
