interface FirebaseAuthError {
  code: string;
  message: string;
}

const errorMessages: Record<string, string> = {
  'auth/invalid-credential': 'Email o contrasena incorrectos.',
  'auth/user-not-found': 'No existe una cuenta con este correo.',
  'auth/wrong-password': 'Email o contrasena incorrectos.',
  'auth/email-already-in-use': 'Ese email ya esta registrado.',
  'auth/invalid-email': 'El email no es valido.',
  'auth/weak-password': 'La contrasena es muy debil (minimo 6 caracteres).',
  'auth/too-many-requests': 'Demasiados intentos. Prueba mas tarde.',
};

export function getAuthErrorMessage(error: unknown): string {
  const firebaseError = error as FirebaseAuthError;
  return (
    errorMessages[firebaseError.code] ||
    'Error de autenticacion. Intenta nuevamente.'
  );
}
