// Конфигурация — здесь задаёшь логин, пароль и вопросы
const config = {
  expectedLogin: "14.09",    // пример: дата рождения
  expectedPassword: "1995",  // пример: год
  steps: [
    {
      question: "Кто сделал данное фото?",
      correctAnswer: "Карагодин",
      photo: "https://github.com/Alenchik2509/Alenchik2509.github.io/releases/download/v1.0/qv1.jpg"
    },
    {
      question: "Где мы впервые встретились?",
      correctAnswer: "На работе",
      photo: "https://github.com/Alenchik2509/Alenchik2509.github.io/releases/download/v1.0/qv2.jpg"
    },
    {
      question: "Как зовут этого верблюда?",
      correctAnswer: "Надя",
      photo: "https://github.com/Alenchik2509/Alenchik2509.github.io/releases/download/v1.0/qv3.jpg"
    },
    {
      question: "А этого верблюда как зовут?",
      correctAnswer: "Наташа",
      photo: "https://github.com/Alenchik2509/Alenchik2509.github.io/releases/download/v1.0/qv4.jpg"
    },
    {
      question: "Сколько стран мы посетили за твой 30-ый год?",
      correctAnswer: "5",
      photo: "https://github.com/Alenchik2509/Alenchik2509.github.io/releases/download/v1.0/qv5.jpg"
    }
  ],
};

// Получаем элементы кнопок по id
const buttons = {
  login: document.getElementById("loginBtn"),
  start: document.getElementById("startGameBtn"),
  answer: document.getElementById("answerBtn"),
  wrongContinue: document.getElementById("continueBtnWrong"),
  continue: document.getElementById("continueBtnJournal"),
  restart: document.getElementById("restartBtn"),
  back: document.querySelectorAll(".backBtn"),
  toGallery: document.getElementById("toGalleryBtn"),
};

// Получаем поля ввода
const inputs = {
  login: document.getElementById("loginInput"),
  password: document.getElementById("passInput"),
  answer: document.getElementById("answerInput"),
};

// Получаем страницы (секции)
const pages = {
  login: document.getElementById("loginPage"),
  party: document.getElementById("partyPage"),
  question: document.getElementById("questionPage"),
  journal: document.getElementById("journalPage"),
  wrong: document.getElementById("wrongChoicePage"),
  gallery: document.getElementById("galleryPage"),
  pdfGift: document.getElementById("pdfGiftPage"),
};

// Остальные элементы, например фото и вопрос
const elements = {
  photo: document.getElementById("partyPhoto2"),  // фото в вопросе
  question: document.getElementById("questionText"), // текст вопроса
  galleryGrid: document.getElementById("galleryGrid"),
  lightbox: document.getElementById("lightbox"),
  lightboxImg: document.getElementById("lightboxImg"),
  lightboxCaption: document.getElementById("lightboxCaption"),
  lightboxClose: document.getElementById("lightboxClose"),
};

// Звуки
const audio = {
  bg: document.getElementById("bgMusic"),
  success: document.getElementById("successSound"),
  error: document.getElementById("errorSound"),
};

// Для истории страниц назад
const pageHistory = [];

// Текущее состояние — индекс вопроса
const state = {
  index: 0,
};

// Функция для отображения нужной страницы
function show(section) {
  const current = document.querySelector(".page.active");
  if (current && current !== section) {
    pageHistory.push(current.id); // Запоминаем текущую страницу в историю
  }

  // Скрываем все страницы
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  // Показываем выбранную
  section.classList.add("active");

  // Запуск или остановка фоновой музыки
  if (section.id === "partyPage") {
    audio.bg.currentTime = 0;
    audio.bg.play();
  } else {
    audio.bg.pause();
    audio.bg.currentTime = 0;
  }
}

// Обработчик кнопок "назад" — возвращаемся на предыдущую страницу из истории
buttons.back.forEach(btn => {
  btn.addEventListener("click", () => {
    const prevId = pageHistory.pop();
    if (prevId) {
      show(document.getElementById(prevId));
    }
  });
});

// Логин
buttons.login.addEventListener("click", () => {
  const login = inputs.login.value.trim();
  const password = inputs.password.value.trim();

  if (login === config.expectedLogin && password === config.expectedPassword) {
    show(pages.party);
  } else {
    alert("Неверный логин или пароль. Измени config в app.js.");
  }
});

// Начало игры — со страницы праздника переходим на страницу журнала
buttons.start.addEventListener("click", () => {
  state.index = 0;          // Сбрасываем индекс вопроса
  show(pages.journal);      // Показываем журнал
});

// Показ вопроса
function showQuestion() {
  const currentStep = config.steps[state.index];
  if (!currentStep) {
    // Если вопросов больше нет — показываем страницу подарков
    show(pages.pdfGift);
    return;
  }
  // Обновляем фото и текст вопроса
  elements.photo.src = currentStep.photo || "";
  elements.question.textContent = currentStep.question || "";
  inputs.answer.value = "";  // очищаем поле ввода
  show(pages.question);
}

// На кнопке "Продолжить" в журнале — запускаем первый вопрос
buttons.continue.addEventListener("click", () => {
  showQuestion();
});

// Обработка ответа на вопрос
buttons.answer.addEventListener("click", () => {
  const userAnswer = inputs.answer.value.trim();
  const correctAnswer = config.steps[state.index].correctAnswer;

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    audio.success.play();
    state.index++;
    if (state.index === config.steps.length) {
      // Все вопросы отвечены — показать подарок
      show(pages.pdfGift);
    } else {
      // Показать следующий вопрос
      showQuestion();
    }
  } else {
    audio.error.play();
    show(pages.wrong);
  }
});

// Кнопка "продолжить" после ошибки — возвращаемся к вопросу
buttons.wrongContinue.addEventListener("click", () => {
  showQuestion();
});

// Кнопка перехода в галерею после подарка
buttons.toGallery.addEventListener("click", () => {
  show(pages.gallery);
});

// Перезапуск игры (например, после завершения или из галереи)
buttons.restart?.addEventListener("click", () => {
  show(pages.login);
});

// Лайтбокс — показ картинки при клике в галерее
elements.galleryGrid?.addEventListener("click", (event) => {
  if (event.target.tagName === "IMG") {
    elements.lightbox.style.display = "block";
    elements.lightboxImg.src = event.target.src;
    elements.lightboxCaption.textContent = event.target.alt || "";
  }
});

// Закрытие лайтбокса
elements.lightboxClose?.addEventListener("click", () => {
  elements.lightbox.style.display = "none";
});

// Автопрокрутка фотоленты на странице праздника
document.addEventListener("DOMContentLoaded", () => {
  const film = document.querySelector("#partyPage .photo-wrap");
  if (!film) return;

  let scrollAmount = 0;
  const scrollStep = 260; // примерная ширина фото + gap
  const delay = 2500;     // задержка между прокрутками (мс)

  setInterval(() => {
    if (film.scrollWidth - film.clientWidth <= 0) return; // если фото мало, не прокручиваем

    if (scrollAmount >= film.scrollWidth - film.clientWidth) {
      scrollAmount = 0; // возвращаемся в начало
    } else {
      scrollAmount += scrollStep;
    }

    film.scrollTo({
      left: scrollAmount,
      behavior: "smooth"
    });
  }, delay);
});
