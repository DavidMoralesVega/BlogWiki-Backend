import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
        nullable: true,
    })
	CPhoto: string;

}
