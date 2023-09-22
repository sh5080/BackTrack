import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PostEntity } from "./post.entity";
@Entity({ name: "backtrack" })
export class BacktrackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  title: string;

  @Column("json", { array: true })
  backtrack: string[][][];

  @Column({ name: "created_at" })
  createdAt: string;

  @OneToMany(() => PostEntity, (post) => post.backtrack)
  posts!: PostEntity[];

  constructor(
    id: number,
    username: string,
    title: string,
    backtrack: string[][][],
    createdAt: string
  ) {
    this.id = id;
    this.username = username;
    this.title = title;
    this.backtrack = backtrack;
    this.createdAt = createdAt;
  }
}
