import { Strategy, Extractjwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { jwtConstants } from "src/constant";

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: Extractjwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConstants.secret
        })
    }
   async validate (payload: any){
    return({userId: payload.sub})
   }
}