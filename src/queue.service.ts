
import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export interface DownloadJob {
  id: string;
  url: string;
  status: 'queued' | 'downloading' | 'completed' | 'failed';
  output?: string;
  error?: string;
}

@Injectable()
export class QueueService {
  private queue: DownloadJob[] = [];
  private activeJob: DownloadJob | null = null;

  addJob(url: string): DownloadJob {
    const job: DownloadJob = {
      id: Math.random().toString(36).substring(2, 10),
      url,
      status: 'queued',
    };
    this.queue.push(job);
    this.processQueue();
    return job;
  }

  getJobs(): DownloadJob[] {
    return [...this.queue, ...(this.activeJob ? [this.activeJob] : [])];
  }

  private async processQueue() {
    if (this.activeJob || this.queue.length === 0) return;
    this.activeJob = this.queue.shift()!;
    this.activeJob.status = 'downloading';
    try {
      const { stdout } = await execAsync(`yt-dlp -o "/downloads/%(title)s.%(ext)s" ${this.activeJob.url}`);
      this.activeJob.status = 'completed';
      this.activeJob.output = stdout;
      console.log('Download completed:', stdout);
    } catch (e: any) {
        console.error('Download failed:', e);
      this.activeJob.status = 'failed';
      this.activeJob.error = e.message;
    }
    this.queue.push(this.activeJob);
    this.activeJob = null;
    
    setTimeout(() => this.processQueue(), 0);
  }
}
