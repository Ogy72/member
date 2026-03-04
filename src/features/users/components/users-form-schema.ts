import { z } from "zod"

export const userFormSchema = z
    .object({
        firstName: z.string().min(3, "First Name is required"),
        lastName: z.string().min(3, "Last Name is required"),
        username: z.string().min(3, "Username is required"),
        phoneNumber: z.string().min(10, "Phone number is required"),
        email: z.email({
            error: (iss) => (iss.input === '' ? 'Email is required' : undefined)
        }),
        password: z.string().transform((pwd) => pwd.trim()),
        role: z.string().min(3, "Role is required"),
        confirmPassword: z.string().transform((pwd) => pwd.trim()),
        isEdit: z.boolean(),
    })
    .refine((data) => (data.isEdit && !data.password ? true : data.password.length > 0), {
        message: "Password is required",
        path: ['password'],
    })
    .refine(({ isEdit, password }) => (isEdit && !password ? true : password.length >= 7), {
        message: "Password must contain at least 7 characters",
        path: ['password'],
    })
    .refine(({ isEdit, password }) => (isEdit && !password ? true : /[a-z]/.test(password)), {
        message: "Password must contain at least one lowercase letter",
        path: ['password'],
    })
    .refine(({ isEdit, password }) => (isEdit && !password ? true : /\d/.test(password)), {
        message: "Password must contain at least one number",
        path: ['password'],
    })
    .refine(
        ({ isEdit, password, confirmPassword }) =>
            isEdit && !password ? true : password === confirmPassword,
        {
            message: "Passwords don't match",
            path: ['confirmPassword'],
        }
    )