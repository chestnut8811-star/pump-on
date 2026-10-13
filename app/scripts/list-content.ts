// 点検用: 教材の一覧を短く表示する（npx tsx scripts/list-content.ts [phase...]）
import { PHRASES, DIALOGUES } from '../src/content'
const only = process.argv.slice(2)
for (const p of PHRASES) {
  if (only.length && !only.includes(p.phase)) continue
  const notes = (p.notes ?? []).map((n) => n.kind[0]).join('')
  console.log(`${p.id}\t${p.speaker.slice(0, 4)}\t${p.evidence.slice(0, 4)}\t${p.status === 'needs-check' ? 'NC' : '  '}\t${notes}\t${p.en}\t｜${p.replies.map((r) => r.en).join(' / ')}`)
}
for (const d of DIALOGUES) {
  if (only.length && !only.includes(d.phase)) continue
  console.log(`${d.id}\t[会話] ${d.title}\t${d.lines.length}行`)
}
