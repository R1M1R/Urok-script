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

const piggy = [
  "total = 0",
  "x = int(input())",
  "while x != 0:",
  "    total = total + x",
  "    x = int(input())",
  "print(total)"
].join("\n");

const table = [
  "k = int(input())",
  "for i in range(1, 6):",
  "    print(k, \"x\", i, \"=\", k * i)"
].join("\n");

const hang = [
  "x = int(input())",
  "while x != 0:",
  "    print(x)"
].join("\n");

(async function () {
  const bank = await E.runTests(piggy, [
    { inputs: ["10", "20", "0"], expectedLines: ["30"] },
    { inputs: ["4", "0"], expectedLines: ["4"] },
    { inputs: ["0"], expectedLines: ["0"] }
  ]);
  assert(bank.ok, "piggy bank " + JSON.stringify(bank));

  const times = await E.runTests(table, [
    { inputs: ["2"], expectedLines: ["2 x 1 = 2", "2 x 2 = 4", "2 x 3 = 6", "2 x 4 = 8", "2 x 5 = 10"] }
  ]);
  assert(times.ok, "table " + JSON.stringify(times));

  const started = Date.now();
  const stuck = await Promise.race([
    E.runTests(hang, [{ inputs: ["5", "0"], expectedLines: ["5"] }]),
    new Promise(function (_, reject) {
      setTimeout(function () { reject(new Error("infinite while did not stop")); }, 8000);
    })
  ]);
  const elapsed = Date.now() - started;
  assert(!stuck.ok && stuck.kind === "error", "bad while should fail " + JSON.stringify(stuck));
  assert(/бесконечн|TimeLimit/i.test(stuck.error), "time limit text: " + stuck.error);
  assert(elapsed < 7000, "time limit took too long: " + elapsed + "ms");
  console.log("loop checks passed in " + elapsed + "ms");
})().catch(function (err) {
  console.error(err);
  process.exit(1);
});
