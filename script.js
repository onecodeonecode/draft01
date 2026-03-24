const API_KEY = 'd70pii1r01ql6rg06cr0d70pii1r01ql6rg06crg'; // Replace with your Finnhub key
const STOCKS_TO_WATCH = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META', 'AMD'];

async function fetchStockData(symbol) {
    try {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
        const data = await response.json();
        return {
            symbol,
            current: data.c,
            pc: data.pc, // Previous close
            change: ((data.c - data.pc) / data.pc * 100).toFixed(2)
        };
    } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        return null;
    }
}

async function updateDashboard() {
    const list = document.getElementById('stock-list');
    const promises = STOCKS_TO_WATCH.map(s => fetchStockData(s));
    const results = await Promise.all(promises);

    // Filter out errors and sort by best performance (highest % change)
    const sortedStocks = results
        .filter(s => s !== null)
        .sort((a, b) => b.change - a.change);

    list.innerHTML = '';

    sortedStocks.forEach(stock => {
        const isPositive = stock.change >= 0;
        const card = document.createElement('div');
        card.className = 'stock-card';
        card.innerHTML = `
            <div>
                <span class="symbol">${stock.symbol}</span>
                <span class="name">Market Order</span>
            </div>
            <div class="price-box">
                <div class="price">$${stock.current.toFixed(2)}</div>
                <div class="change ${isPositive ? 'positive' : 'negative'}">
                    ${isPositive ? '▲' : '▼'} ${Math.abs(stock.change)}%
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

// Initial call
updateDashboard();

// Refresh every 60 seconds
setInterval(updateDashboard, 60000);