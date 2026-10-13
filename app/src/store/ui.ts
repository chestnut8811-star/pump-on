// 画面に一時的に出す通知（保存しない）

import { create } from 'zustand'

export interface Toast {
  id: number
  kind: 'badge' | 'goal' | 'info' | 'error'
  title: string
  body?: string
}

interface UiState {
  toasts: Toast[]
  push: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
}

let seq = 1

export const useUi = create<UiState>()((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = seq++
    set({ toasts: [...get().toasts, { ...t, id }] })
    setTimeout(() => get().dismiss(id), 3600)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

export function notify(t: Omit<Toast, 'id'>): void {
  useUi.getState().push(t)
}
