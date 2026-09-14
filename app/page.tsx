"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Question = {
  id: string;
  eyebrow: string;
  title: string;
  hint?: string;
  type: "multi" | "single" | "text";
  options?: string[];
  optional?: boolean;
};

const submissionUrl =
  "https://script.google.com/macros/s/AKfycbwAYMMwOQTen4GIkaYuz-BTdYqAqwVrg7gAyG7AL1gym_xBw1fv1GD7QirX0ol-4E-V1w/exec";

const questions: Question[] = [
  {
    id: "cuisine",
    eyebrow: "01 · Вкус",
    title: "Какая кухня тебе обычно ближе?",
    hint: "Можно выбрать несколько — я просто хочу знать, в какую сторону смотреть.",
    type: "multi",
    options: ["Итальянская", "Грузинская", "Кавказская", "Азиатская", "Европейская", "Русская", "Мексиканская", "Мне нравится разное"],
  },
  {
    id: "main",
    eyebrow: "02 · Главное",
    title: "Что тебе хотелось бы видеть на столе?",
    hint: "Выбирай всё, что действительно любишь.",
    type: "multi",
    options: ["Мясо", "Птица", "Рыба", "Морепродукты", "Овощи", "Что-нибудь лёгкое", "Лучше удиви меня"],
  },
  {
    id: "vegetables",
    eyebrow: "03 · Овощи",
    title: "А с овощами как?",
    hint: "Можно отметить любимые и те, которые лучше не класть в корзину.",
    type: "multi",
    options: ["Помидоры", "Огурцы", "Болгарский перец", "Баклажан", "Кабачок", "Брокколи", "Авокадо", "Зелень", "Лук", "Чеснок", "Грибы", "Почти все люблю"],
  },
  {
    id: "fruits",
    eyebrow: "04 · Фрукты",
    title: "Что взять с собой из фруктов?",
    hint: "Или можно просто написать свой вариант.",
    type: "multi",
    options: ["Яблоки", "Виноград", "Клубника", "Персики", "Цитрусы", "Бананы", "Ягоды", "Манго", "Арбуз / дыня", "Не принципиально"],
  },
  {
    id: "drinks",
    eyebrow: "05 · Напитки",
    title: "Что налить в бокал или кружку?",
    hint: "Без правильных ответов. Просто хочу подготовить то, что тебе приятно.",
    type: "multi",
    options: ["Вода", "Минеральная вода", "Сок", "Лимонад", "Тоник", "Красное вино", "Белое вино", "Игристое", "Пиво", "Коктейль", "Крепкий алкоголь", "Алкоголь не пью"],
  },
  {
    id: "coffee",
    eyebrow: "06 · Утро",
    title: "А утро начинается с…",
    hint: "Особенно важный вопрос для загородного дома.",
    type: "single",
    options: ["Кофе", "Чая", "Травяного чая", "Воды", "Сначала проснуться, потом решим"],
  },
  {
    id: "breakfast",
    eyebrow: "07 · Завтрак",
    title: "Что бы ты выбрала на спокойный завтрак?",
    type: "multi",
    options: ["Яичница / омлет", "Сырники", "Каша", "Круассаны / выпечка", "Фрукты и ягоды", "Сэндвичи", "Что-нибудь лёгкое", "Я не завтракаю"],
  },
  {
    id: "mood",
    eyebrow: "08 · Атмосфера",
    title: "Какой должна быть атмосфера вечером?",
    hint: "Можно выбрать несколько.",
    type: "multi",
    options: ["Огонь / камин", "Тишина и лес", "Музыка на фоне", "Свечи и приглушённый свет", "Прогулка", "Долгие разговоры", "Уют и плед", "Никаких планов — просто по настроению"],
  },
  {
    id: "music",
    eyebrow: "09 · Звук",
    title: "Что включить по дороге и вечером?",
    type: "multi",
    options: ["Спокойную электронику", "Атмосферную музыку", "Акустику", "Джаз", "Инструментальную", "Романтичную", "Что-нибудь поживее", "Иногда лучше тишина"],
  },
  {
    id: "avoid",
    eyebrow: "10 · Важно",
    title: "А что тебе точно НЕ нравится?",
    hint: "Продукты, напитки, запахи, музыка — вообще что угодно. Поле можно оставить пустым.",
    type: "text",
    optional: true,
  },
  {
    id: "wish",
    eyebrow: "11 · От себя",
    title: "Есть маленькое пожелание к этой поездке?",
    hint: "Даже если это что-то совсем простое.",
    type: "text",
    optional: true,
  },
];

const STORAGE_KEY = "little-journey-questionnaire-v1";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [started, setStarted] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[] | string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setAnswers(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {}
  }, [answers]);

  const current = questions[index];
  const selected = useMemo(() => {
    const v = answers[current.id];
    return Array.isArray(v) ? v : v ? [v] : [];
  }, [answers, current.id]);

  function start() {
    setStarted(true);
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.22;
    a.muted = false;
    const playPromise = a.play();
    if (playPromise) {
      playPromise.then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    }
  }

  function toggleMusic() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setMusicOn(true)).catch(() => {});
    else {
      a.pause();
      setMusicOn(false);
    }
  }

  function choose(value: string) {
    setAnswers((prev) => {
      if (current.type === "single") return { ...prev, [current.id]: value };
      const existing = Array.isArray(prev[current.id]) ? (prev[current.id] as string[]) : [];
      return {
        ...prev,
        [current.id]: existing.includes(value)
          ? existing.filter((x) => x !== value)
          : [...existing, value],
      };
    });
  }

  function textChange(value: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  function canContinue() {
    return !!current.optional || selected.length > 0;
  }

  function next() {
    if (canContinue() && index < questions.length - 1) setIndex((v) => v + 1);
  }

  function back() {
    if (index > 0) setIndex((v) => v - 1);
  }

  async function submit() {
    if (submitting || submitted) return;
    setSubmitting(true);
    setError("");
    const payload = {
      source: "little-journey",
      submittedAt: new Date().toISOString(),
      ...Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : v])
      ),
    };
    try {
      await fetch(submissionUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      setError("Не удалось отправить ответы. Проверь соединение и попробуй ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  const isLast = index === questions.length - 1;

  return (
    <main className="journey">
      <audio ref={audioRef} loop preload="metadata">
        <source src="/MiracleNight/untitled.mp3" type="audio/mpeg" />
        <source src="/untitled.mp3" type="audio/mpeg" />
      </audio>

      <div className="grain" />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {!started ? (
        <section className="welcome screen-in">
          <div className="monogram">01</div>
          <div className="kicker">Маленькое путешествие</div>
          <h1>
            Перед дорогой
            <br />
            <em>есть одна просьба.</em>
          </h1>
          <p className="lead">
            Мы ненадолго оставим город позади. Будет дорога, загородный дом,
            природа, вкусный вечер и время без спешки.
          </p>
          <p className="lead muted">
            Я хочу подготовить всё так, чтобы тебе было действительно хорошо.
            Поэтому — несколько простых вопросов.
          </p>
          <button className="primary" onClick={start}>
            Начать путешествие <span>→</span>
          </button>
          <div className="welcome-note">
            <span /> никаких правильных ответов · только твои вкусы <span />
          </div>
        </section>
      ) : submitted ? (
        <section className="welcome success-screen screen-in">
          <div className="monogram">✓</div>
          <div className="kicker">Готово</div>
          <h1>
            Теперь я знаю
            <br />
            <em>немного больше.</em>
          </h1>
          <p className="lead">
            Спасибо. Остальное я оставлю за собой — маршрут, детали и несколько
            маленьких сюрпризов.
          </p>
          <div className="success-line">До встречи в дороге.</div>
        </section>
      ) : (
        <section className="question-screen screen-in" key={current.id}>
          <header className="topbar">
            <button className="back-link" onClick={back} disabled={index === 0}>
              ← назад
            </button>
            <div className="counter">
              {String(index + 1).padStart(2, "0")}{" "}
              <span>/ {String(questions.length).padStart(2, "0")}</span>
            </div>
            <button
              className={`music ${musicOn ? "on" : ""}`}
              onClick={toggleMusic}
              aria-label={musicOn ? "Выключить музыку" : "Включить музыку"}
            >
              {musicOn ? "♫" : "♪"}
            </button>
          </header>

          <div
            className="progress"
            role="progressbar"
            aria-valuenow={index + 1}
            aria-valuemin={1}
            aria-valuemax={questions.length}
          >
            <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
          </div>

          <div className="question-wrap">
            <div className="kicker">{current.eyebrow}</div>
            <h2>{current.title}</h2>
            {current.hint && <p className="hint">{current.hint}</p>}

            {current.type !== "text" && (
              <div className="options">
                {current.options?.map((o) => (
                  <button
                    key={o}
                    className={`option ${selected.includes(o) ? "selected" : ""}`}
                    aria-pressed={selected.includes(o)}
                    onClick={() => choose(o)}
                  >
                    <span className="option-dot" />
                    <span>{o}</span>
                    <b>✓</b>
                  </button>
                ))}
              </div>
            )}

            {current.type === "text" && (
              <textarea
                value={typeof answers[current.id] === "string" ? (answers[current.id] as string) : ""}
                onChange={(e) => textChange(e.target.value)}
                placeholder={
                  current.id === "avoid"
                    ? "Например: не люблю оливки, слишком сладкие напитки…"
                    : "Можно написать даже одно предложение."
                }
              />
            )}

            {current.type === "multi" && (
              <div className="tiny-note">Можно выбрать несколько вариантов</div>
            )}

            <div className="bottom-actions">
              <button
                className="primary"
                onClick={isLast ? submit : next}
                disabled={!canContinue() || (isLast && submitting)}
              >
                {isLast
                  ? submitting
                    ? "Сохраняю…"
                    : "Отправить"
                  : "Дальше"}{" "}
                <span>→</span>
              </button>
              {current.optional && !isLast && (
                <button className="skip" onClick={next}>
                  Пропустить
                </button>
              )}
            </div>

            {error && (
              <div className="send-area">
                <p>{error}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
