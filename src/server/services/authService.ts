// FALCON Server Authentication Service
import { db, type DbUser, type DbUserProfile } from '../database/db';
import { hashPassword, verifyPassword, generateToken } from '../security/crypto';

export async function registerUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<{ user: Omit<DbUser, 'passwordHash' | 'salt'>; token: string }> {
  const normalizedEmail = input.email.toLowerCase().trim();
  if (db.usersByEmail.has(normalizedEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  const { hash, salt } = await hashPassword(input.password);
  const userId = `usr_${Date.now().toString(36)}`;

  const newUser: DbUser = {
    id: userId,
    email: normalizedEmail,
    passwordHash: hash,
    salt,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    membershipTier: 'free',
    role: 'CUSTOMER',
    emailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.set(userId, newUser);
  db.usersByEmail.set(normalizedEmail, userId);

  // Initialize Profile
  const profile: DbUserProfile = {
    userId,
    atelierId: `FX-MBR-${Math.floor(1000 + Math.random() * 9000)}`,
    aesthetic: 'Quiet structure',
    palette: 'Monochrome',
    outerwearSize: 'M (Medium)',
    tailoringSize: '38R / EU 48',
    footwearSize: '39 EU / 8.5 US',
    currency: 'USD ($)',
    region: 'Global Express',
    aiLearning: true,
    notifications: { orders: true, promotions: false, styling: true, concierge: true },
  };
  db.profiles.set(userId, profile);

  const token = generateToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    membershipTier: newUser.membershipTier,
  });

  const { passwordHash, salt: _, ...safeUser } = newUser;
  return { user: safeUser, token };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: Omit<DbUser, 'passwordHash' | 'salt'>; token: string }> {
  const normalizedEmail = input.email.toLowerCase().trim();
  const userId = db.usersByEmail.get(normalizedEmail);
  if (!userId) {
    throw new Error('Invalid email address or password.');
  }

  const dbUser = db.users.get(userId);
  if (!dbUser) {
    throw new Error('User record not found.');
  }

  const valid = await verifyPassword(input.password, dbUser.passwordHash, dbUser.salt);
  if (!valid) {
    throw new Error('Invalid email address or password.');
  }

  const token = generateToken({
    userId: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
    membershipTier: dbUser.membershipTier,
  });

  const { passwordHash, salt: _, ...safeUser } = dbUser;
  return { user: safeUser, token };
}
