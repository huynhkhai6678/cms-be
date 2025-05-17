import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(process.env.PORT ?? 3000);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  } catch (error) {
    console.error('NestJS app failed to start:', error);
  }
}
bootstrap();
