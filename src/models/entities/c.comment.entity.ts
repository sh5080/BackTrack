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
@Entity({ name: "community_comment" })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: "user_id" })
  userId: number;
  @Column({ name: "community_id" })
  communityId: string;

  @Column()
  comment: string;

  @Column({ name: "created_at" })
  createdAt: string;

  // @ManyToOne(() => AuthEntity, (user) => user.comment)
  // @JoinColumn({ name: "username", referencedColumnName: "username" })
  // nickname!: AuthEntity;

  constructor(
    id: number,
    communityId: string,
    userId: number,
    comment: string,
    createdAt: string
  ) {
    this.id = id;
    this.communityId = communityId;
    this.userId = userId;
    this.comment = comment;
    this.createdAt = createdAt;
  }
}
