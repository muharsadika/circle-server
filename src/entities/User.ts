import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Thread } from "./Thread";
import { Reply } from "./Reply";
import { Like } from "./Like";
// import { Follow } from "./Follow";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    profile_picture: string;

    @Column({ nullable: true })
    bio: string;

    @OneToMany(() => Thread, (thread) => thread.user, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    threads!: Thread[]

    @OneToMany(() => Reply, (reply) => reply.user, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    replies!: Reply[]

    @OneToMany(() => Like, (like) => like.user, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    likes!: Like[]

    // @OneToMany(() => Follow, (follow) => follow.userIng, {
    //     onUpdate: "CASCADE",
    //     onDelete: "CASCADE"
    // })
    // following: Follow[]

    // @OneToMany(() => Follow, (follow) => follow.userEr, {
    //     onUpdate: "CASCADE",
    //     onDelete: "CASCADE"
    // })
    // follower: Follow[]

    // @ManyToMany(() => User, (user) => user.users)
    // @JoinTable({
    //     name: "following",
    //     joinColumn: {
    //         name: "following_id",
    //         referencedColumnName: "id",
    //     },
    //     inverseJoinColumn: {
    //         name: "follower_id",
    //         referencedColumnName: "id",
    //     },
    // })
    // users!: User[];

    @ManyToMany(() => User, (user) => user.following)
    @JoinTable({
        name: "follow",
        joinColumn: {
            name: "follower_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "following_id",
            referencedColumnName: "id",
        },
    })
    followers: User[];

    @ManyToMany(() => User, (user) => user.followers)
    following: User[];
}