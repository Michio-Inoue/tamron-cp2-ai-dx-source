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
        
        // デバッグ情報：各ヘッダーの正規化結果を表示
        headers.forEach((header, index) => {
            const normalized = (header || '')
                .replace(/[\s　\(\)\[\]【】「」]/g, '')
                .replace(/\n/g, '')
                .replace(/・/g, '')
                .replace(/-/g, '')
                .replace(/\\/g, '');
            console.log(`ヘッダー[${index}]: "${header}" -> 正規化: "${normalized}"`);
        });

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
                    // より堅牢な部品/工程名称の検出
                    const partNamePatterns = [
                        /部品.*名称|部品.*名|部品.*番号|部品.*ID/,
                        /工程.*名称|工程.*名|工程.*番号|工程.*ID/,
                        /管理.*番号|管理.*№|管理.*No/,
                        /part.*name|process.*name|component.*name/i,
                        /部品|工程|part|process|component/i,
                        /名称|name|番号|number|no/i
                    ];
                    
                    // より堅牢な心配点・故障点の検出
                    const concernPatterns = [
                        /心配.*点|故障.*点|心配.*事|故障.*事|心配.*問題|故障.*問題/,
                        /concern|failure|risk|issue|problem/i,
                        /部品.*故障|部品.*心配|部品.*問題/
                    ];
                    
                    const conditionPatterns = [
                        /心配点.*場合|心配点.*なぜ|心配点.*生じる/,
                        /故障.*場合|故障.*なぜ|故障.*生じる/,
                        /発生.*条件|発生.*原因|発生.*要因/,
                        /condition|cause|factor|trigger/i
                    ];
                    
                    const isPartName = partNamePatterns.some(pattern => pattern.test(normalized));
                    const isConcern = concernPatterns.some(pattern => pattern.test(normalized));
                    const isCondition = conditionPatterns.some(pattern => pattern.test(normalized));
                    
                    if (isPartName && !rowData.partName) {
                        rowData.partName = value;
                        console.log(`部品/工程名称として検出: "${header}" -> partName`);
                    } else if (isConcern && !rowData.concerns) {
                        rowData.concerns = value;
                        console.log(`心配点・故障点として検出: "${header}" -> concerns`);
                    } else if (isCondition && !rowData.concernConditions) {
                        rowData.concernConditions = value;
                        console.log(`発生条件として検出: "${header}" -> concernConditions`);
                    } else {
                        rowData[header] = value;
                    }
                }
            });
            return rowData;
        });

        displayTable(workbookData);
        console.log('処理されたデータ:', workbookData);
        
        // デバッグ情報：各データ行の部品名称を確認
        workbookData.forEach((row, index) => {
            console.log(`データ行[${index}]: partName = "${row.partName}"`);
        });
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
        if (!Array.isArray(data)) {
            throw new Error('データが配列形式ではありません');
        }
        // プロンプト生成
        const prompt = `\nあなたはDRBFMの専門家です。以下の情報に基づいてDRBFM分析を行い、結果をJSON形式で提供してください。\nJSONは「considerations」と「actions」という2つのキーを持ち、それぞれの値は文字列の配列とします。\n\n【下記要件について考慮し、出力してください】\n*変更の弊害有無\n*変更の影響範囲\n*変更の妥当性検証\n*製造性、組立性、保守性への影響\n*製造設備、組立設備、検査設備への影響\n*コストとスケジュールへの影響\n*規格・基準への適合性\n*変更管理プロセス\n*トレードオフの検討\n*変更理由に対する背反（トレードオフ、リスク、逆効果、副作用など）も必ず検討し、強調してください。\n\n【特に重要：心配点・故障点の分析】\n*エクセルシートから読み込んだ\"部品の故障・心配な点\"と\"心配点はどのような場合になぜ生じるのか\"を重点的に分析してください\n*これらの情報を基に、具体的なリスク評価と対策を提案してください\n*心配点の発生条件を考慮した予防的対策を検討してください\n\n【分析対象データ】\n${data.map((row, index) => `\n【行 ${index + 1}】\n部品名称: ${safe(row.partName)}\n変更内容: ${safe(row.changeContent)}\n変更理由: ${safe(row.changeReason)}\n変更ランク: ${safe(row.changeRank)}\n部品の機能: ${safe(row.partFunction)}\n部品の故障・心配な点: ${safe(row.concerns)}\n心配点の発生条件: ${safe(row.concernConditions)}\n`).join('')}\n\n【出力例】\n{\n  "considerations": ["考慮すべき点1", "考慮すべき点2"],\n  "actions": ["評価・検証項目1", "評価・検証項目2"]\n}\n\n【出力条件】\n- considerations, actionsは重複を排除してください。\n- 心配点・故障点に関する具体的な対策を含めてください。\n- JSON形式のみを出力してください。`;
        // Gemini API呼び出し
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + GEMINI_API_KEY,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048
                    }
                })
            }
        );
        if (!response.ok) {
            throw new Error('API呼び出しに失敗しました: ' + response.statusText);
        }
        const result = await response.json();
        const text = result.candidates[0].content.parts[0].text;
        // JSON部分のみ抽出
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('AI応答にJSONが含まれていません');
        const json = JSON.parse(jsonMatch[0]);
        console.log('AI応答テキスト:', text);
        console.log('抽出したJSON:', jsonMatch ? jsonMatch[0] : 'なし');
        console.log('パースしたJSON:', json);
        return json;
    } catch (error) {
        console.error('AI分析エラー:', error);
        throw error;
    }
}

// 分析結果の表示
function displayAnalysisResults(results) {
    // 分析結果セクションを必ず表示
    document.getElementById('results').style.display = 'block';
    const considerationList = document.getElementById('considerationList');
    const actionsList = document.getElementById('actionsList');
    // 重複排除
    const uniqueConsiderations = Array.from(new Set(results.considerations || []));
    const uniqueActions = Array.from(new Set(results.actions || []));
    // ボタン付きリスト生成
    considerationList.innerHTML = uniqueConsiderations.map(point =>
        `<li style='display:flex;align-items:center;gap:0.5rem;'>${point} <button class='detail-btn' data-type='考慮すべき点' data-text='${point}'>もっと詳しく</button></li>`
    ).join('');
    actionsList.innerHTML = uniqueActions.map(action =>
        `<li style='display:flex;align-items:center;gap:0.5rem;'>${action} <button class='detail-btn' data-type='推奨される行動' data-text='${action}'>もっと詳しく</button></li>`
    ).join('');
    // テーブル描画
    let data;
    if (typeof workbookData !== 'undefined' && workbookData && workbookData.length > 0) {
        data = workbookData;
    } else {
        data = [{
            partName: document.getElementById('partName').value,
            changeContent: document.getElementById('changeContent').value,
            changeReason: document.getElementById('changeReason').value,
            changeRank: document.getElementById('changeRank').value,
            partFunction: document.getElementById('partFunction').value,
            concerns: document.getElementById('concerns').value,
            concernConditions: document.getElementById('concernConditions').value
        }];
    }
    renderDrbfmTable(results.considerations || [], results.actions || []);
    // 詳細ボタンイベント
    setTimeout(() => {
        document.querySelectorAll('.detail-btn').forEach(btn => {
            btn.onclick = async function() {
                const type = this.getAttribute('data-type');
                const text = this.getAttribute('data-text');
                btn.disabled = true;
                btn.textContent = '取得中...';
                try {
                    const details = await fetchDetailByAI(type, text);
                    showDetailModal(`${type}：${text}`, details);
                } catch (e) {
                    showDetailModal(`${type}：${text}`, ['AI詳細取得に失敗しました']);
                } finally {
                    btn.disabled = false;
                    btn.textContent = 'もっと詳しく';
                }
            };
        });
    }, 100);
}

// --- グローバルスコープに追加 ---
function renderDrbfmTable(considerations, actions) {
    const outputArea = document.getElementById('drbfmOutput');
    if (!outputArea) {
        alert('drbfmOutputがHTML上に存在しません。HTMLに<div id="drbfmOutput"></div>を追加してください。');
        console.error('drbfmOutputが見つかりません');
        return;
    }
    let tableHtml = `
        <table class="drbfm-table">
            <thead>
                <tr>
                    <th>考慮事項 (Considerations)</th>
                    <th>アクション (Actions)</th>
                </tr>
            </thead>
            <tbody>
    `;
    const maxLength = Math.max(considerations.length, actions.length);
    for (let i = 0; i < maxLength; i++) {
        const consideration = considerations[i] ? considerations[i] : '';
        const action = actions[i] ? actions[i] : '';
        tableHtml += `
            <tr>
                <td>${consideration}</td>
                <td>${action}</td>
            </tr>
        `;
    }
    tableHtml += '</tbody></table>';
    outputArea.innerHTML = tableHtml;
    console.log('テーブルHTML:', tableHtml);
}

// --- 詳細取得AI連携関数 ---
async function fetchDetailByAI(type, text) {
    const prompt = `\nあなたは機械設計の専門家です。\n以下の内容について、設計原理・材料・加工・組立・耐久性・安全性・コスト・規格・リスク・トレードオフ等の観点から、より深い技術的・設計的考察を日本語で詳しく述べてください。\n\n【${type}】\n${text}\n\n【出力例】\n- 設計上のリスクや注意点\n- 追加で検討すべき設計配慮\n- 推奨される検証・評価方法\n- 他の設計案とのトレードオフ\n`;
    try {
        const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + GEMINI_API_KEY,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024
                    }
                })
            }
        );
        if (!response.ok) {
            throw new Error('API呼び出しに失敗しました: ' + response.statusText);
        }
        const result = await response.json();
        const text = result.candidates[0].content.parts[0].text;
        // 箇条書きや改行で分割して配列化
        const details = text.split(/\n|・|\u2022|\-/).map(s => s.trim()).filter(s => s);
        return details.length ? details : [text];
    } catch (e) {
        console.error('fetchDetailByAIエラー:', e);
        return ['AI詳細取得に失敗しました'];
    }
}

// --- 詳細モーダル表示関数 ---
function showDetailModal(title, details) {
    const oldModal = document.getElementById('detailModal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'detailModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';

    const content = document.createElement('div');
    content.style.background = '#fff';
    content.style.padding = '2rem';
    content.style.borderRadius = '8px';
    content.style.maxWidth = '600px';
    content.style.maxHeight = '80vh';
    content.style.overflowY = 'auto';
    content.style.boxSizing = 'border-box';
    content.style.width = '90vw'; // スマホ等でも横幅が確保されるように

    content.innerHTML = `<h2>${title}</h2><ul>${(Array.isArray(details) ? details : [details]).map(d => `<li>${d}</li>`).join('')}</ul>
        <button id="closeDetailModal" style="margin-top:1rem;">閉じる</button>`;

    modal.appendChild(content);
    document.body.appendChild(modal);

    document.getElementById('closeDetailModal').onclick = () => {
        modal.remove();
    };
}