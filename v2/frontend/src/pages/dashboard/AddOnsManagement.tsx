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
  Calendar,
} from '@/components'
import { getAPI, postAPI } from '@/lib/api'

interface AddOn {
  id: string
  name: string
  quantity: number
  price: number
  totalPrice: number
  deliveryDates: number[]
  status: 'active' | 'paused' | 'completed'
}

interface AddOnsData {
  addOns: AddOn[]
}

export const AddOnsManagement: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [addOns, setAddOns] = useState<AddOn[]>([])
  const [selectedAddOn, setSelectedAddOn] = useState<AddOn | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<
    'edit-quantity' | 'edit-dates' | 'remove' | null
  >(null)
  const [editQuantity, setEditQuantity] = useState(0)
  const [selectedDates, setSelectedDates] = useState<number[]>([])
  const [currentMonth] = useState(new Date().getMonth())
  const [currentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    loadAddOns()
  }, [])

  const loadAddOns = async () => {
    try {
      const token = sessionStorage.getItem('authToken')
      if (!token) {
        navigate('/login')
        return
      }

      const response = await getAPI<AddOnsData>('/api/addons/my-addons', token)

      if (response.success && response.data?.addOns) {
        setAddOns(response.data.addOns)
      } else {
        setError('Failed to load add-ons')
      }
    } catch (err) {
      setError('Failed to load add-ons')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async () => {
    if (!selectedAddOn) return

    setProcessing(true)
    try {
      const token = sessionStorage.getItem('authToken')
      const response = await postAPI(
        `/api/addons/${selectedAddOn.id}/quantity`,
        { quantity: editQuantity },
        token || ''
      )

      if (response.success) {
        setSuccess('Quantity updated successfully')
        setShowModal(false)
        setModalType(null)
        loadAddOns()
      } else {
        setError(
          response.error?.message || 'Failed to update quantity'
        )
      }
    } catch (err) {
      setError('Failed to update quantity')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleUpdateDates = async () => {
    if (!selectedAddOn) return

    setProcessing(true)
    try {
      const token = sessionStorage.getItem('authToken')
      const response = await postAPI(
        `/api/addons/${selectedAddOn.id}/delivery-dates`,
        { deliveryDates: selectedDates },
        token || ''
      )

      if (response.success) {
        setSuccess('Delivery dates updated successfully')
        setShowModal(false)
        setModalType(null)
        loadAddOns()
      } else {
        setError(
          response.error?.message || 'Failed to update delivery dates'
        )
      }
    } catch (err) {
      setError('Failed to update delivery dates')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleRemoveAddOn = async () => {
    if (!selectedAddOn) return

    setProcessing(true)
    try {
      const token = sessionStorage.getItem('authToken')
      const response = await postAPI(
        `/api/addons/${selectedAddOn.id}/remove`,
        {},
        token || ''
      )

      if (response.success) {
        setSuccess('Add-on removed successfully')
        setShowModal(false)
        setModalType(null)
        loadAddOns()
      } else {
        setError(
          response.error?.message || 'Failed to remove add-on'
        )
      }
    } catch (err) {
      setError('Failed to remove add-on')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const openModal = (
    type: 'edit-quantity' | 'edit-dates' | 'remove',
    addOn: AddOn
  ) => {
    setSelectedAddOn(addOn)
    setModalType(type)
    if (type === 'edit-quantity') {
      setEditQuantity(addOn.quantity)
    } else if (type === 'edit-dates') {
      setSelectedDates(addOn.deliveryDates || [])
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType(null)
    setSelectedAddOn(null)
    setEditQuantity(0)
    setSelectedDates([])
  }

  const handleDateToggle = (day: number) => {
    if (selectedDates.includes(day)) {
      setSelectedDates(selectedDates.filter((d) => d !== day))
    } else {
      setSelectedDates([...selectedDates, day])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading add-ons..." />
      </div>
    )
  }

  const activeAddOns = addOns.filter((ao) => ao.status === 'active')
  const completedAddOns = addOns.filter((ao) => ao.status === 'completed')

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Manage Add-ons"
        subtitle="Edit quantities, delivery dates, or remove add-ons"
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

      {/* Active Add-ons */}
      <div>
        <h3 className="text-lg font-semibold text-primary-brown mb-4">
          Active Add-ons ({activeAddOns.length})
        </h3>

        {activeAddOns.length > 0 ? (
          <div className="space-y-3">
            {activeAddOns.map((addOn) => (
              <Card key={addOn.id}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Add-on Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-3">
                      <div>
                        <h4 className="text-base font-semibold text-primary-brown">
                          {addOn.name}
                        </h4>
                        <p className="text-xs text-neutral-dark-gray">
                          ID: {addOn.id}
                        </p>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Quantity */}
                      <div>
                        <p className="text-xs text-neutral-dark-gray mb-1">
                          Quantity
                        </p>
                        <p className="text-lg font-bold text-primary-brown">
                          {addOn.quantity}x
                        </p>
                      </div>

                      {/* Unit Price */}
                      <div>
                        <p className="text-xs text-neutral-dark-gray mb-1">
                          Unit Price
                        </p>
                        <p className="text-lg font-bold text-primary-brown">
                          <PriceDisplay amount={addOn.price} />
                        </p>
                      </div>

                      {/* Total Price */}
                      <div>
                        <p className="text-xs text-neutral-dark-gray mb-1">
                          Total
                        </p>
                        <p className="text-lg font-bold text-primary-gold">
                          <PriceDisplay amount={addOn.totalPrice} />
                        </p>
                      </div>

                      {/* Delivery Days */}
                      <div>
                        <p className="text-xs text-neutral-dark-gray mb-1">
                          Delivery
                        </p>
                        <p className="text-sm font-semibold text-primary-brown">
                          {addOn.deliveryDates?.length > 0
                            ? `${addOn.deliveryDates.length} days`
                            : 'All days'}
                        </p>
                      </div>
                    </div>

                    {/* Delivery Dates Tags */}
                    {addOn.deliveryDates && addOn.deliveryDates.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-neutral-light-gray">
                        <p className="text-xs font-semibold text-neutral-dark-gray mb-2">
                          DELIVERY DATES
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {addOn.deliveryDates.map((date) => (
                            <span
                              key={date}
                              className="bg-primary-gold/10 text-primary-brown px-2 py-1 rounded text-xs font-semibold"
                            >
                              Day {date}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:w-48">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openModal('edit-quantity', addOn)}
                    >
                      ✏️ Edit Quantity
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openModal('edit-dates', addOn)}
                    >
                      📅 Change Dates
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal('remove', addOn)}
                      className="text-semantic-error"
                    >
                      🗑 Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-neutral-dark-gray mb-4">
              No active add-ons yet
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/addons/select')}
            >
              Add Items Now
            </Button>
          </Card>
        )}
      </div>

      {/* Completed Add-ons */}
      {completedAddOns.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-primary-brown mb-4">
            Completed Add-ons ({completedAddOns.length})
          </h3>

          <div className="space-y-3">
            {completedAddOns.map((addOn) => (
              <Card key={addOn.id} className="opacity-75">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-neutral-dark-gray">
                      {addOn.name}
                    </h4>
                    <p className="text-xs text-neutral-dark-gray mt-1">
                      {addOn.quantity}x @ <PriceDisplay amount={addOn.price} />
                      /unit = <PriceDisplay amount={addOn.totalPrice} />
                    </p>
                  </div>
                  <Badge variant="info">Completed</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add More Items */}
      <Card className="bg-gradient-to-r from-primary-gold/10 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-primary-brown">Want More?</h4>
            <p className="text-sm text-neutral-dark-gray">
              Add more items to your next delivery
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/addons/select')}
          >
            + Add More Items
          </Button>
        </div>
      </Card>

      {/* Modal */}
      {showModal && selectedAddOn && (
        <Modal isOpen={showModal} onClose={closeModal}>
          <div className="max-w-sm mx-auto">
            {modalType === 'edit-quantity' && (
              <div>
                <h3 className="text-lg font-semibold text-primary-brown mb-4">
                  Edit Quantity: {selectedAddOn.name}
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-primary-brown mb-3">
                    New Quantity
                  </label>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        setEditQuantity(Math.max(1, editQuantity - 1))
                      }
                      className="w-10 h-10 flex items-center justify-center border border-neutral-light-gray rounded-lg hover:bg-neutral-light-gray"
                      disabled={processing || editQuantity <= 1}
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editQuantity}
                      onChange={(e) =>
                        setEditQuantity(Math.max(1, parseInt(e.target.value)))
                      }
                      className="flex-1 text-center text-2xl font-bold border-b-2 border-primary-gold focus:outline-none"
                      disabled={processing}
                    />

                    <button
                      onClick={() =>
                        setEditQuantity(Math.min(10, editQuantity + 1))
                      }
                      className="w-10 h-10 flex items-center justify-center border border-neutral-light-gray rounded-lg hover:bg-neutral-light-gray"
                      disabled={processing || editQuantity >= 10}
                    >
                      +
                    </button>
                  </div>

                  <p className="text-xs text-neutral-dark-gray mt-2">
                    New Total:{' '}
                    <PriceDisplay
                      amount={editQuantity * selectedAddOn.price}
                    />
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={closeModal}
                    disabled={processing}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpdateQuantity}
                    isLoading={processing}
                  >
                    Update Quantity
                  </Button>
                </div>
              </div>
            )}

            {modalType === 'edit-dates' && (
              <div>
                <h3 className="text-lg font-semibold text-primary-brown mb-4">
                  Select Delivery Dates: {selectedAddOn.name}
                </h3>

                <div className="mb-6">
                  <p className="text-sm text-neutral-dark-gray mb-4">
                    Choose which days you want this add-on delivered
                  </p>

                  <div className="bg-white p-4 rounded-lg border border-neutral-light-gray">
                    <Calendar
                      selectedDates={selectedDates}
                      onSelectDate={handleDateToggle}
                      onDeselectDate={handleDateToggle}
                      month={currentMonth}
                      year={currentYear}
                      multiSelect={true}
                    />
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-neutral-dark-gray">
                      {selectedDates.length === 0
                        ? 'No days selected - delivery will be on all days'
                        : `${selectedDates.length} day(s) selected`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={closeModal}
                    disabled={processing}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpdateDates}
                    isLoading={processing}
                  >
                    Update Dates
                  </Button>
                </div>
              </div>
            )}

            {modalType === 'remove' && (
              <div>
                <h3 className="text-lg font-semibold text-semantic-error mb-4">
                  Remove {selectedAddOn.name}?
                </h3>

                <p className="text-neutral-dark-gray mb-2">
                  This add-on will be removed from your active orders.
                </p>

                <p className="text-sm text-neutral-dark-gray mb-6">
                  💡 You can add it back anytime from the add-ons section.
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    onClick={closeModal}
                    disabled={processing}
                  >
                    Keep
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleRemoveAddOn}
                    isLoading={processing}
                    className="bg-semantic-error hover:bg-semantic-error/90"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
