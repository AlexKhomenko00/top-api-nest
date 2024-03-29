import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compare, genSalt, hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import {
  INVALID_CREDENTIALS_ERROR,
  USER_NOT_FOUND_ERROR,
} from './auth.constants';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);

    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: await hash(dto.password, salt),
    });

    return newUser.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const existingUser = await this.findUser(email);
    if (!existingUser) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isCorrectPassword = await compare(
      password,
      existingUser.passwordHash,
    );

    if (!isCorrectPassword) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_ERROR);
    }

    return { email: existingUser.email };
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
