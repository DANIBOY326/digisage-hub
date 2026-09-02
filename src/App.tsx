import { BrowserRouter, Route, Routes } from "react-router-dom"; 
import { DefaultProviders } from "./components/providers/default.tsx"; 
import { CohortModalProvider } from "./hooks/use-cohort-modal.tsx"; 
import Index from "./pages/Index.tsx"; 
import AdminRegistrations from "./pages/admin/AdminRegistrations.tsx"; 
import NotFound from "./pages/NotFound.tsx"; 

export default function App() { 
return ( 
<DefaultProviders> 
<BrowserRouter> 
<CohortModalProvider> 
<Routes> 
<Route path="/" element={<Index />} /> 
<Route path="/admin" element={<AdminRegistrations />} /> 
<Route path="/admin/registrations" element={<AdminRegistrations />} /> 
{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */} 
<Route path="*" element={<NotFound />} /> 
</Routes> 
</CohortModalProvider> 
</BrowserRouter> 
</DefaultProviders> 
); 
}

