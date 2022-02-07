import storeConfig from '../config/store-config.json';
import AuthServiceFire from "../services/auth/auth-service-fire";
export const authService = new AuthServiceFire(storeConfig.adminEmail);