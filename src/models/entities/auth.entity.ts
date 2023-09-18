import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { PostEntity } from "./post.entity";

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

  @Column({ name: "liked_posts", nullable: true, type: "json" })
  likedPosts: number[];

  @ManyToMany(() => PostEntity, (post) => post.likedUsers)
  @JoinTable({
    // name: "liked",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "post_id", referencedColumnName: "id" },
  })
  likedUsers!: PostEntity[];

  constructor(
    id: number,
    username: string,
    nickname: string,
    password: string,
    email: string,
    oauth_provider: string,
    likedPosts: number[]
  ) {
    this.id = id;
    this.username = username;
    this.nickname = nickname;
    this.password = password;
    this.email = email;
    this.oauth_provider = oauth_provider;
    this.likedPosts = likedPosts;
  }
}
