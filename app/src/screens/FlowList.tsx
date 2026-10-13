// 会話リスト: 基本的な体外循環で交わす英語を、開始前からプロタミンまで流れの順に1ページで見る。
// 1行 = 話者・英語・日本語・読み上げボタン。並び順は content/flow-script.ts。

import { useEffect } from 'react'
import { ScreenHeader, Page } from '../components/chrome'
import { RoleAvatar } from '../components/content'
import { AudioButton } from '../components/audio'
import { PHASE_BY_ID, PHRASE_BY_ID } from '../content'
import { FLOW_SCRIPT } from '../content/flow-script'
import { ROLES } from '../content/roles'
import type { RoleId } from '../content/types'
import { useProgress } from '../store/progress'

const LEGEND: RoleId[] = ['surgeon', 'anesthesiologist', 'perfusionist', 'nurse', 'assistant']
const TOTAL = FLOW_SCRIPT.reduce((n, s) => n + s.ids.length, 0)

export default function FlowList() {
  const setLast = useProgress((s) => s.setLast)
  useEffect(() => {
    setLast({ path: '/flow', label: '会話リスト' })
  }, [setLast])

  return (
    <>
      <ScreenHeader title="会話リスト" sub={`開始前からプロタミンまで・${TOTAL}文`} back="/learn" />
      <Page>
        <div className="mt-3 rounded-2xl bg-card p-3 text-xs leading-relaxed text-sub shadow-card">
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {LEGEND.map((r) => (
              <span key={r} className="inline-flex items-center gap-1">
                <RoleAvatar role={r} size={18} />
                {r === 'perfusionist' ? 'あなた' : ROLES[r].ja}
              </span>
            ))}
          </div>
          <p className="mt-2">
            ▶ で読み上げます。色の付いた行が、あなた（臨床工学技士）の言う英語です。教材は AI 下書き・臨床未監修で、
            <span className="font-bold text-warn">要確認</span> は出典で言い回しを確かめられていない表現です。
          </p>
        </div>

        {FLOW_SCRIPT.map((sec, i) => {
          const ph = PHASE_BY_ID[sec.phase]
          return (
            <section key={sec.phase} className="mt-4">
              {/* 見出しはヘッダーの下に固定して、今どのシーンかを分かるようにする */}
              <h2 className="sticky z-10 -mx-4 bg-bg px-4 py-2" style={{ top: 'calc(env(safe-area-inset-top) + 3.5rem)' }}>
                <span className="num mr-1.5 font-bold text-brand-ink">{i + 1}</span>
                <span className="font-bold">{ph.titleJa}</span>
                <span className="en ml-1.5 text-xs font-semibold text-sub">{ph.titleEn}</span>
              </h2>
              <ol className="divide-y divide-line overflow-hidden rounded-2xl bg-card shadow-card">
                {sec.ids.map((id) => {
                  const p = PHRASE_BY_ID[id]
                  const mine = p.speaker === 'perfusionist'
                  return (
                    <li key={id} className={`flex items-center gap-2.5 px-3 py-2.5 ${mine ? 'bg-brand-soft' : ''}`}>
                      <RoleAvatar role={p.speaker} size={26} />
                      <div className="min-w-0 flex-1">
                        <p className="en text-[15px] font-semibold leading-snug">{p.en}</p>
                        <p className="mt-0.5 text-[12.5px] leading-snug text-sub">
                          {p.ja}
                          {p.status === 'needs-check' && <span className="ml-1.5 whitespace-nowrap text-[10px] font-bold text-warn">要確認</span>}
                        </p>
                      </div>
                      <AudioButton k={`flow:${id}`} size="sm" tone="light" item={{ text: p.en, role: p.speaker, tts: p.tts }} />
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}
      </Page>
    </>
  )
}
