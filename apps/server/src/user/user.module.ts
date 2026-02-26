import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserAddress } from './entities/user-address.entity';
import { UserPasswordHistory } from './entities/user-password-history.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserAddress, UserPasswordHistory])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, TypeOrmModule],
})
export class UserModule { }
