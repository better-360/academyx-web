export const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";

    // En az bir büyük harf
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    // En az bir küçük harf
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    // En az bir rakam
    password += "0123456789"[Math.floor(Math.random() * 10)];
    // En az bir özel karakter
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)];

    // Geri kalan karakterler
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Karakterleri karıştır
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    return password;
  };
