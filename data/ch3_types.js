window.COURSE_CHAPTERS = window.COURSE_CHAPTERS || [];
window.COURSE_CHAPTERS.push({
  id: "ch3",
  order: 3,
  lessons: "25–26",
  hours: 2,
  lessonCount: 2,
  badge: "Уроки 25–26 • 2 ч.",
  title: "Типы данных и операции",
  desc: "int, float, str — главная ловушка input(), арифметика, деление // и остаток %.",
  symbols: "types",
  comingSoon: false,
  plan: [
    { n: "25", title: "Текст и числа", do: "Карточка про три типа и трассировка склейки. Задачи «Калькулятор суммы» и «Сколько лет в 2030?»." },
    { n: "26", title: "Деление, остаток, степень", do: "Карточка про //, % и **. Задачи «Делёж пиццы» и «Касса магазина». Если успели — три тренировки. Мини-тест." }
  ],
  theory: [
    {
      title: "🧱 Три главных типа данных",
      body: `
          <ul>
            <li><span class="inline-code">int</span> — целые числа: <span class="inline-code">7</span>, <span class="inline-code">-15</span>, <span class="inline-code">2026</span></li>
            <li><span class="inline-code">float</span> — дробные числа (через точку!): <span class="inline-code">3.14</span>, <span class="inline-code">5.5</span></li>
            <li><span class="inline-code">str</span> — строки (текст в кавычках): <span class="inline-code">"Привет"</span>, <span class="inline-code">"123"</span></li>
          </ul>
          <div class="callout">🪤 <strong>Главная ловушка новичка:</strong> команда <span class="inline-code">input()</span> ВСЕГДА возвращает текст (<span class="inline-code">str</span>)! Поэтому <span class="inline-code">"5" + "3"</span> склеится в <span class="inline-code">"53"</span>! Чтобы складывать числа, оборачиваем ввод в <span class="inline-code">int(input())</span>.</div>
          <div class="code-sample">a = <span class="kw">int</span>(<span class="kw">input</span>(<span class="st">"Число 1: "</span>))
b = <span class="kw">int</span>(<span class="kw">input</span>(<span class="st">"Число 2: "</span>))
<span class="kw">print</span>(a + b)</div>
        `,
      tryCode: "print(\"Текст:\", \"5\" + \"3\")\nprint(\"Числа:\", 5 + 3)",
      trace: {
        title: "Склейка текста и сложение чисел",
        code: "print(\"5\" + \"3\")\nprint(5 + 3)"
      }
    },
    {
      title: "➗ Особые операции: //, % и **",
      body: `
          <p>Кроме обычных <span class="inline-code">+</span>, <span class="inline-code">-</span>, <span class="inline-code">*</span>, <span class="inline-code">/</span>, в Python есть 3 суперполезных знака:</p>
          <ul>
            <li><span class="inline-code">//</span> — <strong>деление нацело</strong> (сколько целых раз поместилось): <span class="inline-code">10 // 3</span> → <span class="inline-code">3</span></li>
            <li><span class="inline-code">%</span> — <strong>остаток от деления</strong>: <span class="inline-code">10 % 3</span> → <span class="inline-code">1</span></li>
            <li><span class="inline-code">**</span> — <strong>возведение в степень</strong>: <span class="inline-code">2 ** 3</span> → <span class="inline-code">8</span></li>
          </ul>
          <div class="code-sample"><span class="kw">print</span>(<span class="nm">10</span> // <span class="nm">3</span>)  <span class="cm"># 3 целых</span>
<span class="kw">print</span>(<span class="nm">10</span> % <span class="nm">3</span>)   <span class="cm"># 1 в остатке</span>
<span class="kw">print</span>(<span class="nm">2</span> ** <span class="nm">4</span>)   <span class="cm"># 16</span></div>
        `,
      tryCode: "print(\"10 // 3 =\", 10 // 3)\nprint(\"10 % 3 =\", 10 % 3)\nprint(\"2 ** 4 =\", 2 ** 4)",
      trace: {
        title: "Целая часть, остаток и степень",
        code: "print(10 // 3)\nprint(10 % 3)\nprint(2 ** 4)"
      }
    }
  ],
  quizzes: [
    {
      id: "m2q0",
      question: "1. Что выведет код: print(\"7\" + \"3\") ?",
      options: ["10", "73", "7 + 3", "Ошибку"],
      correct: 1,
      explain: "Числа в кавычках — это строки (str). Плюс для строк просто склеивает их: \"7\" + \"3\" = \"73\"."
    },
    {
      id: "m2q1",
      question: "2. Как правильно прочитать ЦЕЛОЕ число с клавиатуры в переменную x?",
      options: ["x = input()", "x = str(input())", "x = int(input())", "x = print(input())"],
      correct: 2,
      explain: "int() превращает текст из input() в целое число, с которым можно выполнять математические действия."
    },
    {
      id: "m2q2",
      question: "3. Чему равно 14 % 4 (остаток от деления)?",
      options: ["3", "2", "3.5", "4"],
      correct: 1,
      explain: "4 помещается в 14 три раза (3 * 4 = 12), а в остатке остаётся 14 - 12 = 2."
    }
  ],
  tasks: [
    {
      id: "m2t0",
      type: "code",
      title: "Калькулятор суммы",
      desc: "Прочитай <strong>два целых числа</strong> с помощью <span class=\"inline-code\">int(input())</span> и выведи их сумму.",
      starter: "a = int(input())\nb = \nprint()",
      hints: [
        "Второе число тоже оберни в int(input()), а внутри print() сложи a + b.",
        "a = int(input())\nb = int(input())\nprint(a + b)"
      ],
      codeCheck: function (code) {
        if (!code.includes("int")) return "Используй int(input()), иначе Python склеит числа как текст!";
        return null;
      },
      tests: [
        { inputs: ["12", "8"], expectedLines: ["20"] },
        { inputs: ["45", "55"], expectedLines: ["100"] }
      ]
    },
    {
      id: "m2t1",
      type: "code",
      title: "Сколько лет в 2030?",
      desc: "Пользователь вводит свой <strong>год рождения</strong> (целое число). Выведи, сколько лет ему исполнится в <strong>2030</strong> году.",
      starter: "year = int(input())\n# Посчитай и выведи возраст в 2030 году\n",
      hints: [
        "Чтобы узнать возраст в 2030 году, нужно из 2030 вычесть год рождения.",
        "print(2030 - year)"
      ],
      tests: [
        { inputs: ["2013"], expectedLines: ["17"] },
        { inputs: ["2012"], expectedLines: ["18"] }
      ]
    },
    {
      id: "m2t2",
      type: "code",
      title: "Делёж пиццы (// и %)",
      desc: "На праздник купили <span class=\"inline-code\">n</span> кусков пиццы на <span class=\"inline-code\">k</span> друзей (вводятся два целых числа).<br>Выведи <strong>две строки</strong>:<br>1) Сколько целых кусков достанется каждому (<span class=\"inline-code\">//</span>)<br>2) Сколько кусков останется (<span class=\"inline-code\">%</span>)",
      starter: "n = int(input())\nk = int(input())\n# Выведи целую часть и остаток на двух строках\n",
      hints: [
        "Первая строка: print(n // k). Вторая строка: print(n % k).",
        "n = int(input())\nk = int(input())\nprint(n // k)\nprint(n % k)"
      ],
      tests: [
        { inputs: ["10", "3"], expectedLines: ["3", "1"] },
        { inputs: ["17", "5"], expectedLines: ["3", "2"] }
      ]
    },
    {
      id: "m2t3",
      type: "code",
      title: "Касса магазина",
      desc: "Программа получает <strong>3 ввода</strong>:<br>1) Название товара (текст)<br>2) Цену за 1 шт (целое число)<br>3) Количество (целое число)<br>Выведи итог: <strong>&lt;товар&gt;: &lt;сумма&gt; сом</strong><br><span style=\"font-size:12.5px;color:#64748b;\">Пример: Сок, 120, 3 → Сок: 360 сом</span>",
      starter: "item = input()\nprice = int(input())\ncount = int(input())\n# Посчитай сумму и выведи чек\n",
      hints: [
        "Сначала посчитай total = price * count. Чтобы после товара двоеточие стояло без лишнего пробела, напиши item + \":\".",
        "total = price * count\nprint(item + \":\", total, \"сом\")"
      ],
      tests: [
        { inputs: ["Сок", "120", "3"], expectedLines: ["Сок: 360 сом"], flexibleColon: true },
        { inputs: ["Тетрадь", "45", "4"], expectedLines: ["Тетрадь: 180 сом"], flexibleColon: true }
      ]
    },
    {
      id: "m2t4",
      extra: true,
      type: "code",
      variant: true,
      title: "Твоя сумма",
      desc: "Числа подставятся лично для тебя.",
      starter: "# Выведи сумму своих чисел\n",
      hints: [],
      build: function (v) {
        return {
          desc: "Числа только твои — у соседа другие. Выведи сумму <strong>" + v.a + " + " + v.b + "</strong> без кавычек.",
          starter: "# Выведи сумму своих чисел\n",
          hints: [
            "Сложи " + v.a + " и " + v.b + " прямо в print, без кавычек.",
            "print(" + v.a + " + " + v.b + ")"
          ],
          tests: [
            { inputs: [], expectedLines: [String(v.a + v.b)], numericMatch: true, floatTolerance: 0.01 }
          ]
        };
      }
    },
    {
      id: "m2t5",
      extra: true,
      type: "blanks",
      title: "Дырки в калькуляторе",
      desc: "Заполни пустые места. Программа читает два целых числа и печатает их сумму.",
      template: "a = ___\nb = ___\nprint(___)",
      hints: [
        "Оба ввода оберни в int(input()).",
        "В print напиши a + b."
      ],
      codeCheck: function (code) {
        if (!/int\s*\(/.test(code)) return "Без int() Python склеит цифры как текст, а не сложит их.";
        return null;
      },
      tests: [
        { inputs: ["4", "6"], expectedLines: ["10"] },
        { inputs: ["10", "15"], expectedLines: ["25"] }
      ]
    },
    {
      id: "m2t6",
      extra: true,
      type: "code",
      title: "5 или 5.0",
      desc: "Выведи результат <span class=\"inline-code\">10 / 2</span>. Ответ <strong>5</strong> и ответ <strong>5.0</strong> оба правильные.",
      starter: "# Напечатай 10 / 2\n",
      hints: [
        "Деление через / даёт дробь. Даже если она целая, Python может написать 5.0.",
        "print(10 / 2)"
      ],
      tests: [{ inputs: [], expectedLines: ["5"], numericMatch: true, floatTolerance: 0.01 }]
    }
  ]
});
