// ドリル・復習の1問を表示する（形式ごとの UI と、答えたあとの解説）

import { useEffect, useMemo, useState } from 'react'
import { Check, Volume2, X, RotateCcw } from 'lucide-react'
import type { DrillQ } from '../engine/drills'
import { KIND_LABEL } from '../engine/drills'
import { PHRASE_BY_ID } from '../content'
import { ROLES } from '../content/roles'
import { useSpeak, AudioButton, Wave } from './audio'
import { SpeakPanel } from './SpeakPanel'
import { Button, Pill } from './ui'
import { NoteList, RegisterTag, RoleAvatar } from './content'
import { sfx } from '../engine/sfx'

export function QuestionView({ q, onAnswer, onNext }: { q: DrillQ; onAnswer: (correct: boolean) => void; onNext: () => void }) {
  const [picked, setPicked] = useState<number | string | null>(null)
  const [result, setResult] = useState<boolean | null>(null)
  const { play, playingKey } = useSpeak()
  const qKey = useMemo(() => `q:${Math.random().toString(36).slice(2)}`, [])

  // 聞き取り系は表示と同時に再生
  useEffect(() => {
    const a = q.kind === 'listen' || q.kind === 'catch' || q.kind === 'reply' ? q.audio : null
    if (!a) return
    const t = setTimeout(() => void play(`${qKey}:audio`, a), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  function finish(correct: boolean) {
    setResult(correct)
    if (correct) sfx.correct()
    else sfx.wrong()
    onAnswer(correct)
  }

  function choose(value: number | string, correct: boolean) {
    if (result !== null) return
    setPicked(value)
    finish(correct)
    // 正解の英語を「あなたの声」で聞かせる
    if (q.kind === 'situation') void play(`${qKey}:model`, q.options[q.answer])
    if (q.kind === 'reply') void play(`${qKey}:model`, q.options[q.answer])
  }

  const phrase = q.phraseId ? PHRASE_BY_ID[q.phraseId] : undefined
  const audioOn = playingKey === `${qKey}:audio`

  return (
    <div>
      <Pill tone="brand">{KIND_LABEL[q.kind]}</Pill>

      {/* ===== 問題 ===== */}
      {(q.kind === 'listen' || q.kind === 'catch' || q.kind === 'reply') && (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 text-sm">
            <RoleAvatar role={q.audio.role} size={26} />
            <span className="font-bold" style={{ color: ROLES[q.audio.role].color }}>
              {ROLES[q.audio.role].ja}
            </span>
            <span className="text-sub">が話しています</span>
          </div>
          <button
            type="button"
            onClick={() => void play(`${qKey}:audio`, q.audio)}
            className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-card transition active:scale-95 ${audioOn ? 'bg-navy' : 'bg-brand'}`}
            aria-label="もう一度聞く"
          >
            {audioOn ? <Wave /> : <Volume2 size={34} />}
          </button>
          <p className="text-xs text-sub">何度でも聞けます</p>
          {result !== null && <p className="en animate-pop text-center text-[17px] font-bold">{q.audio.text}</p>}
          {q.kind === 'catch' && <p className="text-[15px] font-bold">{q.prompt}</p>}
          {q.kind === 'reply' && <p className="text-[15px] font-bold">最も適切な返答（復唱を含む）は？</p>}
          {q.kind === 'listen' && <p className="text-[15px] font-bold">意味は？</p>}
        </div>
      )}

      {(q.kind === 'situation' || q.kind === 'speak') && (
        <div className="mt-4 rounded-2xl bg-card p-5 shadow-card">
          <p className="text-xs font-bold text-sub">場面</p>
          {q.prompt.split('\n').map((t, i) => (
            <p key={i} className={i === 0 ? 'mt-1 text-sm text-sub' : 'mt-2 text-[17px] font-bold leading-snug'}>
              {t}
            </p>
          ))}
        </div>
      )}

      {q.kind === 'shorthand' && (
        <div className="mt-4 rounded-2xl bg-card p-5 text-center shadow-card">
          <p className="text-xs font-bold text-sub">現場の短縮形</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <p className="en text-2xl font-extrabold">{q.shown.text}</p>
            <AudioButton k={`${qKey}:sh`} item={q.shown} size="sm" />
          </div>
          <p className="mt-2 text-[15px] font-bold">どういう意味？</p>
        </div>
      )}

      {/* ===== 選択肢 ===== */}
      {(q.kind === 'listen' || q.kind === 'catch' || q.kind === 'shorthand') && (
        <div className="mt-4 grid gap-2">
          {q.options.map((o) => {
            const isAns = o === q.answer
            const state = result === null ? '' : isAns ? 'border-ok bg-ok-soft' : picked === o ? 'border-ng bg-ng-soft' : 'opacity-60'
            return (
              <button
                key={o}
                type="button"
                onClick={() => choose(o, isAns)}
                className={`flex min-h-13 w-full items-center gap-2 rounded-2xl border-2 border-line bg-card px-4 py-3 text-left text-[15px] font-semibold transition active:scale-[0.99] ${state} ${
                  q.kind === 'catch' ? 'num justify-center text-xl' : ''
                }`}
              >
                <span className="flex-1">{o}</span>
                {result !== null && isAns && <Check size={18} className="text-ok" />}
                {result !== null && !isAns && picked === o && <X size={18} className="text-ng" />}
              </button>
            )
          })}
        </div>
      )}

      {(q.kind === 'situation' || q.kind === 'reply') && (
        <div className="mt-4 grid gap-2">
          {q.options.map((o, i) => {
            const isAns = i === q.answer
            const state = result === null ? '' : isAns ? 'border-ok bg-ok-soft' : picked === i ? 'border-ng bg-ng-soft' : 'opacity-60'
            return (
              <div key={i} className={`flex items-center gap-2 rounded-2xl border-2 border-line bg-card pr-2 transition ${state}`}>
                <button type="button" onClick={() => choose(i, isAns)} className="en min-h-13 flex-1 px-4 py-3 text-left text-[16px] font-semibold">
                  {o.text}
                </button>
                {result !== null && (
                  <AudioButton k={`${qKey}:o${i}`} item={o} size="sm" tone="light" />
                )}
              </div>
            )
          })}
        </div>
      )}

      {q.kind === 'order' && <OrderTask q={q} done={result !== null} onDone={(ok) => finish(ok)} />}

      {q.kind === 'speak' && result === null && (
        <div className="mt-4">
          <SpeakPanel target={q.target.text} tts={q.target.tts} keywords={q.keywords} accept={q.accept} onResult={(r) => finish(r.ok)} />
        </div>
      )}

      {/* ===== 解説 ===== */}
      {result !== null && (
        <div className="animate-pop mt-4 rounded-2xl bg-card p-4 shadow-card">
          <p className={`flex items-center gap-1.5 text-lg font-extrabold ${result ? 'text-ok' : 'text-ng'}`}>
            {result ? <Check size={22} /> : <X size={22} />}
            {result ? '正解！' : q.kind === 'speak' ? 'もう少し' : '不正解'}
          </p>
          {phrase && (
            <div className="mt-3 space-y-3">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="en text-[17px] font-bold leading-snug">{phrase.en}</p>
                  <p className="text-sm text-sub">{phrase.ja}</p>
                </div>
                <AudioButton k={`${qKey}:ph`} item={{ text: phrase.en, role: phrase.speaker, tts: phrase.tts }} size="sm" />
              </div>
              {phrase.variants.length > 0 && (
                <ul className="space-y-1">
                  {phrase.variants.map((v, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <RegisterTag register={v.register} />
                      <span className="en">{v.en}</span>
                    </li>
                  ))}
                </ul>
              )}
              {phrase.replies.length > 0 && q.kind !== 'reply' && (
                <p className="text-xs text-sub">
                  返答の例: <span className="en font-semibold text-ink">{phrase.replies[0].en}</span>
                </p>
              )}
              <NoteList notes={phrase.notes?.filter((n) => n.kind !== 'tip').slice(0, 2)} />
            </div>
          )}
          <Button block size="lg" className="mt-4" onClick={onNext}>
            次へ
          </Button>
        </div>
      )}
    </div>
  )
}

function OrderTask({ q, done, onDone }: { q: Extract<DrillQ, { kind: 'order' }>; done: boolean; onDone: (ok: boolean) => void }) {
  const [seq, setSeq] = useState<number[]>([])
  const remaining = q.shuffled.filter((i) => !seq.includes(i))
  const ok = seq.length === q.lines.length && seq.every((v, i) => v === i)

  return (
    <div className="mt-4">
      <p className="text-[15px] font-bold">会話が自然な順になるように、上から順にタップ</p>
      <ol className="mt-3 space-y-2">
        {seq.map((i, pos) => {
          const l = q.lines[i]
          const right = done ? i === pos : null
          return (
            <li
              key={i}
              className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-2 ${right === null ? 'border-brand bg-brand-soft' : right ? 'border-ok bg-ok-soft' : 'border-ng bg-ng-soft'}`}
            >
              <span className="num w-5 text-sm font-bold text-sub">{pos + 1}</span>
              <RoleAvatar role={l.role} size={24} />
              <span className="en flex-1 text-[15px] font-semibold">{l.en}</span>
            </li>
          )
        })}
      </ol>
      {!done && (
        <div className="mt-3 space-y-2">
          {remaining.map((i) => {
            const l = q.lines[i]
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  const next = [...seq, i]
                  setSeq(next)
                  // 最後の1つを置いたら採点
                  if (next.length === q.lines.length) onDone(next.every((v, k) => v === k))
                }}
                className="flex w-full items-center gap-2 rounded-2xl border-2 border-line bg-card px-3 py-2.5 text-left transition active:scale-[0.99]"
              >
                <RoleAvatar role={l.role} size={24} />
                <span className="en flex-1 text-[15px] font-semibold">{l.en}</span>
              </button>
            )
          })}
          {seq.length > 0 && (
            <button type="button" onClick={() => setSeq([])} className="inline-flex items-center gap-1 text-sm text-sub underline">
              <RotateCcw size={14} />
              やり直す
            </button>
          )}
        </div>
      )}
      {done && !ok && (
        <div className="mt-3 rounded-2xl bg-card p-3 shadow-card">
          <p className="text-xs font-bold text-sub">正しい順</p>
          <ol className="mt-1 space-y-1">
            {q.lines.map((l, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="num text-sub">{i + 1}</span>
                <span className="en">{l.en}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
