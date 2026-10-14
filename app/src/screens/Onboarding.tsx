// 初回の案内（アプリの説明 → 学び方 → 大切なお知らせ → 音声の確認）

import { useState } from 'react'
import { Ear, MessageSquareReply, Mic, Activity, ShieldCheck, Volume2, Check } from 'lucide-react'
import { Wordmark, PumpRotor } from '../components/brand'
import { Button } from '../components/ui'
import { useProgress } from '../store/progress'
import { useSettings } from '../store/settings'
import { speak, unlockSpeech, initSpeech } from '../engine/speech'
import { unlockAudio } from '../engine/sfx'

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [agree, setAgree] = useState(false)
  const [tested, setTested] = useState(false)
  const setOnboarded = useProgress((s) => s.setOnboarded)
  const rate = useSettings((s) => s.rate)

  const finish = () => {
    setOnboarded(true)
    // 記録を消されにくくする（対応端末のみ。許可されなくても動作に影響しない）
    void navigator.storage?.persist?.().catch(() => undefined)
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-navy text-white" role="dialog" aria-modal="true" aria-label="はじめに">
      <div className="hero-grad pt-safe pb-safe flex min-h-full flex-col">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
          <div className="flex justify-center gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-[#3fd3c3]' : 'w-1.5 bg-white/30'}`} />
            ))}
          </div>

          {step === 0 && (
            <div className="animate-pop flex flex-1 flex-col items-center justify-center text-center">
              <span className="text-[#3fd3c3]">
                <PumpRotor size={96} spinning hub="#0b1f3a" />
              </span>
              <div className="mt-6">
                <Wordmark size={34} />
              </div>
              <p className="mt-4 text-lg font-bold">人工心肺の英会話シミュレーター</p>
              <p className="mt-3 text-sm leading-relaxed text-balance text-white/75">
                外科医・麻酔科医・看護師と交わす英語を、手術の流れに沿って疑似体験しながら身につけます。
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="animate-pop flex flex-1 flex-col justify-center">
              <h2 className="text-2xl font-extrabold">4つのステップで学ぶ</h2>
              <ul className="mt-6 space-y-4">
                {[
                  { icon: <Ear size={22} />, t: '聞く', d: '相手の英語と数値を聞き取る' },
                  { icon: <MessageSquareReply size={22} />, t: '選ぶ', d: '状況に合う返答・復唱を選ぶ' },
                  { icon: <Mic size={22} />, t: '話す', d: '自分の声で言う（録音・音声入力）' },
                  { icon: <Activity size={22} />, t: '会話する', d: 'シミュレーターで手術の流れの中で応答' },
                ].map((x) => (
                  <li key={x.t} className="flex items-center gap-4 rounded-2xl bg-white/8 p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3fd3c3]/15 text-[#3fd3c3]">{x.icon}</span>
                    <span>
                      <span className="block font-bold">{x.t}</span>
                      <span className="block text-sm text-white/70">{x.d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-white/60">「簡単な言い方」「自然な言い方」「現場の短縮形」を並べて覚えられます。</p>
            </div>
          )}

          {step === 2 && (
            <div className="animate-pop flex flex-1 flex-col justify-center">
              <ShieldCheck size={36} className="text-[#ffc35a]" />
              <h2 className="mt-3 text-2xl font-extrabold">はじめる前に</h2>
              <ul className="mt-5 space-y-3 text-[14px] leading-relaxed text-white/85">
                <li>・教育・自己学習のための教材です。実際の人工心肺の管理は、<b>施設のプロトコルと担当医の指示</b>に従ってください。</li>
                <li>・会話やモニターの数値はすべて<b>例</b>です。症例は架空です。</li>
                <li>
                  ・教材は <b>AI が下書きしたもので、臨床の監修前</b>です。出典で確かめられなかった表現には「要確認」、施設や国で違う内容には「施設差あり」「地域差」を表示します。
                </li>
                <li>・学習記録はこの端末の中だけに保存されます。</li>
              </ul>
              <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl bg-white/10 p-4">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="h-5 w-5 accent-[#3fd3c3]" />
                <span className="text-sm font-bold">理解しました</span>
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="animate-pop flex flex-1 flex-col justify-center text-center">
              <Volume2 size={40} className="mx-auto text-[#3fd3c3]" />
              <h2 className="mt-3 text-2xl font-extrabold">音声を確かめる</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">ボタンを押すと英語が流れます。聞こえないときは、消音スイッチ（消音モード）と音量を確認してください。</p>
              <button
                type="button"
                onClick={() => {
                  unlockSpeech()
                  unlockAudio()
                  void initSpeech().then(() => speak('Pump on! Going on bypass.', { role: 'perfusionist', rate }))
                  setTested(true)
                }}
                className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#3fd3c3] text-navy shadow-card active:scale-95"
                aria-label="音声を再生"
              >
                <Volume2 size={40} />
              </button>
              {tested && (
                <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-[#3fd3c3]">
                  <Check size={16} /> “Pump on! Going on bypass.”
                </p>
              )}
              <p className="mt-6 text-xs leading-relaxed text-white/55">声の種類と速さは、下の「記録・設定」タブからいつでも変えられます。</p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-3">
            {step > 0 ? (
              <Button variant="ghost" className="text-white/80" onClick={() => setStep(step - 1)}>
                戻る
              </Button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={step === 2 && !agree}>
                次へ
              </Button>
            ) : (
              <Button onClick={finish}>はじめる</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
