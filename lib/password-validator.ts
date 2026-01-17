export interface PasswordRequirement {
  label: string
  validator: (password: string) => boolean
  met?: boolean
}

export const passwordRequirements: PasswordRequirement[] = [
  {
    label: "At least 8 characters",
    validator: (pwd) => pwd.length >= 8,
  },
  {
    label: "Contains uppercase letter (A-Z)",
    validator: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: "Contains lowercase letter (a-z)",
    validator: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: "Contains a number (0-9)",
    validator: (pwd) => /[0-9]/.test(pwd),
  },
  {
    label: "Contains special character (!@#$%^&*)",
    validator: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  },
]

export function validatePassword(password: string): {
  isValid: boolean
  requirements: PasswordRequirement[]
  message?: string
} {
  const requirements = passwordRequirements.map((req) => ({
    ...req,
    met: req.validator(password),
  }))

  const isValid = requirements.every((req) => req.met)

  return {
    isValid,
    requirements,
    message: isValid ? undefined : "Password does not meet all requirements",
  }
}

export function getPasswordStrength(password: string): {
  strength: "weak" | "medium" | "strong"
  score: number
} {
  const requirements = passwordRequirements.map((req) => req.validator(password))
  const metCount = requirements.filter(Boolean).length

  if (metCount <= 2) return { strength: "weak", score: metCount }
  if (metCount <= 4) return { strength: "medium", score: metCount }
  return { strength: "strong", score: metCount }
}
