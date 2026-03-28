import jwt from "jsonwebtoken";

const generateToken = (res, user) => {
    const token = jwt.sign(
        {id: user._id, role:user.role},
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Make it true during the deployment of the project.
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    });
};

export default generateToken;