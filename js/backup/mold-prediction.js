// 金型寿命予測ロジック
function predictMoldLifetime(totalLifeShots, cavityCount, currentShots, monthlyProduction, leadTime, safetyStock) {
    // 残存可能ショット数
    const remainingShots = totalLifeShots - currentShots;
    const remainingProducts = remainingShots * cavityCount;
    
    // 月間生産計画からのショット数計算
    let accumulatedShots = currentShots;
    let accumulatedProducts = currentShots * cavityCount;
    let endOfLifeDate = null;
    const today = new Date();
    const monthlyDates = [];
    const monthlyAccumulatedShots = [];
    const monthlyAccumulatedProducts = [];
    const requiredMolds = []; // 各月の必要金型数を格納
    const activeMolds = []; // 各月の稼働中の金型番号を格納

    // 各月の1日を計算
    for (let i = 0; i < 6; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
        monthlyDates.push(date);
    }

    // 金型の状態を追跡する配列
    let moldLifeStatus = []; // 各金型の累積ショット数を追跡

    // 累積ショット数の計算と寿命到達月の特定
    for (let i = 0; i < monthlyProduction.length; i++) {
        // 必要なショット数を計算（製品数÷キャビティ数で切り上げ）
        const requiredShots = Math.ceil(monthlyProduction[i] / cavityCount);
        
        // 1つの金型の月間最大ショット数 = 総ショット数 / 6（6ヶ月使用想定）
        const monthlyMaxShots = Math.floor(totalLifeShots / 6);
        
        // 現在の月で必要な金型数を計算
        let moldsNeeded = Math.ceil(requiredShots / monthlyMaxShots);
        
        // 金型の寿命状態を更新
        if (i === 0) {
            // 初月は現在の累積ショット数から開始
            moldLifeStatus.push(currentShots);
            for (let j = 1; j < moldsNeeded; j++) {
                moldLifeStatus.push(0); // 新規金型は0から開始
            }
        } else {
            // 既存の金型の寿命をチェックし、必要に応じて新規金型を追加
            let activeShots = requiredShots;
            let activeMoldCount = 0;
            
            // 既存の金型を更新
            for (let j = 0; j < moldLifeStatus.length; j++) {
                if (moldLifeStatus[j] < totalLifeShots) {
                    const remainingCapacity = totalLifeShots - moldLifeStatus[j];
                    const shotsForThisMold = Math.min(monthlyMaxShots, remainingCapacity, activeShots);
                    moldLifeStatus[j] += shotsForThisMold;
                    activeShots -= shotsForThisMold;
                    if (moldLifeStatus[j] < totalLifeShots) {
                        activeMoldCount++;
                    }
                }

            }
            
            // 必要に応じて新規金型を追加
            while (activeShots > 0) {
                moldLifeStatus.push(Math.min(activeShots, monthlyMaxShots));
                activeShots -= monthlyMaxShots;
                activeMoldCount++;
            }
            
            moldsNeeded = activeMoldCount;
        }

        // 稼働中の金型番号を特定
        const activeMoldNumbers = moldLifeStatus
            .map((shots, index) => ({ shots, index: index + 1 }))
            .filter(mold => mold.shots < totalLifeShots)
            .map(mold => `${mold.index}番型`);

        activeMolds.push(activeMoldNumbers);
        requiredMolds.push(moldsNeeded);
        
        // 累積値の更新
        accumulatedShots += requiredShots;
        accumulatedProducts += monthlyProduction[i];
        monthlyAccumulatedShots.push(accumulatedShots);
        monthlyAccumulatedProducts.push(accumulatedProducts);
    }

    // 寿命到達日の計算（最初の金型）
    if (!endOfLifeDate && moldLifeStatus[0] >= totalLifeShots) {
        // 最初の金型が寿命に達した月を特定
        for (let i = 0; i < monthlyAccumulatedShots.length; i++) {
            if (monthlyAccumulatedShots[i] >= totalLifeShots) {
                const previousShots = i > 0 ? monthlyAccumulatedShots[i - 1] : currentShots;
                const shotsInMonth = monthlyAccumulatedShots[i] - previousShots;
                const remainingShotsInMonth = totalLifeShots - previousShots;
                const daysInMonth = new Date(today.getFullYear(), today.getMonth() + i + 1, 0).getDate();
                const daysUntilEnd = Math.ceil((remainingShotsInMonth / shotsInMonth) * daysInMonth);
                
                endOfLifeDate = new Date(today.getFullYear(), today.getMonth() + i, daysUntilEnd);
                break;
            }
        }
    }

    // 推奨発注日の計算
    const recommendedOrderDate = new Date(endOfLifeDate);
    recommendedOrderDate.setDate(recommendedOrderDate.getDate() - (leadTime + safetyStock));

    // 最大必要金型数を計算
    const maxRequiredMolds = Math.max(...requiredMolds);

    return {
        remainingShots,
        remainingProducts,
        endOfLifeDate,
        recommendedOrderDate,
        monthlyDates,
        monthlyAccumulatedShots,
        monthlyAccumulatedProducts,
        totalLifeShots,
        requiredMolds,
        maxRequiredMolds,
        activeMolds
    };
}

// グラフの初期化
let lifetimeChart = null;

// 数値のフォーマット関数
function formatNumber(value) {
    if (!value) return '';
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 数値入力フィールドのフォーマット処理
function setupNumberFormatting() {
    const numberInputs = [
        document.getElementById('totalLifeShots'),
        document.getElementById('currentShots'),
        document.getElementById('cavityCount'),
        ...Array.from(document.getElementsByClassName('monthly-production'))
    ];

    numberInputs.forEach(input => {
        // 入力時の処理
        input.addEventListener('input', function() {
            // 数値以外を除去
            let value = this.value.replace(/\D/g, '');
            
            // カンマを付けて表示
            if (value) {
                this.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        });

        // フォーカスが外れたときの処理
        input.addEventListener('blur', function() {
            if (!this.value) {
                // 金型耐久ショットと現在の累計ショット数は0にしない
                if (this.id !== 'totalLifeShots' && this.id !== 'currentShots') {
                    this.value = '0';
                }
            }
        });

        // Enterキーで次の入力欄に移動
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const inputs = Array.from(numberInputs);
                const currentIndex = inputs.indexOf(this);
                const nextInput = inputs[currentIndex + 1];
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
    });
}

// フォームの送信イベント処理
document.getElementById('moldForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const totalLifeShots = parseInt(document.getElementById('totalLifeShots').value.replace(/,/g, ''));
    const cavityCount = parseInt(document.getElementById('cavityCount').value.replace(/,/g, ''));
    const currentShots = parseInt(document.getElementById('currentShots').value.replace(/,/g, ''));
    const monthlyProduction = Array.from(document.getElementsByClassName('monthly-production'))
        .map(input => parseInt(input.value.replace(/,/g, '')));
    const leadTime = parseInt(document.getElementById('leadTime').value);
    const safetyStock = parseInt(document.getElementById('safetyStock').value);

    // 予測実行
    const prediction = predictMoldLifetime(totalLifeShots, cavityCount, currentShots, monthlyProduction, leadTime, safetyStock);

    // 結果の表示
    document.getElementById('endOfLife').textContent = prediction.endOfLifeDate.toLocaleDateString('ja-JP');
    document.getElementById('recommendedOrder').textContent = prediction.recommendedOrderDate.toLocaleDateString('ja-JP');
    document.getElementById('remainingLife').textContent = formatNumber(prediction.remainingShots.toString());
    document.getElementById('remainingProducts').textContent = formatNumber(prediction.remainingProducts.toString());

    // 必要金型数の表示
    const moldCountsElement = document.getElementById('moldCounts');
    if (moldCountsElement) {
        let moldCountsHtml = '<h3>月別必要金型数</h3><table class="mold-counts-table">';
        moldCountsHtml += '<tr><th>月</th><th>必要金型数</th><th>稼働金型</th></tr>';
        
        prediction.monthlyDates.forEach((date, index) => {
            const monthStr = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' });
            const moldCount = prediction.requiredMolds[index];
            const activeMoldList = prediction.activeMolds[index].join(', ');
            
            moldCountsHtml += `<tr>
                <td>${monthStr}</td>
                <td>${moldCount}個</td>
                <td>${activeMoldList}</td>
            </tr>`;
        });
        
        moldCountsHtml += '</table>';
        moldCountsHtml += `<p class="max-molds">最大必要金型数: ${prediction.maxRequiredMolds}個</p>`;
        moldCountsElement.innerHTML = moldCountsHtml;
    }

    // 結果セクションの表示
    document.querySelector('.prediction-results').style.display = 'block';

    // グラフの更新
    updateLifetimeChart(prediction);
});

// グラフの更新
function updateLifetimeChart(prediction) {
    const data = {
        labels: prediction.monthlyDates.map(date => 
            date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' })
        ),
        datasets: [
            {
                label: '累積ショット数',
                data: prediction.monthlyAccumulatedShots,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                yAxisID: 'y-shots'
            },
            {
                label: '耐久ショット数',
                data: Array(prediction.monthlyDates.length).fill(prediction.totalLifeShots),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderDash: [5, 5],
                fill: false,
                yAxisID: 'y-shots'
            },
            {
                label: '累積製品数',
                data: prediction.monthlyAccumulatedProducts,
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: true,
                yAxisID: 'y-products'
            }
        ]
    };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: '月'
                }
            },
            'y-shots': {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'ショット数'
                },
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return formatNumber(value.toString());
                    }
                }
            },
            'y-products': {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: '製品数'
                },
                beginAtZero: true,
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    callback: function(value) {
                        return formatNumber(value.toString());
                    }
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'ショット数・製品数予測'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        const label = context.dataset.label;
                        return `${label}: ${formatNumber(value.toString())} ${label.includes('製品') ? '個' : 'ショット'}`;
                    }
                }
            }
        }
    };

    if (lifetimeChart) {
        lifetimeChart.destroy();
    }

    const ctx = document.getElementById('lifetimeChart').getContext('2d');
    lifetimeChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// メンテナンス履歴のモックデータ
const mockMaintenanceHistory = [
    {
        date: '2024-03-15',
        work: '定期点検',
        result: '良好',
        nextRecommended: '2024-06-15'
    },
    {
        date: '2024-02-01',
        work: '寸法測定',
        result: '規格内',
        nextRecommended: '2024-05-01'
    },
    {
        date: '2024-01-10',
        work: 'ショット数確認',
        result: '累計450,000ショット',
        nextRecommended: '2024-04-10'
    }
];

// メンテナンス履歴の表示
function displayMaintenanceHistory() {
    const tbody = document.getElementById('maintenanceHistory');
    mockMaintenanceHistory.forEach(record => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(record.date).toLocaleDateString('ja-JP')}</td>
            <td>${record.work}</td>
            <td>${record.result}</td>
            <td>${new Date(record.nextRecommended).toLocaleDateString('ja-JP')}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    displayMaintenanceHistory();
    setupNumberFormatting();
}); 