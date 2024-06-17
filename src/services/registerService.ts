import prisma from "../prisma/index";
import {type authType, RoleType} from "../types/authTypes";
import type { userType } from "../types/authTypes";

export async function registerAuth(
	auth: authType,
): Promise<{ msg: string; status: number; authId?: string }> {
	const { email, username, password } = auth;
	const checkMail = await prisma.userAuth.findUnique({
		where: {
			email,
		},
	});
	if (checkMail) {
		return { status: 400, msg: "mail/already-exists" };
	}
	const checkUsername = await prisma.userAuth.findUnique({
		where: {
			username,
		},
	});
	if (checkUsername) {
		return { status: 400, msg: "username/already-exists" };
	}
	try {
		const createCredentials = await prisma.userAuth.create({
			data: {
				email,
				username,
				password,
			},
		});
		return {
			status: 201,
			msg: "credentials/created",
			authId: createCredentials.id,
		};
	} catch (error) {
		return { status: 400, msg: "error-unknown/create-credentials" };
	}
}

export async function registerUser(
	user: userType,
): Promise<{ msg: string; status: number; userId?: string }> {
	const { firstName, lastName, address, phone, role, authId } = user;
	try {
		const createUser = await prisma.user.create({
			data: {
				firstName,
				lastName,
				address,
				phone,
				role,
				authId,
			},
		});
		return { status: 201, msg: "user/created", userId: createUser.id };
	} catch (error) {
		return { status: 400, msg: "error-unknown/create-user" };
	}
}

export async function registerAsAdmin(userId: string, secret: string): Promise<({status: number; msg:string; adminId?:string})> {
	const checkUser = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});
	if (!checkUser) {
		return { status: 400, msg: "user/not-found" };
	}
	if (checkUser.role !== RoleType.ADMIN) {
		return { status: 400, msg: "user/not-admin" };
	}
	if (secret !== process.env.ADMIN_SECRET) {
		return { status: 400, msg: "secret/invalid" };
	}
	const createAdmin = await prisma.admin.create({
		data: {
			userId,
		},
	});
	return { status: 201, msg: "admin/created", adminId: createAdmin.id };
}
