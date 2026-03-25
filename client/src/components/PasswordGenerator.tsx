import { useState } from 'react'
import { Eye, EyeOff, Copy, Check, RefreshCw, Loader2, KeyRound, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { generatePassword, sendPasswordToSlack } from '@/api/passwordGenerator'

interface Options {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeDigits: boolean
  includeSymbols: boolean
}

const DEFAULT_OPTIONS: Options = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeDigits: true,
  includeSymbols: true,
}

export function PasswordGenerator() {
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [sendingToSlack, setSendingToSlack] = useState(false)
  const [copied, setCopied] = useState(false)
  const [slackStatus, setSlackStatus] = useState<{ ok: boolean; message: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    setSlackStatus(null)
    try {
      const result = await generatePassword(options)
      setPassword(result.password)
      setShowPassword(false)
      setCopied(false)
    } catch {
      setError('Failed to generate password. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendToSlack = async () => {
    if (!password) return
    setSendingToSlack(true)
    setSlackStatus(null)
    try {
      await sendPasswordToSlack(password)
      setSlackStatus({ ok: true, message: 'Password sent to Slack as a hidden message.' })
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Failed to send to Slack.'
      setSlackStatus({ ok: false, message: msg })
    } finally {
      setSendingToSlack(false)
    }
  }

  const toggle = (key: keyof Omit<Options, 'length'>) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const activeCount = [
    options.includeUppercase,
    options.includeLowercase,
    options.includeDigits,
    options.includeSymbols,
  ].filter(Boolean).length

  const checkboxes: { key: keyof Omit<Options, 'length'>; label: string; example: string }[] = [
    { key: 'includeUppercase', label: 'Uppercase', example: 'A–Z' },
    { key: 'includeLowercase', label: 'Lowercase', example: 'a–z' },
    { key: 'includeDigits',    label: 'Digits',    example: '0–9' },
    { key: 'includeSymbols',   label: 'Symbols',   example: '!@#…' },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          <CardTitle>Password Generator</CardTitle>
        </div>
        <CardDescription>
          Generate a strong random password and optionally send it to Slack as a hidden message.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Length */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Length</Label>
            <span className="text-sm font-semibold tabular-nums">{options.length}</span>
          </div>
          <input
            type="range"
            min={16}
            max={24}
            value={options.length}
            onChange={(e) => setOptions((prev) => ({ ...prev, length: parseInt(e.target.value) }))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>16</span>
            <span>24</span>
          </div>
        </div>

        {/* Character type toggles */}
        <div className="space-y-2">
          <Label>Character Types</Label>
          <div className="grid grid-cols-2 gap-2">
            {checkboxes.map(({ key, label, example }) => {
              const checked = options[key]
              const isLast = activeCount === 1 && checked
              return (
                <button
                  key={key}
                  type="button"
                  disabled={isLast}
                  onClick={() => toggle(key)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors
                    ${checked
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border bg-muted/30 text-muted-foreground'
                    }
                    ${isLast ? 'opacity-50' : 'hover:border-primary/60'}
                  `}
                >
                  <span className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 text-xs
                    ${checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}
                  >
                    {checked && '✓'}
                  </span>
                  <span className="font-medium">{label}</span>
                  <span className="ml-auto text-xs opacity-60">{example}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Generate button */}
        <Button className="w-full" onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Password
            </>
          )}
        </Button>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {/* Password output */}
        {password && (
          <div className="space-y-3">
            <div className="relative rounded-lg border bg-muted/40 px-4 py-3 pr-20 font-mono text-sm break-all">
              <span className={showPassword ? '' : 'tracking-widest select-none'}>
                {showPassword ? password : '•'.repeat(password.length)}
              </span>

              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy password"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Send to Slack */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSendToSlack}
              disabled={sendingToSlack}
            >
              {sendingToSlack ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send to Slack
                </>
              )}
            </Button>

            {slackStatus && (
              <div className={`rounded-lg border px-4 py-3 text-sm ${
                slackStatus.ok
                  ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
                  : 'border-destructive bg-destructive/5 text-destructive'
              }`}>
                {slackStatus.message}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
