import { Link } from 'wouter'
import { ScreenHeader, Page } from '../components/chrome'

export default function NotFound() {
  return (
    <>
      <ScreenHeader title="ページが見つかりません" back="/" />
      <Page>
        <p className="mt-8 text-center text-sub">
          このページはありません。
          <Link href="/" className="ml-1 font-bold text-brand-ink underline">
            ホームへ
          </Link>
        </p>
      </Page>
    </>
  )
}
