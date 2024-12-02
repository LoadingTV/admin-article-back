# Используем официальный Node.js образ
FROM node:20

 
# Установка рабочей директории
WORKDIR /my-nestjs-app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копируем файлы проекта
COPY . .

# Компиляция TypeScript в JavaScript
RUN npm run build

# Экспонируем порт
EXPOSE 3001

# Запуск приложения
CMD ["node", "dist/src/main.js"]
