import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { TopPageModule } from './top-page/top-page.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './config/mongo.config';
import { FilesModule } from './files/files.module';
import { SitemapModule } from './sitemap/sitemap.module';

@Module({
  imports: [
	ConfigModule.forRoot(),
	TypegooseModule.forRootAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: getMongoConfig
	}),
	ProductModule,
	TopPageModule,
	ReviewModule, 
	AuthModule, FilesModule, SitemapModule,
  ]
})
export class AppModule {}
