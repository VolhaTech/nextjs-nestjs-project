import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel } from '@prisma/client';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.usersService.user({ id: id });
  }

  @Post()
  async signupUser(@Body() userData: { email: string; name: string;}): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() userData: {email: string; name: string},
  ): Promise<UserModel> {
    return this.usersService.updateUser({
      where: { id: id },
      data: userData,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<UserModel> {
    return this.usersService.deleteUser({ id: id });
  }
}