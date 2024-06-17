export interface authType {
	email: string;
	username: string;
	password: string;
}

export enum RoleType {
	ADMIN = "ADMIN",
	PUBLIC = "PUBLIC",
	MEDIC = "MEDIC",
	PATIENT = "PATIENT",
}

export interface userType {
	firstName: string;
	lastName: string;
	address: string;
	phone: string;
	role: RoleType;
	authId: string;
}
