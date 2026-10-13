# iPhone の Safari／ホーム画面Webアプリ（standalone）機能対応調査 — 英会話学習PWA向け

- 調査日: 2026-10-12（出典の参照日はすべて同日）
- 対象: iPhone の Safari と「ホーム画面に追加」から起動した Web アプリ（以下 **HSWA**）。iOS 26.x と iOS 27.0.x が中心。
- 位置づけ: AI（Claude）による文献調査。**実機検証は未実施**。
- 確度の凡例: **確定**＝一次資料（WebKit Blog／Safari リリースノート、Apple Developer Documentation、WebKit ソースコード、WebKit・Apple 担当者の Bugzilla コメント、MDN browser-compat-data）で確認 ／ **二次情報**＝二次資料のみ ／ **要確認**＝ユーザー報告のみ・資料が食い違う・古い。**未確認**＝一次資料で確かめられなかったこと。
- 「古い」表記: 2023年以前の資料には（古い: 年）と付けた。

## 0. 前提：現在のバージョン

| iOS / Safari | 公開日 | 出典 |
|---|---|---|
| 26.0 | 2025-09-15 | [S3][S61] |
| 26.1 | 2025-11-03 | [S61] |
| 26.2 | 2025-12-12 | [S4][S61] |
| 26.3 | 2026-02-12 | [S61] |
| 26.4 | 2026-03-24 | [S5][S61] |
| 26.5 | 2026-05-11 | [S6][S61] |
| 26.6 | 2026-07-27 | [S61] |
| 27.0 | 2026-09-14（caniuse）。WebKit の Safari 27.0 記事は 2026-09-17 付 | [S1][S61] |

- iOS 27.0.1 の存在はユーザー報告から確認（[S32][S47]）。27.1 以降は未公開（caniuse は 27.1／27.2 を将来版として掲載）。
- Safari 27.0 のリリースノートには、本調査の対象（Web Speech の新機能、HSWA、マニフェスト、Wake Lock、Badging、Web Share、ストレージ容量）について**新機能はなく修正のみ**（Service Worker の static routing API 追加を除く）[S1]。

## 結論（要約）

1. **使えるもの**: 音声合成（iOS 7〜）、録音（getUserMedia は HSWA で iOS 13.4〜、MediaRecorder は iOS 14.3〜、audio/mp4 が既定）、Service Worker・IndexedDB、Wake Lock（HSWA は iOS 18.4〜）、Badging、Web Share。iOS 26 以降は「ホーム画面に追加」で既定で Web アプリとして開く。
2. **不安定なもの**: 音声認識（webkit 接頭辞、Siri/音声入力 ON が必要、HSWA 対応は公式未告知。iOS 27 で「2回目以降無音」などの回帰報告が多数）と、TTS・認識・録音・効果音の同時使用。HSWA ではマイク許可が起動ごとに聞かれる報告が続いている。
3. **Web からできないもの**: Enhanced/Premium 音声、Vibration API、ファイル保存ダイアログ（File System Access）。消音スイッチ時の TTS の鳴り方は**未確認**。

---

## 1. 音声合成 speechSynthesis

### 1-1 基本対応
- **対応状況**: 対応（Safari・HSWA とも API あり）。
- **対応バージョン**: Safari 7／iOS 7 以降（BCD、caniuse）。`voiceschanged` は BCD 上 Safari 16 以降。Cocoa での「システム音声一覧変更時に voiceschanged を発火」の実装は 2023-08 の WebKit コミット [S59][S61][S20]。
- **注意点**: HSWA 固有の speechSynthesis 不具合は、Bugzilla（件名に speechSynthesis／SpeechSynthesisUtterance／getVoices を含むバグ）では見つからなかった。iOS 27 の回帰報告（1-7）は「Safari と HSWA の両方で再現」とされている [S31]。
- **出典**: [S59][S61][S20][S31]
- **確度**: 確定（対応版）

### 1-2 ユーザー操作なしで再生できるか
- **対応状況**: **最初の1回はできない**。iOS では、ページで最初の `speak()` がユーザー操作（タップ等）の処理中でない場合、発話は**キューに入らず、start／error イベントも出ずに無言で捨てられる**。操作中に一度 `speak()` すると制限が解除され、**同じページでは以後操作なしでも話せる**。
- **根拠**: WebKit ソース `SpeechSynthesis::speak()` の iOS 分岐（`if (UserGestureIndicator::processingUserGesture()) removeBehaviorRestriction(...); else if (userGestureRequiredForSpeechStart()) return;`）。制限は `document->requiresUserGestureForAudioPlayback()` が真のとき設定（Safari の既定）[S19]。WebKit 担当者「iOS always requires a gesture for SpeechSynthesis to speak.」（2021）[S33]。
- **実装上の推奨**: 「学習を始める」ボタンのタップ処理の中で、`await` より前に同期的に最初の `speak()` を呼ぶ。ページ再読込・HSWA 再起動ごとに必要（制限はページ単位のため、という推論。実機確認推奨）。`start` イベントが一定時間来なければ「タップして再生」ボタンを出す。
- **出典**: [S19][S33]
- **確度**: 確定（ソース）／HSWA 再起動ごとに必要な点は要確認

### 1-3 getVoices() の挙動
- **対応状況**:
  - 返るのは**システム（プリインストール）音声のみ**。WebKit は `AVSpeechSynthesisVoice` の `isSystemVoice` が真の音声だけを列挙する（2026-10 時点の main）。2026-01 まで残っていたソースコメント: 「Only show built-in voices when requesting through WebKit to reduce fingerprinting surface area.」[S20][S21]
  - 全音声で `localService=true`、`default=true` が返る（ソース）→ `default` では既定音声を判別できない [S20]。
  - **非同期化**: WebKit main で 2026-01-15 に「音声一覧の取得を非同期化」し、「初回 `getVoices()` が空 → `voiceschanged` 後に埋まる」ことを確かめるテストを追加 [S21]。**どの Safari 版で出荷されたかは未確認**（リリースノートに記載なし）。
  - 以前から空配列・音声欠落の報告がある: iOS 16.0.2 以降で ja-JP の Kyoko が出ない、iOS 18 では低品質の Eloquence 系だけが出る（ユーザー報告、Apple は再現できず）[S37]。
  - Safari 26.0 以降、**既知のフィンガープリント用スクリプト**には音声一覧を正しく返さない [S3]（自前コードは対象外のはず＝要確認）。
- **使える英語音声（en-US／en-GB／en-AU 等）**: 端末にどの英語音声が入っているかを示す一次資料は見つからず→**未確認**。WebKit 自身のテスト（voices-non-mock.html）は en-US 音声の存在を前提にしている [S21]。
- **声の選ばれ方**: `utterance.voice` があれば voiceURI（識別子）で選び、無ければ `utterance.lang` で `voiceWithLanguage`、**lang も空なら端末の現在の言語**で選ぶ（日本語設定の iPhone なら日本語音声で英文を読む）[S20]。
- **実装上の推奨**: `getVoices()` が空なら `voiceschanged` を待ち、約1秒のタイムアウトで再取得（WebKit 自身のテストと同じ手順 [S21]）。**必ず `utterance.lang`（例 'en-US'）を設定**。音声が見つからなくても lang 指定だけで再生できる。選んだ voiceURI を保存し、次回見つからなければ lang だけで再生。en-GB／en-AU は実機で一覧を出して確認。
- **出典**: [S20][S21][S37][S3]
- **確度**: 確定（システム音声のみ、lang による選択、default が全て true）／要確認（非同期化の出荷版、英語音声の具体的な一覧）

### 1-4 Enhanced／Premium 音声を Web から使えるか
- **対応状況**: **使えない**。Apple Frameworks Engineer（2023-01）「It is expected that with Web Speech APIs only the pre-installed voices are available. Optionally downloadable voices are not available.」[S36]。Apple Docs 上、Enhanced／Premium は「you must download to use」[S84]。現行ソースも isSystemVoice で絞り込み [S20]。
- **注意点**: フォーラムに「iOS 17 では一部の高品質音声が Web で使えたが iOS 18 で消えた」というユーザー証言あり（確認不可）[S36]。
- **実装上の推奨**: 端末標準音声の音質を前提に設計。高音質が必須なら、事前に作った音声ファイルの配信、またはネイティブ化（8章）。
- **出典**: [S36][S84][S20]
- **確度**: 確定（2023 の Apple 回答（古い: 2023）＋2026 の現行ソース。iOS 26/27 実機では未確認）

### 1-5 消音スイッチ（マナーモード）時に鳴るか
- **対応状況**: **未確認**。一次資料で明言されたものは見つからなかった。
- **分かっていること**: WebKit では speechSynthesis の発話は Web プロセスからアプリ側（UI プロセス）へ送られ、`AVSpeechSynthesizer` で再生される。WebKit 側は `usesApplicationAudioSession` を設定しておらず、アプリ（Safari／HSWA の器）のオーディオセッション種別は非公開部分のため不明 [S19][S20]。`navigator.audioSession` を設定しても TTS のダッキングは変わらないという報告がある（iOS 17）[S34]。
- **実装上の推奨**: 実機（iOS 26.x／27.0.x、Safari と HSWA）で「消音スイッチ ON/OFF × audioSession 設定の有無」を検証項目に入れる。画面に「音が出ないときは消音モードと音量を確認」の案内を置く。
- **出典**: [S19][S20][S34]
- **確度**: 未確認

### 1-6 rate／pitch／volume の扱い
- **rate**: Web の rate（0.1〜10、既定 1）を AVFoundation の rate に変換。1 未満は「既定値×rate」、1 以上は「既定値＋(rate−1)×(最大値−既定値)」。ソースのコメントでは AVFoundation 側は 0〜1、既定 0.5 → この式では **rate=2 で最大値**に達する。2 を超えたときの実際の速さは未確認（日本語で rate≥4 が変わらないという 2020 年の報告あり [S91]）[S20]。
- **pitch**: そのまま `pitchMultiplier` に渡す。Apple Docs の有効範囲は **0.5〜2.0**（既定 1.0）[S20][S57]。0.5 未満の挙動は未確認。
- **volume**: そのまま `volume` に渡す [S20]。
- **実装上の推奨**: 速度 UI は 0.5〜1.5 程度、pitch は 0.5〜2.0 の範囲にとどめる（上記資料からの推奨）。
- **出典**: [S20][S57][S91]
- **確度**: 確定（変換式・pitch 範囲）

### 1-7 既知の不具合・回帰
- Safari 26.0: キャンセル時に保留中の発話へ error イベントが出なかった問題を修正 [S3]。
- Safari 27.0: 「`speechSynthesis.cancel()` が、その後の `speak()` で積んだ発話まで消す」問題を修正 [S1] → **26.x 以前では cancel() 直後の speak() が消える可能性**。
- iOS 27 の回帰（ユーザー報告、状態 NEW、Apple の Radar に取り込み済み、未修正）:
  - 連続音声認識中に `speak()` すると音が出ず、認識も止まる（iOS 26 では動作）。回避: 認識を止めてから speak、発話の end で新しい認識インスタンスを開始 [S30]。
  - speechSynthesis を一度使うと、AudioContext がページ再読込まで無音になる（Safari・HSWA・iOS 版 Chrome、消音スイッチ ON/OFF とも）[S31]。
  - TTS 中は認識器に音声が入らない（話しかけて割り込めない）、TTS 後に同じ認識器が無反応、`onend` が来ない発話があるとキューが詰まり `cancel()` まで再生されない [S29 のコメント]。
- iOS 全般（古めの報告）: TTS が他の音をダッキングし、終了後も約1秒続く（iOS 17）[S34]。`speak()` が video を一時停止し getUserMedia の音声トラックをミュートする（2020 報告、2026-09 に iOS 27 で再現とのコメント）[S35]。
- **出典**: [S1][S3][S29][S30][S31][S34][S35]
- **確度**: 確定（リリースノート分）／要確認（ユーザー報告分）

---

## 2. 音声認識 SpeechRecognition／webkitSpeechRecognition

### 2-1 対応状況
- **対応状況**: 対応（**webkit 接頭辞付き** `webkitSpeechRecognition`）。
- **対応バージョン**: Safari 14.1／iOS 14.5 以降 [S15][S59][S61]。
- **条件**: Siri（または音声入力）が有効であること。Safari 14.1 記事「users will need Siri enabled in System Preferences on macOS or Settings in iOS or iPadOS for the API to be available」[S15]、WebKit 担当者「enabling Siri or Dictation」（2021）[S28]。Safari 26.0 から HTTPS（安全なコンテキスト）でのみ公開 [S3]。
- **非対応**: `grammars`、`processLocally`、`available()`／`install()`、`phrases`（BCD）[S59]。
- **ロックダウンモード**: Web Speech API が無効（16.4 記事）[S11]。
- **出典**: [S15][S28][S3][S59][S61][S11]
- **確度**: 確定

### 2-2 ホーム画面アプリ（standalone）で動くか
- **公式の記述（古い: 2021）**: WebKit 担当者「SpeechRecognition API is not available in SafariViewController and web apps added to Home Screen for now.」[S28]。caniuse も 2026-10 時点で同じ注記を掲載 [S61]。
- **その後**: HSWA で有効にしたというリリースノート・告知は、Safari 14.1〜27.0 の WebKit Blog では見つからなかった。
- **2026 年のユーザー報告では HSWA で動いている**: iOS 26.6 で「both plain Safari and installed/Add to Home Screen standalone mode」[S29]、iOS 27.0 の HSWA（display-mode: standalone）での再現報告と「本番アプリは iOS 26.6.1 で動いていた」との記述 [S29 のコメント]。WKWebView では Info.plist に `NSSpeechRecognitionUsageDescription` があれば動く（WebKit 担当者、2022）[S39]。
- **結論**: 現行 iOS の HSWA で動く可能性は高いが、**公式には未確認→実機で必ず確認**。
- **出典**: [S28][S61][S29][S39]
- **確度**: 要確認（公式記述とユーザー報告が食い違う。公式は 2021 年と古く、報告は 2026 年と新しい）

### 2-3 マイク許可の挙動
- **WebKit の流れ**: アプリとしての音声認識権限 → マイク権限 → **サイトごとのユーザー許可**（getUserMedia と同じ `requestUserMediaPermissionForSpeechRecognition`）→ ページが表示中であること（非表示なら NotAllowed）[S40]。
- **HSWA で起動ごとに聞かれるか**: 音声認識についての直接の資料は**未確認**。getUserMedia は HSWA で起動ごとに聞かれる報告がある（3-3）ため、同様の可能性がある。
- **出典**: [S40]
- **確度**: 確定（流れ）／未確認（HSWA での頻度）

### 2-4 オフラインで動くか（サーバ送信の有無）
- **WebKit の実装**: Apple の Speech フレームワーク（`SFSpeechRecognizer`）を使う。認識器がオンデバイス認識に対応していれば `requiresOnDeviceRecognition = YES`（端末内処理を強制）、非対応ならネットワーク経由。タスクヒントは dictation、最大認識時間は 1 時間 [S22]。Apple Docs:「If supportsOnDeviceRecognition is false, the SFSpeechRecognizer requires a network in order to recognize speech.」「Set this property to true to prevent an SFSpeechRecognitionRequest from sending audio over the network.」[S58]
- **Web から分かるか**: その iPhone で英語がオンデバイス対応かを知る API はない（`processLocally`／`available()` 非対応）[S59]。MDN は一般論として「By default ... server-based recognition engine ... so it won't work offline」と記載 [S60]。iOS 17/18 で「オフラインだと失敗する場合がある」というユーザー報告 [S38]。Safari 14.1 記事では「powered by the same speech engine as Siri」[S15]。
- **実装上の推奨**: オフライン認識を前提にしない。オフライン時は認識ボタンを無効表示。プライバシー説明は「Apple の音声認識を利用（端末内で処理される場合とされない場合がある）」とする（文言は要監修）。
- **出典**: [S22][S58][S59][S60][S38][S15]
- **確度**: 確定（実装内容）／未確認（実機でのオフライン可否）

### 2-5 continuous／interimResults
- **continuous**: BCD では Safari 17 から完全対応（14.1〜17 は「false でも複数結果を返す」部分対応）[S59]。2023-02 の WebKit 修正で、非連続モードは最初の確定結果で止まるようになった [S22 の履歴]。連続モードでも Safari が周期的にセッションを終える、とのユーザー記述あり [S30]。
- **interimResults**: 14.1 から対応 [S59]。途中結果（isFinal=false）が少ない・遅い場面の報告あり [S38]。
- **maxAlternatives**: 14.1 から対応 [S59]。
- **実装上の推奨**: 1 発話ごとに start → 結果 → stop の短いセッション（押して話す方式）を基本にし、continuous に頼らない。onend で必ず状態をリセット。
- **出典**: [S59][S22][S30][S38]
- **確度**: 確定（BCD・ソース）／要確認（周期終了の頻度）

### 2-6 既知の不具合（2026 年）
- **iOS 27.0〜27.0.1（NEW）**: 1 つのタブ（ページ）で**最初の 1 回しか認識できず**、2 回目以降は無音を受け取って "aborted"（No speech detected）。再読込でも直らず、タブを閉じて開き直すと 1 回だけ動く [S32]。HSWA ではアプリの終了・再起動が必要になる可能性（推論）。
- **iOS 26.6／27.0（NEW）**: audio／video 要素の再生後に `start()` すると、onresult・onerror・onend のどれも来ずに固まる [S29]。Apple の youennf は「認識中に AudioSession が非アクティブになる問題に関連するかもしれない」とし、bug 317741 で追跡していると回答（2026-06-30）。同バグは 2026-06-26 に WebKit で修正コミット済みだが、出荷版は未確認 [S86][S87]。Safari 27.0 で「マイク取得中は WebProcess の AudioSession を維持」を修正 [S1]。ユーザー報告では、HTMLAudioElement を Web Audio に替えると干渉が消えた（iOS 18.7.3／26.2）[S86]。
- **iOS 27（NEW）**: TTS と認識の同時使用で失敗（1-7）。認識中に別の getUserMedia トラックを開くとそのトラックがミュートされる [S29 のコメント]。
- **実装上の推奨**: 認識・TTS・録音・効果音を同時に動かさない**順番制（ターン制）**の設計にする。start 後、一定時間 soundstart／result が無ければ abort して再試行するか、代替入力へ切り替える。
- **出典**: [S29][S30][S32][S86][S87][S1]
- **確度**: 要確認（ユーザー報告。Apple は未確認）。27.0 の AudioSession 修正のみ確定

---

## 3. 録音 getUserMedia + MediaRecorder

### 3-1 対応状況
- **getUserMedia**: Safari 11 以降（BCD）。**HSWA では iOS 13.4 以降**（Apple の担当者「With today's iOS and iPadOS 13.4 Beta, WebRTC (getUserMedia) should work as expected in home screen web apps.」（古い: 2020））[S41][S59]。Safari 26.4 から `enumerateDevices()` の MediaDeviceInfo は HTTPS のみで公開 [S5]。
- **MediaRecorder**: iOS 14.3 で既定有効（「Safari in the latest iOS 14.3 beta enabled support for the MediaRecorder API by default」（古い: 2020））[S16]。BCD は iOS 14 と記載（食い違い。WebKit Blog を優先）[S59]。
- **出典**: [S41][S59][S5][S16]
- **確度**: 確定

### 3-2 対応する mimeType
- **MP4（audio/mp4, AAC）**: 当初から（「Safari currently supports the MP4 file format with H.264 as video codec and AAC as audio codec.」（古い: 2020））[S16]。iOS 26 で mimeType 未指定時に `audio/mp4; codecs=mp4a.40.2` が自動選択されたというユーザー報告 [S46]。
- **WebM（Opus。映像は VP8／VP9）**: Safari 18.4 から [S7]。同記事に fragmented MP4 と ALAC／PCM の記載もある [S7]。Safari 26.0 記事にも「adds support for ALAC and PCM audio in MediaRecorder」とある [S3] → **ALAC／PCM がどちらの版から iOS で使えるかは資料間で食い違い**。
- **実装上の推奨**: `MediaRecorder.isTypeSupported()` で `audio/mp4` → `audio/webm;codecs=opus` の順に判定し、実際の `recorder.mimeType` を保存。再生できるかを `<audio>` で確認。
- **出典**: [S16][S46][S7][S3]
- **確度**: 確定（MP4・WebM）／要確認（ALAC／PCM の iOS 対応版、既定 mimeType）

### 3-3 ホーム画面アプリでのマイク許可は起動ごとか
- **対応状況**: **起動ごと（アプリを完全に終了して開き直すたび）に許可ダイアログが出る**という報告が続いている（iOS 14.5 以降〜18.5、2026-10-12 に iOS 26/27 で新規報告）[S42][S43]。新規報告の記述: Safari ではサイト設定で「許可」を固定できるが、HSWA には同等の設定がなく、Safari の設定も使われない [S43]。WebKit 担当者は「Safari には永続的に許可する手段がある」「HSWA で永続許可が欲しいなら新しいバグを」と回答（2024-09、2026-02）[S42]。ハッシュ遷移のたびに許可がリセットされる旧問題は iOS 14.5 で改善（ユーザー報告）[S42]。
- **参考**: WebKit 担当者（古い: 2021、WKWebView／Safari の文脈）「If capture is ongoing, prompt should not happen again until 24 hours. If capture is not ongoing, prompt should happen again after 1 minute of inactivity. This is the same behavior as Safari.」[S42]
- **実装上の推奨**: 起動ごとに許可を求められる前提で UX を作る（最初の録音タップ時に理由を説明 → 許可）。練習セッション中はストリームを保持して再ダイアログを減らす方法もある（ただし音声認識とは併用しない。2-6）。
- **出典**: [S42][S43]
- **確度**: 要確認（主にユーザー報告。Apple 担当者は HSWA 用の永続許可の仕組みが無いことを示唆）

### 3-4 既知の不具合
- **iOS 26.0〜26.1**: MP4 録音の後半が欠ける → **iOS 26.2 で修正**（Apple 担当者「The fix was released with iOS 26.2.」）[S44]。
- **Safari 26**: timeslice が小さい（100ms 以下）と空の Blob が出る → WebKit で 2026-02 に修正（出荷版は未確認）。WebKit 担当者: 各セグメントはキーフレームから始まるため約 1 秒単位になる [S45]。
- **iOS 26（NEW）**: 音声の再生が自然に終わった（ended）後に録音すると 0 バイトになる。`pause()` で止めた場合は起きない [S46]。
- **iOS 27（NEW）**: タップの後、ハンドラの外（例: 3 秒後）で `start()`／`resume()` するとマイクが止まり、約 40 秒後に track が ended。ハンドラ内で同期的に `start()` すれば動く [S47]。
- **実装上の推奨**: `start()` はタップハンドラ内で同期的に呼ぶ。timeslice は指定しないか 1000ms 以上。お手本再生の直後に録音する流れでは 0 バイトを検知して再試行（ストリームの取り直し）。
- **出典**: [S44][S45][S46][S47]
- **確度**: 確定（26.2 の修正）／要確認（その他はユーザー報告）

---

## 4. 音の再生

### 4-1 自動再生の制限
- **HTMLMediaElement**: 音声付きの再生はユーザー操作が必要。無音または muted の video のみ自動再生可。`play()` は Promise を返し、条件外なら reject（iOS 10 以降の方針。古い: 2016）[S18]。
- **Web Audio**: AudioContext は、ユーザー操作（transient activation）中か、マイク取得中でないと開始できない（WebKit ソース）[S25]。
- **実装上の推奨**: 最初のタップで AudioContext を作成・resume し、同じタップで `<audio>` の再生も一度行っておく。
- **出典**: [S18][S25]
- **確度**: 確定（ソース）。[S18] は古いが現行ソースと整合

### 4-2 消音スイッチの影響
- **WebKit の既定（audioSession 未設定時）**: マイク取得中 → PlayAndRecord、音声付きの media 要素が再生中 → MediaPlayback、**Web Audio だけ → AmbientSound** [S24]。Apple Docs: ambient は「Screen locking and the Silent switch ... silence your audio」、playback と playAndRecord は「continues with the Silent switch set to silent」[S54][S55][S56]。
- つまり **Web Audio だけで鳴らした効果音は消音スイッチで無音、`<audio>` 要素は鳴る**。WebKit 担当者（2024-09）「Since iOS 17, you can set the audio session type to "playback" ... By default the type is ambient and so audio will be muted if the phone is muted.」[S48]
- **出典**: [S24][S54][S55][S56][S48]
- **確度**: 確定

### 4-3 navigator.audioSession
- **対応状況**: Safari 16.4「Support for a subset of the AudioSession Web API」[S11]。BCD: `type` は 16.4、`state`／`statechange` は非対応 [S59]。WebKit 担当者は 'playback' を「Since iOS 17」と記載 [S48] → **16.4 と 17 で食い違い**（実害は少ない）。
- **型と iOS のカテゴリの対応（WebKit ソース）**: auto → 既定の判定、playback → MediaPlayback、transient → Ambient、transient-solo → SoloAmbient、ambient → Ambient、play-and-record → PlayAndRecord [S23]。transient 系は消音スイッチで無音（WebKit 担当者、2025-01）[S49]。仕様は W3C Editor's Draft [S53]。
- **注意点**: playback は他アプリの音楽を止める（Apple Docs: 既定で nonmixable）[S55]。playback にしても TTS のダッキングは変わらない（iOS 17 報告）[S34]。iOS 27 では audioSession=playback の環境でも TTS 後に AudioContext が無音になる報告 [S31]。
- **実装上の推奨**: 音を確実に出したい場面では `if ('audioSession' in navigator) navigator.audioSession.type = 'playback'`（最初のタップで設定）。録音中は 'play-and-record' か 'auto'。
- **出典**: [S11][S59][S48][S23][S49][S53][S55][S34][S31]
- **確度**: 確定（ソース・Docs）／要確認（16.4 か 17 か）

### 4-4 ホーム画面アプリ固有の再生不具合
- **iOS 26.0〜26.1**: HSWA を開き直すと audio 要素が鳴らない [S51] → **Safari 26.2 で修正**（「Fixed an issue where an audio element failed to play when re-opening a Home Screen Web App. (155336513)」）[S4]。
- **iOS 18〜26.0**: HSWA の再起動・復帰後に Web Audio が無音（`resume()` が返らない報告も）。iOS 26.2 beta 3 で直ったとのユーザー報告。Bugzilla は NEW のまま [S50]。
- **iOS 26（NEW）**: 短時間バックグラウンドから戻ると media 要素が固まり、消音スイッチ ON で音が戻らない。起動時に `navigator.audioSession.type = 'playback'` で防げたとの報告 [S52]。
- **実装上の推奨**: `visibilitychange` で表示に戻ったとき AudioContext.state を確認して resume。鳴らない場合は AudioContext を作り直す。
- **出典**: [S4][S50][S51][S52]
- **確度**: 確定（26.2 の修正）／要確認（その他）

---

## 5. オフラインと保存

### 5-1 Service Worker／Cache Storage
- **対応状況**: Service Worker と CacheStorage は Safari 11.1／iOS 11.3 以降 [S59][S61]。HSWA は Service Worker 必須ではない（「Home Screen web apps on iOS and iPadOS never required Service Workers」）[S3]。Navigation Preload（15.4）[S13]、Static Routing API（Safari 27.0）[S1]。
- **注意点**: ロックダウンモードでは Service Worker・Cache API が無効 [S11]。
- **出典**: [S59][S61][S3][S13][S1][S11]
- **確度**: 確定

### 5-2 容量（Cache Storage を含む）
- **Safari 17／iOS 17 以降**: オリジンごとの上限は、ブラウザアプリでディスク総容量の最大 60%、その他のアプリで 15%。全体の上限は 80%／20%。**HSWA は「ブラウザで開いたときと同じ」上限**（「When a web app is running standalone (as Home Screen Web App on iOS ...), it has the same origin quota and overall quota as when it is opened in a browser app.」）。対象は localStorage、Cache API、IndexedDB、Service Worker、File System [S10]。
- **iOS 16 以前**: 初期上限 1GB、超えると HSWA では保存が失敗 [S9]。
- **localStorage は別枠で 1 オリジン 5MB**（WebKit ソース `localStorageQuotaInBytes = 5 * MB`）[S26]。
- `estimate()` の quota は上限の目安で、フィンガープリント対策のため変動しうる [S10]。
- **出典**: [S10][S9][S26]
- **確度**: 確定

### 5-3 ホーム画面アプリの保存領域
- **HSWA は Safari と状態を共有しない**: WebKit 担当者（2022）「The current behavior (on Apple platforms) is by design. Home Screen apps are created as isolated entities without shared state with the browser.」[S62] → Safari のタブで使ったデータは HSWA に引き継がれない。Mac の Dock Web アプリは Cookie のみコピーされると公式記載 [S9]。iOS での Cookie コピーの公式記載は見つからず（未確認）。
- **実装上の推奨**: 「ホーム画面に追加してから学習を始めてください」と初回に案内。エクスポート／インポート機能を用意。
- **出典**: [S62][S9]
- **確度**: 確定（古い: 2022）

### 5-4 ITP の 7 日削除はホーム画面アプリに適用されるか
- **公式（古い: 2020、iOS 13.4）**: 7 日削除は「Safari を使った 7 日間にそのサイトの操作がない」場合。HSWA は Safari の一部ではなく、自分の使用日数カウンタを持つ。「We do not expect the first-party in such a web application to have its website data deleted.」[S17]
- **Safari 17 の方針**: 全体上限超過・容量逼迫・一定期間未操作で LRU 順に削除。永続モードのオリジンや、アクティブなページがあるオリジンは除外されうる [S10]。
- **新しい動き（WebKit main、2026-05）**: ITP が無効な環境向けに「**180 日アクセスのないオリジンの Storage API データを削除**（週 1 回まで）」を追加し、既定で有効化。永続化済み・アクティブ・Web Push 購読のあるオリジンは除外 [S27]。Safari 27.0 のリリースノートに記載はなく、**出荷版と HSWA への適用は未確認**。
- **出典**: [S17][S10][S27]
- **確度**: 確定（2020 の公式。ただし古い）／未確認（180 日削除の出荷状況）

### 5-5 navigator.storage.persist()／estimate()
- **対応状況**: `persist()`／`persisted()` は BCD で Safari 15.2、`estimate()` は 17 [S59]。WebKit は Safari 17 で「the Storage API is fully supported」[S10]。`persist()` は「WebKit currently grants a request based on heuristics like whether the website is opened as a Home Screen Web App.」[S10]
- **実装上の推奨**: HSWA の起動時に `persisted()` を確認し、false なら `persist()` を呼んで結果を設定画面に表示。
- **出典**: [S59][S10]
- **確度**: 確定

### 5-6 IndexedDB と localStorage の信頼性
- **IndexedDB は直近も修正が続いている**: 26.4（メタデータの不整合）、26.5（「IndexedDB connections could become permanently broken until the page was reloaded」）、27.0（abort 後に version 0 を返す、ワーカーの接続がクラッシュ後に回復しない、別ページのトランザクション停止で長時間ブロック）[S5][S6][S1]。iOS 18.4.x で Blob を含むデータの読み出しでネットワークプロセスが落ちる（2025-07 修正）、HSWA で Web Push 購読後に readwrite トランザクションが完了しない（修正済み）[S90]。
- **ロックダウンモード**: IndexedDB が無効（Safari 17）[S9]。
- **実装上の推奨**: 学習履歴は IndexedDB に保存し、onerror／onabort／タイムアウトを監視、失敗時は接続を開き直す。重要データは定期的にエクスポートを促す。localStorage は設定値など小さなデータだけ（5MB・同期 API）。
- **出典**: [S5][S6][S1][S90][S9][S26]
- **確度**: 確定（リリースノート）

---

## 6. ホーム画面アプリの見た目

### 6-1 「ホーム画面に追加」の挙動（iOS 26 の変更）
- **対応状況**: **iOS 26／iPadOS 26 から、ホーム画面に追加したサイトは既定で Web アプリとして開く**（manifest やメタタグが無くても）。ユーザーは追加時に「Webアプリとして開く」をオフにしてブラウザのブックマークにもできる（サイトが Web アプリ設定でも）。「By default, every website added to the Home Screen opens as a web app.」manifest の設定やアイコンは引き続き使われる [S3]。
- **注意点**: HSWA 判定で、iOS では manifest の display=standalone の HSWA で `display-mode: standalone` が false・`fullscreen` が true になる不具合報告（2023、未修正）[S77][S59]。一方 2026 年の報告では standalone=true [S29 のコメント] → 要確認。
- **実装上の推奨**: Safari タブと HSWA の両方で動く設計にする。判定は `navigator.standalone` と `matchMedia('(display-mode: standalone)')`・`(display-mode: fullscreen)` を併用。
- **出典**: [S3][S77][S59][S29]
- **確度**: 確定（iOS 26 の変更）／要確認（display-mode の判定）

### 6-2 Web App Manifest の対応範囲（iOS）
- **対応（BCD）**: manifest の link は 11.3、name／short_name／start_url／scope／display は 11.3、display: standalone は 11.3（fullscreen／minimal-ui は非対応扱い）、icons は 15.4、theme_color は 15、id は 16.4 [S59]。
- **非対応（BCD）**: background_color、orientation、shortcuts（iOS）、display_override、share_target [S59]。
- **出典**: [S59]
- **確度**: 確定

### 6-3 アイコンと apple-touch-icon の必要性
- **対応状況**: manifest の icons は「apple-touch-icon が無く、purpose が any か未指定」のときだけ使われる。apple-touch-icon が優先（Safari 15.4）[S13]。Safari 26.0 からアイコンに SVG が使え、ホーム画面アイコンにも同じアイコンが使われる（Data URL も可）[S3]。一度追加したアイコンは後から更新されない（古い: 2020。WebKit 外の問題として MOVED）[S69]。
- **実装上の推奨**: 180×180 の PNG を apple-touch-icon に指定（旧ガイドの推奨サイズ。古い: 2016）[S67]＋ manifest icons（purpose any）。iOS 18 以前の端末も考えるなら PNG を基本に。アイコンを変えたら「再追加が必要」と案内。
- **出典**: [S13][S3][S69][S67]
- **確度**: 確定（15.4・26.0）／apple-touch-icon のサイズは古い資料

### 6-4 起動画面（スプラッシュ）
- **対応状況**: manifest の background_color は iOS 非対応 [S59]。旧ガイド（古い: 2016）: `apple-touch-startup-image` で起動画像を指定でき、既定は「a screenshot of the web application the last time it was launched」[S67]。
- **既知の不具合**: iOS 27.0.1 で apple-touch-startup-image の media クエリの device-height が誤って評価され、起動画像が出ず黒画面（NEW）[S68]。
- **実装上の推奨**: 起動画面に頼らない（軽い初期 HTML と背景色ですぐ描画）。startup image は任意扱い。
- **出典**: [S59][S67][S68]
- **確度**: 要確認（古い資料とユーザー報告のみ）

### 6-5 ステータスバー
- **旧ガイド（古い: 2016）**: `apple-mobile-web-app-status-bar-style` は standalone のときだけ有効。全画面に描くなら translucent black（black-translucent）[S67]。
- **iOS 26 以降の報告**:
  - theme-color は Safari 26 からインストール済み Web アプリでのみ使われる（MDN BCD の注記。根拠はコミュニティの検証）[S59][S76]。
  - Safari のバーの色はページ背景や上部の固定要素から決まる（Apple の Wenson Hsieh の説明、2025-11）[S75]。
  - 26.2 から、HSWA でもソフトナビゲーション時にステータスバーの背景が影に置き換わる（NEW）[S73]。
  - iOS 27 で HSWA の上端（ステータスバー付近）がぼける（NEW）[S74]。
  - black-translucent を付けずにインストールすると 100vh／100lvh が誤った値になり、後からメタタグを足しても**再インストールまで直らない**（NEW、iOS 26）[S70]。
- **実装上の推奨**: 最初の公開時から `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` と `viewport-fit=cover`、safe-area の余白を入れておく（後から変えにくい）。body の背景色と上部固定ヘッダーの色を揃える。実機で確認。
- **出典**: [S67][S59][S76][S75][S73][S74][S70]
- **確度**: 要確認（多くがユーザー報告）

### 6-6 safe-area-inset、viewport-fit=cover、100dvh
- **対応状況**: `env(safe-area-inset-*)` は Safari 11（`env()` 関数は 11.1、11.0 は `constant()`）、dvh／svh／lvh は 15.4 以降 [S59]。
- **HSWA の高さに関する既知の不具合（いずれもユーザー報告、NEW）**:
  - viewport-fit=cover の HSWA で 100svh・-webkit-fill-available・visualViewport.height が safe-area 分だけ短い（2023〜、iOS 18.3.1 でも）。報告者の回避策は standalone では 100vh [S71]。
  - iOS 26.6 の HSWA で innerHeight／visualViewport が screen.height より約 62px 短く、`position: fixed; inset: 0` でも下に隙間 [S72]。
  - HSWA でキーボードを一度出すと visualViewport.height が約 68px 短いまま [S89]。
  - Safari（ブラウザ）の縦向きでは viewport-fit=cover の上下が効かない（Apple の Tim Horton「currently necessary for web compatibility」、2026-08）[S88]。
- **実装上の推奨**: アプリの外枠は `height: 100dvh` を基本に CSS 変数で切り替えられるようにし、HSWA 判定時の値を調整できるようにする。下部の操作ボタンには `padding-bottom: env(safe-area-inset-bottom)`。ノッチ／Dynamic Island のある実機で、Safari と HSWA の両方を確認。
- **出典**: [S59][S71][S72][S89][S88]
- **確度**: 確定（対応版）／要確認（不具合）

---

## 7. その他

### 7-1 Screen Wake Lock
- **対応状況**: Safari 16.4 から対応。**HSWA では iOS 18.4 から動作**（「The Screen Wake Lock API now also works in Home Screen Web Apps on iOS and iPadOS 18.4.」）[S7][S63]。BCD も iOS 18.4（16.4〜18.4 は HSWA で動かない部分対応）[S59]。caniuse の不具合注記は古いまま（HSWA 不可）[S61]。iOS 26.1 での退行の報告は報告者自身が撤回 [S63]。
- **実装上の推奨**: 練習中だけ `navigator.wakeLock.request('screen')`、`visibilitychange` で取り直す。
- **出典**: [S7][S63][S59][S61]
- **確度**: 確定

### 7-2 Vibration API
- **対応状況**: 非対応（BCD false、caniuse n）[S59][S61]。
- **確度**: 確定

### 7-3 ハプティクスの代替
- **対応状況**: iOS 18 の Safari で `<input type="checkbox" switch>` をタップすると触覚フィードバックがある [S8]。ユーザーがスイッチを直接タップしたときの機能で、任意のタイミングで振動させる API ではない。HSWA での動作、プログラムから誘発する方法（非公式の手法）は未確認。
- **実装上の推奨**: 正誤のフィードバックは画面表示と短い効果音で。触覚が必須ならネイティブ化（`@capacitor/haptics`）。
- **出典**: [S8]
- **確度**: 確定（switch）／未確認（HSWA・プログラム誘発）

### 7-4 Badging
- **対応状況**: iOS 16.4 から **HSWA 限定**。通知の許可が必要（「the badge will only appear if the user has granted notifications permission」）[S12]。0 を渡すとクリア [S59]。
- **出典**: [S12][S59]
- **確度**: 確定

### 7-5 共有（Web Share API）
- **対応状況**: `navigator.share` は Safari 12.1／iOS 12.2 以降、files は Safari 14 以降（BCD）[S59][S61]。ユーザー操作中に呼ぶ必要がある（WebKit は activation 確認後に canShare を評価、bug 229132）[S92]。HSWA 固有の制限は一次資料で見つからず（未確認）。
- **出典**: [S59][S61][S92]
- **確度**: 確定（対応）／未確認（HSWA 固有の挙動）

### 7-6 ファイルのエクスポート（Blob ダウンロード）
- **対応状況**: `<a download>` は BCD で Safari 10.1 [S59]。HSWA では iOS 13.3.1 で無反応 → 報告者が iOS 14.3 で直ったと記載（古い: 2020）[S64]。**iOS 18.4（16.7.10 でも）の HSWA でダウンロードすると「Open in…」画面になり、アプリ内に戻れず強制終了が必要**（NEW、WebKit の Jen Simmons が報告を依頼したもの）[S65]。File System Access API（`showSaveFilePicker` 等）は非対応、OPFS（`navigator.storage.getDirectory`）は 15.2、`createWritable` は 26（BCD）[S59]。
- **実装上の推奨**: エクスポートは `navigator.canShare({ files })` が真なら `navigator.share({ files: [file] })`（共有シートから「ファイルに保存」）、偽なら `<a download>`。HSWA の実機で必ず確認。
- **出典**: [S59][S64][S65]
- **確度**: 確定（API の対応）／要確認（HSWA での挙動）

### 7-7 ファイルのインポート
- **対応状況**: `<input type="file">` は使える。ただし `accept="audio/*"` は iOS で video/* 扱いになり音声ファイルを選べない（古い: 2022、NEW、BCD 注記あり）[S66][S59]。
- **実装上の推奨**: バックアップ（JSON）の読み込みは `accept="application/json,.json"` とし、実機で選べるか確認。読み込みは `File.text()`。
- **出典**: [S66][S59]
- **確度**: 確定（不具合の存在）／要確認（JSON の accept 指定）

### 7-8 そのほか注意
- **ロックダウンモード**: Web Speech、IndexedDB、Service Worker、Cache API が無効になる [S11][S9] → 該当ユーザー向けの注意書き。
- **日本の制度変更**: iOS 26.2 以降、日本では WebKit 以外のブラウザエンジンが一定条件で許可された [S85]。HSWA への影響は一次資料で見つからず（未確認）。
- **UA 文字列**: iOS 27 で UA の OS 表記が「iPhone OS 18_7」のまま（Version/27.0）というユーザー報告 [S29 のコメント] → バージョン判定ではなく機能検出で分岐する。

---

## 8. Capacitor で後からネイティブ化する場合（参考）

- **現行版**: `@capacitor/core` 8.5.3（2026-10-07 公開、npm）[S79]。
- **WKWebView の設定（Capacitor iOS ソース）**: `mediaTypesRequiringUserActionForPlayback = []`（メディア再生にユーザー操作を求めない）、WebView のカメラ／マイク許可要求を自動で許可（`decisionHandler(.grant)`）[S78]。OS のマイク許可（Info.plist の `NSMicrophoneUsageDescription`）は別に必要 [S81]。→ Web 版の「起動ごとの許可」「初回タップ必須」は緩和される可能性がある（speechSynthesis は audioPlaybackRequiresUserGesture 設定に従う、という 2021 の WebKit 変更 [S33] からの推論）→要確認。
- **WKWebView での webkitSpeechRecognition**: `NSSpeechRecognitionUsageDescription` が必要（WebKit 担当者、2022）[S39]。
- **置き換え候補（npm の最新版と公開日）**:
  - TTS: `@capacitor-community/text-to-speech` 8.0.2（2026-06-15）。iOS は AVSpeechSynthesizer を使い、声は `AVSpeechSynthesisVoice.speechVoices()`（端末で使える全音声）から選ぶ。`usesApplicationAudioSession = false`（システムが別セッションで管理）[S80][S79]。Apple Docs 上、`speechVoices()` は「Retrieves all available voices on the device」[S84]。`@capgo/capacitor-speech-synthesis` 8.0.25 もある [S79]。
  - 音声認識: `@capacitor-community/speech-recognition` 7.0.1（2025-06、peer は @capacitor/core >=7）。SFSpeechRecognizer、partialResults、AVAudioSession を playAndRecord に設定 [S81][S79]。`@capgo/capacitor-speech-recognition` 8.4.1（2026-10-09）。既定は SFSpeechRecognizer、`useOnDeviceRecognition: true` で iOS 26 以降の SpeechAnalyzer／SpeechTranscriber を使う [S82][S83]。
  - 録音: `@capgo/capacitor-audio-recorder` 8.3.2、`capacitor-voice-recorder` 7.0.6 [S79]。
  - その他: `@capacitor/haptics` 8.0.2、`@capacitor/share` 8.0.3、`@capacitor/filesystem` 8.1.4、`@capacitor-community/keep-awake` 8.0.1 [S79]。
- **注意**: プラグインの品質・保守状況は評価していない（参考程度）。ネイティブでも音声認識・TTS・録音の同時使用はオーディオセッションの設計が必要。
- **確度**: 確定（版・ソースの記載）／要確認（実際の挙動）

---

## 9. 実機で確かめるべき項目（設計前の検証リスト）

1. Safari と HSWA の両方で、最初のタップ内の `speak()` → 以後の自動 `speak()` が動くか（再起動後も）。
2. `getVoices()` の英語音声一覧（en-US／en-GB／en-AU 等）と、初回が空になるか。
3. 消音スイッチ ON/OFF × `navigator.audioSession.type`（未設定／playback）で、TTS・`<audio>`・Web Audio が鳴るか。
4. HSWA で webkitSpeechRecognition が動くか。iOS 27.0.x で 2 回目以降も認識できるか。TTS → 認識の切り替えが動くか。
5. 録音の `recorder.mimeType`、お手本再生（ended）直後の録音が 0 バイトにならないか。
6. HSWA でマイク許可が出る頻度（同一起動中・再起動後）。
7. `navigator.storage.persist()` の結果（Safari と HSWA）。
8. エクスポート（Web Share の files、`<a download>`）とインポート（JSON）が HSWA で完結するか。
9. 100dvh・safe-area・ステータスバー（black-translucent の有無）の見た目。

---

## 出典一覧（参照日はすべて 2026-10-12）

| 番号 | タイトル（公開・更新日） | URL | 短い原文引用 |
|---|---|---|---|
| S1 | WebKit Features for Safari 27.0（2026-09-17） | https://webkit.org/blog/18325/webkit-features-for-safari-27-0/ | "Fixed an issue where calling speechSynthesis.cancel() removed utterances queued by subsequent speechSynthesis.speak() calls." / "Fixed the WebProcess AudioSession to remain active while microphone capture is live." |
| S2 | News from WWDC26: WebKit in Safari 27 beta（2026-06-08） | https://webkit.org/blog/17967/news-from-wwdc26-webkit-in-safari-27-beta/ | "58 new features, 525 fixes and 4 deprecations" |
| S3 | WebKit Features in Safari 26.0（2025-09-15） | https://webkit.org/blog/17333/webkit-features-in-safari-26-0/ | "By default, every website added to the Home Screen opens as a web app." / "Safari 26.0 also adds support for ALAC and PCM audio in MediaRecorder." |
| S4 | WebKit Features for Safari 26.2（2025-12-12） | https://webkit.org/blog/17640/webkit-features-for-safari-26-2/ | "Fixed an issue where an audio element failed to play when re-opening a Home Screen Web App." |
| S5 | WebKit Features for Safari 26.4（2026-03-24） | https://webkit.org/blog/17862/webkit-features-for-safari-26-4/ | "Safari 26.4 now exposes the MediaDeviceInfo interface only in secure contexts (HTTPS)" |
| S6 | WebKit Features for Safari 26.5（2026-05-11） | https://webkit.org/blog/17938/webkit-features-for-safari-26-5/ | "Fixed an issue where IndexedDB connections could become permanently broken until the page was reloaded." |
| S7 | WebKit Features in Safari 18.4（2025-03-31） | https://webkit.org/blog/16574/webkit-features-in-safari-18-4/ | "The Screen Wake Lock API now also works in Home Screen Web Apps on iOS and iPadOS 18.4." / "MediaRecorder ... now supports creating WebM files using the Opus audio codec" |
| S8 | WebKit Features in Safari 18.0（2024-09-16） | https://webkit.org/blog/15865/webkit-features-in-safari-18-0/ | "WebKit for Safari on iOS 18 adds haptic feedback for <input type=checkbox switch>." |
| S9 | WebKit Features in Safari 17.0（2023-09） | https://webkit.org/blog/14445/webkit-features-in-safari-17-0/ | "Previously, an origin had a starting storage limit of 1 GB." / "Safari does not copy over any other kind of local storage." / "Disables IndexedDB." |
| S10 | Updates to Storage Policy（2023-08-10） | https://webkit.org/blog/14403/updates-to-storage-policy/ | "it has the same origin quota and overall quota as when it is opened in a browser app." / "WebKit currently grants a request based on heuristics like whether the website is opened as a Home Screen Web App." |
| S11 | WebKit Features in Safari 16.4（2023-03） | https://webkit.org/blog/13966/webkit-features-in-safari-16-4/ | "Support for a subset of the AudioSession Web API" / "Disable ServiceWorkers ... Disable WebSpeech API"（ロックダウンモード） |
| S12 | Badging for Home Screen Web Apps（2023-04-25） | https://webkit.org/blog/14112/badging-for-home-screen-web-apps/ | "the Badging API is available exclusively for web apps the user has added to their home screen." |
| S13 | New WebKit Features in Safari 15.4（2022-03） | https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/ | "Safari and iOS use manifest-declared icons when there is no apple-touch-icon defined in the HTML head" |
| S14 | New WebKit Features in Safari 15（2021-09） | https://webkit.org/blog/11989/new-webkit-features-in-safari-15/ | "WebKit now provides support for theme-color in HTML meta tags, and in Web Manifest." |
| S15 | New WebKit Features in Safari 14.1（2021-04） | https://webkit.org/blog/11648/new-webkit-features-in-safari-14-1/ | "Safari supports speech recognition powered by the same speech engine as Siri." |
| S16 | MediaRecorder API（2020-11-23） | https://webkit.org/blog/11353/mediarecorder-api/ | "Safari in the latest iOS 14.3 beta enabled support for the MediaRecorder API by default." |
| S17 | Full Third-Party Cookie Blocking and More（2020-03-24） | https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/ | "Web applications added to the home screen are not part of Safari and thus have their own counter of days of use." |
| S18 | New <video> Policies for iOS（2016-07-25） | https://webkit.org/blog/6784/new-video-policies-for-ios/ | "video.play() will return a Promise, which will be rejected if any of these conditions are not met." |
| S19 | WebKit ソース SpeechSynthesis.cpp（main） | https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/speech/SpeechSynthesis.cpp | "// Like Audio, we should require that the user interact to start a speech synthesis session." |
| S20 | WebKit ソース PlatformSpeechSynthesizerCocoa.mm（main） | https://github.com/WebKit/WebKit/blob/main/Source/WebCore/platform/cocoa/PlatformSpeechSynthesizerCocoa.mm | "if (voice.isSystemVoice)" / "// AVSpeechSynthesizer asks for 0 -> 1 (default. 5)"（voiceschanged の Cocoa 実装は Bug 260228、2023-08: https://bugs.webkit.org/show_bug.cgi?id=260228） |
| S21 | WebKit Bug 304944／commit 305673@main（2026-01-15）、テスト voices-non-mock.html | https://bugs.webkit.org/show_bug.cgi?id=304944 / https://commits.webkit.org/305673@main / https://github.com/WebKit/WebKit/blob/main/LayoutTests/fast/speechsynthesis/voices-non-mock.html | "This tests that the voice list can initially be empty and populated after voiceschanged event." |
| S22 | WebKit ソース WebSpeechRecognizerTask.mm（main） | https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/speech/cocoa/WebSpeechRecognizerTask.mm | "if ([_recognizer supportsOnDeviceRecognition]) [_request setRequiresOnDeviceRecognition:YES];" |
| S23 | WebKit ソース DOMAudioSession.cpp（main） | https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/audiosession/DOMAudioSession.cpp | "case DOMAudioSession::Type::Playback: return AudioSessionCategory::MediaPlayback;" |
| S24 | WebKit ソース MediaSessionManagerCocoa.mm（main） | https://github.com/WebKit/WebKit/blob/main/Source/WebCore/platform/audio/cocoa/MediaSessionManagerCocoa.mm | "else if (webAudioCount) category = AudioSession::CategoryType::AmbientSound;" |
| S25 | WebKit ソース AudioContext.cpp（main） | https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/webaudio/AudioContext.cpp | "if (document.isCapturing()) return true; ... return window && window->hasTransientActivation();" |
| S26 | WebKit ソース LocalStorageManager.cpp（main） | https://github.com/WebKit/WebKit/blob/main/Source/WebKit/NetworkProcess/storage/LocalStorageManager.cpp | "constexpr unsigned localStorageQuotaInBytes = 5 * MB;" |
| S27 | WebKit 時間ベース削除（Bug 313865／315158／314872／314277、2026-05） | https://bugs.webkit.org/show_bug.cgi?id=313865 / https://commits.webkit.org/312741@main / https://commits.webkit.org/314090@main / https://github.com/WebKit/WebKit/blob/main/Source/WebKit/UIProcess/WebsiteData/WebsiteDataStoreConfiguration.h | "deletes data for origins not accessed within a configurable threshold (default 180 days)" / "This exempts all origins with an active push subscription" |
| S28 | WebKit Bug 225298（2021） | https://bugs.webkit.org/show_bug.cgi?id=225298#c3 | "SpeechRecognition API is not available in SafariViewController and web apps added to Home Screen for now." |
| S29 | WebKit Bug 321436（2026-08〜、iOS 26.6／27.0） | https://bugs.webkit.org/show_bug.cgi?id=321436 | "both plain Safari and installed/Add to Home Screen standalone mode" |
| S30 | WebKit Bug 324436（2026-09、iOS 27） | https://bugs.webkit.org/show_bug.cgi?id=324436 | "calling speechSynthesis.speak() while a continuous webkitSpeechRecognition session is active produces no audio" |
| S31 | WebKit Bug 325274（2026-09、iOS 27） | https://bugs.webkit.org/show_bug.cgi?id=325274 | "the AudioContext produces no sound until the page is reloaded" |
| S32 | WebKit Bug 326069（2026-10、iOS 27.0〜27.0.1） | https://bugs.webkit.org/show_bug.cgi?id=326069 | "only the first session in the tab works." |
| S33 | WebKit Bug 223473（2021） | https://bugs.webkit.org/show_bug.cgi?id=223473 | "iOS always requires a gesture for SpeechSynthesis to speak." |
| S34 | WebKit Bug 278598（2024、iOS 17） | https://bugs.webkit.org/show_bug.cgi?id=278598 | "speechSynthesis always ducks other audio ... navigator.audioSession.type does not fix this either." |
| S35 | WebKit Bug 218815（2020〜2026） | https://bugs.webkit.org/show_bug.cgi?id=218815 | "audio tracks from getUserMedia are muted" |
| S36 | Apple Developer Forums 723503（2023〜2024） | https://developer.apple.com/forums/thread/723503 | "only the pre-installed voices are available. Optionally downloadable voices are not available." |
| S37 | WebKit Bug 250665（2023〜2025） | https://bugs.webkit.org/show_bug.cgi?id=250665 | "Only low-quality "Eloquence" group voices are listed." |
| S38 | WebKit Bug 288963（2025、iOS 17/18） | https://bugs.webkit.org/show_bug.cgi?id=288963 | "In some cases, recognition fails entirely" |
| S39 | WebKit Bug 239816（2022） | https://bugs.webkit.org/show_bug.cgi?id=239816 | "your app might need to add NSSpeechRecognitionUsageDescription" |
| S40 | WebKit ソース SpeechRecognitionPermissionManager.cpp（main） | https://github.com/WebKit/WebKit/blob/main/Source/WebKit/UIProcess/SpeechRecognitionPermissionManager.cpp | "requestUserMediaPermissionForSpeechRecognition" / "Page is not visible to user" |
| S41 | WebKit Bug 185448（2018〜2020） | https://bugs.webkit.org/show_bug.cgi?id=185448 | "WebRTC (getUserMedia) should work as expected in home screen web apps." |
| S42 | WebKit Bug 215884（2020〜2026） | https://bugs.webkit.org/show_bug.cgi?id=215884 | "On Safari, there is the possibility to grant persistent access to camera and/or microphone." |
| S43 | WebKit Bug 327237（2026-10-12） | https://bugs.webkit.org/show_bug.cgi?id=327237 | "Home Screen web apps have no equivalent setting and do not use Safari's per-site setting." |
| S44 | WebKit Bug 299164（2025〜2026） | https://bugs.webkit.org/show_bug.cgi?id=299164 | "The fix was released with iOS 26.2." |
| S45 | WebKit Bug 301507（2025〜2026） | https://bugs.webkit.org/show_bug.cgi?id=301507 | "all segments generated by the MediaRecorder will start with a keyframe." |
| S46 | WebKit Bug 305827（2026-01、iOS 26） | https://bugs.webkit.org/show_bug.cgi?id=305827 | "MIME type (auto-selected): "audio/mp4; codecs=mp4a.40.2"" |
| S47 | WebKit Bug 325916（2026-10、iOS 27） | https://bugs.webkit.org/show_bug.cgi?id=325916 | "calling start() synchronously inside the tap handler" works |
| S48 | WebKit Bug 237322（2022〜2024） | https://bugs.webkit.org/show_bug.cgi?id=237322 | "Since iOS 17, you can set the audio session type to "playback"" |
| S49 | WebKit Bug 264473（2023〜2025） | https://bugs.webkit.org/show_bug.cgi?id=264473 | "sound will not be heard if the silent switch is on." |
| S50 | WebKit Bug 291892（2025） | https://bugs.webkit.org/show_bug.cgi?id=291892 | "any webpage added to the home screen as a PWA will only work with Web Audio on the first run." |
| S51 | WebKit Bug 295518（2025、iOS 26） | https://bugs.webkit.org/show_bug.cgi?id=295518 | "REGRESSION (iOS 26): Audio Element Fails to Play on Reopen in PWA" |
| S52 | WebKit Bug 323022（2026-08、iOS 26） | https://bugs.webkit.org/show_bug.cgi?id=323022 | "Setting navigator.audioSession.type = 'playback' at page load prevents the whole problem" |
| S53 | W3C Audio Session（Editor's Draft, 2024-11-13） | https://w3c.github.io/audio-session/ | "enum AudioSessionType { "auto", "playback", "transient", "transient-solo", "ambient", "play-and-record" };" |
| S54 | Apple Docs: AVAudioSession.Category.ambient | https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/ambient | "Screen locking and the Silent switch (on iPhone, the Ring/Silent switch) silence your audio." |
| S55 | Apple Docs: AVAudioSession.Category.playback | https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playback | "your app audio continues with the Silent switch set to silent" |
| S56 | Apple Docs: AVAudioSession.Category.playAndRecord | https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playandrecord | "Your audio continues with the Silent switch set to silent" |
| S57 | Apple Docs: AVSpeechUtterance.pitchMultiplier | https://developer.apple.com/documentation/avfaudio/avspeechutterance/pitchmultiplier | "within the range of 0.5 for lower pitch to 2.0 for higher pitch. The default value is 1.0." |
| S58 | Apple Docs: SFSpeechRecognizer.supportsOnDeviceRecognition／SFSpeechRecognitionRequest.requiresOnDeviceRecognition | https://developer.apple.com/documentation/speech/sfspeechrecognizer/supportsondevicerecognition / https://developer.apple.com/documentation/speech/sfspeechrecognitionrequest/requiresondevicerecognition | "If supportsOnDeviceRecognition is false, the SFSpeechRecognizer requires a network in order to recognize speech." |
| S59 | MDN browser-compat-data（GitHub main、2026-10-12 のコミット 85c50b0） | https://github.com/mdn/browser-compat-data | 例: WakeLock の iOS 注記 "Does not work in standalone Home Screen Web Apps."（16.4〜18.4） |
| S60 | MDN: Using the Web Speech API（最終更新 2026-08-31） | https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API | "By default, using speech recognition on a web page involves a server-based recognition engine." |
| S61 | caniuse（Fyrd/caniuse 2026-10-07 のデータ） | https://caniuse.com/speech-recognition / https://caniuse.com/speech-synthesis / https://caniuse.com/wake-lock / https://caniuse.com/vibration / https://caniuse.com/web-share | "Siri needs to be enabled. Not available in SafariViewController and web apps added to Home Screen" |
| S62 | WebKit Bug 181849（2018〜2022） | https://bugs.webkit.org/show_bug.cgi?id=181849 | "Home Screen apps are created as isolated entities without shared state with the browser." |
| S63 | WebKit Bug 254545（2023〜2025） | https://bugs.webkit.org/show_bug.cgi?id=254545#c65 | "The Screen Wake Lock API now works in Home Screen Web Apps on iOS and iPadOS 18.4" |
| S64 | WebKit Bug 209407（2020） | https://bugs.webkit.org/show_bug.cgi?id=209407 | "it appears that the bug/limitation has been fixed in (or possibly before) iOS 14.3." |
| S65 | WebKit Bug 290847（2025、iOS 18.4） | https://bugs.webkit.org/show_bug.cgi?id=290847 | "any file download ... will result in an "Open in …" splash screen that prohibits further navigation inside the Web App." |
| S66 | WebKit Bug 242110（2022） | https://bugs.webkit.org/show_bug.cgi?id=242110 | "File input treats accept="audio/*" as accept="video/*"" |
| S67 | Apple: Configuring Web Applications（Safari Web Content Guide、2016-12-12 更新、アーカイブ） | https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html | "By default, a screenshot of the web application the last time it was launched is used." |
| S68 | WebKit Bug 326500（2026-10、iOS 27） | https://bugs.webkit.org/show_bug.cgi?id=326500 | "the web app launches on a black screen." |
| S69 | WebKit Bug 216197（2020） | https://bugs.webkit.org/show_bug.cgi?id=216197 | "once an app has been added to the home screen the apple-touch-icon never updates when changed." |
| S70 | WebKit Bug 316008（2026-06、iOS 26） | https://bugs.webkit.org/show_bug.cgi?id=316008 | "once a user installs the web app, it remains broken unless the user completely reinstalls the web app." |
| S71 | WebKit Bug 254868（2023〜2026） | https://bugs.webkit.org/show_bug.cgi?id=254868 | "report heights of the available space *minus* safe-area-inset" |
| S72 | WebKit Bug 323403／313800（2026） | https://bugs.webkit.org/show_bug.cgi?id=323403 / https://bugs.webkit.org/show_bug.cgi?id=313800 | "innerHeight still measures smaller than screen.height" |
| S73 | WebKit Bug 305546（2026-01、Safari 26.2） | https://bugs.webkit.org/show_bug.cgi?id=305546 | "This behaviour is reproducible in both Home Screen Apps and Safari." |
| S74 | WebKit Bug 324438（2026-09、iOS 27） | https://bugs.webkit.org/show_bug.cgi?id=324438 | "Starting in iOS 27 PWAs are blurry at the top near the status bar." |
| S75 | WebKit Bug 301756（2025-10〜） | https://bugs.webkit.org/show_bug.cgi?id=301756 | "A solid background color extension ("top bar tint") is only needed in cases where there's a viewport-constrained (fixed or sticky) element" |
| S76 | MDN BCD PR #28503（2026-05-15 マージ） | https://github.com/mdn/browser-compat-data/pull/28503 | "Safari 26 uses <meta name="theme-color"> only for web apps" |
| S77 | WebKit Bug 264218（2023） | https://bugs.webkit.org/show_bug.cgi?id=264218 | "Actual: The page reports that the current display mode is "fullscreen"" |
| S78 | Capacitor iOS ソース（CAPBridgeViewController.swift／WebViewDelegationHandler.swift、main） | https://github.com/ionic-team/capacitor/blob/main/ios/Capacitor/Capacitor/CAPBridgeViewController.swift / https://github.com/ionic-team/capacitor/blob/main/ios/Capacitor/Capacitor/WebViewDelegationHandler.swift | "webViewConfiguration.mediaTypesRequiringUserActionForPlayback = []" / "decisionHandler(.grant)" |
| S79 | npm レジストリ（@capacitor/core ほか各プラグイン） | https://www.npmjs.com/package/@capacitor/core / https://www.npmjs.com/package/@capacitor-community/text-to-speech / https://www.npmjs.com/package/@capgo/capacitor-speech-recognition | @capacitor/core latest 8.5.3（2026-10-07） |
| S80 | capacitor-community/text-to-speech iOS ソース | https://github.com/capacitor-community/text-to-speech/blob/HEAD/ios/Sources/TextToSpeechPlugin/TextToSpeech.swift | "self.synthesizer.usesApplicationAudioSession = false" |
| S81 | capacitor-community/speech-recognition（README・iOS ソース） | https://github.com/capacitor-community/speech-recognition | "NSSpeechRecognitionUsageDescription" / "NSMicrophoneUsageDescription" |
| S82 | Cap-go/capacitor-speech-recognition README | https://github.com/Cap-go/capacitor-speech-recognition | "On iOS 26+, it uses Apple's SpeechAnalyzer / SpeechTranscriber stack." |
| S83 | Apple Docs: SpeechAnalyzer（iOS 26.0〜） | https://developer.apple.com/documentation/speech/speechanalyzer | "Analyzes spoken audio content in various ways and manages the analysis session." |
| S84 | Apple Docs: AVSpeechSynthesisVoiceQuality／speechVoices() | https://developer.apple.com/documentation/avfaudio/avspeechsynthesisvoicequality / https://developer.apple.com/documentation/avfaudio/avspeechsynthesisvoice/speechvoices() | "An enhanced quality voice that you must download to use." / "Retrieves all available voices on the device." |
| S85 | Apple Developer: Using alternative browser engines in Japan | https://developer.apple.com/support/alternative-browser-engines-jp/ | "In iOS 26.2 and later, browser engines other than WebKit can be used in two types of apps for users in Japan" |
| S86 | WICG/speech-api issue #96（2021〜2026） | https://github.com/WICG/speech-api/issues/96 | "This might be an issue related to the AudioSession being deactivated while speech recognition is running." |
| S87 | WebKit Bug 317741／317747（2026-06〜07） | https://bugs.webkit.org/show_bug.cgi?id=317741 / https://bugs.webkit.org/show_bug.cgi?id=317747 | "Speech recognition microphone source should make sure to keep its audio session active while capturing" |
| S88 | WebKit Bug 306465（2026） | https://bugs.webkit.org/show_bug.cgi?id=306465 | "Unfortunately, this is currently necessary for web compatibility." |
| S89 | WebKit Bug 322900（2026-08） | https://bugs.webkit.org/show_bug.cgi?id=322900 | "visualViewport.height is permanently ~68px shorter than the window after the software keyboard is first shown in a standalone (home screen) web app"（件名） |
| S90 | WebKit Bug 292142／315804 | https://bugs.webkit.org/show_bug.cgi?id=292142 / https://bugs.webkit.org/show_bug.cgi?id=315804 | "REGRESSION (iOS 18.4.x): Accessing BLOBs stored in IndexedDB leads to Networking process getting terminated"（件名） |
| S91 | WebKit Bug 217598（2020） | https://bugs.webkit.org/show_bug.cgi?id=217598 | "If you set SpeechSynthesisUtterance.rate to 4 or higher ... for Japanese speech, it is the same as before."（件名） |
| S92 | WebKit Bug 229132（2021） | https://bugs.webkit.org/show_bug.cgi?id=229132 | "Web Share CanShare() should be called after transient activation check"（件名） |

### 探したが見つからなかったもの
- 消音スイッチ時の speechSynthesis の挙動: WebKit Blog（Safari 13.1〜27.0）、Bugzilla（件名検索 speechSynthesis／silent／ringer）、Apple Developer Forums（thread 118077 ほか）を確認したが明言なし。
- HSWA で SpeechRecognition を有効にした告知: WebKit Blog（Safari 14.1〜27.0）とリリースノートで記載なし。
- iOS に標準搭載される英語音声の一覧: Apple の公式文書で見つからず。
- iOS の HSWA で Safari の Cookie がコピーされるかの公式記載: 見つからず（Mac のみ記載）。
