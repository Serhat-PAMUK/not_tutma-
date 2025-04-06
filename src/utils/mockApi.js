const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test Kullanıcı',
  },
];

// Basit bir mock login API'si
export const loginApi = async (email, password) => {
  // Simüle edilmiş API gecikmesi
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test kullanıcısı kontrolü
  if (email === 'test@test.com' && password === '123456') {
    return {
      id: 1,
      email: 'test@test.com',
      name: 'Test Kullanıcı',
      token: 'mock-jwt-token'
    };
  }

  // Hatalı giriş durumunda
  throw new Error('Geçersiz kullanıcı bilgileri');
}; 