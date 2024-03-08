import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { FollowSchema } from '../utils/validator/FollowVAlidator';

export default new class FollowService {
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

    async followUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = res.locals.loginSession.user.id; // Pengguna yang melakukan tindakan follow

            const { user_id } = req.body;

            const { error } = FollowSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ code: 400, message: 'Invalid input. Please provide a valid user_id.' });
            }

            const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['following'] });
            const userToFollow = await this.userRepository.findOne({where: { id: user_id }});

            if (!user || !userToFollow) {
                return res.status(404).json({ code: 404, message: 'User not found' });
            }

            // Check if the user is already following the target user
            const isAlreadyFollowing = user.following.some((followedUser) => followedUser.id === user_id);

            if (isAlreadyFollowing) {
                // If already following, unfollow
                user.following = user.following.filter((followedUser) => followedUser.id !== user_id);
            } else {
                // If not following, follow
                user.following.push(userToFollow);
            }

            await this.userRepository.save(user);

            const message = isAlreadyFollowing ? 'User unfollowed successfully' : 'User followed successfully';
            return res.status(200).json({ code: 200, message });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ code: 500, message: error });
        }
    }

    async getFollowingUsers(req: Request, res: Response): Promise<Response> {
        try {
            const userId = res.locals.loginSession.user.id; // ID pengguna yang ingin mendapatkan daftar yang diikuti

            const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['following'] });

            if (!user) {
                return res.status(404).json({ code: 404, message: 'User not found' });
            }

            return res.status(200).json({ code: 200, data: user.following });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ code: 500, message: error });
        }
    }

    async getFollowerUsers(req: Request, res: Response): Promise<Response> {
        try {
            const userId = res.locals.loginSession.user.id; // ID pengguna yang ingin mendapatkan daftar yang diikuti

            const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['followers'] });

            if (!user) {
                return res.status(404).json({ code: 404, message: 'User not found' });
            }

            return res.status(200).json({ code: 200, data: user.followers });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ code: 500, message: error });
        }
    }
}



// // terakhir berhasil
// import { Request, Response } from 'express';
// import { Repository } from 'typeorm';
// import { AppDataSource } from '../data-source';
// import { User } from '../entities/User';

// export default new class FollowService {
//     private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

//     async followUser(req: Request, res: Response): Promise<Response> {
//         try {
//             const userId = res.locals.loginSession.user.id; // Pengguna yang melakukan tindakan follow
//             const userToFollowId = req.body.user_id; // ID pengguna yang ingin diikuti

//             const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['following'] });
//             const userToFollow = await this.userRepository.findOne({ where: { id: userToFollowId } });

//             if (!user || !userToFollow) {
//                 return res.status(404).json({ code: 404, message: 'User not found' });
//             }

//             // Check if the user is already following the target user
//             const isAlreadyFollowing = user.following.some((followedUser) => followedUser.id === userToFollowId);

//             if (isAlreadyFollowing) {
//                 // If already following, unfollow
//                 user.following = user.following.filter((followedUser) => followedUser.id !== userToFollowId);
//             } else {
//                 // If not following, follow
//                 user.following.push(userToFollow);
//             }

//             await this.userRepository.save(user);

//             const message = isAlreadyFollowing ? 'User unfollowed successfully' : 'User followed successfully';
//             return res.status(200).json({ code: 200, message });
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({ code: 500, message: error });
//         }
//     }

//     async getFollowingUsers(req: Request, res: Response): Promise<Response> {
//         try {
//             const userId = res.locals.loginSession.user.id; // ID pengguna yang ingin mendapatkan daftar yang diikuti

//             const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['following'] });

//             if (!user) {
//                 return res.status(404).json({ code: 404, message: 'User not found' });
//             }

//             return res.status(200).json({ code: 200, data: user.following });
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({ code: 500, message: error });
//         }
//     }
// }



// // terakhir andry
// import { Request, Response } from 'express';
// import { Repository } from 'typeorm';
// import { AppDataSource } from '../data-source';
// import { User } from '../entities/User';

// export default new class FollowService {
//     private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

//     async followUser(req: Request, res: Response): Promise<Response> {
//         try {
//             const userId = res.locals.loginSession.user.id; // Pengguna yang melakukan tindakan follow
//             const userToFollowId = Number(req.body.user_id); // ID pengguna yang ingin diikuti

//             const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['users'] });
//             const userToFollow = await this.userRepository.findOne({ where: { id: userToFollowId } });

//             if (!user || !userToFollow) {
//                 return res.status(404).json({ code: 404, message: 'User not found' });
//             }

//             // Check if the user is already following the target user
//             const isAlreadyFollowing = user.users.some((followedUser) => followedUser.id === userToFollowId);

//             if (isAlreadyFollowing) {
//                 // If already following, unfollow
//                 user.users = user.users.filter((followedUser) => followedUser.id !== userToFollowId);
//             } else {
//                 // If not following, follow
//                 user.users.push(userToFollow);
//             }

//             await this.userRepository.save(user);

//             const message = isAlreadyFollowing ? 'User unfollowed successfully' : 'User followed successfully';
//             return res.status(200).json({ code: 200, message });
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({ code: 500, message: error });
//         }
//     }

//     async getFollowingUsers(req: Request, res: Response): Promise<Response> {
//         try {
//             const userId = res.locals.loginSession.user.id; // ID pengguna yang ingin mendapatkan daftar yang diikuti

//             const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['users.following_id'] });

//             if (!user) {
//                 return res.status(404).json({ code: 404, message: 'User not found' });
//             }

//             return res.status(200).json({ code: 200, data: user.users });
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({ code: 500, message: error });
//         }
//     }
// };



// // pake ini
// import { Request, Response } from 'express';
// import { Repository } from 'typeorm';
// import { AppDataSource } from '../data-source';

// import { User } from '../entities/User';

// export default new class FollowService {
//     private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

//     async followUser(req: Request, res: Response): Promise<Response> {
//         try {
//             const userId = res.locals.loginSession.user.id; // Pengguna yang melakukan tindakan follow
//             const userToFollowId = Number(req.params.id); // ID pengguna yang ingin diikuti

//             const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['users'] }); // Cari pengguna berdasarkan IDuserId, relations: ['users'] });
//             const userToFollow = await this.userRepository.findOne({ where: { id: userToFollowId } });


//             if (!user || !userToFollow) {
//                 return res.status(404).json({ code: 404, message: 'User not found' });
//             }
//             // Check if the user is already following the target user
//             const isAlreadyFollowing = user.users.some((followedUser) => followedUser.id === userToFollowId);

//             if (!isAlreadyFollowing) {
//                 user.users.push(userToFollow);
//                 await this.userRepository.save(user);
//             }
//             return res.status(200).json({ code: 200, message: 'User followed successfully' });
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({ code: 500, message: error });
//         }
//     }

//     async unfollowUser(req: Request, res: Response): Promise<Response> {
//         try {
//             const userId = res.locals.loginSession.user.id; // Pengguna yang melakukan tindakan unfollow
//             const userToUnfollowId = Number(req.params.id); // ID pengguna yang ingin dihentikan mengikuti

//             const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['users'] });

//             if (!user) {
//                 return res.status(404).json({ code: 404, message: 'User not found' });
//             }

//             // Remove the user to unfollow from the list of followed users
//             user.users = user.users.filter((followedUser) => followedUser.id !== userToUnfollowId);

//             await this.userRepository.save(user);

//             return res.status(200).json({ code: 200, message: 'User unfollowed successfully' });
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({ code: 500, message: error });
//         }
//     }

//     async getFollowingUsers(req: Request, res: Response): Promise<Response> {
//         try {
//             const userId = res.locals.loginSession.user.id; // ID pengguna yang ingin mendapatkan daftar yang diikuti

//             const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['users'] });

//             if (!user) {
//                 return res.status(404).json({ code: 404, message: 'User not found' });
//             }

//             return res.status(200).json({ code: 200, data: user.users });
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({ code: 500, message: error });
//         }
//     }
// };







// import { getRepository } from 'typeorm';
// import { User } from '../entities/User';

// class FollowService {
//     private userRepository = getRepository(User);

//     async followUser(userId: number, userToFollowId: number): Promise<void> {
//         const user = await this.userRepository.findOne(userId);
//         const userToFollow = await this.userRepository.findOne(userToFollowId);

//         if (!user || !userToFollow) {
//             throw new Error('User not found');
//         }

//         // Check if the user is already following the target user
//         const isAlreadyFollowing = user.users.some((followedUser) => followedUser.id === userToFollowId);

//         if (!isAlreadyFollowing) {
//             user.users.push(userToFollow);
//             await this.userRepository.save(user);
//         }
//     }

//     async unfollowUser(userId: number, userToUnfollowId: number): Promise<void> {
//         const user = await this.userRepository.findOne(userId);

//         if (!user) {
//             throw new Error('User not found');
//         }

//         user.users = user.users.filter((followedUser) => followedUser.id !== userToUnfollowId);

//         await this.userRepository.save(user);
//     }

//     async getFollowingUsers(userId: number): Promise<User[]> {
//         const user = await this.userRepository.findOne(userId, { relations: ['users'] });

//         if (!user) {
//             throw new Error('User not found');
//         }

//         return user.users;
//     }
// }

// export default FollowService;
