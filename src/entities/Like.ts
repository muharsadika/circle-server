import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { User } from "./User"
import { Reply } from "./Reply"
import { Thread } from "./Thread"

@Entity({ name: "likes" })
export class Like {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.likes, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "user_id" })
    user!: User
    
    @ManyToOne(() => Thread, (thread) => thread.likes, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "thread_id" })
    thread!: Thread

    // @OneToMany(() => Reply, (reply) => reply.thread, {
    //     onUpdate: "CASCADE",
    //     onDelete: "CASCADE"
    // })
    // replies: Reply[]

}
