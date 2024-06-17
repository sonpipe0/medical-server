import { Request, Response } from "express";
import { authType, userType } from "../types/authTypes";
import bcrypt from "bcrypt";
import { registerAuth, registerUser } from "../services/registerService";
import prisma from "../prisma";

const registerAuthController = async (
	auth: authType,
): Promise<{ msg: string; status: number; authId?: string }> => {
	let res: Response;
	let { email, username, password }: authType = auth;

	if (!email || !username || !password) {
		return { status: 400, msg: "Please fill in all fields" };
	}

	password = await bcrypt.hash(password, 10);

	const {
		status,
		msg,
		authId,
	}: { status: number; msg: string; authId?: string } = await registerAuth({
		email,
		username,
		password,
	});
	return authId ? { status, msg, authId } : { status, msg };
};

const registerUserController = async (
	user: userType,
): Promise<{ msg: string; status: number; userId?: string }> => {
	let { firstName, lastName, address, phone, role, authId }: userType = user;

	if (!firstName || !lastName || !address || !phone || !role || !authId) {
		return { status: 400, msg: "Please fill in all fields" };
	}

	const {
		status,
		msg,
		userId,
	}: { status: number; msg: string; userId?: string } = await registerUser({
		firstName,
		lastName,
		address,
		phone,
		role,
		authId,
	});
	return userId ? { status, msg, userId } : { status, msg };
};

export async function registerAdminController(req: Request, res: Response) {
	const { auth: authType, user: userType } = req.body;
	//manual transaction
	let {
		status: authStatus,
		msg: authMsg,
		authId,
	}: {
		status: number;
		msg: string;
		authId?: string;
	} = await registerAuthController(authType);
	if (authStatus !== 201) {
		return res.status(authStatus).json({ authMsg });
	}
	let {
		status: userStatus,
		msg: userMsg,
		userId,
	}: {
		status: number;
		msg: string;
		userId?: string;
	} = await registerUserController({ ...userType, authId });
	if (userStatus !== 201) {
		await prisma.userAuth.delete({ where: { id: authId } });
		return res.status(userStatus).json({ userMsg });
	}
	return res
		.status(201)
		.json({ msg: "admin/created", authId: authId, userId: userId });
}
