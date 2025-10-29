# Разработка защищенного REST API с интеграцией в CI/CD

**Назначение**: получить практический опыт разработки безопасного backend-приложения с автоматизированной проверкой кода на уязвимости. Освоить принципы защиты от OWASP Top 10 и интеграцию инструментов безопасности в процесс разработки.

*Выполнил*: `Кириллов Андрей`

*Группа*: `P3430`

## Эндпоинты API

1. **Регистрация пользователя**
- URL:  `POST /auth/register`
- Запрос:
```
{
  "username": "AndreyK",
  "password": "qwerty123"
  "email": "kiraa7803@gmail.com"
}
```
- Ответ:
```
"message": "User created successfully",
"user":{
  "id": 3,
  "username": "AndreyK",
  "email": "kiraa7803@gmail.com"
}
```

2. **Логин пользователя**
- URL: `POST /auth/login`
- Запрос:
```
{
  "username": "AndreyK",
  "password": "qwerty123"
}
```
- Ответ:
```
{
  "message": "Login syccessful",
  "token": "euJHbG...",
  "user":{
    "id": 3,
    "username": "AndreyK",
    "email": "kiraa7803@gmail.com"
  }
}
```

3. **Получение данных**
- URL: `GET /api/posts`
- Ответ:
```
{
  "message": "Posts retieved successfully",
  "posts": ['список постов']
}
```

4. **Создание поста**
- URL: `POST /api/notes`
- Заголовки запроса:
```
Authorization: Bearer <токен_здесь>
Content-Type: application/json
```
- Запрос:
```
{
  "title": "Это мой тайтл",
  "content": "А это мой контент"
}
```

### Реализованные меры защиты

1.    **SQL Injection (SQLi):**
	- Защита от SQLi (SQL-инъекций) - я использую базу базу данных sqlite вместе с sequalize, которой обеспечивает маппинг объектов на таблицу (ОРМ). Благодаря такому подходу мы решаем проблему sql инъекций путем конкатенации строк.

2.    **XSS:**
	- Защита от XSS - я реализовал санитизацию всех пользовательских данных перед отправкой в ответах API. Ответы возвращааются в формате json.

3.    **Аутентификация и авторизация:**
	- Аутентификация реализована с использованием JWT-токенов. Для каждого входящего запроса выполняется проверка наличия и валидности токена доступа. Запросы без корректного токена не проходят.

4.    **Пароли:**
	- Пароли храню в зашифрованном виде с помощью bcrypt.

### Отчеты SAST/SCA


[Ссылка]([https://github.com/kkettch/information-security-semester-7/actions/runs/17979456301/job/51141314225#logs](https://github.com/cemetiere/information_security_lab1/actions/runs/18881253107)) на успешно пройденный pipeline

[Ссылка]([https://github.com/kkettch/information-security-semester-7](https://github.com/cemetiere/information_security_lab1))на GitHub репозиторий

### Вывод

В ходе лабораторной работы я разработал защищенный backend на Node.js, реализовав основные механизмы безопасности: JWT для аутентификации, bcrypt для хеширования паролей и Sequelize с параметризованными запросами против SQL-инъекций.
Для тестирования безопасности применил SAST через ESLint и CodeQL, а также SCA через Snyk. Все проверки в CI/CD пайплайне прошли успешно, подтвердив защищенность приложения от основных уязвимостей OWASP Top 10.




