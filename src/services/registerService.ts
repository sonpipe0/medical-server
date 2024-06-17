import prisma from "../prisma/index";
import { authType } from "../types/authTypes";
import { userType } from "../types/authTypes";

export async function registerAuth(
	auth: authType,
): Promise<{ msg: string; status: number; authId?: string }> {
	const { email, username, password } = auth;
	let checkMail = await prisma.userAuth.findUnique({
		where: {
			email,
		},
	});
	if (checkMail) {
		return { status: 400, msg: "mail/already-exists" };
	}
	let checkUsername = await prisma.userAuth.findUnique({
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
