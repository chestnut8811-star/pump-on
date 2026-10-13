import { useEffect } from 'react'
import { Router, Route, Switch, useLocation } from 'wouter'
import { useHashLocation, navigate as hashNavigate } from 'wouter/use-hash-location'
import { TabBar, ToastHost } from './components/chrome'
import { UpdatePrompt } from './components/UpdatePrompt'
import { initSpeech } from './engine/speech'
import { setSfxEnabled } from './engine/sfx'
import { useSettings } from './store/settings'
import { useProgress } from './store/progress'
import Home from './screens/Home'
import Learn from './screens/Learn'
import PhaseScreen from './screens/Phase'
import DialogueScreen from './screens/Dialogue'
import Drill from './screens/Drill'
import SimList from './screens/SimList'
import SimPlay from './screens/SimPlay'
import Review from './screens/Review'
import ReviewSession from './screens/ReviewSession'
import Progress from './screens/Progress'
import Settings from './screens/Settings'
import About from './screens/About'
import Glossary from './screens/Glossary'
import Numbers from './screens/Numbers'
import FlowList from './screens/FlowList'
import Onboarding from './screens/Onboarding'
import NotFound from './screens/NotFound'

/** タブバーを隠す没入型の画面 */
const IMMERSIVE = [/^\/drill\//, /^\/sim\/[^/]+/, /^\/review\/session/, /^\/numbers/, /^\/dialogue\//]
// 背景を画面いっぱいに塗る全画面表示（min-h-full で #root の高さを使う）。これ以外の画面は div で包む
const FULL_HEIGHT = [/^\/drill\//, /^\/sim\/[^/]+/, /^\/review\/session/, /^\/numbers/]

function Shell() {
  const [path] = useLocation()
  const theme = useSettings((s) => s.theme)
  const sfxOn = useSettings((s) => s.sfx)
  const onboarded = useProgress((s) => s.onboarded)

  useEffect(() => {
    void initSpeech()
    const onVoices = () => void initSpeech()
    window.speechSynthesis?.addEventListener?.('voiceschanged', onVoices)
    return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', onVoices)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => setSfxEnabled(sfxOn), [sfxOn])

  // 画面遷移で先頭へ
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  const immersive = IMMERSIVE.some((re) => re.test(path))
  const fullHeight = FULL_HEIGHT.some((re) => re.test(path))

  const routes = (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/learn" component={Learn} />
      <Route path="/phase/:id" component={PhaseScreen} />
      <Route path="/phase/:id/:tab" component={PhaseScreen} />
      <Route path="/dialogue/:id" component={DialogueScreen} />
      <Route path="/drill/:phase" component={Drill} />
      <Route path="/sim" component={SimList} />
      <Route path="/sim/:id" component={SimPlay} />
      <Route path="/review" component={Review} />
      <Route path="/review/session" component={ReviewSession} />
      <Route path="/progress" component={Progress} />
      <Route path="/settings" component={Settings} />
      <Route path="/about" component={About} />
      <Route path="/glossary" component={Glossary} />
      <Route path="/numbers" component={Numbers} />
      <Route path="/flow" component={FlowList} />
      <Route component={NotFound} />
    </Switch>
  )

  return (
    <>
      {/* sticky のヘッダーは親の高さの中でしか止まらない。#root（画面1枚分の高さ）の直下だと、
          1画面分スクロールしたところでヘッダーが流れてしまうので、内容の高さを持つ div で包む */}
      {fullHeight ? routes : <div>{routes}</div>}
      {!immersive && <TabBar />}
      {/* ドリル・シミュレーターなどの途中はバッジ等の通知をためておき、画面を出たら表示する */}
      <ToastHost hold={immersive} />
      <UpdatePrompt />
      {!onboarded && <Onboarding />}
    </>
  )
}

// wouter のハッシュ遷移は、遷移先にクエリが無いと前のクエリ（?phase= など）を残す。
// 残ると次の画面に前の条件が効いてしまうので、クエリの無い遷移では明示的に空にする。
const navigateClean: typeof hashNavigate = (to, options) => hashNavigate(to.includes('?') ? to : `${to}?`, options)

function useCleanHashLocation(options?: { ssrPath?: string }): [string, typeof hashNavigate] {
  const [location] = useHashLocation(options)
  return [location, navigateClean]
}
useCleanHashLocation.hrefs = (href: string) => `#${href}`

export default function App() {
  return (
    <Router hook={useCleanHashLocation}>
      <Shell />
    </Router>
  )
}
