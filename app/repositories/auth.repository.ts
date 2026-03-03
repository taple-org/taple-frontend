import {build, post} from "~/repositories/repository.helpers";

type User = {
    email: string;
    password: string;
}

export function buildAuthRepository(fetcher: typeof $fetch) {
    return build(fetcher, {
        login: post<User, { name: string; email: string }>("/auth/login"),
    })
}

