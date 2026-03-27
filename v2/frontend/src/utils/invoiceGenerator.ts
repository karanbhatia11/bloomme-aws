import jsPDF from 'jspdf'

export const generateInvoicePDF = (order: any): string => {
  try {
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    // Set default font
    doc.setFont('helvetica', 'normal')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 15

    // HEADER: Bloomme Logo & Title
    doc.setFontSize(20)
    doc.setTextColor(196, 160, 82) // Primary gold
    doc.text('🌸 BLOOMME', 20, yPosition)
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Daily Puja Flower Delivery', 20, yPosition + 8)

    yPosition += 25

    // INVOICE HEADER
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('INVOICE', pageWidth - 20, yPosition, { align: 'right' })

    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`Invoice #: ${order.id}`, pageWidth - 20, yPosition + 7, {
      align: 'right',
    })
    doc.text(
      `Date: ${new Date(order.orderDate || new Date()).toLocaleDateString('en-IN')}`,
      pageWidth - 20,
      yPosition + 14,
      { align: 'right' }
    )

    yPosition += 25

    // BILL TO SECTION
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.text('BILL TO:', 20, yPosition)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    yPosition += 7
    doc.text(`Name: ${order.user?.name || 'N/A'}`, 20, yPosition)
    yPosition += 6
    doc.text(`Email: ${order.user?.email || 'N/A'}`, 20, yPosition)
    yPosition += 6
    doc.text(`Phone: ${order.user?.phone || 'N/A'}`, 20, yPosition)

    yPosition += 12

    // DELIVERY ADDRESS SECTION
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('DELIVERY ADDRESS:', 20, yPosition)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    yPosition += 7
    const address = order.deliveryAddress
    if (address) {
      doc.text(address.street || '', 20, yPosition)
      yPosition += 6
      doc.text(
        `${address.city || ''}, ${address.zipCode || address.postalCode || ''}`,
        20,
        yPosition
      )
      if (address.instructions) {
        yPosition += 6
        doc.text(`Instructions: ${address.instructions}`, 20, yPosition)
      }
    }

    yPosition += 15

    // ITEMS TABLE
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.setFillColor(196, 160, 82) // Gold background

    // Table header
    const colWidths = {
      item: 80,
      quantity: 30,
      price: 30,
      total: 30,
    }

    doc.rect(20, yPosition, pageWidth - 40, 8, 'F') // Header background
    doc.text('Item', 25, yPosition + 6)
    doc.text('Qty', 25 + colWidths.item, yPosition + 6)
    doc.text('Price', 25 + colWidths.item + colWidths.quantity, yPosition + 6)
    doc.text(
      'Total',
      25 + colWidths.item + colWidths.quantity + colWidths.price,
      yPosition + 6
    )

    yPosition += 10

    // Table rows
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(9)

    // Main plan
    if (order.plan) {
      doc.text(
        order.plan.name || 'Subscription Plan',
        25,
        yPosition,
        { maxWidth: colWidths.item - 5 }
      )
      doc.text(
        '1',
        25 + colWidths.item + 5,
        yPosition,
        { align: 'center' }
      )
      doc.text(
        `₹${order.plan.price || 0}`,
        25 + colWidths.item + colWidths.quantity + 5,
        yPosition,
        { align: 'right' }
      )
      doc.text(
        `₹${order.plan.price || 0}`,
        25 + colWidths.item + colWidths.quantity + colWidths.price + 5,
        yPosition,
        { align: 'right' }
      )
      yPosition += 7
    }

    // Add-ons
    if (order.addOns && order.addOns.length > 0) {
      order.addOns.forEach((addon: any) => {
        doc.text(
          addon.name || 'Add-on',
          25,
          yPosition,
          { maxWidth: colWidths.item - 5 }
        )
        doc.text(
          String(addon.quantity || 1),
          25 + colWidths.item + 5,
          yPosition,
          { align: 'center' }
        )
        doc.text(
          `₹${addon.price || 0}`,
          25 + colWidths.item + colWidths.quantity + 5,
          yPosition,
          { align: 'right' }
        )
        doc.text(
          `₹${(addon.price || 0) * (addon.quantity || 1)}`,
          25 + colWidths.item + colWidths.quantity + colWidths.price + 5,
          yPosition,
          { align: 'right' }
        )
        yPosition += 7
      })
    }

    yPosition += 8

    // TOTALS SECTION
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)

    const labelX = pageWidth - 80
    const valueX = pageWidth - 20

    doc.text('Subtotal:', labelX, yPosition)
    doc.text(`₹${order.subscriptionSubtotal || order.subtotal || 0}`, valueX, yPosition, { align: 'right' })
    yPosition += 7

    doc.text('Tax (GST 5%):', labelX, yPosition)
    doc.text(`₹${order.tax || 0}`, valueX, yPosition, { align: 'right' })
    yPosition += 7

    if (order.promoDiscount && order.promoDiscount > 0) {
      doc.text('Promo Discount:', labelX, yPosition)
      doc.text(`-₹${order.promoDiscount}`, valueX, yPosition, {
        align: 'right',
      })
      yPosition += 7
    }

    if (order.referralDiscount && order.referralDiscount > 0) {
      doc.text('Referral Credit:', labelX, yPosition)
      doc.text(`-₹${order.referralDiscount}`, valueX, yPosition, {
        align: 'right',
      })
      yPosition += 7
    }

    // Total (bold)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(196, 160, 82) // Gold
    doc.text('TOTAL:', labelX, yPosition)
    doc.text(`₹${order.total || 0}`, valueX, yPosition, { align: 'right' })

    yPosition += 15

    // DELIVERY INFORMATION
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text('DELIVERY INFORMATION', 20, yPosition)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    yPosition += 7
    doc.text(
      `First Delivery: ${new Date(order.deliveryDates?.[0] || order.orderDate || new Date()).toLocaleDateString('en-IN')}`,
      20,
      yPosition
    )
    yPosition += 6
    doc.text('Delivery Time: 5:30 AM - 7:30 AM', 20, yPosition)
    yPosition += 6
    doc.text('Daily delivery to your address', 20, yPosition)

    // FOOTER
    yPosition = pageHeight - 15
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      'Thank you for choosing Bloomme! For support, email: support@bloomme.co.in',
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    )

    // Generate PDF and return as base64 string (for email attachment)
    const pdfDataUri = doc.output('datauristring')
    const base64String = pdfDataUri.split(',')[1]

    return base64String
  } catch (error) {
    console.error('PDF generation failed:', error)
    throw error
  }
}

// Alternative: Download PDF (for user download from dashboard later)
export const downloadInvoicePDF = (order: any) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    // Reuse the same content generation logic
    // For now, just save with a simple structure
    doc.setFontSize(16)
    doc.text('Invoice', 20, 20)
    doc.setFontSize(11)
    doc.text(`Order ID: ${order.id}`, 20, 30)
    doc.text(`Total: ₹${order.total}`, 20, 40)

    doc.save(`invoice-${order.id}.pdf`)
  } catch (error) {
    console.error('PDF download failed:', error)
  }
}
