// グローバル変数
let charts = {};
let currentData = null;
let model = null;
let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let modelOpacity = 0.5;
let selectedFaces = new Set();
let hoveredFace = null;
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let faceDataMap = new Map();
let faceMaterials = {
    default: new THREE.MeshPhongMaterial({ 
        color: 0x808080, 
        transparent: true, 
        opacity: modelOpacity,
        specular: 0x111111,
        shininess: 200
    }),
    selected: new THREE.MeshPhongMaterial({ 
        color: 0xff0000, 
        transparent: true, 
        opacity: modelOpacity,
        specular: 0x111111,
        shininess: 200
    }),
    hover: new THREE.MeshPhongMaterial({ 
        color: 0xffff00, 
        transparent: true, 
        opacity: modelOpacity,
        specular: 0x111111,
        shininess: 200
    })
};

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

    // 3Dモデル関連のイベントリスナー
    document.getElementById('import-stl').addEventListener('click', handleSTLFile);
    document.getElementById('model-opacity').addEventListener('input', (e) => updateModelOpacity(e.target.value));

    // 3Dビューアの初期化
    initialize3DViewer();
});

// 3Dビューアの初期化
function initialize3DViewer() {
    const container = document.getElementById('model-viewer');
    if (!container) {
        console.error('model-viewer element not found');
        return;
    }

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0xf0f0f0);
    container.appendChild(renderer.domElement);

    // カメラの位置を設定
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // ライトの設定
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene = new THREE.Scene();
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // コントロールの設定
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // マウスイベントの設定
    renderer.domElement.addEventListener('mousedown', function(event) {
        console.log('マウスダウンイベント発生');
        onMouseDown(event);
    });
    renderer.domElement.addEventListener('mousemove', function(event) {
        onMouseMove(event);
    });

    // アニメーションループ
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();

    // ウィンドウリサイズ時の処理
    window.addEventListener('resize', () => {
        const container = document.getElementById('model-viewer');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

function initializeFaceData(geometry) {
    console.log('面データの初期化を開始');
    faceDataMap.clear();
    
    const positions = geometry.attributes.position.array;
    const indices = geometry.index ? geometry.index.array : null;
    
    for (let i = 0; i < positions.length; i += 9) {
        const faceIndex = i / 9;
        
        // 頂点座標を取得
        const v1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        const v2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
        const v3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
        
        // 法線ベクトルを計算
        const normal = new THREE.Vector3();
        const edge1 = new THREE.Vector3().subVectors(v2, v1);
        const edge2 = new THREE.Vector3().subVectors(v3, v1);
        normal.crossVectors(edge1, edge2).normalize();
        
        // 中心点を計算
        const center = new THREE.Vector3();
        center.add(v1).add(v2).add(v3).divideScalar(3);
        
        // 面積を計算
        const area = edge1.cross(edge2).length() / 2;
        
        // 面データを保存
        faceDataMap.set(faceIndex, {
            normal: normal,
            center: center,
            area: area
        });
    }
    
    console.log('面データの初期化が完了:', faceDataMap.size, '面');
}

function onMouseDown(event) {
    if (!model) {
        console.log('モデルが読み込まれていません');
        return;
    }

    // マウス位置を正規化
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    console.log('マウス位置:', mouse.x, mouse.y);

    // レイキャスティング
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(model);

    if (intersects.length > 0) {
        console.log('交差を検出:', intersects[0]);
        const faceIndex = Math.floor(intersects[0].faceIndex / 3);
        console.log('選択された面:', faceIndex);
        toggleFaceSelection(faceIndex);
    } else {
        console.log('交差なし');
    }
}

function onMouseMove(event) {
    if (!model) return;

    // マウス位置を正規化
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // レイキャスティング
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(model);

    if (intersects.length > 0) {
        const faceIndex = Math.floor(intersects[0].faceIndex / 3);
        updateHoveredFace(faceIndex);
    } else {
        updateHoveredFace(null);
    }
}

function toggleFaceSelection(faceIndex) {
    console.log('面の選択を切り替え:', faceIndex);
    if (selectedFaces.has(faceIndex)) {
        selectedFaces.delete(faceIndex);
        removeFaceChart(faceIndex);
        console.log('面の選択を解除:', faceIndex);
    } else {
        selectedFaces.add(faceIndex);
        const measurement = document.getElementById('y-axis').value;
        if (measurement) {
            createFaceChart(faceIndex, measurement);
        }
        console.log('面を選択:', faceIndex);
    }
    updateFaceMaterials();
    updateFaceInfo();
}

function updateHoveredFace(faceIndex) {
    if (hoveredFace !== faceIndex) {
        hoveredFace = faceIndex;
        updateFaceMaterials();
    }
}

function updateFaceMaterials() {
    if (!model) return;

    const geometry = model.geometry;
    const materialArray = [];

    for (let i = 0; i < geometry.attributes.position.count / 3; i++) {
        if (selectedFaces.has(i)) {
            materialArray.push(faceMaterials.selected);
        } else if (hoveredFace === i) {
            materialArray.push(faceMaterials.hover);
        } else {
            materialArray.push(faceMaterials.default);
        }
    }

    model.material = materialArray;
    model.material.needsUpdate = true;
}

function updateFaceInfo() {
    const faceInfoElement = document.getElementById('face-info');
    if (!faceInfoElement) {
        console.error('face-info element not found');
        return;
    }

    if (selectedFaces.size === 0) {
        faceInfoElement.innerHTML = '<p>面を選択してください</p>';
        return;
    }

    let infoHTML = '<h4>選択された面の情報</h4>';
    selectedFaces.forEach(faceIndex => {
        const faceData = faceDataMap.get(faceIndex);
        if (faceData) {
            infoHTML += `
                <div class="face-info-item">
                    <p>面番号: ${faceIndex}</p>
                    <p>面積: ${faceData.area.toFixed(2)}</p>
                    <p>法線ベクトル: (${faceData.normal.x.toFixed(2)}, ${faceData.normal.y.toFixed(2)}, ${faceData.normal.z.toFixed(2)})</p>
                    <p>中心点: (${faceData.center.x.toFixed(2)}, ${faceData.center.y.toFixed(2)}, ${faceData.center.z.toFixed(2)})</p>
                </div>
            `;
        }
    });

    faceInfoElement.innerHTML = infoHTML;
}

// STLファイルの処理
function handleSTLFile() {
    console.log('STLファイルを読み込み中...');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.stl';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const loader = new THREE.STLLoader();
        loader.load(URL.createObjectURL(file), (geometry) => {
            console.log('STLファイルの読み込み完了');
            // 既存のモデルを削除
            if (model) {
                scene.remove(model);
            }

            // ジオメトリの中心を原点に移動
            geometry.center();

            // モデルの作成
            model = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
                color: 0x808080,
                specular: 0x111111,
                shininess: 200,
                transparent: true,
                opacity: modelOpacity
            }));
            scene.add(model);

            // カメラの位置を調整
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / Math.tan(fov / 2));
            camera.position.z = cameraZ * 1.5;
            controls.target.copy(center);
            controls.update();

            // 面データの初期化
            initializeFaceData(geometry);
            console.log('面データの初期化完了');
        });
    };
    input.click();
}

// モデルの透明度を更新
function updateModelOpacity(opacity) {
    modelOpacity = opacity / 100;
    
    // マテリアルの透明度を更新
    faceMaterials.default.opacity = modelOpacity;
    faceMaterials.selected.opacity = modelOpacity;
    faceMaterials.hover.opacity = modelOpacity;
    
    // マテリアルを更新
    if (model) {
        updateFaceMaterials();
    }
}

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

    // ヘッダー行の作成（1行目から10行目まで）
    let html = '<thead>';
    headerData.slice(0, 10).forEach((row, rowIndex) => {
        // 1列目がundefinedの場合はスキップ
        if (row[0] === undefined) {
            return;
        }

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

    // データ行の作成（10行目以降）
    html += '<tbody>';
    data.forEach((row, index) => {
        // 1列目がundefinedの場合はスキップ
        if (row[headers[0]] === undefined) {
            return;
        }

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
            } else if (typeof cellValue === 'string') {
                if (cellValue.includes('/')) {
                    // φ9.485/φ9.492のような形式のデータを処理
                    const numbers = cellValue.match(/\d+(\.\d+)?/g);
                    if (numbers && numbers.length === 2) {
                        const avg = (parseFloat(numbers[0]) + parseFloat(numbers[1])) / 2;
                        cellValue = avg.toFixed(3);
                    }
                } else {
                    // ○0.009、Φ9.485 止、Φ9.796 Just、Φ9.999 通、∥0.015のようなデータを処理
                    const numbers = cellValue.match(/\d+(\.\d+)?/g);
                    if (numbers && numbers.length === 1) {
                        cellValue = parseFloat(numbers[0]).toFixed(3);
                    }
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
            maintainAspectRatio: true,  // アスペクト比を維持
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
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: selectedMeasurement
                    },
                    min: Math.min(specLower, ...dataPoints.map(p => p.y)) - (specUpper - specLower) * 0.1,
                    max: Math.max(specUpper, ...dataPoints.map(p => p.y)) + (specUpper - specLower) * 0.1,
                    ticks: {
                        stepSize: (specUpper - specLower) / 10,
                        maxTicksLimit: 10
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

    // メインコンテナを作成
    const mainContainer = document.createElement('div');
    mainContainer.style.display = 'flex';
    mainContainer.style.flexDirection = 'column';
    mainContainer.style.gap = '20px';
    mainContainer.style.width = '100%';
    graphContainer.appendChild(mainContainer);

    // グラフ用のコンテナを作成
    const chartWrapper = document.createElement('div');
    chartWrapper.style.display = 'flex';
    chartWrapper.style.flexDirection = 'column';
    chartWrapper.style.gap = '10px';
    chartWrapper.style.height = '400px';
    chartWrapper.style.width = '100%';
    mainContainer.appendChild(chartWrapper);

    // 新しいグラフを作成
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    chartWrapper.appendChild(canvas);
    new Chart(canvas, config);

    // 統計情報の計算と表示
    const validValues = measurementData.filter(value => value !== null && !isNaN(value));
    if (validValues.length > 0) {
        const max = Math.max(...validValues);
        const min = Math.min(...validValues);
        const sum = validValues.reduce((a, b) => a + b, 0);
        const mean = sum / validValues.length;
        const variance = validValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / validValues.length;
        const stdDev = Math.sqrt(variance);
        
        // 工程能力（Cp, Cpk）の計算
        const Cp = (specUpper - specLower) / (6 * stdDev);
        const Cpk = Math.min(
            (specUpper - mean) / (3 * stdDev),
            (mean - specLower) / (3 * stdDev)
        );

        // 統計情報を表示する要素を作成
        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats-container';
        statsDiv.style.padding = '10px';
        statsDiv.style.backgroundColor = '#f8f9fa';
        statsDiv.style.borderRadius = '5px';
        statsDiv.style.fontSize = '12px';
        statsDiv.style.width = '100%';
        statsDiv.style.marginBottom = '32px';

        statsDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <div>
                    <h3 style="margin-top: 0; color: #232f3e; font-size: 13px;">基本統計量</h3>
                    <p style="margin: 2px 0;"><strong>最大値:</strong> ${max.toFixed(3)}</p>
                    <p style="margin: 2px 0;"><strong>最小値:</strong> ${min.toFixed(3)}</p>
                    <p style="margin: 2px 0;"><strong>平均値:</strong> ${mean.toFixed(3)}</p>
                    <p style="margin: 2px 0;"><strong>標準偏差:</strong> ${stdDev.toFixed(3)}</p>
                </div>
                <div>
                    <h3 style="margin-top: 0; color: #232f3e; font-size: 13px;">工程能力</h3>
                    <p style="margin: 2px 0;"><strong>Cp:</strong> ${Cp.toFixed(3)}</p>
                    <p style="margin: 2px 0;"><strong>Cpk:</strong> ${Cpk.toFixed(3)}</p>
                </div>
                <div>
                    <h3 style="margin-top: 0; color: #232f3e; font-size: 13px;">その他</h3>
                    <p style="margin: 2px 0;"><strong>規格範囲:</strong> ${specLower.toFixed(3)} ～ ${specUpper.toFixed(3)}</p>
                    <p style="margin: 2px 0;"><strong>データ数:</strong> ${validValues.length}</p>
                </div>
            </div>
        `;

        mainContainer.appendChild(statsDiv);
    }

    // データテーブルコンテナを移動
    const dataTableContainer = document.querySelector('.data-table-container');
    if (dataTableContainer) {
        // データテーブルをメインコンテナに移動
        mainContainer.appendChild(dataTableContainer);
        dataTableContainer.style.width = '100%';
        dataTableContainer.style.marginTop = '32px';
    }
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

// 面ごとの散布図を作成
function createFaceChart(faceIndex, measurement) {
    // 既に存在する場合は何もしない
    if (document.getElementById(`face-chart-${faceIndex}`)) return;
    const faceChartsDiv = document.getElementById('face-charts');
    if (!faceChartsDiv) return;
    // データ取得
    const {dataPoints, specLower, specUpper} = getFaceChartData(measurement);
    // コンテナ生成
    const chartContainer = document.createElement('div');
    chartContainer.className = 'face-chart';
    chartContainer.id = `face-chart-${faceIndex}`;
    // キャンバス生成
    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    // 削除ボタン
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-chart';
    removeBtn.textContent = '×';
    removeBtn.onclick = () => toggleFaceSelection(faceIndex);
    chartContainer.appendChild(removeBtn);
    // 追加
    faceChartsDiv.appendChild(chartContainer);
    // Chart.js描画
    const chart = new Chart(canvas, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: `${measurement} (面${faceIndex})`,
                    data: dataPoints,
                    backgroundColor: chartColors[faceIndex % chartColors.length],
                    borderColor: chartColors[faceIndex % chartColors.length],
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: '規格上限',
                    data: dataPoints.map(p => ({x: p.x, y: specUpper})),
                    borderColor: 'rgba(255,99,132,0.5)',
                    borderDash: [5,5],
                    fill: false,
                    pointRadius: 0,
                    showLine: true
                },
                {
                    label: '規格下限',
                    data: dataPoints.map(p => ({x: p.x, y: specLower})),
                    borderColor: 'rgba(255,99,132,0.5)',
                    borderDash: [5,5],
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
                    time: { unit: 'day' },
                    title: { display: true, text: '納入日' }
                },
                y: {
                    title: { display: true, text: measurement }
                }
            },
            plugins: {
                legend: { display: true },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const date = new Date(context.raw.x);
                            const formattedDate = `${date.getFullYear()}/${String(date.getMonth()+1).padStart(2,'0')}/${String(date.getDate()).padStart(2,'0')}`;
                            return `${formattedDate}: ${context.raw.y.toFixed(3)}`;
                        }
                    }
                }
            }
        }
    });
    charts[faceIndex] = chart;
}

// 面ごとの散布図データ取得
function getFaceChartData(measurement) {
    // currentData, window.headerDates, measurementRowの取得
    if (!currentData || !window.headerDates) return {dataPoints: [], specLower: null, specUpper: null};
    const measurementRow = currentData.find(row => row['test no'] === measurement);
    if (!measurementRow) return {dataPoints: [], specLower: null, specUpper: null};
    // 測定値配列
    const measurementData = [];
    for (let i = 3; i < 50; i++) {
        const key = `__EMPTY_${i}`;
        const value = measurementRow[key];
        if (value !== undefined) {
            if (typeof value === 'string' && value.includes('/')) {
                const numbers = value.match(/\d+(\.\d+)?/g);
                if (numbers && numbers.length === 2) {
                    measurementData.push((parseFloat(numbers[0]) + parseFloat(numbers[1])) / 2);
                } else {
                    const numValue = parseFloat(value);
                    measurementData.push(isNaN(numValue) ? null : numValue);
                }
            } else if (typeof value === 'number') {
                measurementData.push(value);
            } else {
                const numValue = parseFloat(value);
                measurementData.push(isNaN(numValue) ? null : numValue);
            }
        }
    }
    // 日付
    const dates = window.headerDates;
    // データポイント
    const dataPoints = [];
    for (let i = 0; i < Math.min(dates.length, measurementData.length); i++) {
        const value = measurementData[i];
        const date = dates[i];
        if (value !== null && value !== undefined && !isNaN(value) && date instanceof Date && !isNaN(date.getTime())) {
            dataPoints.push({ x: date, y: value });
        }
    }
    // 規格範囲
    let specLower = null, specUpper = null;
    const range = measurementRow['range'];
    if (range) {
        const numbers = String(range).match(/\d+\.?\d*/g);
        if (numbers && numbers.length >= 2) {
            specLower = parseFloat(numbers[0]);
            specUpper = parseFloat(numbers[1]);
        }
    }
    return { dataPoints, specLower, specUpper };
}

// 散布図削除
function removeFaceChart(faceIndex) {
    const chart = charts[faceIndex];
    if (chart) {
        chart.destroy();
        delete charts[faceIndex];
    }
    const chartDiv = document.getElementById(`face-chart-${faceIndex}`);
    if (chartDiv) chartDiv.remove();
}

// 測定項目変更時に全ての面のグラフを更新
const yAxisSelect = document.getElementById('y-axis');
yAxisSelect.addEventListener('change', function() {
    const measurement = yAxisSelect.value;
    selectedFaces.forEach(faceIndex => {
        removeFaceChart(faceIndex);
        createFaceChart(faceIndex, measurement);
    });
}); 