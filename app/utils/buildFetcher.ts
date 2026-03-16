import { ofetch } from 'ofetch';
import {TokenKey} from "~/constants/api.constants";

export default function buildFetcher(url: URL | RequestInfo, options?: RequestInit){
    const token = import.meta.client ? localStorage.getItem(TokenKey) : null;
    return ofetch.raw(url.toString(), {
        ...options,
        headers: {
            'Accept': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options?.headers,
        }}
    );
}