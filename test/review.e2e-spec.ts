import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'test',
  title: 'title',
  description: 'Test description',
  rating: 5,

  productId,
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

  it('/review/create (POST)', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({})
      .expect(200)
      .expect('Hello World!');
  });
});
