import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation — automatically validates any @Body() DTO against class-validator rules
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties from the body
      forbidNonWhitelisted: true, // throw if unknown properties are sent
    }),
  );

  // Serialization — applies @Exclude / @Expose on any class instance returned from a handler
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  app.useGlobalFilters(new DomainExceptionFilter());

  await app.listen(3000);
}
bootstrap();
