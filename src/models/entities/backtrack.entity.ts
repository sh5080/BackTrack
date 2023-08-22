import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "backtrack" })
export class BacktrackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  chords: string;

  constructor(id: number, name: string, chords: string) {
    this.id = id;
    this.name = name;
    this.chords = chords;
  }
}
