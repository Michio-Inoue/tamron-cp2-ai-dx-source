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
        predictionForm.addEventListener('submit', handleFormSubmit);
    }
});

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

// 金型手配必要数と時期の計算
function calculateMoldRequirements(data) {
    // 1日あたりの生産可能数（キャビティ数考慮）
    const dailyCapacity = calculateDailyCapacity(data.cavityCount);
    
    // 月ごとの必要金型数を計算
    const monthlyMolds = data.monthlyPlan.map(monthlyQuantity => {
        const shotsPerMonth = Math.ceil(monthlyQuantity / data.cavityCount);
        return Math.ceil(shotsPerMonth / data.moldLifeShots);
    });
    
    // 累積必要金型数を計算
    const cumulativeMolds = calculateCumulativeMolds(monthlyMolds);
    
    // 金型番号ごとの手配必要時期を計算
    const moldOrders = calculateMoldOrders(cumulativeMolds, data.currentMoldCount, data.leadTime, data.safetyStock);
    
    return {
        monthlyMolds,
        cumulativeMolds,
        moldOrders,
        dailyCapacity,
        moldLifeShots: data.moldLifeShots,
        cavityCount: data.cavityCount,
        leadTime: data.leadTime,
        safetyStock: data.safetyStock,
        monthlyPlan: data.monthlyPlan
    };
}

// 1日あたりの生産可能数を計算
function calculateDailyCapacity(cavityCount) {
    const shotsPerHour = 60; // 仮定：1時間あたり60ショット
    const workingHours = 20; // 仮定：1日20時間稼働
    return shotsPerHour * workingHours * cavityCount;
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
function calculateMoldOrders(cumulativeMolds, currentMoldCount, leadTime, safetyStock) {
    const today = new Date();
    const orders = [];
    
    cumulativeMolds.forEach((molds, monthIndex) => {
        if (molds > currentMoldCount) {
            const additionalMolds = molds - currentMoldCount;
            for (let i = 0; i < additionalMolds; i++) {
                const orderDate = new Date(today);
                // 月初めから逆算して手配日を設定
                orderDate.setMonth(today.getMonth() + monthIndex);
                orderDate.setDate(1);
                // リードタイムと安全在庫日数を考慮
                orderDate.setDate(orderDate.getDate() - (leadTime + safetyStock));
                
                orders.push({
                    moldNumber: currentMoldCount + i + 1,
                    orderDate: orderDate,
                    monthIndex: monthIndex
                });
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
        html += `
            <div class="result-detail ${isUrgent ? 'warning' : ''}">
                ${order.moldNumber}番型
                <br>手配推奨日: ${order.orderDate.toLocaleDateString('ja-JP')}
                <br>必要時期: ${order.monthIndex + 1}ヶ月目
                ${isUrgent ? '<br>※至急手配が必要です' : ''}
            </div>`;
    });
    html += '</div>';
    
    // 生産能力情報
    html += '<div class="result-item">';
    html += '<h4>生産能力情報</h4>';
    html += `<p class="result-detail">1日あたりの最大生産可能数: ${prediction.dailyCapacity.toLocaleString()}個</p>`;
    html += `<p class="result-detail">1金型あたりの最大生産可能数: ${(prediction.moldLifeShots * prediction.cavityCount).toLocaleString()}個</p>`;
    html += '</div>';

    // グラフ表示用のキャンバス
    html += '<div class="result-item">';
    html += '<h4>生産計画と金型寿命のグラフ</h4>';
    html += '<canvas id="productionChart"></canvas>';
    html += '</div>';

    resultsDiv.innerHTML = html;
    resultsDiv.classList.add('show');

    // グラフの描画
    drawProductionChart(prediction);
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
    for (let i = 0; i < prediction.currentMoldCount; i++) {
        moldLifeLines.push({
            label: `${i + 1}番型寿命`,
            data: Array(7).fill(moldLifeLimit * (i + 1)),
            borderColor: `hsl(${i * 30}, 70%, 50%)`,
            borderDash: [5, 5],
            fill: false
        });
    }

    // 手配必要時期のマーカー用データ
    const orderMarkers = prediction.moldOrders.map(order => ({
        label: `${order.moldNumber}番型手配`,
        data: Array(7).fill(null).map((_, i) => 
            i === order.monthIndex ? moldLifeLimit * (order.moldNumber - 1) : null
        ),
        borderColor: `hsl(${(order.moldNumber - 1) * 30}, 70%, 50%)`,
        backgroundColor: `hsl(${(order.moldNumber - 1) * 30}, 70%, 50%)`,
        pointStyle: 'triangle',
        pointRadius: 10,
        showLine: false
    }));

    // グラフの描画
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['現在', '1ヶ月目', '2ヶ月目', '3ヶ月目', '4ヶ月目', '5ヶ月目', '6ヶ月目'],
            datasets: [
                {
                    label: '累計生産台数',
                    data: cumulativeProduction,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                ...moldLifeLines,
                ...orderMarkers
            ]
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
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '生産台数'
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