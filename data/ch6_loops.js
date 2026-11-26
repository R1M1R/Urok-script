window.COURSE_CHAPTERS = window.COURSE_CHAPTERS || [];
window.COURSE_CHAPTERS.push({
  id: "ch6",
  order: 6,
  lessons: "34–41",
  hours: 8,
  lessonCount: 8,
  badge: "Уроки 34–41 • 8 ч.",
  title: "Циклы while и for",
  desc: "for и range, шаг, while, счётчик, break и continue, цикл внутри цикла. Восемь уроков: каждая новая задача — отдельный приём.",
  symbols: "loops",
  comingSoon: false,
  theory: [
    {
      title: "🔁 Зачем цикл и как устроен for",
      body: `
          <p>Если одну и ту же команду нужно сделать много раз, не копируй её. Цикл повторяет блок сам.</p>
          <p><span class="inline-code">for</span> используют, когда число кругов известно заранее. Список кругов строит <span class="inline-code">range</span>:</p>
          <ul>
            <li><span class="inline-code">range(5)</span> — 0, 1, 2, 3, 4. Пять чисел, с нуля.</li>
            <li><span class="inline-code">range(1, 5)</span> — 1, 2, 3, 4. <strong>5 уже не входит.</strong> Это самая частая ловушка.</li>
            <li><span class="inline-code">range(1, 10, 2)</span> — 1, 3, 5, 7, 9. Третье число — шаг.</li>
          </ul>
          <div class="code-sample">s = <span class="nm">0</span>
<span class="kw">for</span> i <span class="kw">in</span> range(<span class="nm">1</span>, <span class="nm">5</span>):
    s = s + i
<span class="kw">print</span>(s)  <span class="cm"># 10</span></div>
          <div class="callout">Строка под <span class="inline-code">for</span> сдвинута на 4 пробела, а в конце строки цикла стоит двоеточие <span class="inline-code">:</span>. Как у if.</div>
        `,
      tryCode: "s = 0\nfor i in range(1, 5):\n    s = s + i\nprint(s)",
      trace: {
        title: "Сумма 1 + 2 + 3 + 4",
        code: "s = 0\nfor i in range(1, 5):\n    s = s + i\nprint(s)"
      }
    },
    {
      title: "⏳ while — пока условие правда",
      body: `
          <p><span class="inline-code">while</span> повторяет блок, <strong>пока</strong> вопрос даёт «да». Сколько будет кругов, заранее можно не знать: пароль, обратный отсчёт, числа до нуля.</p>
          <div class="code-sample">n = <span class="nm">3</span>
<span class="kw">while</span> n &gt; <span class="nm">0</span>:
    <span class="kw">print</span>(n)
    n = n - <span class="nm">1</span>
<span class="kw">print</span>(<span class="st">"Пуск"</span>)</div>
          <div class="callout">Осторожно: бесконечный цикл. Если внутри while переменная из условия не меняется, «да» не кончится никогда. Программа зависнет. В нашем тренажёре такой скрипт останавливается сам через несколько секунд.</div>
        `,
      tryCode: "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint(\"Пуск\")",
      trace: {
        title: "Обратный отсчёт",
        code: "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint(\"Пуск\")"
      }
    },
    {
      title: "🧮 Счётчик и сумматор",
      body: `
          <p><strong>Счётчик</strong> считает круги. Перед циклом он равен 0, внутри каждый раз прибавляем 1.</p>
          <p><strong>Сумматор</strong> копит сумму. Тоже стартует с 0, внутри прибавляем очередное число.</p>
          <div class="code-sample">count = <span class="nm">0</span>
total = <span class="nm">0</span>
<span class="kw">for</span> i <span class="kw">in</span> range(<span class="nm">1</span>, <span class="nm">4</span>):
    count = count + <span class="nm">1</span>
    total = total + i
<span class="kw">print</span>(count)  <span class="cm"># 3 круга</span>
<span class="kw">print</span>(total)  <span class="cm"># 1+2+3 = 6</span></div>
          <div class="callout info">Короткая запись той же прибавки: <span class="inline-code">count += 1</span> и <span class="inline-code">total += i</span>. Смысл тот же.</div>
        `,
      tryCode: "count = 0\ntotal = 0\nfor i in range(1, 4):\n    count += 1\n    total += i\nprint(count)\nprint(total)"
    },
    {
      title: "🚪 break и continue",
      body: `
          <p>Две команды управляют кругом изнутри:</p>
          <ul>
            <li><span class="inline-code">continue</span> — этот круг бросаем и сразу идём к следующему.</li>
            <li><span class="inline-code">break</span> — выходим из цикла совсем, даже если круги ещё остались.</li>
          </ul>
          <div class="code-sample"><span class="kw">for</span> i <span class="kw">in</span> range(<span class="nm">1</span>, <span class="nm">6</span>):
    <span class="kw">if</span> i == <span class="nm">3</span>:
        <span class="kw">continue</span>
    <span class="kw">if</span> i == <span class="nm">5</span>:
        <span class="kw">break</span>
    <span class="kw">print</span>(i)</div>
          <p>На экране будет 1, потом 2, потом 4. Тройку пропустили, а на пятёрке цикл закрылся раньше print.</p>
        `,
      tryCode: "for i in range(1, 6):\n    if i == 3:\n        continue\n    if i == 5:\n        break\n    print(i)",
      trace: {
        title: "1, 2, потом пропуск, потом выход",
        code: "for i in range(1, 6):\n    if i == 3:\n        continue\n    if i == 5:\n        break\n    print(i)"
      }
    },
    {
      title: "🔢 Шаг range: не каждое число",
      body: `
          <p>Третье число в <span class="inline-code">range</span> — это шаг. <span class="inline-code">range(0, 9, 2)</span> даёт 0, 2, 4, 6, 8. Девятка не входит, шаг перепрыгивает через одно число.</p>
          <div class="code-sample"><span class="kw">for</span> i <span class="kw">in</span> range(<span class="nm">0</span>, <span class="nm">9</span>, <span class="nm">2</span>):
    <span class="kw">print</span>(i)</div>
          <div class="callout">Чётные от 2 до n удобно взять так: <span class="inline-code">range(2, n + 1, 2)</span>. Последняя граница по-прежнему не входит, поэтому стоит <span class="inline-code">n + 1</span>.</div>
        `,
      tryCode: "for i in range(0, 9, 2):\n    print(i)",
      trace: {
        title: "Шаг 2 до девятки, не включая её",
        code: "for i in range(0, 9, 2):\n    print(i)"
      }
    },
    {
      title: "🧱 Цикл внутри цикла",
      body: `
          <p>Внешний цикл считает ряды. Внутренний на каждом ряду собирает клетки. Внутренний сдвинут ещё на 4 пробела.</p>
          <p>Два ряда по три звезды: внешний крутится 2 раза, внутренний на каждом ряду — 3 раза. Тело внутреннего цикла выполнится 2 × 3 = 6 раз.</p>
          <div class="code-sample"><span class="kw">for</span> r <span class="kw">in</span> range(<span class="nm">2</span>):
    line = <span class="st">""</span>
    <span class="kw">for</span> c <span class="kw">in</span> range(<span class="nm">3</span>):
        line = line + <span class="st">"*"</span>
    <span class="kw">print</span>(line)</div>
          <div class="callout info">Сначала полностью заканчивается внутренний цикл, и только потом внешний переходит к следующему ряду.</div>
        `,
      tryCode: "for r in range(2):\n    line = \"\"\n    for c in range(3):\n        line = line + \"*\"\n    print(line)",
      trace: {
        title: "Два ряда по три звезды",
        code: "for r in range(2):\n    line = \"\"\n    for c in range(3):\n        line = line + \"*\"\n    print(line)"
      }
    }
  ],
  quizzes: [
    {
      id: "m5q0",
      question: "1. Какие числа выдаст range(1, 5)?",
      options: [
        "1, 2, 3, 4",
        "1, 2, 3, 4, 5",
        "0, 1, 2, 3, 4",
        "5, 4, 3, 2, 1"
      ],
      correct: 0,
      explain: "range(1, 5) начинается с 1 и останавливается перед 5. Пятёрки в списке нет."
    },
    {
      id: "m5q1",
      question: "2. Сколько раз выполнится тело for i in range(4)?",
      options: [
        "4",
        "3",
        "5",
        "1"
      ],
      correct: 0,
      explain: "range(4) — это 0, 1, 2, 3. Четыре круга. Ноль тоже считается."
    },
    {
      id: "m5q2",
      question: "3. Почему цикл x = 1; while x < 5: print(x) станет бесконечным?",
      options: [
        "x никогда не меняется и всегда меньше 5",
        "print нельзя писать в while",
        "x сразу больше 5",
        "Не хватает range"
      ],
      correct: 0,
      explain: "Условие x < 5 всё время правда, потому что x так и остаётся 1. Внутри цикла x нужно увеличивать."
    },
    {
      id: "m5q3",
      question: "4. Чему равна s после s = 0; for i in range(1, 4): s = s + i?",
      options: [
        "6",
        "4",
        "10",
        "3"
      ],
      correct: 0,
      explain: "range(1, 4) даёт 1, 2 и 3. Сумма 1 + 2 + 3 = 6. Четвёрка в круг не входит."
    },
    {
      id: "m5q4",
      question: "5. Когда лучше выбрать for, а когда while?",
      options: [
        "for — если число кругов известно, while — если ждём события",
        "Они всегда взаимозаменяемы без разницы",
        "while только для текста, for только для чисел",
        "for нельзя остановить, while нельзя считать сумму"
      ],
      correct: 0,
      explain: "Числа от 1 до n удобно крутить через for и range. Пароль или ввод до нуля — через while: заранее не знаем, сколько раз спросят."
    },
    {
      id: "m5q5",
      question: "6. Какие числа выдаст range(2, 11, 3)?",
      options: ["2, 5, 8", "2, 5, 8, 11", "3, 6, 9", "2, 3, 11"],
      correct: 0,
      explain: "Старт 2, шаг 3: 2, потом 5, потом 8. Следующее было бы 11, но граница 11 уже не входит."
    },
    {
      id: "m5q6",
      question: "7. Сколько раз выполнится print, если внешний цикл range(3), а внутри него ещё range(2) и print?",
      options: ["6", "3", "2", "5"],
      correct: 0,
      explain: "Внешний круг запускает внутренний целиком. 3 раза по 2 печати = 6."
    }
  ],
  tasks: [
    {
      id: "m5t0",
      type: "parsons",
      parsonsMode: "both",
      title: "Обратный отсчёт ракеты",
      desc: "Собери отсчёт на <span class=\"inline-code\">while</span>. Число <span class=\"inline-code\">n</span> вводят. Пока оно больше нуля, печатай его и уменьшай на 1. Команды внутри цикла сдвинь на 4 пробела. В конце, уже вне цикла, напечатай <strong>Пуск</strong>.",
      lines: [
        { code: "n = int(input())", indent: 0 },
        { code: "while n > 0:", indent: 0 },
        { code: "print(n)", indent: 1 },
        { code: "n = n - 1", indent: 1 },
        { code: "print(\"Пуск\")", indent: 0 }
      ],
      hints: [
        "Сначала прочитай n. Потом while n > 0. Внутри — print и только потом n = n - 1. Пуск стоит после цикла, без отступа.",
        "while n > 0:\n    print(n)\n    n = n - 1\nprint(\"Пуск\")"
      ],
      codeCheck: function (code) {
        if (!/while\b/.test(code)) return "Отсчёт делай циклом while.";
        if (!/n\s*=\s*n\s*-\s*1/.test(code) && !/n\s*-=\s*1/.test(code)) {
          return "Внутри цикла уменьши n: n = n - 1. Иначе отсчёт зависнет.";
        }
        return null;
      },
      tests: [
        { inputs: ["3"], expectedLines: ["3", "2", "1", "Пуск"] },
        { inputs: ["1"], expectedLines: ["1", "Пуск"] }
      ]
    },
    {
      id: "m5t1",
      type: "parsons",
      parsonsMode: "both",
      title: "Таблица умножения",
      desc: "Собери таблицу для введённого числа <span class=\"inline-code\">k</span>: пять строк, от 1 до 5. Пример для двойки: <strong>2 x 1 = 2</strong>. Строка <span class=\"inline-code\">print</span> внутри <span class=\"inline-code\">for</span> сдвинута на 4 пробела.",
      lines: [
        { code: "k = int(input())", indent: 0 },
        { code: "for i in range(1, 6):", indent: 0 },
        { code: "print(k, \"x\", i, \"=\", k * i)", indent: 1 }
      ],
      hints: [
        "range(1, 6) даёт 1, 2, 3, 4, 5. Шестёрка не входит — как раз пять строк.",
        "for i in range(1, 6):\n    print(k, \"x\", i, \"=\", k * i)"
      ],
      codeCheck: function (code) {
        if (!/for\b/.test(code)) return "Таблицу собирает цикл for.";
        if (!/range\s*\(\s*1\s*,\s*6\s*\)/.test(code)) return "Нужен range(1, 6): числа от 1 до 5.";
        return null;
      },
      tests: [
        { inputs: ["2"], expectedLines: ["2 x 1 = 2", "2 x 2 = 4", "2 x 3 = 6", "2 x 4 = 8", "2 x 5 = 10"] },
        { inputs: ["3"], expectedLines: ["3 x 1 = 3", "3 x 2 = 6", "3 x 3 = 9", "3 x 4 = 12", "3 x 5 = 15"] }
      ]
    },
    {
      id: "m5t2",
      type: "code",
      title: "Спаси от зависания",
      desc: "Скрипт должен напечатать <strong>сумму</strong> чисел от 1 до n, а следом сами числа от 1 до n, каждое на новой строке. Сейчас он зависнет и не допечатает последнее число. Найди обе ошибки.<br><span style=\"font-size:12.5px;color:#64748b;\">Пример для n = 3: сначала 6, потом 1, 2, 3</span>",
      starter: "n = int(input())\ns = 0\ni = 1\nwhile i <= n:\n    s = s + i\nprint(s)\nfor i in range(1, n):\n    print(i)\n",
      hints: [
        "В while переменная i не меняется — условие вечно правда. Добавь i = i + 1 внутри цикла.",
        "range(1, n) не включает n. Напиши range(1, n + 1)."
      ],
      codeCheck: function (code) {
        if (!/while\b/.test(code)) return "Цикл while оставь: его нужно починить, а не стирать.";
        if (!/i\s*=\s*i\s*\+\s*1/.test(code) && !/i\s*\+=\s*1/.test(code)) {
          return "Внутри while счётчик i не меняется, программа зависнет. Добавь i = i + 1.";
        }
        if (/range\s*\(\s*1\s*,\s*n\s*\)/.test(code)) {
          return "range(1, n) не печатает само n. Нужно range(1, n + 1).";
        }
        return null;
      },
      tests: [
        { inputs: ["3"], expectedLines: ["6", "1", "2", "3"] },
        { inputs: ["1"], expectedLines: ["1", "1"] }
      ]
    },
    {
      id: "m5t3",
      type: "code",
      title: "Числа от 1 до n",
      desc: "Вводят целое <span class=\"inline-code\">n</span>. Напечатай все числа от 1 до n включительно, каждое на новой строке. Используй цикл <span class=\"inline-code\">for</span> и <span class=\"inline-code\">range</span>.",
      starter: "n = int(input())\n# числа от 1 до n\n",
      hints: [
        "Последняя граница range не входит. Чтобы дойти до n, напиши range(1, n + 1).",
        "for i in range(1, n + 1):\n    print(i)"
      ],
      codeCheck: function (code) {
        if (!/\bfor\b/.test(code)) return "В этой задаче нужен цикл for.";
        if (!/range\s*\(/.test(code)) return "Перебери числа через range.";
        return null;
      },
      tests: [
        { inputs: ["4"], expectedLines: ["1", "2", "3", "4"] },
        { inputs: ["1"], expectedLines: ["1"] }
      ]
    },
    {
      id: "m5t4",
      type: "code",
      title: "Сумма от 1 до n",
      desc: "Вводят целое <span class=\"inline-code\">n</span>. Посчитай циклом сумму всех чисел от 1 до n и напечатай одно число. Формула без цикла не подойдёт: нужен <span class=\"inline-code\">for</span> или <span class=\"inline-code\">while</span>.<br><span style=\"font-size:12.5px;color:#64748b;\">Пример: n = 4 → 10, потому что 1 + 2 + 3 + 4</span>",
      starter: "n = int(input())\ns = 0\n# прибавляй числа внутри цикла\n",
      hints: [
        "Заведи сумму s = 0 до цикла. Внутри прибавляй очередное i: s = s + i.",
        "for i in range(1, n + 1):\n    s = s + i\nprint(s)"
      ],
      codeCheck: function (code) {
        if (!/\bfor\b/.test(code) && !/\bwhile\b/.test(code)) {
          return "Сумму должен накопить цикл for или while, не одна готовая формула.";
        }
        return null;
      },
      tests: [
        { inputs: ["1"], expectedLines: ["1"] },
        { inputs: ["4"], expectedLines: ["10"] },
        { inputs: ["5"], expectedLines: ["15"] }
      ]
    },
    {
      id: "m5t5",
      type: "code",
      title: "Копилка",
      desc: "Считывай целые числа через <span class=\"inline-code\">int(input())</span>, пока не введут <strong>0</strong>. Ноль — это сигнал «хватит», в сумму его не клади. В конце напечатай сумму всех предыдущих чисел. Сколько их будет, заранее неизвестно, поэтому здесь <span class=\"inline-code\">while</span>.",
      starter: "total = 0\n# читай числа, пока не ноль\n",
      hints: [
        "Прочитай первое число до цикла или в начале круга. Если это 0, прибавлять нечего.",
        "total = 0\nx = int(input())\nwhile x != 0:\n    total = total + x\n    x = int(input())\nprint(total)"
      ],
      codeCheck: function (code) {
        if (!/\bwhile\b/.test(code)) return "Чисел заранее неизвестно — нужен цикл while.";
        if (!/input\s*\(/.test(code)) return "Каждое новое число читай через input().";
        if (!/(==|!=)\s*0/.test(code) && !/0\s*(==|!=)/.test(code)) {
          return "Останови цикл, когда введут 0.";
        }
        return null;
      },
      tests: [
        { inputs: ["10", "20", "0"], expectedLines: ["30"] },
        { inputs: ["4", "0"], expectedLines: ["4"] }
      ]
    },
    {
      id: "m5t6",
      type: "code",
      variant: true,
      title: "Сколько делятся на твоё число",
      desc: "Делитель подставится лично для тебя.",
      starter: "n = int(input())\ncount = 0\n",
      hints: [],
      build: function (v) {
        const k = 2 + (v.c % 4);
        function howMany(n) {
          let count = 0;
          for (let i = 1; i <= n; i++) if (i % k === 0) count += 1;
          return String(count);
        }
        function hasNum(code, n) {
          return new RegExp("(^|\\D)" + n + "(\\D|$)").test(code);
        }
        return {
          desc: "Вводят целое <span class=\"inline-code\">n</span>. Посчитай, сколько чисел от 1 до n делятся на <strong>" + k + "</strong> без остатка. Это твоё число, у соседа другое. Напечатай один ответ — сколько таких чисел.",
          starter: "n = int(input())\nk = " + k + "\ncount = 0\n# for и if: если i делится на k\n",
          hints: [
            "Крути i от 1 до n. Если i % k == 0, прибавь 1 к счётчику.",
            "for i in range(1, n + 1):\n    if i % " + k + " == 0:\n        count = count + 1\nprint(count)"
          ],
          codeCheck: function (code) {
            if (!/\bfor\b/.test(code)) return "Перебери числа циклом for.";
            if (!/\bif\b/.test(code)) return "Внутри цикла проверь остаток через if.";
            if (!hasNum(code, k)) return "Дели именно на своё число " + k + ".";
            return null;
          },
          tests: [
            { inputs: ["10"], expectedLines: [howMany(10)] },
            { inputs: ["6"], expectedLines: [howMany(6)] }
          ]
        };
      },
      codeCheck: function (code) {
        if (!/\bfor\b/.test(code)) return "Перебери числа циклом for.";
        if (!/\bif\b/.test(code)) return "Внутри цикла проверь остаток через if.";
        return null;
      }
    },
    {
      id: "m5t7",
      type: "code",
      title: "Чётные шагом",
      desc: "Вводят целое <span class=\"inline-code\">n</span>. Напечатай чётные числа от 2 до n включительно, каждое на новой строке. Используй <span class=\"inline-code\">range</span> с тремя числами: старт, граница и шаг 2.<br><span style=\"font-size:12.5px;color:#64748b;\">Пример: n = 8 → 2, 4, 6, 8</span>",
      starter: "n = int(input())\n# range(старт, граница, шаг)\n",
      hints: [
        "Шаг 2 стоит третьим. Чтобы n само попало в список, правая граница — n + 1.",
        "for i in range(2, n + 1, 2):\n    print(i)"
      ],
      codeCheck: function (code) {
        if (!/\bfor\b/.test(code)) return "Чётные перебирает цикл for.";
        if (!/range\s*\([^)]*,[^)]*,[^)]*\)/.test(code)) {
          return "Нужен range с тремя числами: откуда, до куда и шаг 2.";
        }
        return null;
      },
      tests: [
        { inputs: ["8"], expectedLines: ["2", "4", "6", "8"] },
        { inputs: ["3"], expectedLines: ["2"] },
        { inputs: ["2"], expectedLines: ["2"] }
      ]
    },
    {
      id: "m5t8",
      type: "code",
      title: "Пропусти и останови",
      desc: "Вводят целое <span class=\"inline-code\">n</span>. Печатай числа от 1 до n, но с двумя правилами:<br>• если число делится на 3, пропусти его командой <span class=\"inline-code\">continue</span>;<br>• если число больше 7, останови цикл командой <span class=\"inline-code\">break</span> и это число уже не печатай.<br><span style=\"font-size:12.5px;color:#64748b;\">Пример: n = 10 → 1, 2, 4, 5, 7</span>",
      starter: "n = int(input())\nfor i in range(1, n + 1):\n    # continue для кратных 3, break если i > 7\n    print(i)\n",
      hints: [
        "continue ставь до print, иначе тройка успеет напечататься. break тоже до print: число больше 7 на экран не выходит.",
        "if i % 3 == 0:\n    continue\nif i > 7:\n    break\nprint(i)"
      ],
      codeCheck: function (code) {
        if (!/\bfor\b/.test(code)) return "Числа от 1 до n перебирай циклом for.";
        if (!/\bcontinue\b/.test(code)) return "Кратные трём пропускай командой continue.";
        if (!/\bbreak\b/.test(code)) return "Когда число больше 7, выходи из цикла через break.";
        return null;
      },
      tests: [
        { inputs: ["10"], expectedLines: ["1", "2", "4", "5", "7"] },
        { inputs: ["5"], expectedLines: ["1", "2", "4", "5"] },
        { inputs: ["3"], expectedLines: ["1", "2"] }
      ]
    },
    {
      id: "m5t9",
      type: "code",
      title: "Прямоугольник из звёзд",
      desc: "Вводят два числа: сколько рядов и сколько звёзд в ряду. Напечатай прямоугольник: каждый ряд — одна строка из символов <strong>*</strong>. Нужны <strong>два</strong> цикла <span class=\"inline-code\">for</span>. Внешний считает ряды, внутренний собирает звёзды ряда.<br><span style=\"font-size:12.5px;color:#64748b;\">Пример: 2 и 3 → две строки ***</span>",
      starter: "rows = int(input())\ncols = int(input())\n# внешний for — ряды, внутренний for — звёзды\n",
      hints: [
        "Заведи пустую строку line = \"\" в начале каждого ряда. Во внутреннем цикле прибавляй \"*\". Когда ряд собран, print(line).",
        "for r in range(rows):\n    line = \"\"\n    for c in range(cols):\n        line = line + \"*\"\n    print(line)"
      ],
      codeCheck: function (code) {
        if ((code.match(/\bfor\b/g) || []).length < 2) {
          return "Нужны два цикла: внешний по рядам и внутренний по звёздам.";
        }
        return null;
      },
      tests: [
        { inputs: ["2", "3"], expectedLines: ["***", "***"] },
        { inputs: ["1", "4"], expectedLines: ["****"] },
        { inputs: ["3", "1"], expectedLines: ["*", "*", "*"] }
      ]
    },
    {
      id: "m5t10",
      type: "code",
      title: "Лестница чисел",
      desc: "Вводят высоту <span class=\"inline-code\">n</span>. Напечатай лестницу. Первый ряд — только 1. Второй — <strong>1 2</strong>. Третий — <strong>1 2 3</strong>. И так до ряда n. Снова два цикла: внешний выбирает длину ряда, внутренний собирает числа этого ряда через пробел.<br><span style=\"font-size:12.5px;color:#64748b;\">Пример для n = 3: три строки, последняя «1 2 3»</span>",
      starter: "n = int(input())\n# внешний ряд, внутренний числа 1..длина ряда\n",
      hints: [
        "Число в строку переводит str(j). Пробел добавляй только если в ряду уже что-то есть, иначе в начале строки будет лишний пробел.",
        "for i in range(1, n + 1):\n    row = \"\"\n    for j in range(1, i + 1):\n        if row != \"\":\n            row = row + \" \"\n        row = row + str(j)\n    print(row)"
      ],
      codeCheck: function (code) {
        if ((code.match(/\bfor\b/g) || []).length < 2) {
          return "Нужны два цикла: один для рядов, второй для чисел внутри ряда.";
        }
        return null;
      },
      tests: [
        { inputs: ["3"], expectedLines: ["1", "1 2", "1 2 3"] },
        { inputs: ["1"], expectedLines: ["1"] },
        { inputs: ["4"], expectedLines: ["1", "1 2", "1 2 3", "1 2 3 4"] }
      ]
    }
  ]
});
