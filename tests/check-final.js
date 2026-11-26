const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = { console, setTimeout, setInterval, clearTimeout };
context.window = context;
context.self = context;
context.globalThis = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "vendor/skulpt.min.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "vendor/skulpt-stdlib.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "js/engine.js"), "utf8"), context);
const E = context.PyEngine;

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const grades = [
  "n = int(input())",
  "s = 0",
  "for i in range(n):",
  "    s = s + int(input())",
  "avg = round(s / n, 1)",
  "print(avg)",
  "if avg >= 4.5:",
  "    print(\"Отличник\")",
  "elif avg >= 3.5:",
  "    print(\"Хорошист\")",
  "else:",
  "    print(\"Нужно подтянуть\")"
].join("\n");

const biggest = [
  "n = int(input())",
  "best = int(input())",
  "for i in range(n - 1):",
  "    x = int(input())",
  "    if x > best:",
  "        best = x",
  "print(best)"
].join("\n");

const atm = [
  "amount = int(input())",
  "percent = int(input())",
  "if amount % 100 != 0:",
  "    print(\"Ошибка\")",
  "else:",
  "    total = amount + amount * percent // 100",
  "    print(total)",
  "    print(total // 500)",
  "    print(total % 500)"
].join("\n");

const game = [
  "secret = 7",
  "while True:",
  "    guess = int(input())",
  "    if guess == secret:",
  "        print(\"Угадал\")",
  "        break",
  "    elif guess < secret:",
  "        print(\"Больше\")",
  "    else:",
  "        print(\"Меньше\")"
].join("\n");

(async function () {
  const gradeResult = await E.runTests(grades, [
    { inputs: ["3", "5", "5", "4"], expectedLines: ["4.7", "Отличник"], numericMatch: true, ignoreCase: true },
    { inputs: ["2", "3", "4"], expectedLines: ["3.5", "Хорошист"], numericMatch: true, ignoreCase: true }
  ]);
  assert(gradeResult.ok, "grades " + JSON.stringify(gradeResult));

  const maxResult = await E.runTests(biggest, [
    { inputs: ["4", "3", "9", "2", "7"], expectedLines: ["9"] },
    { inputs: ["3", "-1", "-8", "-2"], expectedLines: ["-1"] }
  ]);
  assert(maxResult.ok, "max " + JSON.stringify(maxResult));

  const atmResult = await E.runTests(atm, [
    { inputs: ["1000", "10"], expectedLines: ["1100", "2", "100"], numericMatch: true },
    { inputs: ["2000", "0"], expectedLines: ["2000", "4", "0"], numericMatch: true }
  ]);
  assert(atmResult.ok, "atm " + JSON.stringify(atmResult));

  const gameResult = await E.runTests(game, [
    { inputs: ["3", "9", "7"], expectedLines: ["Больше", "Меньше", "Угадал"], ignoreCase: true },
    { inputs: ["7"], expectedLines: ["угадал"], ignoreCase: true }
  ]);
  assert(gameResult.ok, "game " + JSON.stringify(gameResult));
  console.log("final task checks passed");
})().catch(function (err) {
  console.error(err);
  process.exit(1);
});
