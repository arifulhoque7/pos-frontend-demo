import { useRouter } from "next/router";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import "../styles/globals.css";

function App({ Component, pageProps }) {
  const router = useRouter();

  // Pages that should have the Layout and be protected
  const protectedRoutes = ["/dashboard"];

  const isProtectedRoute = protectedRoutes.includes(router.pathname);

  return isProtectedRoute ? (
    <ProtectedRoute>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ProtectedRoute>
  ) : (
    <Component {...pageProps} />
  );
}

export default App;