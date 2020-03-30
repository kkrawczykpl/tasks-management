import { EntityRepository, Repository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { name, email, password } = authCredentialsDto;
        
        const user = new User();
        user.name = name;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try{    
            await user.save();
        } catch(error) {
            if(error.code == "23505") { //duplicate username
                throw new ConflictException('Username already exits.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validatePassword(authCredentialsDto: AuthCredentialsDto): Promise<string[]> {
        const { email, password } = authCredentialsDto;
        if (!email || !password) { return null };

        const user = await this.findOne({ email });

        if(user && await user.validatePassword(password)) {
            return [user.email, user.name];
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}