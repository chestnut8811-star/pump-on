// 監修用の教材一覧を書き出す: npm run review-sheet
// 出力: ../docs/review/content-review.csv（BOM付きUTF-8・CRLF。Excel でそのまま開ける）と content-review.md
// 監修者は CSV の「判定」「コメント」欄に記入し、確定したものだけ教材ファイルの status を 'reviewed' に変える。

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CASES, DIALOGUES, GLOSSARY, PHASES, PHRASES } from '../src/content'
import { ROLES } from '../src/content/roles'
import { SOURCES } from '../src/content/sources'
import type { Note, PhaseId, ReviewStatus } from '../src/content/types'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '..', '..', 'docs', 'review')
mkdirSync(outDir, { recursive: true })

const STATUS: Record<ReviewStatus, string> = { 'ai-draft': 'AI下書き・未監修', 'needs-check': '要確認を含む', reviewed: '監修済み' }
const EVIDENCE = { verbatim: '論文・基準で確認', observed: '動画・報告で確認', constructed: '出典未確認' } as const
const NOTE_KIND = { facility: '施設差', region: '地域差', caution: '安全', verify: '要確認', tip: 'コツ' } as const

const phaseName = (id: PhaseId) => PHASES.find((p) => p.id === id)?.titleJa ?? id
const role = (r: string) => (r === 'all' ? '全員' : (ROLES as Record<string, { ja: string }>)[r]?.ja ?? r)
const notes = (ns?: Note[]) => (ns ?? []).map((n) => `[${NOTE_KIND[n.kind]}] ${n.text}`).join(' / ')
const srcs = (ids?: string[]) => (ids ?? []).map((id) => (SOURCES as Record<string, { org?: string }>)[id]?.org ?? id).join(' / ')

type Row = Record<string, string>
const rows: Row[] = []

for (const p of PHRASES) {
  rows.push({
    種別: 'フレーズ',
    ID: p.id,
    シーン: phaseName(p.phase),
    話者: `${role(p.speaker)}→${role(p.to)}`,
    英語: p.en,
    日本語: p.ja,
    場面: p.when,
    言い方の幅: p.variants.map((v) => `[${v.register === 'simple' ? '簡単' : v.register === 'natural' ? '自然' : '短縮'}${v.region && v.region !== 'common' ? '・' + v.region : ''}] ${v.en}`).join(' / '),
    返答: p.replies.map((r) => `${role(r.role)}: ${r.en}`).join(' / '),
    注記: notes(p.notes),
    裏付け: EVIDENCE[p.evidence],
    出典: srcs(p.sources),
    監修状態: STATUS[p.status],
  })
}
for (const d of DIALOGUES) {
  rows.push({
    種別: '会話',
    ID: d.id,
    シーン: phaseName(d.phase),
    話者: '',
    英語: d.lines.map((l) => `${role(l.role)}: ${l.en}`).join(' / '),
    日本語: d.lines.map((l) => l.ja).join(' / '),
    場面: `${d.title}｜${d.setting}`,
    言い方の幅: '',
    返答: '',
    注記: notes(d.notes),
    裏付け: '',
    出典: '',
    監修状態: STATUS[d.status],
  })
}
for (const c of CASES) {
  for (const b of c.beats) {
    const t = b.task
    const lines = [...(b.lines ?? []), ...(b.after ?? [])].map((l) => `${role(l.role)}: ${l.en}`).join(' / ')
    rows.push({
      種別: t ? `症例の課題（${t.kind}）` : '症例の進行',
      ID: `${c.id}/${b.id}`,
      シーン: phaseName(b.phase),
      話者: '',
      英語: t ? (t.kind === 'respond' ? `${lines} ⇒ 正解: ${t.model}｜誤答: ${t.options.filter((o) => !o.correct).map((o) => o.en).join(' / ')}` : t.kind === 'speak' ? `${lines} ⇒ ${t.target}` : `${lines} ⇒ ${t.answer}`) : lines,
      日本語: t ? `${t.prompt}${t.kind === 'respond' ? '｜' + t.options.map((o) => (o.correct ? '○' : '×') + o.why).join(' / ') : ''}` : '',
      場面: `${c.titleJa}｜${b.narration ?? ''}`,
      言い方の幅: '',
      返答: '',
      注記: notes(c.notes),
      裏付け: '',
      出典: srcs(c.sources),
      監修状態: STATUS[c.status],
    })
  }
}
for (const g of GLOSSARY) {
  rows.push({
    種別: '用語',
    ID: g.term,
    シーン: g.category,
    話者: '',
    英語: [g.term, ...(g.aka ?? [])].join(' / '),
    日本語: g.ja,
    場面: g.desc,
    言い方の幅: '',
    返答: '',
    注記: notes(g.notes),
    裏付け: '',
    出典: srcs(g.sources),
    監修状態: STATUS[g.status],
  })
}

const headers = ['種別', 'ID', 'シーン', '話者', '英語', '日本語', '場面', '言い方の幅', '返答', '注記', '裏付け', '出典', '監修状態', '判定（OK/修正/削除）', '監修コメント']
const esc = (v: string) => `"${(v ?? '').replace(/"/g, '""')}"`
const csv = '﻿' + [headers.map(esc).join(','), ...rows.map((r) => headers.map((h) => esc(r[h] ?? '')).join(','))].join('\r\n') + '\r\n'
writeFileSync(join(outDir, 'content-review.csv'), csv, 'utf8')

// Markdown（読みやすさ優先の一覧）
const md: string[] = [
  '# Pump On ! 教材 監修用一覧',
  '',
  `書き出し日: ${new Date().toISOString().slice(0, 10)} ／ フレーズ ${PHRASES.length}・会話 ${DIALOGUES.length}・症例 ${CASES.length}・用語 ${GLOSSARY.length}`,
  '',
  '判定は content-review.csv の「判定」「監修コメント」欄に記入してください。確定した項目だけ、教材ファイルの status を reviewed に変更します。',
  '',
]
for (const ph of PHASES) {
  const list = PHRASES.filter((p) => p.phase === ph.id)
  if (!list.length) continue
  md.push(`## ${ph.order}. ${ph.titleJa}（${ph.titleEn}）`, '')
  for (const p of list) {
    md.push(`- **${p.id}** ${role(p.speaker)}→${role(p.to)}｜**${p.en}**｜${p.ja}｜${EVIDENCE[p.evidence]}｜${STATUS[p.status]}`)
    if (p.variants.length) md.push(`  - 言い方の幅: ${p.variants.map((v) => v.en).join(' / ')}`)
    if (p.replies.length) md.push(`  - 返答: ${p.replies.map((r) => r.en).join(' / ')}`)
    if (p.notes?.length) md.push(`  - 注記: ${notes(p.notes)}`)
  }
  md.push('')
}
writeFileSync(join(outDir, 'content-review.md'), md.join('\n'), 'utf8')

console.log(`書き出しました: ${rows.length} 行 → ${join(outDir, 'content-review.csv')}`)
