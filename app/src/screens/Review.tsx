import { useLocation } from 'wouter'
import { RotateCcw, Shuffle, Flame, CheckCircle2 } from 'lucide-react'
import { ScreenHeader, Page } from '../components/chrome'
import { Button, Card, Section, Empty } from '../components/ui'
import { AudioButton } from '../components/audio'
import { useProgress } from '../store/progress'
import { dueIds, today, MAX_BOX } from '../engine/srs'
import { PHRASE_BY_ID } from '../content'

const BOX_LABEL = ['新規', '1日', '2日', '4日', '8日', '16日', '32日']

export default function Review() {
  const [, navigate] = useLocation()
  const items = useProgress((s) => s.phrases)
  const day = today()
  const due = dueIds(items, day).filter((id) => PHRASE_BY_ID[id])
  const ids = Object.keys(items).filter((id) => PHRASE_BY_ID[id])
  const boxes = Array.from({ length: MAX_BOX + 1 }, (_, b) => ids.filter((id) => items[id].box === b).length)
  const weak = ids
    .filter((id) => items[id].wrong > 0)
    .sort((a, b) => items[b].wrong - items[b].right - (items[a].wrong - items[a].right) || items[a].box - items[b].box)
    .slice(0, 10)
  const max = Math.max(1, ...boxes)

  return (
    <>
      <ScreenHeader title="復習" sub="忘れかけた頃に、もう一度" />
      <Page>
        <Card className="mt-4 p-5">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ven-soft text-ven">
              <RotateCcw size={28} />
            </span>
            <div>
              <p className="text-sm text-sub">今日の復習</p>
              <p className="num text-4xl font-extrabold">
                {due.length}
                <span className="ml-1 text-base font-normal text-sub">件</span>
              </p>
            </div>
          </div>
          {due.length > 0 ? (
            <Button block size="lg" className="mt-4" onClick={() => navigate('/review/session?mode=due')}>
              復習をはじめる（最大20件）
            </Button>
          ) : (
            <p className="mt-4 flex items-center gap-2 text-sm text-ok">
              <CheckCircle2 size={18} /> 今日の分は完了。新しいシーンに進むか、苦手を練習しましょう。
            </p>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => navigate('/review/session?mode=weak')} disabled={weak.length === 0}>
              <Flame size={16} /> 苦手だけ
            </Button>
            <Button variant="secondary" onClick={() => navigate('/review/session?mode=random')} disabled={ids.length < 4}>
              <Shuffle size={16} /> ランダム10問
            </Button>
          </div>
        </Card>

        <Section title="覚え具合（次に出題されるまでの間隔）">
          {ids.length === 0 ? (
            <Empty title="まだ記録がありません" body="シーンのフレーズを聞いたりドリルを解くと、ここに表現がたまっていきます。" />
          ) : (
            <Card className="p-4">
              <div className="flex h-28 items-end gap-2">
                {boxes.map((n, b) => (
                  <div key={b} className="flex flex-1 flex-col items-center gap-1">
                    <span className="num text-[11px] text-sub">{n}</span>
                    <div className="w-full rounded-t-md" style={{ height: `${(n / max) * 72 + 4}px`, background: b === 0 ? 'var(--line)' : `color-mix(in srgb, var(--brand) ${30 + b * 11}%, var(--ven))` }} />
                    <span className="text-[10px] text-faint">{BOX_LABEL[b]}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-sub">登録 {ids.length} 表現。正解するたびに間隔が延び、間違えると翌日に戻ります。</p>
            </Card>
          )}
        </Section>

        {weak.length > 0 && (
          <Section title="苦手な表現">
            <div className="space-y-2">
              {weak.map((id) => {
                const p = PHRASE_BY_ID[id]
                const it = items[id]
                return (
                  <Card key={id} className="flex items-center gap-3 p-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="en text-[15px] font-semibold leading-snug">{p.en}</p>
                      <p className="text-xs text-sub">{p.ja}</p>
                      <p className="mt-0.5 text-[11px] text-faint">
                        正解 {it.right}・不正解 {it.wrong}
                      </p>
                    </div>
                    <AudioButton k={`weak:${id}`} item={{ text: p.en, role: p.speaker, tts: p.tts }} size="sm" tone="light" />
                  </Card>
                )
              })}
            </div>
          </Section>
        )}
      </Page>
    </>
  )
}
