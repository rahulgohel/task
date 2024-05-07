import { Injectable } from '@nestjs/common';
import { CreateUserDto, verifyUserDto } from '../common/dto/create-user.dto';
import { UpdateUserDto } from '../common/dto/update-user.dto';
import { User } from 'src/common/entities/user.entity';
import { Inject } from '@nestjs/common/decorators';
import { Repository } from 'typeorm/repository/Repository';
import { getCommonResponse, getRandomNumber } from 'src/common/functions';
import { isDefined } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { getUserRegistrationDto } from 'src/common/response-dto/getUserRegistration.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepo: Repository<User>,
    private mailerService: MailerService,
    private jwt: JwtService,
  ) {}

  async createUser(request: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(request.password, salt);

      const existingUser = await this.userRepo.findOne({
        where: { email: request.email },
      });
      if (isDefined(existingUser)) {
        return getCommonResponse(401, 'this user already existing', null);
      } else {
        const otp = getRandomNumber(4);
        const user = new User();
        user.email = request.email;
        user.password = hashedPassword;
        user.otp = otp;
        user.created_at = new Date();
        user.updated_at = new Date();
        user.utctimestamp = new Date().getTime();

        const saveUser = await this.userRepo.save(user);
        if (isDefined(saveUser)) {
          //send otp email start
          const sendEmai = {
            to: request.email,
            from: process.env.GMAILUSER,
            subject: 'Your One-Time Password (OTP) for Account Verification',
            //text: text,
            html: `<p>Thank you for choosing our platform. To ensure the security of your account, we require verification through a one-time password (OTP). Please find your OTP below:<p> 
                             <p>
                             OTP: ${otp}
                             </p>
                             <p>Please enter this OTP on the verification page to complete the process. Please note that this OTP is valid for a limited time period.</p>
                             <p>Best regards,
                             Tech Team </p>
                             `,
          };
          await this.mailerService.sendMail(sendEmai);
          //send otp email end
          //generate token start
          const access_token = await this.signToken(user.user_id, user.email);
          //generate token end
          const data = new getUserRegistrationDto();
          data.email = saveUser.email;
          data.access_token = access_token;

          return getCommonResponse(200, 'success', data);
        } else {
          return getCommonResponse(501, 'SOMTHING WENT WRONG', null);
        }
      }
    } catch (error) {
      console.log({ error });
      return getCommonResponse(501, 'SOMTHING WENT WRONG', '');
    }
  }

  async signToken(userId: any, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = process.env.JWTSECRET;
    const token = await this.jwt.signAsync(payload, {
      //expiresIn: '7d',
      secret: secret,
    });
    //console.log(token, 'Token')
    return token;
  }

  async verifyUser(request: verifyUserDto) {}

  /*   async sendOtp(email: string) {
    try {
      const isExists = await this.userRepo.findOneBy({ email });
      if (isExists) {
        const otp = await getRandomNumber(4);
      } else {
        return getCommonResponse(401, `${email} doesn't exists`, null);
      }
    } catch (error) {
      console.log({ error });
      return getCommonResponse(501, 'SOMTHING WANT WRONG', '');
    }
  } */

  async findAll() {
    try {
      const data = await this.userRepo.find();
      if (isDefined(data)) {
        return getCommonResponse(200, 'success', data);
      } else {
        return getCommonResponse(501, 'SOMTHING WANT WRONG', null);
      }
    } catch (error) {
      console.log({ error });
      return getCommonResponse(501, 'SOMTHING WANT WRONG', '');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
