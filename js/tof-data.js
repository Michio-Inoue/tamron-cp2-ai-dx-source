// データファイルの処理
function handleDataFile(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    const supportedFormats = ['xlsx', 'xls'];

    if (!supportedFormats.includes(extension)) {
        alert(`サポートされていないファイル形式です: ${extension}\n\nサポートされている形式:\n- .xlsx\n- .xls`);
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { 
            type: 'array',
            cellDates: true,
            cellNF: true,
            cellText: false,
            raw: true
        });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // 生データを取得（数値として読み込む）
        const rawData = XLSX.utils.sheet_to_json(firstSheet, { 
            header: 1,
            raw: true,
            defval: null
        });

        console.log('Original Raw Data:', JSON.stringify(rawData, null, 2)); // デバッグ出力
        
        // データをクリーンアップ（記号を除去して数値のみを抽出）
        currentData = rawData.map(row => {
            return row.map(cell => {
                if (cell === null || cell === undefined) {
                    return null;
                }
                
                // 文字列の場合
                if (typeof cell === 'string') {
                    // 全角数字を半角に変換し、記号を除去
                    let normalized = cell.normalize('NFKC');
                    
                    // 数値パターンを直接抽出
                    const matches = normalized.match(/(-?\d*\.?\d+)/);
                    if (matches) {
                        const numericValue = parseFloat(matches[1]);
                        if (!isNaN(numericValue)) {
                            console.log(`Converting: "${cell}" -> "${normalized}" -> ${numericValue}`); // デバッグ出力
                            return numericValue;
                        }
                    }
                    
                    // 記号を除去して再試行
                    normalized = normalized.replace(/[○◯〇φΦ]/g, '').trim();
                    const numericValue = parseFloat(normalized);
                    if (!isNaN(numericValue)) {
                        console.log(`Converting (after cleanup): "${cell}" -> "${normalized}" -> ${numericValue}`); // デバッグ出力
                        return numericValue;
                    }
                    
                    console.log('Failed to convert:', cell); // デバッグ出力
                    return null;
                } 
                // 数値の場合
                else if (typeof cell === 'number') {
                    return cell;
                }
                return null;
            });
        });

        // 数値データのみの行を抽出
        currentData = currentData.filter(row => {
            // 行に少なくとも1つの数値が含まれているかチェック
            return row.some(cell => cell !== null);
        });

        // デバッグ用：データの確認
        console.log('Final Processed Data:', JSON.stringify(currentData, null, 2));

        // データテーブルの更新
        updateDataTable(currentData);

        // Y軸の選択肢を更新
        updateYAxisOptions(currentData[0]);

        // グラフの初期化
        initializeChart();

        // 初期データでグラフを更新
        updateGraphs();
    };
    reader.readAsArrayBuffer(file);
} 