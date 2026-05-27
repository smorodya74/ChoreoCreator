# <img width="50" height="50" alt="logo" src="https://github.com/user-attachments/assets/958150f4-44bf-4d17-a860-f5a9869dadd0" /> Choreo Creator
Проект от танцора для танцоров для создания, редактирования и визуализации хореографических сценариев
---
Сценарий - комплекс танцевальных рисунков с переходами танцоров, объединенных в одну танцевальную композицию

## Технологический стек
- C# / .NET 9
- Entity Framework (PostgreSQL)
- JWT-аутентификация
- TypeScript / React + Next.js
- Ant Design (библиотека компонентов)

## Основные функции приложения
Ниже перечислены основные функции системы

### 1. Регистрация, аутентификация и авторизация пользователя
Email + Пароль (валидация вводимых данных) <br>
<img width="400" height="300" alt="LoginForm" src="https://github.com/user-attachments/assets/670722a3-9cb7-45bb-88a5-54b783afdc24" />

### 2. Работа над хореографическим сценарием
Написан собственный редактор
- Поддержка до 16 слайдов (танцевальных рисунков);
- Поддержка до 16 танцоров;
- Сохранение, публикация или удалние сценария;
<img width="1280" height="720" alt="Editor" src="https://github.com/user-attachments/assets/23328352-db8c-4ca7-a5c5-63152bb2947b" />

### 3. Экспорт сценария в PDF-документ
- Для преобразования HTML-компонентов в изображение используется библиотека `html2canvas`
- Для генерации PDF-документа с вложенной структурой используется библиотека `jsPDF`
<img width="1280" height="720" alt="{9CF6A4D0-DBF5-45EE-B070-A24ABCCEDCAF}" src="https://github.com/user-attachments/assets/45b968e0-056f-4a65-a8ff-f4759397c5e0" />

Контакты: <br>
[![VK](https://img.shields.io/badge/VK-0077FF.svg?style=for-the-badge&logo=VK&logoColor=white)](https://vk.com/smorodya74)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/smorodya74)
[![Gmail](https://img.shields.io/badge/Gmail-EA4335.svg?style=for-the-badge&logo=Gmail&logoColor=white)](mailto:positivepel@gmail.com)

## Локальный production-запуск в Docker
Нужен только Docker Desktop. Backend, frontend и PostgreSQL запускаются контейнерами одной командой.

1. Создать файл окружения:
```powershell
Copy-Item .env.production.example .env
```

2. В `.env` заменить значения:
```env
POSTGRES_PASSWORD=change_me_strong_password
JWT_SECRET_KEY=replace_with_32_plus_random_chars
```

3. Собрать и запустить production-стек:
```powershell
docker compose -f docker-compose.prod.yml up -d --build
```

После запуска приложение доступно здесь:
```text
http://localhost:3000
```

Frontend проксирует API-запросы через `/api` внутрь Docker-сети на backend. Backend напрямую наружу не публикуется.

PostgreSQL хранит данные в Docker volume `choreocreator_pgdata`, поэтому данные остаются после остановки и повторного запуска контейнеров. Backend хранит служебные ASP.NET DataProtection keys в volume `choreocreator_dataprotection-keys`.

Остановить приложение без удаления данных:
```powershell
docker compose -f docker-compose.prod.yml down
```

Полностью удалить контейнеры и базу данных:
```powershell
docker compose -f docker-compose.prod.yml down -v
```

### Проверка состояния
```powershell
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

### Подключение к PostgreSQL из PgAdmin
PostgreSQL доступен только с локального устройства:
- Host name/address: `127.0.0.1`
- Port: значение `POSTGRES_HOST_PORT` из `.env`, по умолчанию `5433`
- Maintenance database: значение `POSTGRES_DB` из `.env`, по умолчанию `choreocreatordb`
- Username: значение `POSTGRES_USER` из `.env`
- Password: значение `POSTGRES_PASSWORD` из `.env`

Если порт `5433` занят, поменять `POSTGRES_HOST_PORT` в `.env` и перезапустить:
```powershell
docker compose -f docker-compose.prod.yml up -d
```

## Проверка перед релизом
```powershell
docker compose -f docker-compose.prod.yml config
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

ВЫКАТЫВАЕМ РЕЛИЗ
