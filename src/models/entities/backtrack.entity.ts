import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "backtrack" })
export class BacktrackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column("json", { array: true })
  backtrack: string[][][];

  constructor(id: number, username: string, backtrack: string[][][]) {
    this.id = id;
    this.username = username;
    this.backtrack = backtrack;
  }
}
