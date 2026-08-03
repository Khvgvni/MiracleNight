"use client";

import { useMemo, useState } from "react";

type Quiz = { question: string; options: string[]; correct: number; detail: string };

const quizzes: Quiz[] = [
  {
    question: "Какой дракон достался Седрику Диггори в первом испытании Турнира Трёх Волшебников?",
    options: ["Валлийский зелёный", "Шведский тупорылый", "Китайский огненный шар", "Венгерская хвосторога"], correct: 1,
    detail: "Именно шведский тупорылый охранял золотое яйцо Седрика.",
  },
  {
    question: "Какой предмет Дамблдор завещал Гермионе Грейнджер?",
    options: ["Делюминатор", "Снитч", "Сказки барда Бидля", "Маховик времени"], correct: 2,
    detail: "Книга со сказками скрывала знак Даров Смерти.",
  },
  {
    question: "Из какого дерева была сделана палочка Драко Малфоя?",
    options: ["Остролист", "Боярышник", "Тис", "Виноградная лоза"], correct: 1,
    detail: "Боярышник, волос единорога и ровно десять дюймов.",
  },
  {
    question: "Кому принадлежал Патронус в форме зайца?",
    options: ["Полумне Лавгуд", "Джинни Уизли", "Чжоу Чанг", "Нимфадоре Тонкс"], correct: 0,
    detail: "Патронус Полумны — серебряный заяц.",
  },
  {
    question: "Как звали волшебника, создавшего первый Золотой снитч?",
    options: ["Лудо Бэгмен", "Боумен Райт", "Кенниуорти Уисп", "Квентиус Умфравилль"], correct: 1,
    detail: "Боумен Райт, искусный зачарователь металлов из Годриковой Впадины.",
  },
];

const meals = {
  lunch: { title: "Обед в Большом зале", subtitle: "Что подать после дневных приключений?", options: ["Мясо на мангале", "Стейк из сёмги с картофелем"] },
  dinner: { title: "Ужин при свечах", subtitle: "Что появится на столе под вечер?", options: ["Мясо на мангале", "Стейки из сёмги"] },
  drinks: { title: "Выбор волшебных напитков", subtitle: "Можно выбрать сразу несколько вариантов", options: ["Белое вино", "Красное вино", "Джин с тоником"] },
};

const steps = ["quiz0", "lunch", "quiz1", "quiz2", "dinner", "quiz3", "drinks", "quiz4", "final"] as const;

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [choices, setChoices] = useState<Record<string, string | string[]>>({});
  const [wish, setWish] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [trap, setTrap] = useState(false);
  const [trapAnswer, setTrapAnswer] = useState("");
  const [trapResult, setTrapResult] = useState("");

  const current = steps[step];
  const progress = started ? ((step + 1) / steps.length) * 100 : 0;

  const summary = useMemo(() => encodeURIComponent(
    `Моё волшебное меню ✨\n\nОбед: ${choices.lunch || "—"}\nУжин: ${choices.dinner || "—"}\nНапитки: ${Array.isArray(choices.drinks) ? choices.drinks.join(", ") : "—"}\nЕщё хочется попробовать: ${wish || "Пусть будет сюрприз"}\n\nОтвет: Я с тобой! 🪄`
  ), [choices, wish]);

  function answerQuiz(index: number, selected: number) {
    if (selected !== quizzes[index].correct) { setWrong(true); return; }
    setWrong(false); setRevealed(true);
  }

  function next() { setRevealed(false); setWrong(false); setStep(value => Math.min(value + 1, steps.length - 1)); }

  function chooseMeal(key: keyof typeof meals, value: string) {
    if (key !== "drinks") { setChoices(prev => ({ ...prev, [key]: value })); return; }
    setChoices(prev => {
      const currentDrinks = Array.isArray(prev.drinks) ? prev.drinks : [];
      const drinks = currentDrinks.includes(value) ? currentDrinks.filter(item => item !== value) : [...currentDrinks, value];
      return { ...prev, drinks };
    });
  }

  function submitTrap() {
    if (trapAnswer.trim() === "713") {
      setTrapResult("Невероятно! Даже Гермиона впечатлена. Но приключение всё равно зовёт ✦");
    } else {
      setTrapResult("Увы, неверно. Магический договор активирован: «Я с тобой» выбрано автоматически ✦");
    }
    setAccepted(true);
    window.setTimeout(() => setTrap(false), 2600);
  }

  const quizIndex = current.startsWith("quiz") ? Number(current.replace("quiz", "")) : -1;
  const mealKey = (["lunch", "dinner", "drinks"] as string[]).includes(current) ? current as keyof typeof meals : null;

  return (
    <main className="world">
      <div className="castle" aria-hidden="true" />
      <div className="mist" aria-hidden="true" />
      <div className="sparks" aria-hidden="true" />
      <header>
        <div className="crest"><span>✦</span><b>A</b><span>✦</span></div>
        <div className="header-title">Официальное магическое приглашение</div>
        <div className="step-count">{started ? `${step + 1} / ${steps.length}` : "Совиная почта"}</div>
      </header>
      <div className="progress"><i style={{ width: `${progress}%` }} /></div>

      {!started && (
        <section className="hero enter">
          <div className="letter-seal">A</div>
          <p className="eyebrow">Доставлено лично в руки</p>
          <div className="recipient">Кушпита Анна Сергеевна</div>
          <h1>Официальное<br /><em>приглашение</em></h1>
          <p>Настоящим письмом Вы приглашаетесь в тайное загородное путешествие на сутки. Для подтверждения участия Вам надлежит пройти пять магических испытаний и составить меню предстоящего вечера.</p>
          <button className="gold-button" onClick={() => setStarted(true)}>Открыть письмо <span>➜</span></button>
          <small>Торжественно обещаем: впереди только шалость</small>
        </section>
      )}

      {started && quizIndex >= 0 && (
        <section className="parchment enter" key={current}>
          <div className="paper-noise" />
          <p className="eyebrow dark">Магическое испытание {quizIndex + 1} из 5</p>
          <div className="quiz-symbol">{["ϟ", "♞", "☄", "⌁", "⚡"][quizIndex]}</div>
          <h2>{quizzes[quizIndex].question}</h2>
          <div className="quiz-options">
            {quizzes[quizIndex].options.map((option, index) => (
              <button key={option} onClick={() => answerQuiz(quizIndex, index)} disabled={revealed}>
                <span>{String.fromCharCode(65 + index)}</span>{option}
              </button>
            ))}
          </div>
          {wrong && <div className="ink-error">Портреты зашептались… Ответ неверный. Попробуй ещё раз.</div>}
          {revealed && <div className="success"><b>Верно!</b> {quizzes[quizIndex].detail}<button onClick={next}>Продолжить ➜</button></div>}
          <div className="paper-footer">Draco dormiens nunquam titillandus</div>
        </section>
      )}

      {started && mealKey && (
        <section className="choice-panel enter" key={current}>
          <p className="eyebrow">Страница из зачарованного меню</p>
          <h2>{meals[mealKey].title}</h2>
          <p className="subtitle">{meals[mealKey].subtitle}</p>
          <div className={`meal-grid ${meals[mealKey].options.length === 2 ? "two" : ""}`}>
            {meals[mealKey].options.map((option, index) => (
              <button key={option} className={(mealKey === "drinks" ? Array.isArray(choices.drinks) && choices.drinks.includes(option) : choices[mealKey] === option) ? "meal-card selected" : "meal-card"} onClick={() => chooseMeal(mealKey, option)}>
                <div className="plate"><span>{mealKey === "drinks" ? ["♧", "♦", "✧"][index] : index === 0 ? "♨" : "≈"}</span></div>
                <b>{option}</b>
                <small>{mealKey === "drinks" ? "Налить в зачарованный бокал" : index === 0 ? "Дымок, угли и аромат специй" : "Нежное филе и золотистый гарнир"}</small>
                <i>{(mealKey === "drinks" ? Array.isArray(choices.drinks) && choices.drinks.includes(option) : choices[mealKey] === option) ? "Выбрано ✓" : "Выбрать"}</i>
              </button>
            ))}
          </div>
          <button className="gold-button" disabled={mealKey === "drinks" ? !Array.isArray(choices.drinks) || choices.drinks.length === 0 : !choices[mealKey]} onClick={next}>Закрепить выбор <span>➜</span></button>
        </section>
      )}

      {started && current === "final" && (
        <section className="parchment finale enter">
          <div className="paper-noise" />
          <p className="eyebrow dark">Последняя глава</p>
          <div className="wax-seal">✦</div>
          <h2>Приглашение в<br /><em>маленькое приключение</em></h2>
          <p className="final-copy">Оставим обычный мир на сутки и отправимся в уютный загородный дом. Огоньки, вкусный ужин, прогулка и немного магии — только для нас двоих.</p>
          <label htmlFor="wish">Что бы тебе хотелось ещё вкусить?</label>
          <textarea id="wish" value={wish} onChange={e => setWish(e.target.value)} placeholder="Любое блюдо, десерт или тайное желание…" />
          <h3>Ты со мной?</h3>
          <div className="final-buttons">
            <button className={accepted ? "yes active" : "yes"} onClick={() => setAccepted(true)}>Я с тобой ✦</button>
            <button className="think" onClick={() => { setTrap(true); setTrapResult(""); setTrapAnswer(""); }}>Мне нужно подумать</button>
          </div>
          {accepted && <a className="send" href={`https://wa.me/?text=${summary}`} target="_blank" rel="noreferrer">Отправить выбор совиной почтой ➜</a>}
        </section>
      )}

      {trap && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Последнее магическое испытание">
          <div className="modal enter">
            <button className="close" onClick={() => setTrap(false)} aria-label="Закрыть">×</button>
            <div className="modal-rune">?</div>
            <p className="eyebrow">Отказ отклонён Министерством магии</p>
            <h2>Последний шанс подумать</h2>
            <p>Назови номер хранилища, из которого Хагрид забрал философский камень.</p>
            {!trapResult ? <><input value={trapAnswer} onChange={e => setTrapAnswer(e.target.value)} placeholder="Номер хранилища…" inputMode="numeric" onKeyDown={e => e.key === "Enter" && submitTrap()} /><button className="gold-button" onClick={submitTrap}>Проверить ответ</button></> : <div className="trap-result">{trapResult}</div>}
          </div>
        </div>
      )}
    </main>
  );
}
