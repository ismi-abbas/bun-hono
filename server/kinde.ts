import {
	createKindeServerClient,
	GrantType,
	type SessionManager,
	type UserProfile,
	type UserType,
} from "@kinde-oss/kinde-typescript-sdk";
import { env } from "./env";
import type { Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createFactory, createMiddleware } from "hono/factory";

export const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
	authDomain: env.KINDE_DOMAIN,
	clientId: env.KINDE_CLIENT_ID,
	clientSecret: env.KINDE_CLIENT_SECRET,
	redirectURL: env.KINDE_REDIRECT_URI,
	logoutRedirectURL: env.KINDE_LOGOUT_REDIRECT_URI,
});

export const sessionManager = (c: Context): SessionManager => ({
	async getSessionItem(key: string) {
		const result = getCookie(c, key);
		return result;
	},
	async setSessionItem(key: string, value: unknown) {
		const cookieOptions = {
			httpOnly: true,
			secure: true,
			sameSite: "Lax",
		} as const;
		if (typeof value === "string") {
			setCookie(c, key, value, cookieOptions);
		} else {
			setCookie(c, key, JSON.stringify(value), cookieOptions);
		}
	},
	async removeSessionItem(key: string) {
		deleteCookie(c, key);
	},
	async destroySession() {
		["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
			deleteCookie(c, key);
		});
	},
});

type Env = {
	Variables: {
		user: UserType;
	};
};
export const getUserMiddleware = createMiddleware<Env>(async (c, next) => {
	try {
		const manager = sessionManager(c);
		const isAuthenticated = await kindeClient.isAuthenticated(manager);

		if (!isAuthenticated) {
			console.log("rerere");
			return c.json(
				{
					error: "Not authenticated",
				},
				401
			);
		}
		const user = await kindeClient.getUserProfile(manager);
		c.set("user", user);

		await next();
	} catch (error) {
		console.error("herereee");
		return c.json({ error: "Unauthorized" }, 401);
	}
});
