import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

    @OneToMany(
        () => Post,
        ( post ) => post.Category,
        { cascade: true, eager: true }
    )
    Post: Post;

}
