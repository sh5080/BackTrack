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
import { BacktrackEntity } from "./backtrack.entity";
@Entity({ name: "post" })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "backtrack_id" })
  backtrackId: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ name: "liked_users", nullable: true, type: "json" })
  likedUsers: number[];

  @Column({ name: "created_at" })
  createdAt: string;

  title: string | undefined;
  author: string | undefined;

  @ManyToMany(() => AuthEntity, (user) => user.likedUsers)
  likedPosts!: AuthEntity[];

  @ManyToOne(() => BacktrackEntity, (backtrack) => backtrack.posts)
  @JoinColumn({ name: "backtrack_id", referencedColumnName: "id" })
  backtrack!: BacktrackEntity;

  constructor(
    id: number,
    backtrackId: number,
    description: string,
    image: string,
    createdAt: string,
    likedUsers: number[]
  ) {
    this.id = id;
    this.backtrackId = backtrackId;
    this.description = description;
    this.image = image;
    this.createdAt = createdAt;
    this.likedUsers = likedUsers;
  }
}
