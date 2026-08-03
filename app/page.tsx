"use client";

import { useMemo, useState } from "react";

type Pick = { title: string; note: string; icon: string };

const courses: { title: string; subtitle: string; options: Pick[] }[] = [
  {
    title: "Утро в зачарованном доме",
    subtitle: "Чем должна начинаться идеальная глава?",
    options: [
      { title: "Сырники с ягодами", note: "Сметана, мёд и немного магии", icon: "✦" },
      { title: "Круассан и омлет", note: "Тёплый, хрустящий, неспешный", icon: "☀" },
      { title: "Блины с начинками", note: "Сладкие и несладкие — сразу оба мира", icon: "☾" },
    ],
  },
  {
    title: "Главное блюдо вечера",
    subtitle: "Что появится на столе после заклинания?",
    options: [
      { title: "Паста с креветками", note: "Сливочный соус и пармезан", icon: "♢" },
      { title: "Стейк с овощами", note: "Сочный и приготовленный как ты любишь", icon: "♜" },
      { title: "Лосось с картофелем", note: "Лёгкий, уютный и очень красивый", icon: "≈" },
    ],
  },
  {
    title: "Сладкое заклинание",
    subtitle: "Без десерта даже волшебство не считается",
    options: [
      { title: "Шоколадный фондан", note: "Тёплое сердце и ванильное мороженое", icon: "♥" },
      { title: "Тирамису", note: "Воздушный, кофейный, почти невесомый", icon: "✧" },
      { title: "Ягоды и чизкейк", note: "Нежная классика для уютного вечера", icon: "❋" },
    ],
  },
  {
    title: "Напиток настроения",
    subtitle: "Последний ингредиент нашего зелья",
    options: [
      { title: "Вино", note: "Белое, красное или игристое", icon: "♧" },
      { title: "Какао с маршмеллоу", note: "Будто вернулись с зимней прогулки", icon: "☁" },
      { title: "Авторский лимонад", note: "Свежий, ягодный и безалкогольный", icon: "✺" },
    ],
  },
];

const riddles = [
  {
    eyebrow: "Испытание I · Тайная дверь",
    title: "Что становится больше, если его перевернуть вверх ногами?",
    answers: ["Число 6", "Луна", "Котёл"],
    correct: 0,
    hint: "Иногда магия — это просто другой угол зрения.",
  },
  {
    eyebrow: "Испытание II · Заклинание тепла",
    title: "Сложи первые буквы: Дом, Аромат, Тишина, Авантюра.",
    answers: ["ДАТА", "ДОМ", "ТАЙНА"],
    correct: 0,
    hint: "Каждая глава начинается с правильного момента.",
  },
];

export default function Home() {
  const [stage, setStage] = useState(0);
  const [riddle, setRiddle] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [course, setCourse] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [restrictions, setRestrictions] = useState("");
  const [accepted, setAccepted] = useState<boolean | null>(null);

  const progress = stage === 0 ? 8 : stage === 1 ? 20 + riddle * 15 : stage === 2 ? 52 + course * 10 : 100;

  const message = useMemo(() => {
    const chosen = picks.map((value, index) => `${courses[index].title}: ${courses[index].options[value]?.title}`).join("\n");
    return encodeURIComponent(`Мой выбор для нашей волшебной поездки ✨\n\n${chosen}\n\nПожелания: ${restrictions || "нет"}\n\nОтвет на приглашение: ${accepted ? "Да, я отправляюсь!" : "Мне нужно немного времени"}`);
  }, [picks, restrictions, accepted]);

  function solve(answer: number) {
    if (answer !== riddles[riddle].correct) {
      setWrong(true);
      return;
    }
    setWrong(false);
    if (riddle < riddles.length - 1) setRiddle(riddle + 1);
    else setStage(2);
  }

  function choose(value: number) {
    const next = [...picks];
    next[course] = value;
    setPicks(next);
  }

  function nextCourse() {
    if (course < courses.length - 1) setCourse(course + 1);
    else setStage(3);
  }

  return (
    <main className="world">
      <div className="stars" aria-hidden="true" />
      <div className="topline">
        <span className="sigil">W</span>
        <span>Личное магическое послание</span>
        <span className="chapter">Глава {Math.min(stage + 1, 4)} / 4</span>
      </div>
      <div className="progress"><i style={{ width: `${progress}%` }} /></div>

      {stage === 0 && (
        <section className="hero page-enter">
          <div className="owl-mark" aria-hidden="true"><span>✉</span></div>
          <p className="eyebrow">Доставлено совиной почтой</p>
          <h1>Тебе пришло<br /><em>особенное письмо</em></h1>
          <p className="lead">В нём спрятан маршрут к одному уютному месту. Но сначала волшебнице предстоит пройти несколько испытаний.</p>
          <button className="primary" onClick={() => setStage(1)}>Распечатать письмо <span>→</span></button>
          <p className="whisper">Торжественно обещаем: никакой опасной магии</p>
        </section>
      )}

      {stage === 1 && (
        <section className="card riddle page-enter" key={riddle}>
          <div className="corner tl">✦</div><div className="corner br">✦</div>
          <p className="eyebrow">{riddles[riddle].eyebrow}</p>
          <div className="rune">{riddle === 0 ? "6↟" : "D·A·T·A"}</div>
          <h2>{riddles[riddle].title}</h2>
          <p className="hint">{riddles[riddle].hint}</p>
          <div className="answer-grid">
            {riddles[riddle].answers.map((answer, index) => (
              <button key={answer} onClick={() => solve(index)}>{answer}<span>◇</span></button>
            ))}
          </div>
          {wrong && <p className="wrong">Перо дрогнуло… Попробуй ещё раз ✦</p>}
        </section>
      )}

      {stage === 2 && (
        <section className="menu page-enter" key={course}>
          <p className="eyebrow">Выбор {course + 1} из {courses.length} · Меню желаний</p>
          <h2>{courses[course].title}</h2>
          <p className="hint">{courses[course].subtitle}</p>
          <div className="food-grid">
            {courses[course].options.map((item, index) => (
              <button className={picks[course] === index ? "food selected" : "food"} key={item.title} onClick={() => choose(index)}>
                <span className="food-icon">{item.icon}</span>
                <strong>{item.title}</strong><small>{item.note}</small>
                <i>{picks[course] === index ? "Выбрано ✓" : "Выбрать"}</i>
              </button>
            ))}
          </div>
          <button className="primary compact" disabled={picks[course] === undefined} onClick={nextCourse}>{course === courses.length - 1 ? "Завершить выбор" : "Дальше"} <span>→</span></button>
        </section>
      )}

      {stage === 3 && (
        <section className="card finale page-enter">
          <p className="eyebrow">Финальная глава</p>
          <div className="final-icon">⌂</div>
          <h2>У меня есть для тебя<br /><em>одно предложение</em></h2>
          <p className="invitation">Давай сбежим из обычного мира на сутки — в уютный загородный дом. Вкусная еда, прогулка, огоньки и только мы вдвоём.</p>
          <label className="note-label">Есть аллергии, нелюбимые продукты или особые пожелания?</label>
          <textarea value={restrictions} onChange={(event) => setRestrictions(event.target.value)} placeholder="Расскажи здесь — это важно…" />
          <p className="question">Ты отправишься со мной в это маленькое приключение?</p>
          <div className="final-actions">
            <button className={accepted === true ? "accept active" : "accept"} onClick={() => setAccepted(true)}>Да, я с тобой ✦</button>
            <button className={accepted === false ? "maybe active" : "maybe"} onClick={() => setAccepted(false)}>Мне нужно подумать</button>
          </div>
          {accepted !== null && (
            <a className="send" href={`https://wa.me/?text=${message}`} target="_blank" rel="noreferrer">Отправить мой выбор в WhatsApp →</a>
          )}
          <p className="signature">Создано с магией специально для тебя</p>
        </section>
      )}
    </main>
  );
}
