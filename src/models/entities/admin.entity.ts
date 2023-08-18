import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "name" })
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  constructor(id: number, name: string, image: string) {
    this.id = id;
    this.name = name;
    this.image = image;
  }
}
