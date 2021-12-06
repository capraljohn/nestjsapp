import { BadRequestException, Body, Controller, HttpCode, HttpException, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { USER_IS_EXIST } from './constans.auth';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const oldUser = await this.authService.findUser(dto.login);
		if (oldUser) {
			throw new BadRequestException(USER_IS_EXIST);
		}
		return this.authService.createUSer(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() {login, password}: AuthDto) {
		const user = await this.authService.validateUser(login, password);
		return this.authService.login(user.email);
	}
}
