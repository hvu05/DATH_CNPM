import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from '@/routes/route'
import { RouterProvider } from "react-router";
import '@/styles/global.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { App } from 'antd';


createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
			<App>
				<RouterProvider router={router} />
			</App>
		</AuthProvider>
	</StrictMode>,
)
