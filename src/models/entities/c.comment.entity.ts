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
export class communityCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: "user_id" })
  userId: number;
  @Column({ name: "community_id" })
  communityId: number;

  @Column()
  comment: string;

  @Column({ name: "created_at" })
  createdAt: string;

  @ManyToOne(() => AuthEntity, (user) => user.communityComment)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  nickname!: AuthEntity;

  constructor(
    id: number,
    communityId: number,
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
