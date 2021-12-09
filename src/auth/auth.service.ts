import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';
import { genSalt, hash, compare } from 'bcryptjs';
import { INCORRECT_PASSWORD, USER_NOT_FOUND } from './constans.auth';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
	private readonly JWTService: JwtService) {}

	async createUSer(dto: AuthDto) {
		const salt = await genSalt(10);
		const newUser = new this.userModel({
			email: dto.login,
			passwordHash: await hash(dto.password, salt)
		});
		return newUser.save();
	}

	async findUser(email: string) {
		return this.userModel.findOne({email}).exec();
	}

	async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
		const user = await this.findUser(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND);
		}

		const ifIncorrectPassword = await compare(password, user.passwordHash); 
		if(!ifIncorrectPassword) {
			throw new UnauthorizedException(INCORRECT_PASSWORD);
		}
		return {email: user.email};
	}

	async login(email: string) {
		const payload = {email};
		return {
			access_token: await this.JWTService.signAsync(payload)
		}; 
	}
}