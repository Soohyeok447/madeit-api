import { AddPostResponseDto } from './add-post/dtos/AddPostResponseDto';
import { GetPostResponseDto } from './get-post/dtos/GetPostResponseDto';
import { GetPostsResponseDto } from './get-posts/dtos/GetPostsResponseDto';
import { ModifyPostResponseDto } from './modify-post/dtos/ModifyPostResponseDto';

export type AddPostResponse = Promise<AddPostResponseDto>;

export type ModifyPostResponse = Promise<ModifyPostResponseDto>;

export type GetPostResponse = Promise<GetPostResponseDto>;

export type GetPostsResponse = Promise<GetPostsResponseDto[]>;

export type DeletePostResponse = Promise<Record<string, never>>;

export type PutCardnewsResponse = Promise<Record<string, never>>;
