# Bloomme Component Stories & Usage Examples

All components are exported from `@/components` for easy importing.

## Form Components

### PhoneInput
```tsx
import { PhoneInput } from '@/components'

<PhoneInput
  value={phoneNumber}
  onChange={setPhoneNumber}
  label="Mobile Number"
/>
```

### EmailInput
```tsx
import { EmailInput } from '@/components'

<EmailInput
  value={email}
  onChange={setEmail}
  label="Email Address"
/>
```

### QuantitySelector
```tsx
import { QuantitySelector } from '@/components'

<QuantitySelector
  value={quantity}
  onChange={setQuantity}
  label="Quantity"
  min={1}
  max={10}
/>
```

### DateRangeSelector
```tsx
import { DateRangeSelector } from '@/components'

<DateRangeSelector
  startDate={start}
  endDate={end}
  onChangeStart={setStart}
  onChangeEnd={setEnd}
  label="Select Delivery Period"
/>
```

### RadioButtonGroup
```tsx
import { RadioButtonGroup } from '@/components'

<RadioButtonGroup
  options={[
    { value: 'daily', label: 'Daily', description: 'Delivered every day' },
    { value: 'weekly', label: 'Weekly', description: 'Delivered once a week' },
  ]}
  value={selectedFrequency}
  onChange={setSelectedFrequency}
  label="Delivery Frequency"
/>
```

## Calendar Components

### Calendar
```tsx
import { Calendar } from '@/components'

<Calendar
  selectedDates={selectedDates}
  onSelectDate={(day) => setSelectedDates([...selectedDates, day])}
  onDeselectDate={(day) => setSelectedDates(selectedDates.filter(d => d !== day))}
  month={currentMonth}
  year={currentYear}
  multiSelect={true}
/>
```

### WeekdaySelector
```tsx
import { WeekdaySelector } from '@/components'

<WeekdaySelector
  selectedDays={[1, 3, 5]} // Mon, Wed, Fri
  onChange={setDeliveryDays}
  label="Select Delivery Days"
/>
```

## Display Components

### Badge
```tsx
import { Badge } from '@/components'

<Badge variant="primary">New</Badge>
<Badge variant="success" icon="✓">Completed</Badge>
<Badge variant="warning" size="sm">Popular</Badge>
```

### Alert
```tsx
import { Alert } from '@/components'

<Alert
  type="success"
  title="Success!"
  message="Your order has been placed"
  dismissible={true}
  onDismiss={handleClose}
/>
```

### PriceDisplay
```tsx
import { PriceDisplay } from '@/components'

<PriceDisplay
  amount={599}
  label="Per Month"
  size="lg"
  currency="₹"
/>
```

### LoadingSpinner
```tsx
import { LoadingSpinner } from '@/components'

// Inline spinner
<LoadingSpinner size="md" text="Loading..." />

// Full-screen spinner
<LoadingSpinner fullScreen={true} text="Processing..." />
```

## Complex Components

### Modal
```tsx
import { Modal, Button } from '@/components'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Order"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to place this order?</p>
</Modal>
```

### Stepper
```tsx
import { Stepper } from '@/components'

<Stepper
  steps={[
    { id: '1', title: 'Personal Info', description: 'Your details' },
    { id: '2', title: 'Address', description: 'Delivery address' },
    { id: '3', title: 'Payment', description: 'Payment method' },
  ]}
  currentStep={currentStep}
  onStepClick={goToStep}
/>
```

### Accordion
```tsx
import { Accordion } from '@/components'

<Accordion
  items={[
    { id: '1', title: 'What is included?', content: 'Fresh flowers daily...' },
    { id: '2', title: 'How to cancel?', content: 'You can cancel anytime...' },
  ]}
  allowMultiple={false}
  defaultOpen={['1']}
/>
```

### Tabs
```tsx
import { Tabs } from '@/components'

<Tabs
  tabs={[
    { id: 'plans', label: 'Plans', icon: '📦', content: <PlansContent /> },
    { id: 'addons', label: 'Add-ons', icon: '🌸', content: <AddOnsContent /> },
  ]}
  defaultTab="plans"
  variant="underline"
/>
```

### Toast/Notifications
```tsx
import { useToast } from '@/components'

const MyComponent = () => {
  const { success, error, info, warning, toasts } = useToast()

  const handlePayment = async () => {
    try {
      await makePayment()
      success('Payment successful!')
    } catch (err) {
      error('Payment failed. Please try again.')
    }
  }

  return (
    <>
      <button onClick={handlePayment}>Pay Now</button>
      <ToastContainer toasts={toasts} />
    </>
  )
}
```

## Composite Components

### PlanCard
```tsx
import { PlanCard } from '@/components'

<PlanCard
  plan={planData}
  selected={selectedPlan === plan.id}
  onSelect={() => selectPlan(plan.id)}
  highlighted={plan.id === 'divine'}
  pricePerDay={59 / 30}
/>
```

### AddOnCardGrid
```tsx
import { AddOnCardGrid } from '@/components'

<AddOnCardGrid
  addOns={addOnsList}
  selectedAddOns={selectedAddOns}
  onAddOnChange={(id, quantity) => updateAddOn(id, quantity)}
  showQuantity={true}
/>
```

### OrderSummary
```tsx
import { OrderSummary } from '@/components'

<OrderSummary
  summary={orderSummary}
  onPromoCodeChange={applyPromoCode}
  readonly={false}
/>
```

### CheckoutProgress
```tsx
import { CheckoutProgress } from '@/components'

<CheckoutProgress
  currentStep={currentStep}
  totalSteps={5}
  flowType="subscription"
  onStepClick={goToStep}
/>
```

## Layout Components

### AppLayout
```tsx
import { AppLayout, Container, Card, Section, PageHeader } from '@/components'

<AppLayout>
  <Container maxWidth="lg">
    <PageHeader title="Welcome" subtitle="Select your plan" />
    <Section>
      <Card highlighted={true}>
        Your content here
      </Card>
    </Section>
  </Container>
</AppLayout>
```

## Styling with Design Tokens

All components use CSS variables from the design system:

```css
/* Colors */
var(--color-primary-sacred-gold)
var(--color-primary-warm-copper)
var(--color-primary-deep-brown)
var(--color-neutral-cream)
var(--color-success)
var(--color-error)

/* Spacing */
var(--spacing-sm)   /* 8px */
var(--spacing-md)   /* 16px */
var(--spacing-lg)   /* 24px */

/* Typography */
var(--font-size-base)
var(--font-size-lg)
var(--font-size-2xl)

/* Shadows */
var(--shadow-md)
var(--shadow-lg)
```
