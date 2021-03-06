import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Token } from './token.entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => Token, (Token) => Token.token)
  token: Token;
}
