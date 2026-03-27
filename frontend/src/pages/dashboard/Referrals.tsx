import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  LoadingSpinner,
  Alert,
  Badge,
  PriceDisplay,
  Modal,
  PageHeader,
} from '@/components'
import { getAPI, postAPI } from '@/lib/api'

interface ReferralData {
  code: string
  balance: number
  totalEarnings: number
  referralCount: number
  minWithdrawal: number
}

interface Referral {
  id: string
  referredName: string
  referredEmail: string
  status: 'pending' | 'confirmed' | 'completed'
  earnedAmount: number
  referralDate: string
}

interface ReferralsData {
  referrals: Referral[]
  total: number
}

export const ReferralsTracking: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState(0)
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'upi'>('upi')
  const [copiedCode, setCopiedCode] = useState(false)

  useEffect(() => {
    loadReferralData()
  }, [])

  const loadReferralData = async () => {
    try {
      const token = sessionStorage.getItem('authToken')
      if (!token) {
        navigate('/login')
        return
      }

      // Fetch referral overview
      const overviewResponse = await getAPI<ReferralData>(
        '/api/referrals/overview',
        token
      )
      if (overviewResponse.success && overviewResponse.data) {
        setReferralData(overviewResponse.data)
        setWithdrawAmount(overviewResponse.data.balance)
      }

      // Fetch referral list
      const listResponse = await getAPI<ReferralsData>(
        '/api/referrals/list',
        token
      )
      if (listResponse.success && listResponse.data?.referrals) {
        setReferrals(listResponse.data.referrals)
      }
    } catch (err) {
      setError('Failed to load referral data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = () => {
    if (referralData?.code) {
      navigator.clipboard.writeText(referralData.code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleWithdraw = async () => {
    if (!referralData || withdrawAmount <= 0) {
      setError('Invalid withdrawal amount')
      return
    }

    if (withdrawAmount > referralData.balance) {
      setError('Insufficient balance')
      return
    }

    if (withdrawAmount < referralData.minWithdrawal) {
      setError(
        `Minimum withdrawal amount is ₹${referralData.minWithdrawal}`
      )
      return
    }

    setProcessing(true)
    try {
      const token = sessionStorage.getItem('authToken')
      const response = await postAPI(
        '/api/referrals/withdraw',
        {
          amount: withdrawAmount,
          method: withdrawMethod,
        },
        token || ''
      )

      if (response.success) {
        setSuccess('Withdrawal request submitted successfully!')
        setShowWithdrawModal(false)
        loadReferralData()
      } else {
        setError(
          response.error?.message || 'Failed to submit withdrawal request'
        )
      }
    } catch (err) {
      setError('Failed to submit withdrawal request')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const shareReferralCode = () => {
    if (!referralData?.code) return

    const message = `🌸 Join me on Bloomme - Get fresh flower deliveries! Use my referral code: ${referralData.code} and get a special discount!`

    if (navigator.share) {
      navigator.share({
        title: 'Bloomme Referral',
        text: message,
      })
    } else {
      navigator.clipboard.writeText(message)
      setSuccess('Message copied! Share it with your friends.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading referral data..." />
      </div>
    )
  }

  const confirmedReferrals = referrals.filter(
    (r) => r.status === 'confirmed' || r.status === 'completed'
  )
  const pendingReferrals = referrals.filter((r) => r.status === 'pending')

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Referral Program"
        subtitle="Earn ₹100 for every friend you invite to Bloomme"
      />

      {/* Alerts */}
      {error && (
        <Alert
          type="error"
          message={error}
          dismissible={true}
          onDismiss={() => setError('')}
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          dismissible={true}
          onDismiss={() => setSuccess('')}
        />
      )}

      {/* Referral Code Card */}
      {referralData && (
        <Card className="bg-gradient-to-r from-primary-gold/10 to-primary-copper/5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-primary-brown mb-1">
                Your Referral Code
              </h3>
              <p className="text-sm text-neutral-dark-gray">
                Share this code with friends to earn rewards
              </p>
            </div>
            <span className="text-3xl">🎁</span>
          </div>

          <div className="bg-white rounded-lg p-4 border-2 border-dashed border-primary-gold mb-4">
            <p className="text-center text-3xl font-bold text-primary-gold tracking-widest">
              {referralData.code}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <Button
              variant="primary"
              onClick={handleCopyCode}
              className="flex-1"
            >
              {copiedCode ? '✓ Copied!' : '📋 Copy Code'}
            </Button>
            <Button
              variant="secondary"
              onClick={shareReferralCode}
              className="flex-1"
            >
              📤 Share with Friends
            </Button>
          </div>
        </Card>
      )}

      {/* Earnings Stats */}
      {referralData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Balance */}
          <Card className="bg-gradient-to-br from-semantic-success/5 to-transparent">
            <p className="text-sm text-neutral-dark-gray mb-2">
              Current Balance
            </p>
            <div className="text-3xl font-bold text-semantic-success mb-3">
              <PriceDisplay amount={referralData.balance} />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowWithdrawModal(true)}
              disabled={referralData.balance < referralData.minWithdrawal}
              className="w-full"
            >
              Withdraw
            </Button>
          </Card>

          {/* Total Earnings */}
          <Card className="bg-gradient-to-br from-primary-gold/5 to-transparent">
            <p className="text-sm text-neutral-dark-gray mb-2">
              Total Earnings
            </p>
            <p className="text-3xl font-bold text-primary-gold">
              <PriceDisplay amount={referralData.totalEarnings} />
            </p>
            <p className="text-xs text-neutral-dark-gray mt-2">
              All time
            </p>
          </Card>

          {/* Referral Count */}
          <Card className="bg-gradient-to-br from-primary-copper/5 to-transparent">
            <p className="text-sm text-neutral-dark-gray mb-2">
              Successful Referrals
            </p>
            <p className="text-3xl font-bold text-primary-copper">
              {confirmedReferrals.length}
            </p>
            <p className="text-xs text-neutral-dark-gray mt-2">
              Friends joined
            </p>
          </Card>
        </div>
      )}

      {/* How it Works */}
      <Card className="bg-primary-gold/5 border border-primary-gold/20">
        <h4 className="font-semibold text-primary-brown mb-4">
          💡 How It Works
        </h4>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-2xl">1️⃣</span>
            <div>
              <p className="font-semibold text-primary-brown text-sm">
                Share Your Code
              </p>
              <p className="text-xs text-neutral-dark-gray">
                Give your unique referral code to friends
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">2️⃣</span>
            <div>
              <p className="font-semibold text-primary-brown text-sm">
                They Sign Up
              </p>
              <p className="text-xs text-neutral-dark-gray">
                They use your code to create their account
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">3️⃣</span>
            <div>
              <p className="font-semibold text-primary-brown text-sm">
                They Subscribe
              </p>
              <p className="text-xs text-neutral-dark-gray">
                They purchase a subscription plan
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">4️⃣</span>
            <div>
              <p className="font-semibold text-primary-brown text-sm">
                You Earn ₹100
              </p>
              <p className="text-xs text-neutral-dark-gray">
                Instant credit to your account (no limits!)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Confirmed Referrals */}
      {confirmedReferrals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-primary-brown mb-4">
            ✓ Confirmed Referrals ({confirmedReferrals.length})
          </h3>

          <div className="space-y-3">
            {confirmedReferrals.map((referral) => (
              <Card key={referral.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-primary-brown">
                      {referral.referredName}
                    </p>
                    <p className="text-xs text-neutral-dark-gray mb-2">
                      {referral.referredEmail}
                    </p>
                    <p className="text-xs text-neutral-dark-gray">
                      Referred on{' '}
                      {new Date(referral.referralDate).toLocaleDateString(
                        'en-IN'
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-semantic-success">
                      <PriceDisplay amount={referral.earnedAmount} />
                    </p>
                    <Badge variant="success">Completed</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Referrals */}
      {pendingReferrals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-primary-brown mb-4">
            ⏳ Pending Referrals ({pendingReferrals.length})
          </h3>

          <div className="space-y-3">
            {pendingReferrals.map((referral) => (
              <Card key={referral.id} className="opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-primary-brown">
                      {referral.referredName}
                    </p>
                    <p className="text-xs text-neutral-dark-gray mb-2">
                      {referral.referredEmail}
                    </p>
                    <p className="text-xs text-neutral-dark-gray">
                      Referred on{' '}
                      {new Date(referral.referralDate).toLocaleDateString(
                        'en-IN'
                      )}
                    </p>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="p-4 bg-primary-gold/10 rounded-lg border border-primary-gold/20 mt-4">
            <p className="text-xs text-primary-brown">
              💡 <strong>Tip:</strong> Referrals become confirmed once your
              friend completes their first subscription payment.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {referrals.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-4xl mb-4">🎁</p>
          <p className="text-neutral-dark-gray mb-4">
            No referrals yet. Start sharing your code!
          </p>
          <Button
            variant="primary"
            onClick={shareReferralCode}
          >
            Share Your Code
          </Button>
        </Card>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawModal && referralData && (
        <Modal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
        >
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-primary-brown mb-4">
              💳 Withdraw Balance
            </h3>

            <div className="mb-6 p-4 bg-primary-gold/10 rounded-lg">
              <p className="text-xs text-neutral-dark-gray mb-1">
                Available Balance
              </p>
              <p className="text-2xl font-bold text-primary-gold">
                <PriceDisplay amount={referralData.balance} />
              </p>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-primary-brown mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-primary-brown font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min={referralData.minWithdrawal}
                  max={referralData.balance}
                  value={withdrawAmount}
                  onChange={(e) =>
                    setWithdrawAmount(Math.max(0, parseInt(e.target.value)))
                  }
                  className="w-full pl-8 pr-3 py-2 border border-neutral-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
                  disabled={processing}
                />
              </div>
              <p className="text-xs text-neutral-dark-gray mt-2">
                Minimum: ₹{referralData.minWithdrawal} | Maximum: ₹
                {referralData.balance.toFixed(0)}
              </p>
            </div>

            {/* Withdrawal Method */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-primary-brown mb-3">
                Withdrawal Method
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setWithdrawMethod('upi')}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    withdrawMethod === 'upi'
                      ? 'border-primary-gold bg-primary-gold/10'
                      : 'border-neutral-light-gray hover:border-primary-gold'
                  }`}
                  disabled={processing}
                >
                  <p className="font-semibold text-primary-brown">
                    📱 UPI Transfer
                  </p>
                  <p className="text-xs text-neutral-dark-gray">
                    Instant transfer to your UPI account
                  </p>
                </button>

                <button
                  onClick={() => setWithdrawMethod('bank')}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    withdrawMethod === 'bank'
                      ? 'border-primary-gold bg-primary-gold/10'
                      : 'border-neutral-light-gray hover:border-primary-gold'
                  }`}
                  disabled={processing}
                >
                  <p className="font-semibold text-primary-brown">
                    🏦 Bank Transfer
                  </p>
                  <p className="text-xs text-neutral-dark-gray">
                    1-2 business days
                  </p>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowWithdrawModal(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleWithdraw}
                isLoading={processing}
              >
                Withdraw Now
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* FAQ Section */}
      <Card className="bg-gradient-to-r from-primary-gold/5 to-primary-copper/5 border border-primary-gold/20">
        <h4 className="font-semibold text-primary-brown mb-3">
          ❓ Frequently Asked Questions
        </h4>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-primary-brown mb-1">
              How long does it take to receive my earnings?
            </p>
            <p className="text-neutral-dark-gray">
              Earnings are instant! You'll see ₹100 in your balance as soon as
              your friend completes their first payment.
            </p>
          </div>
          <div>
            <p className="font-semibold text-primary-brown mb-1">
              Is there a limit to how much I can earn?
            </p>
            <p className="text-neutral-dark-gray">
              No limits! Keep referring friends and earn unlimited rewards.
            </p>
          </div>
          <div>
            <p className="font-semibold text-primary-brown mb-1">
              How do I withdraw my earnings?
            </p>
            <p className="text-neutral-dark-gray">
              Once you have a minimum balance of ₹100, you can withdraw via UPI
              or bank transfer anytime.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
