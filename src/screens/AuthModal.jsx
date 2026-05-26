import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'

export default function AuthModal() {
  const { user, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()

  // Redirect if already signed in
  useEffect(() => {
    if (user && !loading) navigate('/studio')
  }, [user, loading, navigate])

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-background px-margin-mobile py-xl relative">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-[0.04] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-surface border-2 border-on-background neo-pop-shadow-lg p-lg flex flex-col gap-lg">
          {/* Header */}
          <div className="border-b-2 border-on-background pb-md">
            <h1 className="font-headline-xl text-headline-lg text-on-surface lowercase tracking-tighter">
              sign in to lumi.
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              Save your prints, access your gallery from anywhere.
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-md border-2 border-on-background bg-surface py-sm px-md neo-pop-shadow hover:shadow-[6px_6px_0px_0px_#1b1c1c] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Google SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-label-md text-label-md text-on-surface">
              {loading ? 'Connecting...' : 'Continue with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-sm">
            <div className="flex-1 border-t-2 border-on-background" />
            <span className="font-technical-sm text-technical-sm text-on-surface-variant uppercase">or</span>
            <div className="flex-1 border-t-2 border-on-background" />
          </div>

          {/* Guest mode */}
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/studio')}
          >
            continue as guest
          </Button>

          <p className="font-technical-sm text-technical-sm text-on-surface-variant text-center">
            Guest sessions don't save to the cloud. Sign in to keep your prints.
          </p>
        </div>

        {/* Back link */}
        <button
          onClick={() => navigate('/')}
          className="mt-md flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          back to home
        </button>
      </div>
    </div>
  )
}
