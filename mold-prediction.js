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
        this.cavityCount = parseInt(formData.get('cavityCount')) || 1;
        this.cycleTime = parseInt(formData.get('cycleTime')) || 0;
        this.workingHours = parseInt(formData.get('workingHours')) || 20;
        this.workingDays = parseInt(formData.get('workingDays')) || 0;
        this.yieldRate = parseFloat(formData.get('yieldRate')) || 100;
        this.leadTime = parseInt(formData.get('leadTime')) || 30;
        this.safetyStock = parseInt(formData.get('safetyStock')) || 14;
        this.monthlyPlan = [
            parseInt(formData.get('month1')) || 0,
            parseInt(formData.get('month2')) || 0,
            parseInt(formData.get('month3')) || 0,
            parseInt(formData.get('month4')) || 0,
            parseInt(formData.get('month5')) || 0,
            parseInt(formData.get('month6')) || 0
        ];
    }
}

// フォーム送信時の処理
document.addEventListener('DOMContentLoaded', function() {
    const predictionForm = document.getElementById('prediction-form');
    if (predictionForm) {
        // 保存されたデータを復元
        restoreFormData(predictionForm);
        
        // フォーム送信時のイベントリスナーを設定
        predictionForm.addEventListener('submit', handleFormSubmit);
        
        // フォームの入力値が変更されたときにデータを保存
        predictionForm.addEventListener('input', function(event) {
            saveFormData(predictionForm);
        });

        // データクリアボタンのイベントリスナーを設定
        const clearButton = document.getElementById('clear-data');
        if (clearButton) {
            clearButton.addEventListener('click', function() {
                clearFormData(predictionForm);
            });
        }
    }
});

// フォームデータを保存
function saveFormData(form) {
    const formData = new FormData(form);
    const formDataObj = {};
    for (let [key, value] of formData.entries()) {
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
    
    // フォームデータの取得
    const formData = new FormData(event.target);
    const predictionData = new PredictionData(formData);

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
    const moldOrders = calculateMoldOrders(cumulativeMolds, data.currentMoldCount, data.leadTime, data.safetyStock, maxProductionPerMold, data.monthlyPlan);
    
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
        monthlyPlan: data.monthlyPlan
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
function calculateMoldOrders(cumulativeMolds, currentMoldCount, leadTime, safetyStock, maxProductionPerMold, monthlyPlan) {
    const today = new Date();
    const orders = [];
    let totalProduction = 0;
    let currentMoldNumber = currentMoldCount;
    
    // 月ごとの生産計画を累積
    const cumulativePlan = monthlyPlan.reduce((acc, curr) => {
        acc.push((acc[acc.length - 1] || 0) + curr);
        return acc;
    }, []);
    
    cumulativeMolds.forEach((molds, monthIndex) => {
        if (molds > currentMoldNumber) {
            // 現在の金型で生産可能な数量を計算
            const remainingProduction = maxProductionPerMold * currentMoldNumber;
            
            // 累積生産計画が現在の金型の生産可能数量を超える場合のみ新しい金型を手配
            if (cumulativePlan[monthIndex] > remainingProduction) {
                const additionalMolds = molds - currentMoldNumber;
                for (let i = 0; i < additionalMolds; i++) {
                    const orderDate = new Date(today);
                    // 月初めから逆算して手配日を設定
                    orderDate.setMonth(today.getMonth() + monthIndex);
                    orderDate.setDate(1);
                    // リードタイムと安全在庫日数を考慮
                    orderDate.setDate(orderDate.getDate() - (leadTime + safetyStock));
                    
                    orders.push({
                        moldNumber: currentMoldNumber + i + 1,
                        orderDate: orderDate,
                        monthIndex: monthIndex
                    });
                }
                currentMoldNumber = molds;
            }
        }
    });
    
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
    
    // 金型番号ごとの手配計画
    html += '<div class="result-item">';
    html += '<h4>金型手配計画</h4>';
    prediction.moldOrders.forEach(order => {
        const isUrgent = order.orderDate < new Date();
        const today = new Date();
        const lifeEndMonth = order.monthIndex + prediction.leadTime + Math.ceil(prediction.moldLifeShots * prediction.cavityCount / prediction.monthlyPlan[order.monthIndex]);
        const endDate = new Date(today);
        endDate.setMonth(today.getMonth() + Math.min(lifeEndMonth, prediction.monthlyPlan.length - 1));
        
        html += `
            <div class="result-detail ${isUrgent ? 'warning' : ''}">
                ${order.moldNumber}番型
                <br>手配推奨日: ${order.orderDate.toLocaleDateString('ja-JP')}
                <br>必要時期: ${order.monthIndex + 1}ヶ月目
                <br>生産終了予定: ${endDate.toLocaleDateString('ja-JP')}
                ${isUrgent ? '<br>※至急手配が必要です' : ''}
            </div>`;
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
    html += '<h5>総合情報</h5>';
    const totalProduction = prediction.monthlyPlan.reduce((sum, quantity) => sum + quantity, 0);
    const totalMolds = Math.max(...prediction.moldOrders.map(order => order.moldNumber));
    const totalRequiredDays = Math.ceil(totalProduction / prediction.dailyCapacity);
    const totalRequiredMonths = Math.ceil(totalRequiredDays / prediction.workingDays);
    const isOverCapacity = totalProduction > (prediction.monthlyCapacity * prediction.monthlyPlan.length);
    
    html += `<p class="result-detail highlight">総生産数: ${totalProduction.toLocaleString()}個</p>`;
    html += `<p class="result-detail highlight">必要金型数: ${totalMolds}個</p>`;
    html += `<p class="result-detail highlight">1金型あたりの平均生産数: ${Math.floor(totalProduction / totalMolds).toLocaleString()}個</p>`;
    html += `<p class="result-detail highlight">総必要稼働日数: ${totalRequiredDays}日</p>`;
    html += `<p class="result-detail highlight">総必要月数: ${totalRequiredMonths}ヶ月</p>`;
    
    if (isOverCapacity) {
        html += `<p class="result-detail warning">※総生産数が総生産能力(${(prediction.monthlyCapacity * prediction.monthlyPlan.length).toLocaleString()}個)を超えています</p>`;
    }
    
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

    const productionData = Array(7).fill(null).map((_, monthIndex) => {
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
                data: Array(7).fill(null).map((_, i) => 
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
            labels: ['現在', '1ヶ月目', '2ヶ月目', '3ヶ月目', '4ヶ月目', '5ヶ月目', '6ヶ月目'],
            datasets: uniqueDatasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '生産計画と金型寿命の推移'
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

    // 各金型のデータを1つのデータセットにまとめる
    const moldData = prediction.moldOrders.map(order => {
        const orderMonth = order.monthIndex;
        const leadTime = prediction.leadTime;
        const lifeEndMonth = orderMonth + leadTime + Math.ceil(prediction.moldLifeShots * prediction.cavityCount / prediction.monthlyPlan[order.monthIndex]);
        
        return {
            moldNumber: order.moldNumber,
            orderStartMonth: orderMonth,
            orderEndMonth: orderMonth + leadTime,
            lifeEndMonth: lifeEndMonth
        };
    });

    // 月産生産計画の期間を取得
    const planPeriod = prediction.monthlyPlan.length;

    // データセットの作成
    const datasets = [
        {
            label: '金型寿命期間',
            data: moldData.map(data => ({
                x: [data.orderStartMonth, Math.min(data.lifeEndMonth, planPeriod - 1)],
                y: data.moldNumber
            })),
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 20,
            type: 'bar'
        },
        {
            label: 'リードタイム期間',
            data: moldData.map(data => ({
                x: [data.orderStartMonth, Math.min(data.orderEndMonth, planPeriod - 1)],
                y: data.moldNumber
            })),
            backgroundColor: 'rgba(54, 162, 235, 0.4)',
            borderColor: 'rgba(54, 162, 235, 0.4)',
            borderWidth: 20,
            type: 'bar'
        },
        {
            label: '手配開始時期',
            data: moldData.map(data => ({
                x: data.orderStartMonth,
                y: data.moldNumber
            })),
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgb(54, 162, 235)',
            pointStyle: 'triangle',
            pointRadius: 10,
            type: 'scatter'
        },
        {
            label: '生産終了時期',
            data: moldData.map(data => ({
                x: Math.min(data.lifeEndMonth, planPeriod - 1),
                y: data.moldNumber
            })),
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgb(255, 99, 132)',
            pointStyle: 'rect',
            pointRadius: 10,
            type: 'scatter'
        }
    ];

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
                    text: '金型手配時期とリードタイム'
                },
                tooltip: {
                    mode: 'nearest',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const data = moldData[context.dataIndex];
                            
                            // 月数を日付に変換
                            const startDate = new Date(today);
                            startDate.setMonth(today.getMonth() + data.orderStartMonth);
                            
                            if (label === '手配開始時期') {
                                return `${data.moldNumber}番型: ${startDate.toLocaleDateString('ja-JP')}に手配開始`;
                            } else if (label === 'リードタイム期間') {
                                const endDate = new Date(startDate);
                                endDate.setMonth(endDate.getMonth() + prediction.leadTime);
                                const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
                                return `${data.moldNumber}番型: リードタイム${days}日`;
                            } else if (label === '金型寿命期間') {
                                const endDate = new Date(startDate);
                                endDate.setMonth(endDate.getMonth() + prediction.leadTime + Math.ceil(prediction.moldLifeShots * prediction.cavityCount / prediction.monthlyPlan[data.moldNumber - 1]));
                                const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
                                return `${data.moldNumber}番型: 金型寿命${days}日`;
                            } else if (label === '生産終了時期') {
                                const endDate = new Date(today);
                                endDate.setMonth(today.getMonth() + Math.min(data.lifeEndMonth, planPeriod - 1));
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
                    type: 'linear',
                    title: {
                        display: true,
                        text: '月数'
                    },
                    ticks: {
                        callback: function(value) {
                            const date = new Date(today);
                            date.setMonth(today.getMonth() + value);
                            return date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit' });
                        },
                        stepSize: 1,
                        minRotation: 45,
                        maxRotation: 45
                    },
                    min: 0,
                    max: planPeriod - 1,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: true
                    }
                },
                y: {
                    type: 'category',
                    labels: [...new Set(moldData.map(data => `${data.moldNumber}番型`))],
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