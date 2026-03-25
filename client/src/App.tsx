import { Shield } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PasswordStrengthChecker } from '@/components/PasswordStrengthChecker'
import { VulnerabilityScan } from '@/components/VulnerabilityScan'
import { PasswordGenerator } from '@/components/PasswordGenerator'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Password Manager</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Analyze password strength, check for data breaches, generate strong passwords, and keep your accounts secure.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="strength" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="strength">Strength Checker</TabsTrigger>
            <TabsTrigger value="scan">Vulnerability Scan</TabsTrigger>
            <TabsTrigger value="generate">Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="strength">
            <PasswordStrengthChecker />
          </TabsContent>

          <TabsContent value="scan">
            <VulnerabilityScan />
          </TabsContent>

          <TabsContent value="generate">
            <PasswordGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
