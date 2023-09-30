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
import { postCommentEntity } from "./p.comment.entity";
import { communityCommentEntity } from "./c.comment.entity";
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

  @Column({ name: "total_likes", nullable: true })
  totalLikes: number;

  @ManyToMany(() => PostEntity, (post) => post.likedUsers)
  @JoinTable()
  likedUsers!: PostEntity[];

  @OneToMany(() => postCommentEntity, (comment) => comment.nickname)
  postComment!: postCommentEntity[];

  @OneToMany(() => communityCommentEntity, (comment) => comment.nickname)
  communityComment!: communityCommentEntity[];

  constructor(
    id: number,
    username: string,
    nickname: string,
    password: string,
    email: string,
    oauth_provider: string,
    likedPosts: number[],
    totalLikes: number
  ) {
    this.id = id;
    this.username = username;
    this.nickname = nickname;
    this.password = password;
    this.email = email;
    this.oauth_provider = oauth_provider;
    this.likedPosts = likedPosts;
    this.totalLikes = totalLikes;
  }
}
