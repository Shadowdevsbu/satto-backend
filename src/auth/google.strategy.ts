import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback, StrategyOptions } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy  extends PassportStrategy(Strategy, 'google'){
    constructor(private authService: AuthService){
super({
 clientID: process.env.GOOGLE_CLIENT_ID,
 clientSecret: process.env.GOOGLE_SECRET,
 callbackURL: process.env.GOOGLE_CALLBACK_URL,
 scope: ['email', 'profile'],
} as StrategyOptions)
    }

validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
){
 const user = this.authService.validateGoogleUser(profile) 

 done(null, user)
}
}