import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { UserService } from 'src/modules/user/user.service';
import { PrismaService } from 'src/modules/prismaSrc/prisma.service';

describe('User service Int', () => {
  let prisma: PrismaService;
  let userService: UserService;
  let email: string;
  let userId: number;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    userService = moduleRef.get(UserService);
    await prisma.cleanDatabase();
  });

  describe('createUser()', () => {
    it('should create a user', async () => {
      const userData = {
        name: 'test',
        email: 'test@email.com',
        password: '1234',
        role: 'USER',
      };
      const user = await userService.createUser(userData);
      userId = user.id;
      email = user.email;
    });
  });

  describe('getUser()', () => {
    it('should get a single user through email', async () => {
      const user = await userService.user(email);
    });
  });

  describe('getAllUser()', () => {
    it('should get a all user of the application', async () => {
      const user = await userService.users();
    });
  });

  describe('updateUser()', () => {
    it('should update a user, only the name of the user can be updated', async () => {
      const updateData = { id: userId, data: { name: 'New Name' } };
      console.log(updateData);
      const user = await userService.updateUser(updateData);
    });
  });

  describe('deleteUser()', () => {
    it('should delete a user, ', async () => {
      const user = await userService.deleteUser(userId);
    });
  });

  it.todo('is passed');
});
