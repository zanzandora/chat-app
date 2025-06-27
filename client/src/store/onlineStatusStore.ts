import { create } from 'zustand';

type OnlineStatus = Record<string, boolean>;

interface OnlineStatusState {
  onlineStatus: OnlineStatus;
  setStatus: (userId: string, status: boolean) => void;
  setBulkStatus: (statuses: OnlineStatus) => void;
}

export const useOnlineStatusStore = create<OnlineStatusState>((set) => ({
  onlineStatus: {},
  setStatus: (userId, status) =>
    set((state) => ({
      onlineStatus: { ...state.onlineStatus, [userId]: status },
    })),
  setBulkStatus: (statuses) => set(() => ({ onlineStatus: statuses })),
}));
