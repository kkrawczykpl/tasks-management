import { IsNotEmpty, IsEmail, MinLength, IsString, Matches, MaxLength } from "class-validator";

export class AuthCredentialsDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(100)
    @Matches(
        /^(?=.*([A-Z]){1,})(?=.*[()%=+!@#$&*]{1,})(?=.*[0-9]{1,})(?=.*[a-z]{1,}).{6,100}$/,
        { message: 'Password isn\'t strong enought. Make sure your password contains special character, uppercase and lowercase letters.'}
    )
    password: string;
}