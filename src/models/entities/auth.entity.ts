import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "user" })
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string = "";

  @Column({ default: "ORIGIN" })
  oauth_provide: string;

  @Column({ nullable: true })
  role?: string;

  @Column({ nullable: true })
  accessToken?: string;

  @Column({ default: 1 })
  activated?: number;

  constructor(
    id: number,
    username: string,
    password: string,
    email: string,
    oauth_provide: string
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.oauth_provide = oauth_provide;
  }
}
