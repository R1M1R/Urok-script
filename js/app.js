/* ПайтонЛаб 7 — экраны, 4 типа практики, оценки, журнал учителя. */
(function () {
  "use strict";

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwGfcYizgU-I-7xgJFCkzlatMvY2W6Y1ct1VuKm3UDvhfFSqz3RFBzYGDRw3DS1HnLt/exec";
  const STORAGE_KEY = "pylab7_state_v2";
  const LEGACY_KEY = "pylab7_state_v1";
  const TEACHER_PIN = "2026";

  const SYMBOLS = [
    { label: 'print("")', insert: 'print("")', back: 2, groups: ["print", "input", "types", "loops", "all"] },
    { label: "input()", insert: "input()", back: 1, groups: ["input", "all"] },
    { label: "int()", insert: "int()", back: 1, groups: ["input", "types", "math", "all"] },
    { label: "float()", insert: "float()", back: 1, groups: ["types", "math", "all"] },
    { label: "math.", insert: "math.", back: 0, groups: ["math", "all"] },
    { label: "if ", insert: "if ", back: 0, groups: ["cond", "loops", "all"] },
    { label: "elif ", insert: "elif ", back: 0, groups: ["cond", "all"] },
    { label: "else:", insert: "else:", back: 0, groups: ["cond", "loops", "all"] },
    { label: "and", insert: " and ", back: 0, groups: ["cond", "all"] },
    { label: "or", insert: " or ", back: 0, groups: ["cond", "all"] },
    { label: "==", insert: " == ", back: 0, groups: ["cond", "all"] },
    { label: "!=", insert: " != ", back: 0, groups: ["cond", "all"] },
    { label: "for i in range():", insert: "for i in range():", back: 2, groups: ["loops", "all"] },
    { label: "while ", insert: "while ", back: 0, groups: ["loops", "all"] },
    { label: "break", insert: "break", back: 0, groups: ["loops", "all"] },
    { label: "continue", insert: "continue", back: 0, groups: ["loops", "all"] },
    { label: '""', insert: '""', back: 1, groups: ["print", "input", "types", "all"] },
    { label: "()", insert: "()", back: 1, groups: ["print", "input", "types", "math", "all"] },
    { label: "=", insert: " = ", back: 0, groups: ["print", "input", "types", "all"] },
    { label: ":", insert: ":", back: 0, groups: ["cond", "loops", "print", "all"] },
    { label: "↹ Tab", insert: "    ", back: 0, groups: ["cond", "loops", "print", "all"] },
    { label: "#", insert: "# ", back: 0, groups: ["print", "all"] },
    { label: ",", insert: ", ", back: 0, groups: ["input", "print", "all"] },
    { label: "//", insert: " // ", back: 0, groups: ["types", "math", "all"] },
    { label: "%", insert: " % ", back: 0, groups: ["types", "loops", "all"] },
    { label: "**", insert: " ** ", back: 0, groups: ["types", "math", "all"] }
  ];

  const TOPICS = [
    { id: "print", label: "Вывод" },
    { id: "input", label: "Ввод" },
    { id: "types", label: "Типы" },
    { id: "math", label: "math" },
    { id: "cond", label: "if" },
    { id: "loops", label: "Циклы" },
    { id: "all", label: "Все" }
  ];

  const TYPE_LABEL = {
    code: "Код",
    parsons: "Конструктор",
    predict: "Предсказание",
    blanks: "Пропуски"
  };

  const SANDBOX_PRESETS = {
    hello: "# Твой первый скрипт на Python\nname = input(\"Как тебя зовут? \")\nprint(\"Привет,\", name + \"!\")\nprint(\"Добро пожаловать в мир кода\")",
    calc: "# Мини-калькулятор\na = int(input(\"Первое число: \"))\nb = int(input(\"Второе число: \"))\nprint(\"Сумма:\", a + b)\nprint(\"Произведение:\", a * b)\nprint(\"Целое деление:\", a // b)\nprint(\"Остаток:\", a % b)",
    quest: "# Мини-анкета 7 класса\nname = input(\"Твоё имя: \")\ngame = input(\"Любимая игра или спорт: \")\nage = int(input(\"Сколько тебе лет? \"))\nprint(\"----------------\")\nprint(name, \"— фанат\", game)\nprint(\"Через 5 лет тебе будет:\", age + 5)",
    guess: "# Угадай число\nsecret = 7\nprint(\"Я загадал число от 1 до 10\")\nwhile True:\n    guess = int(input(\"Твоя догадка: \"))\n    if guess == secret:\n        print(\"Угадал\")\n        break\n    elif guess < secret:\n        print(\"Больше\")\n    else:\n        print(\"Меньше\")",
    mathcalc: "# Калькулятор math\nimport math\nprint(\"1 — корень, 2 — степень, 3 — округление вверх\")\nchoice = input(\"Что считаем? \")\nx = float(input(\"Число: \"))\nif choice == \"1\":\n    print(math.sqrt(x))\nelif choice == \"2\":\n    power = float(input(\"Степень: \"))\n    print(math.pow(x, power))\nelse:\n    print(math.ceil(x))",
    clear: ""
  };

  let state = loadState();
  let currentHintStep = 0;
  let isRunning = false;
  let runToken = 0;
  let skulptReady = false;
  let selectedCls = state.studentClass || "";
  let activeInput = null;
  let logoTaps = [];

  function createDefaultState() {
    return {
      schema: 2,
      studentName: "",
      studentClass: "",
      activeChapter: 0,
      activeSubtab: "theory",
      activeTaskIdx: {},
      solvedTasks: {},
      solvedQuizzes: {},
      savedCode: {},
      savedLayouts: {},
      savedBlanks: {},
      savedPredict: {},
      symbolTopic: {},
      hintsUsed: 0,
      tabSwitches: 0,
      teacherUnlock: false,
      startedAt: new Date().toISOString()
    };
  }

  function asObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return value;
  }

  function migrateState(parsed) {
    const base = createDefaultState();
    if (!parsed || typeof parsed !== "object") return base;
    const next = Object.assign(base, parsed);
    next.schema = 2;
    if (Array.isArray(parsed.activeTaskIdx)) {
      next.activeTaskIdx = {};
      parsed.activeTaskIdx.forEach(function (n, i) {
        next.activeTaskIdx["ch" + (i + 1)] = n;
      });
    } else {
      next.activeTaskIdx = asObject(parsed.activeTaskIdx);
    }
    if (typeof parsed.activeModule === "number" && typeof parsed.activeChapter !== "number") {
      next.activeChapter = parsed.activeModule;
    }
    next.solvedTasks = asObject(next.solvedTasks);
    next.solvedQuizzes = asObject(next.solvedQuizzes);
    next.savedCode = asObject(next.savedCode);
    next.savedLayouts = asObject(next.savedLayouts);
    next.savedBlanks = asObject(next.savedBlanks);
    next.savedPredict = asObject(next.savedPredict);
    next.symbolTopic = asObject(next.symbolTopic);
    if (typeof next.activeChapter !== "number") next.activeChapter = 0;
    if (typeof next.hintsUsed !== "number") next.hintsUsed = 0;
    if (typeof next.tabSwitches !== "number") next.tabSwitches = 0;
    next.teacherUnlock = !!next.teacherUnlock;
    return next;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return migrateState(JSON.parse(raw));
      const old = localStorage.getItem(LEGACY_KEY);
      if (old) {
        const migrated = migrateState(JSON.parse(old));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    } catch (e) {}
    return createDefaultState();
  }

  function saveState() {
    try {
      state.schema = 2;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function getChapters() {
    return (window.COURSE_CHAPTERS || []).slice().sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    });
  }

  function taskProgressId(task) {
    if (task && task.variant) {
      const variant = window.PyEngine.variantGenerator(state.studentName || "");
      return task.id + "@" + variant.hash;
    }
    return task.id;
  }

  function hydrateTask(task) {
    if (!task) return null;
    const progressId = taskProgressId(task);
    let view = task;
    if (typeof task.build === "function") {
      const variant = window.PyEngine.variantGenerator(state.studentName || "");
      view = Object.assign({}, task, task.build(variant) || {});
      view._variant = variant;
    }
    view.id = task.id;
    view._progressId = progressId;
    view.type = view.type || "code";
    view.hints = view.hints || [];
    view.tests = view.tests || [];
    view.starter = view.starter || "";
    return view;
  }

  function coreTasks(ch) {
    return (ch.tasks || []).filter(function (task) { return !task.extra; });
  }

  function countSolved(tasks) {
    let n = 0;
    (tasks || []).forEach(function (task) {
      if (state.solvedTasks[taskProgressId(task)]) n += 1;
    });
    return n;
  }

  function getChapterGrade(ch) {
    const tasks = coreTasks(ch);
    const quizzes = ch.quizzes || [];
    const extras = (ch.tasks || []).filter(function (task) { return !!task.extra; });
    const td = countSolved(tasks);
    const qd = quizzes.filter(function (quiz) { return !!state.solvedQuizzes[quiz.id]; }).length;
    const T = tasks.length;
    const Q = quizzes.length;
    const base = {
      grade: "—",
      cls: "",
      num: null,
      td: td,
      qd: qd,
      T: T,
      Q: Q,
      hasWork: T + Q > 0,
      extraSolved: countSolved(extras),
      extraTotal: extras.length
    };
    if (!T && !Q) return base;
    const highT = T ? Math.ceil(T * 0.75 - 1e-9) : 0;
    const midT = T ? Math.ceil(T * 0.5 - 1e-9) : 0;
    const midQ = Q ? Math.ceil(Q * 2 / 3 - 1e-9) : 0;
    let num = null;
    if ((T && td >= T) || (T && Q && td >= highT && qd >= Q)) num = 5;
    else if ((T && td >= highT) || (T && Q && td >= midT && qd >= midQ)) num = 4;
    else if ((T && td >= midT) || (td >= 1 && Q && qd >= midQ) || (Q && qd >= Q)) num = 3;
    const map = { 5: "m5", 4: "m4", 3: "m3" };
    base.num = num;
    base.grade = num ? String(num) : "—";
    base.cls = num ? map[num] : "";
    return base;
  }

  function isChapterUnlocked(index) {
    if (state.teacherUnlock) return true;
    if (index <= 1) return true;
    const chapters = getChapters();
    const prev = getChapterGrade(chapters[index - 1]);
    return prev.num !== null && prev.num >= 3;
  }

  function getStats() {
    let totalTasks = 0;
    let solvedTasks = 0;
    let totalQuizzes = 0;
    let solvedQuizzes = 0;
    getChapters().forEach(function (ch) {
      (ch.tasks || []).forEach(function (task) {
        totalTasks += 1;
        if (state.solvedTasks[taskProgressId(task)]) solvedTasks += 1;
      });
      (ch.quizzes || []).forEach(function (quiz) {
        totalQuizzes += 1;
        if (state.solvedQuizzes[quiz.id]) solvedQuizzes += 1;
      });
    });
    const totalSteps = totalTasks + totalQuizzes;
    const doneSteps = solvedTasks + solvedQuizzes;
    const xp = solvedTasks * 25 + solvedQuizzes * 10;
    const pct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;
    return { totalTasks: totalTasks, solvedTasks: solvedTasks, totalQuizzes: totalQuizzes, solvedQuizzes: solvedQuizzes, totalSteps: totalSteps, doneSteps: doneSteps, xp: xp, pct: pct };
  }

  function getFinalGrade(stats) {
    const chapters = getChapters();
    const grades = chapters.map(getChapterGrade);
    const counted = [];
    chapters.forEach(function (ch, index) {
      const grade = grades[index];
      if (!grade.hasWork || !isChapterUnlocked(index)) return;
      if (index <= 1 || grade.td + grade.qd > 0) counted.push(grade);
    });
    const hasMark = counted.some(function (grade) { return grade.num; });
    if (!hasMark) {
      return {
        grade: "—",
        cls: "g2",
        caption: "Закрой хотя бы половину задач в главе — и появится оценка.",
        grades: grades
      };
    }
    const avg = counted.reduce(function (sum, grade) { return sum + (grade.num || 2); }, 0) / counted.length;
    if (avg >= 4.5) return { grade: "5", cls: "", caption: "Отлично! Открытые главы закрыты уверенно.", grades: grades };
    if (avg >= 3.5) return { grade: "4", cls: "g4", caption: "Хорошо. Дожми слабые главы — и будет пятёрка.", grades: grades };
    if (avg >= 2.5) return { grade: "3", cls: "g3", caption: "База есть. Реши ещё задачи, чтобы оценка выросла.", grades: grades };
    return { grade: "2", cls: "g2", caption: "Пока мало верных задач. Начни с первой главы и иди по порядку.", grades: grades };
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }

  function updateTop() {
    const stats = getStats();
    document.getElementById("xpCount").textContent = String(stats.xp);
    const firstName = (state.studentName || "").trim().split(/\s+/).slice(-1)[0] || "программист";
    document.getElementById("heroGreeting").textContent = "Привет, " + firstName + "!";
    document.getElementById("overallProgressBar").style.width = stats.pct + "%";
    document.getElementById("overallProgressText").textContent = "Пройдено " + stats.doneSteps + " из " + stats.totalSteps + " шагов";
    document.getElementById("overallProgressPct").textContent = stats.pct + "%";
    const engineLabel = skulptReady ? "Python 3" : "Офлайн Python";
    document.getElementById("engineDot").className = skulptReady ? "engine-dot" : "engine-dot offline";
    document.getElementById("studentHeaderLabel").textContent = state.studentClass
      ? state.studentClass + " • " + engineLabel
      : engineLabel + " • готов";
    return stats;
  }

  function renderHome() {
    updateTop();
    const chapters = getChapters();
    const track = document.getElementById("chapterTrack");
    const list = document.getElementById("modulesList");
    track.innerHTML = "";
    list.innerHTML = "";

    chapters.forEach(function (ch, index) {
      const unlocked = isChapterUnlocked(index);
      const grade = getChapterGrade(ch);
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chapter-chip" + (unlocked ? " open" : " locked") + (grade.num >= 3 ? " done" : "");
      chip.textContent = (unlocked ? "" : "🔒 ") + (index + 1);
      chip.addEventListener("click", function () { onChapterClick(index); });
      track.appendChild(chip);

      const card = document.createElement("div");
      const done = grade.hasWork && grade.td === grade.T && grade.qd === grade.Q && grade.T + grade.Q > 0;
      card.className = "card module-card" + (done ? " completed" : "") + (!unlocked ? " locked" : "") + (ch.comingSoon ? " soon" : "");

      let statusClass = "new";
      let statusText = "Начать";
      if (!unlocked) { statusClass = "lock"; statusText = "Закрыто"; }
      else if (ch.comingSoon) { statusClass = "soon"; statusText = "Скоро"; }
      else if (done) { statusClass = "done"; statusText = "Пройдена"; }
      else if (grade.td + grade.qd + grade.extraSolved > 0) { statusClass = "inprog"; statusText = "В процессе"; }

      const taskLine = ch.comingSoon
        ? "Материалы этой главы ещё готовятся"
        : "Задачи: " + grade.td + "/" + grade.T + " • Тест: " + grade.qd + "/" + grade.Q +
          (grade.extraTotal ? " • Тренировка: " + grade.extraSolved + "/" + grade.extraTotal : "");

      card.innerHTML =
        "<div class=\"module-head\"><div>" +
        "<span class=\"module-badge\">" + escapeHtml(ch.badge) + "</span>" +
        "<h3 class=\"module-title\">" + (index + 1) + ". " + escapeHtml(ch.title) + "</h3>" +
        "</div><span class=\"pill-status " + statusClass + "\">" + statusText + "</span></div>" +
        "<p class=\"module-desc\">" + escapeHtml(ch.desc) + "</p>" +
        "<div class=\"module-stats\"><span>" + taskLine + "</span><span>" +
        (grade.num ? "Оценка " + grade.grade : (unlocked ? "Открыть" : "Нужна 3")) +
        "</span></div>" +
        (!unlocked ? "<p class=\"lock-note\">Сначала получи оценку 3 или выше за предыдущую главу.</p>" : "");
      card.addEventListener("click", function () { onChapterClick(index); });
      list.appendChild(card);
    });
  }

  function onChapterClick(index) {
    if (!isChapterUnlocked(index)) {
      showToast("Сначала получи 3 или выше за предыдущую главу");
      return;
    }
    openChapter(index, "theory");
  }

  function switchView(viewName) {
    invalidateRun();
    document.querySelectorAll(".view").forEach(function (view) { view.classList.remove("active"); });
    document.getElementById("view-" + viewName).classList.add("active");
    document.querySelectorAll(".nav-item").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.nav === viewName);
    });
    if (viewName === "home") renderHome();
    if (viewName === "report") renderReport();
    if (viewName === "sandbox") renderSymbolBar("sandbox");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function openCurrentPractice() {
    const chapters = getChapters();
    let index = state.activeChapter || 0;
    if (!isChapterUnlocked(index)) {
      index = 0;
      chapters.forEach(function (ch, i) {
        if (isChapterUnlocked(i) && !ch.comingSoon) index = i;
      });
    }
    const chapter = chapters[index];
    const sub = chapter && !chapter.comingSoon && (chapter.tasks || []).length ? "practice" : "theory";
    openChapter(index, sub);
  }

  function openChapter(index, subtab) {
    if (!isChapterUnlocked(index)) {
      showToast("Эта глава ещё закрыта");
      return;
    }
    state.activeChapter = index;
    state.activeSubtab = subtab || "theory";
    saveState();
    const chapter = getChapters()[index];
    document.getElementById("activeModuleHeading").textContent = (index + 1) + ". " + chapter.title;
    switchView("module");
    switchModuleTab(state.activeSubtab);
  }

  function switchModuleTab(subtab) {
    state.activeSubtab = subtab;
    saveState();
    document.querySelectorAll(".seg-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.subtab === subtab);
    });
    document.getElementById("moduleTheoryPane").style.display = subtab === "theory" ? "block" : "none";
    document.getElementById("moduleQuizPane").style.display = subtab === "quiz" ? "block" : "none";
    document.getElementById("modulePracticePane").style.display = subtab === "practice" ? "block" : "none";
    if (subtab === "theory") renderTheory();
    if (subtab === "quiz") renderQuiz();
    if (subtab === "practice") renderPractice();
  }

  function soonCard(title, text) {
    const card = document.createElement("div");
    card.className = "card soon-card";
    const h = document.createElement("h3");
    h.textContent = title;
    const p = document.createElement("p");
    p.textContent = text;
    card.appendChild(h);
    card.appendChild(p);
    return card;
  }

  function renderTheory() {
    const chapter = getChapters()[state.activeChapter];
    const pane = document.getElementById("moduleTheoryPane");
    pane.innerHTML = "";
    if (chapter.comingSoon || !(chapter.theory || []).length) {
      pane.appendChild(soonCard(
        "Скоро",
        "Глава «" + chapter.title + "» (уроки " + chapter.lessons + ") ещё готовится. Теория и задачи появятся здесь."
      ));
      return;
    }
    const plan = renderLessonPlan(chapter);
    if (plan) pane.appendChild(plan);
    chapter.theory.forEach(function (section) {
      const card = document.createElement("div");
      card.className = "card theory-card";
      card.innerHTML = "<h3>" + section.title + "</h3>" + section.body;
      if (section.tryCode) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "try-btn";
        btn.textContent = "▶ Попробовать этот пример в Песочнице";
        btn.addEventListener("click", function () {
          const area = document.getElementById("sandboxCode");
          area.value = section.tryCode;
          updateLineNumbers(area, document.getElementById("sandboxLineNums"));
          switchView("sandbox");
          showToast("Пример загружен. Нажми «Запустить скрипт»");
        });
        card.appendChild(btn);
      }
      if (section.trace && section.trace.code) mountTracer(card, section.trace);
      pane.appendChild(card);
    });
    const next = document.createElement("button");
    next.type = "button";
    next.className = "btn btn-primary btn-full";
    next.textContent = "Всё понятно! К мини-тесту";
    next.addEventListener("click", function () { switchModuleTab("quiz"); });
    pane.appendChild(next);
  }

  function renderLessonPlan(chapter) {
    const items = chapter.plan || [];
    if (!items.length) return null;
    const card = document.createElement("div");
    card.className = "card lesson-plan";
    const heading = document.createElement("h3");
    heading.textContent = "📅 План уроков";
    const note = document.createElement("p");
    note.textContent = "Один пункт — один урок. Фраза «если успели» — запас для тех, кто закончил раньше, на оценку она тоже идёт.";
    const list = document.createElement("ol");
    items.forEach(function (item) {
      const row = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = "Урок " + item.n + ". " + item.title;
      row.appendChild(title);
      row.appendChild(document.createTextNode(item.do));
      list.appendChild(row);
    });
    card.appendChild(heading);
    card.appendChild(note);
    card.appendChild(list);
    return card;
  }

  function mountTracer(host, spec) {
    const trace = window.PyEngine.buildTrace(spec.code, { inputs: spec.inputs || [] });
    let stepIndex = 0;
    const box = document.createElement("div");
    box.className = "tracer";
    box.innerHTML =
      "<div class=\"tracer-head\"><strong></strong><span class=\"tracer-step\"></span></div>" +
      "<div class=\"tracer-code\"></div>" +
      "<div class=\"tracer-controls\">" +
      "<button type=\"button\" class=\"btn btn-secondary\" data-go=\"-1\">◀ Шаг</button>" +
      "<button type=\"button\" class=\"btn btn-primary\" data-go=\"1\">Шаг ▶</button>" +
      "<button type=\"button\" class=\"btn btn-secondary\" data-go=\"0\">Сброс</button>" +
      "</div>" +
      "<table class=\"tracer-vars\"><thead><tr><th>Переменная</th><th>Значение</th></tr></thead><tbody></tbody></table>" +
      "<div class=\"tracer-out\"></div>" +
      "<p class=\"tracer-note\"></p>";
    box.querySelector(".tracer-head strong").textContent = spec.title || "Шаги программы";

    function paint() {
      const step = trace.steps[stepIndex];
      box.querySelector(".tracer-step").textContent = "Шаг " + (stepIndex + 1) + " из " + trace.steps.length;
      const code = box.querySelector(".tracer-code");
      code.innerHTML = "";
      trace.lines.forEach(function (line, index) {
        const row = document.createElement("div");
        row.className = "tracer-line" + (index === step.line ? " active" : "");
        const gutter = document.createElement("span");
        gutter.className = "tracer-gutter";
        gutter.textContent = String(index + 1);
        const text = document.createElement("span");
        text.textContent = line.length ? line : " ";
        row.appendChild(gutter);
        row.appendChild(text);
        code.appendChild(row);
      });
      const body = box.querySelector("tbody");
      body.innerHTML = "";
      const keys = Object.keys(step.vars || {});
      if (!keys.length) {
        const tr = document.createElement("tr");
        tr.innerHTML = "<td colspan=\"2\">Пока нет переменных</td>";
        body.appendChild(tr);
      } else {
        keys.forEach(function (key) {
          const tr = document.createElement("tr");
          const td1 = document.createElement("td");
          const td2 = document.createElement("td");
          td1.textContent = key;
          td2.textContent = step.vars[key];
          tr.appendChild(td1);
          tr.appendChild(td2);
          body.appendChild(tr);
        });
      }
      box.querySelector(".tracer-out").textContent = step.output ? step.output : "(консоль пока пустая)";
      const note = box.querySelector(".tracer-note");
      note.textContent = step.error || step.note || "";
      note.className = "tracer-note" + (step.error ? " bad" : "");
    }

    box.querySelectorAll("[data-go]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const dir = Number(btn.dataset.go);
        if (dir === 0) stepIndex = 0;
        else stepIndex = Math.max(0, Math.min(trace.steps.length - 1, stepIndex + dir));
        paint();
      });
    });
    paint();
    host.appendChild(box);
  }

  function renderQuiz() {
    const chapter = getChapters()[state.activeChapter];
    const pane = document.getElementById("moduleQuizPane");
    pane.innerHTML = "";
    if (!(chapter.quizzes || []).length) {
      pane.appendChild(soonCard("Скоро", "Мини-теста в этой главе пока нет."));
      return;
    }
    chapter.quizzes.forEach(function (quiz) {
      const solved = !!state.solvedQuizzes[quiz.id];
      const card = document.createElement("div");
      card.className = "card quiz-q";
      const title = document.createElement("div");
      title.className = "quiz-q-title";
      title.style.whiteSpace = "pre-line";
      title.textContent = quiz.question;
      card.appendChild(title);
      const feedback = document.createElement("div");
      feedback.className = "quiz-feedback" + (solved ? " show ok" : "");
      if (solved) feedback.textContent = "Верно! " + quiz.explain;
      quiz.options.forEach(function (option, optIdx) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-opt" + (solved && optIdx === quiz.correct ? " correct" : "");
        btn.textContent = option;
        btn.addEventListener("click", function () {
          card.querySelectorAll(".quiz-opt").forEach(function (item) { item.classList.remove("wrong", "correct"); });
          if (optIdx === quiz.correct) {
            btn.classList.add("correct");
            feedback.className = "quiz-feedback show ok";
            feedback.textContent = "Верно! " + quiz.explain;
            if (!state.solvedQuizzes[quiz.id]) {
              state.solvedQuizzes[quiz.id] = true;
              saveState();
              updateTop();
              showToast("+10 XP за верный ответ");
            }
          } else {
            btn.classList.add("wrong");
            feedback.className = "quiz-feedback show err";
            feedback.textContent = "Пока не то. Попробуй другой вариант.";
          }
        });
        card.appendChild(btn);
      });
      card.appendChild(feedback);
      pane.appendChild(card);
    });
    const next = document.createElement("button");
    next.type = "button";
    next.className = "btn btn-success btn-full";
    next.textContent = "К практическим задачам";
    next.addEventListener("click", function () { switchModuleTab("practice"); });
    pane.appendChild(next);
  }

  function getTaskIndex(chapter) {
    const tasks = chapter.tasks || [];
    const n = state.activeTaskIdx[chapter.id];
    if (typeof n !== "number" || n < 0 || n >= tasks.length) return 0;
    return n;
  }

  function getCurrentTask() {
    const chapter = getChapters()[state.activeChapter];
    if (!chapter || !(chapter.tasks || []).length) return null;
    return hydrateTask(chapter.tasks[getTaskIndex(chapter)]);
  }

  function renderPractice() {
    invalidateRun();
    const chapter = getChapters()[state.activeChapter];
    const pills = document.getElementById("taskPills");
    const card = document.getElementById("taskCard");
    pills.innerHTML = "";
    if (chapter.comingSoon || !(chapter.tasks || []).length) {
      card.style.display = "none";
      pills.appendChild(soonCard("Скоро", "Задач в этой главе пока нет."));
      return;
    }
    card.style.display = "block";
    const current = getTaskIndex(chapter);
    chapter.tasks.forEach(function (task, index) {
      const pill = document.createElement("button");
      pill.type = "button";
      const solved = !!state.solvedTasks[taskProgressId(task)];
      pill.className = "task-pill" + (index === current ? " active" : "") + (solved ? " solved" : "");
      pill.textContent = (solved ? "✓ " : "") + (task.extra ? "Тренировка" : "Задача " + (state.activeChapter + 1) + "." + (index + 1));
      pill.addEventListener("click", function () {
        state.activeTaskIdx[chapter.id] = index;
        saveState();
        renderPractice();
      });
      pills.appendChild(pill);
    });

    const task = hydrateTask(chapter.tasks[current]);
    currentHintStep = 0;
    const solved = !!state.solvedTasks[task._progressId];
    document.getElementById("taskBadge").textContent = task.extra
      ? "Тренировка"
      : "Задача " + (state.activeChapter + 1) + "." + (current + 1);
    document.getElementById("taskTypeBadge").textContent = TYPE_LABEL[task.type] || "Код";
    const status = document.getElementById("taskStatusBadge");
    status.className = "pill-status " + (solved ? "done" : "new");
    status.textContent = solved ? "Решена (+25 XP)" : "Не решена";
    document.getElementById("taskTitle").textContent = task.title;
    const description = document.getElementById("taskDescription");
    description.innerHTML = task.desc || "";
    if (task.sandboxPreset) {
      const openSandbox = document.createElement("button");
      openSandbox.type = "button";
      openSandbox.className = "btn btn-secondary";
      openSandbox.style.marginTop = "10px";
      openSandbox.textContent = "Открыть заготовку в Песочнице";
      openSandbox.addEventListener("click", function () {
        loadSandboxPreset(task.sandboxPreset);
        switchView("sandbox");
        showToast("Заготовка в песочнице. Запусти и поиграй, потом допиши свою версию в задаче.");
      });
      description.appendChild(openSandbox);
    }
    const hintBox = document.getElementById("hintBox");
    hintBox.classList.remove("show");
    hintBox.textContent = "";
    document.getElementById("hintCounter").textContent = "Подсказок: " + task.hints.length;
    document.getElementById("practiceTestResult").className = "test-result";
    document.getElementById("nextTaskWrap").style.display = solved ? "block" : "none";
    clearConsole("practice", "Нажми «Запустить», чтобы посмотреть, или «Проверить», чтобы сдать.");

    const showEditor = task.type === "code";
    const showSymbols = task.type === "code" || task.type === "blanks";
    const showConsole = task.type !== "predict";
    document.getElementById("symbolWrap").style.display = showSymbols ? "block" : "none";
    document.getElementById("symbolWrap").classList.toggle("flat", showSymbols && !showEditor);
    document.getElementById("practiceEditorBlock").classList.toggle("stacked", showSymbols && showEditor);
    document.getElementById("practiceEditorBlock").style.display = showEditor ? "block" : "none";
    document.getElementById("practiceConsole").style.display = showConsole ? "block" : "none";
    document.getElementById("runPracticeBtn").style.display = task.type === "predict" ? "none" : "";
    document.getElementById("practiceAlt").style.display = showEditor ? "none" : "block";
    document.getElementById("practiceAlt").innerHTML = "";

    if (showSymbols) renderSymbolBar("practice");
    if (task.type === "code") fillCodeEditor(task);
    if (task.type === "parsons") renderParsons(task);
    if (task.type === "predict") renderPredict(task);
    if (task.type === "blanks") renderBlanks(task);
  }

  function fillCodeEditor(task) {
    const area = document.getElementById("practiceCode");
    const saved = state.savedCode[task._progressId];
    area.value = saved !== undefined ? saved : task.starter;
    updateLineNumbers(area, document.getElementById("practiceLineNums"));
  }

  function renderParsons(task) {
    const layout = getParsonsLayout(task);
    const host = document.getElementById("practiceAlt");
    const list = document.createElement("div");
    list.className = "parsons-list";
    layout.forEach(function (line, index) {
      const row = document.createElement("div");
      row.className = "parsons-row";
      const code = document.createElement("div");
      code.className = "parsons-code";
      code.style.paddingLeft = ((line.indent || 0) * 14) + "px";
      code.textContent = line.code;
      const left = iconButton("←", function () { moveIndent(task, index, -1); });
      const right = iconButton("→", function () { moveIndent(task, index, 1); });
      const up = iconButton("↑", function () { moveLine(task, index, -1); });
      const down = iconButton("↓", function () { moveLine(task, index, 1); });
      row.appendChild(left);
      row.appendChild(right);
      row.appendChild(code);
      row.appendChild(up);
      row.appendChild(down);
      list.appendChild(row);
    });
    host.appendChild(list);
    const preview = document.createElement("pre");
    preview.className = "parsons-preview";
    preview.textContent = window.PyEngine.assembleParsons(layout) || "(пусто)";
    host.appendChild(preview);
  }

  function iconButton(label, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "icon-btn";
    btn.textContent = label;
    btn.addEventListener("click", onClick);
    return btn;
  }

  function getParsonsLayout(task) {
    const saved = state.savedLayouts[task._progressId];
    if (Array.isArray(saved) && sameLineSet(saved, task.lines)) {
      return saved.map(function (line) { return { code: line.code, indent: line.indent || 0 }; });
    }
    const fresh = window.PyEngine.shuffleParsons(task.lines, (state.studentName || "") + "|" + task.id);
    state.savedLayouts[task._progressId] = fresh;
    saveState();
    return fresh;
  }

  function sameLineSet(saved, model) {
    const a = saved.map(function (line) { return line.code; }).slice().sort().join("\n");
    const b = model.map(function (line) { return line.code; }).slice().sort().join("\n");
    return a === b;
  }

  function moveLine(task, index, dir) {
    const layout = getParsonsLayout(task);
    const next = index + dir;
    if (next < 0 || next >= layout.length) return;
    const tmp = layout[index];
    layout[index] = layout[next];
    layout[next] = tmp;
    state.savedLayouts[task._progressId] = layout;
    saveState();
    renderPractice();
  }

  function moveIndent(task, index, dir) {
    const layout = getParsonsLayout(task);
    const indent = Math.max(0, Math.min(6, (layout[index].indent || 0) + dir));
    layout[index].indent = indent;
    state.savedLayouts[task._progressId] = layout;
    saveState();
    renderPractice();
  }

  function renderPredict(task) {
    const host = document.getElementById("practiceAlt");
    const sample = document.createElement("pre");
    sample.className = "code-sample";
    sample.textContent = task.predictCode || "";
    const label = document.createElement("p");
    label.textContent = "Напиши вывод программы:";
    const area = document.createElement("textarea");
    area.id = "predictAnswer";
    area.className = "predict-box";
    area.spellcheck = false;
    area.placeholder = "Каждая строка экрана — с новой строки";
    area.value = state.savedPredict[task._progressId] || "";
    area.addEventListener("input", function () {
      state.savedPredict[task._progressId] = area.value;
      saveState();
    });
    blockPaste(area);
    host.appendChild(sample);
    host.appendChild(label);
    host.appendChild(area);
  }

  function renderBlanks(task) {
    const host = document.getElementById("practiceAlt");
    const parts = String(task.template || "").split("___");
    const saved = state.savedBlanks[task._progressId] || [];
    const editor = document.createElement("div");
    editor.className = "blanks-editor";
    const lines = String(task.template || "").split("\n");
    let blankIndex = 0;
    lines.forEach(function (line) {
      const row = document.createElement("div");
      row.className = "blanks-line";
      const chunks = line.split("___");
      chunks.forEach(function (chunk, chunkIndex) {
        if (chunk) {
          const span = document.createElement("span");
          span.className = "blanks-text";
          span.textContent = chunk;
          row.appendChild(span);
        }
        if (chunkIndex < chunks.length - 1) {
          const input = document.createElement("input");
          input.className = "blank-input";
          input.type = "text";
          input.spellcheck = false;
          input.autocomplete = "off";
          input.placeholder = "???";
          input.value = saved[blankIndex] || "";
          const captured = blankIndex;
          input.addEventListener("input", function () {
            const values = readBlanks();
            values[captured] = input.value;
            state.savedBlanks[task._progressId] = values;
            saveState();
          });
          blockPaste(input);
          row.appendChild(input);
          blankIndex += 1;
        }
      });
      editor.appendChild(row);
    });
    host.appendChild(editor);
    if (parts.length < 2) {
      const note = document.createElement("p");
      note.textContent = "В этой задаче нет пропусков.";
      host.appendChild(note);
    }
  }

  function readBlanks() {
    return Array.prototype.map.call(document.querySelectorAll("#practiceAlt .blank-input"), function (input) {
      return input.value;
    });
  }

  function assembleBlanks(task, values) {
    const parts = String(task.template || "").split("___");
    let code = "";
    parts.forEach(function (part, index) {
      code += part;
      if (index < parts.length - 1) code += values[index] || "";
    });
    return code;
  }

  function currentCode() {
    const task = getCurrentTask();
    if (!task) return "";
    if (task.type === "parsons") return window.PyEngine.assembleParsons(getParsonsLayout(task));
    if (task.type === "blanks") return assembleBlanks(task, readBlanks());
    if (task.type === "predict") return task.predictCode || "";
    return document.getElementById("practiceCode").value;
  }

  function saveCurrentCode() {
    const task = getCurrentTask();
    if (!task || task.type !== "code") return;
    state.savedCode[task._progressId] = document.getElementById("practiceCode").value;
    saveState();
  }

  function resetCurrentTask() {
    const task = getCurrentTask();
    if (!task) return;
    if (task.type === "parsons") {
      delete state.savedLayouts[task._progressId];
      saveState();
      renderPractice();
      showToast("Строки перемешаны заново");
      return;
    }
    if (task.type === "predict") {
      delete state.savedPredict[task._progressId];
      saveState();
      renderPractice();
      showToast("Ответ стёрт");
      return;
    }
    if (task.type === "blanks") {
      delete state.savedBlanks[task._progressId];
      saveState();
      renderPractice();
      showToast("Пропуски очищены");
      return;
    }
    document.getElementById("practiceCode").value = task.starter || "";
    saveCurrentCode();
    updateLineNumbers(document.getElementById("practiceCode"), document.getElementById("practiceLineNums"));
    showToast("Код сброшен к шаблону");
  }

  function showNextHint() {
    const task = getCurrentTask();
    if (!task || !task.hints.length) {
      showToast("У этой задачи нет подсказок");
      return;
    }
    if (currentHintStep >= task.hints.length) {
      showToast("Все подсказки уже открыты");
      return;
    }
    const box = document.getElementById("hintBox");
    const text = task.hints[currentHintStep];
    currentHintStep += 1;
    state.hintsUsed += 1;
    saveState();
    box.style.whiteSpace = "pre-line";
    box.textContent = "Подсказка " + currentHintStep + "/" + task.hints.length + ":\n" + text;
    box.classList.add("show");
    document.getElementById("hintCounter").textContent = currentHintStep < task.hints.length
      ? "Есть ещё подсказка (" + currentHintStep + "/" + task.hints.length + ")"
      : "Открыты все подсказки";
  }

  function invalidateRun() {
    runToken += 1;
    isRunning = false;
    cancelConsoleInput();
  }

  function cancelConsoleInput() {
    if (!activeInput) return;
    const finish = activeInput;
    activeInput = null;
    finish("");
  }

  function waitForConsoleInput(prefix, promptText) {
    cancelConsoleInput();
    return new Promise(function (resolve) {
      const row = document.getElementById(prefix + "InputRow");
      const label = document.getElementById(prefix + "InputPrompt");
      const field = document.getElementById(prefix + "InputField");
      const btn = document.getElementById(prefix + "InputSend");
      label.textContent = promptText ? "⌨️ " + promptText : "⌨️ Программа ждёт ввод (input):";
      field.value = "";
      row.classList.add("active");
      let settled = false;
      function finish(value) {
        if (settled) return;
        settled = true;
        if (activeInput === finish) activeInput = null;
        row.classList.remove("active");
        btn.removeEventListener("click", submit);
        field.removeEventListener("keydown", onKey);
        resolve(value);
      }
      function submit() { finish(field.value); }
      function onKey(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          submit();
        }
      }
      activeInput = finish;
      btn.addEventListener("click", submit);
      field.addEventListener("keydown", onKey);
      setTimeout(function () { if (!settled) field.focus(); }, 40);
    });
  }

  function clearConsole(prefix, placeholder) {
    const out = document.getElementById(prefix + "ConsoleOut");
    const err = document.getElementById(prefix + "ConsoleErr");
    const status = document.getElementById(prefix + "ConsoleStatus");
    out.style.color = "#64748b";
    out.textContent = placeholder || "";
    err.style.display = "none";
    err.textContent = "";
    if (status) status.textContent = prefix === "sandbox" ? "Готов" : "Ожидание запуска";
    const row = document.getElementById(prefix + "InputRow");
    if (row) row.classList.remove("active");
  }

  async function runInteractive(prefix, code) {
    if (isRunning) return;
    const token = ++runToken;
    isRunning = true;
    const out = document.getElementById(prefix + "ConsoleOut");
    const err = document.getElementById(prefix + "ConsoleErr");
    const status = document.getElementById(prefix + "ConsoleStatus");
    out.style.color = "#e2e8f0";
    out.textContent = "";
    err.style.display = "none";
    status.textContent = "Выполняется...";
    let collected = "";
    try {
      await window.PyEngine.executePython(code, {
        isTestMode: false,
        onOutput: function (txt) {
          if (token !== runToken) return;
          collected += txt;
          out.textContent = collected;
        },
        onInput: async function (promptText) {
          if (token !== runToken) return "";
          status.textContent = "Ждёт ввод...";
          const value = await waitForConsoleInput(prefix, promptText);
          if (token !== runToken) return value;
          collected += (promptText ? promptText + " " : "> ") + value + "\n";
          out.textContent = collected;
          status.textContent = "Выполняется...";
          return value;
        }
      });
      if (token !== runToken) return;
      if (!collected) {
        out.style.color = "#94a3b8";
        out.textContent = "(Скрипт выполнился, но ничего не вывел. Не забыл print?)";
      }
      status.textContent = "Готово";
    } catch (errValue) {
      if (token !== runToken) return;
      err.textContent = window.PyEngine.translatePythonError(errValue);
      err.style.display = "block";
      status.textContent = "Ошибка";
    } finally {
      if (token === runToken) isRunning = false;
    }
  }

  function runPractice() {
    const task = getCurrentTask();
    if (!task || task.type === "predict") return;
    if (task.type === "code") saveCurrentCode();
    const code = currentCode();
    if (task.type === "blanks" && blankMissing(code, task)) {
      showResult(false, "Заполни все пустые места, потом запускай.");
      return;
    }
    runInteractive("practice", code);
  }

  function blankMissing(code, task) {
    const values = readBlanks();
    return values.some(function (value) { return !String(value).trim(); }) || !String(code).trim();
  }

  function showResult(ok, html) {
    const box = document.getElementById("practiceTestResult");
    box.className = "test-result show " + (ok ? "pass" : "fail");
    box.innerHTML = html;
  }

  function formatTestFail(result) {
    if (!result) return "Проверка не прошла.";
    if (result.kind === "error") return escapeHtml(result.error || "Ошибка");
    const inputs = result.inputs && result.inputs.length
      ? "<br><strong>Входные данные теста:</strong> " + escapeHtml(result.inputs.join(", "))
      : "";
    return "<strong>Тест " + (result.testIndex + 1) + " не пройден.</strong>" + inputs +
      "<br><strong>Ожидалось:</strong><br><code style=\"white-space:pre;\">" + escapeHtml((result.expected || []).join("\n")) + "</code>" +
      "<br><strong>Твоя программа вывела:</strong><br><code style=\"white-space:pre;\">" + escapeHtml((result.actual || []).join("\n") || "(пусто)") + "</code>";
  }

  function markSolved(task) {
    const first = !state.solvedTasks[task._progressId];
    state.solvedTasks[task._progressId] = true;
    saveState();
    updateTop();
    const status = document.getElementById("taskStatusBadge");
    status.className = "pill-status done";
    status.textContent = "Решена (+25 XP)";
    document.getElementById("nextTaskWrap").style.display = "block";
    document.querySelectorAll("#taskPills .task-pill").forEach(function (pill, index) {
      const chapter = getChapters()[state.activeChapter];
      const item = chapter.tasks[index];
      if (item && state.solvedTasks[taskProgressId(item)]) pill.classList.add("solved");
    });
    if (first) showToast("+25 XP. Отличная работа!");
    return first;
  }

  async function checkPractice() {
    if (isRunning) return;
    const task = getCurrentTask();
    if (!task) return;
    isRunning = true;
    const status = document.getElementById("practiceConsoleStatus");
    if (status) status.textContent = "Автопроверка...";
    try {
      if (task.type === "predict") await checkPredict(task);
      else if (task.type === "parsons") await checkParsons(task);
      else if (task.type === "blanks") await checkBlanks(task);
      else await checkCode(task);
    } finally {
      isRunning = false;
    }
  }

  async function checkCode(task) {
    saveCurrentCode();
    const code = document.getElementById("practiceCode").value;
    if (!code.trim()) {
      showResult(false, "Редактор пустой. Напиши решение и нажми «Проверить».");
      return;
    }
    if (typeof task.codeCheck === "function") {
      const msg = task.codeCheck(code);
      if (msg) {
        showResult(false, escapeHtml(msg));
        return;
      }
    }
    await finishWithTests(task, code);
  }

  async function checkBlanks(task) {
    const values = readBlanks();
    if (values.some(function (value) { return !String(value).trim(); })) {
      showResult(false, "Заполни все пустые места.");
      return;
    }
    const code = assembleBlanks(task, values);
    if (typeof task.codeCheck === "function") {
      const msg = task.codeCheck(code);
      if (msg) {
        showResult(false, escapeHtml(msg));
        return;
      }
    }
    await finishWithTests(task, code);
  }

  async function checkParsons(task) {
    const layout = getParsonsLayout(task);
    const assembled = window.PyEngine.assembleParsons(layout);
    if (typeof task.codeCheck === "function") {
      const msg = task.codeCheck(assembled);
      if (msg) {
        showResult(false, escapeHtml(msg));
        return;
      }
    }
    const structure = window.PyEngine.compareParsons(layout, task.lines || []);
    const mode = task.parsonsMode || "both";
    const hasTests = task.tests && task.tests.length;
    if (mode === "order" || !hasTests) {
      if (structure.ok) passBanner(task, "Порядок и отступы верные.");
      else showResult(false, escapeHtml(structure.reason));
      return;
    }
    if (mode !== "tests" && structure.ok) {
      passBanner(task, "Строки стоят правильно, отступы тоже.");
      return;
    }
    const result = await window.PyEngine.runTests(assembled, task.tests);
    if (result.ok) {
      passBanner(task, "Собранная программа прошла автотесты.");
      return;
    }
    const prefix = !structure.ok && mode !== "tests" ? escapeHtml(structure.reason) + "<br>" : "";
    if (result.kind === "error") {
      const err = document.getElementById("practiceConsoleErr");
      err.textContent = result.error;
      err.style.display = "block";
    }
    showResult(false, prefix + formatTestFail(result));
  }

  async function checkPredict(task) {
    const area = document.getElementById("predictAnswer");
    const text = area ? area.value : "";
    const actual = window.PyEngine.outputLines(String(text).replace(/[ \t]+$/gm, "") + "\n");
    const expected = task.expectedLines || [];
    let match = actual.length === expected.length;
    if (match) {
      for (let i = 0; i < expected.length; i++) {
        if (!window.PyEngine.linesEqual(actual[i], expected[i], task)) {
          match = false;
          break;
        }
      }
    }
    if (!match) {
      showResult(false, formatTestFail({
        kind: "mismatch",
        testIndex: 0,
        inputs: [],
        expected: expected,
        actual: actual
      }));
      return;
    }
    passBanner(task, "Ты верно предсказал вывод.");
    const host = document.getElementById("practiceAlt");
    if (host && !host.querySelector(".tracer")) {
      mountTracer(host, { title: "Смотри, как это шло", code: task.predictCode || "" });
    }
  }

  async function finishWithTests(task, code) {
    const result = await window.PyEngine.runTests(code, task.tests || []);
    const out = document.getElementById("practiceConsoleOut");
    out.style.color = "#e2e8f0";
    out.textContent = result.lastOutput || "(нет вывода)";
    if (result.ok) {
      document.getElementById("practiceConsoleStatus").textContent = "Все тесты пройдены";
      passBanner(task, "Все автотесты пройдены.");
      return;
    }
    document.getElementById("practiceConsoleStatus").textContent = result.kind === "error" ? "Ошибка" : "Есть несовпадение";
    if (result.kind === "error") {
      const err = document.getElementById("practiceConsoleErr");
      err.textContent = result.error;
      err.style.display = "block";
    }
    showResult(false, formatTestFail(result));
  }

  function passBanner(task, message) {
    const first = markSolved(task);
    showResult(true, first
      ? "<strong>Отлично! Задача решена.</strong> " + escapeHtml(message) + " (+25 XP)"
      : "<strong>Всё верно.</strong> " + escapeHtml(message));
  }

  function goNextTask() {
    const chapters = getChapters();
    const chapter = chapters[state.activeChapter];
    const index = getTaskIndex(chapter);
    if (index + 1 < (chapter.tasks || []).length) {
      state.activeTaskIdx[chapter.id] = index + 1;
      saveState();
      renderPractice();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const next = state.activeChapter + 1;
    if (next < chapters.length && isChapterUnlocked(next)) {
      showToast("Глава пройдена. Открываем следующую.");
      openChapter(next, "theory");
      return;
    }
    if (next < chapters.length) {
      showToast("Чтобы открыть следующую главу, нужна оценка 3 или выше за эту.");
      switchView("report");
      return;
    }
    showToast("Ты дошёл до конца открытых глав. Смотри итог.");
    switchView("report");
  }

  function loadSandboxPreset(key) {
    const area = document.getElementById("sandboxCode");
    area.value = SANDBOX_PRESETS[key] || "";
    updateLineNumbers(area, document.getElementById("sandboxLineNums"));
  }

  function runSandbox() {
    runInteractive("sandbox", document.getElementById("sandboxCode").value);
  }

  function computeVerificationCode(name, cls, solvedTasks, solvedQuizzes, xp, marks) {
    const str = [name, cls, solvedTasks, solvedQuizzes, xp, marks.join("."), "PY7"].join("|");
    let hash = 5381;
    for (let i = 0; i < str.length; i++) hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
    return "PY7-" + hash.toString(36).toUpperCase().padStart(6, "0");
  }

  function renderReport() {
    const stats = updateTop();
    const finalGrade = getFinalGrade(stats);
    document.getElementById("repStudentName").textContent = state.studentName || "Ученик не указан";
    document.getElementById("repStudentClass").textContent = "Класс: " + (state.studentClass || "—");
    const circle = document.getElementById("repGradeCircle");
    circle.className = "grade-circle " + finalGrade.cls;
    circle.textContent = finalGrade.grade;
    document.getElementById("repGradeCaption").textContent = finalGrade.caption;
    document.getElementById("repTasksVal").textContent = stats.solvedTasks + " / " + stats.totalTasks;
    document.getElementById("repQuizzesVal").textContent = stats.solvedQuizzes + " / " + stats.totalQuizzes;
    document.getElementById("repXpVal").textContent = stats.xp + " XP";
    document.getElementById("repHintsVal").textContent = String(state.hintsUsed);

    const honesty = document.getElementById("repHonestyBadge");
    if (state.tabSwitches <= 2) {
      honesty.className = "honesty-badge ok";
      honesty.textContent = "Самостоятельно (уходов со вкладки: " + state.tabSwitches + ")";
    } else if (state.tabSwitches <= 6) {
      honesty.className = "honesty-badge warn";
      honesty.textContent = "Переключения вкладок: " + state.tabSwitches;
    } else {
      honesty.className = "honesty-badge alert";
      honesty.textContent = "Частые уходы со вкладки: " + state.tabSwitches;
    }

    const chapters = getChapters();
    let html = "<div style=\"font-size:11.5px;font-weight:800;color:var(--text-muted);text-transform:uppercase;margin-bottom:6px;\">Оценка по каждой главе</div>";
    html += "<p style=\"margin:0 0 8px;color:var(--text-muted);font-size:12.5px;\">Пятёрка за главу — почти все основные задачи. Тренировки дают опыт и не снижают оценку. Следующая глава открывается с оценки 3.</p>";
    chapters.forEach(function (ch, index) {
      const grade = finalGrade.grades[index];
      const unlocked = isChapterUnlocked(index);
      const mark = !unlocked ? "🔒" : (ch.comingSoon && !grade.num ? "скоро" : grade.grade);
      const detail = ch.comingSoon
        ? "Уроки " + ch.lessons + " • скоро"
        : "Задачи " + grade.td + "/" + grade.T + " • тест " + grade.qd + "/" + grade.Q +
          (grade.extraTotal ? " • тренировка " + grade.extraSolved + "/" + grade.extraTotal : "");
      html += "<div style=\"display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0;" +
        (index < chapters.length - 1 ? "border-bottom:1px solid #f1f5f9;" : "") + "\">" +
        "<div style=\"min-width:0;\"><div style=\"font-weight:700;\">Гл." + (index + 1) + ". " + escapeHtml(ch.title) + "</div>" +
        "<div style=\"font-size:12px;color:var(--text-muted);\">" + escapeHtml(detail) + "</div></div>" +
        "<span class=\"mini-grade " + (grade.cls || "") + "\">" + escapeHtml(mark) + "</span></div>";
    });
    document.getElementById("repModuleBreakdown").innerHTML = html;

    const marks = sheetMarks(finalGrade.grades);
    const code = computeVerificationCode(state.studentName, state.studentClass, stats.solvedTasks, stats.solvedQuizzes, stats.xp, marks);
    document.getElementById("repVerifyCode").textContent = "КОД ПРОВЕРКИ: " + code;
    document.getElementById("repTimestamp").textContent = "Обновлено: " + new Date().toLocaleString("ru-RU");
    document.getElementById("sendSheetBtn").style.display = GOOGLE_SCRIPT_URL ? "inline-flex" : "none";
  }

  function sheetMarks(grades) {
    const chapters = getChapters();
    const marks = [];
    for (let i = 0; i < 7; i++) {
      if (!grades[i]) { marks.push("—"); continue; }
      if (!isChapterUnlocked(i) && !(chapters[i] && chapters[i].comingSoon === false && grades[i].num)) {
        marks.push(grades[i].num ? grades[i].grade : "—");
      } else {
        marks.push(grades[i].grade || "—");
      }
    }
    return marks;
  }

  function reportPlainText() {
    const stats = getStats();
    const finalGrade = getFinalGrade(stats);
    const marks = sheetMarks(finalGrade.grades);
    const code = computeVerificationCode(state.studentName, state.studentClass, stats.solvedTasks, stats.solvedQuizzes, stats.xp, marks);
    const lines = getChapters().map(function (ch, index) {
      const grade = finalGrade.grades[index];
      return "• Гл." + (index + 1) + " (" + ch.title + "): " + (isChapterUnlocked(index) ? grade.grade : "закрыта");
    });
    return [
      "ПайтонЛаб 7 — отчёт ученика",
      state.studentName + " (" + state.studentClass + ")",
      "Итог: " + finalGrade.grade + " | Опыт: " + stats.xp + " XP",
      "Задачи: " + stats.solvedTasks + "/" + stats.totalTasks + " | Тесты: " + stats.solvedQuizzes + "/" + stats.totalQuizzes,
      lines.join("\n"),
      "Подсказок: " + state.hintsUsed + " | Уходов со вкладки: " + state.tabSwitches,
      "Код: " + code
    ].join("\n");
  }

  function copyReportText() {
    const text = reportPlainText();
    const fallback = function () {
      const tmp = document.createElement("textarea");
      tmp.value = text;
      tmp.setAttribute("readonly", "readonly");
      tmp.style.position = "fixed";
      tmp.style.left = "-9999px";
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
      showToast("Отчёт скопирован");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast("Отчёт скопирован");
      }).catch(fallback);
      return;
    }
    fallback();
  }

  async function sendToGoogleSheet() {
    if (!GOOGLE_SCRIPT_URL) return;
    const stats = getStats();
    const finalGrade = getFinalGrade(stats);
    const marks = sheetMarks(finalGrade.grades);
    const code = computeVerificationCode(state.studentName, state.studentClass, stats.solvedTasks, stats.solvedQuizzes, stats.xp, marks);
    const btn = document.getElementById("sendSheetBtn");
    btn.disabled = true;
    btn.textContent = "Отправка...";
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.studentName,
          gradeClass: state.studentClass,
          mark: finalGrade.grade,
          g1: marks[0],
          g2: marks[1],
          g3: marks[2],
          g4: marks[3],
          g5: marks[4],
          g6: marks[5],
          g7: marks[6],
          tasks: stats.solvedTasks + "/" + stats.totalTasks,
          quizzes: stats.solvedQuizzes + "/" + stats.totalQuizzes,
          xp: stats.xp,
          hints: state.hintsUsed,
          tabSwitches: state.tabSwitches,
          verifyCode: code
        })
      });
      showToast("Отчёт отправлен в журнал учителя");
    } catch (e) {
      showToast("Не удалось отправить. Скопируй отчёт кнопкой выше.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Отправить в журнал учителя";
    }
  }

  function renderSymbolBar(prefix) {
    const group = currentSymbolGroup(prefix);
    const topics = document.getElementById(prefix + "SymbolTopics");
    const bar = document.getElementById(prefix + "SymbolBar");
    if (!topics || !bar) return;
    topics.innerHTML = "";
    TOPICS.forEach(function (topic) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "symbol-topic" + (topic.id === group ? " active" : "");
      btn.textContent = topic.label;
      btn.addEventListener("click", function () {
        const key = prefix === "sandbox" ? "sandbox" : getChapters()[state.activeChapter].id;
        state.symbolTopic[key] = topic.id;
        saveState();
        renderSymbolBar(prefix);
      });
      topics.appendChild(btn);
    });
    const activeTopic = topics.querySelector(".symbol-topic.active");
    if (activeTopic && activeTopic.scrollIntoView) {
      activeTopic.scrollIntoView({ inline: "center", block: "nearest" });
    }
    bar.innerHTML = "";
    SYMBOLS.filter(function (sym) { return sym.groups.indexOf(group) !== -1; }).forEach(function (sym) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sym-btn";
      btn.textContent = sym.label;
      btn.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        const field = symbolTarget(prefix);
        if (!field) return;
        insertAtCursor(field, sym.insert, sym.back);
        if (field.id === "practiceCode" || field.id === "sandboxCode") {
          updateLineNumbers(field, document.getElementById(prefix + "LineNums"));
        }
        if (prefix === "practice") saveCurrentCode();
      });
      bar.appendChild(btn);
    });
  }

  function currentSymbolGroup(prefix) {
    if (prefix === "sandbox") return state.symbolTopic.sandbox || "all";
    const chapter = getChapters()[state.activeChapter] || {};
    return state.symbolTopic[chapter.id] || chapter.symbols || "print";
  }

  function symbolTarget(prefix) {
    const active = document.activeElement;
    if (active && active.classList && active.classList.contains("blank-input") && prefix === "practice") return active;
    if (active && active.id === prefix + "Code") return active;
    const blanks = document.querySelectorAll("#practiceAlt .blank-input");
    if (prefix === "practice" && blanks.length && document.getElementById("practiceEditorBlock").style.display === "none") {
      return blanks[blanks.length - 1];
    }
    return document.getElementById(prefix + "Code");
  }

  function insertAtCursor(field, text, cursorBack) {
    const start = field.selectionStart || 0;
    const end = field.selectionEnd || 0;
    const value = field.value;
    field.value = value.substring(0, start) + text + value.substring(end);
    const pos = start + text.length - (cursorBack || 0);
    field.focus();
    if (field.setSelectionRange) field.setSelectionRange(pos, pos);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function updateLineNumbers(area, gutter) {
    if (!area || !gutter) return;
    const lines = (area.value.match(/\n/g) || []).length + 1;
    let text = "";
    for (let i = 1; i <= lines; i++) text += i + (i < lines ? "\n" : "");
    gutter.textContent = text;
  }

  function blockPaste(field) {
    field.addEventListener("paste", function (event) {
      event.preventDefault();
      showToast("В задачах пишем сами — вставка отключена");
    });
  }

  function initLogin() {
    const modal = document.getElementById("loginModal");
    const nameInput = document.getElementById("studentNameInput");
    const buttons = document.querySelectorAll(".class-btn");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (item) { item.classList.remove("selected"); });
        btn.classList.add("selected");
        selectedCls = btn.dataset.cls;
      });
    });
    document.getElementById("startBtn").addEventListener("click", function () {
      const name = nameInput.value.trim();
      if (name.length < 3) {
        showToast("Введи фамилию и имя (минимум 3 буквы)");
        nameInput.focus();
        return;
      }
      if (!selectedCls) {
        showToast("Выбери свой класс");
        return;
      }
      state.studentName = name;
      state.studentClass = selectedCls;
      saveState();
      modal.classList.add("hidden");
      renderHome();
      showToast("Привет, " + name.split(/\s+/).slice(-1)[0] + "!");
    });
    if (state.studentName && state.studentClass) {
      modal.classList.add("hidden");
    } else {
      nameInput.value = state.studentName || "";
      buttons.forEach(function (btn) { btn.classList.toggle("selected", btn.dataset.cls === selectedCls); });
    }
  }

  function openChangeProfile() {
    const modal = document.getElementById("loginModal");
    document.getElementById("studentNameInput").value = state.studentName || "";
    selectedCls = state.studentClass || "";
    document.querySelectorAll(".class-btn").forEach(function (btn) {
      btn.classList.toggle("selected", btn.dataset.cls === selectedCls);
    });
    modal.classList.remove("hidden");
  }

  function confirmResetProgress() {
    if (!confirm("Точно сбросить весь прогресс и начать курс заново?")) return;
    const name = state.studentName;
    const cls = state.studentClass;
    state = createDefaultState();
    state.studentName = name;
    state.studentClass = cls;
    saveState();
    renderHome();
    if (document.getElementById("view-report").classList.contains("active")) renderReport();
    showToast("Прогресс сброшен");
  }

  function openTeacherModal() {
    document.getElementById("teacherPinError").textContent = "";
    document.getElementById("teacherPinInput").value = "";
    document.getElementById("teacherGate").style.display = state.teacherUnlock ? "none" : "block";
    document.getElementById("teacherActions").style.display = state.teacherUnlock ? "flex" : "none";
    document.getElementById("teacherModal").classList.remove("hidden");
    if (!state.teacherUnlock) document.getElementById("teacherPinInput").focus();
  }

  function submitTeacherPin() {
    const pin = document.getElementById("teacherPinInput").value.trim();
    if (pin !== TEACHER_PIN) {
      document.getElementById("teacherPinError").textContent = "Не тот PIN";
      return;
    }
    document.getElementById("teacherPinError").textContent = "";
    document.getElementById("teacherGate").style.display = "none";
    document.getElementById("teacherActions").style.display = "flex";
  }

  function setTeacherUnlock(value) {
    state.teacherUnlock = value;
    saveState();
    document.getElementById("teacherModal").classList.add("hidden");
    renderHome();
    showToast(value ? "Все главы открыты на этом телефоне" : "Замки возвращены");
  }

  function bindTeacherLogo() {
    document.getElementById("brandLogo").addEventListener("click", function () {
      const now = Date.now();
      logoTaps = logoTaps.filter(function (stamp) { return now - stamp < 2000; });
      logoTaps.push(now);
      if (logoTaps.length >= 5) {
        logoTaps = [];
        openTeacherModal();
      }
    });
  }

  function bindStaticUi() {
    document.getElementById("backBtn").addEventListener("click", function () { switchView("home"); });
    document.querySelectorAll(".nav-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.dataset.nav === "module") openCurrentPractice();
        else switchView(btn.dataset.nav);
      });
    });
    document.querySelectorAll(".seg-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { switchModuleTab(btn.dataset.subtab); });
    });
    document.getElementById("hintBtn").addEventListener("click", showNextHint);
    document.getElementById("resetCodeBtn").addEventListener("click", resetCurrentTask);
    document.getElementById("runPracticeBtn").addEventListener("click", runPractice);
    document.getElementById("checkPracticeBtn").addEventListener("click", checkPractice);
    document.getElementById("nextTaskBtn").addEventListener("click", goNextTask);
    document.getElementById("runSandboxBtn").addEventListener("click", runSandbox);
    document.querySelectorAll("[data-preset]").forEach(function (btn) {
      btn.addEventListener("click", function () { loadSandboxPreset(btn.dataset.preset); });
    });
    document.getElementById("copyReportBtn").addEventListener("click", copyReportText);
    document.getElementById("sendSheetBtn").addEventListener("click", sendToGoogleSheet);
    document.getElementById("changeProfileBtn").addEventListener("click", openChangeProfile);
    document.getElementById("resetProgressBtn").addEventListener("click", confirmResetProgress);
    document.getElementById("teacherPinBtn").addEventListener("click", submitTeacherPin);
    document.getElementById("teacherPinInput").addEventListener("keydown", function (event) {
      if (event.key === "Enter") submitTeacherPin();
    });
    document.getElementById("teacherUnlockBtn").addEventListener("click", function () { setTeacherUnlock(true); });
    document.getElementById("teacherLockBtn").addEventListener("click", function () { setTeacherUnlock(false); });
    document.getElementById("teacherCloseBtn").addEventListener("click", function () {
      document.getElementById("teacherModal").classList.add("hidden");
    });

    const practiceCode = document.getElementById("practiceCode");
    const sandboxCode = document.getElementById("sandboxCode");
    practiceCode.addEventListener("input", function () {
      updateLineNumbers(practiceCode, document.getElementById("practiceLineNums"));
      saveCurrentCode();
    });
    sandboxCode.addEventListener("input", function () {
      updateLineNumbers(sandboxCode, document.getElementById("sandboxLineNums"));
    });
    blockPaste(practiceCode);
    [practiceCode, sandboxCode].forEach(function (area, index) {
      const gutterId = index === 0 ? "practiceLineNums" : "sandboxLineNums";
      area.addEventListener("keydown", function (event) {
        if (event.key !== "Tab") return;
        event.preventDefault();
        insertAtCursor(area, "    ", 0);
        updateLineNumbers(area, document.getElementById(gutterId));
        if (index === 0) saveCurrentCode();
      });
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && state.studentName) {
        state.tabSwitches += 1;
        saveState();
      }
    });
    bindTeacherLogo();
  }

  function boot() {
    if (!window.PyEngine) {
      showToast("Движок Python не загрузился");
      return;
    }
    skulptReady = typeof Sk !== "undefined" && !!Sk.builtinFiles;
    bindStaticUi();
    initLogin();
    loadSandboxPreset("hello");
    renderSymbolBar("sandbox");
    renderHome();
    setTimeout(function () {
      skulptReady = typeof Sk !== "undefined" && !!Sk.builtinFiles;
      updateTop();
    }, 400);
    window.addEventListener("load", function () {
      skulptReady = typeof Sk !== "undefined" && !!Sk.builtinFiles;
      updateTop();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
