# Используем официальный Node.js образ
FROM node:16

# Установка рабочей директории
WORKDIR /my-nestjs-app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Компиляция TypeScript в JavaScript
RUN npm run build

# Экспонируем порт, на котором будет работать приложение
EXPOSE 3001

# Команда для запуска приложения
CMD ["node", "dist/src/main.js"]
