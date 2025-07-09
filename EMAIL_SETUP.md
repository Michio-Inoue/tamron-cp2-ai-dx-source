# メール送信機能の設定手順

## EmailJSの設定

### 1. EmailJSアカウントの作成
1. [EmailJS公式サイト](https://www.emailjs.com/) にアクセス
2. 「Sign Up」でアカウントを作成
3. 無料プランで月200通まで送信可能

### 2. メールサービスの設定
1. EmailJSダッシュボードにログイン
2. 左側メニューの「Email Services」をクリック
3. 「Add New Service」ボタンをクリック
4. 以下のサービスから選択：
   - **Gmail**: Gmailアカウントを使用
   - **Outlook**: Outlookアカウントを使用
   - **Yahoo**: Yahooメールアカウントを使用
   - **Custom SMTP**: 独自のSMTPサーバーを使用

#### Yahooメール設定の詳細手順
1. **Yahooメールサービスを選択**
2. **サービス名を入力**（例：「Yahoo Mail Service」）
3. **認証情報を入力**：
   - **Email**: Yahooメールアドレス
   - **Password**: Yahooアカウントのパスワード
4. **2段階認証が有効な場合**：
   - Yahooアカウント設定で「アプリパスワード」を生成
   - 通常のパスワードの代わりにアプリパスワードを使用
5. **「Create Service」ボタンをクリック**

#### Yahooメール設定の注意点
- **アプリパスワードの使用**: 2段階認証が有効な場合は必須
- **セキュリティ設定**: Yahooアカウントのセキュリティ設定で「安全性の低いアプリ」を許可
- **送信制限**: 1日あたりの送信制限に注意（通常500通程度）

### 3. EmailJS Template の設定

1.  EmailJSダッシュボードで、「Email Templates」に移動します。
2.  「Create New Template」をクリックします。
3.  **Settings**タブを開き、以下の設定を行います。
    -   **Template Name**: テンプレートの名前（例: `license-notification`）
    -   **Template ID**: このIDを控えておきます。
    -   **To Email**: **`{{to_email}}`**  
        -   **最重要**: この項目に `{{to_email}}` という変数を設定することで、システムから渡されたメールアドレスに送信されます。これが設定されていないと、`The recipients address is corrupted` というエラーが発生します。
    -   **To Name**: **`{{to_name}}`** (任意)

4.  **Content**タブを開き、以下の設定を行います。
    -   **Subject**: `{{subject}}`
    -   **HTML Body (Code エディタに切り替え)**:
        -   **最重要**: エディタ内を完全に空にし、以下の1行だけを記述してください。他のHTMLタグ（`<html>`, `<body>`など）は一切不要です。
        ```html
        {{{message}}}
        ```
        -   波括弧が3つの `{{{message}}}` を使用することが、HTMLメールを正しく表示させるための鍵です。`{{message}}`（波括弧2つ）では、HTMLコードがそのまま表示されてしまいます。

### 4. `license-management.html` の設定

1.  `license-management.html` ファイルを開きます。
2.  ファイル下部にある以下のスクリプト部分を、ご自身のEmailJSアカウント情報に書き換えます。

    ```html
    <script>
        // EmailJSの初期化
        (function() {
            // EmailJSの設定（実際のサービスIDとテンプレートIDに変更してください）
            emailjs.init("YOUR_USER_ID"); // EmailJSのUser ID (Public Key)
            
            // サービスIDとテンプレートIDの設定
            window.EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // EmailJSのサービスID
            window.EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // EmailJSのテンプレートID
        })();
    </script>
    ```

    -   `YOUR_USER_ID`: EmailJSダッシュボードの「Account」 > 「API Keys」にある **Public Key** を設定します。
    -   `YOUR_SERVICE_ID`: 手順2で作成したメールサービスの **Service ID** を設定します。
    -   `YOUR_TEMPLATE_ID`: 手順3で作成したメールテンプレートの **Template ID** を設定します。

### 5. Yahooメールでの配信について

Yahooメールを送信元として設定する場合、セキュリティ設定によりメールが届かないことがあります。以下の点を確認してください。

-   **2段階認証とアプリパスワード**: Yahooアカウントで2段階認証が有効な場合、EmailJSのメールサービス設定では通常のパスワードの代わりに、**アプリパスワード**を生成して使用する必要があります。
-   **スパムフィルター**: 送信したメールがスパムフォルダーに振り分けられていないか確認してください。
-   **送信制限**: Yahooの無料メールアカウントには、短時間に送信できるメール数に制限があります。

これらの設定を行うことで、本システムからライセンスの割り当て結果が自動でメール通知されるようになります。

### 5. 設定の確認
1. ブラウザで`license-management.html`を開く
2. ダッシュボードの「メール設定確認」ボタンをクリック
3. すべての項目に✓が表示されることを確認

### 6. テスト送信
1. 「テストメール送信」ボタンをクリック
2. 実際にメールが送信されることを確認

## 詳細なID情報取得手順

### ステップ1: EmailJSアカウント作成
1. [EmailJS公式サイト](https://www.emailjs.com/) にアクセス
2. 右上の「Sign Up」ボタンをクリック
3. 以下の情報を入力：
   - **Email**: メールアドレス
   - **Password**: パスワード
   - **Confirm Password**: パスワード確認
4. 「Create Account」ボタンをクリック
5. メール認証を完了

### ステップ2: ユーザーIDの取得
1. EmailJSダッシュボードにログイン
2. 左側メニューの「Account」をクリック
3. 「API Keys」セクションで「Public Key」をコピー
   - 例: `user_a1b2c3d4e5f6g7h8i9j0`

### ステップ3: メールサービスの設定
1. 左側メニューの「Email Services」をクリック
2. 「Add New Service」ボタンをクリック
3. サービスを選択（例：Gmail）
4. サービス名を入力（例：「Gmail Service」）
5. 認証情報を入力：
   - **Gmailの場合**: Gmailアカウントとパスワード
   - **Outlookの場合**: Outlookアカウントとパスワード
6. 「Create Service」ボタンをクリック
7. 作成されたサービスのIDをコピー
   - 例: `service_abc123def456`

### ステップ4: メールテンプレートの作成
1. 左側メニューの「Email Templates」をクリック
2. 「Create New Template」ボタンをクリック
3. テンプレート名を入力（例：「License Allocation Result」）
4. 以下のHTMLコードをコピー＆ペースト：

```html
<!DOCTYPE html>
<html>
<head>
    <title>Cursor AI Assign System - ライセンス割り当て結果</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 30px;">
        <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Cursor AI Assign System</h2>
        
        <!-- 割り当て状況に応じたメッセージ -->
        <div style="background-color: {{status === '割り当て済み' ? '#d4edda' : '#f8d7da'}}; border: 1px solid {{status === '割り当て済み' ? '#c3e6cb' : '#f5c6cb'}}; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: {{status === '割り当て済み' ? '#155724' : '#721c24'}}; margin: 0;">
                {{status === '割り当て済み' ? 'おめでとうございます！' : '申し訳ございませんが、'}}
                {{to_name}}様のCursorライセンス使用申請が{{status === '割り当て済み' ? '承認されました。' : '今回の割り当て対象外となりました。'}}
            </h3>
            <p style="margin: 10px 0; color: {{status === '割り当て済み' ? '#155724' : '#721c24'}};">
                <strong>
                    {{status === '割り当て済み' ? 
                        'ご申請いただいた期間中、Cursorライセンスをご利用いただけます。システム管理者から詳細な利用方法について別途ご連絡いたします。' : 
                        '今回の割り当てでは、他の申請者との優先度比較の結果、割り当て対象外となりました。次回の申請期間に再度ご申請いただくことができます。'
                    }}
                </strong>
            </p>
        </div>
        
        <!-- 申請内容 -->
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h4 style="color: #495057; margin-top: 0;">申請内容</h4>
            <p style="margin: 10px 0;"><strong>申請者:</strong> {{to_name}}</p>
            <p style="margin: 10px 0;"><strong>使用理由:</strong> {{message}}</p>
        </div>
        
        <!-- AI判定結果 -->
        <div style="background-color: #e3f2fd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h4 style="color: #1976d2; margin-top: 0;">AI判定結果</h4>
            <p style="margin: 10px 0;"><strong>AIスコア:</strong> {{score}}/100</p>
            <p style="margin: 10px 0;"><strong>判定理由:</strong> {{reason}}</p>
        </div>
        
        <!-- 全体状況 -->
        <div style="background-color: #fff3cd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h4 style="color: #856404; margin-top: 0;">全体状況</h4>
            <p style="margin: 10px 0;"><strong>総申請数:</strong> {{total_requests}}件</p>
            <p style="margin: 10px 0;"><strong>割り当て済み:</strong> {{allocated_count}}件</p>
            <p style="margin: 10px 0;"><strong>未割り当て:</strong> {{rejected_count}}件</p>
        </div>
        
        <!-- 次のステップ/今後の対応 -->
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h4 style="color: #495057; margin-top: 0;">{{status === '割り当て済み' ? '次のステップ' : '今後の対応'}}</h4>
            {{#if status === '割り当て済み'}}
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>システム管理者から利用開始の詳細をご連絡いたします</li>
                    <li>ライセンスの有効期限は申請期間に基づいて設定されます</li>
                    <li>利用中にご不明な点がございましたら、システム管理者までお問い合わせください</li>
                </ul>
            {{else}}
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>次回の申請期間に再度ご申請いただくことができます</li>
                    <li>申請内容の改善により、次回の割り当て可能性が向上する場合があります</li>
                    <li>ご質問がございましたら、システム管理者までお問い合わせください</li>
                </ul>
            {{/if}}
        </div>
        
        <!-- フッター -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
                このメールはCursor AI Assign Systemにより自動送信されました。<br>
                ご質問がございましたら、システム管理者までお問い合わせください。
            </p>
        </div>
    </div>
</body>
</html>
```

5. 「Save Template」ボタンをクリック
6. 作成されたテンプレートのIDをコピー
   - 例: `template_xyz789uvw012`

### ステップ5: HTMLファイルの更新
`license-management.html`ファイルを開き、以下の部分を実際のIDに置き換え：

```javascript
// EmailJSの初期化
(function() {
    // EmailJSの設定（実際のサービスIDとテンプレートIDに変更してください）
    emailjs.init("user_a1b2c3d4e5f6g7h8i9j0"); // あなたのユーザーID
    
    // サービスIDとテンプレートIDの設定
    window.EMAILJS_SERVICE_ID = "service_abc123def456"; // あなたのサービスID
    window.EMAILJS_TEMPLATE_ID = "template_xyz789uvw012"; // あなたのテンプレートID
})();
```

### ステップ6: 設定の確認とテスト
1. ブラウザで`license-management.html`を開く
2. ダッシュボードの「メール設定確認」ボタンをクリック
3. すべての項目に✓が表示されることを確認
4. 「テストメール送信」ボタンをクリックしてテスト

## 代替手段（EmailJSが使用できない場合）

### メールクライアントを使用
EmailJSが設定されていない場合、システムは自動的にブラウザのメールクライアントを開きます：
- Outlook、Thunderbird、Apple Mailなどが設定されている場合
- メール内容が自動的に入力された状態でメールクライアントが開く
- 手動で送信ボタンを押す必要があります

### その他のメールサービス
- **SendGrid**: より大規模なメール送信に適している
- **Mailgun**: 開発者向けのメールサービス
- **AWS SES**: Amazon Web Servicesのメールサービス

## トラブルシューティング

### メールが送信されない場合
1. EmailJSの設定が正しいか確認
2. ブラウザのコンソールでエラーメッセージを確認
3. EmailJSの無料プランの制限（月200通）を確認
4. メールサービスの認証情報が正しいか確認

### メールが届かない場合
1. 受信者のメールアドレスが正しいか確認
2. スパムフォルダーを確認
3. メールサービスの送信制限を確認

### 設定が反映されない場合
1. ブラウザのキャッシュをクリア
2. ページを再読み込み
3. 設定値が正しく保存されているか確認

### よくあるエラーと解決方法

#### 「EmailJS is not defined」エラー
- EmailJSのライブラリが正しく読み込まれていない
- インターネット接続を確認
- ブラウザのキャッシュをクリア

#### 「Service not found」エラー
- サービスIDが正しくない
- EmailJSダッシュボードでサービスIDを再確認

#### 「Template not found」エラー
- テンプレートIDが正しくない
- EmailJSダッシュボードでテンプレートIDを再確認

#### 「Authentication failed」エラー
- メールサービスの認証情報が間違っている
- パスワードを再設定
- 2段階認証を無効にする（必要に応じて） 