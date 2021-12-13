import { Body,
	 Controller, 
	 Delete, Get, 
	 HttpException, 
	 HttpStatus, 
	 Param, 
	 Post, 
	 UseGuards, 
	 UsePipes, 
	 ValidationPipe } from '@nestjs/common';
import { UseAuthGuard } from 'src/auth/guards/jwt.guards';
import { UserEmail } from 'src/decorators/user-email.decorator';
import { IdValidationPipe } from 'src/pipes/ad-validation.pipe';
import { TelegramService } from 'src/telegram/telegram.service';
import { REVIEW_NOT_FOUND } from './constans.review';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly telegramService: TelegramService
		) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post('notify')
	async notify(@Body() dto: CreateReviewDto) {
		const message = `Name: ${dto.name}\n`
			+ `Title: ${dto.title}\n`
			+ `Description: ${dto.description}\n`
			+ `Rating: ${dto.rating}\n`
			+ `ID product: ${dto.productId}`; 
		return this.telegramService.sendMessage(message);
	}


	@UseGuards(UseAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.reviewService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@UseGuards(UseAuthGuard)
	@Get('byProduct/:productId')
	async getByProduct(@Param('productId', IdValidationPipe) productId: string, @UserEmail() email: string) {
		
		return this.reviewService.findByProductID(productId);
	}
}
