import { buildAuthRepository } from "~/repositories/auth.repository";
import { buildPostsRepository } from "~/repositories/posts.repository";

export function buildApi(fetcher: typeof $fetch) {
    const auth = buildAuthRepository(fetcher)
    const posts = buildPostsRepository(fetcher)
    return { auth, posts }
}


export type ApiInstance = ReturnType<typeof buildApi>