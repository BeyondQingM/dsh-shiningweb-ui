export interface FriendComment {
    id: string;
    author: string;
    content: string;
    createdAt: number;
}
export interface FriendPost {
    id: string;
    personaId: string;
    content: string;
    createdAt: number;
    likes: string[];
    comments: FriendComment[];
}
/** 发布一条动态。 */
export declare function addPost(personaId: string, content: string): Promise<void>;
/** 列出某角色的全部动态（倒序）。 */
export declare function listPosts(personaId: string): Promise<FriendPost[]>;
/** 点赞/取消点赞（toggle）。 */
export declare function toggleLike(postId: string, liker: string): Promise<void>;
/** 添加评论。 */
export declare function addComment(postId: string, author: string, content: string): Promise<void>;
