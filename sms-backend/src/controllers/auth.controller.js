import { resgisterUser, loginUser } from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";
import generateToken from '../utils/generateToken.js';
import Teacher from '../models/Teacher.js'; 
import Student from '../models/Student.js';

//REGISTER
export const register = async(req, res) => {
    try{

        // console.log("req.body:", req.body); - Used for testing 
        const validateData = registerSchema.parse(req.body);

        const user = await resgisterUser(validateData);

        if (validateData.role === 'teacher') {
            await Teacher.create({
                userId: user._id,
                branch: validateData.branch || 'General'
            });
        }

        if (validateData.role === 'student') {
            const rollNo = validateData.rollNo || `STU-${Date.now()}`;
            const dob = validateData.dob ? new Date(validateData.dob) : new Date('2000-01-01');
            const year = validateData.year || new Date().getFullYear();
            const branch = validateData.branch || 'General';
            const section = validateData.section || 'A';

            await Student.create({
                userId: user._id,
                name: user.name,
                email: user.email,
                rollNo,
                dob,
                year,
                branch,
                section,
            });
        }

        generateToken(res, user);

        res.status(201).json({
            message: "User registered successfully"
        });
     } catch(error) {
        res.status(400).json({message: error.message});
     }
};

export const registerAdmin = async(req, res) => {
    try {
        const validateData = registerSchema.parse(req.body);

        const user = await resgisterUser(validateData);

        if (validateData.role === 'teacher') {
            await Teacher.create({
                userId: user._id,
                branch: validateData.branch || 'General'
            });
        }

        if (validateData.role === 'student') {
            const rollNo = validateData.rollNo || `STU-${Date.now()}`;
            const dob = validateData.dob ? new Date(validateData.dob) : new Date('2000-01-01');
            const year = validateData.year || new Date().getFullYear();
            const branch = validateData.branch || 'General';
            const section = validateData.section || 'A';

            await Student.create({
                userId: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone?? '',
                rollNo,
                dob,
                year,
                branch,
                section,
            });
        }

        res.status(201).json({ message: 'User created by admin successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//LOGIN
export const login = async(req, res) => {
    try{
        const validatedData = loginSchema.parse(req.body);

        const user = await loginUser(validatedData);

        generateToken(res, user);

        res.json({ message: "Login Successful" });
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

//LOGOUT
export const logout = async(req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.json({message: 'Logged out'});
};


export const me = async(req, res) => {
    if (!req.user) return res.status(401).json({message: "Not authenticated"});
    res.json({user: req.user})
};

