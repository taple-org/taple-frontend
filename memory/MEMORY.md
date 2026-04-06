# taple-frontend Memory

## Project
Nuxt 4 / Vue 3 + Pinia + regle forms. Package manager: pnpm.

## API Clients
- **`$apiClient`** (generated, current) — `app/plugins/api.plugin.ts` → `Api` class from `app/api/generated/api.ts`
  - Returns `HttpResponse<ResponseXxx, HTTPValidationError>` — access data via `.data.result`
  - Throws `HttpResponse` object (not Error) on non-2xx — `.error` contains body
  - Auth token: reads from `localStorage.getItem('access_token')` via `buildFetcher`
  - Regenerate with: `pnpm generate:api` (updates `openapi.json` first manually)
- **`$api`** (legacy, still present) — `app/plugins/http.plugin.ts` → repository pattern via `app/repositories/`
  - Used only in non-auth workspace files now
  - Error thrown is `ApiException` from `app/repositories/repository.helpers.ts`

## Auth Store (`app/stores/auth.store.ts`)
- `withLoading` wraps async fns: handles `HttpResponse` errors (via `extractApiClientError`) + `Error`
- `extractApiClientError` parses both backend `{ meta: { error: ErrorBody } }` and FastAPI `{ detail: [] }` formats
- Login flow: `loginPost` → store token → `meGet` → `setAuth`
- Token stored as `TokenKey = 'access_token'` in localStorage

## Known Audit Items (clarify with Adel)
- `VerifyEmailResult` has no tokens/user → no auto-login after signup email verify
- No logout endpoint in generated API → `signOut` only clears local state

## Form Validation (regle)
- `externalErrors` ref passed to `withLoading` gets populated with per-field server errors
- Field key must match form state key (e.g. `{ email: ['error'] }`)
- Forms in `app/composables/auth/`

## AuthUser type
`{ id, email, first_name: string|null, last_name: string|null }` — matches `UserResult` from generated API
