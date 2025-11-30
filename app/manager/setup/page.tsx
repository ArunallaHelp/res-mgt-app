import { Suspense } from 'react'
import { ManagerSetupForm } from '@/components/auth/manager-setup-form'

export default function ManagerSetupPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <ManagerSetupForm />
      </Suspense>
    </div>
  )
}
