import { Entity, OneToMany, OneToOne } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../../../common/entities/base.entity';
import { ROLES } from '../../../common/constants';
import { IUser } from '../interfaces/user.interface';
import { TiendaEntity } from '../../tienda/entities/tienda.entity';
import { TiendaFavoritoEntity } from '../../tienda/entities/tienda_favorito.entity';
import { TiendaComentarioEntity } from '../../tienda/entities/tienda_comentario.entity';
import { GENEROS } from 'src/common/constants/configuracion';

@Entity({ name: 'user' })
export class UsersEntity extends BaseEntity implements IUser {
  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  apellido: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: ROLES, nullable: false })
  role: ROLES;

  @Column({ type: 'enum', enum: GENEROS, nullable: true })
  genero: GENEROS;

  // @Column({ type: 'enum', enum: NOTIFICACIONES, array: true, default: [] })
  // config_notificacion: NOTIFICACIONES[];

  @Column({ type: 'bool', default: false })
  esta_suspendido: boolean;

  // relations
  @OneToOne(() => TiendaEntity, (tienda) => tienda.encargado)
  tienda: TiendaEntity;

  @OneToMany(() => TiendaFavoritoEntity, (tienda) => tienda.usuario)
  tiendasFavoritas: TiendaFavoritoEntity[];

  @OneToMany(() => TiendaComentarioEntity, (tienda) => tienda.usuario)
  tiendaComentarios: TiendaComentarioEntity[];
}
