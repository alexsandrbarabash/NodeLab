import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Token } from './token.entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @OneToOne(() => Token, (Token) => Token.token)
  token: Token;
}
