import type { Request, Response } from "express";
import type { authType, userType } from "../types/authTypes";
import bcrypt from "bcrypt";
import {registerAsAdmin, registerAuth, registerUser} from "../services/registerService";
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
	const { firstName, lastName, address, phone, role, authId }: userType = user;

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
	const { auth: authType, user: userType, secret } = req.body;
	//manual transaction
	if (secret !== process.env.SECRET) {
		return res.status(400).json({ msg: "secret/invalid" });
	}
	if(userType.role !== "ADMIN") { return res.status(400).json({ msg: "role/invalid" }); }
	const {
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
	const {
		status: userStatus,
		msg: userMsg,
		userId,
	}: {
		status: number;
		msg: string;
		userId?: string;
	} = await registerUserController({ ...userType, authId });
	if (userStatus !== 201 || !userId) {
		await prisma.userAuth.delete({ where: { id: authId } });
		return res.status(userStatus).json({ userMsg });
	}
	const { status, msg,adminId } = await registerAsAdmin(userId, secret);
	if (status !== 201) {
		await prisma.userAuth.delete({ where: { id: authId } });
		await prisma.user.delete({ where: { id: userId } });
		return res.status(status).json({ msg });
	}
	return res.status(201).json({ msg, adminId });
}
