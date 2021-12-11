import { IsString } from 'class-validator';

export class FileElementResponse {

	@IsString()
	url: string;

	@IsString()
	name: string;
}