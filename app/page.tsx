"use client";

import { useRef, useState } from "react";

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
  dinner: { title: "Ужин при свечах", subtitle: "Можно выбрать сразу несколько вариантов", options: ["Мясо на мангале", "Стейки из сёмги", "Шампиньоны"] },
  drinks: { title: "Выбор волшебных напитков", subtitle: "Можно выбрать сразу несколько вариантов", options: ["Белое вино", "Красное вино", "Джин с тоником"] },
};

const steps = ["quiz0", "lunch", "quiz1", "quiz2", "dinner", "quiz3", "drinks", "quiz4", "final"] as const;

export default function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const submissionUrl = "https://script.google.com/macros/s/AKfycbwvYYOsVEP9AZISeJf3YwyxVJSHP-0RILCofz2sd2mkIfnvaT9dFi2xC6wgJO5qOiavjg/exec";
  const audioRef = useRef<HTMLAudioElement>(null);
  const [started, setStarted] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [choices, setChoices] = useState<Record<string, string | string[]>>({});
  const [wish, setWish] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [trap, setTrap] = useState(false);
  const [trapAnswer, setTrapAnswer] = useState("");
  const [trapResult, setTrapResult] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const current = steps[step];
  const progress = started ? ((step + 1) / steps.length) * 100 : 0;

  function answerQuiz(index: number, selected: number) {
    if (selected !== quizzes[index].correct) { setWrong(true); return; }
    setWrong(false); setRevealed(true);
  }

  function next() { setRevealed(false); setWrong(false); setStep(value => Math.min(value + 1, steps.length - 1)); }

  async function openLetter() {
    setStarted(true);
    if (!audioRef.current) return;
    audioRef.current.volume = 0.28;
    try { await audioRef.current.play(); setMusicOn(true); } catch { setMusicOn(false); }
  }

  async function toggleMusic() {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      try { await audioRef.current.play(); setMusicOn(true); } catch { setMusicOn(false); }
    } else {
      audioRef.current.pause();
      setMusicOn(false);
    }
  }

  async function submitAnswers() {
    if (submitting || submitted) return;
    setSubmitting(true);
    setSubmitError(false);
    try {
      await fetch(submissionUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          name: "Кушпита Анна Сергеевна",
          lunch: choices.lunch || "",
          dinner: Array.isArray(choices.dinner) ? choices.dinner : [],
          drinks: Array.isArray(choices.drinks) ? choices.drinks : [],
          wish,
          answer: "Я с тобой",
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  function chooseMeal(key: keyof typeof meals, value: string) {
    if (key === "lunch") { setChoices(prev => ({ ...prev, [key]: value })); return; }
    setChoices(prev => {
      const currentValues = Array.isArray(prev[key]) ? prev[key] as string[] : [];
      const values = currentValues.includes(value) ? currentValues.filter(item => item !== value) : [...currentValues, value];
      return { ...prev, [key]: values };
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
      <audio ref={audioRef} src={`${basePath}/magic-theme.mp3`} loop preload="auto" />
      <div
        className="castle"
        aria-hidden="true"
        style={{ backgroundImage: `linear-gradient(180deg,rgba(3,5,10,.16),rgba(3,5,10,.5) 55%,#05070b 100%),url('${basePath}/wizard-castle.png')` }}
      />
      <div className="mist" aria-hidden="true" />
      <div className="sparks" aria-hidden="true" />
      <header>
        <div className="crest"><span>✦</span><b>A</b><span>✦</span></div>
        <div className="header-title">Официальное магическое приглашение</div>
        <div className="step-count">{started ? `${step + 1} / ${steps.length}` : "Совиная почта"}</div>
      </header>
      <div className="progress"><i style={{ width: `${progress}%` }} /></div>
      {started && <button className="sound-toggle" onClick={toggleMusic} aria-label={musicOn ? "Выключить музыку" : "Включить музыку"} title={musicOn ? "Выключить музыку" : "Включить музыку"}>{musicOn ? "♫" : "♪"}<span>{musicOn ? "Музыка" : "Без звука"}</span></button>}

      {!started && (
        <section className="hero enter">
          <div className="letter-seal">A</div>
          <p className="eyebrow">Доставлено лично в руки</p>
          <div className="recipient">Кушпита Анна Сергеевна</div>
          <h1>Официальное<br /><em>приглашение</em></h1>
          <p>Настоящим письмом Вы приглашаетесь в тайное загородное путешествие на сутки. Для подтверждения участия Вам надлежит пройти пять магических испытаний и составить меню предстоящего вечера.</p>
          <button className="gold-button" onClick={openLetter}>Открыть письмо <span>➜</span></button>
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
              <button key={option} className={(mealKey !== "lunch" ? Array.isArray(choices[mealKey]) && (choices[mealKey] as string[]).includes(option) : choices[mealKey] === option) ? "meal-card selected" : "meal-card"} onClick={() => chooseMeal(mealKey, option)}>
                <div className="plate"><span>{mealKey === "drinks" ? ["♧", "♦", "✧"][index] : mealKey === "dinner" && index === 2 ? "♣" : index === 0 ? "♨" : "≈"}</span></div>
                <b>{option}</b>
                <small>{mealKey === "drinks" ? "Налить в зачарованный бокал" : mealKey === "dinner" && index === 2 ? "Румяные шампиньоны с ароматными травами" : index === 0 ? "Дымок, угли и аромат специй" : "Нежное филе и золотистый гарнир"}</small>
                <i>{(mealKey !== "lunch" ? Array.isArray(choices[mealKey]) && (choices[mealKey] as string[]).includes(option) : choices[mealKey] === option) ? "Выбрано ✓" : "Выбрать"}</i>
              </button>
            ))}
          </div>
          <button className="gold-button" disabled={mealKey !== "lunch" ? !Array.isArray(choices[mealKey]) || (choices[mealKey] as string[]).length === 0 : !choices[mealKey]} onClick={next}>Закрепить выбор <span>➜</span></button>
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
          {accepted && !submitted && <button className="send" onClick={submitAnswers} disabled={submitting}>{submitting ? "Сова уже в пути…" : "Отправить ответы совиной почтой ➜"}</button>}
          {submitted && <div className="submit-success">Ответы сохранены в магической книге ✦</div>}
          {submitError && <div className="submit-error">Сова сбилась с пути. Попробуй отправить ещё раз.</div>}
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
