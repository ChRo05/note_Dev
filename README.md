# note-autopost

note に新記事を公開すると、X と Threads へ自動で告知するボット。

## 仕組み
note の RSS を GitHub Actions（15分ごと）でポーリングし、
未告知の新着を X / Threads に投稿。処理済みURLは state/posted.json で管理。

## セットアップ（すべてご自身で）
1. このリポジトリに必要なファイルを配置（配置済み）
2. 2. X 開発者ポータルでアプリ作成 → API Key/Secret・Access Token/Secret を取得
   3.    （投稿するので Read and Write 権限にすること）
   4.3. Meta 開発者登録 → Threads API を有効化 → Threads User ID と長期アクセストークンを取得
     4. GitHub の Settings → Secrets and variables → Actions に以下を登録:
     5.    X_API_KEY / X_API_SECRET / X_ACCESS_TOKEN / X_ACCESS_SECRET
     6.   THREADS_USER_ID / THREADS_TOKEN
     7.   5. 初回だけ Actions タブから "note-autopost" を手動実行し、init にチェック
          6.    （既存記事を処理済み化＝過去記事の一斉投稿を防止）
          7.6. 以降は自動運用（cron）

            ## 注意
          - APIキー/トークンはコードに直書きせず必ず Secrets へ
          - - 各 API の利用規約・自動投稿ポリシー・レート制限を遵守
            - - Threads の長期トークンは有効期限があるため定期的な更新が必要
              - - このリポジトリはAPI連携を扱うため、Privateリポジトリでの運用を推奨します
                - 
