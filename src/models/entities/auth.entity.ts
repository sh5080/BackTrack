import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { PostEntity } from "./post.entity";
import { LikedEntity } from "./liked.entity";

@Entity({ name: "user" })
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string = "";

  @Column({ default: "ORIGIN" })
  oauth_provider: string;

  @Column({ default: "USER" })
  role?: string;

  @Column({ default: 1 })
  activated?: number;

  // @OneToMany(() => PostEntity, (post) => post.likedUsers)
  // @ManyToMany(() => PostEntity, (post) => post.likedUsers)
  // @ManyToMany(() => PostEntity)
  // @JoinTable()
  // @OneToMany(() => LikedEntity, (liked) => liked.user)
  // likedPosts!: LikedEntity[];
  @OneToMany(() => PostEntity, (post) => post.user)
  likedPosts!: PostEntity[];

  constructor(
    id: number,
    username: string,
    nickname: string,
    password: string,
    email: string,
    oauth_provider: string
  ) {
    this.id = id;
    this.username = username;
    this.nickname = nickname;
    this.password = password;
    this.email = email;
    this.oauth_provider = oauth_provider;
  }
}
