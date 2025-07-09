// GEMINI APIの設定
const GEMINI_API_KEY = '[REDACTED]';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// APIキーの検証
if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY' || GEMINI_API_KEY === 'YOUR_NEW_API_KEY') {
    console.error('GEMINI APIキーが設定されていません。ai-drbfm.jsのGEMINI_API_KEYを実際のAPIキーに置き換えてください。');
}

// DOMの読み込みが完了したら実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log('アプリケーションを初期化します');
    const form = document.getElementById('drbfm-form');
    const analysisResults = document.querySelector('.analysis-results');
    const fileDropZone = document.getElementById('file-drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');

    if (!form) {
        console.error('フォームが見つかりません');
        return;
    }

    if (!analysisResults) {
        console.error('分析結果表示エリアが見つかりません');
        return;
    }

    // ドラッグ&ドロップイベントの設定
    if (fileDropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileDropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            fileDropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileDropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            fileDropZone.classList.add('dragover');
        }

        function unhighlight(e) {
            fileDropZone.classList.remove('dragover');
        }

        fileDropZone.addEventListener('drop', handleDrop, false);
    }

    // ファイル選択イベントの設定
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect, false);
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('フォームが送信されました');
        
        // フォームデータの収集
        const formData = {
            changeDescription: document.getElementById('change-description').value,
            changeReason: document.getElementById('change-reason').value,
            affectedParts: document.getElementById('affected-parts').value.split(',').map(part => part.trim()),
            uploadedFiles: getUploadedFiles()
        };
        console.log('収集したフォームデータ:', formData);

        // 分析結果表示エリアを表示
        analysisResults.style.display = 'block';

        // ローディング表示
        showLoading();

        try {
            // Gemini APIを使用して分析を実行
            const analysisResult = await analyzeWithGemini(formData);
            console.log('分析結果:', analysisResult);

            // 結果の表示
            displayResults(analysisResult, formData);
        } catch (error) {
            console.error('分析中にエラーが発生しました:', error);
            showError(error.message);
        } finally {
            hideLoading();
        }
    });
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const fileList = document.getElementById('file-list');
    if (!fileList) return;

    [...files].forEach(file => {
        if (isValidFileType(file)) {
            if (file.type === 'application/vnd.ms-excel' || 
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                readExcelFile(file);
            } else {
                addFileToList(file);
            }
        } else {
            alert('無効なファイル形式です。Excel、PowerPoint、PDFファイルのみアップロード可能です。');
        }
    });
}

function isValidFileType(file) {
    const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/pdf'
    ];
    return validTypes.includes(file.type);
}

function addFileToList(file) {
    const fileList = document.getElementById('file-list');
    if (!fileList) return;

    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <span class="file-name">${file.name}</span>
        <span class="remove-file" data-file-name="${file.name}">×</span>
    `;

    fileList.appendChild(fileItem);

    // ファイル削除イベントの設定
    const removeButton = fileItem.querySelector('.remove-file');
    removeButton.addEventListener('click', () => {
        fileItem.remove();
    });
}

function getUploadedFiles() {
    const fileList = document.getElementById('file-list');
    if (!fileList) return [];

    return Array.from(fileList.querySelectorAll('.file-item')).map(item => {
        return item.querySelector('.file-name').textContent;
    });
}

async function analyzeWithGemini(formData) {
    try {
        // プロンプトの構築
        const prompt = constructPrompt(formData);
        
        // APIリクエストの準備
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        // APIリクエストの実行
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('APIエラーレスポンス:', errorData);
            throw new Error(`APIリクエストが失敗しました: ${response.status}`);
        }

        const data = await response.json();
        return parseGeminiResponse(data);
    } catch (error) {
        console.error('Gemini API分析中にエラーが発生しました:', error);
        throw error;
    }
}

function constructPrompt(formData) {
    return `
以下の設計変更情報に基づいて、DRBFM分析を行ってください。

設計変更内容: ${formData.changeDescription}
変更理由: ${formData.changeReason}
変更する部品または工程: ${formData.affectedParts.join(', ')}

以下の形式で分析結果を出力してください：

1. リスク評価
- 重要度（高/中/低）とその理由
- 発生確率（高/中/低）とその理由
- 検出性（高/中/低）とその理由

2. 推奨対策
- 具体的な対策案（3つ程度）
- 各対策の期待される効果
- 実施の優先順位

3. 類似事例
- 過去の類似事例（2つ程度）
- 各事例からの教訓
- 今回の設計変更への適用ポイント

出力はJSON形式で、以下の構造にしてください：
{
    "riskAssessment": {
        "severity": {"level": "高/中/低", "reason": "理由"},
        "probability": {"level": "高/中/低", "reason": "理由"},
        "detectability": {"level": "高/中/低", "reason": "理由"}
    },
    "recommendations": [
        {
            "measure": "対策内容",
            "effect": "期待される効果",
            "priority": "優先順位"
        }
    ],
    "similarCases": [
        {
            "case": "事例の概要",
            "lesson": "教訓",
            "application": "適用ポイント"
        }
    ]
}
`;
}

function parseGeminiResponse(data) {
    try {
        // Gemini APIからの応答からテキストを抽出
        const responseText = data.candidates[0].content.parts[0].text;
        
        // JSON文字列を抽出（```json と ``` の間のテキスト）
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (!jsonMatch) {
            throw new Error('API応答からJSONを抽出できませんでした');
        }

        // JSONをパース
        const result = JSON.parse(jsonMatch[1]);
        return result;
    } catch (error) {
        console.error('API応答の解析中にエラーが発生しました:', error);
        throw new Error('API応答の解析に失敗しました');
    }
}

function showLoading() {
    console.log('ローディング表示を開始');
    const resultsContainer = document.querySelector('.results-container');
    if (!resultsContainer) {
        console.error('結果表示コンテナが見つかりません');
        return;
    }
    
    // ローディング表示用の要素を作成
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.textContent = '分析中...';
    
    // 既存の要素を非表示にし、ローディング表示を追加
    resultsContainer.style.opacity = '0.5';
    resultsContainer.appendChild(loadingDiv);
}

function hideLoading() {
    console.log('ローディング表示を終了');
    const loading = document.querySelector('.loading');
    const resultsContainer = document.querySelector('.results-container');
    
    if (loading) {
        loading.remove();
    }
    if (resultsContainer) {
        resultsContainer.style.opacity = '1';
    }
}

function showError(message) {
    console.log('エラーメッセージを表示:', message);
    const resultsContainer = document.querySelector('.results-container');
    if (!resultsContainer) {
        console.error('結果表示コンテナが見つかりません');
        return;
    }
    
    // エラーメッセージ用の要素を作成
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.innerHTML = `
        <h4>エラーが発生しました</h4>
        <p>${message}</p>
        <p>ブラウザのコンソール（F12キー）で詳細を確認できます。</p>
    `;
    
    // 既存の要素を非表示にし、エラーメッセージを追加
    resultsContainer.style.opacity = '0.5';
    resultsContainer.appendChild(errorDiv);
}

function displayResults(analysisResult, formData) {
    // リスク評価の表示
    const riskMatrix = document.querySelector('.risk-matrix');
    if (riskMatrix) {
        riskMatrix.innerHTML = `
            <div class="risk-details">
                <div class="risk-item">
                    <h5>重要度</h5>
                    <p class="risk-level ${analysisResult.riskAssessment.severity.level.toLowerCase()}">${analysisResult.riskAssessment.severity.level}</p>
                    <p class="risk-reason">${analysisResult.riskAssessment.severity.reason}</p>
                </div>
                <div class="risk-item">
                    <h5>発生確率</h5>
                    <p class="risk-level ${analysisResult.riskAssessment.probability.level.toLowerCase()}">${analysisResult.riskAssessment.probability.level}</p>
                    <p class="risk-reason">${analysisResult.riskAssessment.probability.reason}</p>
    </div>
                <div class="risk-item">
                    <h5>検出性</h5>
                    <p class="risk-level ${analysisResult.riskAssessment.detectability.level.toLowerCase()}">${analysisResult.riskAssessment.detectability.level}</p>
                    <p class="risk-reason">${analysisResult.riskAssessment.detectability.reason}</p>
    </div>
</div>
        `;
    }

    // 推奨対策の表示
    const recommendationsList = document.querySelector('.recommendations-list');
    if (recommendationsList) {
        recommendationsList.innerHTML = analysisResult.recommendations.map(rec => `
            <li class="recommendation-item">
                <div class="recommendation-header">
                    <span class="priority">優先度: ${rec.priority}</span>
                </div>
                <div class="recommendation-content">
                    <h5>対策内容</h5>
                    <p>${rec.measure}</p>
                    <h5>期待される効果</h5>
                    <p>${rec.effect}</p>
                </div>
            </li>
        `).join('');
    }

    // 類似事例の表示
    const similarCasesList = document.querySelector('.similar-cases-list');
    if (similarCasesList) {
        similarCasesList.innerHTML = analysisResult.similarCases.map(case_ => `
            <li class="similar-case-item">
                <div class="case-content">
                    <h5>事例概要</h5>
                    <p>${case_.case}</p>
                    <h5>教訓</h5>
                    <p>${case_.lesson}</p>
                    <h5>適用ポイント</h5>
                    <p>${case_.application}</p>
                </div>
            </li>
        `).join('');
    }
}

async function readExcelFile(file) {
    try {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // 最初のシートを取得
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            
            // シートのデータを取得
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
                header: 'A',
                range: 0  // ヘッダー行を含めて読み込む
            });
            
            // 「部品名称」の行を探す
            let startRowIndex = 0;
            for (let i = 0; i < jsonData.length; i++) {
                if (jsonData[i]['B'] === '部品名称') {
                    startRowIndex = i + 1; // 「部品名称」の次の行から開始
                    break;
                }
            }
            
            // 必要な列のデータを抽出（B列、C列、D列のデータを取得）
            const drbfmData = jsonData.slice(startRowIndex).map(row => ({
                partName: row['B'] || '',      // 部品名称
                changeContent: row['C'] || '', // 変更内容
                changeReason: row['D'] || ''   // 変更理由
            })).filter(row => row.partName && row.changeContent && row.changeReason); // 空の行を除外

            // 最初の行のデータをフォームに設定
            if (drbfmData.length > 0) {
                const firstRow = drbfmData[0];
                document.getElementById('affected-parts').value = firstRow.partName;
                document.getElementById('change-description').value = firstRow.changeContent;
                document.getElementById('change-reason').value = firstRow.changeReason;
            }

            // ファイルをリストに追加
            addFileToList(file);
        };
        reader.readAsArrayBuffer(file);
    } catch (error) {
        console.error('Excelファイルの読み込み中にエラーが発生しました:', error);
        alert('Excelファイルの読み込みに失敗しました。');
    }
} 