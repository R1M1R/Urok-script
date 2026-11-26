window.COURSE_CHAPTERS = window.COURSE_CHAPTERS || [];
window.COURSE_CHAPTERS.push({
  id: "ch4",
  order: 4,
  lessons: "27–28",
  hours: 2,
  lessonCount: 2,
  badge: "Уроки 27–28 • 2 ч.",
  title: "Модуль math",
  desc: "Подключаем библиотеку math: корень, степень, число π и округление вверх или вниз.",
  symbols: "math",
  comingSoon: false,
  theory: [
    {
      title: "📦 Что такое модуль и зачем import math",
      body: `
          <p><strong>Модуль</strong> — это готовая коробка с командами. Python не держит все команды на столе сразу. Математика лежит в коробке <span class="inline-code">math</span>.</p>
          <p>Чтобы открыть коробку, первой строкой напиши:</p>
          <div class="code-sample"><span class="kw">import</span> math
<span class="kw">print</span>(math.sqrt(<span class="nm">16</span>))  <span class="cm"># 4.0</span></div>
          <div class="callout">Без строки <span class="inline-code">import math</span> команда <span class="inline-code">math.sqrt</span> не найдётся. Python честно скажет: такого модуля я не открывал.</div>
        `,
      tryCode: "import math\nprint(math.sqrt(16))"
    },
    {
      title: "√ Корень, степень и число π",
      body: `
          <p>После <span class="inline-code">import math</span> пишем имя коробки, точку и команду:</p>
          <ul>
            <li><span class="inline-code">math.sqrt(x)</span> — квадратный корень. <span class="inline-code">math.sqrt(81)</span> → <span class="inline-code">9</span>, потому что 9 × 9 = 81.</li>
            <li><span class="inline-code">math.pow(x, y)</span> — степень: x умножить на себя y раз. <span class="inline-code">math.pow(2, 5)</span> → <span class="inline-code">32</span>.</li>
            <li><span class="inline-code">math.pi</span> — число π, примерно 3.14159. Скобок нет: это не команда, а готовое число.</li>
          </ul>
          <div class="code-sample"><span class="kw">import</span> math
<span class="kw">print</span>(math.sqrt(<span class="nm">81</span>))
<span class="kw">print</span>(math.pow(<span class="nm">2</span>, <span class="nm">5</span>))
<span class="kw">print</span>(math.pi)</div>
          <div class="callout info">Буквы маленькие: <span class="inline-code">math.sqrt</span>, не <span class="inline-code">math.Sqrt</span>. Точка обязательна.</div>
        `,
      tryCode: "import math\nprint(math.sqrt(81))\nprint(math.pow(2, 5))\nprint(math.pi)"
    },
    {
      title: "⬆️ Потолок, пол и обычное округление",
      body: `
          <ul>
            <li><span class="inline-code">math.ceil(x)</span> — <strong>потолок</strong>: всегда вверх, даже если после точки чуть-чуть. <span class="inline-code">math.ceil(4.1)</span> → <span class="inline-code">5</span>.</li>
            <li><span class="inline-code">math.floor(x)</span> — <strong>пол</strong>: всегда вниз. <span class="inline-code">math.floor(4.9)</span> → <span class="inline-code">4</span>.</li>
            <li><span class="inline-code">round(x, 2)</span> — к ближайшему, и можно оставить 2 знака после точки. Это обычная команда Python, ей <span class="inline-code">math.</span> не нужен. <span class="inline-code">round(math.pi, 2)</span> → <span class="inline-code">3.14</span>.</li>
          </ul>
          <div class="callout">🚌 20 учеников, в автобусе 6 мест. 20 / 6 = 3.33. Трёх автобусов мало: кто-то останется на остановке. <span class="inline-code">math.ceil</span> поднимает 3.33 до 4. Заказываем 4 автобуса.</div>
          <div class="code-sample"><span class="kw">import</span> math
<span class="kw">print</span>(math.ceil(<span class="nm">4.1</span>))   <span class="cm"># 5</span>
<span class="kw">print</span>(math.floor(<span class="nm">4.9</span>))  <span class="cm"># 4</span>
<span class="kw">print</span>(round(math.pi, <span class="nm">2</span>))  <span class="cm"># 3.14</span></div>
        `,
      tryCode: "import math\nprint(math.ceil(4.1))\nprint(math.floor(4.9))\nprint(round(math.pi, 2))"
    }
  ],
  quizzes: [
    {
      id: "m3q0",
      question: "1. Какую строку нужно написать в начале, чтобы заработал math.sqrt?",
      options: [
        "import math",
        "include math",
        "math.import",
        "using math"
      ],
      correct: 0,
      explain: "Коробку math открывает строка import math. Без неё sqrt Python не найдёт."
    },
    {
      id: "m3q1",
      question: "2. Чему равны math.ceil(4.1) и math.floor(4.9)?",
      options: [
        "5 и 4",
        "4 и 4",
        "5 и 5",
        "4 и 5"
      ],
      correct: 0,
      explain: "ceil — потолок: 4.1 поднимается до 5. floor — пол: 4.9 опускается до 4."
    },
    {
      id: "m3q2",
      question: "3. Что выведет math.sqrt(81)?",
      options: [
        "9",
        "81",
        "8",
        "3"
      ],
      correct: 0,
      explain: "Корень из 81 равен 9, потому что 9 умножить на 9 — это 81."
    },
    {
      id: "m3q3",
      question: "4. Чем float(input()) отличается от int(input())?",
      options: [
        "float читает и дроби, int — только целые",
        "Они делают одно и то же",
        "float всегда округляет вверх",
        "int оставляет текст как есть"
      ],
      correct: 0,
      explain: "int(input()) берёт только целые: 12. float(input()) берёт и дробные: 12.5. Для корня и радиуса нужен float."
    }
  ],
  tasks: [
    {
      id: "m3t0",
      type: "parsons",
      parsonsMode: "both",
      title: "Гипотенуза из кубиков",
      desc: "Собери скрипт. Он читает два катета и печатает гипотенузу: корень из <span class=\"inline-code\">a² + b²</span>. Кнопки ↑ ↓ меняют порядок, ← → — отступ. Здесь все строки без отступа.",
      lines: [
        { code: "import math", indent: 0 },
        { code: "a = float(input())", indent: 0 },
        { code: "b = float(input())", indent: 0 },
        { code: "c = math.sqrt(a ** 2 + b ** 2)", indent: 0 },
        { code: "print(c)", indent: 0 }
      ],
      hints: [
        "Сначала открой math, потом прочитай a и b, потом посчитай корень, и только в конце print.",
        "Формула одной строкой: c = math.sqrt(a ** 2 + b ** 2)"
      ],
      codeCheck: function (code) {
        if (!/import\s+math/.test(code)) return "Первой строкой подключи библиотеку: import math";
        if (!/math\s*\.\s*sqrt/.test(code)) return "Гипотенуза считается через math.sqrt.";
        return null;
      },
      tests: [
        { inputs: ["3", "4"], expectedLines: ["5"], numericMatch: true, floatTolerance: 0.01 },
        { inputs: ["6", "8"], expectedLines: ["10"], numericMatch: true, floatTolerance: 0.01 }
      ]
    },
    {
      id: "m3t1",
      type: "code",
      title: "Почини гипотенузу",
      desc: "В скрипте <strong>3 ошибки</strong>. Почини их, чтобы программа прочитала два катета (они могут быть дробными) и напечатала гипотенузу.<br><span style=\"font-size:12.5px;color:#64748b;\">Пример: 3 и 4 → 5</span>",
      starter: "a = float(input())\nb = int(input())\nprint(math.Sqrt(a ** 2 + b ** 2))\n",
      hints: [
        "Нет строки import math. Ещё Sqrt написан с большой S, а второй катет читается через int — дробь он не возьмёт.",
        "import math\na = float(input())\nb = float(input())\nprint(math.sqrt(a ** 2 + b ** 2))"
      ],
      codeCheck: function (code) {
        if (!/import\s+math/.test(code)) return "В начале не хватает строки import math.";
        if (/math\s*\.\s*Sqrt/.test(code)) return "Напиши math.sqrt маленькими буквами. Sqrt с большой S Python не знает.";
        if (/int\s*\(\s*input/.test(code)) return "Катет может быть дробным. Читай оба числа через float(input()), не int.";
        if (!/math\s*\.\s*sqrt/.test(code)) return "Корень пишется так: math.sqrt(...)";
        return null;
      },
      tests: [
        { inputs: ["3", "4"], expectedLines: ["5"], numericMatch: true, floatTolerance: 0.01 },
        { inputs: ["5", "12.0"], expectedLines: ["13"], numericMatch: true, floatTolerance: 0.01 }
      ]
    },
    {
      id: "m3t2",
      type: "code",
      title: "Закупка автобусов",
      desc: "Вводят два целых числа: сколько учеников <span class=\"inline-code\">n</span> и сколько мест в одном автобусе <span class=\"inline-code\">m</span>. Напечатай, сколько автобусов нужно заказать. Дробный автобус не возят — бери <span class=\"inline-code\">math.ceil</span>.<br><span style=\"font-size:12.5px;color:#64748b;\">Пример: 20 учеников и 6 мест → 4 автобуса</span>",
      starter: "import math\nn = int(input())\nm = int(input())\n# напечатай число автобусов\n",
      hints: [
        "Подели учеников на места: n / m. Если вышло 3.33, трёх автобусов мало.",
        "print(math.ceil(n / m))"
      ],
      codeCheck: function (code) {
        if (!/import\s+math/.test(code)) return "Подключи библиотеку: import math";
        if (!/math\s*\.\s*ceil/.test(code)) return "Нужен потолок: math.ceil. Обычное деление оставит дробь, и кому-то не хватит места.";
        return null;
      },
      tests: [
        { inputs: ["20", "6"], expectedLines: ["4"], numericMatch: true, floatTolerance: 0.01 },
        { inputs: ["10", "4"], expectedLines: ["3"], numericMatch: true, floatTolerance: 0.01 }
      ]
    },
    {
      id: "m3t3",
      type: "code",
      title: "Площадь круга",
      desc: "Вводят радиус <span class=\"inline-code\">r</span> — он может быть дробным. Напечатай площадь круга: <span class=\"inline-code\">π × r²</span>. Округли до 2 знаков: <span class=\"inline-code\">round(..., 2)</span>. Число π бери из <span class=\"inline-code\">math.pi</span>.<br><span style=\"font-size:12.5px;color:#64748b;\">Пример: радиус 1 → 3.14</span>",
      starter: "import math\nr = float(input())\n# площадь круга, 2 знака после точки\n",
      hints: [
        "Площадь: math.pi * r ** 2. Потом оберни всё в round(..., 2).",
        "print(round(math.pi * r ** 2, 2))"
      ],
      codeCheck: function (code) {
        if (!/import\s+math/.test(code)) return "Подключи библиотеку: import math";
        if (!/math\s*\.\s*pi/.test(code)) return "Число π пишется math.pi — без скобок.";
        if (!/round\s*\(/.test(code)) return "Округли до 2 знаков: round(площадь, 2). Это не math.ceil.";
        return null;
      },
      tests: [
        { inputs: ["1"], expectedLines: ["3.14"], numericMatch: true, floatTolerance: 0.01 },
        { inputs: ["2"], expectedLines: ["12.57"], numericMatch: true, floatTolerance: 0.01 }
      ]
    },
    {
      id: "m3t4",
      type: "code",
      variant: true,
      title: "Твоя диагональ экрана",
      desc: "Числа подставятся лично для тебя.",
      starter: "import math\nw = float(input())\nh = float(input())\n",
      hints: [],
      build: function (v) {
        function expect(w, h) {
          var raw = Math.sqrt(w * w + h * h) * v.c;
          return String(Math.round(raw * 100) / 100);
        }
        return {
          desc: "Вводят ширину и высоту экрана в сантиметрах. Посчитай диагональ через <span class=\"inline-code\">math.sqrt</span> и умножь на <strong>свой коэффициент " + v.c + "</strong> (у соседа он другой). Ответ округли до 2 знаков.",
          starter: "import math\nw = float(input())\nh = float(input())\nk = " + v.c + "\n# диагональ * k, потом round(..., 2)\n",
          hints: [
            "Сначала корень: math.sqrt(w ** 2 + h ** 2). Потом умножь на свой k = " + v.c + ".",
            "print(round(math.sqrt(w ** 2 + h ** 2) * k, 2))"
          ],
          tests: [
            { inputs: ["3", "4"], expectedLines: [expect(3, 4)], numericMatch: true, floatTolerance: 0.01 },
            { inputs: ["8", "15"], expectedLines: [expect(8, 15)], numericMatch: true, floatTolerance: 0.01 }
          ]
        };
      },
      codeCheck: function (code) {
        if (!/import\s+math/.test(code)) return "Подключи библиотеку: import math";
        if (!/math\s*\.\s*sqrt/.test(code)) return "Диагональ считается через math.sqrt.";
        if (!/round\s*\(/.test(code)) return "Округли ответ до 2 знаков: round(..., 2).";
        return null;
      }
    }
  ]
});
