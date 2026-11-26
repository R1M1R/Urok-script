window.COURSE_CHAPTERS = window.COURSE_CHAPTERS || [];
window.COURSE_CHAPTERS.push({
  id: "ch2",
  order: 2,
  lessons: "23–24",
  hours: 2,
  lessonCount: 2,
  badge: "Уроки 23–24 • 2 ч.",
  title: "Переменные и input()",
  desc: "Храним данные в переменных, спрашиваем человека через input() и собираем фразу.",
  symbols: "input",
  comingSoon: false,
  plan: [
    { n: "23", title: "Переменная-коробка", do: "Карточка про коробку и её трассировка. Задачи «Коробка с городом» и «Умное приветствие»." },
    { n: "24", title: "Анкета и обмен", do: "Карточки про input и перезапись. Задачи «Анкета хобби» и «Обмен местами». Тренировка «Что выведет скрипт?». Мини-тест." }
  ],
  theory: [
    {
      title: "📦 Переменная = коробка с названием",
      body: `
          <p><strong>Переменная</strong> хранит данные в памяти компьютера. Знак <span class="inline-code">=</span> кладёт значение в «коробку».</p>
          <div class="code-sample">hero = <span class="st">"Стив"</span>
hearts = <span class="nm">10</span>
<span class="kw">print</span>(hero)
<span class="kw">print</span>(hearts)</div>
          <ul>
            <li>Имя переменной пишем на латинице, <strong>без пробелов</strong> (можно <span class="inline-code">my_name</span>).</li>
            <li>Нельзя начинать имя с цифры (<span class="inline-code">1player</span> — ошибка, <span class="inline-code">player1</span> — можно).</li>
          </ul>
        `,
      tryCode: "hero = \"Стив\"\nhearts = 10\nprint(hero)\nprint(hearts)",
      trace: {
        title: "Следи за коробками",
        code: "hero = \"Стив\"\nhearts = 10\nprint(hero)\nprint(hearts)"
      }
    },
    {
      title: "⌨️ Ввод данных: команда input()",
      body: `
          <p>Чтобы программа спросила что-то у человека, нужна команда <span class="inline-code">input()</span>. Она ждёт, пока пользователь введёт текст, и сохраняет его в переменную.</p>
          <div class="code-sample">name = <span class="kw">input</span>(<span class="st">"Как тебя зовут? "</span>)
<span class="kw">print</span>(<span class="st">"Привет,"</span>, name)</div>
          <div class="callout info">💡 Когда в <span class="inline-code">print()</span> перечисляем части через <strong>запятую</strong>, Python сам ставит аккуратный пробел между ними!</div>
        `,
      tryCode: "name = input(\"Как тебя зовут? \")\nprint(\"Привет,\", name)",
      trace: {
        title: "Программа спрашивает имя",
        code: "name = input(\"Как тебя зовут? \")\nprint(\"Привет,\", name)",
        inputs: ["Амир"]
      }
    },
    {
      title: "🔄 Перезапись и обмен значений",
      body: `
          <p>Значение в переменной можно менять по ходу скрипта. В Python поменять местами две переменные можно красиво в одну строку:</p>
          <div class="code-sample">a = <span class="st">"Огонь"</span>
b = <span class="st">"Вода"</span>
a, b = b, a   <span class="cm"># магия Python: обмен!</span>
<span class="kw">print</span>(a, b)</div>
        `,
      tryCode: "a = \"Огонь\"\nb = \"Вода\"\na, b = b, a\nprint(a, b)",
      trace: {
        title: "Старое значение заменяется",
        code: "x = 5\nx = 12\nprint(x)"
      }
    }
  ],
  quizzes: [
    {
      id: "m1q0",
      question: "1. Какое имя переменной НЕПРАВИЛЬНОЕ (вызовет ошибку)?",
      options: ["user_name", "score2", "2player", "city"],
      correct: 2,
      explain: "Имя переменной никогда не может начинаться с цифры! 2player вызовет SyntaxError."
    },
    {
      id: "m1q1",
      question: "2. Что выведет этот скрипт?\nx = 5\nx = 12\nprint(x)",
      options: ["5", "12", "17", "5 12"],
      correct: 1,
      explain: "Вторая строка перезаписала значение в переменной x. Старое значение 5 заменилось на 12."
    },
    {
      id: "m1q2",
      question: "3. Для чего нужна команда input()?",
      options: [
        "Вывести текст на экран",
        "Получить данные, которые ввёл пользователь",
        "Удалить переменную",
        "Посчитать сумму чисел"
      ],
      correct: 1,
      explain: "input() останавливает скрипт, ждёт ввод с клавиатуры и возвращает введённую строку."
    }
  ],
  tasks: [
    {
      id: "m1t0",
      type: "code",
      title: "Коробка с городом",
      desc: "Создай переменную <span class=\"inline-code\">city</span> и сохрани в неё текст <span class=\"inline-code\">\"Бишкек\"</span>. Затем выведи переменную через <span class=\"inline-code\">print(city)</span>.",
      starter: "city = \nprint(city)",
      hints: [
        "После знака = допиши текст в кавычках: \"Бишкек\".",
        "Полный код:\ncity = \"Бишкек\"\nprint(city)"
      ],
      codeCheck: function (code) {
        if (!/city\s*=/.test(code)) return "Создай переменную с именем city!";
        if (!/print\s*\(\s*city\s*\)/.test(code)) return "Выведи именно переменную: print(city)";
        return null;
      },
      tests: [{ inputs: [], expectedLines: ["Бишкек"] }]
    },
    {
      id: "m1t1",
      type: "code",
      title: "Умное приветствие",
      desc: "Спроси имя пользователя с помощью <span class=\"inline-code\">input()</span> и выведи:<br><strong>Привет, &lt;имя&gt;</strong><br><span style=\"font-size:12.5px;color:#64748b;\">Например, если ввели Амир → вывод: Привет, Амир</span>",
      starter: "name = input()\n# Выведи приветствие ниже\n",
      hints: [
        "Используй запятую внутри print: print(\"Привет,\", name). Запятая сама добавит пробел!",
        "Структура:\nname = input()\nprint(\"Привет,\", name)"
      ],
      codeCheck: function (code) {
        if (!code.includes("input")) return "Нужно прочитать имя через input(), а не писать его вручную!";
        return null;
      },
      tests: [
        { inputs: ["Амир"], expectedLines: ["Привет, Амир"], allowExclamation: true },
        { inputs: ["Айдана"], expectedLines: ["Привет, Айдана"], allowExclamation: true }
      ]
    },
    {
      id: "m1t2",
      type: "code",
      title: "Анкета хобби",
      desc: "Скрипт должен спросить <strong>два значения</strong> через <span class=\"inline-code\">input()</span>: сначала имя, потом любимое занятие.<br>Выведи одну строку: <strong>&lt;имя&gt; любит &lt;занятие&gt;</strong><br><span style=\"font-size:12.5px;color:#64748b;\">Пример: Тимур любит Minecraft</span>",
      starter: "name = input()\nhobby = input()\n# Выведи фразу ниже\n",
      hints: [
        "Внутри print() можно перечислить 3 элемента через запятую: переменную, слово в кавычках и вторую переменную.",
        "print(name, \"любит\", hobby)"
      ],
      codeCheck: function (code) {
        const matches = code.match(/input\s*\(/g) || [];
        if (matches.length < 2) return "Вызови input() дважды: один раз для имени, второй для хобби!";
        return null;
      },
      tests: [
        { inputs: ["Тимур", "Minecraft"], expectedLines: ["Тимур любит Minecraft"] },
        { inputs: ["Алина", "рисовать"], expectedLines: ["Алина любит рисовать"] }
      ]
    },
    {
      id: "m1t3",
      type: "code",
      title: "Обмен местами",
      desc: "В коде уже заданы <span class=\"inline-code\">a = \"Кошка\"</span> и <span class=\"inline-code\">b = \"Собака\"</span>.<br>Допиши строку обмена так, чтобы их значения <strong>поменялись местами</strong> (не исправляя первые две строки!).",
      starter: "a = \"Кошка\"\nb = \"Собака\"\n# Поменяй значения a и b местами:\n\nprint(a)\nprint(b)",
      hints: [
        "В Python поменять две переменные местами можно одной строкой: a, b = b, a (или через третью переменную temp).",
        "Просто допиши строку:\na, b = b, a"
      ],
      codeCheck: function (code) {
        if (!/a\s*=\s*["']Кошка["']/.test(code) || !/b\s*=\s*["']Собака["']/.test(code)) {
          return "Не удаляй исходные строки a = \"Кошка\" и b = \"Собака\" — обменяй их через код!";
        }
        return null;
      },
      tests: [{ inputs: [], expectedLines: ["Собака", "Кошка"] }]
    },
    {
      id: "m1t4",
      extra: true,
      type: "predict",
      title: "Что выведет скрипт?",
      desc: "Посмотри на код и напиши вывод сам. Каждая строка экрана — с новой строки. Запускать программу не нужно.",
      predictCode: "name = \"Айгерим\"\nname = \"Бек\"\nprint(name)\nprint(\"класс\", 7)",
      expectedLines: ["Бек", "класс 7"],
      hints: [
        "Вторая строка затирает имя. На экране останется последнее.",
        "Две строки:\nБек\nкласс 7"
      ]
    }
  ]
});
