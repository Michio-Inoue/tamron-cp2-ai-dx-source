// グローバル変数
let charts = {};
let currentData = null;

// グラフの色設定
const chartColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#1ABC9C'
];

// DOMの読み込みが完了したら実行
document.addEventListener('DOMContentLoaded', () => {
    // ファイルアップロードの処理
    const fileInput = document.getElementById('data-file');
    const fileDropZone = document.querySelector('.file-drop-zone');

    // ドラッグ&ドロップのイベントリスナー
    fileDropZone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        fileDropZone.classList.add('dragover');
    });

    fileDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropZone.classList.add('dragover');
    });

    fileDropZone.addEventListener('dragleave', () => {
        fileDropZone.classList.remove('dragover');
    });

    fileDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // ファイル選択の処理
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // グラフ更新ボタンの処理
    const updateButton = document.querySelector('.update-button');
    updateButton.addEventListener('click', updateGraphs);
});

// ファイル処理関数
function handleFiles(files) {
    if (files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // 1行目から12行目までのデータを取得
            const headerData = XLSX.utils.sheet_to_json(worksheet, { range: 0, header: 1 });
            
            // 2行目の日付を取得（4列目から）
            const dateRow = headerData[1];
            const dates = dateRow.slice(3).map(dateStr => {
                // nullまたはemptyの場合はnullを返す
                if (!dateStr || dateStr === 'empty' || dateStr === null) {
                    return null;
                }

                let date;
                if (typeof dateStr === 'number') {
                    const excelDate = new Date(1900, 0, 1);
                    date = new Date(excelDate.getTime() + (dateStr - 1) * 24 * 60 * 60 * 1000);
                } else if (typeof dateStr === 'string') {
                    // 日付文字列の形式をチェック
                    if (dateStr.includes('/')) {
                        const [year, month, day] = dateStr.split('/');
                        date = new Date(year, month - 1, day);
                    } else if (dateStr.includes('GMT')) {
                        // GMTを含む日付文字列の場合
                        date = new Date(dateStr);
                    } else {
                        // その他の形式の場合
                        date = new Date(dateStr);
                    }
                }

                // 日付が有効な場合のみ返す
                return date instanceof Date && !isNaN(date.getTime()) ? date : null;
            });
            
            // シートをJSONに変換（12行目から開始）
            currentData = XLSX.utils.sheet_to_json(worksheet, { range: 11 });
            
            // データの前処理
            currentData = currentData.map((row, index) => {
                const processedRow = {};
                Object.keys(row).forEach(key => {
                    if (key === '納入日期') {
                        processedRow[key] = dates[index];
                    } 
                    else if (key === '__EMPTY_2') {  // C列（range）のデータ
                        processedRow['range'] = row[key];
                        const rangeStr = String(row[key]);
                        console.log('Range string:', rangeStr);  // デバッグ出力
                        const numbers = rangeStr.match(/\d+\.?\d*/g);
                        console.log('Extracted numbers:', numbers);  // デバッグ出力
                        if (numbers && numbers.length >= 2) {
                            processedRow['規格下限'] = parseFloat(numbers[0]);
                            processedRow['規格上限'] = parseFloat(numbers[1]);
                            console.log('Parsed limits:', processedRow['規格下限'], processedRow['規格上限']);  // デバッグ出力
                        }
                    }
                    else if (key === '__EMPTY_1') {
                        processedRow['test no'] = row[key];
                    }
                    else if (!isNaN(key)) {
                        processedRow[key] = row[key];
                    }
                    else {
                        processedRow[key] = row[key];
                    }
                });
                return processedRow;
            });

            // グローバル変数に日付データを保存
            window.headerDates = dates;

            displayDataTable(currentData, dates, headerData);
            
            const xAxisSelect = document.getElementById('x-axis');
            xAxisSelect.value = '納入日期';
            
            updateMeasurementOptions(headerData);
            updateGraphs();
        } catch (error) {
            showError('ファイルの読み込み中にエラーが発生しました。');
            console.error('Error:', error);
        }
    };

    reader.readAsArrayBuffer(file);
}

// データテーブル表示関数
function displayDataTable(data, dates, headerData) {
    if (!data || data.length === 0) {
        console.error('No data to display');
        return;
    }

    const table = document.getElementById('data-table');
    const headers = Object.keys(data[0]);

    // ヘッダー行の作成（1行目から12行目まで）
    let html = '<thead>';
    headerData.slice(0, 12).forEach((row, rowIndex) => {
        html += '<tr>';
        row.forEach((cell, colIndex) => {
            if (rowIndex === 0) {
                // 1行目はthタグを使用
                html += `<th>${cell}</th>`;
            } else if (rowIndex === 1) {
                // 2行目は日付データを変換
                let dateStr = cell;
                if (typeof dateStr === 'number') {
                    const excelDate = new Date(1900, 0, 1);
                    const date = new Date(excelDate.getTime() + (dateStr - 1) * 24 * 60 * 60 * 1000);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    dateStr = `${year}/${month}/${day}`;
                }
                html += `<td>${dateStr}</td>`;
            } else if (rowIndex === 2) {
                // 3行目も日付データを変換
                let dateStr = cell;
                if (typeof dateStr === 'number') {
                    const excelDate = new Date(1900, 0, 1);
                    const date = new Date(excelDate.getTime() + (dateStr - 1) * 24 * 60 * 60 * 1000);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    dateStr = `${year}/${month}/${day}`;
                }
                html += `<td>${dateStr}</td>`;
            } else {
                // 4行目以降はtdタグを使用
                html += `<td>${cell}</td>`;
            }
        });
        html += '</tr>';
    });
    html += '</thead>';

    // データ行の作成（12行目以降）
    html += '<tbody>';
    data.forEach((row, index) => {
        html += '<tr>';
        headers.forEach(header => {
            let cellValue = row[header];
            if (header === '納入日期') {
                // 2行目の日付を使用
                const dateStr = dates[index];
                let date;
                
                if (typeof dateStr === 'string') {
                    const [year, month, day] = dateStr.split('/');
                    date = new Date(year, month - 1, day);
                } else if (typeof dateStr === 'number') {
                    const excelDate = new Date(1900, 0, 1);
                    date = new Date(excelDate.getTime() + (dateStr - 1) * 24 * 60 * 60 * 1000);
                } else {
                    date = new Date(dateStr);
                }
                
                // 日付を「YYYY/MM/DD」形式で表示
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                cellValue = `${year}/${month}/${day}`;
            } else if (header === 'test no') {
                // test noは元の形式のまま表示
                cellValue = row[header];
            } else if (typeof cellValue === 'string' && cellValue.includes('/')) {
                // φ9.485/φ9.492のような形式のデータを処理
                const numbers = cellValue.match(/\d+(\.\d+)?/g);
                if (numbers && numbers.length === 2) {
                    const avg = (parseFloat(numbers[0]) + parseFloat(numbers[1])) / 2;
                    cellValue = avg.toFixed(3);
                }
            }
            html += `<td>${cellValue}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody>';

    table.innerHTML = html;
}

// 測定項目の選択肢を更新する関数
function updateMeasurementOptions(headerData) {
    const yAxisSelect = document.getElementById('y-axis');

    // 既存の選択肢をクリア
    yAxisSelect.innerHTML = '';
    yAxisSelect.appendChild(new Option('測定項目を選択してください', ''));

    // 2列目12行目以降の測定項目を選択肢として追加
    headerData.slice(11).forEach(row => {
        const measurement = row[1]; // 2列目の値
        if (measurement) {
            const option = document.createElement('option');
            option.value = measurement;
            option.textContent = measurement;
            yAxisSelect.appendChild(option);
        }
    });

    // デフォルトの選択を設定（最初の測定項目）
    if (yAxisSelect.options.length > 1) {
        yAxisSelect.value = yAxisSelect.options[1].value;
    }
}

// グラフ更新関数
function updateGraphs() {
    if (!currentData || currentData.length === 0) {
        showError('データが読み込まれていません。');
        return;
    }

    const selectedMeasurement = document.getElementById('y-axis').value;

    if (!selectedMeasurement) {
        showError('測定項目を選択してください。');
        return;
    }

    // 選択された測定項目の行を探す
    const measurementRow = currentData.find(row => row['test no'] === selectedMeasurement);
    if (!measurementRow) {
        showError('選択された測定項目が見つかりません。');
        return;
    }

    // デバッグ情報を出力
    console.log('currentData:', currentData);
    console.log('measurementRow:', measurementRow);
    console.log('measurementRow keys:', Object.keys(measurementRow));

    // 測定値のデータを取得（4列目以降のセル）
    const measurementData = [];
    
    // Excelの列名（A=0, B=1, C=2, D=3, ...）を生成
    const columnNames = Array.from({ length: 50 }, (_, i) => {
        if (i < 26) {
            return String.fromCharCode(65 + i);
        } else {
            return 'A' + String.fromCharCode(65 + (i - 26));
        }
    });
    
    // D列（3）以降のデータを取得
    for (let i = 3; i < columnNames.length; i++) {
        const columnKey = `__EMPTY_${i}`;
        const value = measurementRow[columnKey];
        console.log(`列 ${columnNames[i]} (${columnKey}) の値:`, value);
        
        if (value !== undefined) {
            if (typeof value === 'string') {
                if (value.includes('/')) {
                    const numbers = value.match(/\d+(\.\d+)?/g);
                    if (numbers && numbers.length === 2) {
                        measurementData.push((parseFloat(numbers[0]) + parseFloat(numbers[1])) / 2);
                    } else {
                        const numValue = parseFloat(value);
                        measurementData.push(isNaN(numValue) ? null : numValue);
                    }
                } else {
                    const numValue = parseFloat(value);
                    measurementData.push(isNaN(numValue) ? null : numValue);
                }
            } else if (typeof value === 'number') {
                measurementData.push(value);
            } else {
                measurementData.push(null);
            }
        }
    }

    // デバッグ情報を出力
    console.log('選択された測定項目:', selectedMeasurement);
    console.log('測定行のキー:', Object.keys(measurementRow));
    console.log('測定行の値:', measurementRow);
    console.log('測定データ:', measurementData);
    console.log('測定データの長さ:', measurementData.length);

    // 2行目の日付データを使用（4列目から）
    const dates = window.headerDates || [];
    if (!dates || dates.length === 0) {
        showError('日付データが見つかりません。');
        return;
    }

    // デバッグ情報を出力
    console.log('日付データ:', dates);
    console.log('日付データの長さ:', dates.length);
    console.log('日付データの型:', dates.map(date => typeof date));
    console.log('日付データの有効性:', dates.map(date => date instanceof Date && !isNaN(date.getTime())));

    // データポイントの準備
    const dataPoints = [];
    for (let i = 0; i < Math.min(dates.length, measurementData.length); i++) {
        const value = measurementData[i];
        const date = dates[i];

        // デバッグ情報を出力
        console.log(`インデックス ${i}:`, {
            value: value,
            date: date,
            valueType: typeof value,
            dateType: typeof date,
            isValidValue: value !== null && value !== undefined && !isNaN(value),
            isValidDate: date instanceof Date && !isNaN(date.getTime())
        });

        // 値と日付の両方が有効な場合のみデータポイントを追加
        if (value !== null && value !== undefined && !isNaN(value) && date instanceof Date && !isNaN(date.getTime())) {
            dataPoints.push({
                x: date.getTime(),
                y: value
            });
        }
    }

    // デバッグ情報を出力
    console.log('生成されたデータポイント:', dataPoints);
    console.log('データポイントの数:', dataPoints.length);
    console.log('測定データの長さ:', measurementData.length);
    console.log('日付データの長さ:', dates.length);
    console.log('有効な日付の数:', dates.filter(date => date instanceof Date && !isNaN(date.getTime())).length);
    console.log('有効な測定値の数:', measurementData.filter(value => value !== null && value !== undefined && !isNaN(value)).length);

    if (dataPoints.length === 0) {
        showError('有効なデータポイントが見つかりません。');
        return;
    }

    // 規格範囲の取得（選択された測定項目の行から）
    const range = measurementRow['range'];
    let specLower = null;
    let specUpper = null;

    if (range) {
        const numbers = String(range).match(/\d+\.?\d*/g);
        if (numbers && numbers.length >= 2) {
            specLower = parseFloat(numbers[0]);
            specUpper = parseFloat(numbers[1]);
        }
    }

    // デバッグ情報を出力
    console.log('規格範囲:', {
        range: range,
        lower: specLower,
        upper: specUpper
    });

    // 規格線用のデータポイント
    const validDates = dates.filter(date => date instanceof Date && !isNaN(date.getTime()));
    const specPoints = validDates.map(date => ({
        x: date.getTime(),
        y: specUpper
    }));

    const specLowerPoints = validDates.map(date => ({
        x: date.getTime(),
        y: specLower
    }));

    // グラフの設定
    const config = {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: selectedMeasurement,
                    data: dataPoints,
                    backgroundColor: 'rgba(35, 47, 62, 0.6)',
                    borderColor: 'rgba(35, 47, 62, 1)',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    hitRadius: 10
                },
                {
                    label: '規格上限',
                    data: specPoints,
                    borderColor: 'rgba(255, 99, 132, 0.5)',
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    showLine: true
                },
                {
                    label: '規格下限',
                    data: specLowerPoints,
                    borderColor: 'rgba(255, 99, 132, 0.5)',
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    showLine: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'yyyy/MM/dd'
                        }
                    },
                    title: {
                        display: true,
                        text: '納入日'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: selectedMeasurement
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `${selectedMeasurement} の推移`
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const date = new Date(context.raw.x);
                            const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
                            return `${formattedDate}: ${context.raw.y.toFixed(3)}`;
                        }
                    }
                }
            }
        }
    };

    // 既存のグラフを削除
    const graphContainer = document.getElementById('graph-container');
    graphContainer.innerHTML = '';

    // 新しいグラフを作成
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '400px';
    graphContainer.appendChild(canvas);
    new Chart(canvas, config);
}

// エラー表示関数
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.tof-data-container').prepend(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
} 