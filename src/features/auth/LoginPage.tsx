import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '@/api/auth'
import { extractErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/authStore'
import { Alert, Button, Field, Input } from '@/components/ui'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setLogin = useAuthStore((s) => s.login)
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    try {
      const res = await login({ 'E-mail': values.email, password: values.password })
      const token = res.token ?? Object.values(res)[0]
      if (!token) throw new Error('No token returned by the server')
      setLogin(token)
      const from = (location.state as { from?: Location })?.from?.pathname ?? '/'
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(extractErrorMessage(err, 'Could not log in. Check your credentials.'))
    }
  }

  return (
    <div className="max-w-sm mx-auto stub p-8">
      <h1 className="font-display text-2xl mb-1">Log in</h1>
      <p className="text-sm text-(--color-ink-soft) mb-6">Welcome back — pick up your cart where you left it.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Input type="password" autoComplete="current-password" {...register('password')} />
        </Field>

        {serverError && <Alert>{serverError}</Alert>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="text-sm text-(--color-ink-soft) mt-6 text-center">
        New here?{' '}
        <Link to="/signup" className="text-(--color-accent-ink) font-medium">
          Create an account
        </Link>
      </p>
    </div>
  )
}
