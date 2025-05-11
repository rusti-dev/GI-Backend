import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { DataSource } from 'typeorm';
import { RoleService } from './role.service';
import { ConfigService } from '@nestjs/config';
import { userToken } from '../utils/user-token.utils';
import { IPayload } from '../interfaces/payload.interface';
import { SectorsService } from '@/sectors/sectors.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/services/users.service';
import { IUserToken } from '../interfaces/userToken.interface';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { HttpCustomService } from '@/providers/http/http.service';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { IGenerateToken } from '../interfaces/generate-token.interface';
import { CreateUserDto, RegisterUserDto } from '../dto/create-user.dto';
import { RealStateService } from '@/realstate/services/realstate.service';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PermissionService } from './permission.service';



@Injectable()
export class AuthService {
    private readonly logger = new Logger('AuthService');

    constructor(
        private readonly userService: UserService,
        private readonly realStateService: RealStateService,
        private readonly sectorService: SectorsService,
        private readonly permissionService: PermissionService,
        private readonly dataSources: DataSource,
        private readonly configService: ConfigService,
        private readonly roleService: RoleService,
        private readonly httpService: HttpCustomService,
    ) { }

    public async login(email: string, password: string): Promise<any> {
        try {
            const user = await this.userService.findOneBy({
                key: 'email',
                value: email,
            });
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!user || !isPasswordValid || !user.isActive)
                throw new NotFoundException('Usuario o contraseña incorrectos');
            return this.generateJWT(user);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async checkToken(token: string): Promise<UserEntity> {
        try {
            const managerToken: IUserToken | string = userToken(token);
            if (typeof managerToken === 'string')
                throw new NotFoundException('Token invalido');
            if (managerToken.isExpired) throw new NotFoundException('Token expirado');
            const user = await this.userService.findOneAuth(managerToken.sub);
            return user;
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public async generateJWT(user: UserEntity): Promise<any> {
        const userLogged: UserEntity = await this.userService.findOne(user.id);
        const payload: IPayload = {
            sub: userLogged.id,
            role: userLogged.role.id,
            type: 'user',
        };
        const accessToken = this.singJWT({
            payload,
            secret: this.configService.get('JWT_AUTH'),
            expiresIn: 28800,
        });
        return {
            accessToken,
            User: userLogged,
        };
    }

    

    public async googleLogin(token: string): Promise<any> {
        try {
            const googleApiUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
            const googleData = await this.httpService.apiCheckTokenGoogle(googleApiUrl);

            const { email } = googleData;
            const user = await this.userService.findOneBy({ key: 'email', value: email });

            if (!user || !user.isActive) {
                throw new NotFoundException('Usuario no encontrado o inactivo.');
            }

            return this.generateJWT(user);
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    public singJWT({ payload, secret, expiresIn }: IGenerateToken) {
        const options: jwt.SignOptions = { expiresIn: expiresIn as any };  // Fuerza a un tipo compatible
        return jwt.sign(payload, secret, options);
    }

    public async register(registerDto: RegisterUserDto): Promise<any> {
        try {
            const { nameRealState, ...res } = registerDto;
            const queryRunner = this.dataSources.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                let roleId: string;
                const findRole = await this.roleService.findOneBy({
                    key: 'name',
                    value: 'basic',
                });
                console.log('findRole', findRole);
                if (!findRole) {
                    const permissionSupcription = await this.permissionService.findOneByName("Suscripcion");
                    const role = await this.roleService.create({
                        name: 'basic',
                        permissions: [permissionSupcription.id],        
                    });
                    roleId = role.id;
                } else {
                    roleId = findRole.id;
                }
                const newRealState = await this.realStateService.create({
                    name: nameRealState,
                    address: '',
                    email: res.email,
                });
                const newSector = await this.sectorService.create({
                    name: nameRealState,
                    adress: '',
                    phone: '',
                    realStateId: newRealState.data.id,
                });
                const requestUser: CreateUserDto = {
                    ...res,
                    role: roleId,
                    sector: newSector.id,
                };
                const user = await this.userService.create(requestUser);

                await queryRunner.manager.save(newRealState.data)
                await queryRunner.manager.save(newSector)
                await queryRunner.manager.save(user);
                await queryRunner.commitTransaction();
                return this.generateJWT(user);
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw new InternalServerErrorException(error.message);
            } finally {
                await queryRunner.release();
            }
        } catch (error) {
            handlerError(error, this.logger);
        }
    }
}
