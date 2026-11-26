/* ПайтонЛаб 7 — движок: Skulpt, офлайн-запасной путь, ошибки, автотесты, трассировка. */
(function (global) {
"use strict";

function preprocessFStrings(code) {
  // Converts simple Python f"text {expr}" / f'text {expr}' into string concatenation
  return code.replace(/([fF])(["'])((?:\\.|(?!\2)[^\\\n])*)\2/g, (match, prefix, quote, inner) => {
    if (!inner.includes("{")) return quote + inner + quote;
    const parts = [];
    let i = 0;
    let buf = "";
    while (i < inner.length) {
      if (inner[i] === "{" && inner[i + 1] !== "{") {
        if (buf.length > 0) {
          parts.push(quote + buf + quote);
          buf = "";
        }
        let depth = 1;
        let j = i + 1;
        while (j < inner.length && depth > 0) {
          if (inner[j] === "{") depth++;
          else if (inner[j] === "}") depth--;
          j++;
        }
        const expr = inner.slice(i + 1, j - 1).trim();
        parts.push("str(" + expr + ")");
        i = j;
      } else {
        buf += inner[i];
        i++;
      }
    }
    if (buf.length > 0) parts.push(quote + buf + quote);
    return "(" + (parts.length ? parts.join(" + ") : quote + quote) + ")";
  });
}

/* ============================================================================
   ПЕРЕВОДЧИК ОШИБОК PYTHON НА ПОНЯТНЫЙ РУССКИЙ ЯЗЫК
============================================================================ */
function translatePythonError(rawErr) {
  let err = String(rawErr || "Неизвестная ошибка");
  if (/ReferenceError/i.test(err) && /is not defined/i.test(err)) {
    const missing = err.match(/(\w+)\s+is not defined/);
    err = "NameError: name '" + (missing ? missing[1] : "") + "' is not defined";
  }
  if (/IndentationError|TabError|unexpected indent|expected an indented block|unindent does not match/i.test(err)) {
    return "🔴 Съехали пробелы в начале строки (IndentationError). Команды внутри if, else и циклов сдвигай вправо на 4 пробела. Кнопка «↹ Tab» как раз для этого.";
  }
  if (/TimeLimitError|exceeded run time|time limit|timed out/i.test(err)) {
    return "🔴 Программа думала слишком долго (TimeLimitError). Чаще всего это бесконечный цикл: проверь while и for — они должны когда-нибудь заканчиваться.";
  }
  if (/ImportError|No module named/i.test(err)) {
    const mod = err.match(/No module named ['"]?([^'"\s]+)['"]?/i);
    const name = mod ? mod[1] : "math";
    return "🔴 Модуль «" + name + "» не подключился (ImportError). Первой строкой напиши: import " + name;
  }
  if (/AttributeError/i.test(err)) {
    return "🔴 После точки написано не то имя (AttributeError). Проверь, что модуль подключён (import math) и команда существует: math.sqrt, math.pi.";
  }
  if (/SyntaxError|ParseError|bad input|EOL while scanning/i.test(err)) {
    if (/EOL|unterminated|string/i.test(err)) {
      return "🔴 Ошибка в строке: ты открыл кавычку, но забыл закрыть её!";
    }
    if (/bad input|unexpected indent/i.test(err)) {
      return "🔴 Ошибка синтаксиса. Проверь скобки, кавычки и пробелы в начале строки. Обычные команды пиши с краю, а внутрь if и циклов сдвигай на 4 пробела.";
    }
    return "🔴 Ошибка синтаксиса (SyntaxError): проверь скобки (), кавычки \"\" и правильность написания команд.\nДетали: " + err;
  }
  if (/NameError/i.test(err)) {
    const m = err.match(/name ['"]([^'"]+)['"]/i);
    const nm = m ? m[1] : "";
    if (/^Print$/i.test(nm) && nm !== "print") {
      return "🔴 Неизвестное имя «" + nm + "». В Python команды пишутся с маленькой буквы: напиши print(...)!";
    }
    if (/^Input$/i.test(nm) && nm !== "input") {
      return "🔴 Неизвестное имя «" + nm + "». Напиши с маленькой буквы: input()!";
    }
    if (/^Math$/.test(nm)) {
      return "🔴 Модуль называется math с маленькой буквы. Сначала напиши import math.";
    }
    return "🔴 Неизвестное имя «" + (nm || "?") + "»: либо ты забыл кавычки вокруг текста, либо используешь переменную до её создания.";
  }
  if (/TypeError/i.test(err)) {
    return "🔴 Ошибка типов (TypeError): нельзя напрямую складывать текст и число. Используй запятую в print(...) или преобразуй через int() / str().";
  }
  if (/ValueError/i.test(err)) {
    return "🔴 Ошибка значения (ValueError): функция int() или float() получила текст вместо числа. Вводи только цифры!";
  }
  if (/ZeroDivisionError/i.test(err)) {
    return "🔴 Деление на ноль! На ноль делить нельзя.";
  }
  return "🔴 Ошибка: " + err;
}

/* ============================================================================
   ВСТРОЕННЫЙ ОФЛАЙН-ДВИЖОК PYTHON (FALLBACK, ЕСЛИ НЕТ СЕТИ / CDN)
============================================================================ */
async function runFallbackPython(rawCode, onOutput, onInput) {
  const code = preprocessFStrings(rawCode);
  const env = {};

  function splitTopLevel(str, sepChar) {
    const res = [];
    let cur = "", inStr = null, depth = 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (inStr) {
        cur += ch;
        if (ch === "\\" && i + 1 < str.length) { cur += str[++i]; continue; }
        if (ch === inStr) inStr = null;
      } else {
        if (ch === '"' || ch === "'") { inStr = ch; cur += ch; }
        else if (ch === "(" || ch === "[" || ch === "{") { depth++; cur += ch; }
        else if (ch === ")" || ch === "]" || ch === "}") { depth--; cur += ch; }
        else if (ch === sepChar && depth === 0) { res.push(cur.trim()); cur = ""; }
        else cur += ch;
      }
    }
    if (cur.trim() !== "") res.push(cur.trim());
    return res;
  }

  function stripComment(line) {
    let inStr = null;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inStr) {
        if (ch === "\\" && i + 1 < line.length) { i++; continue; }
        if (ch === inStr) inStr = null;
      } else {
        if (ch === '"' || ch === "'") inStr = ch;
        else if (ch === "#") return line.slice(0, i);
      }
    }
    return line;
  }

  async function evalExpr(expr) {
    expr = expr.trim();
    if (!expr) throw new Error("SyntaxError: пустое выражение");

    // Check unclosed quotes
    let q = null;
    for (let i = 0; i < expr.length; i++) {
      if (q) {
        if (expr[i] === "\\") { i++; continue; }
        if (expr[i] === q) q = null;
      } else if (expr[i] === '"' || expr[i] === "'") {
        q = expr[i];
      }
    }
    if (q) throw new Error("SyntaxError: EOL while scanning string literal");

    // Resolve input(...) calls asynchronously from innermost to outermost
    while (/\binput\s*\(/.test(expr)) {
      const m = /\binput\s*\(/.exec(expr);
      const start = m.index;
      let depth = 0, inS = null, end = -1;
      for (let i = start + m[0].length - 1; i < expr.length; i++) {
        const c = expr[i];
        if (inS) {
          if (c === "\\") { i++; continue; }
          if (c === inS) inS = null;
        } else {
          if (c === '"' || c === "'") inS = c;
          else if (c === "(") depth++;
          else if (c === ")") { depth--; if (depth === 0) { end = i; break; } }
        }
      }
      if (end === -1) throw new Error("SyntaxError: незакрытая скобка в input()");
      const innerArg = expr.slice(start + m[0].length, end).trim();
      const promptVal = innerArg ? String(await evalExpr(innerArg)) : "";
      const userVal = await onInput(promptVal);
      const safeJson = JSON.stringify(String(userVal));
      expr = expr.slice(0, start) + safeJson + expr.slice(end + 1);
    }

    // Build safe JS expression with Python helpers
    // Handle // (floor division) outside strings
    let jsExpr = "";
    let inS = null;
    for (let i = 0; i < expr.length; i++) {
      const c = expr[i];
      if (inS) {
        jsExpr += c;
        if (c === "\\" && i + 1 < expr.length) { jsExpr += expr[++i]; continue; }
        if (c === inS) inS = null;
      } else {
        if (c === '"' || c === "'") { inS = c; jsExpr += c; }
        else if (c === "/" && expr[i + 1] === "/") {
          // convert a // b via wrapper later; simple marker
          jsExpr += " / ";
          // For integer floor division we handle below via custom parser
          i++;
          return evalFloorDiv(expr);
        } else {
          jsExpr += c;
        }
      }
    }

    const scopeKeys = Object.keys(env);
    const scopeVals = scopeKeys.map(k => env[k]);

    const pyHelpers = {
      int: (v) => {
        if (typeof v === "string" && !/^\s*[+-]?\d+\s*$/.test(v)) throw new Error("ValueError: invalid literal for int()");
        const n = parseInt(v, 10);
        if (Number.isNaN(n)) throw new Error("ValueError: invalid literal for int()");
        return n;
      },
      float: (v) => {
        const n = Number(v);
        if (Number.isNaN(n)) throw new Error("ValueError: could not convert to float");
        return n;
      },
      str: (v) => String(v),
      len: (v) => String(v).length,
      abs: (v) => Math.abs(v),
      round: (v, d) => d ? Number(v.toFixed(d)) : Math.round(v),
      type: (v) => {
        if (typeof v === "string") return "<class 'str'>";
        if (typeof v === "number") return Number.isInteger(v) ? "<class 'int'>" : "<class 'float'>";
        if (typeof v === "boolean") return "<class 'bool'>";
        return "<class 'object'>";
      }
    };

    try {
      const fn = new Function(
        ...Object.keys(pyHelpers),
        ...scopeKeys,
        `"use strict"; return (${jsExpr});`
      );
      const res = fn(...Object.values(pyHelpers), ...scopeVals);
      if (res === Infinity || res === -Infinity || Number.isNaN(res)) {
        throw new Error("ZeroDivisionError");
      }
      return res;
    } catch (e) {
      if (e instanceof ReferenceError || (e && e.name === "ReferenceError")) {
        const m = e.message.match(/(\w+)\s+is not defined/);
        throw new Error(`NameError: name '${m ? m[1] : ""}' is not defined`);
      }
      throw e;
    }
  }

  async function evalFloorDiv(expr) {
    // Split on top-level //
    let inS = null, depth = 0, idx = -1;
    for (let i = 0; i < expr.length - 1; i++) {
      const c = expr[i];
      if (inS) {
        if (c === "\\") { i++; continue; }
        if (c === inS) inS = null;
      } else {
        if (c === '"' || c === "'") inS = c;
        else if (c === "(") depth++;
        else if (c === ")") depth--;
        else if (c === "/" && expr[i + 1] === "/" && depth === 0) { idx = i; break; }
      }
    }
    if (idx === -1) return evalExpr(expr.replace(/\/\//g, "/"));
    const left = await evalExpr(expr.slice(0, idx));
    const right = await evalExpr(expr.slice(idx + 2));
    if (right === 0) throw new Error("ZeroDivisionError");
    return Math.floor(left / right);
  }

  const lines = code.split(/\r?\n/);
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const clean = stripComment(lines[lineIdx]).trim();
    if (!clean) continue;

    // print(...)
    if (/^print\s*\(/.test(clean)) {
      if (!clean.endsWith(")")) throw new Error("SyntaxError: не закрыта скобка ) в print");
      const inner = clean.slice(clean.indexOf("(") + 1, -1);
      const args = splitTopLevel(inner, ",");
      let sep = " ", end = "\n";
      const outParts = [];
      for (const a of args) {
        if (/^sep\s*=/.test(a)) { sep = String(await evalExpr(a.replace(/^sep\s*=/, ""))); }
        else if (/^end\s*=/.test(a)) { end = String(await evalExpr(a.replace(/^end\s*=/, ""))); }
        else { outParts.push(String(await evalExpr(a))); }
      }
      onOutput(outParts.join(sep) + end);
      continue;
    }

    // Check assignment (a = expr or a, b = b, a)
    let eqPos = -1, inS = null, depth = 0;
    for (let i = 0; i < clean.length; i++) {
      const c = clean[i];
      if (inS) {
        if (c === "\\") { i++; continue; }
        if (c === inS) inS = null;
      } else {
        if (c === '"' || c === "'") inS = c;
        else if (c === "(") depth++;
        else if (c === ")") depth--;
        else if (c === "=" && depth === 0 && clean[i + 1] !== "=" && clean[i - 1] !== "!" && clean[i - 1] !== "<" && clean[i - 1] !== ">") {
          eqPos = i; break;
        }
      }
    }

    if (eqPos !== -1) {
      const lhs = splitTopLevel(clean.slice(0, eqPos), ",");
      const rhs = splitTopLevel(clean.slice(eqPos + 1), ",");
      if (lhs.length !== rhs.length) throw new Error("ValueError: количество переменных не совпадает");
      const vals = [];
      for (const r of rhs) vals.push(await evalExpr(r));
      for (let i = 0; i < lhs.length; i++) {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(lhs[i])) {
          throw new Error(`SyntaxError: неправильное имя переменной "${lhs[i]}"`);
        }
        env[lhs[i]] = vals[i];
      }
      continue;
    }

    // Standalone expression (e.g. Print("...") -> triggers NameError cleanly)
    await evalExpr(clean);
  }
}

/* ============================================================================
   УНИВЕРСАЛЬНЫЙ ЗАПУСК PYTHON (SKULPT 3 + FALLBACK)
============================================================================ */
async function executePython(rawCode, { onOutput, onInput, isTestMode }) {
  const preparedCode = preprocessFStrings(rawCode);

  if (typeof Sk !== "undefined" && Sk.misceval && Sk.builtinFiles) {
    return new Promise((resolve, reject) => {
      Sk.execStart = Date.now();
      Sk.configure({
        output: (text) => onOutput(text),
        read: (x) => {
          if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
            throw "File not found: '" + x + "'";
          }
          return Sk.builtinFiles["files"][x];
        },
        inputfun: (promptText) => {
          return new Promise((res) => {
            Promise.resolve(onInput(promptText || "")).then(val => {
              // Время ожидания input() не должно съедать лимит на бесконечный цикл.
              Sk.execStart = Date.now();
              res(String(val));
            });
          });
        },
        inputfunTakesPrompt: true,
        execLimit: 3000,
        __future__: Sk.python3
      });

      Sk.execStart = Date.now();
      Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, preparedCode, true))
        .then(() => resolve())
        .catch((err) => reject(err.toString()));
    });
  } else {
    // Graceful offline JS engine
    return runFallbackPython(preparedCode, onOutput, onInput);
  }
}

  const DEFAULT_FLOAT_TOLERANCE = 0.01;

  function hashString(str) {
    let h = 2166136261;
    const s = String(str);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function variantGenerator(studentName) {
    const name = String(studentName || "ученик").trim().toLowerCase().replace(/\s+/g, " ");
    const h = hashString(name);
    return {
      hash: h,
      a: 12 + (h % 70),
      b: 3 + ((h >>> 8) % 40),
      c: 2 + ((h >>> 16) % 9),
      year: 2011 + (h % 5),
      price: 20 + ((h >>> 4) % 81),
      qty: 2 + ((h >>> 12) % 6)
    };
  }

  function normalizeLine(line, opts) {
    let s = String(line).trim().replace(/\s+/g, " ");
    if (opts && opts.flexibleColon) s = s.replace(/\s*:\s*/g, ": ");
    if (opts && opts.allowExclamation) s = s.replace(/!+$/, "");
    return s;
  }

  function numericTokensEqual(actual, expected, tol) {
    const numRe = /[+-]?(?:\d+\.\d+|\d+\.|\.\d+|\d+)/g;
    const aNums = actual.match(numRe) || [];
    const eNums = expected.match(numRe) || [];
    if (!aNums.length || aNums.length !== eNums.length) return false;
    if (actual.replace(numRe, "#") !== expected.replace(numRe, "#")) return false;
    for (let i = 0; i < aNums.length; i++) {
      const av = parseFloat(aNums[i]);
      const ev = parseFloat(eNums[i]);
      if (Number.isNaN(av) || Number.isNaN(ev)) return false;
      if (Math.abs(av - ev) > tol) return false;
    }
    return true;
  }

  function linesEqual(actual, expected, opts) {
    const a = normalizeLine(actual, opts);
    const e = normalizeLine(expected, opts);
    if (a === e) return true;
    if (opts && opts.numericMatch) {
      const tol = typeof opts.floatTolerance === "number" ? opts.floatTolerance : DEFAULT_FLOAT_TOLERANCE;
      return numericTokensEqual(a, e, tol);
    }
    return false;
  }

  function outputLines(testOut) {
    const text = String(testOut == null ? "" : testOut).replace(/\r\n/g, "\n").trimEnd();
    if (text === "") return [];
    return text.split("\n");
  }

  async function runTests(code, tests) {
    const list = tests || [];
    let lastOutput = "";
    for (let i = 0; i < list.length; i++) {
      const tc = list[i];
      let testOut = "";
      let inputIdx = 0;
      const inputs = tc.inputs || [];
      try {
        await executePython(code, {
          isTestMode: true,
          onOutput: function (txt) { testOut += txt; },
          onInput: function () {
            if (inputIdx < inputs.length) return inputs[inputIdx++];
            return "";
          }
        });
      } catch (err) {
        return {
          ok: false,
          kind: "error",
          testIndex: i,
          error: translatePythonError(err),
          lastOutput: testOut
        };
      }
      lastOutput = testOut;
      const actualLines = outputLines(testOut);
      const expLines = tc.expectedLines || [];
      let match = actualLines.length === expLines.length;
      if (match) {
        for (let li = 0; li < expLines.length; li++) {
          if (!linesEqual(actualLines[li], expLines[li], tc)) {
            match = false;
            break;
          }
        }
      }
      if (!match) {
        return {
          ok: false,
          kind: "mismatch",
          testIndex: i,
          inputs: inputs,
          expected: expLines,
          actual: actualLines,
          lastOutput: lastOutput
        };
      }
    }
    return { ok: true, lastOutput: lastOutput };
  }

  function compareParsons(studentLines, modelLines) {
    const student = studentLines || [];
    const model = modelLines || [];
    if (student.length !== model.length) {
      return { ok: false, reason: "Число строк не совпадает с образцом." };
    }
    for (let i = 0; i < model.length; i++) {
      const got = String(student[i].code || "").trim();
      const need = String(model[i].code || "").trim();
      if (got !== need) {
        return {
          ok: false,
          reason: "Порядок другой. Строка " + (i + 1) + " стоит не на своём месте."
        };
      }
      const gotIndent = student[i].indent || 0;
      const needIndent = model[i].indent || 0;
      if (gotIndent !== needIndent) {
        return {
          ok: false,
          reason: "Отступ у строки " + (i + 1) + " не тот. Сдвигов вправо нужно: " + needIndent + " (каждый сдвиг — 4 пробела)."
        };
      }
    }
    return { ok: true };
  }

  function assembleParsons(lines) {
    return (lines || []).map(function (line) {
      const indent = Math.max(0, line.indent || 0);
      return " ".repeat(indent * 4) + String(line.code || "");
    }).join("\n");
  }

  function shuffleParsons(lines, seedKey) {
    const arr = (lines || []).map(function (line) {
      return { code: line.code, indent: 0 };
    });
    let seed = hashString(String(seedKey || "parsons")) || 1;
    function rnd() {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    const same = arr.every(function (line, i) { return line.code === lines[i].code; });
    if (same && arr.length > 1) {
      const tmp = arr[0];
      arr[0] = arr[1];
      arr[1] = tmp;
    }
    return arr;
  }

  function stripCommentLine(line) {
    let inStr = null;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inStr) {
        if (ch === "\\" && i + 1 < line.length) { i++; continue; }
        if (ch === inStr) inStr = null;
      } else if (ch === '"' || ch === "'") {
        inStr = ch;
      } else if (ch === "#") {
        return line.slice(0, i);
      }
    }
    return line;
  }

  function splitTopComma(str) {
    const res = [];
    let cur = "";
    let inStr = null;
    let depth = 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (inStr) {
        cur += ch;
        if (ch === "\\" && i + 1 < str.length) { cur += str[++i]; continue; }
        if (ch === inStr) inStr = null;
      } else if (ch === '"' || ch === "'") {
        inStr = ch;
        cur += ch;
      } else if (ch === "(" || ch === "[" || ch === "{") {
        depth++;
        cur += ch;
      } else if (ch === ")" || ch === "]" || ch === "}") {
        depth--;
        cur += ch;
      } else if (ch === "," && depth === 0) {
        res.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    if (cur.trim() !== "") res.push(cur.trim());
    return res;
  }

  function findAssignEq(clean) {
    let inS = null;
    let depth = 0;
    for (let i = 0; i < clean.length; i++) {
      const c = clean[i];
      if (inS) {
        if (c === "\\") { i++; continue; }
        if (c === inS) inS = null;
      } else if (c === '"' || c === "'") {
        inS = c;
      } else if (c === "(") {
        depth++;
      } else if (c === ")") {
        depth--;
      } else if (
        c === "=" &&
        depth === 0 &&
        clean[i + 1] !== "=" &&
        clean[i - 1] !== "!" &&
        clean[i - 1] !== "<" &&
        clean[i - 1] !== ">" &&
        clean[i - 1] !== "="
      ) {
        return i;
      }
    }
    return -1;
  }

  function isWrappedParens(expr) {
    if (!expr || expr[0] !== "(" || expr[expr.length - 1] !== ")") return false;
    let depth = 0;
    let inS = null;
    for (let i = 0; i < expr.length; i++) {
      const c = expr[i];
      if (inS) {
        if (c === "\\") { i++; continue; }
        if (c === inS) inS = null;
        continue;
      }
      if (c === '"' || c === "'") { inS = c; continue; }
      if (c === "(") depth++;
      else if (c === ")") {
        depth--;
        if (depth === 0 && i !== expr.length - 1) return false;
      }
    }
    return depth === 0;
  }

  function matchOuterCall(expr) {
    const m = expr.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\(/);
    if (!m) return null;
    const start = m[0].length - 1;
    let depth = 0;
    let inS = null;
    for (let i = start; i < expr.length; i++) {
      const c = expr[i];
      if (inS) {
        if (c === "\\") { i++; continue; }
        if (c === inS) inS = null;
        continue;
      }
      if (c === '"' || c === "'") { inS = c; continue; }
      if (c === "(") depth++;
      else if (c === ")") {
        depth--;
        if (depth === 0) {
          if (expr.slice(i + 1).trim() !== "") return null;
          return { name: m[1], inner: expr.slice(start + 1, i).trim() };
        }
      }
    }
    throw new Error("SyntaxError: незакрытая скобка");
  }

  function isCompleteString(expr) {
    if (!expr || expr.length < 2) return false;
    const q = expr[0];
    if (q !== '"' && q !== "'") return false;
    for (let i = 1; i < expr.length; i++) {
      if (expr[i] === "\\") { i++; continue; }
      if (expr[i] === q) return i === expr.length - 1;
    }
    return false;
  }

  function unquote(expr) {
    let out = "";
    for (let i = 1; i < expr.length - 1; i++) {
      if (expr[i] === "\\" && i + 1 < expr.length - 1) {
        const n = expr[++i];
        if (n === "n") out += "\n";
        else if (n === "t") out += "\t";
        else out += n;
      } else {
        out += expr[i];
      }
    }
    return out;
  }

  function findLowestOp(expr) {
    let depth = 0;
    let inS = null;
    let best = null;
    for (let i = 0; i < expr.length; i++) {
      const c = expr[i];
      if (inS) {
        if (c === "\\") { i++; continue; }
        if (c === inS) inS = null;
        continue;
      }
      if (c === '"' || c === "'") { inS = c; continue; }
      if (c === "(") { depth++; continue; }
      if (c === ")") { depth--; continue; }
      if (depth !== 0) continue;

      let op = null;
      let prec = 99;
      let len = 1;
      if (c === "=" && expr[i + 1] === "=") { op = "=="; prec = 0; len = 2; }
      else if (c === "!" && expr[i + 1] === "=") { op = "!="; prec = 0; len = 2; }
      else if (c === "<" && expr[i + 1] === "=") { op = "<="; prec = 0; len = 2; }
      else if (c === ">" && expr[i + 1] === "=") { op = ">="; prec = 0; len = 2; }
      else if (c === "<" || c === ">") { op = c; prec = 0; len = 1; }
      else if (c === "*" && expr[i + 1] === "*") { op = "**"; prec = 3; len = 2; }
      else if (c === "/" && expr[i + 1] === "/") { op = "//"; prec = 2; len = 2; }
      else if (c === "+" || c === "-") {
        let k = i - 1;
        while (k >= 0 && expr[k] === " ") k--;
        if (k < 0) continue;
        const prev = expr[k];
        if ("+-*/%(".indexOf(prev) !== -1) continue;
        op = c;
        prec = 1;
        len = 1;
      } else if (c === "*" || c === "/" || c === "%") {
        op = c;
        prec = 2;
        len = 1;
      }

      if (!op) continue;
      if (!best || prec < best.prec || (prec === best.prec && op !== "**")) {
        if (!(op === "**" && best && best.op === "**")) best = { index: i, op: op, prec: prec, len: len };
      }
      i += len - 1;
    }
    return best;
  }

  function applyOp(op, left, right) {
    if (op === "+") {
      if (typeof left === "string" || typeof right === "string") {
        if (typeof left !== "string" || typeof right !== "string") {
          throw new Error("TypeError: can only concatenate str (not int) to str");
        }
        return left + right;
      }
      return Number(left) + Number(right);
    }
    if (op === "-") return Number(left) - Number(right);
    if (op === "*") {
      if (typeof left === "string" && typeof right === "number") return left.repeat(right);
      if (typeof right === "string" && typeof left === "number") return right.repeat(left);
      return Number(left) * Number(right);
    }
    if (op === "/") {
      if (Number(right) === 0) throw new Error("ZeroDivisionError");
      return Number(left) / Number(right);
    }
    if (op === "//") {
      if (Number(right) === 0) throw new Error("ZeroDivisionError");
      return Math.floor(Number(left) / Number(right));
    }
    if (op === "%") {
      if (Number(right) === 0) throw new Error("ZeroDivisionError");
      return Number(left) % Number(right);
    }
    if (op === "**") return Math.pow(Number(left), Number(right));
    if (op === "==") return typeof left === typeof right && left === right;
    if (op === "!=") return !(typeof left === typeof right && left === right);
    const L = Number(left);
    const R = Number(right);
    if (op === "<") return L < R;
    if (op === ">") return L > R;
    if (op === "<=") return L <= R;
    if (op === ">=") return L >= R;
    throw new Error("SyntaxError: неизвестная операция " + op);
  }

  function formatPy(v) {
    if (typeof v === "boolean") return v ? "True" : "False";
    if (typeof v === "number") {
      if (!Number.isFinite(v)) throw new Error("ZeroDivisionError");
      if (Object.is(v, -0)) return "0";
      return String(v);
    }
    return String(v);
  }

  function evalExprSync(expr, env, readInput) {
    expr = String(expr).trim();
    if (!expr) throw new Error("SyntaxError: пустое выражение");

    let q = null;
    for (let i = 0; i < expr.length; i++) {
      if (q) {
        if (expr[i] === "\\") { i++; continue; }
        if (expr[i] === q) q = null;
      } else if (expr[i] === '"' || expr[i] === "'") {
        q = expr[i];
      }
    }
    if (q) throw new Error("SyntaxError: EOL while scanning string literal");

    if (isWrappedParens(expr)) return evalExprSync(expr.slice(1, -1), env, readInput);

    const call = matchOuterCall(expr);
    if (call) {
      const known = { int: 1, float: 1, str: 1, input: 1, len: 1, abs: 1, round: 1 };
      if (!known[call.name]) throw new Error("NameError: name '" + call.name + "' is not defined");
      if (call.name === "input") {
        const prompt = call.inner ? String(evalExprSync(call.inner, env, readInput)) : "";
        return readInput(prompt);
      }
      const v = call.inner ? evalExprSync(call.inner, env, readInput) : "";
      if (call.name === "int") {
        if (typeof v === "number" && Number.isInteger(v)) return v;
        if (typeof v === "string" && !/^\s*[+-]?\d+\s*$/.test(v)) {
          throw new Error("ValueError: invalid literal for int()");
        }
        const n = parseInt(v, 10);
        if (Number.isNaN(n)) throw new Error("ValueError: invalid literal for int()");
        return n;
      }
      if (call.name === "float") {
        const n = Number(v);
        if (Number.isNaN(n)) throw new Error("ValueError: could not convert to float");
        return n;
      }
      if (call.name === "str") return String(v);
      if (call.name === "len") return String(v).length;
      if (call.name === "abs") return Math.abs(Number(v));
      if (call.name === "round") return Math.round(Number(v));
    }

    if (isCompleteString(expr)) return unquote(expr);
    if (/^[+-]?\d+$/.test(expr)) return parseInt(expr, 10);
    if (/^[+-]?\d+\.\d+$/.test(expr)) return parseFloat(expr);
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(expr)) {
      if (!Object.prototype.hasOwnProperty.call(env, expr)) {
        throw new Error("NameError: name '" + expr + "' is not defined");
      }
      return env[expr];
    }

    const found = findLowestOp(expr);
    if (!found) throw new Error("SyntaxError: не понимаю выражение");
    const left = evalExprSync(expr.slice(0, found.index), env, readInput);
    const right = evalExprSync(expr.slice(found.index + found.len), env, readInput);
    return applyOp(found.op, left, right);
  }

  function snapshotEnv(env) {
    const out = {};
    Object.keys(env).forEach(function (key) {
      out[key] = formatPy(env[key]);
    });
    return out;
  }

  function execTraceLine(clean, env, readInput, write) {
    if (/^print\s*\(/.test(clean)) {
      if (!clean.endsWith(")")) throw new Error("SyntaxError: не закрыта скобка ) в print");
      const inner = clean.slice(clean.indexOf("(") + 1, -1);
      const args = inner.trim() ? splitTopComma(inner) : [];
      let sep = " ";
      let end = "\n";
      const parts = [];
      args.forEach(function (arg) {
        if (/^sep\s*=/.test(arg)) sep = String(evalExprSync(arg.replace(/^sep\s*=/, ""), env, readInput));
        else if (/^end\s*=/.test(arg)) end = String(evalExprSync(arg.replace(/^end\s*=/, ""), env, readInput));
        else parts.push(formatPy(evalExprSync(arg, env, readInput)));
      });
      write(parts.join(sep) + end);
      return "print показывает результат на экране.";
    }

    const eq = findAssignEq(clean);
    if (eq !== -1) {
      const lhs = splitTopComma(clean.slice(0, eq));
      const rhs = splitTopComma(clean.slice(eq + 1));
      if (lhs.length !== rhs.length) throw new Error("ValueError: количество переменных не совпадает");
      const vals = rhs.map(function (part) { return evalExprSync(part, env, readInput); });
      for (let i = 0; i < lhs.length; i++) {
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(lhs[i])) {
          throw new Error("SyntaxError: неправильное имя переменной");
        }
        env[lhs[i]] = vals[i];
      }
      if (lhs.length === 2 && rhs[0] === lhs[1] && rhs[1] === lhs[0]) {
        return "Меняем значения " + lhs[0] + " и " + lhs[1] + " местами.";
      }
      return "В переменную " + lhs.join(", ") + " записали новое значение.";
    }

    evalExprSync(clean, env, readInput);
    return "Эта строка выполнилась.";
  }

  function buildTrace(code, options) {
    const opts = options || {};
    const inputs = (opts.inputs || []).map(function (item) { return String(item); });
    let inputIdx = 0;
    const lines = String(code || "").replace(/\r\n/g, "\n").split("\n");
    const env = {};
    let output = "";
    const steps = [{
      line: -1,
      vars: {},
      output: "",
      note: "Старт. Python ещё не прочитал ни одной строки."
    }];

    function readInput() {
      if (inputIdx >= inputs.length) throw new Error("В примере закончились готовые ответы для input()");
      return inputs[inputIdx++];
    }

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const clean = stripCommentLine(raw).trim();
      if (!clean) {
        steps.push({
          line: i,
          vars: snapshotEnv(env),
          output: output,
          note: raw.trim().charAt(0) === "#"
            ? "Это комментарий. Python его пропускает."
            : "Пустая строка. Идём дальше."
        });
        continue;
      }
      try {
        const note = execTraceLine(clean, env, readInput, function (chunk) { output += chunk; });
        steps.push({ line: i, vars: snapshotEnv(env), output: output, note: note });
      } catch (err) {
        steps.push({
          line: i,
          vars: snapshotEnv(env),
          output: output,
          error: translatePythonError(err),
          note: "На этой строке программа остановилась."
        });
        break;
      }
    }
    return { lines: lines, steps: steps };
  }

  global.PyEngine = {
    preprocessFStrings: preprocessFStrings,
    translatePythonError: translatePythonError,
    executePython: executePython,
    runTests: runTests,
    linesEqual: linesEqual,
    normalizeLine: normalizeLine,
    outputLines: outputLines,
    variantGenerator: variantGenerator,
    hashString: hashString,
    buildTrace: buildTrace,
    compareParsons: compareParsons,
    assembleParsons: assembleParsons,
    shuffleParsons: shuffleParsons,
    DEFAULT_FLOAT_TOLERANCE: DEFAULT_FLOAT_TOLERANCE
  };

})(typeof window !== "undefined" ? window : globalThis);
