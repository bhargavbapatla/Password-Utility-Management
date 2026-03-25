import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

interface StrengthResult {
  score: number
  label: string
  color: string
  badgeVariant: 'destructive' | 'secondary' | 'outline' | 'default'
}

interface Criterion {
  label: string
  met: boolean
}

function analyzePassword(password: string): { strength: StrengthResult; criteria: Criterion[] } {
  const criteria: Criterion[] = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least 12 characters', met: password.length >= 12 },
    { label: 'Uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'Number (0-9)', met: /[0-9]/.test(password) },
    { label: 'Special character (!@#$...)', met: /[^A-Za-z0-9]/.test(password) },
  ]

  const metCount = criteria.filter((c) => c.met).length

  let strength: StrengthResult
  if (metCount <= 1) {
    strength = { score: 10, label: 'Very Weak', color: 'bg-red-500', badgeVariant: 'destructive' }
  } else if (metCount === 2) {
    strength = { score: 30, label: 'Weak', color: 'bg-orange-500', badgeVariant: 'destructive' }
  } else if (metCount === 3) {
    strength = { score: 50, label: 'Fair', color: 'bg-yellow-500', badgeVariant: 'secondary' }
  } else if (metCount === 4) {
    strength = { score: 65, label: 'Good', color: 'bg-blue-500', badgeVariant: 'outline' }
  } else if (metCount === 5) {
    strength = { score: 80, label: 'Strong', color: 'bg-green-500', badgeVariant: 'default' }
  } else {
    strength = { score: 100, label: 'Very Strong', color: 'bg-emerald-500', badgeVariant: 'default' }
  }

  return { strength, criteria }
}

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Must contain at least one special character')
    .required('Password is required'),
})

export function PasswordStrengthChecker() {
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const formik = useFormik({
    initialValues: { password: '' },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {
      setSubmitted(true)
    },
  })

  const { strength, criteria } = analyzePassword(formik.values.password)
  const hasInput = formik.values.password.length > 0

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <CardTitle>Password Strength Checker</CardTitle>
        </div>
        <CardDescription>
          Enter a password to analyze its strength and get improvement suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password..."
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-destructive">{formik.errors.password}</p>
            )}
          </div>

          {hasInput && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Strength</span>
                  <Badge variant={strength.badgeVariant}>{strength.label}</Badge>
                </div>
                <Progress value={strength.score} className="h-2" />
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Criteria</span>
                <ul className="space-y-1.5">
                  {criteria.map((c) => (
                    <li key={c.label} className="flex items-center gap-2 text-sm">
                      <span
                        className={`h-4 w-4 rounded-full flex items-center justify-center text-xs font-bold ${
                          c.met
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {c.met ? '✓' : '✗'}
                      </span>
                      <span className={c.met ? 'text-foreground' : 'text-muted-foreground'}>
                        {c.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Button type="submit" className="w-full">
            Analyze Password
          </Button>

          {submitted && !formik.errors.password && (
            <p className="text-sm text-center text-green-600 dark:text-green-400 font-medium">
              ✓ Password meets all strength requirements!
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
