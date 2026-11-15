import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '@/api/auth'
import { extractErrorMessage } from '@/api/client'
import { Alert, Button, Field, Input } from '@/components/ui'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
})
type FormValues = z.infer<typeof schema>

export default function SignupPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    try {
      await signup({ name: values.name, 'E-mail': values.email, password: values.password })
      navigate('/login', { state: { justSignedUp: true } })
    } catch (err) {
      setServerError(extractErrorMessage(err, 'Could not create your account.'))
    }
  }

  return (
    <div className="max-w-sm mx-auto stub p-8">
      <h1 className="font-display text-2xl mb-1">Create an account</h1>
      <p className="text-sm text-(--color-ink-soft) mb-6">Takes a minute. No card required.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Name" error={errors.name?.message}>
          <Input autoComplete="name" {...register('name')} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Input type="password" autoComplete="new-password" {...register('password')} />
        </Field>

        {serverError && <Alert>{serverError}</Alert>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating account…' : 'Sign up'}
        </Button>
      </form>

      <p className="text-sm text-(--color-ink-soft) mt-6 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-(--color-accent-ink) font-medium">
          Log in
        </Link>
      </p>
    </div>
  )
}
