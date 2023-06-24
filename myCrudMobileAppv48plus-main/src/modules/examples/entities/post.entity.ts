import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne} from "typeorm/browser";
import {Category} from "./category.entity";
import {Author} from "./author.entity"

@Entity('post')
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column("text")
    text!: string;

    @ManyToMany(() => Category, {
      cascade: ['insert']
    })
    @JoinTable()
    categories!: Category[];

    @ManyToOne(() => Author, {
      cascade: ['insert']
    })
    author!: Author;
}
