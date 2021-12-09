import { Body, 
	Controller, 
	Delete, 
	Get, 
	HttpCode, 
	NotFoundException, 
	Param, 
	Patch, 
	Post, 
	UseGuards, 
	UsePipes, 
	ValidationPipe } from '@nestjs/common';
import { UseAuthGuard } from 'src/auth/guards/jwt.guards';
import { IdValidationPipe } from 'src/pipes/ad-validation.pipe';
import { PAGE_NOT_FOUND } from './constans.top-page';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
	constructor(private readonly topPageService: TopPageService) {}

	@UseGuards(UseAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const page = await this.topPageService.findById(id);
		if (!page) {
			throw new NotFoundException(PAGE_NOT_FOUND);
		}
		return page;
	} 

	@Get('byAlias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		const aliasPage = await this.topPageService.findById(alias);
		if (!aliasPage) {
			throw new NotFoundException(PAGE_NOT_FOUND);
		}
		return aliasPage;
	} 

	@UseGuards(UseAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto);
	}

	@UseGuards(UseAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletePage = await this.topPageService.deleteById(id);
		if (!deletePage) {
			throw new NotFoundException(PAGE_NOT_FOUND);
		}
	}
	
	@UseGuards(UseAuthGuard)
	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {
		const updatePage = await this.topPageService.updateById(id, dto);
		if (!updatePage) {
			throw new NotFoundException(PAGE_NOT_FOUND);
		}
		return updatePage;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return this.topPageService.findByCategory(dto.firstCategory);
	}

	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string) {
		return this.topPageService.findByText(text);
	}
}
  