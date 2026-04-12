import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

// Typ des Auth-Kontexts – was der Kontext bereitstellt
interface AuthContextType {
  token: string | null;
  userId: string | null;
  username: string | null;
  isLoggedIn: boolean;
  login: (token: string, userId: string, username: string) => void;
  logout: () => void;
}

// Kontext erstellen (zunächst leer)
const AuthContext = createContext<AuthContextType | null>(null);

// Provider-Komponente: Umhüllt die gesamte App und stellt Auth-Zustand bereit
export function AuthProvider({ children }: { children: ReactNode }) {
  // Token und Nutzerdaten aus dem localStorage laden (bleibt nach Seiten-Reload erhalten)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  // Wenn beim Start ein Token vorhanden ist, axios-Header setzen
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Wird nach erfolgreichem Login aufgerufen
  const login = (newToken: string, newUserId: string, newUsername: string) => {
    // Daten im State speichern
    setToken(newToken);
    setUserId(newUserId);
    setUsername(newUsername);

    // Im localStorage speichern damit Login nach Reload erhalten bleibt
    localStorage.setItem('token', newToken);
    localStorage.setItem('userId', newUserId);
    localStorage.setItem('username', newUsername);

    // axios-Standard-Header setzen, damit jede Anfrage automatisch den Token mitschickt
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  // Wird beim Logout aufgerufen
  const logout = () => {
    setToken(null);
    setUserId(null);
    setUsername(null);

    // Aus localStorage entfernen
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');

    // axios-Header entfernen
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{
      token,
      userId,
      username,
      isLoggedIn: token !== null,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook für einfachen Zugriff auf den Auth-Kontext
// Verwendung in Komponenten: const { isLoggedIn, username } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden');
  }
  return context;
}
