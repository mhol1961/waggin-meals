# GoHighLevel Custom Fields Reference

## All Custom Fields (54 total)

Create these in GHL: **Settings → Custom Fields**

| Field Key | Type | Description |
|-----------|------|-------------|
| `wm_customer_id` | TEXT | customer id |
| `wm_first_name` | TEXT | first name |
| `wm_last_name` | TEXT | last name |
| `wm_email` | EMAIL | email |
| `wm_phone` | PHONE | phone |
| `wm_accepts_marketing` | CHECKBOX | accepts marketing |
| `wm_email_verified` | CHECKBOX | email verified |
| `wm_created_at` | DATE | created at |
| `wm_address_line1` | TEXT | address line1 |
| `wm_address_line2` | TEXT | address line2 |
| `wm_city` | TEXT | city |
| `wm_state` | TEXT | state |
| `wm_postal_code` | TEXT | postal code |
| `wm_country` | TEXT | country |
| `wm_authnet_profile_id` | TEXT | authnet profile id |
| `wm_authnet_payment_profile_id` | TEXT | authnet payment profile id |
| `wm_card_type` | TEXT | card type |
| `wm_card_last_four` | TEXT | card last four |
| `wm_card_expiration` | TEXT | card expiration |
| `wm_payment_method_is_default` | CHECKBOX | payment method is default |
| `wm_total_orders` | NUMBER | total orders |
| `wm_total_spent` | MONETARY | total spent |
| `wm_average_order_value` | MONETARY | average order value |
| `wm_last_order_date` | DATE | last order date |
| `wm_last_order_number` | TEXT | last order number |
| `wm_last_order_amount` | MONETARY | last order amount |
| `wm_last_shipping_method` | TEXT | last shipping method |
| `wm_has_subscription` | CHECKBOX | has subscription |
| `wm_subscription_id` | TEXT | subscription id |
| `wm_subscription_status` | TEXT | subscription status |
| `wm_subscription_frequency` | TEXT | subscription frequency |
| `wm_subscription_amount` | MONETARY | subscription amount |
| `wm_subscription_next_billing` | DATE | subscription next billing |
| `wm_subscription_last_billing` | DATE | subscription last billing |
| `wm_subscription_start_date` | DATE | subscription start date |
| `wm_subscription_items` | TEXT | subscription items |
| `wm_consultation_booked` | CHECKBOX | consultation booked |
| `wm_consultation_date` | DATE_TIME | consultation date |
| `wm_consultation_status` | TEXT | consultation status |
| `wm_consultation_paid` | CHECKBOX | consultation paid |
| `wm_consultation_type` | TEXT | consultation type |
| `wm_dog_name` | TEXT | dog name |
| `wm_dog_breed` | TEXT | dog breed |
| `wm_dog_age` | NUMBER | dog age |
| `wm_dog_weight` | NUMBER | dog weight |
| `wm_health_concerns` | TEXT | health concerns |
| `wm_cart_abandoned` | CHECKBOX | cart abandoned |
| `wm_cart_abandon_date` | DATE_TIME | cart abandon date |
| `wm_cart_items` | TEXT | cart items |
| `wm_cart_value` | MONETARY | cart value |
| `wm_cart_recovery_sent` | CHECKBOX | cart recovery sent |
| `wm_cart_recovered` | CHECKBOX | cart recovered |
| `wm_is_first_order` | CHECKBOX | is first order |
| `wm_geo_segment` | TEXT | geo segment |

## Field Categories

### Customer Data (15 fields)
- wm_customer_id, wm_first_name, wm_last_name, wm_email, wm_phone
- wm_accepts_marketing, wm_email_verified, wm_created_at
- wm_address_line1, wm_address_line2, wm_city, wm_state, wm_postal_code, wm_country

### Payment Data (6 fields)
- wm_authnet_profile_id, wm_authnet_payment_profile_id
- wm_card_type, wm_card_last_four, wm_card_expiration
- wm_payment_method_is_default

### Order History (7 fields)
- wm_total_orders, wm_total_spent, wm_average_order_value
- wm_last_order_date, wm_last_order_number, wm_last_order_amount
- wm_last_shipping_method

### Subscription Data (10 fields)
- wm_has_subscription, wm_subscription_id, wm_subscription_status
- wm_subscription_frequency, wm_subscription_amount
- wm_subscription_next_billing, wm_subscription_last_billing
- wm_subscription_start_date, wm_subscription_items

### Consultation Data (6 fields)
- wm_consultation_booked, wm_consultation_date, wm_consultation_status
- wm_consultation_paid, wm_consultation_type

### Pet Data (5 fields)
- wm_dog_name, wm_dog_breed, wm_dog_age, wm_dog_weight
- wm_health_concerns

### Cart Abandonment (7 fields)
- wm_cart_abandoned, wm_cart_abandon_date, wm_cart_items
- wm_cart_value, wm_cart_recovery_sent, wm_cart_recovered

### Segmentation (2 fields)
- wm_is_first_order, wm_geo_segment

