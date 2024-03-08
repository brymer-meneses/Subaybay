import { writable } from "svelte/store";

import type { UserInfo } from "firebase/auth";

export const user = writable<UserInfo>();
