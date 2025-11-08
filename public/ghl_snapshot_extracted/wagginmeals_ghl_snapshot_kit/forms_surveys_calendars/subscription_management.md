# Subscription Management Micro-Form (GHL Form or custom endpoints)
Actions (map to your Next.js portal actions):
- Pause (up to 3 months) → tag subscriber-paused
- Resume → tag subscriber-active
- Change frequency → update wm_subscription_frequency
- Skip next delivery
- Add/remove items
- Update payment method → send to /account/payment-methods
- Cancel → tag subscriber-cancelled → schedule win-back in 14 days
