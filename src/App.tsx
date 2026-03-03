import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";

// Lazy-loaded routes for code splitting (reduces initial JS bundle)
const Listings = lazy(() => import("./pages/Listings"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const LegalCheck = lazy(() => import("./pages/LegalCheck"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Contact = lazy(() => import("./pages/Contact"));
const Partners = lazy(() => import("./pages/Partners"));
const Profile = lazy(() => import("./pages/Profile"));
const Favorites = lazy(() => import("./pages/Favorites"));
const AgentDashboard = lazy(() => import("./pages/agent/Dashboard"));
const PostProperty = lazy(() => import("./pages/agent/PostProperty"));
const EditProperty = lazy(() => import("./pages/agent/EditProperty"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminVerifications = lazy(() => import("./pages/admin/Verifications"));
const AdminAuditLog = lazy(() => import("./pages/admin/AuditLog"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const NotFound = lazy(() => import("./pages/errors/NotFound"));
const Forbidden = lazy(() => import("./pages/errors/Forbidden"));
const ServerError = lazy(() => import("./pages/errors/ServerError"));

const queryClient = new QueryClient();

const LazyFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LazyFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/legal-check" element={<LegalCheck />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/dashboard" element={<AgentDashboard />} />
              <Route path="/post-property" element={<PostProperty />} />
              <Route path="/edit-property/:id" element={<EditProperty />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/verifications" element={<AdminVerifications />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/audit-log" element={<AdminAuditLog />} />
              <Route path="/403" element={<Forbidden />} />
              <Route path="/500" element={<ServerError />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
