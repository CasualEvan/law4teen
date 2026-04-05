// Admin credentials — change these to whatever you want
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "law4teen2026";

export const isAdminLoggedIn = () => sessionStorage.getItem("l4t_admin") === "true";
export const loginAdmin = () => sessionStorage.setItem("l4t_admin", "true");
export const logoutAdmin = () => sessionStorage.removeItem("l4t_admin");

// The secret click sequence: box indexes 2, 0, 3, 1 (LSAT, Teens-First, Voice, Real Cases)
export const SECRET_SEQUENCE = [2, 0, 3, 1];
