import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from '@/routes/route'
import { RouterProvider } from "react-router";
import '@/styles/global.css'
import { AuthProvider } from '@/contexts/AuthContext'


createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>,
)
