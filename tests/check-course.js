const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = { console, window: { COURSE_CHAPTERS: [] } };
context.window.window = context.window;
vm.createContext(context);

["ch1_scripts.js", "ch2_input.js", "ch3_types.js", "ch4_math.js", "ch5_if.js", "ch6_loops.js", "ch7_final.js"].forEach(function (file) {
  vm.runInContext(fs.readFileSync(path.join(root, "data", file), "utf8"), context, { filename: file });
});

const chapters = context.window.COURSE_CHAPTERS;
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(chapters.length === 7, "7 chapters");
const lessons = chapters.reduce(function (sum, ch) { return sum + ch.lessonCount; }, 0);
assert(lessons === 27, "27 lessons, got " + lessons);
assert(chapters[0].lessons === "21–22" && chapters[1].lessons === "23–24" && chapters[2].lessons === "25–26", "lesson ranges");
assert(chapters[3].comingSoon === false && chapters[3].tasks.length === 5 && chapters[3].quizzes.length === 4, "chapter 4 ready");
assert(chapters[3].tasks[0].type === "parsons" && chapters[3].tasks[4].variant === true, "chapter 4 task types");
assert(chapters[3].tasks.every(function (task) {
  const view = typeof task.build === "function" ? Object.assign({}, task, task.build({ a: 3, b: 4, c: 3, hash: 1 })) : task;
  return view.hints && view.hints.length >= 2 && typeof task.codeCheck === "function" && view.tests && view.tests.length >= 2;
}), "chapter 4 hints and checks");
const broken = chapters[3].tasks[1].starter;
assert(chapters[3].tasks[1].codeCheck(broken), "debug starter must fail codeCheck");
assert(!chapters[3].tasks[1].codeCheck("import math\na = float(input())\nb = float(input())\nprint(math.sqrt(a ** 2 + b ** 2))\n"), "fixed hypotenuse passes");
const variant = chapters[3].tasks[4].build({ a: 30, b: 40, c: 3, hash: 9 });
assert(variant.tests[0].expectedLines[0] === "15", "3-4-5 times 3 is 15, got " + variant.tests[0].expectedLines[0]);
assert(variant.tests[1].expectedLines[0] === "51", "8-15-17 times 3 is 51, got " + variant.tests[1].expectedLines[0]);
assert(variant.desc.indexOf("3") !== -1, "variant shows the coefficient");
assert(chapters[4].comingSoon === false && chapters[4].tasks.length === 8 && chapters[4].quizzes.length === 5, "chapter 5 ready");
assert(chapters[4].tasks[0].type === "parsons" && chapters[4].tasks[1].type === "parsons" && chapters[4].tasks[5].variant === true, "chapter 5 task types");
assert(chapters[4].tasks[6].id === "m4t6" && chapters[4].tasks[7].id === "m4t7", "chapter 5 extra lessons");
assert(chapters[4].theory.some(function (card) { return card.trace && card.trace.code.indexOf("elif") !== -1 && card.body.indexOf("<svg") !== -1; }), "chapter 5 trace and flowchart");
assert(chapters[4].tasks.every(function (task) {
  const view = typeof task.build === "function" ? Object.assign({}, task, task.build({ a: 40, b: 10, c: 4, price: 50, hash: 1 })) : task;
  return view.hints && view.hints.length >= 2 && typeof task.codeCheck === "function" && view.tests && view.tests.length >= 2;
}), "chapter 5 hints and checks");
const debugIf = chapters[4].tasks[2];
assert(debugIf.codeCheck(debugIf.starter), "broken if must fail the check");
assert(!debugIf.codeCheck("x = int(input())\nif x == 10:\n    print(\"Десятка\")\nelse:\n    print(\"Другое число\")\n"), "fixed if passes");
const ride = chapters[4].tasks[5].build({ a: 40, b: 10, c: 4, price: 50, hash: 1 });
assert(ride.tests.length === 3, "three discount branches");
assert(ride.tests[0].expectedLines[0] === "Скидка" && ride.tests[1].expectedLines[0] === "Полная цена" && ride.tests[2].expectedLines[0] === "Полная цена", "discount branches");
assert(ride.desc.indexOf("14") !== -1 && ride.desc.indexOf("50") !== -1, "student limits shown");
assert(chapters[5].comingSoon === false && chapters[5].tasks.length === 11 && chapters[5].quizzes.length === 7, "chapter 6 ready");
assert(chapters[5].theory.filter(function (card) { return card.trace; }).length === 5, "loop tracers");
assert(chapters[5].tasks[0].type === "parsons" && chapters[5].tasks[1].type === "parsons" && chapters[5].tasks[6].variant === true, "chapter 6 task types");
assert(chapters[5].tasks[10].id === "m5t10", "nested loop task");
assert(chapters[5].tasks[4].tests.length === 3 && chapters[5].tasks[5].tests.length === 2, "sum and piggy tests");
const bank = chapters[5].tasks[5];
assert(bank.tests[0].inputs.length !== bank.tests[1].inputs.length, "piggy tests differ in length");
const divs = chapters[5].tasks[6].build({ a: 12, b: 3, c: 3, price: 20, hash: 1 });
assert(divs.desc.indexOf("5") !== -1, "k=5 for c=3");
assert(divs.tests[0].expectedLines[0] === "2" && divs.tests[1].expectedLines[0] === "1", "counts for divisor 5, got " + divs.tests[0].expectedLines[0] + " and " + divs.tests[1].expectedLines[0]);
assert(chapters[6].comingSoon === false && chapters[6].tasks.length === 7 && chapters[6].quizzes.length === 6, "chapter 7 ready");
assert(chapters[6].tasks[3].variant === true && chapters[6].tasks[4].sandboxPreset === "guess", "final variant and sandbox task");
assert(chapters[6].tasks[5].id === "m6t5" && chapters[6].tasks[6].id === "m6t6", "final extra lessons");
assert(chapters[6].tasks[1].codeCheck("print(max([1, 2]))"), "max() is forbidden");
assert(!chapters[6].tasks[1].codeCheck("n = int(input())\nbest = int(input())\nfor i in range(n - 1):\n    x = int(input())\n    if x > best:\n        best = x\nprint(best)\n"), "loop max is allowed");
assert(chapters[0].tasks.some(function (t) { return t.type === "parsons"; }), "parsons");
assert(chapters[1].tasks.some(function (t) { return t.type === "predict"; }), "predict");
assert(chapters[2].tasks.some(function (t) { return t.type === "blanks"; }), "blanks");
assert(chapters[2].tasks.some(function (t) { return t.variant && typeof t.build === "function"; }), "variant");
assert(chapters[0].theory.some(function (s) { return s.trace && s.trace.code; }), "tracer data");

const variantTask = chapters[2].tasks.find(function (t) { return t.variant; });
const a = variantTask.build({ a: 10, b: 4, hash: 1 });
const b = variantTask.build({ a: 21, b: 8, hash: 2 });
assert(a.tests[0].expectedLines[0] === "14", "variant sum a");
assert(b.tests[0].expectedLines[0] === "29", "variant sum b");
assert(a.desc.indexOf("10") !== -1 && b.desc.indexOf("21") !== -1, "variant text");
assert(a.tests[0].numericMatch === true, "numeric flag");

const types = {};
chapters.forEach(function (ch) {
  (ch.tasks || []).forEach(function (task) { types[task.type || "code"] = true; });
});
["code", "parsons", "predict", "blanks"].forEach(function (type) {
  assert(types[type], "missing type " + type);
});

console.log("course checks passed");
