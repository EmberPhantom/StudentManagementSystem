import { ROLE_PERMISSIONS } from "../constants/roles.js";

const permit = (...allowedPermissions) => {
    return(req, res, next) => {
        const userRole = req.user.role;

        const permissions = ROLE_PERMISSIONS[userRole];

        const hasPermission = allowedPermissions.some(permission => 
            permissions.includes(permission)
        );

        if(!hasPermission){
            return res.status(403).json({message: "Access Denied"});
        }

        next();
    };
};

export default permit;