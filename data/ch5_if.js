window.COURSE_CHAPTERS = window.COURSE_CHAPTERS || [];
window.COURSE_CHAPTERS.push({
  id: "ch5",
  order: 5,
  lessons: "29–33",
  hours: 5,
  lessonCount: 5,
  badge: "Уроки 29–33 • 5 ч.",
  title: "Условия if / elif / else",
  desc: "Сравнение, if / elif / else, and / or / not и вопрос внутри вопроса. Это пять уроков: от первой развилки до вложенного if.",
  symbols: "cond",
  comingSoon: false,
  theory: [
    {
      title: "🔀 Как компьютер принимает решение",
      body: `
          <p>Команда <span class="inline-code">if</span> задаёт вопрос. Если ответ «да», Python выполняет команды <strong>под</strong> ней. Если «нет» — перепрыгивает их.</p>
          <p>Золотое правило, два знака сразу:</p>
          <ul>
            <li>в конце вопроса стоит <strong>двоеточие</strong> <span class="inline-code">:</span></li>
            <li>команды внутри ветки сдвинуты на <strong>4 пробела</strong> (кнопка ↹ Tab)</li>
          </ul>
          <div class="code-sample">temp = <span class="nm">30</span>
<span class="kw">if</span> temp &gt; <span class="nm">25</span>:
    <span class="kw">print</span>(<span class="st">"Жарко"</span>)</div>
          <div class="callout">Забыл <span class="inline-code">:</span> или сдвинул строку не на 4 пробела — Python остановится с ошибкой отступа или синтаксиса. Он не догадывается, где начинается ветка.</div>
        `,
      tryCode: "temp = 30\nif temp > 25:\n    print(\"Жарко\")"
    },
    {
      title: "⚖️ Знаки сравнения, и чем == не равно =",
      body: `
          <ul>
            <li><span class="inline-code">==</span> — равно? Два знака. Один <span class="inline-code">=</span> только кладёт значение в переменную.</li>
            <li><span class="inline-code">!=</span> — не равно.</li>
            <li><span class="inline-code">&gt;</span> больше, <span class="inline-code">&lt;</span> меньше.</li>
            <li><span class="inline-code">&gt;=</span> больше или равно, <span class="inline-code">&lt;=</span> меньше или равно.</li>
          </ul>
          <div class="code-sample"><span class="kw">print</span>(<span class="nm">7</span> == <span class="nm">7</span>)   <span class="cm"># True — да</span>
<span class="kw">print</span>(<span class="nm">5</span> &gt; <span class="nm">3</span>)    <span class="cm"># True</span>
<span class="kw">print</span>(<span class="nm">5</span> != <span class="nm">5</span>)   <span class="cm"># False — нет</span></div>
          <div class="callout info"><span class="inline-code">x = 10</span> сохраняет десятку. <span class="inline-code">x == 10</span> спрашивает: «там уже десятка?»</div>
        `,
      tryCode: "print(7 == 7)\nprint(5 > 3)\nprint(5 != 5)"
    },
    {
      title: "🌳 if, elif и else — несколько дорог",
      body: `
          <p><span class="inline-code">else</span> — запасная дорога, если <span class="inline-code">if</span> сказал «нет». <span class="inline-code">elif</span> — ещё один вопрос по дороге. Сработает только одна ветка.</p>
          <p>Оценка по баллам: 90 и выше — «5», от 60 — «4», иначе просим ещё раз.</p>
          <svg class="flow" viewBox="0 0 340 400" role="img" aria-label="Схема ветвления if elif else">
            <rect x="110" y="8" width="120" height="34" rx="10" fill="#eff6ff" stroke="#2563eb"/>
            <text x="170" y="30" text-anchor="middle" font-size="14" font-family="Segoe UI, Arial, sans-serif" fill="#0f172a">балл</text>
            <line x1="170" y1="42" x2="170" y2="62" stroke="#64748b" stroke-width="2"/>
            <polygon points="170,62 252,112 170,162 88,112" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
            <text x="170" y="116" text-anchor="middle" font-size="13" font-family="Segoe UI, Arial, sans-serif" fill="#0f172a">≥ 90?</text>
            <line x1="252" y1="112" x2="268" y2="112" stroke="#64748b" stroke-width="2"/>
            <rect x="268" y="94" width="64" height="36" rx="8" fill="#ecfdf5" stroke="#059669"/>
            <text x="300" y="116" text-anchor="middle" font-size="13" font-family="Segoe UI, Arial, sans-serif" fill="#065f46">«5»</text>
            <text x="258" y="104" font-size="11" font-family="Segoe UI, Arial, sans-serif" fill="#047857">да</text>
            <line x1="170" y1="162" x2="170" y2="186" stroke="#64748b" stroke-width="2"/>
            <text x="178" y="178" font-size="11" font-family="Segoe UI, Arial, sans-serif" fill="#64748b">нет</text>
            <polygon points="170,186 252,236 170,286 88,236" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
            <text x="170" y="240" text-anchor="middle" font-size="13" font-family="Segoe UI, Arial, sans-serif" fill="#0f172a">≥ 60?</text>
            <line x1="252" y1="236" x2="268" y2="236" stroke="#64748b" stroke-width="2"/>
            <rect x="268" y="218" width="64" height="36" rx="8" fill="#ecfdf5" stroke="#059669"/>
            <text x="300" y="240" text-anchor="middle" font-size="13" font-family="Segoe UI, Arial, sans-serif" fill="#065f46">«4»</text>
            <text x="258" y="228" font-size="11" font-family="Segoe UI, Arial, sans-serif" fill="#047857">да</text>
            <line x1="170" y1="286" x2="170" y2="314" stroke="#64748b" stroke-width="2"/>
            <text x="178" y="306" font-size="11" font-family="Segoe UI, Arial, sans-serif" fill="#64748b">нет</text>
            <rect x="104" y="314" width="132" height="36" rx="10" fill="#f8fafc" stroke="#64748b"/>
            <text x="170" y="337" text-anchor="middle" font-size="13" font-family="Segoe UI, Arial, sans-serif" fill="#0f172a">«ещё раз»</text>
          </svg>
          <div class="code-sample">score = <span class="nm">75</span>
<span class="kw">if</span> score &gt;= <span class="nm">90</span>:
    <span class="kw">print</span>(<span class="st">"5"</span>)
<span class="kw">elif</span> score &gt;= <span class="nm">60</span>:
    <span class="kw">print</span>(<span class="st">"4"</span>)
<span class="kw">else</span>:
    <span class="kw">print</span>(<span class="st">"ещё раз"</span>)</div>
        `,
      tryCode: "score = 75\nif score >= 90:\n    print(\"5\")\nelif score >= 60:\n    print(\"4\")\nelse:\n    print(\"ещё раз\")",
      trace: {
        title: "Какую ветку выберет Python",
        code: "score = 75\nif score >= 90:\n    print(\"5\")\nelif score >= 60:\n    print(\"4\")\nelse:\n    print(\"ещё раз\")"
      }
    },
    {
      title: "🌧️ and, or, not — два вопроса сразу",
      body: `
          <p>Так же, как в логике первой четверти: одно событие можно связать с другим.</p>
          <ul>
            <li><span class="inline-code">and</span> — И. Оба куска правдивы. Идёт дождь <strong>и</strong> зонта нет → промокнем.</li>
            <li><span class="inline-code">or</span> — ИЛИ. Хватит одного. Дождь <strong>или</strong> сильный ветер → лучше внутрь.</li>
            <li><span class="inline-code">not</span> — НЕ. Переворачивает ответ: <span class="inline-code">not True</span> это <span class="inline-code">False</span>.</li>
          </ul>
          <div class="code-sample">age = <span class="nm">14</span>
<span class="kw">if</span> age &gt;= <span class="nm">12</span> <span class="kw">and</span> age &lt;= <span class="nm">16</span>:
    <span class="kw">print</span>(<span class="st">"школьный билет"</span>)
<span class="kw">else</span>:
    <span class="kw">print</span>(<span class="st">"обычный билет"</span>)</div>
          <div class="callout info">Условие <span class="inline-code">age &gt;= 12 and age &lt;= 16</span> срабатывает только на возрастах 12, 13, 14, 15 и 16. 11 — рано, 17 — уже нет.</div>
        `,
      tryCode: "rain = True\numbrella = False\nif rain and not umbrella:\n    print(\"Промокнем\")\nelse:\n    print(\"Сухо\")"
    },
    {
      title: "🎟️ Вопрос внутри вопроса",
      body: `
          <p>Иногда ответ на первый вопрос открывает второй. Это <strong>вложенный if</strong>: он стоит внутри ветки и сдвинут ещё на 4 пробела, то есть на 8 от края.</p>
          <p>Билет: с 12 лет можно самому. С 6 до 11 — только если рядом взрослый. Младше 6 — рано.</p>
          <div class="code-sample">age = <span class="nm">8</span>
<span class="kw">if</span> age &gt;= <span class="nm">12</span>:
    <span class="kw">print</span>(<span class="st">"Можно"</span>)
<span class="kw">else</span>:
    <span class="kw">if</span> age &gt;= <span class="nm">6</span>:
        <span class="kw">print</span>(<span class="st">"Спроси взрослого"</span>)
    <span class="kw">else</span>:
        <span class="kw">print</span>(<span class="st">"Рано"</span>)</div>
          <div class="callout">Внешний if сдвинут на 4 пробела, внутренний — на 8. Забыл второй сдвиг — Python не поймёт, к какому вопросу относится строка.</div>
        `,
      tryCode: "age = 8\nif age >= 12:\n    print(\"Можно\")\nelse:\n    if age >= 6:\n        print(\"Спроси взрослого\")\n    else:\n        print(\"Рано\")",
      trace: {
        title: "Восемь лет: заходим во внутренний вопрос",
        code: "age = 8\nif age >= 12:\n    print(\"Можно\")\nelse:\n    if age >= 6:\n        print(\"Спроси взрослого\")\n    else:\n        print(\"Рано\")"
      }
    }
  ],
  quizzes: [
    {
      id: "m4q0",
      question: "1. Чем = отличается от == ?",
      options: [
        "= сохраняет значение, == спрашивает «равно ли?»",
        "Это одно и то же",
        "== сохраняет, = сравнивает",
        "= ставится только в конце строки"
      ],
      correct: 0,
      explain: "Один знак = кладёт число в переменную. Два знака == проверяют, совпали ли значения."
    },
    {
      id: "m4q1",
      question: "2. Что будет, если после if забыть двоеточие или отступ?",
      options: [
        "Программа остановится с ошибкой",
        "Ветка всё равно выполнится",
        "Python сам допишет двоеточие",
        "Напечатается 0"
      ],
      correct: 0,
      explain: "Без : или без 4 пробелов под if Python не понимает, где ветка. Будет SyntaxError или IndentationError."
    },
    {
      id: "m4q2",
      question: "3. score = 75. Что напечатает программа?\nif score >= 90:\n    print(\"5\")\nelif score >= 60:\n    print(\"4\")\nelse:\n    print(\"ещё раз\")",
      options: [
        "4",
        "5",
        "ещё раз",
        "5 и 4"
      ],
      correct: 0,
      explain: "75 не дотягивает до 90, первый if — нет. 75 не меньше 60, elif — да. Печатается только «4». else уже не смотрит."
    },
    {
      id: "m4q3",
      question: "4. Когда сработает age >= 12 and age <= 16?",
      options: [
        "Когда возраст от 12 до 16 включительно",
        "Когда возраст больше 16",
        "Когда возраст равен только 12",
        "Когда возраст меньше 12 или больше 16"
      ],
      correct: 0,
      explain: "and требует оба куска сразу: не младше 12 и не старше 16. Попадают 12, 13, 14, 15 и 16."
    },
    {
      id: "m4q4",
      question: "5. age = 8. Что напечатается?\nif age >= 12:\n    print(\"Можно\")\nelse:\n    if age >= 6:\n        print(\"Спроси взрослого\")\n    else:\n        print(\"Рано\")",
      options: ["Спроси взрослого", "Можно", "Рано", "Ничего"],
      correct: 0,
      explain: "8 не дотягивает до 12, поэтому внешняя ветка «Можно» пропускается. Внутри else второй вопрос 8 >= 6 — да. Печатается «Спроси взрослого». До «Рано» дело не доходит."
    }
  ],
  tasks: [
    {
      id: "m4t0",
      type: "parsons",
      parsonsMode: "both",
      title: "Пароль от двери",
      desc: "Собери проверку пароля. Верный пароль — <strong>python7</strong>. Если он совпал, напечатай <strong>Открыто</strong>. Иначе — <strong>Неверный пароль</strong>. Строки внутри <span class=\"inline-code\">if</span> и <span class=\"inline-code\">else</span> сдвинь на один шаг вправо (4 пробела).",
      lines: [
        { code: "password = input()", indent: 0 },
        { code: "if password == \"python7\":", indent: 0 },
        { code: "print(\"Открыто\")", indent: 1 },
        { code: "else:", indent: 0 },
        { code: "print(\"Неверный пароль\")", indent: 1 }
      ],
      hints: [
        "Сначала прочитай пароль. Потом if с == и двоеточием. print внутри if сдвинут вправо. Дальше else и его print тоже вправо.",
        "if password == \"python7\":\n    print(\"Открыто\")\nelse:\n    print(\"Неверный пароль\")"
      ],
      codeCheck: function (code) {
        if (!/==/.test(code)) return "Пароль сравнивай двумя знаками: ==.";
        if (!/else\s*:/.test(code)) return "Нужна запасная ветка else.";
        return null;
      },
      tests: [
        { inputs: ["python7"], expectedLines: ["Открыто"] },
        { inputs: ["12345"], expectedLines: ["Неверный пароль"] }
      ]
    },
    {
      id: "m4t1",
      type: "parsons",
      parsonsMode: "both",
      title: "Светофор",
      desc: "Собери светофор. Вводят цвет. <strong>Красный</strong> → <strong>Стой</strong>, <strong>Жёлтый</strong> → <strong>Жди</strong>, любой другой → <strong>Иди</strong>. У каждой ветки свой отступ в 4 пробела.",
      lines: [
        { code: "color = input()", indent: 0 },
        { code: "if color == \"Красный\":", indent: 0 },
        { code: "print(\"Стой\")", indent: 1 },
        { code: "elif color == \"Жёлтый\":", indent: 0 },
        { code: "print(\"Жди\")", indent: 1 },
        { code: "else:", indent: 0 },
        { code: "print(\"Иди\")", indent: 1 }
      ],
      hints: [
        "Порядок веток: сначала красный if, потом жёлтый elif, в конце else. print каждой ветки сдвинут вправо.",
        "if color == \"Красный\":\n    print(\"Стой\")\nelif color == \"Жёлтый\":\n    print(\"Жди\")\nelse:\n    print(\"Иди\")"
      ],
      codeCheck: function (code) {
        if (!/elif\b/.test(code)) return "Для второго цвета нужна ветка elif.";
        if (!/else\s*:/.test(code)) return "Для всех остальных цветов нужна ветка else.";
        return null;
      },
      tests: [
        { inputs: ["Красный"], expectedLines: ["Стой"] },
        { inputs: ["Жёлтый"], expectedLines: ["Жди"] },
        { inputs: ["Зелёный"], expectedLines: ["Иди"] }
      ]
    },
    {
      id: "m4t2",
      type: "code",
      title: "Почини развилку",
      desc: "В скрипте <strong>3 ошибки</strong>: в условии один знак <span class=\"inline-code\">=</span>, после if нет двоеточия, строка под else не сдвинута. Если ввели 10, напечатай <strong>Десятка</strong>. Иначе — <strong>Другое число</strong>. Большие и маленькие буквы сойдут.",
      starter: "x = int(input())\nif x = 10\n    print(\"Десятка\")\nelse:\nprint(\"Другое число\")\n",
      hints: [
        "Сравнение пишется ==. В конце строки if поставь : . Строку под else сдвинь на 4 пробела.",
        "if x == 10:\n    print(\"Десятка\")\nelse:\n    print(\"Другое число\")"
      ],
      codeCheck: function (code) {
        if (!/==/.test(code)) return "В условии нужен ==. Один знак = только сохраняет число, он не спрашивает.";
        if (!/^\s*if\b.*:\s*$/m.test(code)) return "В конце строки if поставь двоеточие :";
        const rows = code.replace(/\r\n/g, "\n").split("\n");
        for (let i = 0; i < rows.length; i++) {
          if (/^\s*else\s*:\s*$/.test(rows[i])) {
            const next = rows[i + 1] || "";
            if (next.trim() && !/^ {4}\S/.test(next) && !/^\t/.test(next)) {
              return "Строку под else сдвинь ровно на 4 пробела.";
            }
          }
        }
        return null;
      },
      tests: [
        { inputs: ["10"], expectedLines: ["Десятка"], ignoreCase: true },
        { inputs: ["7"], expectedLines: ["Другое число"], ignoreCase: true },
        { inputs: ["0"], expectedLines: ["Другое число"], ignoreCase: true }
      ]
    },
    {
      id: "m4t3",
      type: "code",
      title: "Чётное или нечётное",
      desc: "Вводят целое число. Если остаток от деления на 2 равен нулю, напечатай <strong>Чётное</strong>. Иначе — <strong>Нечётное</strong>. Ноль тоже чётный. Большие и маленькие буквы сойдут, буква «ё» тоже может быть «е».",
      starter: "n = int(input())\n# Чётное или Нечётное\n",
      hints: [
        "Чётные делятся на 2 без остатка: n % 2 == 0. Не забудь ветку else.",
        "if n % 2 == 0:\n    print(\"Чётное\")\nelse:\n    print(\"Нечётное\")"
      ],
      codeCheck: function (code) {
        if (!/%/.test(code)) return "Чётность проверяют остатком: n % 2 == 0.";
        if (!/\bif\b/.test(code) || !/\belse\b/.test(code)) return "Нужны обе ветки: if и else.";
        return null;
      },
      tests: [
        { inputs: ["8"], expectedLines: ["Чётное"], ignoreCase: true },
        { inputs: ["7"], expectedLines: ["Нечётное"], ignoreCase: true },
        { inputs: ["0"], expectedLines: ["Чётное"], ignoreCase: true }
      ]
    },
    {
      id: "m4t4",
      type: "code",
      title: "Большее из двух",
      desc: "Вводят два целых числа. Напечатай одно: большее из них. Если числа одинаковые, напечатай слово <strong>Равны</strong> — не само число. Большие и маленькие буквы в этом слове сойдут.",
      starter: "a = int(input())\nb = int(input())\n# большее или Равны\n",
      hints: [
        "Сначала спроси a == b. Если нет, сравни a > b и напечатай a или b.",
        "if a == b:\n    print(\"Равны\")\nelif a > b:\n    print(a)\nelse:\n    print(b)"
      ],
      codeCheck: function (code) {
        if (!/==/.test(code)) return "Одинаковые числа ловятся через ==.";
        if (!/\bif\b/.test(code) || !/\belse\b/.test(code)) return "Нужна ветка для равных чисел и ветка, если они разные.";
        return null;
      },
      tests: [
        { inputs: ["3", "8"], expectedLines: ["8"], numericMatch: true, ignoreCase: true },
        { inputs: ["9", "2"], expectedLines: ["9"], numericMatch: true, ignoreCase: true },
        { inputs: ["5", "5"], expectedLines: ["Равны"], ignoreCase: true }
      ]
    },
    {
      id: "m4t5",
      type: "code",
      variant: true,
      title: "Твоя скидка",
      desc: "Пороги подставятся лично для тебя.",
      starter: "age = int(input())\ntotal = int(input())\n",
      hints: [],
      build: function (v) {
        const ageLimit = 10 + v.c;
        const sumLimit = v.price;
        function hasNum(code, n) {
          return new RegExp("(^|\\D)" + n + "(\\D|$)").test(code);
        }
        return {
          desc: "Вводят возраст и сумму чека. Напечатай <strong>Скидка</strong>, если возраст не больше <strong>" + ageLimit + "</strong> и сумма не меньше <strong>" + sumLimit + "</strong>. Иначе напечатай <strong>Полная цена</strong>. Оба порога только твои. Большие и маленькие буквы сойдут.",
          starter: "age = int(input())\ntotal = int(input())\n# скидка: возраст <= " + ageLimit + " и сумма >= " + sumLimit + "\n",
          hints: [
            "Два вопроса сразу соедини словом and: возраст не больше " + ageLimit + " и сумма не меньше " + sumLimit + ".",
            "if age <= " + ageLimit + " and total >= " + sumLimit + ":\n    print(\"Скидка\")\nelse:\n    print(\"Полная цена\")"
          ],
          codeCheck: function (code) {
            if (!/\band\b/.test(code)) return "Нужны оба условия сразу. Соедини их словом and.";
            if (!hasNum(code, ageLimit) || !hasNum(code, sumLimit)) {
              return "В условии должны стоять твои числа: " + ageLimit + " и " + sumLimit + ".";
            }
            if (!/\bif\b/.test(code) || !/\belse\b/.test(code)) return "Добавь if для скидки и else для полной цены.";
            return null;
          },
          tests: [
            { inputs: [String(ageLimit), String(sumLimit)], expectedLines: ["Скидка"], ignoreCase: true },
            { inputs: [String(ageLimit + 1), String(sumLimit)], expectedLines: ["Полная цена"], ignoreCase: true },
            { inputs: [String(ageLimit), String(sumLimit - 1)], expectedLines: ["Полная цена"], ignoreCase: true }
          ]
        };
      },
      codeCheck: function (code) {
        if (!/\band\b/.test(code)) return "Нужны оба условия сразу. Соедини их словом and.";
        if (!/\bif\b/.test(code) || !/\belse\b/.test(code)) return "Добавь if для скидки и else для полной цены.";
        return null;
      }
    },
    {
      id: "m4t6",
      type: "code",
      title: "Билет в кино",
      desc: "Вводят возраст и слово сопровождающего: <strong>да</strong> или <strong>нет</strong> (маленькими буквами, так приходит проверка).<br>Напечатай одно слово:<br>• <strong>Можно</strong> — если возраст не меньше 12. Сопровождающий тогда не важен.<br>• <strong>С взрослым</strong> — если возраст от 6 до 11 и сопровождающий сказал <strong>да</strong>.<br>• <strong>Нельзя</strong> — во всех остальных случаях.<br>Второй вопрос должен стоять <strong>внутри</strong> ветки и быть сдвинут ещё на 4 пробела. Большие и маленькие буквы в ответе сойдут.",
      starter: "age = int(input())\nadult = input()\n# внешний if про возраст 12\n# внутри — ещё один if про слово «да»\n",
      hints: [
        "Сначала if age >= 12. В else задай второй вопрос: if adult == \"да\", но только для возраста от 6. Этот внутренний if сдвинут на 8 пробелов.",
        "if age >= 12:\n    print(\"Можно\")\nelif age >= 6:\n    if adult == \"да\":\n        print(\"С взрослым\")\n    else:\n        print(\"Нельзя\")\nelse:\n    print(\"Нельзя\")"
      ],
      codeCheck: function (code) {
        const rows = code.replace(/\r\n/g, "\n").split("\n");
        const indents = [];
        rows.forEach(function (row) {
          const mark = row.match(/^([ \t]*)if\b/);
          if (!mark) return;
          indents.push(mark[1].replace(/\t/g, "    ").length);
        });
        if (indents.length < 2) return "Нужны два if: общий вопрос и вопрос внутри ветки.";
        const outer = Math.min.apply(null, indents);
        if (!indents.some(function (n) { return n >= outer + 4; })) {
          return "Внутренний if сдвинь на 4 пробела глубже внешнего.";
        }
        if (!/да/.test(code)) return "Слово сопровождающего сравнивай с «да».";
        if (!/\belse\b/.test(code)) return "Добавь ветку else для тех, кому нельзя.";
        return null;
      },
      tests: [
        { inputs: ["12", "нет"], expectedLines: ["Можно"], ignoreCase: true },
        { inputs: ["14", "да"], expectedLines: ["Можно"], ignoreCase: true },
        { inputs: ["8", "да"], expectedLines: ["С взрослым"], ignoreCase: true },
        { inputs: ["8", "нет"], expectedLines: ["Нельзя"], ignoreCase: true },
        { inputs: ["5", "да"], expectedLines: ["Нельзя"], ignoreCase: true }
      ]
    },
    {
      id: "m4t7",
      type: "code",
      title: "Три вопроса подряд",
      desc: "Викторина из трёх ответов, каждый на своей строке ввода.<br>1) Столица Кыргызстана? Верно только <strong>Бишкек</strong>.<br>2) Сколько будет 2 + 2? Верно только <strong>4</strong>.<br>3) Сколько дней в неделе? Верно только <strong>7</strong>.<br>Напечатай две строки: сколько ответов верных (от 0 до 3) и слово — <strong>Отлично</strong>, если все три; <strong>Почти</strong>, если верных 1 или 2; <strong>Ещё раз</strong>, если ни одного. Большие и маленькие буквы в этом слове сойдут.",
      starter: "score = 0\na = input()\nb = input()\nc = input()\n# три отдельных if, потом слово по сумме\n",
      hints: [
        "За каждый точный ответ прибавляй 1 к score. Это три отдельных if, не elif: вопросы не заменяют друг друга.",
        "if a == \"Бишкек\":\n    score = score + 1\nif b == \"4\":\n    score = score + 1\nif c == \"7\":\n    score = score + 1\nprint(score)\nif score == 3:\n    print(\"Отлично\")\nelif score >= 1:\n    print(\"Почти\")\nelse:\n    print(\"Ещё раз\")"
      ],
      codeCheck: function (code) {
        if (!/Бишкек/.test(code)) return "Первый ответ сравнивай со словом Бишкек.";
        if ((code.match(/\bif\b/g) || []).length < 3) return "Нужны отдельные if: для ответов и для итогового слова.";
        if (!/\belse\b/.test(code)) return "Если ни одного верного ответа, нужна ветка else со словами «Ещё раз».";
        return null;
      },
      tests: [
        { inputs: ["Бишкек", "4", "7"], expectedLines: ["3", "Отлично"], numericMatch: true, ignoreCase: true },
        { inputs: ["Бишкек", "5", "7"], expectedLines: ["2", "Почти"], numericMatch: true, ignoreCase: true },
        { inputs: ["Ош", "нет", "восемь"], expectedLines: ["0", "Ещё раз"], numericMatch: true, ignoreCase: true }
      ]
    }
  ]
});
