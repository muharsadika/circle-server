import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { User } from "./User"
import { Reply } from "./Reply"
import { Like } from "./Like"

@Entity({ name: "threads" })
export class Thread {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    content: string

    @Column({ nullable: true })
    image: string

    @ManyToOne(() => User, (user) => user.threads, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user!: User

    @OneToMany(() => Reply, (reply) => reply.thread, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    replies!: Reply[]

    @OneToMany(() => Like, (like) => like.thread, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    likes!: Like[]
}
