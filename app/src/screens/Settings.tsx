import { useEffect, useRef, useState } from 'react'
import { Link } from 'wouter'
import { Download, Upload, Trash2, Volume2, ChevronRight, HardDrive } from 'lucide-react'
import { ScreenHeader, Page } from '../components/chrome'
import { Button, Card, Section, Segmented, Toggle } from '../components/ui'
import { RoleAvatar } from '../components/content'
import { useSettings, snapshotSettings, type Theme, type Subtitles } from '../store/settings'
import { useProgress, snapshotProgress } from '../store/progress'
import { parseBackup } from '../store/backup'
import { notify } from '../store/ui'
import { ROLES, ROLE_IDS } from '../content/roles'
import type { RoleId } from '../content/types'
import { currentAssignment, englishVoices, initSpeech, loadVoices, speak, unlockSpeech } from '../engine/speech'
import { recognitionSupported } from '../engine/recognition'
import { recorderSupported } from '../engine/recorder'
import { MODE_META, type SimMode } from '../engine/sim'

const SAMPLE: Record<RoleId, string> = {
  surgeon: "Let's go on bypass.",
  assistant: 'Suction, please.',
  anesthesiologist: "Ventilator's off.",
  perfusionist: 'On bypass, full flow.',
  nurse: 'Time-out complete.',
  team: 'Thank you, everyone.',
}

export default function Settings() {
  const st = useSettings()
  const resetProgress = useProgress((s) => s.reset)
  const replaceProgress = useProgress((s) => s.replaceAll)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [persisted, setPersisted] = useState<boolean | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void loadVoices().then(async () => {
      await initSpeech()
      setVoices(englishVoices())
    })
    void navigator.storage?.persisted?.().then(setPersisted).catch(() => setPersisted(null))
  }, [])

  const assigned = currentAssignment()

  async function exportData() {
    const data = { app: 'pump-on', version: 1, exportedAt: new Date().toISOString(), progress: snapshotProgress(), settings: snapshotSettings() }
    const name = `pump-on-backup-${new Date().toISOString().slice(0, 10)}.json`
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const file = new File([blob], name, { type: 'application/json' })
    // iPhone のホーム画面アプリでは共有シート経由が確実（<a download> は戻れなくなる報告がある）
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
    if (nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: 'Pump On ! 学習記録' })
        return
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return
      }
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  }

  async function importData(f: File) {
    try {
      // 全体を検証してから置き換える。1か所でもおかしければ何も上書きしない
      const backup = parseBackup(JSON.parse(await f.text()))
      if (!backup) throw new Error('format')
      replaceProgress(backup.progress)
      if (backup.settings) st.replaceAll(backup.settings)
      notify({ kind: 'info', title: '学習記録を読み込みました' })
    } catch {
      notify({ kind: 'error', title: '読み込めませんでした', body: 'Pump On ! で書き出したファイルを選んでください' })
    }
  }

  return (
    <>
      <ScreenHeader title="設定" back="/progress" />
      <Page>
        <Section title="音声">
          <Card className="p-4">
            <label className="block">
              <span className="flex items-center justify-between text-[15px] font-semibold">
                読み上げの速さ <span className="num text-sm text-sub">×{st.rate.toFixed(2)}</span>
              </span>
              <input
                type="range"
                min={0.6}
                max={1.3}
                step={0.05}
                value={st.rate}
                onChange={(e) => st.set('rate', Number(e.target.value))}
                className="mt-2 w-full accent-[var(--brand)]"
              />
              <span className="flex justify-between text-[11px] text-faint">
                <span>ゆっくり</span>
                <span>現場の速さ</span>
              </span>
            </label>
          </Card>
          <Card className="mt-2.5 divide-y divide-line">
            {ROLE_IDS.filter((r) => r !== 'team').map((r) => (
              <div key={r} className="flex items-center gap-3 px-4 py-3">
                <RoleAvatar role={r} size={30} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{r === 'perfusionist' ? 'あなた（お手本）' : ROLES[r].ja}</p>
                  <select
                    value={st.voices[r] ?? ''}
                    onChange={(e) => st.setVoice(r, e.target.value || null)}
                    className="mt-1 w-full rounded-lg border border-line bg-card-2 px-2 py-1.5 text-sm"
                  >
                    <option value="">自動（{assigned[r]?.name ?? '端末の英語音声'}）</option>
                    {voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name}（{v.lang}）
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  aria-label="試聴"
                  onClick={() => {
                    unlockSpeech()
                    void speak(SAMPLE[r], { role: r, rate: st.rate, voiceURI: st.voices[r] })
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand-ink"
                >
                  <Volume2 size={18} />
                </button>
              </div>
            ))}
          </Card>
          <p className="mt-2 px-1 text-xs leading-relaxed text-sub">
            端末に入っている英語音声（米・英・豪など）から、話者ごとに別の声を自動で割り当てます。音が出ないときは、消音スイッチ（消音モード）と音量を確認してください。
          </p>
        </Section>

        <Section title="表示">
          <Card className="space-y-3 p-4">
            <div>
              <p className="mb-1.5 text-sm font-semibold">テーマ</p>
              <Segmented<Theme>
                value={st.theme}
                onChange={(v) => st.set('theme', v)}
                options={[
                  { value: 'system', label: '端末に合わせる' },
                  { value: 'light', label: 'ライト' },
                  { value: 'dark', label: 'ダーク' },
                ]}
              />
            </div>
            <div>
              <p className="mb-1.5 text-sm font-semibold">会話の字幕（既定）</p>
              <Segmented<Subtitles>
                value={st.subtitles}
                onChange={(v) => st.set('subtitles', v)}
                options={[
                  { value: 'en+ja', label: '英＋日' },
                  { value: 'en', label: '英のみ' },
                  { value: 'none', label: 'なし' },
                ]}
              />
            </div>
          </Card>
        </Section>

        <Section title="シミュレーター・発話">
          <Card className="space-y-1 p-4">
            <p className="mb-1.5 text-sm font-semibold">既定のモード</p>
            <Segmented<SimMode> value={st.simMode} onChange={(v) => st.set('simMode', v)} options={(Object.keys(MODE_META) as SimMode[]).map((m) => ({ value: m, label: MODE_META[m].label }))} />
            <Toggle
              checked={st.orNoise}
              onChange={(v) => st.set('orNoise', v)}
              label="手術室の環境音（試験的）"
              desc="リアルORモードでポンプ音などを重ねます。iPhone では読み上げ後に鳴らなくなることがあります"
            />
            <Toggle
              checked={st.useRecognition && recognitionSupported}
              onChange={(v) => st.set('useRecognition', v)}
              label="音声認識で自動判定（試験的）"
              desc={
                recognitionSupported
                  ? 'iPhone のホーム画面アプリでは動かない・2回目以降止まる報告があります。うまくいかないときは「録音」か「入力」をお使いください'
                  : 'この端末・ブラウザでは使えません（「録音」「入力」で練習できます）'
              }
            />
            {!recorderSupported && <p className="text-xs text-warn">この端末では録音が使えません。「入力」方式で練習できます。</p>}
            <Toggle checked={st.sfx} onChange={(v) => st.set('sfx', v)} label="効果音" />
          </Card>
        </Section>

        <Section title="毎日の目標">
          <Segmented<string>
            value={String(st.dailyGoal)}
            onChange={(v) => st.set('dailyGoal', Number(v))}
            options={[
              { value: '30', label: '30 XP（軽め）' },
              { value: '50', label: '50 XP' },
              { value: '100', label: '100 XP（多め）' },
            ]}
          />
        </Section>

        <Section title="データ（この端末の中だけに保存）">
          <Card className="space-y-2.5 p-4">
            <Button variant="secondary" block onClick={() => void exportData()}>
              <Download size={18} /> 学習記録を書き出す（バックアップ）
            </Button>
            <Button variant="secondary" block onClick={() => fileRef.current?.click()}>
              <Upload size={18} /> 書き出したファイルを読み込む
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void importData(f)
                e.target.value = ''
              }}
            />
            {'storage' in navigator && navigator.storage?.persist && (
              <Button
                variant="ghost"
                block
                onClick={() =>
                  void navigator.storage.persist().then((ok) => {
                    setPersisted(ok)
                    notify({ kind: 'info', title: ok ? '保存を固定しました' : '端末が許可しませんでした', body: ok ? '容量不足でも消されにくくなります' : '定期的な書き出しをおすすめします' })
                  })
                }
              >
                <HardDrive size={18} /> 記録を消されにくくする{persisted ? '（設定済み）' : ''}
              </Button>
            )}
            {!confirmReset ? (
              <Button variant="ghost" block className="text-ng" onClick={() => setConfirmReset(true)}>
                <Trash2 size={18} /> 学習記録を初期化
              </Button>
            ) : (
              <div className="rounded-xl bg-ng-soft p-3">
                <p className="text-sm font-bold text-ng">すべての学習記録（XP・復習・バッジ）を消します。元に戻せません。</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button variant="secondary" onClick={() => setConfirmReset(false)}>
                    やめる
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      resetProgress()
                      useProgress.getState().setOnboarded(true)
                      setConfirmReset(false)
                      notify({ kind: 'info', title: '学習記録を初期化しました' })
                    }}
                  >
                    初期化する
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </Section>

        <Section title="この教材について">
          <Card className="p-4 text-sm leading-relaxed">
            <p>教育・自己学習のための教材です。実際の人工心肺の管理は、<b>施設のプロトコルと担当医の指示</b>に従ってください。</p>
            <p className="mt-2 text-sub">教材は AI が下書きしたもので、臨床の監修前です。会話やモニターの数値はすべて例です。</p>
          </Card>
          <Link href="/about" className="mt-2.5 flex min-h-13 items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-card">
            <span className="flex-1 font-semibold">このアプリについて・根拠・注意事項</span>
            <ChevronRight size={18} className="text-faint" />
          </Link>
        </Section>
      </Page>
    </>
  )
}
