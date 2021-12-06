import { AuthGuard } from '@nestjs/passport';


export class UseAuthGuard extends AuthGuard('jwt') {}