console.log('ai-drbfm.js loaded');

const GEMINI_API_KEY = 'AIzaSyC39YRwttNDsVj6ZSWLhq8ljbiGyW9YcZo'; // ここをグローバルに

document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectedFileName = document.getElementById('selectedFileName');
    const drbfmTableBody = document.getElementById('drbfmTableBody');
    const considerationList = document.getElementById('considerationList');
    const actionsList = document.getElementById('actionsList');
    const runAiAnalysisBtn = document.getElementById('runAiAnalysis');
    const exportExcelBtn = document.getElementById('exportExcel');

    let workbookData = []; // エクセルデータを保存する変数

    // ファイル選択イベント
    fileInput.addEventListener('change', (e) => {
        console.log('fileInput changeイベント発火');
        const file = e.target.files[0];
        handleFile(file);
    });

    // ドラッグ&ドロップイベント
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        console.log('dropZone dropイベント発火');
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    // AI分析実行ボタン
    runAiAnalysisBtn.addEventListener('click', async () => {
        if (workbookData.length === 0) {
            alert('先にエクセルファイルを読み込んでください。');
            return;
        }
        
        try {
            runAiAnalysisBtn.disabled = true;
            runAiAnalysisBtn.textContent = '分析中...';
            
            const results = await performAiAnalysis(workbookData);
            displayAnalysisResults(results);
        } catch (error) {
            console.error('AI分析エラー:', error);
            alert('AI分析中にエラーが発生しました: ' + error.message);
        } finally {
            runAiAnalysisBtn.disabled = false;
            runAiAnalysisBtn.textContent = 'AI分析実行';
        }
    });

    // エクセル出力ボタン
    exportExcelBtn.addEventListener('click', () => {
        if (workbookData.length === 0) {
            alert('出力するデータがありません。');
            return;
        }
        exportToExcel(workbookData);
    });

    function handleFile(file) {
        console.log('handleFile呼び出し', file);
        if (!file) {
            console.log('ファイルが選択されていません');
            return;
        }

        // ファイル名を表示
        selectedFileName.style.display = 'block';
        selectedFileName.innerHTML = `<i class="fas fa-file-excel"></i><span>${file.name}</span>`;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                processWorkbook(workbook);
            } catch (error) {
                console.error('エクセルファイル読み込みエラー:', error);
                alert('エクセルファイルの読み込みに失敗しました: ' + error.message);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    function processWorkbook(workbook) {
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const merges = worksheet['!merges'] || [];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (jsonData.length < 9) {
            alert('エクセルファイルに十分なデータ行がありません。');
            return;
        }

        // 7,8行目を取得
        const headerRow1 = jsonData[6] || [];
        const headerRow2 = jsonData[7] || [];

        // G列8行目の値を取得
        const gHeader = headerRow2[6] || '';

        // 結合セルを考慮してヘッダー名を生成
        const headers = [];
        for (let col = 0; col < headerRow2.length; col++) {
            let h1 = headerRow1[col] || '';
            for (const merge of merges) {
                if (merge.s.r === 6 && col >= merge.s.c && col <= merge.e.c) {
                    h1 = headerRow1[merge.s.c];
                    break;
                }
            }
            let h2 = headerRow2[col] || '';
            for (const merge of merges) {
                if (merge.s.r === 7 && col >= merge.s.c && col <= merge.e.c) {
                    h2 = headerRow2[merge.s.c];
                    break;
                }
            }
            if (h1 && h2) {
                headers.push(h1 + h2);
            } else if (h1) {
                headers.push(h1);
            } else if (h2) {
                headers.push(h2);
            } else {
                headers.push('');
            }
        }
        console.log('実際のヘッダー:', headers);

        // 空行を除外
        const dataRows = jsonData.slice(8).filter(row => {
            return row.some(cell => cell !== undefined && cell !== null && String(cell).trim() !== '');
        });

        workbookData = dataRows.map(row => {
            const rowData = {};
            headers.forEach((header, colIndex) => {
                let value = row[colIndex];
                if (value === undefined || value === null || String(value).trim() === '') {
                    value = '';
                }
                const normalized = (header || '')
                    .replace(/[\s　\(\)\[\]【】「」]/g, '')
                    .replace(/\n/g, '')
                    .replace(/・/g, '')
                    .replace(/-/g, '')
                    .replace(/\\/g, '');

                if (normalized.includes('部品名称')) {
                    rowData.partName = value;
                } else if (normalized.includes('変更内容')) {
                    rowData.changeContent = value;
                } else if (normalized.includes('変更理由')) {
                    rowData.changeReason = value;
                } else if (normalized.includes('変更ランク')) {
                    rowData.changeRank = value;
                } else if (normalized.includes('部品の機能')) {
                    rowData.partFunction = value;
                } else if (header === gHeader || colIndex === 6) {
                    rowData.concerns = value;
                } else if (normalized.includes('心配点はどのような場合') || normalized.includes('なぜ生じる')) {
                    rowData.concernConditions = value;
                } else {
                    rowData[header] = value;
                }
            });
            return rowData;
        });

        displayTable(workbookData);
        console.log('処理されたデータ:', workbookData);
    }

    function displayTable(data) {
        // テーブルをクリア
        drbfmTableBody.innerHTML = '';
        
        // データ行を追加
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.partName || ''}</td>
                <td>${row.changeContent || ''}</td>
                <td>${row.changeReason || ''}</td>
                <td>${row.changeRank || ''}</td>
                <td>${row.partFunction || ''}</td>
                <td>${row.concerns || ''}</td>
                <td>${row.concernConditions || ''}</td>
            `;
            drbfmTableBody.appendChild(tr);
        });
    }

    function exportToExcel(data) {
        // ヘッダー行を作成
        const headers = ['部品名称', '変更内容', '変更理由', '変更ランク', '部品の機能', '部品の故障・心配な点', '心配点はどのような場合になぜ生じるのか'];
        
        // データを配列形式に変換
        const exportData = [headers];
        data.forEach(row => {
            exportData.push([
                row.partName || '',
                row.changeContent || '',
                row.changeReason || '',
                row.changeRank || '',
                row.partFunction || '',
                row.concerns || '',
                row.concernConditions || ''
            ]);
        });

        // ワークブックを作成
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, 'DRBFMデータ');

        // ファイルをダウンロード
        XLSX.writeFile(wb, 'DRBFM_export.xlsx');
    }
});

// AI分析の実行
async function performAiAnalysis(data) {
    const safe = v => (typeof v === 'string' ? v.trim() : (v != null ? String(v).trim() : '未入力'));
    try {
        console.log('AI分析を開始します');
        if (!Array.isArray(data)) {
            throw new Error('データが配列形式ではありません');
        }

        // プロンプト生成
        const prompt = `[INST]
あなたは機械設計の専門家です。以下のDRBFMデータを分析し、設計変更における技術的な考慮点と推奨される評価・検証項目を提案してください。

【分析対象データ】
${data.map((row, index) => `
【行 ${index + 1}】
部品名称: ${safe(row.partName)}
変更内容: ${safe(row.changeContent)}
変更理由: ${safe(row.changeReason)}
変更ランク: ${safe(row.changeRank)}
部品の機能: ${safe(row.partFunction)}
部品の故障・心配な点: ${safe(row.concerns)}
心配点の発生条件: ${safe(row.concernConditions)}
`).join('\n')}

【回答形式】
以下の2つのセクションで回答してください。各セクションは箇条書きで示してください。
1. 考慮すべき点：
- 技術的な観点から具体的に
2. 推奨される評価・検証項目：
- 【必須】各推奨項目の先頭に[優先度: 高]、[優先度: 中]、[優先度: 低]のいずれかを付けてください。`;

        // Gemini API用リクエスト
        const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        const requestBody = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048
            }
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Gemini APIレスポンスエラー:', errorData);
            throw new Error('Gemini APIレスポンスエラー');
        }

        const apiResponseJson = await response.json();
        console.log('Gemini API結果:', apiResponseJson);

        // Geminiのレスポンスからテキスト抽出
        let generatedText = '';
        if (apiResponseJson.candidates && apiResponseJson.candidates.length > 0 &&
            apiResponseJson.candidates[0].content && apiResponseJson.candidates[0].content.parts &&
            apiResponseJson.candidates[0].content.parts.length > 0) {
            generatedText = apiResponseJson.candidates[0].content.parts[0].text;
        } else if (apiResponseJson.generated_text) {
            generatedText = apiResponseJson.generated_text;
        } else {
            throw new Error('AIからの応答にテキストデータが見つかりません。');
        }

        // 解析ロジック（現状のまま）
        const parsedConsiderations = [];
        const parsedActions = [];
        const lines = generatedText.split('\n');
        let currentSection = '';

        lines.forEach(line => {
            line = line.trim();
            if (line === '') return;
            if (line.includes('考慮すべき点：') && (line.startsWith('1.') || line.startsWith('##'))) {
                currentSection = 'considerations';
                return;
            }
            if (line.includes('推奨される評価・検証項目：') && (line.startsWith('2.') || line.startsWith('##'))) {
                currentSection = 'actions';
                return;
            }
            if ((line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) && currentSection !== '') {
                let item = line;
                if (line.startsWith('- ') || line.startsWith('* ')) {
                    item = line.substring(2).trim();
                } else if (/^\d+\.\s/.test(line)) {
                    item = line.substring(line.indexOf('.') + 1).trim();
                }
                if (item) {
                    if (currentSection === 'considerations') {
                        parsedConsiderations.push(item);
                    } else if (currentSection === 'actions') {
                        parsedActions.push(item);
                    }
                }
            }
        });

        return {
            considerations: parsedConsiderations,
            actions: parsedActions
        };

    } catch (error) {
        console.error('AI分析中にエラーが発生しました:', error);
        throw error;
    }
}

// 分析結果の表示
function displayAnalysisResults(results) {
    console.log('displayAnalysisResults - 受信した結果:', results);

    const considerationList = document.getElementById('considerationList');
    const actionsList = document.getElementById('actionsList');

    // 古いリストをクリア
    considerationList.innerHTML = '';
    actionsList.innerHTML = '';

    // 考慮すべき点を表示
    if (results.considerations && Array.isArray(results.considerations)) {
        results.considerations.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            considerationList.appendChild(li);
        });
    } else {
        console.warn('考慮すべき点のデータが配列ではありませんでした。');
        const li = document.createElement('li');
        li.textContent = '考慮すべき点が見つかりませんでした。';
        considerationList.appendChild(li);
    }

    // 推奨される評価・検証項目を表示
    if (results.actions && Array.isArray(results.actions)) {
        results.actions.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            actionsList.appendChild(li);
        });
    } else {
        console.warn('評価・検証項目のデータが配列ではありませんでした。');
        const li = document.createElement('li');
        li.textContent = '評価・検証項目が見つかりませんでした。';
        actionsList.appendChild(li);
    }
}