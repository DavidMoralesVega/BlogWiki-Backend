import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post/entities/post.entity';


@Entity('user')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    IdUser: string;

    @Column('text', {
        unique: true
    })
    UEmail: string;

    @Column('text', {
        select: false
    })
    UPassword: string;

    @Column('text')
    UFullName: string;

    @Column('bool', {
        default: true
    })
    UIsActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    URoles: string[];

    @OneToMany(
        () => Post,
        ( post ) => post.User,
        { cascade: true, eager: true }
    )
    Post: Post;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.UEmail = this.UEmail.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }

}
