import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Token } from '../../auth/entities/token.entity';
import { Profile } from './profile.entity';
import { WebsocketId } from './websocketId.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email' })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  isVerifiedEmail: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column({ default: false })
  isGoogleAuthorization: boolean;

  @OneToMany(() => Token, (Token) => Token.token)
  token: Token;

  @OneToOne(() => Profile, (Profile) => Profile.id)
  profile: Profile;

  @OneToMany(() => WebsocketId, (WebsocketId) => WebsocketId.id)
  websocketId: WebsocketId;

}
