import User from '../models/user.js';
import bcrypt from 'bcrypt';


//Register Service
export const resgisterUser = async (data) => {
    const { name, email, password, role } = data;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new Error('user already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role
    });

    return user;
}

//Login Service
export const loginUser = async (data) => {
    const { email, password } = data;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    return user;
};