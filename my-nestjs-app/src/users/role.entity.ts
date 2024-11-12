// src/users/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('Role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; 

  @OneToMany(() => User, (user) => user.role)
  users: User[]; }