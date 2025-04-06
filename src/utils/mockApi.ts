interface User {
  id: string;
  email: string;
  name: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test Kullanıcı',
  },
];

export const loginApi = async (email: string, password: string): Promise<User> => {
  // Simüle edilmiş API gecikmesi
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = mockUsers.find((u) => u.email === email);

  if (!user || password !== '123456') {
    throw new Error('Geçersiz e-posta veya şifre');
  }

  return user;
}; 