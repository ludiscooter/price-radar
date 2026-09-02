# 📡 Price Radar — Офіційний лендінг Telegram-бота

<div align="center">
  <img src="price-radar-avatar.png" alt="Price Radar Logo" width="100" style="border-radius: 24px;" />
  <br />

  [![Telegram Bot](https://img.shields.io/badge/Telegram-@hotline__price__monitor__bot-229ED9?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/hotline_price_monitor_bot)
  [![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-22c55e?style=for-the-badge&logo=github&logoColor=white)](https://ludiscooter.github.io/price-radar/)
  [![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-f59e0b?style=for-the-badge)](https://developer.mozilla.org/)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

  <p align="center">
    <strong>Сучасний, швидкий та інтерактивний лендінг для сервісу моніторингу цін у Telegram.</strong><br />
    Знаходьте вигідні пропозиції магазинів України, переглядайте динаміку цін та отримуйте миттєві сповіщення про знижки.
  </p>
</div>

---

## ✨ Основні можливості сайту

### 1. 🔍 Інтерактивний радар-симулятор цін
- **Миттєвий тест гаджетів:** швидкі чіпи популярних товарів (*AirPods Pro 2, PS5 Slim, RTX 4070 Super, MacBook Air M3, Dyson Airwrap*) або довільний пошук.
- **Анімація сканування:** неонове радарне коло з обертовим променем, що імітує опитування каталогів Rozetka, Hotline, Telemart, Comfy тощо.
- **Динамічний 30-денний SVG-графік:** плавна векторна крива коливання цін з інтерактивними точками та підказками.
- **Порівняння пропозицій:** актуальні ціни кількох перевірених магазинів, рейтинги та статус найкращої пропозиції.

### 2. 💬 Інтерактивний Telegram-чат у Bento-сітці
- Реалістична темна тема інтерфейсу повідомлень Telegram.
- Клікабельні інлайн-кнопки (`🔔 Стежити`, `🎯 Ціль −10%`, `📊 Статистика`), що демонструють миттєву реакцію бота та зміну статусів без перезавантаження.

### 3. 🧮 Калькулятор розумної економії
- Градієнтний повзунок річного бюджету на гаджети (від 10 000 до 200 000 ₴).
- Налаштування частоти покупок і відсотка очікуваної знижки (−8%, −15%, −22%).
- Плавний підрахунок річної вигоди та наочні приклади того, на що вистачить збережених коштів.

### 4. 🏷️ Інтерактивні категорії товарів
- 8 популярних категорій (*Смартфони, Ноутбуки, Консолі, Аудіо, Техніка для дому, Телевізори, Смартгодинники, Фото й відео*).
- При виборі категорії плавно підвантажуються 3 картки актуальних пропозицій із реальними знижками та прямим переходом.

### 5. ⚡ Ультра-преміальний візуальний дизайн
- Сучасна типографіка **Plus Jakarta Sans** та **Inter** із Google Fonts.
- Неонові анімації, ефекти скляного морфізму (glassmorphism), м'яке свічення курсора на ПК.
- Плаваюча кнопка швидкого запуску Telegram-бота в кутку екрана з пульсуючим бейджем активності.
- Повна оптимізація під мобільні екрани (Touch Swipe для каруселі) та підтримка режиму `prefers-reduced-motion`.

---

## 📂 Структура проєкту

```text
price-radar/
├── index.html               # Головна HTML5 розмітка сторінки з семантичними секціями
├── styles-v4.css            # Базові та розширені стилі компонентів, адаптивність
├── motion-v4.css            # Keyframes анімації, переходи, ефекти радара та пульсації
├── app-v4.js                # Інтерактивна логіка (радар, SVG графік, калькулятор, чат)
├── price-radar-avatar.png   # Логотип та іконка сервісу Price Radar
├── price-radar-welcome.png  # Банерний візуал для Hero-секції та OpenGraph прев'ю
├── .gitignore               # Виключення тимчасових та службових файлів
└── README.md                # Документація репозиторію
```

---

## 🚀 Як запустити локально

Сайт працює без бекенду та важких збирачів — це чистий HTML/CSS/JavaScript:

### Варіант 1: Через Python 3 (рекомендовано для macOS / Linux / Windows)
```bash
python3 -m http.server 8000
```
Відкрийте у браузері: [http://localhost:8000](http://localhost:8000)

### Варіант 2: Через Node.js / npx
```bash
npx serve .
```

### Варіант 3: VS Code Live Server
Встановіть розширення **Live Server** у VS Code та натисніть кнопку *«Go Live»* у нижньому кутку редактора.

---

## 🌐 Публікація та оновлення на GitHub Pages

Сайт оптимізовано для безкоштовного хостингу на **GitHub Pages**:

1. **Якщо оновлюєте через Git CLI:**
   ```bash
   git add .
   git commit -m "feat: live radar demo, savings calculator, interactive bot chat and UI polish"
   git push origin main
   ```

2. **Якщо завантажуєте через веб-інтерфейс GitHub:**
   - Перейдіть до свого репозиторію на GitHub: `https://github.com/ludiscooter/price-radar`
   - Натисніть **Add file** ➔ **Upload files**
   - Перетягніть файли (`index.html`, `styles-v4.css`, `motion-v4.css`, `app-v4.js`, `README.md`, `.gitignore`, картинки)
   - Натисніть **Commit changes**

3. **Увімкнення GitHub Pages (якщо ще не увімкнено):**
   - Відкрийте вкладку **Settings** ➔ **Pages** у репозиторії.
   - У розділі **Build and deployment**:
     - **Source**: `Deploy from a branch`
     - **Branch**: `main` / каталог `/ (root)`
   - Натисніть **Save**. Через 1–2 хвилини сайт буде доступний за адресою:
     👉 **[https://ludiscooter.github.io/price-radar/](https://ludiscooter.github.io/price-radar/)**

---

## 🔗 Посилання

- **Telegram-бот:** [@hotline_price_monitor_bot](https://t.me/hotline_price_monitor_bot)
- **Живий сайт:** [https://ludiscooter.github.io/price-radar/](https://ludiscooter.github.io/price-radar/)

---

<div align="center">
  <sub>© 2026 Price Radar. Розроблено для швидких та вигідних покупок.</sub>
</div>
