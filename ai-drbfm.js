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
    const directInputSection = document.getElementById('directInputSection');
    const fileInputSection = document.getElementById('fileInputSection');
    const fileInputToggle = document.getElementById('fileInputToggle');
    const directInputToggle = document.getElementById('directInputToggle');

    let workbookData = []; // エクセルデータを保存する変数
    let aiConsiderationsForExport = []; // 追加：AI分析結果（考慮事項）を一時保存する変数
    let aiReferencesForExport = []; // 追加：AI分析結果（参考文献）を一時保存する変数

    // 入力方法切り替えイベント
    fileInputToggle.addEventListener('click', () => {
        fileInputToggle.classList.add('active');
        directInputToggle.classList.remove('active');
        fileInputSection.style.display = 'block';
        directInputSection.classList.remove('active');
    });

    directInputToggle.addEventListener('click', () => {
        directInputToggle.classList.add('active');
        fileInputToggle.classList.remove('active');
        fileInputSection.style.display = 'none';
        directInputSection.classList.add('active');
    });

    // 重要度設定の保存・復元
    function saveImportanceSettings() {
        const settings = {
            importanceThreshold: document.getElementById('importanceThreshold').value,
            maxDisplayCount: document.getElementById('maxDisplayCount').value
        };
        localStorage.setItem('aiDrbfmImportanceSettings', JSON.stringify(settings));
    }

    function loadImportanceSettings() {
        const savedSettings = localStorage.getItem('aiDrbfmImportanceSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            if (settings.importanceThreshold) {
                document.getElementById('importanceThreshold').value = settings.importanceThreshold;
            }
            if (settings.maxDisplayCount) {
                document.getElementById('maxDisplayCount').value = settings.maxDisplayCount;
            }
        }
    }

    // 設定変更時の保存
    document.getElementById('importanceThreshold').addEventListener('change', saveImportanceSettings);
    document.getElementById('maxDisplayCount').addEventListener('change', saveImportanceSettings);

    // 初期設定の読み込み
    loadImportanceSettings();

    // 直接入力フォームの入力値変更時のリアルタイム更新
    const directInputFields = ['partName', 'changeContent', 'changeReason', 'changeRank', 'partFunction', 'concerns', 'concernConditions'];
    directInputFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => {
                // 直接入力モードがアクティブな場合のみ更新
                if (directInputSection.classList.contains('active')) {
                    updateDirectInputTable();
                }
            });
        }
    });

    // 直接入力データをテーブルに更新する関数
    function updateDirectInputTable() {
        const partName = document.getElementById('partName').value;
        const changeContent = document.getElementById('changeContent').value;
        const changeReason = document.getElementById('changeReason').value;
        const changeRank = document.getElementById('changeRank').value;
        const partFunction = document.getElementById('partFunction').value;
        const concerns = document.getElementById('concerns').value;
        const concernConditions = document.getElementById('concernConditions').value;
        
        const data = [{
            partName: partName,
            changeContent: changeContent,
            changeReason: changeReason,
            changeRank: changeRank,
            partFunction: partFunction,
            concerns: concerns,
            concernConditions: concernConditions
        }];
        
        displayTable(data);
    }

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
        // どちらの入力モードか判定
        const isDirectInput = directInputSection.classList.contains('active');
        let data;
        if (isDirectInput) {
            // 直接入力フォームの値を使う
            const partName = document.getElementById('partName').value;
            const changeContent = document.getElementById('changeContent').value;
            const changeReason = document.getElementById('changeReason').value;
            const changeRank = document.getElementById('changeRank').value;
            const partFunction = document.getElementById('partFunction').value;
            const concerns = document.getElementById('concerns').value;
            const concernConditions = document.getElementById('concernConditions').value;
            
            data = [{
                partName: partName,
                changeContent: changeContent,
                changeReason: changeReason,
                changeRank: changeRank,
                partFunction: partFunction,
                concerns: concerns,
                concernConditions: concernConditions
            }];
            
            // 直接入力データをテーブルに表示
            displayTable(data);
        } else {
            if (workbookData.length === 0) {
                alert('先にエクセルファイルを読み込んでください。');
                return;
            }
            data = workbookData;
        }
        // 以降はdataを使ってAI分析
        try {
            runAiAnalysisBtn.disabled = true;
            runAiAnalysisBtn.textContent = '分析中...';
            const results = await performAiAnalysis(data);
            displayAnalysisResults(results);
            aiConsiderationsForExport = results.considerations || [];
            aiReferencesForExport = results.references || [];
            console.log('AI分析結果保存:', { considerations: aiConsiderationsForExport, references: aiReferencesForExport }); // デバッグログ追加
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
        // どちらの入力モードか判定
        const isDirectInput = directInputSection.classList.contains('active');
        let data;
        
        if (isDirectInput) {
            // 直接入力フォームの値を使う
            const partName = document.getElementById('partName').value;
            const changeContent = document.getElementById('changeContent').value;
            const changeReason = document.getElementById('changeReason').value;
            const changeRank = document.getElementById('changeRank').value;
            const partFunction = document.getElementById('partFunction').value;
            const concerns = document.getElementById('concerns').value;
            const concernConditions = document.getElementById('concernConditions').value;
            
            data = [{
                partName: partName,
                changeContent: changeContent,
                changeReason: changeReason,
                changeRank: changeRank,
                partFunction: partFunction,
                concerns: concerns,
                concernConditions: concernConditions
            }];
        } else {
            if (workbookData.length === 0) {
                alert('出力するデータがありません。');
                return;
            }
            data = workbookData;
        }
        
        exportToExcel(data, aiConsiderationsForExport, aiReferencesForExport);
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

    function exportToExcel(data, aiConsiderations, aiReferences) {
        // ヘッダー行を作成（K列まで拡張）
        const headers = ['部品名称', '変更内容', '変更理由', '変更ランク', '部品の機能', '部品の故障・心配な点', '心配点はどのような場合になぜ生じるのか', '', '', '他に考慮すべき点はないか', '技術的リスク背景・参考文献'];
        // データを配列形式に変換
        const exportData = [headers];
        data.forEach((row, i) => {
            const jValue = aiConsiderations && aiConsiderations[i] ? aiConsiderations[i] : '';
            const kValue = aiReferences && aiReferences[i] ? aiReferences[i] : '';
            exportData.push([
                row.partName || '',
                row.changeContent || '',
                row.changeReason || '',
                row.changeRank || '',
                row.partFunction || '',
                row.concerns || '',
                row.concernConditions || '',
                '', '', // H, I列は空欄
                jValue, // J列（AI考慮事項）
                kValue // K列（参考文献）
            ]);
        });
        // ワークブックを作成
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, 'DRBFMデータ');
        // ファイルをダウンロード
        XLSX.writeFile(wb, 'DRBFM_export_with_ai.xlsx');
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
        const prompt = `\nあなたはDRBFMの専門家です。以下の情報に基づいて、DRBFM分析を行ってください。\n\n【入力データ】\n${data.map((row, idx) => `No: ${idx+1}\n部品名称: ${safe(row.partName)}\n変更内容: ${safe(row.changeContent)}\n変更理由: ${safe(row.changeReason)}\n変更ランク: ${safe(row.changeRank)}\n部品の機能: ${safe(row.partFunction)}\n心配点: ${safe(row.concerns)}\n発生条件: ${safe(row.concernConditions)}`).join('\n\n')}\n\n【出力形式】\n以下のJSON形式で出力してください：\n{\n  "considerations": [{"text": "考慮すべき点1", "changeRank": 1}, ...],\n  "actions": [{"text": "推奨される行動1", "changeRank": 2}, ...],\n  "references": ["参考文献1", ...]\n}\n\n【注意事項】\n- 各項目は具体的で実用的な内容にしてください\n- それぞれの考慮点・行動は、どの入力データ（Noと変更ランク）に対応するか明示してください\n- 参考文献は技術的な根拠となる文献を挙げてください\n- 必ずJSON形式のみで出力してください（コメントや説明文は不要）`;
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
        console.log('AI応答テキスト:', text);
        
        // JSON部分のみ抽出（より堅牢な処理）
        let jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            // 複数のJSONブロックがある場合は最初のものを使用
            const jsonMatches = text.match(/\{[\s\S]*?\}/g);
            if (jsonMatches && jsonMatches.length > 0) {
                jsonMatch = jsonMatches[0];
            } else {
                throw new Error('AI応答にJSONが含まれていません');
            }
        }
        
        // JSON文字列をクリーンアップ
        let jsonString = jsonMatch[0];
        
        // コメントを除去
        jsonString = jsonString.replace(/\/\/.*$/gm, ''); // 行末コメント
        jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, ''); // ブロックコメント
        
        // 余分な空白と改行を整理
        jsonString = jsonString.replace(/\s+/g, ' ').trim();
        
        // 末尾のカンマを除去
        jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
        
        console.log('クリーンアップ後のJSON:', jsonString);
        
        try {
            const json = JSON.parse(jsonString);
            // 旧形式（配列のみ）の場合はラップ
            if (Array.isArray(json.considerations)) {
                json.considerations = json.considerations.map(c => typeof c === 'string' ? { text: c, changeRank: 1 } : c);
            }
            if (Array.isArray(json.actions)) {
                json.actions = json.actions.map(a => typeof a === 'string' ? { text: a, changeRank: 1 } : a);
            }
            return json;
        } catch (parseError) {
            console.error('JSONパースエラー:', parseError);
            console.error('パースしようとした文字列:', jsonString);
            
            // フォールバック: 手動でJSONを構築
            const fallbackJson = {
                considerations: [],
                actions: [],
                references: []
            };
            
            // テキストから考慮事項とアクションを抽出
            const considerationMatches = text.match(/考慮すべき点[：:]\s*(.+)/g);
            const actionMatches = text.match(/推奨される行動[：:]\s*(.+)/g);
            const referenceMatches = text.match(/参考文献[：:]\s*(.+)/g);
            
            if (considerationMatches) {
                fallbackJson.considerations = considerationMatches.map(m => m.replace(/考慮すべき点[：:]\s*/, ''));
            }
            if (actionMatches) {
                fallbackJson.actions = actionMatches.map(m => m.replace(/推奨される行動[：:]\s*/, ''));
            }
            if (referenceMatches) {
                fallbackJson.references = referenceMatches.map(m => m.replace(/参考文献[：:]\s*/, ''));
            }
            
            console.log('フォールバックJSON:', fallbackJson);
            return fallbackJson;
        }
    } catch (error) {
        console.error('AI分析エラー:', error);
        throw error;
    }
}

// 分析結果の表示
function displayAnalysisResults(results) {
    // 分析結果セクションを必ず表示
    document.getElementById('results').style.display = 'block';
    // タイトルを変更
    const resultTitle = document.getElementById('resultTitle');
    if (resultTitle) {
        resultTitle.textContent = '分析結果(AI提示結果は誤った情報を提示する可能性がありますので、評価実行計画への反映はDRBFMチームにて取捨選択してください)';
    }
    const considerationList = document.getElementById('considerationList');
    const actionsList = document.getElementById('actionsList');

    // 重要度判定と最大表示数の設定（ユーザー設定から取得）
    const maxDisplayCount = parseInt(document.getElementById('maxDisplayCount').value) || 10;
    const importanceThreshold = document.getElementById('importanceThreshold').value || 'medium';

    // 重複排除
    let uniqueConsiderations = Array.from(new Set((results.considerations || []).map(c => typeof c === 'string' ? { text: c, changeRank: 1 } : c)));
    let uniqueActions = Array.from(new Set((results.actions || []).map(a => typeof a === 'string' ? { text: a, changeRank: 1 } : a)));
    let uniqueReferences = Array.from(new Set(results.references || []));

    // 重要度判定（キーワード＋変更ランクベース）
    function calculateImportance(item) {
        // item: {text, changeRank}
        const text = typeof item === 'string' ? item : item.text;
        const changeRank = typeof item === 'object' && item.changeRank ? Number(item.changeRank) : 1;
        const highImportanceKeywords = ['重要', '危険', 'リスク', '故障', '安全', '人命', '重大', '緊急', '必須', '致命的', 'critical', 'danger', 'risk', 'failure', 'safety', 'life', 'serious', 'urgent', 'essential', 'fatal'];
        const mediumImportanceKeywords = ['注意', '検討', '確認', '評価', '影響', '変更', '改善', '対策', 'attention', 'consider', 'confirm', 'evaluate', 'impact', 'change', 'improve', 'measure'];
        const lowerText = text.toLowerCase();
        const highCount = highImportanceKeywords.filter(keyword => lowerText.includes(keyword)).length;
        const mediumCount = mediumImportanceKeywords.filter(keyword => lowerText.includes(keyword)).length;
        // 変更ランク重み付け
        if (changeRank === 3) return 'high';
        if (changeRank === 2) return highCount > 0 ? 'high' : 'medium';
        if (changeRank === 1) {
            if (highCount > 0) return 'medium';
            if (mediumCount > 0) return 'low';
            return 'low';
        }
        // 万一不明な場合
        if (highCount > 0) return 'high';
        if (mediumCount > 0) return 'medium';
        return 'low';
    }

    if (importanceThreshold === 'high') {
        uniqueConsiderations = uniqueConsiderations.filter(item => calculateImportance(item) === 'high');
        uniqueActions = uniqueActions.filter(item => calculateImportance(item) === 'high');
    } else if (importanceThreshold === 'medium') {
        uniqueConsiderations = uniqueConsiderations.filter(item => calculateImportance(item) !== 'low');
        uniqueActions = uniqueActions.filter(item => calculateImportance(item) !== 'low');
    }
    uniqueConsiderations = uniqueConsiderations.slice(0, maxDisplayCount);
    uniqueActions = uniqueActions.slice(0, maxDisplayCount);
    uniqueConsiderations.sort((a, b) => {
        const importanceA = calculateImportance(a);
        const importanceB = calculateImportance(b);
        const importanceOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return importanceOrder[importanceB] - importanceOrder[importanceA];
    });
    uniqueActions.sort((a, b) => {
        const importanceA = calculateImportance(a);
        const importanceB = calculateImportance(b);
        const importanceOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return importanceOrder[importanceB] - importanceOrder[importanceA];
    });

    // ボタン付きリスト生成（重要度に応じてスタイルを変更）
    if (uniqueConsiderations.length === 0 && uniqueActions.length === 0) {
        considerationList.innerHTML = '<li style="color:#888;">データがありません</li>';
        actionsList.innerHTML = '<li style="color:#888;">データがありません</li>';
        return;
    }
    considerationList.innerHTML = uniqueConsiderations.map(item => {
        const importance = calculateImportance(item);
        const importanceClass = importance === 'high' ? 'high-importance' : importance === 'medium' ? 'medium-importance' : 'low-importance';
        const importanceLabel = importance === 'high' ? '重要' : importance === 'medium' ? '中' : '低';
        const referencesStr = encodeURIComponent(JSON.stringify(uniqueReferences));
        return `<li class="${importanceClass}" style='display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;'>
            <span class="importance-badge" style="background: ${importance === 'high' ? '#ff4444' : importance === 'medium' ? '#ffaa00' : '#44aa44'}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 0.8em;">${importanceLabel}</span>
            ${item.text}
            <span style='font-size:0.8em;color:#888;margin-left:0.5em;'>[ランク${item.changeRank}]</span>
            <button class='detail-btn' data-type='考慮すべき点' data-text='${item.text}' data-references='${referencesStr}'>もっと詳しく</button>
        </li>`;
    }).join('');
    actionsList.innerHTML = uniqueActions.map(item => {
        const importance = calculateImportance(item);
        const importanceClass = importance === 'high' ? 'high-importance' : importance === 'medium' ? 'medium-importance' : 'low-importance';
        const importanceLabel = importance === 'high' ? '重要' : importance === 'medium' ? '中' : '低';
        const referencesStr = encodeURIComponent(JSON.stringify(uniqueReferences));
        return `<li class="${importanceClass}" style='display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;'>
            <span class="importance-badge" style="background: ${importance === 'high' ? '#ff4444' : importance === 'medium' ? '#ffaa00' : '#44aa44'}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 0.8em;">${importanceLabel}</span>
            ${item.text}
            <span style='font-size:0.8em;color:#888;margin-left:0.5em;'>[ランク${item.changeRank}]</span>
            <button class='detail-btn' data-type='推奨される行動' data-text='${item.text}' data-references='${referencesStr}'>もっと詳しく</button>
        </li>`;
    }).join('');
    setTimeout(() => {
        document.querySelectorAll('.detail-btn').forEach(btn => {
            btn.onclick = async function() {
                const type = this.getAttribute('data-type');
                const text = this.getAttribute('data-text');
                let references = [];
                try {
                    references = JSON.parse(decodeURIComponent(this.getAttribute('data-references') || '%5B%5D'));
                } catch (e) {
                    references = [];
                }
                btn.disabled = true;
                btn.textContent = '取得中...';
                try {
                    const details = await fetchDetailByAI(type, text);
                    showDetailModal(`${type}：${text}`, details, references);
                } catch (e) {
                    showDetailModal(`${type}：${text}`, ['AI詳細取得に失敗しました'], references);
                } finally {
                    btn.disabled = false;
                    btn.textContent = 'もっと詳しく';
                }
            };
        });
    }, 100);

    // 参考文献リストの表示
    const referenceSection = document.getElementById('referenceSection');
    if (referenceSection) {
        if (uniqueReferences.length === 0) {
            referenceSection.innerHTML = '<h4>技術的リスク背景・参考文献</h4><div style="color:#888;">AIが参考文献を提示しませんでした</div>';
        } else {
            referenceSection.innerHTML = '<h4>技術的リスク背景・参考文献</h4>' +
                '<ul class="reference-list">' +
                uniqueReferences.map((ref, idx) =>
                    `<li style='margin-bottom:0.5rem;'>
                        <button class='reference-btn' data-ref='${encodeURIComponent(ref)}' style='background:none;border:none;color:#007bff;cursor:pointer;text-align:left;padding:0;'>
                            <i class="fa fa-book" style="margin-right:0.5em;"></i>${ref}
                        </button>
                        <div class='reference-detail' id='reference-detail-${idx}' style='display:none;margin-top:0.5em;'></div>
                    </li>`
                ).join('') +
                '</ul>';
            // クリックイベント
            referenceSection.querySelectorAll('.reference-btn').forEach((btn, idx) => {
                btn.onclick = async function() {
                    const ref = decodeURIComponent(this.getAttribute('data-ref'));
                    const detailDiv = document.getElementById('reference-detail-' + idx);
                    if (detailDiv.style.display === 'block') {
                        detailDiv.style.display = 'none';
                        return;
                    }
                    detailDiv.style.display = 'block';
                    detailDiv.textContent = '解説取得中...';
                    try {
                        const details = await fetchReferenceDetailByAI(ref);
                        detailDiv.innerHTML = details.map(d => `<div style='margin-bottom:0.5em;'>${d}</div>`).join('');
                    } catch (e) {
                        detailDiv.textContent = '参考文献詳細取得に失敗しました';
                    }
                };
            });
        }
    }
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
    const prompt = `\nあなたは機械設計の専門家です。\n以下の内容について、設計原理・材料・加工・組立・耐久性・安全性・コスト・規格・リスク・トレードオフ等の観点から、より深い技術的・設計的考察を日本語で詳しく述べてください。\n\n【${type}】\n${text}\n\n【出力例】\n- 設計上のリスクや注意点\n- 追加で検討すべき設計配慮\n- 推奨される検証・評価方法\n- 他の設計案とのトレードオフ\n- 技術的根拠と物理的メカニズム\n- 実務での適用時の注意点\n\n【重要】\n各項目について、関連する技術文献や規格への言及を含めてください。\n例：「材料の疲労特性については、JIS G 4303（ステンレス鋼棒）の要求値を確認する必要があります。」\n`;
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
        // 箇条書きや改行で分割して配列化
        const details = text.split(/\n|・|\u2022|\-/).map(s => s.trim()).filter(s => s);
        return details.length ? details : [text];
    } catch (e) {
        console.error('fetchDetailByAIエラー:', e);
        return ['AI詳細取得に失敗しました'];
    }
}

// --- 参考文献詳細取得AI連携関数 ---
async function fetchReferenceDetailByAI(reference) {
    const prompt = `\nあなたは技術文献の専門家です。\n以下の参考文献について、DRBFM分析で指摘された技術的リスクの背景として、以下の観点から詳細情報を日本語で提供してください：\n\n【参考文献】\n${reference}\n\n【出力例】\n- この文献が指摘する技術的リスクの具体的な内容\n- リスクの発生メカニズムと物理的根拠\n- 実験データや統計的根拠（もしあれば）\n- このリスクがDRBFM分析のどの部分に関連するか\n- 文献から得られる具体的な技術的知見と対策の根拠\n- この文献を参考にすべき技術的理由\n- 関連する他の技術文献や規格との関連性\n- 実務への適用方法と注意点\n`;
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
        // 箇条書きや改行で分割して配列化
        const details = text.split(/\n|・|\u2022|\-/).map(s => s.trim()).filter(s => s);
        return details.length ? details : [text];
    } catch (e) {
        console.error('fetchReferenceDetailByAIエラー:', e);
        return ['参考文献詳細取得に失敗しました'];
    }
}

// --- 詳細モーダル表示関数 ---
function showDetailModal(title, details, references) {
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
    content.style.maxWidth = '900px';
    content.style.maxHeight = '80vh';
    content.style.overflowY = 'auto';
    content.style.boxSizing = 'border-box';
    content.style.width = '90vw'; // スマホ等でも横幅が確保されるように

    // 詳細情報と参考文献を組み合わせたHTMLを生成
    let modalContent = `<h2>${title}</h2>`;
    
    // 詳細情報セクション
    modalContent += `<h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 0.5rem;">詳細分析</h3>`;
    modalContent += `<ul style="margin-bottom: 1.5rem;">`;
    
    // 各詳細項目を表示
    const detailsArray = Array.isArray(details) ? details : [details];
    detailsArray.forEach((detail, index) => {
        modalContent += `<li style="margin-bottom: 1rem; padding: 1rem; background-color: #f8f9fa; border-radius: 5px; border-left: 4px solid #007bff;">`;
        modalContent += `<div style="margin-bottom: 0.5rem;">${detail}</div>`;
        modalContent += `</li>`;
    });
    modalContent += `</ul>`;
    
    // 参考文献セクション
    if (references && references.length > 0) {
        modalContent += `<h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 0.5rem;">技術的リスク背景・参考文献</h3>`;
        modalContent += `<ul style="margin-bottom: 1.5rem;">`;
        references.forEach((reference, index) => {
            const linkUrl = extractUrlFromReference(reference);
            const displayText = reference.replace(/https?:\/\/[^\s]+/g, '').trim();
            
            modalContent += `<li style="margin-bottom: 0.5rem; padding: 0.5rem; background-color: #f0f8ff; border-left: 3px solid #0066cc; border-radius: 3px;">`;
            modalContent += `<span style="font-weight: 600; color: #0066cc;">📚</span> `;
            
            if (linkUrl) {
                modalContent += `<a href="${linkUrl}" target="_blank" style="color: #0066cc; text-decoration: underline;">${displayText}</a>`;
                modalContent += `<span style="margin-left: 0.5rem; font-size: 0.8em; color: #666;">(外部リンク)</span>`;
            } else {
                modalContent += `<span>${reference}</span>`;
            }
            modalContent += `</li>`;
        });
        modalContent += `</ul>`;
    }

    content.innerHTML = modalContent + `<button id="closeDetailModal" style="margin-top:1rem;">閉じる</button>`;

    modal.appendChild(content);
    document.body.appendChild(modal);

    document.getElementById('closeDetailModal').onclick = () => {
        modal.remove();
    };
}

// 参考文献からURLを抽出する関数
function extractUrlFromReference(reference) {
    const urlMatch = reference.match(/https?:\/\/[^\s]+/g);
    return urlMatch ? urlMatch[0] : null;
}