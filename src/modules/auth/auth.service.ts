import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...result } = user.toObject();
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async register(userData: { email: string; password: string; username: string }) {
    try {
      // Check if user exists
      const existingUser = await this.userModel.findOne({
        $or: [
          { email: userData.email },
          { username: userData.username }
        ]
      });

      if (existingUser) {
        if (existingUser.email === userData.email) {
          throw new ConflictException('Email already exists');
        }
        if (existingUser.username === userData.username) {
          throw new ConflictException('Username already exists');
        }
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = new this.userModel({
        ...userData,
        password: hashedPassword,
      });
      
      const savedUser = await newUser.save();
      const { password, ...result } = savedUser.toObject();
      return result;
    } catch (error) {
      if (error.code === 11000) {
        if (error.keyPattern.email) {
          throw new ConflictException('Email already exists');
        }
        if (error.keyPattern.username) {
          throw new ConflictException('Username already exists');
        }
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async googleLogin(profile: any) {
    let user = await this.userModel.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await this.userModel.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
      });
    }

    return this.login(user);
  }
}