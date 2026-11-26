const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = {
  console,
  setTimeout,
  clearTimeout,
  Promise,
  Math,
  JSON,
  Object,
  String,
  Number,
  Error,
  RegExp,
  Function,
  parseInt,
  parseFloat,
  Infinity,
  NaN,
  Date,
  globalThis: null
};
context.globalThis = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "js", "engine.js"), "utf8"), context);
const E = context.PyEngine;
if (!E) throw new Error("PyEngine missing");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(E.linesEqual("5.0", "5", { numericMatch: true }), "5.0 vs 5");
assert(E.linesEqual("2.50", "2.5", { numericMatch: true, floatTolerance: 0.01 }), "2.50 vs 2.5");
assert(E.linesEqual("Сумма: 5.0", "Сумма: 5", { numericMatch: true }), "label 5.0 vs 5");
assert(!E.linesEqual("5.0", "5", {}), "numeric flag required");
assert(!E.linesEqual("5.2", "5.0", { numericMatch: true, floatTolerance: 0.01 }), "outside tolerance");
assert(E.linesEqual("Привет, Амир!", "Привет, Амир", { allowExclamation: true }), "exclamation");
assert(E.linesEqual("Сок:360 сом", "Сок: 360 сом", { flexibleColon: true }), "colon spacing");

const tLimit = E.translatePythonError("TimeLimitError: Program exceeded run time limit.");
assert(tLimit.includes("TimeLimitError") && tLimit.includes("цикл"), "timelimit text");
const imp = E.translatePythonError("ImportError: No module named math");
assert(imp.includes("import math"), "import text");
const attr = E.translatePythonError("AttributeError: module 'math' has no attribute 'sqrtt'");
assert(attr.includes("AttributeError"), "attribute text");
const ind = E.translatePythonError("IndentationError: unexpected indent");
assert(ind.includes("4 пробела"), "indent text");

const v1 = E.variantGenerator("Асанов Тимур");
const v2 = E.variantGenerator("Асанов Тимур");
const v3 = E.variantGenerator("Бекова Айдана");
assert(v1.hash === v2.hash && v1.a === v2.a && v1.b === v2.b, "variant stable");
assert(v1.a !== v3.a || v1.b !== v3.b, "variant differs for another name");
assert(v1.a >= 12 && v1.a <= 81 && v1.b >= 3 && v1.b <= 42, "variant ranges");

const model = [
  { code: 'print("1")', indent: 0 },
  { code: 'print("2")', indent: 1 }
];
assert(E.compareParsons(model, model).ok, "parsons exact");
const badIndent = E.compareParsons(
  [{ code: 'print("1")', indent: 0 }, { code: 'print("2")', indent: 0 }],
  model
);
assert(!badIndent.ok && badIndent.reason.includes("Отступ"), "parsons indent");
const badOrder = E.compareParsons(
  [{ code: 'print("2")', indent: 1 }, { code: 'print("1")', indent: 0 }],
  model
);
assert(!badOrder.ok && badOrder.reason.includes("Порядок"), "parsons order");
assert(E.assembleParsons(model) === 'print("1")\n    print("2")', "assemble indent");

const shuffled = E.shuffleParsons(model, "Асанов Тимур|m0t4");
assert(shuffled.length === 2, "shuffle length");
assert(shuffled.every((line) => line.indent === 0), "shuffle starts flat");
const again = E.shuffleParsons(model, "Асанов Тимур|m0t4");
assert(again.map((l) => l.code).join("|") === shuffled.map((l) => l.code).join("|"), "shuffle stable");

const trace = E.buildTrace('x = 5\nx = 12\nprint(x)\nprint(x + 1)');
assert(trace.steps.length === 5, "trace step count " + trace.steps.length);
assert(trace.steps[1].vars.x === "5", "trace x=5");
assert(trace.steps[2].vars.x === "12", "trace x=12");
assert(trace.steps[3].output === "12\n", "trace print x");
assert(trace.steps[4].output === "12\n13\n", "trace print x+1");

const concat = E.buildTrace('print("5" + "3")\nprint(5 + 3)');
assert(concat.steps[2].output === "53\n8\n", "concat vs add: " + JSON.stringify(concat.steps.map((s) => s.output)));

const hello = E.buildTrace('name = input("Как тебя зовут? ")\nprint("Привет,", name)', { inputs: ["Амир"] });
assert(hello.steps[1].vars.name === "Амир", "input stored");
assert(hello.steps[2].output === "Привет, Амир\n", "input print: " + JSON.stringify(hello.steps[2]));

const swap = E.buildTrace('a = "Огонь"\nb = "Вода"\na, b = b, a\nprint(a, b)');
assert(swap.steps[3].vars.a === "Вода" && swap.steps[3].vars.b === "Огонь", "swap vars");
assert(swap.steps[4].output === "Вода Огонь\n", "swap print");

const commented = E.buildTrace('# секрет\nprint("Готово")');
assert(commented.steps[1].note.includes("комментарий"), "comment note");
assert(commented.steps[2].output === "Готово\n", "comment skipped");

assert(E.linesEqual("Чётное", "четное", { ignoreCase: true }), "ignore case and yo");
assert(!E.linesEqual("Чётное", "Нечётное", { ignoreCase: true }), "different words");

const branch = E.buildTrace('score = 75\nif score >= 90:\n    print("5")\nelif score >= 60:\n    print("4")\nelse:\n    print("ещё")');
const notes = branch.steps.map((s) => s.note).join(" | ");
assert(notes.includes("нет, идём дальше"), "if false: " + notes);
assert(notes.includes("да, заходим"), "elif taken: " + notes);
assert(notes.includes("Else пропускаем"), "else skipped: " + notes);
assert(branch.steps[branch.steps.length - 1].output === "4\n", "branch output " + JSON.stringify(branch.steps));

const high = E.buildTrace('score = 95\nif score >= 90:\n    print("5")\nelif score >= 60:\n    print("4")\nelse:\n    print("ещё")');
assert(high.steps[high.steps.length - 1].output === "5\n", "high score branch");
assert(high.steps.map((s) => s.note).join(" | ").includes("пропускаем"), "later branches skipped");

const gate = E.buildTrace('age = 14\nif age >= 12 and age <= 16:\n    print("да")\nelse:\n    print("нет")');
assert(gate.steps[gate.steps.length - 1].output === "да\n", "and range " + JSON.stringify(gate.steps.map((s) => s.note)));

const rain = E.buildTrace('rain = True\numbrella = False\nif rain and not umbrella:\n    print("Промокнем")\nelse:\n    print("Сухо")');
assert(rain.steps[rain.steps.length - 1].output === "Промокнем\n", "not umbrella " + JSON.stringify(rain.steps));

const sumLoop = E.buildTrace("s = 0\nfor i in range(1, 5):\n    s = s + i\nprint(s)");
const sumNotes = sumLoop.steps.map((s) => s.note + " i=" + (s.vars.i || "-") + " s=" + (s.vars.s || "-")).join(" | ");
assert(sumLoop.steps.some((s) => s.vars.i === "1" && s.vars.s === "0"), "for sets i before body: " + sumNotes);
assert(sumLoop.steps.some((s) => s.vars.i === "4" && s.vars.s === "10"), "for last lap s=10: " + sumNotes);
assert(sumLoop.steps[sumLoop.steps.length - 1].output === "10\n", "for prints total");
assert(!sumLoop.steps.some((s) => s.vars.i === "5"), "range end excluded");

const countDown = E.buildTrace("n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint(\"Пуск\")");
assert(countDown.steps[countDown.steps.length - 1].output === "3\n2\n1\nПуск\n", "countdown " + JSON.stringify(countDown.steps.map((s) => s.output)));
assert(countDown.steps.some((s) => s.note.indexOf("цикл закончился") !== -1), "while stops");

const spin = E.buildTrace("x = 1\nwhile x < 5:\n    print(x)");
assert(spin.steps.some((s) => s.error && s.error.indexOf("бесконечный") !== -1), "tracer stops infinite while");

const skipped = E.buildTrace("for i in range(1, 6):\n    if i == 3:\n        continue\n    if i == 5:\n        break\n    print(i)");
assert(skipped.steps[skipped.steps.length - 1].output === "1\n2\n4\n", "break and continue " + JSON.stringify(skipped.steps.map((s) => s.output)));
assert(skipped.steps.some((s) => s.note.indexOf("continue") !== -1), "continue note");
assert(skipped.steps.some((s) => s.note.indexOf("break") !== -1), "break note");

const grid = E.buildTrace("for r in range(2):\n    line = \"\"\n    for c in range(3):\n        line = line + \"*\"\n    print(line)");
assert(grid.steps[grid.steps.length - 1].output === "***\n***\n", "nested stars " + JSON.stringify(grid.steps.map((s) => s.output)));

const stepped = E.buildTrace("for i in range(0, 9, 2):\n    print(i)");
assert(stepped.steps[stepped.steps.length - 1].output === "0\n2\n4\n6\n8\n", "range step " + JSON.stringify(stepped.steps.map((s) => s.output)));

const outside = E.buildTrace("break");
assert(outside.steps.some((s) => s.error && s.error.indexOf("вне цикла") !== -1), "break outside loop");

const f = E.preprocessFStrings('print(f"Возраст: {2030 - year}")');
assert(f.includes("str(2030 - year)"), "f-string preprocess: " + f);

(async function () {
  const hello = await E.runTests('print("Привет, Python!")', [{ inputs: [], expectedLines: ["Привет, Python!"] }]);
  assert(hello.ok, "fallback hello " + JSON.stringify(hello));

  const sum = await E.runTests(
    "a = int(input())\nb = int(input())\nprint(a + b)",
    [{ inputs: ["12", "8"], expectedLines: ["20"] }]
  );
  assert(sum.ok, "fallback sum " + JSON.stringify(sum));

  const pizza = await E.runTests(
    "n = int(input())\nk = int(input())\nprint(n // k)\nprint(n % k)",
    [{ inputs: ["10", "3"], expectedLines: ["3", "1"] }]
  );
  assert(pizza.ok, "fallback pizza " + JSON.stringify(pizza));

  const colon = await E.runTests(
    'item = input()\nprice = int(input())\ncount = int(input())\nprint(item + ":", price * count, "сом")',
    [{ inputs: ["Сок", "120", "3"], expectedLines: ["Сок: 360 сом"], flexibleColon: true }]
  );
  assert(colon.ok, "fallback receipt " + JSON.stringify(colon));

  const half = await E.runTests("print(10 / 2)", [{ inputs: [], expectedLines: ["5"], numericMatch: true, floatTolerance: 0.01 }]);
  assert(half.ok, "fallback 10/2 numeric " + JSON.stringify(half));

  const bad = await E.runTests('Print("Шаг 1 готов")', [{ inputs: [], expectedLines: ["Шаг 1 готов"] }]);
  assert(!bad.ok && bad.kind === "error" && bad.error.indexOf("print") !== -1, "Print name error " + JSON.stringify(bad));

  const started = Date.now();
  const hung = await E.runTests("while True:\n    pass\n", [{ inputs: [], expectedLines: ["нет"] }]);
  assert(Date.now() - started < 1500, "fallback while must not hang");
  assert(!hung.ok, "fallback while is not a successful program");

  console.log("engine checks passed");
})().catch(function (err) {
  console.error(err);
  process.exit(1);
});
