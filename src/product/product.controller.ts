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
import { PRODUCT_NOT_FOUND } from './constans.product';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UseGuards(UseAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const product = await this.productService.findById(id);
		if (!product) {
			throw new NotFoundException(PRODUCT_NOT_FOUND);
		}
		return product;
	}

	@UseGuards(UseAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateProductDto) {
			return this.productService.create(dto);
	}

	@UseGuards(UseAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deleteProduct = await this.productService.deleteById(id);
		if (!deleteProduct) {
			throw new NotFoundException(PRODUCT_NOT_FOUND);
		}
		return deleteProduct;
	}

	@UseGuards(UseAuthGuard)
	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: ProductModel) {
		const updateProduct = await this.productService.updateById(id, dto);    
		if (!updateProduct) {
			throw new NotFoundException(PRODUCT_NOT_FOUND);
		}
		return updateProduct;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindProductDto) {
		return this.productService.findWithReviews(dto);
	}
}
