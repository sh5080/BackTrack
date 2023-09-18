import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { AuthEntity } from "./auth.entity";
@Entity({ name: "post" })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "backtrack_id" })
  backtrackId: number;

  @Column()
  description: string;

  @Column({ name: "likes_count", nullable: true })
  likesCount: number;

  @Column({ name: "liked_users", nullable: true, type: "json" })
  likedUsers: number[];

  @Column({ name: "created_at" })
  createdAt: string;

  title: string | undefined;

  @ManyToMany(() => AuthEntity, (user) => user.likedUsers)
  // @JoinTable({
  //   // name: "post_liked_posts_user",
  //   name: "user_liked_users_post",
  //   joinColumn: { name: "post_id", referencedColumnName: "id" },
  //   inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
  // })
  likedPosts!: AuthEntity[];

  constructor(
    id: number,
    backtrackId: number,
    description: string,
    likesCount: number,
    createdAt: string,
    likedUsers: number[]
  ) {
    this.id = id;
    this.backtrackId = backtrackId;
    this.description = description;
    this.likesCount = likesCount;
    this.createdAt = createdAt;
    this.likedUsers = likedUsers;
  }
}
