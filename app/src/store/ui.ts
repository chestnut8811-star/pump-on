// 画面に一時的に出す通知（保存しない）
// 消すまでの時間は表示側（ToastHost）が、実際に表示した時点から数える。
// ドリルやシミュレーターの途中は表示を保留するので、出した時点から数えると見えないまま消えてしまう。

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
  push: (t) => set({ toasts: [...get().toasts, { ...t, id: seq++ }] }),
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

export function notify(t: Omit<Toast, 'id'>): void {
  useUi.getState().push(t)
}
