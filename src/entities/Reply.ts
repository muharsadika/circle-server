import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Thread } from "./Thread";
import { User } from "./User";

@Entity({ name: "replies" })
export class Reply {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    thread_id: number;
    
    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    content: string;

    @ManyToOne(() => Thread, (thread) => thread.replies, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "thread_id" })
    thread!: Thread

    @ManyToOne(() => User, (user) => user.replies, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user!: User


}