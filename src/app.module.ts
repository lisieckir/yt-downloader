
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DownloadController } from './download.controller';
import { QueueService } from './queue.service';

@Module({
  imports: [],
  controllers: [AppController, DownloadController],
  providers: [AppService, QueueService],
})
export class AppModule {}
