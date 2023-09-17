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
import { LikedEntity } from "./liked.entity";
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

  @Column({ name: "created_at" })
  createdAt: string;

  title: string | undefined;
  // @ManyToOne(() => AuthEntity, (user) => user.likedPosts)
  // @JoinColumn({ name: "liked_users", referencedColumnName: "id" })
  // likedUsers!: AuthEntity[];
  // @OneToMany(() => LikedEntity, (liked) => liked.post)
  // likedUsers!: LikedEntity[];
  @ManyToOne(() => AuthEntity, (user) => user.likedPosts)
  @JoinColumn({ name: "userId" })
  user!: AuthEntity;

  @ManyToMany(() => AuthEntity, (user) => user.likedPosts)
  @JoinTable({
    name: "liked_entity",
    joinColumn: {
      name: "postId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "userId",
      referencedColumnName: "id",
    },
  })
  likedUsers!: AuthEntity[];

  constructor(
    id: number,
    backtrackId: number,
    description: string,
    likesCount: number,
    createdAt: string
  ) {
    this.id = id;
    this.backtrackId = backtrackId;
    this.description = description;
    this.likesCount = likesCount;
    this.createdAt = createdAt;
  }
}
