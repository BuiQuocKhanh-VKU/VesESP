import { create } from 'zustand'

interface SystemStore {
  vessel: {
    name: string
    imo: string
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  }
  setVessel: (vessel: SystemStore['vessel']) => void
}

export const useSystemStore = create<SystemStore>((set) => ({
  vessel: {
    name: 'Quốc Khánh 01',   
    imo: '9876543',
    status: 'ACTIVE',
  },
  setVessel: (vessel) => set({ vessel }),
}))