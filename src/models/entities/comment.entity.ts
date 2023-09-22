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
@Entity({ name: "comment" })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: "post_id" })
  postId: number;
  @Column()
  username: string;

  @Column()
  comment: string;

  @Column({ name: "created_at" })
  createdAt: string;

  @Column({ name: "updated_at" })
  updatedAt: string;

  title: string | undefined;
  author: string | undefined;

  @ManyToOne(() => AuthEntity, (user) => user.comment)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  nickname!: AuthEntity;

  constructor(
    id: number,
    username: string,
    postId: number,
    comment: string,
    createdAt: string,
    updatedAt: string
  ) {
    this.id = id;
    this.username = username;
    this.postId = postId;
    this.comment = comment;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
