window.COURSE_CHAPTERS = window.COURSE_CHAPTERS || [];
window.COURSE_CHAPTERS.push({
  id: "ch7",
  order: 7,
  lessons: "42–47",
  hours: 6,
  lessonCount: 6,
  badge: "Уроки 42–47 • 6 ч.",
  title: "Итоговый практикум",
  desc: "Шесть уроков зачёта: среднее и статус, максимум, банкомат, своя сумма, игра, касса смены и лестница из звёзд.",
  symbols: "all",
  comingSoon: false,
  plan: [
    { n: "42", title: "Повторение перед зачётом", do: "Карточки «Карта Python» и «Четыре шага». Весь мини-тест главы. Новую задачу не начинай." },
    { n: "43", title: "Средний балл", do: "Задача «Калькулятор оценок»: цикл, round и статус." },
    { n: "44", title: "Максимум своими руками", do: "Задача «Поиск максимума». Функцию max() не использовать." },
    { n: "45", title: "Банкомат", do: "Задача «Умный банкомат»: проверка кратности, // и %." },
    { n: "46", title: "Своя сумма", do: "Задача «Твоя сумма крупных шагов». Числа у каждого свои." },
    { n: "47", title: "Игра и итог", do: "Задача «Угадай число». Если игра сдана — «Касса смены» и «Лестница из звёзд». Потом экран «Итог»: оценки, код проверки, отправка в журнал." }
  ],
  theory: [
    {
      title: "🗺️ Карта Python на один экран",
      body: `
          <ul>
            <li><span class="inline-code">print("Привет")</span> — показать текст. Без кавычек Python считает: <span class="inline-code">print(2 + 2)</span>.</li>
            <li><span class="inline-code">input()</span> — спросить. Число: <span class="inline-code">int(input())</span>, дробь: <span class="inline-code">float(input())</span>. <span class="inline-code">"4" + "2"</span> это <span class="inline-code">"42"</span>, не 6.</li>
            <li><span class="inline-code">import math</span> — корень <span class="inline-code">math.sqrt</span>, вверх <span class="inline-code">math.ceil</span>, вниз <span class="inline-code">math.floor</span>, π это <span class="inline-code">math.pi</span>.</li>
            <li><span class="inline-code">if / elif / else</span> — выбор. Сравнение через <span class="inline-code">==</span>, не через <span class="inline-code">=</span>. В конце двоеточие, внутри 4 пробела.</li>
            <li><span class="inline-code">for i in range(1, n + 1)</span> — известное число кругов. Последняя граница не входит.</li>
            <li><span class="inline-code">while</span> — пока условие правда. Не забудь менять переменную, иначе цикл бесконечный.</li>
          </ul>
          <div class="callout">Слова <span class="inline-code">and</span>, <span class="inline-code">or</span>, <span class="inline-code">not</span> склеивают вопросы. <span class="inline-code">break</span> выходит из цикла, <span class="inline-code">continue</span> пропускает один круг.</div>
        `,
      tryCode: "import math\nprint(\"4\" + \"2\")\nprint(math.sqrt(16))\nprint(math.ceil(3.2))"
    },
    {
      title: "🪜 Четыре шага сложной задачи",
      body: `
          <ol>
            <li><strong>Что дано.</strong> Сколько чисел придёт? Первое — это количество, а дальше сами числа? Есть ли сигнал «стоп», например 0?</li>
            <li><strong>Какие правила.</strong> Формула, сравнение, <span class="inline-code">math</span> или остаток <span class="inline-code">%</span>? Запиши их словами до кода.</li>
            <li><strong>Нужен ли цикл.</strong> Кругов известно — <span class="inline-code">for</span>. Кругов неизвестно или «пока не...» — <span class="inline-code">while</span>. Внутри копи сумму или ищи максимум через <span class="inline-code">if</span>.</li>
            <li><strong>Что вывести.</strong> Одно число, несколько строк или слово. Проверь на маленьком примере рукой, потом нажимай «Проверить».</li>
          </ol>
          <div class="callout info">Пример хода: «сначала n, потом n оценок → сложить в цикле → разделить и округлить → if выберет статус». Так устроена первая задача этой главы.</div>
        `,
      tryCode: "n = int(input(\"Сколько чисел? \"))\ns = 0\nfor i in range(n):\n    s = s + int(input())\nprint(\"Сумма:\", s)"
    },
    {
      title: "🌟 Ряд из рядов",
      body: `
          <p>Большая задача часто складывается из двух циклов. Внешний решает, сколько рядов. Внутренний собирает один ряд. После всех рядов можно напечатать итог: сколько фигур получилось.</p>
          <div class="code-sample"><span class="kw">for</span> r <span class="kw">in</span> range(<span class="nm">2</span>):
    line = <span class="st">""</span>
    <span class="kw">for</span> c <span class="kw">in</span> range(<span class="nm">2</span>):
        line = line + <span class="st">"*"</span>
    <span class="kw">print</span>(line)</div>
          <div class="callout">На зачёте так же: сначала реши, что повторяется, потом что считается один раз после цикла. Средний балл, максимум, сумма чеков и рисунок устроены одинаково.</div>
        `,
      tryCode: "for r in range(2):\n    line = \"\"\n    for c in range(2):\n        line = line + \"*\"\n    print(line)",
      trace: {
        title: "Квадрат два на два",
        code: "for r in range(2):\n    line = \"\"\n    for c in range(2):\n        line = line + \"*\"\n    print(line)"
      }
    }
  ],
  quizzes: [
    {
      id: "m6q0",
      question: "1. Что выведет print(\"4\" + \"2\")?",
      options: ["42", "6", "4", "Ошибку"],
      correct: 0,
      explain: "Числа в кавычках — текст. Плюс склеивает строки: \"4\" + \"2\" = \"42\". Чтобы сложить, нужен int."
    },
    {
      id: "m6q1",
      question: "2. Чему равны math.ceil(3.1) и math.sqrt(16)?",
      options: ["4 и 4", "3 и 4", "3.1 и 8", "4 и 16"],
      correct: 0,
      explain: "ceil поднимает 3.1 до 4. Корень из 16 равен 4, потому что 4 × 4 = 16. Перед этим нужна строка import math."
    },
    {
      id: "m6q2",
      question: "3. x = 50. Что напечатается?\nif x >= 90:\n    print(\"A\")\nelif x >= 40:\n    print(\"B\")\nelse:\n    print(\"C\")",
      options: ["B", "A", "C", "A и B"],
      correct: 0,
      explain: "50 не дотягивает до 90. Второй вопрос 50 >= 40 — да, печатается только B. Дальше Python не идёт."
    },
    {
      id: "m6q3",
      question: "4. Какие числа даст range(2, 6)?",
      options: ["2, 3, 4, 5", "2, 3, 4, 5, 6", "0, 1, 2, 3, 4, 5", "6, 5, 4, 3, 2"],
      correct: 0,
      explain: "Старт 2, стоп перед 6. Шестёрка не входит."
    },
    {
      id: "m6q4",
      question: "5. Когда остановится while x != 0, если внутри читают новый x?",
      options: [
        "Когда введут 0",
        "После первого круга всегда",
        "Когда x станет больше 10",
        "Такой цикл нельзя остановить"
      ],
      correct: 0,
      explain: "Пока x не ноль, круг продолжается. Ноль делает условие ложным, и цикл заканчивается. Ноль в сумму обычно не кладут."
    },
    {
      id: "m6q5",
      question: "6. Лестница из 4 рядов: в первом 1 звезда, во втором 2, в третьем 3, в четвёртом 4. Сколько звёзд всего?",
      options: ["10", "4", "8", "16"],
      correct: 0,
      explain: "1 + 2 + 3 + 4 = 10. Это сумма ряда, её копят в переменной, пока циклы рисуют строки."
    }
  ],
  tasks: [
    {
      id: "m6t0",
      type: "code",
      title: "Калькулятор оценок",
      desc: "Сначала вводят, сколько оценок <span class=\"inline-code\">n</span>, потом сами оценки — <span class=\"inline-code\">n</span> целых чисел. Напечатай две строки:<br>1) средний балл, округлённый до 1 знака через <span class=\"inline-code\">round(..., 1)</span><br>2) статус: <strong>Отличник</strong>, если средний не меньше 4.5; <strong>Хорошист</strong>, если не меньше 3.5; иначе <strong>Нужно подтянуть</strong>.<br><span style=\"font-size:12.5px;color:#64748b;\">Большие и маленькие буквы в статусе сойдут.</span>",
      starter: "n = int(input())\n# прочитай n оценок, посчитай среднее и статус\n",
      hints: [
        "Сумму копи в цикле. Среднее = сумма / n. Округли: round(среднее, 1). Потом if / elif / else.",
        "avg = round(s / n, 1)\nprint(avg)\nif avg >= 4.5:\n    print(\"Отличник\")\nelif avg >= 3.5:\n    print(\"Хорошист\")\nelse:\n    print(\"Нужно подтянуть\")"
      ],
      codeCheck: function (code) {
        if (!/\b(for|while)\b/.test(code)) return "Оценок несколько — читай их в цикле for или while.";
        if (!/round\s*\(/.test(code)) return "Средний балл округли до 1 знака: round(сумма / n, 1).";
        if (!/\bif\b/.test(code) || !/\belse\b/.test(code)) return "Статус выбирай через if, elif и else.";
        return null;
      },
      tests: [
        { inputs: ["3", "5", "5", "4"], expectedLines: ["4.7", "Отличник"], numericMatch: true, ignoreCase: true },
        { inputs: ["2", "3", "4"], expectedLines: ["3.5", "Хорошист"], numericMatch: true, ignoreCase: true }
      ]
    },
    {
      id: "m6t1",
      type: "code",
      title: "Поиск максимума",
      desc: "Сначала вводят количество чисел <span class=\"inline-code\">n</span>, потом <span class=\"inline-code\">n</span> целых чисел. Напечатай самое большое. Готовую <span class=\"inline-code\">max()</span> использовать нельзя: запомни первое число и в цикле обновляй его через <span class=\"inline-code\">if</span>, если встретилось большее.",
      starter: "n = int(input())\n# первое число можно взять стартовым максимумом\n",
      hints: [
        "best = int(input()). Остальные n - 1 чисел читай в цикле. Если новое больше best, запиши его в best.",
        "best = int(input())\nfor i in range(n - 1):\n    x = int(input())\n    if x > best:\n        best = x\nprint(best)"
      ],
      codeCheck: function (code) {
        if (/max\s*\(/.test(code)) return "Функцию max() здесь нельзя. Сравнивай числа сам, через if.";
        if (!/\b(for|while)\b/.test(code)) return "Чисел много — нужен цикл.";
        if (!/\bif\b/.test(code)) return "Если новое число больше запомненного, обнови максимум через if.";
        return null;
      },
      tests: [
        { inputs: ["4", "3", "9", "2", "7"], expectedLines: ["9"] },
        { inputs: ["3", "-1", "-8", "-2"], expectedLines: ["-1"] }
      ]
    },
    {
      id: "m6t2",
      type: "code",
      title: "Умный банкомат",
      desc: "Вводят сумму (она кратна 100) и процент бонуса, целое число. Посчитай итог: сумма плюс бонус. Напечатай <strong>три строки</strong>:<br>1) итоговая сумма<br>2) сколько купюр по 500 в ней помещается<br>3) сколько сом останется после этих купюр.<br>Если сумма не кратна 100, напечатай одно слово <strong>Ошибка</strong>.<br><span style=\"font-size:12.5px;color:#64748b;\">Пример: 1000 и 10 → 1100, потом 2, потом 100</span>",
      starter: "amount = int(input())\npercent = int(input())\n# if сумма не кратна 100 — Ошибка\n",
      hints: [
        "Бонус: amount * percent // 100. Купюры: итог // 500. Остаток: итог % 500. Проверку кратности сделай через if и %.",
        "if amount % 100 != 0:\n    print(\"Ошибка\")\nelse:\n    total = amount + amount * percent // 100\n    print(total)\n    print(total // 500)\n    print(total % 500)"
      ],
      codeCheck: function (code) {
        if (!/\bif\b/.test(code)) return "Проверь через if, что сумма кратна 100.";
        if (!/%/.test(code)) return "Остаток и кратность считай через %.";
        if (!/\/\//.test(code) && !/math\s*\./.test(code)) return "Сколько купюр по 500 — через // или math.floor.";
        return null;
      },
      tests: [
        { inputs: ["1000", "10"], expectedLines: ["1100", "2", "100"], numericMatch: true },
        { inputs: ["2000", "0"], expectedLines: ["2000", "4", "0"], numericMatch: true }
      ]
    },
    {
      id: "m6t3",
      type: "code",
      variant: true,
      title: "Твоя сумма крупных шагов",
      desc: "Пороги подставятся лично для тебя.",
      starter: "n = int(input())\n",
      hints: [],
      build: function (v) {
        const k = 2 + (v.c % 4);
        const gate = v.price;
        function stepped(n) {
          let sum = 0;
          for (let i = 1; i <= n; i++) if (i % k === 0) sum += i;
          return sum;
        }
        function hasNum(code, n) {
          return new RegExp("(^|\\D)" + n + "(\\D|$)").test(code);
        }
        const bigN = k * 20;
        const bigSum = stepped(bigN);
        return {
          desc: "Вводят число <span class=\"inline-code\">n</span>. Сложи все числа от 1 до n, которые делятся на <strong>" + k + "</strong> без остатка. Если эта сумма не меньше <strong>" + gate + "</strong>, напечатай её. Если меньше — напечатай <strong>0</strong>. Оба числа только твои.",
          starter: "n = int(input())\nk = " + k + "\ngate = " + gate + "\n# сложи кратные k, потом сравни с gate\n",
          hints: [
            "В цикле for прибавляй i, только если i % k == 0. После цикла сравни сумму с " + gate + ".",
            "if s >= gate:\n    print(s)\nelse:\n    print(0)"
          ],
          codeCheck: function (code) {
            if (!/\b(for|while)\b/.test(code)) return "Числа от 1 до n перебирай циклом.";
            if (!/\bif\b/.test(code)) return "Нужен if: прибавлять только кратные и решить, печатать сумму или 0.";
            if (!hasNum(code, k) || !hasNum(code, gate)) {
              return "В коде должны быть твои числа " + k + " и " + gate + ".";
            }
            return null;
          },
          tests: [
            { inputs: [String(k)], expectedLines: ["0"] },
            { inputs: [String(bigN)], expectedLines: [String(bigSum)] }
          ]
        };
      },
      codeCheck: function (code) {
        if (!/\b(for|while)\b/.test(code)) return "Числа от 1 до n перебирай циклом.";
        if (!/\bif\b/.test(code)) return "Нужен if: прибавлять только нужные числа и решить, что печатать.";
        return null;
      }
    },
    {
      id: "m6t4",
      type: "code",
      sandboxPreset: "guess",
      title: "Угадай число",
      desc: "Собери мини-игру. Секретное число зафиксируй как <strong>7</strong>, чтобы проверка сошлась.<br><br>Чек-лист:<br>1) цикл <span class=\"inline-code\">while</span>, пока игрок не угадает;<br>2) каждый круг читает догадку через <span class=\"inline-code\">int(input())</span>;<br>3) если секрет больше догадки — строка <strong>Больше</strong>;<br>4) если секрет меньше — <strong>Меньше</strong>;<br>5) если совпало — <strong>Угадал</strong> и <span class=\"inline-code\">break</span>.<br><span style=\"font-size:12.5px;color:#64748b;\">Большие и маленькие буквы в этих словах сойдут. Кнопка ниже кладёт заготовку в Песочницу — там можно поиграть, а сдавать код нужно здесь.</span>",
      starter: "secret = 7\n# while, if / elif / else, слова Больше, Меньше, Угадал\n",
      hints: [
        "Пока не угадали, читай новое число. Сравни его с secret тремя ветками. Из цикла выходи через break.",
        "while True:\n    guess = int(input())\n    if guess == secret:\n        print(\"Угадал\")\n        break\n    elif guess < secret:\n        print(\"Больше\")\n    else:\n        print(\"Меньше\")"
      ],
      codeCheck: function (code) {
        if (!/\bwhile\b/.test(code)) return "Игра крутится в while, пока число не угадано.";
        if (!/\bif\b/.test(code) || !/\belse\b/.test(code)) return "Подсказки делай через if / elif / else.";
        if (!/\bbreak\b/.test(code)) return "Когда игрок угадал, останови цикл командой break.";
        if (!/(^|\D)7(\D|$)/.test(code)) return "Секрет в этой задаче — число 7, иначе автопроверка не сойдётся.";
        return null;
      },
      tests: [
        { inputs: ["3", "9", "7"], expectedLines: ["Больше", "Меньше", "Угадал"], ignoreCase: true },
        { inputs: ["7"], expectedLines: ["Угадал"], ignoreCase: true }
      ]
    },
    {
      id: "m6t5",
      type: "code",
      title: "Касса смены",
      desc: "Кассир вводит цены, пока не введёт <strong>0</strong>. Ноль — конец смены, в сумму его не клади. Напечатай две строки:<br>1) общая сумма всех цен;<br>2) сколько чеков были не меньше <strong>100</strong>.<br>Сколько цен будет, заранее неизвестно: здесь <span class=\"inline-code\">while</span> и <span class=\"inline-code\">if</span>.<br><span style=\"font-size:12.5px;color:#64748b;\">Пример: 50, 120, 80, 200, 0 → 450 и 2</span>",
      starter: "total = 0\nbig = 0\n# читай цену, пока не 0\n",
      hints: [
        "Прочитай цену до цикла. Пока она не 0, прибавляй её к total. Если цена >= 100, прибавь 1 к big. Потом прочитай следующую цену.",
        "price = int(input())\nwhile price != 0:\n    total = total + price\n    if price >= 100:\n        big = big + 1\n    price = int(input())\nprint(total)\nprint(big)"
      ],
      codeCheck: function (code) {
        if (!/\bwhile\b/.test(code)) return "Цен заранее неизвестно — нужен цикл while.";
        if (!/input\s*\(/.test(code)) return "Каждую цену читай через input().";
        if (!/\bif\b/.test(code)) return "Дорогие чеки от 100 считай отдельным if.";
        if (!/(^|\D)100(\D|$)/.test(code)) return "Порог дорогого чека — 100.";
        return null;
      },
      tests: [
        { inputs: ["50", "120", "80", "200", "0"], expectedLines: ["450", "2"] },
        { inputs: ["40", "0"], expectedLines: ["40", "0"] },
        { inputs: ["100", "0"], expectedLines: ["100", "1"] }
      ]
    },
    {
      id: "m6t6",
      type: "code",
      title: "Лестница из звёзд",
      desc: "Вводят высоту <span class=\"inline-code\">n</span>. Нарисуй лестницу из <strong>*</strong> и в конце напечатай, сколько звёзд ушло всего.<br>Первый ряд — одна звезда, второй — две, и так до n.<br>Нужны два цикла <span class=\"inline-code\">for</span> и переменная-сумма. Ряды печатай по ходу, итог — одной строкой после циклов.<br><span style=\"font-size:12.5px;color:#64748b;\">Пример для n = 3: три строки звёзд, потом число 6</span>",
      starter: "n = int(input())\ntotal = 0\n# внешний for — ряды, внутренний — звёзды ряда\n",
      hints: [
        "На ряду номер i должно быть i звёзд. После печати ряда прибавь i к total. Когда циклы кончились, print(total).",
        "for i in range(1, n + 1):\n    row = \"\"\n    for j in range(i):\n        row = row + \"*\"\n    print(row)\n    total = total + i\nprint(total)"
      ],
      codeCheck: function (code) {
        if ((code.match(/\bfor\b/g) || []).length < 2) {
          return "Нужны два цикла for: ряды и звёзды внутри ряда.";
        }
        return null;
      },
      tests: [
        { inputs: ["3"], expectedLines: ["*", "**", "***", "6"] },
        { inputs: ["1"], expectedLines: ["*", "1"] },
        { inputs: ["4"], expectedLines: ["*", "**", "***", "****", "10"] }
      ]
    }
  ]
});
