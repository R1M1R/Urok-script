window.COURSE_CHAPTERS = window.COURSE_CHAPTERS || [];
window.COURSE_CHAPTERS.push({
  id: "ch1",
  order: 1,
  lessons: "21–22",
  hours: 2,
  lessonCount: 2,
  badge: "Уроки 21–22 • 2 ч.",
  title: "Скрипты и print()",
  desc: "Что такое скрипт, порядок команд, вывод на экран, комментарии и поиск ошибок.",
  symbols: "print",
  comingSoon: false,
  plan: [
    { n: "21", title: "Скрипт и print", do: "Карточки «Что такое скрипт» и «print». Задачи «Первый скрипт» и «Игровая карточка». В песочнице напиши своё приветствие." },
    { n: "22", title: "Комментарии и чужие ошибки", do: "Карточка про #. Задачи «Почини скрипт» и «Калькулятор и комментарий». Тренировка «Собери запуск ракеты». Мини-тест главы." }
  ],
  theory: [
    {
      title: "🐍 Что такое скрипт?",
      body: `
          <p><strong>Скрипт</strong> (или программа) — это список чётких команд для компьютера, записанных на языке программирования.</p>
          <p>Python читает скрипт <strong>строго сверху вниз</strong>, строка за строкой, как рецепт или сценарий фильма.</p>
          <div class="code-sample"><span class="kw">print</span>(<span class="st">"1. Включаем ракету"</span>)
<span class="kw">print</span>(<span class="st">"2. Обратный отсчёт: 3, 2, 1..."</span>)
<span class="kw">print</span>(<span class="st">"3. Поехали!"</span>)</div>
        `,
      tryCode: "print(\"1. Включаем ракету\")\nprint(\"2. Обратный отсчёт: 3, 2, 1...\")\nprint(\"3. Поехали!\")",
      trace: {
        title: "Как Python читает скрипт",
        code: "print(\"1. Включаем ракету\")\nprint(\"2. Поехали!\")"
      }
    },
    {
      title: "📢 Команда print() — голос программы",
      body: `
          <p>Чтобы программа показала текст или число на экране, используют команду <span class="inline-code">print(...)</span>.</p>
          <ul>
            <li><strong>Текст</strong> всегда пишем в кавычках: <span class="inline-code">"Привет"</span> или <span class="inline-code">'Привет'</span>.</li>
            <li><strong>Числа и примеры</strong> без кавычек Python сам вычислит!</li>
          </ul>
          <div class="code-sample"><span class="kw">print</span>(<span class="st">"5 + 3"</span>)   <span class="cm"># выведет текст: 5 + 3</span>
<span class="kw">print</span>(<span class="nm">5</span> + <span class="nm">3</span>)     <span class="cm"># посчитает и выведет: 8</span></div>
          <div class="callout">⚠️ <strong>Важно:</strong> Python различает большие и маленькие буквы! Команда <span class="inline-code">Print()</span> вызовет ошибку, правильно только <span class="inline-code">print()</span>.</div>
        `,
      tryCode: "print(\"5 + 3\")\nprint(5 + 3)",
      trace: {
        title: "Текст в кавычках и пример без кавычек",
        code: "print(\"5 + 3\")\nprint(5 + 3)"
      }
    },
    {
      title: "💬 Комментарии (#) — заметки для людей",
      body: `
          <p>Всё, что написано после знака решётки <span class="inline-code">#</span>, компьютер полностью игнорирует. Это подсказки для программиста.</p>
          <div class="code-sample"><span class="cm"># Этот скрипт считает секунды в часе</span>
<span class="kw">print</span>(<span class="nm">60</span> * <span class="nm">60</span>)
<span class="cm"># print("Эта строка НЕ выполнится")</span></div>
        `,
      tryCode: "# Этот скрипт считает секунды в часе\nprint(60 * 60)\n# print(\"Эта строка НЕ выполнится\")",
      trace: {
        title: "Комментарий Python пропускает",
        code: "# Этот скрипт считает секунды в часе\nprint(60 * 60)\n# print(\"Эта строка НЕ выполнится\")"
      }
    }
  ],
  quizzes: [
    {
      id: "m0q0",
      question: "1. Какая команда написана БЕЗ ошибок и сработает в Python?",
      options: [
        "Print(\"Привет\")",
        "print(\"Привет\")",
        "print(Привет)",
        "print \"Привет\""
      ],
      correct: 1,
      explain: "Команда print всегда пишется с маленькой буквы, аргумент в круглых скобках, а текст — в кавычках."
    },
    {
      id: "m0q1",
      question: "2. Что выведет строка: print(\"10 + 5\") ?",
      options: ["15", "10 + 5", "Ошибку", "Ничего"],
      correct: 1,
      explain: "Всё внутри кавычек Python воспринимает как обычный текст, поэтому выведет буквально \"10 + 5\"."
    },
    {
      id: "m0q2",
      question: "3. Что появится на экране после запуска?\n# print(\"Секрет\")\nprint(\"Готово\")",
      options: [
        "Секрет и Готово",
        "Только Секрет",
        "Только Готово",
        "Будет ошибка из-за знака #"
      ],
      correct: 2,
      explain: "Знак # превращает строку в комментарий — Python её пропускает и выполняет только print(\"Готово\")."
    }
  ],
  tasks: [
    {
      id: "m0t0",
      type: "code",
      title: "Первый скрипт",
      desc: "Напиши команду <span class=\"inline-code\">print</span>, которая выведет на экран ровно фразу:<br><strong>Привет, Python!</strong>",
      starter: "# Напиши свой первый скрипт ниже\n",
      hints: [
        "Используй команду print(...) и не забудь поставить двойные или одинарные кавычки вокруг текста.",
        "Шаблон: print(\"Привет, Python!\") — проверь заглавную П, запятую, пробел и восклицательный знак!"
      ],
      tests: [{ inputs: [], expectedLines: ["Привет, Python!"] }]
    },
    {
      id: "m0t1",
      type: "code",
      title: "Игровая карточка (3 строки)",
      desc: "Скрипт выполняется сверху вниз. Напиши <strong>3 команды print</strong>, чтобы на экране появились ровно 3 строки:<br><div class=\"code-sample\" style=\"margin:6px 0;padding:8px 10px;\">Игрок: Старт\nУровень: 1\nГотов к коду!</div>",
      starter: "print(\"Игрок: Старт\")\n# Допиши ещё 2 команды print ниже\n",
      hints: [
        "Каждая новая команда print(...) выводит текст с новой строки.",
        "Допиши строки:\nprint(\"Уровень: 1\")\nprint(\"Готов к коду!\")"
      ],
      tests: [{ inputs: [], expectedLines: ["Игрок: Старт", "Уровень: 1", "Готов к коду!"] }]
    },
    {
      id: "m0t2",
      type: "code",
      title: "Почини скрипт",
      desc: "В редакторе спрятаны <strong>3 ошибки новичка</strong>. Исправь код так, чтобы скрипт заработал и вывел:<br><div class=\"code-sample\" style=\"margin:6px 0;padding:8px 10px;\">Шаг 1 готов\nШаг 2 готов\nШаг 3 готов</div>",
      starter: "Print(\"Шаг 1 готов\")\nprint(\"Шаг 2 готов)\nprint(Шаг 3 готов)",
      hints: [
        "Проверь все 3 строки: в 1-й — регистр буквы P, во 2-й — пропала закрывающая кавычка, в 3-й — вообще нет кавычек.",
        "Должно получиться 3 аккуратных print(\"Шаг ... готов\") с маленькой буквы и парными кавычками."
      ],
      tests: [{ inputs: [], expectedLines: ["Шаг 1 готов", "Шаг 2 готов", "Шаг 3 готов"] }]
    },
    {
      id: "m0t3",
      type: "code",
      title: "Калькулятор и комментарий",
      desc: "1) Добавь в скрипт комментарий (любой текст после <span class=\"inline-code\">#</span>).<br>2) Выведи результат вычисления <span class=\"inline-code\">15 + 25</span> <strong>без кавычек</strong>, чтобы Python сам посчитал ответ.",
      starter: "",
      hints: [
        "В первой строке напиши, например: # мой расчет. Во второй используй print(15 + 25).",
        "Пример структуры:\n# Считаю сумму\nprint(15 + 25)"
      ],
      codeCheck: function (code) {
        if (!code.includes("#")) return "Не забудь добавить комментарий со знаком #!";
        if (!code.includes("+")) return "Пусть Python сам посчитает сумму с помощью знака + (например, 15 + 25)!";
        return null;
      },
      tests: [{ inputs: [], expectedLines: ["40"] }]
    },
    {
      id: "m0t4",
      extra: true,
      type: "parsons",
      parsonsMode: "both",
      title: "Собери запуск ракеты",
      desc: "Поставь строки по порядку старта. Все команды без отступа: если сдвинешь строку кнопкой →, проверка не примет. Кнопки ↑ и ↓ меняют порядок.",
      lines: [
        { code: "print(\"1. Проверка\")", indent: 0 },
        { code: "print(\"2. Зажигание\")", indent: 0 },
        { code: "print(\"3. Поехали!\")", indent: 0 }
      ],
      hints: [
        "Сначала проверка, потом зажигание, потом «Поехали!».",
        "Отступ у всех строк — 0. Кнопка ← возвращает строку влево."
      ],
      tests: [{ inputs: [], expectedLines: ["1. Проверка", "2. Зажигание", "3. Поехали!"] }]
    }
  ]
});
