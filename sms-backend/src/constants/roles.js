export const ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student'
}

export const PERMISSIONS = {
    CREATE_STUDENT: "create_student",
    VIEW_STUDENT: "view_student",
    UPDATE_STUDENT: "update_student",
    MARK_ATTENDANCE: "mark_attendance",
    VIEW_ATTENDANCE: "view_attendance",
    DELETE_STUDENT: 'delete_student',
    ASSIGN_TEACHER: 'assign_teacher'
};

export const ROLE_PERMISSIONS = {
    admin: [
        'create_student',
        'view_student',
        'update_student',
        'mark_attendance',
        'view_attendance',
        'delete_student',
        'assign_teacher'
    ],
    teacher: [
        'update_student',
        'mark_attendance',
        'view_student',
        'create_student'
    ],
    student: [
        'view_student',
        'view_attendance'
    ]
}; 