import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { disconnect, Types } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
	login: 'a@a.ru',
	password: '1'
}

const testDto: CreateReviewDto = {
	name: 'Test',
	title: 'Title',
	description: 'Description test',
	rating: 5,
	productId
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createId: string;
  let token: string; 

  beforeEach(async () => {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	app = moduleFixture.createNestApplication();
	await app.init();

	const {body} = await request(app.getHttpServer())
		.post('auth/login')
		.send(loginDto);
	token = body.access_token;
  });

  it('/review/create (POST)', async ()=> {
	return request(app.getHttpServer())
		.post('/review/create')
		.send(testDto)
		.expect(201)
		.then(({body}: request.Response) => {
			createId = body._id;
			expect(createId).toBeDefined();
		});
  });

  it('/review/create (POST)', async ()=> {
	return request(app.getHttpServer())
		.post('/review/create')
		.send({...testDto, rating: 0 })
		.expect(400)
		.then(({body}: request.Response) => {
		});
  });

  it('/review/byProduct/:productId (GET)', async ()=> {
	return request(app.getHttpServer())
		.get('/review/byProduct/' + productId)
		.expect(200)
		.then(({body}: request.Response) => {
			expect(body.length).toBe(1);
		});

  });

  it('/review/:id (DELETE)', ()=> {
	return request(app.getHttpServer())
		.delete('/review/' + createId)
		.send(testDto)
		.expect(200);
  });

  	afterAll(() => {
		  disconnect();
	  });
});
