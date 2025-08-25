FROM node:20-alpine

RUN apk add --no-cache yt-dlp ffmpeg

WORKDIR /app

# Only copy package files first
COPY package*.json ./

# Install dependencies (cached unless package files change)
RUN npm install

# Now copy the rest of your app
COPY . .

RUN npm run build

VOLUME ["/downloads"]

EXPOSE 3000
CMD ["npm", "run", "start:prod"]