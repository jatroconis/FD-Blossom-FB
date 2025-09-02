import { ApolloProvider } from '@apollo/client/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { apollo } from './app/apollo.ts'
import { router } from './app/router.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apollo}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>,
)
