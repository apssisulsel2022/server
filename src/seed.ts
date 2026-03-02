import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = 'admin@example.com';
  const adminPassword = 'password123';

  const existingAdmin = await usersService.findByEmail(adminEmail);
  if (!existingAdmin) {
    console.log('Creating Super Admin...');
    await usersService.create({
      email: adminEmail,
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      firstName: 'Super',
      lastName: 'Admin',
    });
    console.log('Super Admin created successfully.');
  } else {
    console.log('Super Admin already exists.');
  }

  await app.close();
}
bootstrap();
