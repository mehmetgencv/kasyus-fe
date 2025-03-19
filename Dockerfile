# Base image olarak Node.js kullan
FROM node:22.12-alpine

# Çalışma dizinini belirle
WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Kodları kopyala
COPY . .

# Next.js uygulamasını build et
RUN npm run build

# Port tanımla
EXPOSE 3000

# Next.js sunucusunu başlat
CMD ["npm", "start"]
