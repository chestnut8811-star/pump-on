// 新しい版があるときに「更新」ボタンを出す（シミュレーター中に勝手に再読込しない）

import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw } from 'lucide-react'

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      // 1時間ごとに更新を確認（開きっぱなしの端末向け）
      if (reg) setInterval(() => void reg.update(), 60 * 60 * 1000)
    },
  })

  if (!needRefresh && !offlineReady) return null
  return (
    <div className="pb-safe fixed inset-x-0 bottom-20 z-40 flex justify-center px-4">
      <div className="animate-pop flex w-full max-w-md items-center gap-3 rounded-2xl bg-navy px-4 py-3 text-white shadow-card">
        <RefreshCw size={20} className="shrink-0 text-[#3fd3c3]" />
        <p className="min-w-0 flex-1 text-sm">
          {needRefresh ? '新しい版があります。' : 'オフラインでも使えるようになりました。'}
        </p>
        {needRefresh ? (
          <button type="button" className="rounded-lg bg-brand px-3 py-2 text-sm font-bold" onClick={() => void updateServiceWorker(true)}>
            更新
          </button>
        ) : (
          <button type="button" className="rounded-lg px-3 py-2 text-sm font-bold text-white/80" onClick={() => setOfflineReady(false)}>
            OK
          </button>
        )}
        {needRefresh && (
          <button type="button" className="rounded-lg px-2 py-2 text-sm text-white/70" onClick={() => setNeedRefresh(false)}>
            後で
          </button>
        )}
      </div>
    </div>
  )
}
