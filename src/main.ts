import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

declare const module: any;

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();

    app.useStaticAssets(join(__dirname, '..', 'public'), {
      prefix: '/public/',
    });

    await app.listen(process.env.PORT ?? 3000);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  } catch (error) {
    console.error('NestJS app failed to start:', error);
  }
}
void bootstrap();
