module.exports = (model, input) => {
    let counter = 0, trades = 0, value = 10000;
    const account = { btc: 0, usd: value, fee: 0.005 };
    const last = input[input.length - 1].price;
    const first = input[0].price;
    const exchange = (type, price) => {
        if (type === "buy" && account.usd > 0) {
            account.btc = (account.usd / price) * (1 - account.fee);
            account.usd = 0;
            trades++;
        } else if (type === "sell" && account.btc > 0) {
            account.usd = (account.btc * price) * (1 - account.fee);
            account.btc = 0;
            trades++;
        }
    };
    input.map((item, index) => {
        if (input[index + 1]) {
            const result = model.run(item.input);
            const next = input[index + 1].price;
            if (result[0] > 0.5) {
                exchange("buy", item.price);
                if (next > item.price) counter++;
            } else if (result[0] < 0.5) {
                exchange("sell", item.price);
                if (next < item.price) counter++;
            }
        } else {
            exchange("sell", item.price);
        }
    });
    return {
        balance: parseFloat(((account.usd - value) - (last - first)).toFixed(2)),
        score: parseFloat((counter / (input.length - 1)).toFixed(5)),
        size: input.length,
        trades: trades
    };
};
