import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "liked_posts" })
export class LikedPostsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "post_id" })
  postId: number;

  constructor(id: number, userId: number, postId: number) {
    this.id = id;
    this.userId = userId;
    this.postId = postId;
  }
}
