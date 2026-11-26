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
assert(chapters.slice(3).every(function (ch) { return ch.comingSoon && ch.tasks.length === 0; }), "stubs soon");
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
