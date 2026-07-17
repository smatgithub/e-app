import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'efood_access_token';
const PHONE_KEY = 'efood_phone';

export const storage = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async setToken(token: string) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },
  async clearToken() {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(PHONE_KEY),
    ]);
  },
  async getPhone(): Promise<string | null> {
    return AsyncStorage.getItem(PHONE_KEY);
  },
  async setPhone(phone: string) {
    await AsyncStorage.setItem(PHONE_KEY, phone);
  },
};
