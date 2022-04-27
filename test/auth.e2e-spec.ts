import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import {
  INVALID_CREDENTIALS_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../src/auth/auth.constants';

const loginDto = {
  login: '1@mail.ru',
  password: '123',
};

describe('Review (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      });
  });

  it('/auth/login (POST) - fail password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '2' })
      .expect(401, {
        statusCode: 401,
        message: INVALID_CREDENTIALS_ERROR,
        error: 'Unauthorized',
      });
  });

  it('/auth/login (POST) - fail email', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'aaa@a.ru' })
      .expect(401, {
        statusCode: 401,
        message: USER_NOT_FOUND_ERROR,
        error: 'Unauthorized',
      });
  });

  afterAll(() => {
    disconnect();
  });
});
