import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "category" })
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
