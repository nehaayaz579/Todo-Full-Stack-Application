import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

// This default export is required in a file named _app.js
export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}