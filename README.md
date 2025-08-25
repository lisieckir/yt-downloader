# YouTube Downloader API (NestJS)

This project is a simple NestJS-based API for downloading YouTube videos using the `yt-dlp` command-line tool. It features a basic queue system for download requests and is ready to run in Docker.

## Features
- Queue YouTube video download requests
- Download videos using `yt-dlp`
- REST API endpoints
- Dockerized for easy deployment

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm
- Docker (optional, for containerized runs)
- `yt-dlp` installed in the Docker image or host

### Installation
```bash
cd yt-app
npm install
```

### Running the App
```bash
npm run start:dev
```

### Running with Docker
Build and run the container:
```bash
docker build -t yt-downloader .
docker run -p 3000:3000 yt-downloader
```

## API Endpoints
- `POST /download` - Queue a new YouTube video for download
- `GET /queue` - List queued and active downloads

## License
MIT
# production mode
