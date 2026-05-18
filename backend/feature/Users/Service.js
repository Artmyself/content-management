import { UserRepository } from './Repository.js';
import bcrypt from 'bcryptjs';

export class UserService {
    /**
     * Logic for fetching user list with search and pagination
     */
    static async listUsers(search = '', page = 1, limit = 10) {
        // Business logic: Ensure search is a clean string
        const cleanSearch = String(search).trim();
        return await UserRepository.getAll(cleanSearch, page, limit);
    }

    /**
     * Logic for creating a new user (Handles Security & Validation)
     */
    static async createUser(userData) {
        const { full_name, email, password, role } = userData;

        // 1. Business Rule: Check if email is already taken
        const existing = await UserRepository.findByEmail(email);
        if (existing) {
            throw new Error("A user with this email address already exists.");
        }

        // 2. Security Logic: Hash the password before it reaches the Repository
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Send cleaned data to the Repository for persistence
        return await UserRepository.create({
            full_name,
            email,
            password: hashedPassword,
            role
        });
    }

    /**
     * Logic for updating a user account
     */
    static async updateUser(id, userData) {
        // If the update includes a new password, hash it first
        if (userData.password && userData.password.trim() !== '') {
            userData.password = await bcrypt.hash(userData.password, 10);
        } else {
            // Remove password from update object if it wasn't provided (prevents clearing the DB field)
            delete userData.password;
        }

        return await UserRepository.update(id, userData);
    }

    /**
     * Logic for removing a user account
     */
    static async removeUser(id) {
        // Business rule example: prevent deleting yourself could be added here
        return await UserRepository.delete(id);
    }
}