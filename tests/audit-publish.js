const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
const failures = [];

function fail(msg) {
  failures.push(msg);
  console.error("FAIL", msg);
}

const scripts = [];
const srcRe = /<script\b([^>]*)>/g;
let match;
while ((match = srcRe.exec(html))) {
  const tag = match[1];
  const src = /src="([^"]+)"/.exec(tag);
  if (!src) continue;
  scripts.push(src[1]);
  if (!fs.existsSync(path.join(root, src[1]))) fail("missing script " + src[1]);
}
["vendor/skulpt.min.js", "vendor/skulpt-stdlib.js", "data/ch1_scripts.js", "data/ch2_input.js", "data/ch3_types.js", "data/ch4_math.js", "data/ch5_if.js", "data/ch6_loops.js", "data/ch7_final.js", "js/engine.js", "js/app.js"].forEach(function (file) {
  if (scripts.indexOf(file) === -1) fail("index.html does not load " + file);
});
if (html.indexOf("window.COURSE_CHAPTERS") === -1) fail("COURSE_CHAPTERS bootstrap missing");

const ids = [];
const idRe = /\sid="([^"]+)"/g;
while ((match = idRe.exec(html))) ids.push(match[1]);
const dupes = ids.filter(function (id, index) { return ids.indexOf(id) !== index; });
if (dupes.length) fail("duplicate ids: " + dupes.join(", "));
const idSet = {};
ids.forEach(function (id) { idSet[id] = true; });
const assignRe = /\.id\s*=\s*"([^"]+)"/g;
while ((match = assignRe.exec(app))) idSet[match[1]] = true;
const used = [];
const getRe = /getElementById\("([^"]+)"\)/g;
while ((match = getRe.exec(app))) used.push(match[1]);
used.filter(function (id, index) { return used.indexOf(id) === index; }).forEach(function (id) {
  if (!idSet[id]) fail("app.js asks for missing id #" + id);
});

["js/engine.js", "js/app.js", "data/ch1_scripts.js", "data/ch2_input.js", "data/ch3_types.js", "data/ch4_math.js", "data/ch5_if.js", "data/ch6_loops.js", "data/ch7_final.js"].forEach(function (file) {
  try {
    require("child_process").execFileSync(process.execPath, ["--check", path.join(root, file)], { stdio: "pipe" });
  } catch (err) {
    fail("syntax " + file + ": " + err.stderr.toString());
  }
});

const context = { console, setTimeout, setInterval, clearTimeout };
context.window = context;
context.self = context;
context.globalThis = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "vendor/skulpt.min.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "vendor/skulpt-stdlib.js"), "utf8"), context);
["ch1_scripts.js", "ch2_input.js", "ch3_types.js", "ch4_math.js", "ch5_if.js", "ch6_loops.js", "ch7_final.js"].forEach(function (file) {
  vm.runInContext(fs.readFileSync(path.join(root, "data", file), "utf8"), context, { filename: file });
});
const beforeKeys = Object.keys(context);
vm.runInContext(fs.readFileSync(path.join(root, "js/engine.js"), "utf8"), context);
const leaked = Object.keys(context).filter(function (key) {
  return beforeKeys.indexOf(key) === -1 && key !== "PyEngine";
});
if (leaked.length) fail("engine.js leaked globals: " + leaked.join(", "));
if (typeof context.Sk === "undefined" || !context.Sk.builtinFiles) fail("Skulpt did not load");
if (!context.PyEngine || context.PyEngine.DEFAULT_FLOAT_TOLERANCE !== 0.01) fail("PyEngine missing");

const chapters = context.window.COURSE_CHAPTERS.slice().sort(function (a, b) { return a.order - b.order; });
if (chapters.length !== 7) fail("expected 7 chapters, got " + chapters.length);
const seen = {};
chapters.forEach(function (ch) {
  (ch.tasks || []).forEach(function (task) {
    if (seen[task.id]) fail("duplicate task id " + task.id);
    seen[task.id] = true;
  });
  (ch.quizzes || []).forEach(function (quiz) {
    if (seen[quiz.id]) fail("duplicate quiz id " + quiz.id);
    seen[quiz.id] = true;
  });
});

const NAME = "Асанов Тимур";
const variant = context.PyEngine.variantGenerator(NAME);

function hydrate(task) {
  if (typeof task.build === "function") return Object.assign({}, task, task.build(variant));
  return task;
}

function assemble(lines) {
  return lines.map(function (line) {
    return " ".repeat((line.indent || 0) * 4) + line.code;
  }).join("\n");
}

const SOLUTIONS = {
  m0t0: 'print("Привет, Python!")',
  m0t1: 'print("Игрок: Старт")\nprint("Уровень: 1")\nprint("Готов к коду!")',
  m0t2: 'print("Шаг 1 готов")\nprint("Шаг 2 готов")\nprint("Шаг 3 готов")',
  m0t3: '# считаю\nprint(15 + 25)',
  m1t0: 'city = "Бишкек"\nprint(city)',
  m1t1: 'name = input()\nprint("Привет,", name)',
  m1t2: 'name = input()\nhobby = input()\nprint(name, "любит", hobby)',
  m1t3: 'a = "Кошка"\nb = "Собака"\na, b = b, a\nprint(a)\nprint(b)',
  m2t0: 'a = int(input())\nb = int(input())\nprint(a + b)',
  m2t1: 'year = int(input())\nprint(2030 - year)',
  m2t2: 'n = int(input())\nk = int(input())\nprint(n // k)\nprint(n % k)',
  m2t3: 'item = input()\nprice = int(input())\ncount = int(input())\ntotal = price * count\nprint(item + ":", total, "сом")',
  m2t4: 'print(' + variant.a + ' + ' + variant.b + ')',
  m2t5: 'a = int(input())\nb = int(input())\nprint(a + b)',
  m2t6: 'print(10 / 2)',
  m3t1: 'import math\na = float(input())\nb = float(input())\nprint(math.sqrt(a ** 2 + b ** 2))',
  m3t2: 'import math\nn = int(input())\nm = int(input())\nprint(math.ceil(n / m))',
  m3t3: 'import math\nr = float(input())\nprint(round(math.pi * r ** 2, 2))',
  m3t4: 'import math\nw = float(input())\nh = float(input())\nk = ' + variant.c + '\nprint(round(math.sqrt(w ** 2 + h ** 2) * k, 2))',
  m4t2: 'x = int(input())\nif x == 10:\n    print("Десятка")\nelse:\n    print("Другое число")',
  m4t3: 'n = int(input())\nif n % 2 == 0:\n    print("Чётное")\nelse:\n    print("Нечётное")',
  m4t4: 'a = int(input())\nb = int(input())\nif a == b:\n    print("Равны")\nelif a > b:\n    print(a)\nelse:\n    print(b)',
  m5t2: 'n = int(input())\ns = 0\ni = 1\nwhile i <= n:\n    s = s + i\n    i = i + 1\nprint(s)\nfor i in range(1, n + 1):\n    print(i)',
  m5t3: 'n = int(input())\nfor i in range(1, n + 1):\n    print(i)',
  m5t4: 'n = int(input())\ns = 0\nfor i in range(1, n + 1):\n    s = s + i\nprint(s)',
  m5t5: 'total = 0\nx = int(input())\nwhile x != 0:\n    total = total + x\n    x = int(input())\nprint(total)',
  m6t0: 'n = int(input())\ns = 0\nfor i in range(n):\n    s = s + int(input())\navg = round(s / n, 1)\nprint(avg)\nif avg >= 4.5:\n    print("Отличник")\nelif avg >= 3.5:\n    print("Хорошист")\nelse:\n    print("Нужно подтянуть")',
  m6t1: 'n = int(input())\nbest = int(input())\nfor i in range(n - 1):\n    x = int(input())\n    if x > best:\n        best = x\nprint(best)',
  m6t2: 'amount = int(input())\npercent = int(input())\nif amount % 100 != 0:\n    print("Ошибка")\nelse:\n    total = amount + amount * percent // 100\n    print(total)\n    print(total // 500)\n    print(total % 500)',
  m6t4: 'secret = 7\nwhile True:\n    guess = int(input())\n    if guess == secret:\n        print("Угадал")\n        break\n    elif guess < secret:\n        print("Больше")\n    else:\n        print("Меньше")'
};

(function () {
  const view = hydrate(chapters[4].tasks[5]);
  const age = 10 + variant.c;
  const sum = variant.price;
  SOLUTIONS.m4t5 = 'age = int(input())\ntotal = int(input())\nif age <= ' + age + ' and total >= ' + sum + ':\n    print("Скидка")\nelse:\n    print("Полная цена")';
  const countView = hydrate(chapters[5].tasks[6]);
  const k = 2 + (variant.c % 4);
  SOLUTIONS.m5t6 = 'n = int(input())\nk = ' + k + '\ncount = 0\nfor i in range(1, n + 1):\n    if i % k == 0:\n        count = count + 1\nprint(count)';
  const gateView = hydrate(chapters[6].tasks[3]);
  SOLUTIONS.m6t3 = 'n = int(input())\nk = ' + (2 + (variant.c % 4)) + '\ngate = ' + variant.price + '\ns = 0\nfor i in range(1, n + 1):\n    if i % k == 0:\n        s = s + i\nif s >= gate:\n    print(s)\nelse:\n    print(0)';
  void countView;
  void gateView;
})();

function hashCode(name, cls, solvedTasks, solvedQuizzes, xp, marks) {
  const str = [name, cls, solvedTasks, solvedQuizzes, xp, marks.join("."), "PY7"].join("|");
  let hash = 5381;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  return "PY7-" + hash.toString(36).toUpperCase().padStart(6, "0");
}
const codeA = hashCode("Асанов Тимур", "7А", 10, 4, 290, ["5", "4", "3", "—", "—", "—", "—"]);
const codeB = hashCode("Асанов Тимур", "7А", 11, 4, 315, ["5", "4", "3", "—", "—", "—", "—"]);
if (codeA === codeB) fail("verify code did not change when the mark inputs changed");
if (!/^PY7-[0-9A-Z]{6}$/.test(codeA)) fail("verify code shape " + codeA);

(async function () {
  let passed = 0;
  let caught = 0;
  for (let ci = 0; ci < chapters.length; ci++) {
    const chapter = chapters[ci];
    for (let ti = 0; ti < (chapter.tasks || []).length; ti++) {
      const raw = chapter.tasks[ti];
      const task = hydrate(raw);
      const label = "Гл." + (ci + 1) + " " + task.id + " " + task.title;
      let code = SOLUTIONS[task.id];
      if (task.type === "parsons") code = assemble(task.lines);
      if (task.type === "predict") {
        const ok = task.expectedLines.every(function (line, index) {
          return context.PyEngine.linesEqual(task.expectedLines[index], line, task);
        });
        const bad = context.PyEngine.linesEqual("не то", task.expectedLines.join("\n"), task);
        if (!ok || bad) fail(label + " predict comparison");
        else passed += 1;
        if (bad) fail(label + " predict accepted a wrong answer");
        else caught += 1;
        continue;
      }
      if (!code) {
        fail(label + " has no reference solution");
        continue;
      }
      if (typeof task.codeCheck === "function") {
        const msg = task.codeCheck(code);
        if (msg) {
          fail(label + " reference rejected by codeCheck: " + msg);
          continue;
        }
      }
      const result = await context.PyEngine.runTests(code, task.tests || []);
      if (!result.ok) {
        fail(label + " tests failed: " + JSON.stringify(result));
        continue;
      }
      passed += 1;

      const wrong = 'print("НЕВЕРНО")';
      let negativeCaught = false;
      if (typeof task.codeCheck === "function" && task.codeCheck(wrong)) negativeCaught = true;
      if (!negativeCaught) {
        const badRun = await context.PyEngine.runTests(wrong, task.tests || []);
        negativeCaught = !badRun.ok;
      }
      if (!negativeCaught) fail(label + " did not catch a wrong program");
      else caught += 1;
    }
  }

  const broken = [
    chapters[0].tasks[2].starter,
    chapters[3].tasks[1].starter,
    chapters[4].tasks[2].starter,
    chapters[5].tasks[2].starter
  ];
  const brokenTasks = [chapters[0].tasks[2], chapters[3].tasks[1], chapters[4].tasks[2], chapters[5].tasks[2]];
  for (let i = 0; i < brokenTasks.length; i++) {
    const task = hydrate(brokenTasks[i]);
    const msg = task.codeCheck ? task.codeCheck(broken[i]) : null;
    const run = msg ? { ok: false } : await context.PyEngine.runTests(broken[i], task.tests);
    if (run.ok && !msg) fail(task.id + " starter was accepted");
  }

  const maxBan = chapters[6].tasks[1].codeCheck("print(max([1, 2]))");
  if (!maxBan) fail("max() was not rejected");

  console.log("solutions passed", passed, "wrong answers caught", caught);
  if (failures.length) {
    console.error("AUDIT FAILED", failures.length);
    process.exit(1);
  }
  console.log("static audit and all reference solutions passed");
})().catch(function (err) {
  console.error(err);
  process.exit(1);
});
