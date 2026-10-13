import { ExternalLink, ShieldCheck, Stethoscope, Lock, BookOpen } from 'lucide-react'
import { ScreenHeader, Page } from '../components/chrome'
import { Card, Section, Pill } from '../components/ui'
import { StatusPill, EvidenceTag } from '../components/content'
import { Wordmark } from '../components/brand'
import { SOURCES } from '../content/sources'
import { contentStats } from '../content'

const KIND_LABEL = { guideline: 'ガイドライン', standard: '標準', paper: '論文', textbook: '教科書', domestic: '国内資料', web: 'Web' } as const

export default function About() {
  const st = contentStats()
  return (
    <>
      <ScreenHeader title="このアプリについて" back="/progress" />
      <Page>
        <Card className="hero-grad mt-4 p-5 text-white">
          <Wordmark size={24} />
          <p className="mt-3 text-sm leading-relaxed text-white/85">
            人工心肺（CPB）業務に携わる臨床工学技士のための、手術の流れに沿った英会話トレーニングです。聞く・選ぶ・話す・流れの中で会話する、の4段階で練習します。
          </p>
          <p className="num mt-3 text-xs text-white/60">version {__APP_VERSION__}</p>
        </Card>

        <Section title="大切なお知らせ">
          <Card className="space-y-3 p-4 text-[14px] leading-relaxed">
            <p className="flex gap-2">
              <Stethoscope size={18} className="mt-0.5 shrink-0 text-art" />
              <span>
                教育・自己学習のための教材です。<b>実際の人工心肺の管理は、施設のプロトコルと担当医の指示に従ってください。</b>会話やモニターに出てくる数値はすべて例です。
              </span>
            </p>
            <p className="flex gap-2">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-warn" />
              <span>
                教材は AI が下書きしたもので、<b>臨床の専門家による監修をまだ受けていません</b>。根拠を確認できなかった内容には「要確認」、施設や国で異なる内容には「施設差あり」「地域差」を付けています。
              </span>
            </p>
            <p className="flex gap-2">
              <Lock size={18} className="mt-0.5 shrink-0 text-ok" />
              <span>学習記録はこの端末の中だけに保存され、外部には送信されません。患者情報は扱いません（症例はすべて架空）。</span>
            </p>
          </Card>
        </Section>

        <Section title="監修状態の表示">
          <Card className="space-y-2.5 p-4 text-[13px]">
            <p className="flex items-center gap-2">
              <StatusPill status="ai-draft" /> AI が下書きし、まだ監修を受けていない
            </p>
            <p className="flex items-center gap-2">
              <StatusPill status="needs-check" /> 根拠を確認できていない内容を含む
            </p>
            <p className="flex items-center gap-2">
              <StatusPill status="reviewed" /> 監修者が確認済み
            </p>
            <p className="pt-2 text-xs font-bold text-sub">表現の裏付け</p>
            <p className="flex items-center gap-2">
              <EvidenceTag evidence="verbatim" /> 論文・学会基準で文言を確認
            </p>
            <p className="flex items-center gap-2">
              <EvidenceTag evidence="observed" /> 教育動画・実務者の報告で確認（音声での確認待ち）
            </p>
            <p className="flex items-center gap-2">
              <EvidenceTag evidence="constructed" /> AI が作った自然な英文（現場での使用は未確認）
            </p>
            <p className="pt-1 text-sub">
              現在: フレーズ {st.phrases}・会話 {st.dialogues}・症例 {st.cases}・用語 {st.glossary}。うち監修済み {st.reviewed}、要確認を含む {st.needsCheck}、AI下書き {st.aiDraft}。
            </p>
          </Card>
        </Section>

        <Section title="地域・施設による違いの例">
          <Card className="space-y-2 p-4 text-[13px] leading-relaxed">
            <p>
              <Pill tone="ven">地域差</Pill> perfusionist（米国など）と clinical perfusionist / clinical perfusion scientist（英国など）、OR と theatre、phenylephrine と metaraminol など。
            </p>
            <p>
              <Pill tone="warn">施設差あり</Pill> ACT の目標値、心筋保護液の種類と追加投与の間隔、プロタミンの量と投与のタイミング、CPB 中の薬剤投与の役割分担など。
            </p>
            <p>
              <Pill tone="warn">国内の運用</Pill> 日本では、臨床工学技士が回路から薬剤を注入するときは医師の具体的な指示が必要です（臨床工学技士法 第38条）。海外のように「プロトコルに沿って自分で投与する」前提の英語表現は、そのまま国内には当てはまりません。
            </p>
          </Card>
        </Section>

        <Section title="根拠・出典">
          <Card className="divide-y divide-line">
            {Object.entries(SOURCES).map(([id, s]) => (
              <div key={id} className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Pill tone={s.kind === 'domestic' ? 'warn' : s.kind === 'guideline' || s.kind === 'standard' ? 'brand' : 'neutral'}>{KIND_LABEL[s.kind]}</Pill>
                  <span className="text-xs font-bold text-sub">{s.org}</span>
                </div>
                <p className="mt-1 text-[13px] leading-snug">{s.title}</p>
                {s.usedFor && <p className="mt-0.5 text-[11px] text-faint">使いどころ: {s.usedFor}</p>}
                {'url' in s && s.url && (
                  <a href={s.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[11px] text-brand-ink underline">
                    <ExternalLink size={11} /> 出典を開く（外部サイト）
                  </a>
                )}
              </div>
            ))}
          </Card>
          <p className="mt-2 flex items-center gap-1 px-1 text-[11px] text-faint">
            <BookOpen size={12} /> 参照日はいずれも 2026-10-12。リンクを開くときだけ外部サイトに接続します。
          </p>
        </Section>

        <Section title="クレジット">
          <Card className="p-4 text-[13px] leading-relaxed text-sub">
            企画・受け入れ判断: 臨床工学技士（心臓手術・人工心肺）／実装: AI（Claude）／アイコン: Codex の画像生成。音声は端末の音声合成を使っています。
          </Card>
        </Section>
      </Page>
    </>
  )
}
