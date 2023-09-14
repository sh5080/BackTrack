import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
