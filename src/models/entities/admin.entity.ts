import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "category" })
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  constructor(id: number, description: string) {
    this.id = id;
    this.description = description;
  }
}
