import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../../auth/entities/user.entity';
import { Category } from '../../category/entities/category.entity';

@Entity({ name: 'post' })

export class Post {

    @PrimaryGeneratedColumn('uuid')
    IdPost: string;

    @Column({
        type: 'text',
        nullable: true,
        unique: true
    })
    PTitle: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    PSummary: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    PDescription: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    PPlace: string;

    @Column({
        type: 'text',
    })
    PPhoto?: string;

    @Column({
        type: 'text',
    })
    PRegisterDateTime: string;

    @Column('text', {
        unique: true
    })
    PSlug: string;

    @ManyToOne(
        () => User,
        (user) => user.Post,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'IdUser' })
    User: User;

    @ManyToOne(
        () => Category,
        (category) => category.Post,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'IdCategory' })
    Category: Category;

    @BeforeInsert()
    checkSlugInsert() {

        if (!this.PSlug) {
            this.PSlug = this.PTitle;
        }

        this.PSlug = this.PSlug
            .toLowerCase()
            .trim()
            .replaceAll(' ', '-')
            .replaceAll("'", '')

    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.PSlug = this.PSlug
            .toLowerCase()
            .trim()
            .replaceAll(' ', '-')
            .replaceAll("'", '')
    }

}


