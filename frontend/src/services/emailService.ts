import { Resend } from 'resend'
import { generateInvoicePDF } from '@/utils/invoiceGenerator'

// Initialize Resend with API key
const apiKey = import.meta.env.VITE_RESEND_API_KEY
const resend = new Resend(apiKey)

const FROM_EMAIL = 'info@bloomme.co.in'
const FROM_NAME = 'Bloomme'

interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Email Service using Resend
 * Handles all transactional emails for Bloomme
 */
export const emailService = {
  /**
   * Send welcome email to new users
   */
  sendWelcomeEmail: async (
    email: string,
    name: string
  ): Promise<EmailResponse> => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; background-color: #f5f1ed; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px; border-radius: 8px; }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #3D2817; font-size: 32px; margin: 0; }
              .content { color: #666; line-height: 1.6; font-size: 16px; }
              .content p { margin: 15px 0; }
              .cta-button {
                display: inline-block;
                background-color: #C9681A;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
                font-weight: bold;
              }
              .plans { margin: 30px 0; }
              .plan-item {
                padding: 15px;
                margin: 10px 0;
                background-color: #f9f6f3;
                border-left: 4px solid #C9681A;
                border-radius: 4px;
              }
              .plan-name { font-weight: bold; color: #3D2817; }
              .plan-price { color: #C9681A; font-size: 18px; font-weight: bold; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px; }
              .emoji { font-size: 20px; margin-right: 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1><span class="emoji">🌸</span>Welcome to Bloomme!</h1>
              </div>

              <div class="content">
                <p>Hi <strong>${name}</strong>,</p>

                <p>Thank you for choosing <strong>Bloomme</strong>, your daily flower delivery service! Fresh flowers will be delivered to your doorstep every day between <strong>5:30 AM - 7:30 AM IST</strong>.</p>

                <p>Choose from our three beautiful plans:</p>

                <div class="plans">
                  <div class="plan-item">
                    <div class="plan-name">🌹 Traditional Plan</div>
                    <div class="plan-price">₹59/month</div>
                    <p>80-100g of fresh seasonal flowers with greenery</p>
                  </div>

                  <div class="plan-item">
                    <div class="plan-name">💐 Divine Plan</div>
                    <div class="plan-price">₹89/month</div>
                    <p>150g of premium seasonal flowers with exotic greenery</p>
                  </div>

                  <div class="plan-item">
                    <div class="plan-name">✨ Celestial Plan</div>
                    <div class="plan-price">₹179/month</div>
                    <p>200g of exotic flowers with premium arrangement</p>
                  </div>
                </div>

                <p>Get started with your subscription today:</p>

                <center>
                  <a href="https://bloomme.co.in/dashboard" class="cta-button">Go to Dashboard</a>
                </center>

                <p><strong>What makes Bloomme special?</strong></p>
                <ul>
                  <li>✓ Fresh flowers delivered daily to your door</li>
                  <li>✓ No hidden charges - transparent pricing</li>
                  <li>✓ Flexible plans - pause or resume anytime</li>
                  <li>✓ Referral rewards - earn ₹100 per friend</li>
                  <li>✓ Same-day changes to your subscription</li>
                </ul>

                <p>Have questions? Our support team is here to help at <strong>support@bloomme.co.in</strong></p>

                <p>Happy blooming! 🌺</p>
              </div>

              <div class="footer">
                <p>© 2026 Bloomme. All rights reserved.</p>
                <p>Faridabad, Haryana, India | support@bloomme.co.in</p>
              </div>
            </div>
          </body>
        </html>
      `

      const response = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: email,
        subject: `Welcome to Bloomme - Fresh Flowers Daily 🌸`,
        html: htmlContent,
      })

      if (response.error) {
        console.error('Welcome email error:', response.error)
        return {
          success: false,
          error: response.error.message || 'Failed to send welcome email',
        }
      }

      return {
        success: true,
        messageId: response.data?.id,
      }
    } catch (error) {
      console.error('Welcome email exception:', error)
      return {
        success: false,
        error: 'Exception: Failed to send welcome email',
      }
    }
  },

  /**
   * Send order confirmation email with PDF attachment
   */
  sendOrderConfirmation: async (
    email: string,
    order: any
  ): Promise<EmailResponse> => {
    try {
      // Generate PDF invoice
      let pdfBase64 = null
      try {
        pdfBase64 = generateInvoicePDF(order)
        console.log('✅ PDF invoice generated successfully')
      } catch (pdfError) {
        console.warn('⚠️ PDF generation failed, email will be sent without PDF:', pdfError)
        // Continue anyway - email still sends without PDF
      }

      // Build items list for email (handle both array and object formats)
      let itemsHtml = ''
      if (order.addOns && Array.isArray(order.addOns) && order.addOns.length > 0) {
        itemsHtml = order.addOns
          .map(
            (item: any) => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; text-align: left;">${item.name}</td>
                <td style="padding: 10px; text-align: center;">${item.quantity || 1}</td>
                <td style="padding: 10px; text-align: right;">₹${(item.price || 0).toFixed(2)}</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
              </tr>
            `
          )
          .join('')
      }

      // Add plan item if available
      if (order.plan) {
        itemsHtml = `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; text-align: left;">${order.plan.name || 'Subscription Plan'}</td>
            <td style="padding: 10px; text-align: center;">1</td>
            <td style="padding: 10px; text-align: right;">₹${(order.plan.price || 0).toFixed(2)}</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">₹${(order.plan.price || 0).toFixed(2)}</td>
          </tr>
        ` + itemsHtml
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; background-color: #f5f1ed; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px; border-radius: 8px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #C9681A; padding-bottom: 20px; }
              .header h1 { color: #3D2817; font-size: 28px; margin: 0; }
              .header .checkmark { font-size: 40px; margin-right: 10px; }
              .content { color: #666; line-height: 1.6; font-size: 14px; }
              .section { margin: 25px 0; }
              .section-title { font-weight: bold; color: #3D2817; font-size: 16px; margin-bottom: 15px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              table th { background-color: #f9f6f3; padding: 12px; text-align: left; font-weight: bold; color: #3D2817; border-bottom: 2px solid #C9681A; }
              .summary { background-color: #f9f6f3; padding: 15px; border-radius: 4px; margin-top: 20px; }
              .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
              .summary-total { border-top: 2px solid #C9681A; padding-top: 12px; margin-top: 10px; font-size: 18px; font-weight: bold; color: #C9681A; }
              .cta-button {
                display: inline-block;
                background-color: #C9681A;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 4px;
                margin: 15px 0;
                font-weight: bold;
              }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px; }
              .delivery-info { background-color: #f0f7ff; padding: 15px; border-left: 4px solid #0066cc; border-radius: 4px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1><span class="checkmark">✓</span>Order Confirmed!</h1>
              </div>

              <div class="content">
                <p>Hi ${order.user?.name || 'there'},</p>

                <p>Thank you for your order! Your flowers will start being delivered as per your selected schedule.</p>

                <div class="section">
                  <div class="section-title">📋 Order Details</div>
                  <p><strong>Order ID:</strong> ${order.id}</p>
                  <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div class="section">
                  <div class="section-title">🎁 Items Ordered</div>
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>

                  <div class="summary">
                    <div class="summary-row">
                      <span>Subtotal:</span>
                      <span>₹${(order.subtotal || 0).toFixed(2)}</span>
                    </div>
                    ${order.tax ? `<div class="summary-row"><span>GST (5%):</span><span>₹${(order.tax || 0).toFixed(2)}</span></div>` : ''}
                    ${order.promoDiscount ? `<div class="summary-row"><span>Promo Discount:</span><span>-₹${(order.promoDiscount || 0).toFixed(2)}</span></div>` : ''}
                    ${order.referralDiscount ? `<div class="summary-row"><span>Referral Credit:</span><span>-₹${(order.referralDiscount || 0).toFixed(2)}</span></div>` : ''}
                    <div class="summary-row summary-total">
                      <span>TOTAL:</span>
                      <span>₹${(order.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div class="delivery-info">
                  <div style="font-weight: bold; color: #0066cc; margin-bottom: 8px;">📅 Delivery Information</div>
                  <p style="margin: 5px 0;"><strong>First Delivery:</strong> ${new Date(order.nextDelivery || order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p style="margin: 5px 0;"><strong>Delivery Time:</strong> 5:30 AM - 7:30 AM IST</p>
                  <p style="margin: 5px 0;">Make sure someone is home to receive your flowers! You can always update your delivery instructions from your dashboard.</p>
                </div>

                <center>
                  <a href="https://bloomme.co.in/dashboard" class="cta-button">View Order in Dashboard</a>
                </center>

                <p><strong>What's next?</strong></p>
                <ul>
                  <li>Check your dashboard for order status</li>
                  <li>Update delivery address or instructions anytime</li>
                  <li>Add more items or manage your subscription</li>
                  <li>Share your Bloomme experience on social media!</li>
                </ul>

                <p>Questions or need help? Contact us at <strong>support@bloomme.co.in</strong> or reply to this email.</p>

                <p>Thank you for choosing Bloomme! 🌸</p>
              </div>

              <div class="footer">
                <p>© 2026 Bloomme. All rights reserved.</p>
                <p>Faridabad, Haryana, India | support@bloomme.co.in</p>
              </div>
            </div>
          </body>
        </html>
      `

      const emailParams: any = {
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: email,
        subject: `Order Confirmation ✓ - ${order.id}`,
        html: htmlContent,
      }

      // Add PDF attachment if generated successfully
      if (pdfBase64) {
        emailParams.attachments = [
          {
            content: pdfBase64,
            filename: `invoice-${order.id}.pdf`,
            contentType: 'application/pdf',
          },
        ]
      }

      const response = await resend.emails.send(emailParams)

      if (response.error) {
        console.error('Order confirmation email error:', response.error)
        return {
          success: false,
          error: response.error.message || 'Failed to send order confirmation',
        }
      }

      return {
        success: true,
        messageId: response.data?.id,
      }
    } catch (error) {
      console.error('Order confirmation email exception:', error)
      return {
        success: false,
        error: 'Exception: Failed to send order confirmation',
      }
    }
  },

  /**
   * Send delivery reminder email
   */
  sendDeliveryReminder: async (
    email: string,
    userName: string
  ): Promise<EmailResponse> => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; background-color: #f5f1ed; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px; border-radius: 8px; }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #3D2817; font-size: 28px; margin: 0; }
              .content { color: #666; line-height: 1.6; font-size: 16px; }
              .reminder-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
              .cta-button {
                display: inline-block;
                background-color: #C9681A;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 4px;
                margin: 15px 0;
                font-weight: bold;
              }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🌸 Your Flowers Are Coming Tomorrow!</h1>
              </div>

              <div class="content">
                <p>Hi ${userName},</p>

                <div class="reminder-box">
                  <p><strong>🎁 Delivery Tomorrow!</strong></p>
                  <p>Your Bloomme flowers will be delivered tomorrow between <strong>5:30 AM - 7:30 AM IST</strong>.</p>
                </div>

                <p><strong>What you need to know:</strong></p>
                <ul>
                  <li>Be home or arrange someone to receive your flowers</li>
                  <li>Flowers will be delivered to your registered address</li>
                  <li>Keep flowers in water immediately after delivery</li>
                  <li>For updates, check your dashboard anytime</li>
                </ul>

                <center>
                  <a href="https://bloomme.co.in/dashboard" class="cta-button">View Dashboard</a>
                </center>

                <p>Need to change your delivery instructions or address? You can update it anytime from your dashboard.</p>

                <p>Thank you for being a Bloomme member! 🌺</p>
              </div>

              <div class="footer">
                <p>© 2026 Bloomme. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `

      const response = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: email,
        subject: `Your Bloomme Flowers Are Coming Tomorrow! 🌸`,
        html: htmlContent,
      })

      if (response.error) {
        console.error('Delivery reminder email error:', response.error)
        return {
          success: false,
          error: response.error.message || 'Failed to send reminder',
        }
      }

      return {
        success: true,
        messageId: response.data?.id,
      }
    } catch (error) {
      console.error('Delivery reminder email exception:', error)
      return {
        success: false,
        error: 'Exception: Failed to send reminder',
      }
    }
  },
}

export default emailService
