import React, { useState } from 'react'
import { Modal, Button, Input, EmailInput, PhoneInput, Alert } from '@/components'
import { authService } from '@/services/authService'
import './AuthModal.css'

interface AuthModalProps {
  onSuccess: (isGuest: boolean, email?: string, phone?: string, token?: string) => void
  onClose: () => void
  planName: string
  onContinueAsGuest: () => void
}

type AuthMode = 'login' | 'signup' | 'guest'

export const AuthModal: React.FC<AuthModalProps> = ({
  onSuccess,
  onClose,
  planName,
  onContinueAsGuest,
}) => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Signup form
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError('Please enter email and password')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await authService.login(loginEmail, loginPassword)

      if (response.success && response.data?.token) {
        onSuccess(false, loginEmail, undefined, response.data.token)
      } else {
        setError(response.error?.message || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPhone || !signupPassword) {
      setError('Please fill all required fields')
      return
    }

    if (signupPassword !== signupConfirm) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await authService.signup({
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
      })

      if (response.success && response.data?.token) {
        onSuccess(false, signupEmail, signupPhone, response.data.token)
      } else {
        setError(response.error?.message || 'Signup failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Checkout - ${planName}`}
      size="md"
      closeButton={true}
    >
      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} dismissible={true} onDismiss={() => setError(null)} />
      )}

      {/* Mode Selector */}
      <div className="auth-modal__modes">
        <button
          className={`auth-modal__mode-btn ${mode === 'login' ? 'auth-modal__mode-btn--active' : ''}`}
          onClick={() => {
            setMode('login')
            setError(null)
          }}
        >
          Login
        </button>
        <button
          className={`auth-modal__mode-btn ${mode === 'signup' ? 'auth-modal__mode-btn--active' : ''}`}
          onClick={() => {
            setMode('signup')
            setError(null)
          }}
        >
          Sign Up
        </button>
        <button
          className={`auth-modal__mode-btn ${mode === 'guest' ? 'auth-modal__mode-btn--active' : ''}`}
          onClick={() => {
            setMode('guest')
            setError(null)
          }}
        >
          Guest
        </button>
      </div>

      {/* Login Form */}
      {mode === 'login' && (
        <div className="auth-modal__form">
          <EmailInput
            label="Email"
            value={loginEmail}
            onChange={setLoginEmail}
          />
          <Input
            label="Password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <Button
            variant="primary"
            size="lg"
            onClick={handleLogin}
            isLoading={loading}
            disabled={loading}
            className="auth-modal__submit"
          >
            Login
          </Button>
        </div>
      )}

      {/* Signup Form */}
      {mode === 'signup' && (
        <div className="auth-modal__form">
          <Input
            label="Full Name"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            placeholder="Enter your name"
          />
          <EmailInput
            label="Email"
            value={signupEmail}
            onChange={setSignupEmail}
          />
          <PhoneInput
            label="Phone Number"
            value={signupPhone}
            onChange={setSignupPhone}
          />
          <Input
            label="Password"
            type="password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            placeholder="Create a password"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={signupConfirm}
            onChange={(e) => setSignupConfirm(e.target.value)}
            placeholder="Confirm password"
          />
          <Button
            variant="primary"
            size="lg"
            onClick={handleSignup}
            isLoading={loading}
            disabled={loading}
            className="auth-modal__submit"
          >
            Create Account
          </Button>
        </div>
      )}

      {/* Guest Form */}
      {mode === 'guest' && (
        <div className="auth-modal__form">
          <p className="auth-modal__guest-text">
            Continue without creating an account. You can create an account later anytime.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={onContinueAsGuest}
            className="auth-modal__submit"
          >
            Continue as Guest
          </Button>
        </div>
      )}
    </Modal>
  )
}
