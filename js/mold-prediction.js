// 金型データの構造体
class MoldData {
    constructor(moldId, startDate, shotCount, material, temperature) {
        this.moldId = moldId;
        this.startDate = startDate ? new Date(startDate) : null;
        this.shotCount = parseInt(shotCount) || 0;
        this.material = material || '';
        this.temperature = parseFloat(temperature) || 0;
    }

    // 日付をフォーマットして返す
    getFormattedStartDate() {
        return this.startDate ? this.startDate.toLocaleDateString('ja-JP') : '未設定';
    }
}

// 予測データの構造体
class PredictionData {
    constructor(formData) {
        this.productId = formData.get('productId');
        this.moldLifeShots = parseInt(formData.get('moldLifeShots')) || 0;
        this.currentMoldCount = parseInt(formData.get('currentMoldCount')) || 1;
        this.startMoldNumber = parseInt(formData.get('startMoldNumber')) || 1;
        this.cavityCount = parseInt(formData.get('cavityCount')) || 1;
        this.cycleTime = parseInt(formData.get('cycleTime')) || 0;
        this.workingHours = parseInt(formData.get('workingHours')) || 20;
        this.workingDays = parseInt(formData.get('workingDays')) || 0;
        this.yieldRate = parseFloat(formData.get('yieldRate')) || 100;
        this.leadTime = parseInt(formData.get('leadTime')) || 30;
        this.safetyStock = parseInt(formData.get('safetyStock')) || 14;
        this.monthlyPlan = Array(24).fill(0).map((_, i) => 
            parseInt(formData.get(`month${i + 1}`)) || 0
        );
    }
}

// フォーム送信時の処理
document.addEventListener('DOMContentLoaded', function() {
    const predictionForm = document.getElementById('predictionForm');
    if (!predictionForm) {
        console.error('フォームが見つかりません。ID: predictionForm');
        return;
    }

    // 保存されたデータを復元
    restoreFormData(predictionForm);
    
    // フォーム送信時のイベントリスナーを設定
    predictionForm.addEventListener('submit', handleFormSubmit);
    
    // フォームの入力値が変更されたときにデータを保存
    predictionForm.addEventListener('input', function(event) {
        // 数値入力フィールドの場合、カンマを自動追加
        if (event.target.type === 'number' || event.target.type === 'text') {
            const value = event.target.value.replace(/[,\s]/g, '');
            if (!isNaN(value) && value !== '') {
                event.target.value = Number(value).toLocaleString();
            }
        }
        saveFormData(predictionForm);
    });

    // データクリアボタンのイベントリスナーを設定
    const clearButton = document.getElementById('clear-data');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            clearFormData(predictionForm);
        });
    }

    // 保存データ読み込みボタンのイベントリスナーを追加
    const loadDataButton = document.getElementById('loadDataButton');
    if (loadDataButton) {
        loadDataButton.addEventListener('click', function() {
            const loadDataInput = document.getElementById('loadData');
            if (loadDataInput) {
                loadDataInput.click();
            }
        });
    }

    // 保存データ読み込みのイベントリスナーを追加
    const loadDataInput = document.getElementById('loadData');
    if (loadDataInput) {
        loadDataInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        // フォームデータを復元
                        if (data.formData) {
                            for (let [key, value] of Object.entries(data.formData)) {
                                const input = predictionForm.elements[key];
                                if (input) {
                                    // 数値フィールドの場合、カンマ区切りで表示
                                    if (input.type === 'number' || input.type === 'text') {
                                        if (!isNaN(value) && value !== '') {
                                            input.value = Number(value).toLocaleString();
                                        } else {
                                            input.value = value;
                                        }
                                    } else {
                                        input.value = value;
                                    }
                                }
                            }
                        }
                        // 予測結果を復元
                        if (data.predictionResults) {
                            const resultsDiv = document.getElementById('prediction-results');
                            if (resultsDiv) {
                                resultsDiv.innerHTML = data.predictionResults;
                                resultsDiv.classList.add('show');
                            }
                        }
                        alert('データの読み込みが完了しました。');
                    } catch (error) {
                        alert('データの読み込みに失敗しました。正しい形式のファイルを選択してください。');
                        console.error('Error loading data:', error);
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    // フォルダ選択ボタンのイベントリスナーを追加
    const selectFolderButton = document.getElementById('selectFolder');
    if (selectFolderButton) {
        selectFolderButton.addEventListener('click', function() {
            const folderInput = document.createElement('input');
            folderInput.type = 'file';
            folderInput.webkitdirectory = true;
            folderInput.directory = true;
            folderInput.style.display = 'none';
            document.body.appendChild(folderInput);
            
            folderInput.addEventListener('change', function(e) {
                if (e.target.files && e.target.files.length > 0) {
                    const folderPath = e.target.files[0].webkitRelativePath.split('/')[0];
                    const saveFolderInput = document.getElementById('saveFolder');
                    if (saveFolderInput) {
                        saveFolderInput.value = folderPath;
                        // 選択したフォルダのパスをローカルストレージに保存
                        localStorage.setItem('lastSelectedFolder', folderPath);
                    }
                }
                document.body.removeChild(folderInput);
            });
            
            folderInput.click();
        });
    }

    // データ保存ボタンのイベントリスナーを追加
    const saveDataButton = document.getElementById('saveData');
    if (saveDataButton) {
        saveDataButton.addEventListener('click', function() {
            // モーダルを作成
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background-color: white;
                padding: 20px;
                border-radius: 5px;
                width: 400px;
                max-width: 90%;
            `;

            modalContent.innerHTML = `
                <h3>データ保存</h3>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">ファイル名:</label>
                    <input type="text" id="fileName" style="width: 100%; padding: 5px;" value="mold_prediction_${new Date().toISOString().replace(/[:.]/g, '-')}">
                </div>
                <div style="text-align: right;">
                    <button onclick="closeSaveModal()" style="margin-right: 10px; padding: 5px 10px;">キャンセル</button>
                    <button onclick="saveData()" style="padding: 5px 10px;">保存</button>
                </div>
            `;

            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // モーダルを閉じる関数
            window.closeSaveModal = function() {
                document.body.removeChild(modal);
            };
        });
    }
});

// フォームデータを保存
function saveFormData(form) {
    const formData = new FormData(form);
    const formDataObj = {};
    for (let [key, value] of formData.entries()) {
        // カンマを除去して保存
        if (typeof value === 'string') {
            value = value.replace(/[,\s]/g, '');
        }
        formDataObj[key] = value;
    }
    localStorage.setItem('moldPredictionFormData', JSON.stringify(formDataObj));
}

// フォームデータを復元
function restoreFormData(form) {
    const savedData = localStorage.getItem('moldPredictionFormData');
    if (savedData) {
        const formDataObj = JSON.parse(savedData);
        for (let [key, value] of Object.entries(formDataObj)) {
            const input = form.elements[key];
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = value === 'true';
                } else if (input.type === 'number' || input.type === 'text') {
                    // 数値の場合、カンマを追加して表示
                    if (!isNaN(value) && value !== '') {
                        input.value = Number(value).toLocaleString();
                    } else {
                        input.value = value;
                    }
                } else {
                    input.value = value;
                }
            }
        }
    }
}

// フォームデータをクリア
function clearFormData(form) {
    // フォームのすべての入力フィールドをクリア
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });

    // ローカルストレージからデータを削除
    localStorage.removeItem('moldPredictionFormData');

    // 予測結果をクリア
    const resultsDiv = document.getElementById('prediction-results');
    if (resultsDiv) {
        resultsDiv.innerHTML = '';
        resultsDiv.classList.remove('show');
    }
}

// フォーム送信ハンドラ
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // フォームデータの取得とカンマの除去
    const formData = new FormData(event.target);
    const cleanedFormData = new FormData();
    for (let [key, value] of formData.entries()) {
        if (typeof value === 'string') {
            value = value.replace(/[,\s]/g, '');
        }
        cleanedFormData.append(key, value);
    }
    
    const predictionData = new PredictionData(cleanedFormData);

    try {
        // 手配予測の実行
        const prediction = calculateMoldRequirements(predictionData);
        displayPredictionResults(prediction);
    } catch (error) {
        console.error('予測処理でエラーが発生しました:', error);
        displayError('予測の計算中にエラーが発生しました。入力データを確認してください。');
    }
}

// 1日あたりの生産可能数を計算（良品率を考慮）
function calculateDailyCapacity(cavityCount, cycleTime, workingHours, yieldRate) {
    const secondsPerDay = workingHours * 3600; // 1日の稼働秒数
    const shotsPerDay = Math.floor(secondsPerDay / cycleTime); // 1日のショット数
    const totalProduction = shotsPerDay * cavityCount; // 1日の総生産数
    return Math.floor(totalProduction * (yieldRate / 100)); // 良品率を考慮
}

// 1ヶ月あたりの生産可能数を計算
function calculateMonthlyCapacity(dailyCapacity, workingDays) {
    return dailyCapacity * workingDays;
}

// 金型手配必要数と時期の計算
function calculateMoldRequirements(data) {
    // 1日あたりの生産可能数（キャビティ数、サイクルタイム、良品率を考慮）
    const dailyCapacity = calculateDailyCapacity(data.cavityCount, data.cycleTime, data.workingHours, data.yieldRate);
    const monthlyCapacity = calculateMonthlyCapacity(dailyCapacity, data.workingDays);
    
    // 1金型あたりの最大生産可能数（金型寿命、キャビティ数を考慮）
    const maxProductionPerMold = data.moldLifeShots * data.cavityCount;
    
    // 月ごとの必要金型数を計算（良品率を考慮）
    const monthlyMolds = data.monthlyPlan.map(monthlyQuantity => {
        const requiredQuantity = Math.ceil(monthlyQuantity / (data.yieldRate / 100)); // 良品率を考慮した必要生産数
        const shotsPerMonth = Math.ceil(requiredQuantity / data.cavityCount);
        return Math.ceil(shotsPerMonth / data.moldLifeShots);
    });
    
    // 累積必要金型数を計算
    const cumulativeMolds = calculateCumulativeMolds(monthlyMolds);
    
    // 金型番号ごとの手配必要時期を計算
    const moldOrders = calculateMoldOrders(cumulativeMolds, data.currentMoldCount, data.startMoldNumber, data.leadTime, data.safetyStock, maxProductionPerMold, data.monthlyPlan);
    
    return {
        monthlyMolds,
        cumulativeMolds,
        moldOrders,
        dailyCapacity,
        monthlyCapacity,
        maxProductionPerMold,
        moldLifeShots: data.moldLifeShots,
        cavityCount: data.cavityCount,
        cycleTime: data.cycleTime,
        workingHours: data.workingHours,
        workingDays: data.workingDays,
        yieldRate: data.yieldRate,
        leadTime: data.leadTime,
        safetyStock: data.safetyStock,
        monthlyPlan: data.monthlyPlan,
        currentMoldCount: data.currentMoldCount,
        startMoldNumber: data.startMoldNumber
    };
}

// 累積必要金型数を計算
function calculateCumulativeMolds(monthlyMolds) {
    let cumulative = 0;
    return monthlyMolds.map(molds => {
        cumulative += molds;
        return cumulative;
    });
}

// 金型番号ごとの手配必要時期を計算
function calculateMoldOrders(cumulativeMolds, currentMoldCount, startMoldNumber, leadTime, safetyStock, maxProductionPerMold, monthlyPlan) {
    const today = new Date();
    const orders = [];
    
    // 月ごとの生産計画を累積
    const cumulativePlan = monthlyPlan.reduce((acc, curr) => {
        acc.push((acc[acc.length - 1] || 0) + curr);
        return acc;
    }, []);
    
    // 総生産数を計算
    const totalProduction = monthlyPlan.reduce((sum, quantity) => sum + quantity, 0);
    
    // 必要金型数を計算（総生産数/1金型あたりの最大生産可能数）
    const totalRequiredMolds = Math.ceil(totalProduction / maxProductionPerMold);
    
    // 予測開始金型の生産終了日を計算
    let startMoldLifeMonths = 0;
    let remainingLife = maxProductionPerMold;
    let totalProductionSoFar = 0;
    
    // 予測開始金型の生産終了月を計算
    for (let i = 0; i < monthlyPlan.length; i++) {
        const monthlyProduction = monthlyPlan[i];
        if (remainingLife <= 0) break;
        if (monthlyProduction > 0) {
            startMoldLifeMonths++;
            remainingLife -= monthlyProduction;
            totalProductionSoFar += monthlyProduction;
        }
    }
    
    // 予測開始金型の生産終了日を設定
    const startMoldEndDate = new Date(today);
    startMoldEndDate.setMonth(startMoldEndDate.getMonth() + startMoldLifeMonths);
    let nextMoldNumber = startMoldNumber + 1;
    
    // 現在の金型数から必要金型数までの金型を手配
    const additionalMoldsNeeded = Math.max(0, totalRequiredMolds - currentMoldCount);
    
    for (let i = 0; i < additionalMoldsNeeded; i++) {
        // 次の金型の手配推奨日は前の金型の生産終了日からリードタイムを引いた日にする
        const orderDate = new Date(today);
        orderDate.setMonth(orderDate.getMonth() + startMoldLifeMonths);
        orderDate.setDate(orderDate.getDate() - leadTime);
        
        // 生産終了日を計算（金型寿命を考慮）
        let remainingLife = maxProductionPerMold;
        let lifeEndMonths = 0;
        let productionStartMonth = startMoldLifeMonths;
        
        // 前の金型の生産終了月から開始
        for (let j = startMoldLifeMonths; j < monthlyPlan.length; j++) {
            if (remainingLife <= 0) break;
            const monthlyProduction = monthlyPlan[j];
            if (monthlyProduction > 0) {
                lifeEndMonths++;
                remainingLife -= monthlyProduction;
            }
        }
        
        // 生産終了日を計算（リードタイムと金型寿命を考慮）
        const endDate = new Date(orderDate);
        endDate.setDate(endDate.getDate() + leadTime);
        endDate.setMonth(endDate.getMonth() + lifeEndMonths);
        
        // 1番型の生産終了日より前の日付にならないように調整
        if (endDate < startMoldEndDate) {
            endDate.setTime(startMoldEndDate.getTime());
        }
        
        orders.push({
            moldNumber: nextMoldNumber,
            orderDate: orderDate,
            leadTime: leadTime,
            lifeEndMonth: lifeEndMonths,
            monthIndex: productionStartMonth,
            endDate: endDate
        });
        
        nextMoldNumber++;
        startMoldLifeMonths += lifeEndMonths;
    }
    
    return orders;
}

// 予測結果の表示
function displayPredictionResults(prediction) {
    const resultsDiv = document.getElementById('prediction-results');
    if (!resultsDiv) return;

    let html = '<h3>予測結果</h3>';
    
    // 月別必要金型数
    html += '<div class="result-item">';
    html += '<h4>月別必要金型数</h4>';
    prediction.monthlyMolds.forEach((molds, index) => {
        html += `<p class="result-detail">${index + 1}ヶ月目: ${molds}個</p>`;
    });
    html += '</div>';
    
    // 金型手配計画を表示
    html += `
        <div class="result-section">
            <h3>金型手配計画</h3>
            <style>
                .result-detail.alert {
                    background-color: #fff3cd;
                    border: 2px solid #ffc107;
                    color: #856404;
                    font-weight: bold;
                    padding: 10px;
                    margin: 5px 0;
                    border-radius: 5px;
                }
                .result-detail.alert::before {
                    content: "⚠️";
                    margin-right: 5px;
                }
                .email-button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 5px;
                    font-size: 12px;
                }
                .email-button:hover {
                    background-color: #0056b3;
                }
            </style>
    `;

    // 現在使用中の金型のデータを追加
    const currentMolds = [];
    for (let i = 1; i <= prediction.currentMoldCount; i++) {
        const remainingLife = prediction.moldLifeShots * prediction.cavityCount;
        let months = 0;
        let totalProduction = 0;
        
        // 月ごとの生産計画に基づいて金型寿命を計算
        for (let j = 0; j < prediction.monthlyPlan.length; j++) {
            if (totalProduction >= remainingLife) break;
            const monthlyProduction = prediction.monthlyPlan[j];
            if (monthlyProduction > 0) {
                months++;
                totalProduction += monthlyProduction;
            }
        }
        
        currentMolds.push({
            moldNumber: i,
            orderDate: new Date(),
            leadTime: 0,
            lifeEndMonth: months,
            endDate: (() => {
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + months);
                return endDate;
            })()
        });
    }

    // 予測開始金型の情報を表示
    html += `
        <div class="result-detail">
            ${prediction.startMoldNumber}番型
            <br>現在使用中
            <br>生産終了予定: ${(() => {
                const endDate = new Date();
                let remainingLife = prediction.moldLifeShots * prediction.cavityCount;
                let months = 0;
                
                // 月ごとの生産計画に基づいて生産終了日を計算
                for (let i = 0; i < prediction.monthlyPlan.length; i++) {
                    if (remainingLife <= 0) break;
                    const monthlyProduction = prediction.monthlyPlan[i];
                    if (monthlyProduction > 0) {
                        months++;
                        remainingLife -= monthlyProduction;
                    }
                }
                
                endDate.setMonth(endDate.getMonth() + months);
                return endDate.toLocaleDateString('ja-JP');
            })()}
        </div>
    `;

    // 金型手配計画を表示（prediction.moldOrdersを使用）
    prediction.moldOrders.forEach(order => {
        const isUrgent = order.orderDate < new Date();
        const leadTime = prediction.leadTime;
        const lifeEndMonth = Math.ceil(prediction.moldLifeShots * prediction.cavityCount / prediction.monthlyPlan[order.monthIndex]);
        const endDate = new Date(order.endDate);
        endDate.setDate(endDate.getDate() + leadTime + lifeEndMonth * 30);
        
        // 180日前の日付を計算
        const warningDate = new Date(order.orderDate);
        warningDate.setDate(warningDate.getDate() - 180);
        const isWarning = new Date() >= warningDate;
        
        html += `
            <div class="result-detail ${isUrgent ? 'warning' : ''} ${isWarning ? 'alert' : ''}">
                ${order.moldNumber}番型
                <br>手配推奨日: ${order.orderDate.toLocaleDateString('ja-JP')}
                <br>必要時期: ${leadTime}日後
                <br>生産終了予定: ${endDate.toLocaleDateString('ja-JP')}
                ${isUrgent ? '<br>※至急手配が必要です' : ''}
                ${isWarning ? '<br>⚠️ 手配推奨日から180日を切っています。金型枠取りを開始してください' : ''}
                ${isWarning ? `<br><button class="email-button" onclick="sendMoldOrderEmail(${order.moldNumber}, '${order.orderDate.toLocaleDateString('ja-JP')}', '${endDate.toLocaleDateString('ja-JP')}')">担当者へメール送信</button>` : ''}
            </div>
        `;
    });

    html += '</div>';
    
    // 生産計画情報
    html += '<div class="result-item">';
    html += '<h4>生産計画情報</h4>';
    
    // 月別生産計画の表示
    html += '<h5>月別生産計画</h5>';
    prediction.monthlyPlan.forEach((quantity, index) => {
        const isOverCapacity = quantity > prediction.monthlyCapacity;
        const requiredMolds = Math.ceil(quantity / (prediction.moldLifeShots * prediction.cavityCount * (prediction.yieldRate / 100)));
        const requiredDays = Math.ceil(quantity / prediction.dailyCapacity);
        
        html += `<div class="result-detail ${isOverCapacity ? 'warning' : ''}">`;
        html += `${index + 1}ヶ月目: ${quantity.toLocaleString()}個`;
        if (isOverCapacity) {
            html += `<br>※月間生産能力(${prediction.monthlyCapacity.toLocaleString()}個)を超えています`;
        }
        html += `<br>必要金型数: ${requiredMolds}個`;
        html += `<br>必要稼働日数: ${requiredDays}日`;
        html += '</div>';
    });
    
    // 総合情報
    html += '<div class="result-item">';
    html += '<h4>総合情報</h4>';
    
    // 総生産数を計算
    const totalProduction = prediction.monthlyPlan.reduce((sum, quantity) => sum + quantity, 0);

    // 1金型あたりの最大生産可能数（金型寿命）を計算
    const maxProductionPerMold = prediction.moldLifeShots * prediction.cavityCount;

    // 必要金型数を計算（総生産数/1金型あたりの最大生産可能数）
    const totalMolds = Math.ceil(totalProduction / maxProductionPerMold);

    // 1金型あたりの平均生産数を計算
    const averageProductionPerMold = Math.floor(totalProduction / totalMolds);

    // 総必要稼働日数を計算
    const totalRequiredDays = Math.ceil(totalProduction / prediction.dailyCapacity);

    // 総必要月数を計算
    const totalRequiredMonths = Math.ceil(totalRequiredDays / prediction.workingDays);

    html += `<p class="result-detail highlight">総生産数: ${totalProduction.toLocaleString()}個</p>`;
    html += `<p class="result-detail highlight">必要金型数: ${totalMolds}個</p>`;
    html += `<p class="result-detail highlight">1金型あたりの平均生産数: ${averageProductionPerMold.toLocaleString()}個</p>`;
    html += `<p class="result-detail highlight">総必要稼働日数: ${totalRequiredDays}日</p>`;
    html += `<p class="result-detail highlight">総必要月数: ${totalRequiredMonths}ヶ月</p>`;
    
    // 生産能力情報
    html += '<div class="result-item">';
    html += '<h4>生産能力情報</h4>';
    html += `<p class="result-detail">1日あたりの最大生産可能数: ${prediction.dailyCapacity.toLocaleString()}個</p>`;
    html += `<p class="result-detail">1ヶ月あたりの最大生産可能数: ${prediction.monthlyCapacity.toLocaleString()}個</p>`;
    html += `<p class="result-detail">総生産能力（${prediction.monthlyPlan.length}ヶ月）: ${(prediction.monthlyCapacity * prediction.monthlyPlan.length).toLocaleString()}個</p>`;
    html += `<p class="result-detail">キャビティ数: ${prediction.cavityCount.toLocaleString()}個</p>`;
    html += `<p class="result-detail">金型サイクル秒数: ${prediction.cycleTime}秒</p>`;
    html += `<p class="result-detail">1日あたりの稼働時間: ${prediction.workingHours}時間</p>`;
    html += `<p class="result-detail">金型稼働日数: ${prediction.workingDays}日</p>`;
    html += `<p class="result-detail">金型寿命ショット数: ${prediction.moldLifeShots.toLocaleString()}ショット</p>`;
    html += `<p class="result-detail">良品率: ${prediction.yieldRate.toLocaleString()}%</p>`;
    html += `<p class="result-detail">1金型あたりの最大生産可能数（金型寿命）: ${prediction.maxProductionPerMold.toLocaleString()}個</p>`;
    html += '</div>';

    // グラフ表示用のキャンバス
    html += '<div class="result-item">';
    html += '<h4>生産計画と金型寿命のグラフ</h4>';
    html += '<canvas id="productionChart"></canvas>';
    html += '</div>';

    // 金型手配時期のグラフ
    html += '<div class="result-item">';
    html += '<h4>金型手配時期とリードタイム</h4>';
    html += '<canvas id="moldOrderChart"></canvas>';
    html += '</div>';

    resultsDiv.innerHTML = html;
    resultsDiv.classList.add('show');

    // グラフの描画
    drawProductionChart(prediction);
    drawMoldOrderChart(prediction);
}

// グラフの描画
function drawProductionChart(prediction) {
    const ctx = document.getElementById('productionChart');
    if (!ctx) return;

    // 累計生産台数の計算
    let cumulativeProduction = [0];
    prediction.monthlyPlan.forEach((monthlyQty, i) => {
        cumulativeProduction.push(cumulativeProduction[i] + monthlyQty);
    });

    // 金型寿命ラインの計算（キャビティ数を考慮）
    const moldLifeLimit = prediction.moldLifeShots * prediction.cavityCount;
    const moldLifeLines = [];
    
    // 各金型の寿命ラインを計算
    let currentMoldProduction = 0;
    let activeMoldIndex = 0;

    const productionData = Array(25).fill(null).map((_, monthIndex) => {
        const production = monthIndex === 0 ? 0 : cumulativeProduction[monthIndex];
        
        // 現在の金型の残りの生産可能数
        const remainingCapacity = moldLifeLimit - (currentMoldProduction % moldLifeLimit);
        
        if (production > currentMoldProduction + remainingCapacity) {
            // 金型を切り替え
            currentMoldProduction += remainingCapacity;
            activeMoldIndex++;
        }
        
        return {
            monthIndex,
            production,
            activeMoldIndex,
            currentMoldProduction
        };
    });

    // 金型ごとの生産期間を計算
    for (let i = 0; i < prediction.currentMoldCount; i++) {
        const moldData = productionData.map(data => {
            if (data.activeMoldIndex === i) {
                return moldLifeLimit * (i + 1);
            } else if (data.activeMoldIndex < i) {
                return moldLifeLimit * (i + 1);
            }
            return null;
        });
        
        if (moldData.some(value => value !== null)) {
            moldLifeLines.push({
                label: `${i + 1}番型寿命`,
                data: moldData,
                borderColor: `hsl(${i * 30}, 70%, 50%)`,
                borderDash: [5, 5],
                fill: false,
                hidden: false
            });
        }
    }

    // 手配必要時期のマーカー用データ
    const orderMarkers = prediction.moldOrders.map(order => {
        const baseLimit = moldLifeLimit * (order.moldNumber - 1);
        // 累計生産台数が金型寿命を超えていない場合のみマーカーを表示
        if (cumulativeProduction[order.monthIndex + 1] <= baseLimit) {
            return {
                label: `${order.moldNumber}番型手配`,
                data: Array(25).fill(null).map((_, i) => 
                    i === order.monthIndex ? baseLimit : null
                ),
                borderColor: `hsl(${(order.moldNumber - 1) * 30}, 70%, 50%)`,
                backgroundColor: `hsl(${(order.moldNumber - 1) * 30}, 70%, 50%)`,
                pointStyle: 'triangle',
                pointRadius: 10,
                showLine: false,
                hidden: false
            };
        }
        return null;
    }).filter(marker => marker !== null);

    // 月ごとの必要金型数を計算
    const requiredMolds = prediction.monthlyPlan.map(monthlyQty => {
        return Math.ceil(monthlyQty / (prediction.moldLifeShots * prediction.cavityCount));
    });

    // 重複を除去したデータセットを作成
    const uniqueDatasets = [];
    const seenLabels = new Set();

    // 月産数量（棒グラフ）
    uniqueDatasets.push({
        label: '月産数量',
        data: prediction.monthlyPlan,
        type: 'bar',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y1'
    });

    // 必要金型数（棒グラフ）
    uniqueDatasets.push({
        label: '必要金型数',
        data: requiredMolds,
        type: 'bar',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        yAxisID: 'y2'
    });

    // 累計生産台数
    uniqueDatasets.push({
        label: '累計生産台数',
        data: cumulativeProduction,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: true,
        tension: 0.4,
        hidden: false,
        yAxisID: 'y'
    });

    // 金型寿命ライン
    moldLifeLines.forEach(line => {
        if (!seenLabels.has(line.label)) {
            seenLabels.add(line.label);
            uniqueDatasets.push({
                ...line,
                yAxisID: 'y'
            });
        }
    });

    // 手配マーカー
    orderMarkers.forEach(marker => {
        if (!seenLabels.has(marker.label)) {
            seenLabels.add(marker.label);
            uniqueDatasets.push({
                ...marker,
                yAxisID: 'y'
            });
        }
    });

    // グラフの描画
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(25).fill(null).map((_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() + i);
                return date;
            }),
            datasets: uniqueDatasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '生産計画と金型寿命の推移（24ヶ月）'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            if (label.includes('寿命')) {
                                return `${label}: ${value.toLocaleString()}個（最大生産可能数）`;
                            } else if (label.includes('手配')) {
                                return `${label}: ${value.toLocaleString()}個（手配必要時期）`;
                            } else if (label === '月産数量') {
                                return `${label}: ${value.toLocaleString()}個`;
                            } else if (label === '必要金型数') {
                                return `${label}: ${value}個`;
                            } else {
                                return `${label}: ${value.toLocaleString()}個`;
                            }
                        }
                    }
                },
                legend: {
                    labels: {
                        usePointStyle: true,
                        pointStyle: function(context) {
                            const label = context.dataset ? context.dataset.label : '';
                            if (label === '月産数量' || label === '必要金型数') {
                                return 'rect';
                            }
                            return label.includes('手配') ? 'triangle' : 'line';
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        displayFormats: {
                            month: 'yyyy/MM'
                        }
                    },
                    title: {
                        display: true,
                        text: '日付'
                    },
                    ticks: {
                        minRotation: 45,
                        maxRotation: 45
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: true
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '累計生産台数'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '月産数量'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                },
                y2: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '必要金型数'
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    offset: true
                }
            }
        }
    });
}

// 金型手配時期のグラフを描画
function drawMoldOrderChart(prediction) {
    const ctx = document.getElementById('moldOrderChart');
    if (!ctx) return;

    // 現在の日付を取得
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 24ヶ月後の日付を計算
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 24);

    // 現在使用中の金型のデータを追加
    const currentMolds = [];
    for (let i = 1; i <= prediction.currentMoldCount; i++) {
        const remainingLife = prediction.moldLifeShots * prediction.cavityCount;
        let months = 0;
        let totalProduction = 0;
        
        // 月ごとの生産計画に基づいて金型寿命を計算
        for (let j = 0; j < prediction.monthlyPlan.length; j++) {
            if (totalProduction >= remainingLife) break;
            const monthlyProduction = prediction.monthlyPlan[j];
            if (monthlyProduction > 0) {
                months++;
                totalProduction += monthlyProduction;
            }
        }
        
        currentMolds.push({
            moldNumber: i,
            orderDate: today,
            leadTime: 0,
            lifeEndMonth: months,
            endDate: (() => {
                const endDate = new Date(today);
                endDate.setMonth(endDate.getMonth() + months);
                return endDate;
            })()
        });
    }

    // 各金型のデータを1つのデータセットにまとめる
    const moldData = currentMolds;

    // prediction.moldOrdersを使用してデータを構築
    prediction.moldOrders.forEach(order => {
        // 180日前の日付を計算
        const warningDate = new Date(order.orderDate);
        warningDate.setDate(warningDate.getDate() - 180);
        const isWarning = new Date() >= warningDate;

        // 予測開始金型番号以上の金型のみを追加
        if (order.moldNumber >= prediction.startMoldNumber) {
            const endDate = new Date(order.endDate);
            
            // 1番型の生産終了日より前の日付にならないように調整
            if (endDate < currentMolds[0].endDate) {
                endDate.setTime(currentMolds[0].endDate.getTime());
            }
            
            moldData.push({
                moldNumber: order.moldNumber,
                orderDate: order.orderDate,
                leadTime: order.leadTime,
                lifeEndMonth: order.lifeEndMonth,
                isWarning: isWarning,
                endDate: endDate
            });
        }
    });

    // データセットの作成
    const datasets = [
        {
            label: 'リードタイム期間',
            data: moldData.map(data => ({
                x: [data.orderDate.getTime(), new Date(data.orderDate.getTime() + data.leadTime * 24 * 60 * 60 * 1000).getTime()],
                y: data.moldNumber
            })),
            backgroundColor: moldData.map(data => data.isWarning ? 'rgba(255, 193, 7, 0.4)' : 'rgba(54, 162, 235, 0.4)'),
            borderColor: moldData.map(data => data.isWarning ? 'rgba(255, 193, 7, 0.4)' : 'rgba(54, 162, 235, 0.4)'),
            borderWidth: 20,
            type: 'bar'
        },
        {
            label: '金型手配計画の手配推奨日',
            data: moldData.map(data => ({
                x: data.orderDate.getTime(),
                y: data.moldNumber
            })),
            backgroundColor: moldData.map(data => data.isWarning ? 'rgba(255, 193, 7, 0.7)' : 'rgba(54, 162, 235, 0.7)'),
            borderColor: moldData.map(data => data.isWarning ? 'rgb(255, 193, 7)' : 'rgb(54, 162, 235)'),
            pointStyle: 'triangle',
            pointRadius: 10,
            type: 'scatter'
        },
        {
            label: '金型生産可能期間',
            data: moldData.map(data => {
                const startDate = new Date(data.orderDate);
                startDate.setDate(startDate.getDate() + data.leadTime);
                return {
                    x: [startDate.getTime(), data.endDate.getTime()],
                    y: data.moldNumber
                };
            }),
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 20,
            type: 'bar'
        },
        {
            label: '生産終了時期',
            data: moldData.map(data => ({
                x: data.endDate.getTime(),
                y: data.moldNumber
            })),
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgb(255, 99, 132)',
            pointStyle: 'rect',
            pointRadius: 10,
            type: 'scatter'
        }
    ];

    // 手配推奨日の最小値を取得
    const minOrderDate = Math.min(...moldData.map(data => data.orderDate.getTime()));

    // グラフの描画
    new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: datasets
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '金型手配時期とリードタイム（24ヶ月）'
                },
                tooltip: {
                    mode: 'nearest',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const data = moldData[context.dataIndex];
                            
                            if (!data) return label;
                            
                            if (label === '金型手配計画の手配推奨日') {
                                if (data.moldNumber === prediction.startMoldNumber) {
                                    return `${data.moldNumber}番型: 現在使用中`;
                                }
                                return `${data.moldNumber}番型: ${data.orderDate.toLocaleDateString('ja-JP')}に手配推奨`;
                            } else if (label === 'リードタイム期間') {
                                if (data.moldNumber === prediction.startMoldNumber) {
                                    return `${data.moldNumber}番型: 既に納入済み`;
                                }
                                const endDate = new Date(data.orderDate);
                                endDate.setDate(endDate.getDate() + data.leadTime);
                                return `${data.moldNumber}番型: リードタイム${data.leadTime}日`;
                            } else if (label === '金型生産可能期間') {
                                const startDate = new Date(data.orderDate);
                                startDate.setDate(startDate.getDate() + data.leadTime);
                                const endDate = new Date(startDate);
                                endDate.setDate(endDate.getDate() + data.lifeEndMonth * 30);
                                return `${data.moldNumber}番型: ${startDate.toLocaleDateString('ja-JP')}から${endDate.toLocaleDateString('ja-JP')}まで`;
                            } else if (label === '生産終了時期') {
                                const endDate = new Date(data.orderDate);
                                endDate.setDate(endDate.getDate() + data.leadTime + data.lifeEndMonth * 30);
                                return `${data.moldNumber}番型: ${endDate.toLocaleDateString('ja-JP')}に生産終了`;
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'rect'
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        displayFormats: {
                            month: 'yyyy/MM'
                        }
                    },
                    title: {
                        display: true,
                        text: '日付'
                    },
                    ticks: {
                        minRotation: 45,
                        maxRotation: 45
                    },
                    min: minOrderDate,
                    max: maxDate.getTime(),
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: true
                    }
                },
                y: {
                    type: 'category',
                    labels: moldData.map(data => `${data.moldNumber}番型`),
                    offset: true,
                    ticks: {
                        autoSkip: false
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: true
                    }
                }
            }
        }
    });
}

// エラーメッセージの表示
function displayError(message) {
    const resultsDiv = document.getElementById('prediction-results');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
    resultsDiv.classList.add('show');
}

// メール送信機能の追加
function sendMoldOrderEmail(moldNumber, orderDate, endDate) {
    // メール送信用のモーダルを作成
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        width: 400px;
        max-width: 90%;
    `;

    modalContent.innerHTML = `
        <h3>メール送信</h3>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">宛先メールアドレス:</label>
            <input type="email" id="emailTo" style="width: 100%; padding: 5px;" required>
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">CC:</label>
            <input type="email" id="emailCc" style="width: 100%; padding: 5px;">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">件名:</label>
            <input type="text" id="emailSubject" value="金型手配の緊急通知（${moldNumber}番型）" style="width: 100%; padding: 5px;" readonly>
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">本文:</label>
            <textarea id="emailBody" style="width: 100%; height: 150px; padding: 5px;" readonly>金型手配の緊急通知

金型番号: ${moldNumber}番型
手配推奨日: ${orderDate}
生産終了予定: ${endDate}

手配推奨日から180日を切っています。
金型枠取りを開始してください。

このメールは金型手配予測システムから自動送信されています。</textarea>
        </div>
        <div style="text-align: right;">
            <button onclick="closeEmailModal()" style="margin-right: 10px; padding: 5px 10px;">キャンセル</button>
            <button onclick="submitEmail()" style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px;">送信</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // モーダルを閉じる関数
    window.closeEmailModal = function() {
        document.body.removeChild(modal);
    };

    // メール送信関数
    window.submitEmail = function() {
        const to = document.getElementById('emailTo').value;
        const cc = document.getElementById('emailCc').value;
        const subject = document.getElementById('emailSubject').value;
        const body = document.getElementById('emailBody').value;

        if (!to) {
            alert('宛先メールアドレスを入力してください。');
            return;
        }

        const mailtoLink = `mailto:${to}${cc ? `?cc=${cc}` : ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
        closeEmailModal();
    };
}

// データ保存関数
window.saveData = function() {
    const fileName = document.getElementById('fileName').value;
    
    if (!fileName) {
        alert('ファイル名を入力してください。');
        return;
    }

    try {
        // フォームデータを取得
        const formData = new FormData(predictionForm);
        const formDataObj = {};
        for (let [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }

        // 予測結果を取得
        const predictionResults = document.getElementById('prediction-results').innerHTML;

        // 保存するデータを準備
        const saveData = {
            formData: formDataObj,
            predictionResults: predictionResults,
            timestamp: new Date().toISOString()
        };

        // データをJSON形式に変換
        const jsonData = JSON.stringify(saveData, null, 2);
        
        // Blobを作成
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        // ダウンロードリンクを作成
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${fileName}.json`;
        
        // ダウンロードを実行
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // モーダルを閉じる
        closeSaveModal();
        
        alert('データの保存が完了しました。');
    } catch (error) {
        console.error('データの保存中にエラーが発生しました:', error);
        alert('データの保存中にエラーが発生しました。');
    }
}; 