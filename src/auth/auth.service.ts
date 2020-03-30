import { Injectable, Body, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return await this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const credentials = await this.userRepository.validatePassword(authCredentialsDto);
        if(!credentials) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const [email, name ] = credentials;

        const payload: JwtPayload = { email, name };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }

}
