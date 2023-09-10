import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

  constructor(
    id: number,
    username: string,
    title: string,
    backtrack: string[][][]
  ) {
    this.id = id;
    this.username = username;
    this.title = title;
    this.backtrack = backtrack;
  }
}
