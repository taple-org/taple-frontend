import {build, get} from "~/repositories/repository.helpers";

type Post = {
    id: string;
    title: string;
}
export function buildPostsRepository(fetcher: typeof $fetch) {
    return build(fetcher, {
        get: get<Post[]>("/posts"),
    })
}