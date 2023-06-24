import { Post } from "../entities/post.entity";

export interface IAppState {
    progress: string;
    loadedPost: Post | null;
    savedPost: boolean
}