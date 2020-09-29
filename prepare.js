const _ = require("lodash");
const config = require("./config.json");
module.exports = data => {
    return data.map(symbols => {
        const result = {};
        config.dates && (result.date = symbols[symbols.length - 1]);
        for (const symbol of symbols) {
            if (symbol[0] === "tBTCUSD") {
                result.btc_bid = symbol[1];
                result.btc_bid_size = symbol[2];
                result.btc_ask = symbol[3];
                result.btc_ask_size = symbol[4];
                result.btc_daily_change = symbol[5];
                result.btc_daily_change_percent = symbol[6];
                result.btc_last_price = symbol[7];
                result.btc_volume = symbol[8];
                result.btc_high = symbol[9];
                result.btc_low = symbol[10];
            } else if (symbol[0] === "fUSD") {
                result.usd_frr = symbol[1];
                result.usd_bid = symbol[2];
                result.usd_bid_size = symbol[3];
                result.usd_bid_period = symbol[4];
                result.usd_ask = symbol[5];
                result.usd_ask_size = symbol[6];
                result.usd_ask_period = symbol[7];
                result.usd_daily_change = symbol[8];
                result.usd_daily_change_percent = symbol[9];
                result.usd_last_price = symbol[10];
                result.usd_volume = symbol[11];
                result.usd_high = symbol[12];
                result.usd_low = symbol[13];
            }
        }
        return result;
    }).map((item, index, array) => {
        if (![0, array.length - 1].includes(index)) {
            if (config.binary) {
                return {
                    input: _.mapValues(item, (value, key) => (typeof value === "string") ? (new Date(value)).getTime() : (array[index - 1][key] > value ? 0 : 1)),
                    output: [array[index + 1].btc_last_price > item.btc_last_price ? 1 : 0],
                    price: item.btc_last_price
                };
            } else {
                return {
                    input: _.mapValues(item, value => (typeof value === "string") ? (new Date(value)).getTime() : value.toFixed(20)),
                    output: array[index + 1].btc_last_price.toFixed(20),
                    price: item.btc_last_price
                };
            }
        }
    }).slice(1, -1);
};
