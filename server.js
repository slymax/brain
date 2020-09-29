const fs = require("fs");
const test = require("./test");
const brain = require("brain.js");
const prepare = require("./prepare");
const config = require("./config.json");
const data = require("./data.json");
require("console-stamp")(console);
const input = prepare(data);
if (config.automl) {
    console.log(Object.keys(input[0].input).join(",") + ",target");
    for (item of input) {
        console.log(Object.values(item.input).join(",") + "," + item.output);
    }
} else {
    const model = new brain.NeuralNetwork();
    const split = Math.floor(input.length * 0.8);
    const result = model.train(input.slice(0, split));
    const stats = test(model, input.slice(split));
    console.log({
        score: stats.score,
        trades: stats.trades,
        error: parseFloat(result.error.toFixed(5)),
        iterations: result.iterations,
        balance: stats.balance,
        size: stats.size
    });
    fs.writeFileSync("model.json", JSON.stringify(model.toJSON()), error => console.log(error));
}
