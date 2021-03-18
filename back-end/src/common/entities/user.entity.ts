import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Token } from '../../auth/entities/token.entity';
import { Post } from '../../feed/entities/post.entity';

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

  @Column({ default: false })
  isGoogleAuthorization: boolean;

  @OneToMany(() => Token, (Token) => Token.token)
  token: Token;

  @OneToMany(() => Post, (Post) => Post.id)
  post: Post;
}
