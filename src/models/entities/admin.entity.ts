import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "admin" })
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;

  constructor(id: number, description: string, imgNames: string) {
    this.id = id;
    this.description = description;
    this.image = imgNames;
  }
}
