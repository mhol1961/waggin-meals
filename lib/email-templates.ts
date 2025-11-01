interface OrderItem {
  product_name: string;
  variant_title: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface OrderEmailData {
  order_number: string;
  customer_first_name: string;
  customer_email: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_address: ShippingAddress;
  created_at: string;
}

export function generateOrderConfirmationEmail(order: OrderEmailData): { subject: string; html: string; text: string } {
  const subject = `Order Confirmation #${order.order_number} - Waggin Meals`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #a5b5eb;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
    }
    .order-info {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .order-number {
      font-size: 24px;
      font-weight: bold;
      color: #a5b5eb;
      margin-bottom: 10px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      margin-top: 30px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #a5b5eb;
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid #eeeeee;
    }
    .item:last-child {
      border-bottom: none;
    }
    .item-details {
      flex: 1;
    }
    .item-name {
      font-weight: bold;
      color: #333333;
      margin-bottom: 5px;
    }
    .item-variant {
      color: #666666;
      font-size: 14px;
    }
    .item-quantity {
      color: #999999;
      font-size: 14px;
    }
    .item-price {
      font-weight: bold;
      color: #333333;
      white-space: nowrap;
    }
    .totals {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .total-row.grand-total {
      font-size: 20px;
      font-weight: bold;
      padding-top: 15px;
      margin-top: 10px;
      border-top: 2px solid #a5b5eb;
    }
    .address-box {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      line-height: 1.8;
    }
    .footer {
      background-color: #333333;
      color: #ffffff;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #a5b5eb;
      text-decoration: none;
    }
    .button {
      display: inline-block;
      padding: 15px 30px;
      background-color: #a5b5eb;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 Waggin' Meals</h1>
    </div>

    <div class="content">
      <div class="order-info">
        <div class="order-number">Order #${order.order_number}</div>
        <p style="margin: 0; color: #666666;">
          Thank you for your order, ${order.customer_first_name}! We're excited to help nourish your furry friend.
        </p>
      </div>

      <p>
        Your order has been confirmed and will be processed shortly. You'll receive another email when your items ship.
      </p>

      <div class="section-title">Order Summary</div>
      <div style="margin-bottom: 20px;">
        ${order.items.map(item => `
          <div class="item">
            <div class="item-details">
              <div class="item-name">${item.product_name}</div>
              ${item.variant_title ? `<div class="item-variant">${item.variant_title}</div>` : ''}
              <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">$${item.total_price.toFixed(2)}</div>
          </div>
        `).join('')}
      </div>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${order.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Shipping:</span>
          <span>$${order.shipping_cost.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Tax:</span>
          <span>$${order.tax.toFixed(2)}</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>$${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div class="section-title">Shipping Address</div>
      <div class="address-box">
        ${order.shipping_address.first_name} ${order.shipping_address.last_name}<br>
        ${order.shipping_address.address_line1}<br>
        ${order.shipping_address.address_line2 ? `${order.shipping_address.address_line2}<br>` : ''}
        ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}<br>
        ${order.shipping_address.country}
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p>Questions about your order?</p>
        <a href="https://wagginmeals.com/contact" class="button">Contact Us</a>
      </div>
    </div>

    <div class="footer">
      <p>
        <strong>Waggin' Meals</strong><br>
        Premium Dog Nutrition<br>
        <a href="https://wagginmeals.com">wagginmeals.com</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #999999;">
        This is an automated email. Please do not reply directly to this message.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Order Confirmation #${order.order_number} - Waggin Meals

Thank you for your order, ${order.customer_first_name}!

Your order has been confirmed and will be processed shortly. You'll receive another email when your items ship.

ORDER SUMMARY
-------------
${order.items.map(item =>
  `${item.product_name}${item.variant_title ? ` - ${item.variant_title}` : ''}
Quantity: ${item.quantity}
Price: $${item.total_price.toFixed(2)}`
).join('\n\n')}

TOTALS
------
Subtotal: $${order.subtotal.toFixed(2)}
Shipping: $${order.shipping_cost.toFixed(2)}
Tax: $${order.tax.toFixed(2)}
Total: $${order.total.toFixed(2)}

SHIPPING ADDRESS
----------------
${order.shipping_address.first_name} ${order.shipping_address.last_name}
${order.shipping_address.address_line1}
${order.shipping_address.address_line2 ? order.shipping_address.address_line2 + '\n' : ''}${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}
${order.shipping_address.country}

Questions? Visit https://wagginmeals.com/contact

---
Waggin' Meals - Premium Dog Nutrition
https://wagginmeals.com
  `;

  return { subject, html, text };
}

export function generateOrderShippedEmail(order: OrderEmailData & { tracking_number?: string; carrier?: string }): { subject: string; html: string; text: string } {
  const subject = `Your Order #${order.order_number} Has Shipped! 🚚`;

  const trackingInfo = order.tracking_number ? `
    <div class="tracking-box">
      <div style="font-weight: bold; margin-bottom: 10px;">Tracking Information</div>
      <div>Carrier: ${order.carrier || 'USPS'}</div>
      <div>Tracking Number: <strong>${order.tracking_number}</strong></div>
    </div>
  ` : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Shipped</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #a5b5eb;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
    }
    .tracking-box {
      background-color: #f0f4ff;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #a5b5eb;
    }
    .footer {
      background-color: #333333;
      color: #ffffff;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 Order Shipped!</h1>
    </div>

    <div class="content">
      <h2>Great news, ${order.customer_first_name}!</h2>
      <p>
        Your order #${order.order_number} is on its way! Your pup's premium nutrition is headed to your door.
      </p>

      ${trackingInfo}

      <p>
        Your items should arrive within 3-5 business days. If you have any questions, please don't hesitate to contact us.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://wagginmeals.com/contact" style="display: inline-block; padding: 15px 30px; background-color: #a5b5eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Contact Support
        </a>
      </div>
    </div>

    <div class="footer">
      <p>
        <strong>Waggin' Meals</strong><br>
        Premium Dog Nutrition<br>
        <a href="https://wagginmeals.com" style="color: #a5b5eb; text-decoration: none;">wagginmeals.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Your Order Has Shipped! 🚚

Great news, ${order.customer_first_name}!

Your order #${order.order_number} is on its way! Your pup's premium nutrition is headed to your door.

${order.tracking_number ? `
TRACKING INFORMATION
--------------------
Carrier: ${order.carrier || 'USPS'}
Tracking Number: ${order.tracking_number}
` : ''}

Your items should arrive within 3-5 business days. If you have any questions, please contact us at https://wagginmeals.com/contact

---
Waggin' Meals - Premium Dog Nutrition
https://wagginmeals.com
  `;

  return { subject, html, text };
}

export function generateOrderProcessingEmail(order: OrderEmailData): { subject: string; html: string; text: string } {
  const subject = `Your Order #${order.order_number} is Being Processed 📦`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Processing</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #a5b5eb; padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .status-box { background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
    .footer { background-color: #333333; color: #ffffff; padding: 30px; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>🐾 Order in Progress</h1></div>
    <div class="content">
      <h2>Hi ${order.customer_first_name}!</h2>
      <p>Great news! Your order #${order.order_number} is currently being processed by our team.</p>
      <div class="status-box">
        <div style="font-weight: bold; margin-bottom: 10px;">⏳ Current Status: Processing</div>
        <div>We're carefully preparing your pup's premium nutrition. You'll receive a shipping confirmation with tracking information once your order is on its way!</div>
      </div>
      <p><strong>What's next?</strong><br>• Our team is packing your order with care<br>• You'll receive tracking information within 1-2 business days<br>• Estimated delivery: 3-5 business days after shipment</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://wagginmeals.com/contact" style="display: inline-block; padding: 15px 30px; background-color: #a5b5eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">Questions? Contact Us</a>
      </div>
    </div>
    <div class="footer">
      <p><strong>Waggin' Meals</strong><br>Premium Dog Nutrition<br><a href="https://wagginmeals.com" style="color: #a5b5eb; text-decoration: none;">wagginmeals.com</a></p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `Your Order is Being Processed 📦

Hi ${order.customer_first_name}!
Great news! Your order #${order.order_number} is currently being processed by our team.

CURRENT STATUS: Processing
⏳ We're carefully preparing your pup's premium nutrition.

WHAT'S NEXT?
• Our team is packing your order with care
• You'll receive tracking information within 1-2 business days
• Estimated delivery: 3-5 business days after shipment

Questions? Visit https://wagginmeals.com/contact`;

  return { subject, html, text };
}

export function generateOrderOutForDeliveryEmail(order: OrderEmailData & { tracking_number?: string; carrier?: string }): { subject: string; html: string; text: string } {
  const subject = `Your Order #${order.order_number} is Out for Delivery Today! 🚚`;
  const trackingInfo = order.tracking_number ? `<div class="tracking-box"><div style="font-weight: bold; margin-bottom: 10px;">Tracking Information</div><div>Carrier: ${order.carrier || 'USPS'}</div><div>Tracking Number: <strong>${order.tracking_number}</strong></div></div>` : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Out for Delivery</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #28a745; padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .tracking-box { background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
    .footer { background-color: #333333; color: #ffffff; padding: 30px; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>🐾 Out for Delivery!</h1></div>
    <div class="content">
      <h2>Your order arrives today, ${order.customer_first_name}!</h2>
      <p>Exciting news! Your order #${order.order_number} is out for delivery and should arrive at your door today.</p>
      ${trackingInfo}
      <p><strong>What to expect:</strong><br>• Your package will be delivered today during normal business hours<br>• No signature required (unless specified)<br>• Someone should be available to receive the package</p>
      <p><strong>Storage tip:</strong> Once delivered, refrigerate or freeze your pup's fresh meals immediately to maintain peak freshness!</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://wagginmeals.com/contact" style="display: inline-block; padding: 15px 30px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">Need Help?</a>
      </div>
    </div>
    <div class="footer">
      <p><strong>Waggin' Meals</strong><br>Premium Dog Nutrition<br><a href="https://wagginmeals.com" style="color: #a5b5eb; text-decoration: none;">wagginmeals.com</a></p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `Your Order is Out for Delivery Today! 🚚

Your order arrives today, ${order.customer_first_name}!
Exciting news! Your order #${order.order_number} is out for delivery and should arrive at your door today.

${order.tracking_number ? `TRACKING: ${order.carrier || 'USPS'} - ${order.tracking_number}` : ''}

WHAT TO EXPECT:
• Delivery today during normal business hours
• No signature required (unless specified)
• Storage tip: Refrigerate or freeze immediately upon delivery!

Questions? Visit https://wagginmeals.com/contact`;

  return { subject, html, text };
}

export function generateOrderDeliveredEmail(order: OrderEmailData): { subject: string; html: string; text: string } {
  const subject = `Your Order #${order.order_number} Has Been Delivered! 🎉`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Delivered</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #28a745; padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .success-box { background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; text-align: center; }
    .button { display: inline-block; padding: 15px 30px; background-color: #a5b5eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 5px; }
    .footer { background-color: #333333; color: #ffffff; padding: 30px; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>🐾 Delivered Successfully!</h1></div>
    <div class="content">
      <h2>Great news, ${order.customer_first_name}!</h2>
      <p>Your order #${order.order_number} has been successfully delivered! We hope your pup is already wagging with excitement.</p>
      <div class="success-box">
        <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
        <div style="font-weight: bold; font-size: 18px;">Delivery Confirmed</div>
      </div>
      <p><strong>Important Reminders:</strong><br>• Store fresh meals in the refrigerator or freezer immediately<br>• Follow feeding guidelines on the package<br>• Introduce new foods gradually over 7-10 days<br>• Fresh meals can be refrigerated for up to 5 days or frozen for up to 6 months</p>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #a5b5eb;">How's your experience?</h3>
        <p>We'd love to hear how your pup enjoys their premium nutrition! Your feedback helps us serve you better.</p>
        <div style="text-align: center;">
          <a href="https://wagginmeals.com/testimonials" class="button">Share Your Story</a>
          <a href="https://wagginmeals.com/shop" class="button" style="background-color: #28a745;">Reorder Now</a>
        </div>
      </div>
      <p style="text-align: center; color: #666666; font-size: 14px;">Questions or concerns? We're here to help!</p>
      <div style="text-align: center;">
        <a href="https://wagginmeals.com/contact" class="button">Contact Support</a>
      </div>
    </div>
    <div class="footer">
      <p><strong>Waggin' Meals</strong><br>Premium Dog Nutrition<br><a href="https://wagginmeals.com" style="color: #a5b5eb; text-decoration: none;">wagginmeals.com</a></p>
      <p style="margin-top: 20px; font-size: 12px; color: #999999;">Thank you for trusting us with your pup's nutrition! 🐕❤️</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `Your Order Has Been Delivered! 🎉

Great news, ${order.customer_first_name}!
Your order #${order.order_number} has been successfully delivered!

✅ DELIVERY CONFIRMED

IMPORTANT REMINDERS:
• Store fresh meals in refrigerator/freezer immediately
• Follow feeding guidelines on the package
• Introduce new foods gradually over 7-10 days
• Refrigerate up to 5 days or freeze up to 6 months

Share your story: https://wagginmeals.com/testimonials
Reorder now: https://wagginmeals.com/shop
Contact us: https://wagginmeals.com/contact

Thank you for trusting us with your pup's nutrition! 🐕❤️`;

  return { subject, html, text };
}

export function generateSubscriptionCreatedEmail(subscription: {
  subscription_id: string;
  customer_name: string;
  product_title: string;
  variant_title?: string;
  quantity: number;
  price: number;
  frequency: string;
  next_billing_date: string;
}): { subject: string; html: string; text: string } {
  const subject = `Subscription Confirmed - Waggin' Meals`;

  const frequencyDisplay = subscription.frequency === 'bi-weekly' ? 'Every 2 Weeks' :
    subscription.frequency === 'weekly' ? 'Weekly' : 'Monthly';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Confirmed</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #a5b5eb; padding: 30px 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .subscription-box { background-color: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #a5b5eb; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #666666; }
    .detail-value { font-weight: bold; color: #333333; }
    .highlight-box { background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
    .button { display: inline-block; padding: 15px 30px; background-color: #a5b5eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 5px; }
    .footer { background-color: #333333; color: #ffffff; padding: 30px; text-align: center; font-size: 14px; }
    .footer a { color: #a5b5eb; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 Subscription Activated!</h1>
    </div>

    <div class="content">
      <h2>Welcome to your subscription, ${subscription.customer_name}!</h2>
      <p>
        Your recurring delivery is all set up! Your pup will never run out of their premium nutrition.
      </p>

      <div class="subscription-box">
        <h3 style="margin-top: 0; color: #a5b5eb;">Subscription Details</h3>

        <div class="detail-row">
          <span class="detail-label">Product:</span>
          <span class="detail-value">${subscription.product_title}${subscription.variant_title ? ` - ${subscription.variant_title}` : ''}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Quantity:</span>
          <span class="detail-value">${subscription.quantity}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Frequency:</span>
          <span class="detail-value">${frequencyDisplay}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Price per Delivery:</span>
          <span class="detail-value">$${(subscription.price * subscription.quantity).toFixed(2)}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Next Billing Date:</span>
          <span class="detail-value">${subscription.next_billing_date}</span>
        </div>
      </div>

      <div class="highlight-box">
        <div style="font-weight: bold; margin-bottom: 10px;">✓ Your First Order is Processing</div>
        <div>Your initial subscription order has been charged and will ship within 1-2 business days. Future orders will be automatically charged and shipped on your billing schedule.</div>
      </div>

      <h3 style="color: #a5b5eb;">Manage Your Subscription</h3>
      <p>
        You have complete control! You can pause, skip, modify, or cancel your subscription anytime from your account dashboard.
      </p>

      <ul style="line-height: 2;">
        <li>Pause deliveries when you have extra food</li>
        <li>Skip a delivery if you're traveling</li>
        <li>Update delivery frequency</li>
        <li>Change products or quantities</li>
        <li>Cancel anytime - no commitments</li>
      </ul>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wagginmeals.com/account/subscriptions" class="button">Manage Subscription</a>
        <a href="https://wagginmeals.com/shop" class="button" style="background-color: #28a745;">Shop More Products</a>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 30px;">
        <h3 style="margin-top: 0; color: #a5b5eb;">Need Help?</h3>
        <p style="margin-bottom: 10px;">Our team is here to help with any questions about your subscription.</p>
        <p>
          <strong>Email:</strong> <a href="mailto:support@wagginmeals.com" style="color: #a5b5eb;">support@wagginmeals.com</a><br>
          <strong>Visit:</strong> <a href="https://wagginmeals.com/contact" style="color: #a5b5eb;">Contact Support</a>
        </p>
      </div>
    </div>

    <div class="footer">
      <p>
        <strong>Waggin' Meals</strong><br>
        Premium Dog Nutrition<br>
        <a href="https://wagginmeals.com">wagginmeals.com</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #999999;">
        This is an automated email. Please do not reply directly to this message.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Subscription Confirmed - Waggin' Meals

Welcome to your subscription, ${subscription.customer_name}!

Your recurring delivery is all set up! Your pup will never run out of their premium nutrition.

SUBSCRIPTION DETAILS
--------------------
Product: ${subscription.product_title}${subscription.variant_title ? ` - ${subscription.variant_title}` : ''}
Quantity: ${subscription.quantity}
Frequency: ${frequencyDisplay}
Price per Delivery: $${(subscription.price * subscription.quantity).toFixed(2)}
Next Billing Date: ${subscription.next_billing_date}

✓ YOUR FIRST ORDER IS PROCESSING
Your initial subscription order has been charged and will ship within 1-2 business days. Future orders will be automatically charged and shipped on your billing schedule.

MANAGE YOUR SUBSCRIPTION
You have complete control! You can pause, skip, modify, or cancel your subscription anytime from your account dashboard.

• Pause deliveries when you have extra food
• Skip a delivery if you're traveling
• Update delivery frequency
• Change products or quantities
• Cancel anytime - no commitments

Manage your subscription: https://wagginmeals.com/account/subscriptions
Shop more products: https://wagginmeals.com/shop

NEED HELP?
Email: support@wagginmeals.com
Visit: https://wagginmeals.com/contact

---
Waggin' Meals - Premium Dog Nutrition
https://wagginmeals.com
  `;

  return { subject, html, text };
}
