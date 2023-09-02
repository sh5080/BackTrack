import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "category" })
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  images: string;

  constructor(id: number, description: string, images: string) {
    this.id = id;
    this.description = description;
    this.images = images;
  }
}
