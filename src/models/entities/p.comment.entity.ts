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
@Entity({ name: "post_comment" })
export class postCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: "post_id" })
  postId: number;
  @Column({ name: "user_id" })
  userId: number;

  @Column()
  comment: string;

  @Column({ name: "created_at" })
  createdAt: string;

  @Column({ name: "updated_at" })
  updatedAt: string;

  title: string | undefined;
  author: string | undefined;

  @ManyToOne(() => AuthEntity, (user) => user.postComment)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  nickname!: AuthEntity;

  constructor(
    id: number,
    userId: number,
    postId: number,
    comment: string,
    createdAt: string,
    updatedAt: string
  ) {
    this.id = id;
    this.userId = userId;
    this.postId = postId;
    this.comment = comment;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
