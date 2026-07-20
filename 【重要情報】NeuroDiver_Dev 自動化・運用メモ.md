【重要情報】NeuroDiver_Dev 自動化・運用メモ
最終更新：2026-07-20 このファイルは、構築した自動化の設定と、今後の運用で必要になる情報の記録です。


1. 完成した自動化（Phase 3：note → X 自動告知）
仕組み noteに新記事を公開 → Make.comが15分以内に検知 → Bufferの予約キューにX投稿を自動追加 → BufferがXへ投稿。

あなたがやること：noteに記事を書くだけ。

投稿される文面の形

新しい記事を書きました📝 [記事タイトル]
[記事URL]


2. 各サービスの設定情報
GitHub
このファイルの記録先：https://github.com/ChRo05/note_Dev.git （note関連）
Patreon関連資料の記録先：https://github.com/ChRo05/patreon_NeuroDiver_Dev.git
アカウント：ChRo05（個人アカウント） ※会社アカウント(TK20260401)と取り違えない
認証：.git-credentials ファイル方式（credential.helper store）で保存済み
note（RSSの元）
プロフィール：https://note.com/lush_cosmos4027
RSSアドレス：https://note.com/lush_cosmos4027/rss
Make.com
シナリオ名：Integration RSS
構成：RSS（Watch RSS feed items）→ HTTP（Make a request / POST）
スケジュール：15分ごと（Every 15 minutes = オン）
プラン：Free（月1,000クレジット。1投稿≒2クレジットなので十分収まる）
ホスティングリージョン：EU
Buffer
接続チャンネル：X（@Kiku03T） ※個人アカウント
チャンネルID：6a5d9601e2638b94d79c5ec1
組織ID：6a5d94e97c7742cc07619e48
プラン：Free（3チャンネル / 1チャンネルあたり予約10件まで）
APIキー：Bufferの設定画面 https://publish.buffer.com/settings/api に保存（名前「Make連携用」／末尾「2jyQ」）
有効期限：2027-07-20 ← 期限が来たら要更新（下記参照）
※キー全文はセキュリティのためここには記載しない。BufferとMakeの中に保存済み。


3. Make の HTTPモジュール設定（再構築が必要になった時用）
Authentication type：No authentication
URL：https://api.buffer.com
Method：POST
Headers：
Content-Type : application/json
Authorization : Bearer （半角スペース）＋ Buffer APIキー（Bearerとキーの間は半角スペース1つ。キーは「_」始まり）
Body input method：JSON string
Body content（TitleとURLはRSSの差し込みタグに置き換える）：

{"query":"mutation CreatePost($text: String!, $channelId: ChannelId!) { createPost(input: { text: $text, channelId: $channelId, schedulingType: automatic, mode: addToQueue }) { ... on PostActionSuccess { post { id text dueAt } } ... on MutationError { message } } }","variables":{"text":"新しい記事を書きました📝 [Title]\n[URL]","channelId":"6a5d9601e2638b94d79c5ec1"}}

ハマりやすいポイント（実際に詰まった箇所）

Bearer とキーの間は必ず半角スペース（アンダースコアでつなげない）
型は $channelId: ChannelId!（String! ではエラーになる）
キー末尾に余分な改行・空白が入らないよう注意


4. APIキー更新の手順（2027年7月頃）
https://publish.buffer.com/settings/api を開く
「+ New Key」で新しいキーを発行（有効期限は一番長いものを選ぶ）
発行されたキーをコピー
Makeの Integration RSS シナリオ → HTTPモジュール → Headers の Authorization の Value を Bearer （スペース）新しいキー に差し替え → Save
Run once でテスト → 緑チェックが出れば復活


5. なぜBufferを経由しているか（背景）
Make.comは2025年にX（旧Twitter）のネイティブ連携を廃止した（X社のAPI規約変更のため）。 そのため「Make → Buffer（API経由）→ X」という構成にしている。 Bufferの個人用APIキーを使い、汎用HTTPモジュールでBufferに直接投稿命令を送っている。


6. 自動化の全体像と進捗
Phase 1：note → Patreon/SNS 下書きを自動生成（プロンプト運用）… 資料あり
Phase 2：生成した告知を予約ツールで自動配信（Typefully等）… 資料あり
Phase 3：note公開 → X自動告知 … ✅ 稼働中（2026-07-20 完成）
Phase 4：新規支援者へ歓迎メール自動送信（解約対策）… 支援者がつき始めてから構築

次の注力ポイント：今は集客（X・noteのフォロワー増やし）に集中。Phase 4は支援者が増えてから。


7. 関連ファイルの保存先
Google Drive：マイドライブ > patreon（G:\マイドライブ\patreon）
収益化TODO / 自動化設計図(blueprint) / Phase1〜4手順書 / Xテンプレ / READMEひな形
GitHub（note関連・このファイル）：https://github.com/ChRo05/note_Dev.git
GitHub（Patreon関連）：https://github.com/ChRo05/patreon_NeuroDiver_Dev.git

