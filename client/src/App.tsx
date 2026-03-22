import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SellerDashboard from "./pages/SellerDashboard";
import AdminPanel from "./pages/AdminPanel";
import Terms from "./pages/Terms";
import HowItWorks from "./pages/HowItWorks";
import ProductForm from "./pages/ProductForm";
import ServiceForm from "./pages/ServiceForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ImportProduct from "./pages/ImportProduct";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Disputes from "./pages/Disputes";
import Returns from "./pages/Returns";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import HalalStandards from "./pages/HalalStandards";
import { lazy, Suspense } from "react";

// Lazy-loaded pages
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Orders = lazy(() => import("./pages/Orders"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Profile = lazy(() => import("./pages/Profile"));
const Sellers = lazy(() => import("./pages/Sellers"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const Notifications = lazy(() => import("./pages/Notifications"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/services" component={Services} />
        <Route path="/services/:id" component={ServiceDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={Orders} />
        <Route path="/bookings" component={Bookings} />
        <Route path="/profile" component={Profile} />
        <Route path="/account" component={Profile} />
        <Route path="/sellers" component={Sellers} />
        <Route path="/shop/:slug" component={ShopPage} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/seller/dashboard" component={SellerDashboard} />
        <Route path="/seller/create" component={SellerDashboard} />
        <Route path="/seller/products/new" component={() => <ProductForm />} />
        <Route path="/seller/products/:id/edit" component={ProductForm} />
        <Route path="/seller/services/new" component={() => <ServiceForm />} />
        <Route path="/seller/services/:id/edit" component={ServiceForm} />
        <Route path="/admin" component={AdminPanel} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/terms" component={Terms} />
        <Route path="/help" component={Help} />
        <Route path="/contact" component={Contact} />
        <Route path="/disputes" component={Disputes} />
        <Route path="/returns" component={Returns} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/about" component={About} />
        <Route path="/halal-standards" component={HalalStandards} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/import-product" component={ImportProduct} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Navbar />
          <Router />
          <Footer />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
