import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "user" })
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
  @Column({ nullable: true })
  nickname?: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string = "";

  @Column({ default: "ORIGIN" })
  oauth_provider: string;

  @Column({ default: "USER" })
  role?: string;

  @Column({ nullable: true })
  access_token?: string;

  @Column({ default: 1 })
  activated?: number;

  constructor(
    id: number,
    username: string,
    password: string,
    email: string,
    oauth_provider: string
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.oauth_provider = oauth_provider;
  }
}
