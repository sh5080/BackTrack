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
@Entity({ name: "community" })
export class CommunityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;

  author: string | undefined;

  constructor(
    id: number,
    username: string,
    title: string,
    description: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.username = username;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
