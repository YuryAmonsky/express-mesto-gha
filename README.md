# Backend для проекта Mesto  
## Обзор
Mesto - это фотохостинг, отображающий пользователю набор постов с фотографиями/изображениями их названиями и лайками.  
Полное описание проекта можно посмотреть [здесь](https://github.com/YuryAmonsky/Project-Mesto-)  
В данном репозитории представлен функционал сервера. 
  
#### Основной функционал Mesto:
 - загрузка списка постов с сервера,
 - редактирование профиля пользователя (Имя, описание, аватар)
 - добавление/удаление нового поста с фотографией места (пользователь может удалять только свои посты),
 - просмотр изображения в оригинальном размере,
 - возможность отмечать посты лайком.  
 
## На стороне сервера реализована обработка запросов по разным эндпоинтам:  
 - регистрация пользователя (с сохранением хеша пароля в БД)  
 - аутентификация с выдачей JWT-токена и авторизация пользователя  
 - выдача массива карточек  
 - обновление профиля пользователя  
 - добавление карточки  
 - удаление карточки, принадлежащей текущему пользователю  
 - добавление лайка карточке от текущего пользователя  
 - удаление лайка текущего пользователя карточки  
 Для всех запросов производится валидация данных, передаваемых в параметрах запроса либо в теле запроса  

#### Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
`/middlewares` — папка с спрмежуточными обработчиками аутентификации и ошибок  
`/utils` — папка с константами и классами ошибок  
  
Остальные директории вспомогательные, создаются при необходимости разработчиком

#### Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

#### Используемые технологии и инструменты  
  Node.js (v16.15.1), 
  Express.js (v4.18.2)  
  Mongoose (v6.6.5)  
  MongoDB (v4.4.17)  
  
  bcryptjs (v2.4.3)
  body-parser (v1.20.1)
  celebrate (v15.0.1)  
  jsonwebtoken (v8.5.1)

## Репозиторий
[https://github.com/YuryAmonsky/express-mesto-gha](https://github.com/YuryAmonsky/express-mesto-gha)

**Другие репозитории проекта Mesto**
* Общий ReadMe  
  https://github.com/YuryAmonsky/Project-Mesto-  
* Верстка основного контента и реализация функционала главной страницы.  
   Репозиторий: https://github.com/YuryAmonsky/mesto  
   Демо: https://yuryamonsky.github.io/mesto/  
*  Портирование на React.js  
   Репозиторий: https://github.com/YuryAmonsky/mesto-react  
   Демо: https://yuryamonsky.github.io/mesto-react/   
* Добавление функционала регистрации и авторизации пользователя.  
   Репозиторий: https://github.com/YuryAmonsky/react-mesto-auth  
   Демо: https://yuryamonsky.github.io/react-mesto-auth/   
