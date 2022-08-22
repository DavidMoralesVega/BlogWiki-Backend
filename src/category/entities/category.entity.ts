import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../post/entities/post.entity';

@Entity({ name: 'category' })
export class Category {

    @PrimaryGeneratedColumn('uuid')
    IdCategory: string;
    
    @Column({
        type: 'text',
        nullable: true,
        unique: true
    })
	CDescription: string;

    @Column({
        type: 'text',
    })
	CPhoto?: string;

    @Column({
        type: 'text',
        unique: true
    })
	CSlug: string;
    
    @OneToMany(
        () => Post,
        ( post ) => post.Category,
        { cascade: true, eager: true }
        // { cascade: true }
    )
    Post: Post;

    @BeforeInsert()
    checkSlugInsert() {

        if (!this.CSlug) {
            this.CSlug = this.CDescription;
        }

        this.CSlug = this.CSlug
            .toLowerCase()
            .trim()
            .replaceAll(' ', '-')
            .replaceAll("'", '')

    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.CSlug = this.CSlug
            .toLowerCase()
            .trim()
            .replaceAll(' ', '-')
            .replaceAll("'", '')
    }

}
