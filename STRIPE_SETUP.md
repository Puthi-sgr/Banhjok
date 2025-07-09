# Stripe Payment Integration Setup

This guide will help you set up Stripe payments for your delivery app.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Your Stripe API keys

## Environment Configuration

1. Create a `.env` file in the root directory of your project
2. Add the following variables:

```env
# Stripe Configuration
VITE_STRIPE_PK=your_stripe_public_key_here

# API Configuration
VITE_API_URL=your_api_url_here
```

### Getting Your Stripe Keys

1. Log in to your Stripe Dashboard
2. Go to Developers → API keys
3. Copy your **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for live mode)
4. Replace `your_stripe_public_key_here` with your actual publishable key

## Backend API Endpoints Required

Your backend needs to implement these endpoints:

### 1. Process Payment

```
POST /api/v1/orders/{orderId}/stripe-payment
```

**Request Body:**

```json
{
  "paymentMethodId": 123 // ID of saved payment method, or null for new card
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Payment completed successfully",
  "data": {
    "payment_id": 456,
    "order_id": 789,
    "amount": 2500,
    "status": "succeeded"
  }
}
```

**Response (Requires Action - 3D Secure):**

```json
{
  "success": true,
  "message": "Payment requires additional authentication",
  "data": {
    "payment_id": 456,
    "order_id": 789,
    "requires_action": true,
    "payment_intent": {
      "id": "pi_xxx",
      "client_secret": "pi_xxx_secret_xxx"
    },
    "next_action": {}
  }
}
```

**Response (Processing):**

```json
{
  "success": true,
  "message": "Payment is being processed",
  "data": {
    "payment_id": 456,
    "order_id": 789,
    "status": "processing"
  }
}
```

### 2. Setup Intent (for saving payment methods)

```
POST /api/v1/payment-methods/stripe/setup-intent
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "data": {
    "client_secret": "seti_xxx_secret_xxx"
  }
}
```

### 3. Save Payment Method

```
POST /api/v1/payment-methods/stripe/save
```

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "payment_method_id": "pm_xxx"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment method saved successfully",
  "data": {
    "payment_method_id": 123,
    "card_brand": "visa",
    "card_last4": "4242"
  }
}
```

### 4. Get Payment Methods

```
GET /api/v1/payment-methods
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Payment methods retrieved",
  "data": [
    {
      "id": 123,
      "customer_id": 456,
      "stripe_pm_id": "pm_xxx",
      "type": "card",
      "card_brand": "visa",
      "card_last4": "4242",
      "exp_month": 12,
      "exp_year": 2025,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 5. Delete Payment Method

```
DELETE /api/v1/payment-methods/stripe/{id}
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Payment method removed successfully",
  "data": null
}
```

## Features Implemented

### 1. Payment Page (`/payment`)

- **Dual Payment Modes**: Choose between saved cards or new card entry
- **Saved Payment Methods**: Display and manage previously saved cards
- **Secure Payment Processing**: Uses Stripe Elements for new cards
- **Real-time Validation**: Instant feedback on payment status
- **Error Handling**: Comprehensive error messages and recovery options
- **Responsive Design**: Matches your app's orange theme

### 2. Save Payment Method Component

- **SetupIntent Integration**: Secure tokenization using Stripe SetupIntent
- **Test Card Support**: Pre-configured test cards for development
- **Copy Functionality**: Easy copying of payment method IDs for testing
- **Visual Feedback**: Clear success/error states with icons

### 3. Saved Payment Methods Management

- **List View**: Display all saved payment methods with card details
- **Selection Interface**: Click to select a payment method for use
- **Delete Functionality**: Remove unwanted payment methods
- **Visual Indicators**: Selected state and card brand icons

### 4. Updated Checkout Flow

- **Order Creation**: Creates order first, then processes payment
- **Payment Processing**: Handles both immediate and 3D Secure payments
- **Success Handling**: Cart clearing and success page navigation
- **Payment Information**: Displays payment details on success page

## Testing

### Test Cards

Use these test card numbers for development:

- **Success:** `4242424242424242`
- **Declined:** `4000000000000002`
- **3D Secure:** `4000002500003155`

### Test Mode vs Live Mode

- Use `pk_test_` keys for development and testing
- Use `pk_live_` keys for production
- Never commit live keys to version control

## Security Notes

1. **Never expose your secret key** in the frontend
2. Always use HTTPS in production
3. Implement proper authentication for payment endpoints
4. Validate payment amounts on the backend
5. Use webhooks to handle payment status updates

## Troubleshooting

### Common Issues

1. **"No client_secret returned from backend"**

   - Check your backend API endpoint
   - Verify your Stripe secret key is correct
   - Ensure proper error handling

2. **Payment fails with "card declined"**

   - Use test cards for development
   - Check Stripe Dashboard for detailed error logs

3. **CORS errors**
   - Ensure your backend allows requests from your frontend domain
   - Check API URL configuration

### Debug Mode

Enable Stripe debug mode by adding this to your payment page:

```javascript
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK, {
  apiVersion: "2023-10-16",
  betas: ["elements_enable_deferred_intent_beta_1"],
});
```

## Next Steps

1. Set up your backend endpoints
2. Configure your environment variables
3. Test the payment flow with test cards
4. Set up webhooks for payment status updates
5. Deploy to production with live keys

## Support

For Stripe-specific issues, refer to:

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Community](https://community.stripe.com)
