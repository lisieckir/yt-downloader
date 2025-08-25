import { Controller, Post, Body, Get } from '@nestjs/common';
import { QueueService, DownloadJob } from './queue.service';
import { exec } from 'child_process';
import { promisify } from 'util';

import { Res } from '@nestjs/common';
import type { Response } from 'express';

const execAsync = promisify(exec);

@Controller()
export class DownloadController {
  constructor(private readonly queueService: QueueService) {}
  @Get('/')
  async viewQueue(@Res() res: Response) {
    const jobs = this.queueService.getJobs();
    const html = `
      <html>
        <head>
          <title>YouTube Download Queue</title>
          <style>
            body { font-family: sans-serif; margin: 2em; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
            tr:nth-child(even) { background: #fafafa; }
            form { margin-bottom: 2em; }
            input[type="text"] { width: 400px; padding: 6px; }
            input[type="submit"] { padding: 6px 16px; }
          </style>
        </head>
        <body>
          <h1>YouTube Download Queue</h1>
          <form method="POST" action="/download" onsubmit="event.preventDefault(); fetch('/download', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({url: this.url.value})}).then(() => { window.location.reload(); });">
            <input type="text" name="url" placeholder="Enter YouTube URL" required />
            <input type="submit" value="Add to Queue" />
          </form>
          <table>
            <tr>
              <th>ID</th>
              <th>URL</th>
              <th>Status</th>
              <th>Output/Error</th>
            </tr>
            ${jobs.map(job => `
              <tr>
                <td>${job.id}</td>
                <td>${job.url}</td>
                <td>${job.status}</td>
                <td><pre style="white-space:pre-wrap;">${job.output || job.error || ''}</pre></td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;
    res.type('html').send(html);
  }

  @Post('download')
  async queueDownload(@Body('url') url: string): Promise<DownloadJob> {
    const job = this.queueService.addJob(url);
    return job;
  }

  @Get('queue')
  getQueue(): DownloadJob[] {
    return this.queueService.getJobs();
  }

  // Download logic is now handled in QueueService
}
