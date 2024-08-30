import { Module } from '@nestjs/common';
import { EmailService } from './emails.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // Export the service so it can be used in other modules
})
export class EmailModule {}
