/**
 * Authorize.net Payment Service
 * Handles payment processing and CIM (Customer Information Manager) operations
 *
 * Documentation: https://developer.authorize.net/api/reference/
 */

interface AuthorizeNetConfig {
  apiLoginId: string;
  transactionKey: string;
  environment: 'sandbox' | 'production';
}

interface ChargePaymentMethodParams {
  amount: number;
  customerProfileId: string;
  customerPaymentProfileId: string;
  invoiceNumber: string;
  description?: string;
  customerId?: string;
  customerEmail?: string;
}

interface CreateCustomerProfileParams {
  customerId: string;
  email: string;
  description?: string;
}

interface CreatePaymentProfileParams {
  customerProfileId: string;
  cardNumber: string;
  expirationDate: string; // Format: YYYY-MM
  cvv: string;
  billingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
}

interface AuthorizeNetResponse {
  success: boolean;
  transactionId?: string;
  profileId?: string;
  paymentProfileId?: string;
  error?: string;
  code?: string;
  message?: string;
}

/**
 * Get Authorize.net configuration from environment
 */
function getConfig(): AuthorizeNetConfig {
  const apiLoginId = process.env.AUTHORIZENET_API_LOGIN_ID;
  const transactionKey = process.env.AUTHORIZENET_TRANSACTION_KEY;
  const environment = process.env.AUTHORIZENET_ENVIRONMENT as 'sandbox' | 'production' || 'sandbox';

  if (!apiLoginId || !transactionKey) {
    throw new Error('Authorize.net credentials not configured. Set AUTHORIZENET_API_LOGIN_ID and AUTHORIZENET_TRANSACTION_KEY environment variables.');
  }

  return {
    apiLoginId,
    transactionKey,
    environment,
  };
}

/**
 * Get Authorize.net API endpoint URL
 */
function getApiEndpoint(environment: 'sandbox' | 'production'): string {
  return environment === 'production'
    ? 'https://api.authorize.net/xml/v1/request.api'
    : 'https://apitest.authorize.net/xml/v1/request.api';
}

/**
 * Authorize.net API response structure
 */
interface AuthorizeNetApiResponse {
  messages?: {
    resultCode: string;
    message?: Array<{
      code: string;
      text: string;
    }>;
  };
  transactionResponse?: {
    responseCode?: string;
    transId?: string;
    errors?: Array<{
      errorCode: string;
      errorText: string;
    }>;
  };
  customerProfileId?: string;
  customerPaymentProfileId?: string;
}

/**
 * Make API request to Authorize.net
 */
async function makeApiRequest(endpoint: string, payload: Record<string, unknown>): Promise<AuthorizeNetApiResponse> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as AuthorizeNetApiResponse;
  } catch (error) {
    console.error('[Authorize.net] API request failed:', error);
    throw error;
  }
}

/**
 * Charge a payment method using stored Customer Profile
 *
 * @param params - Payment parameters
 * @returns Transaction ID if successful
 */
export async function chargeStoredPaymentMethod(
  params: ChargePaymentMethodParams
): Promise<AuthorizeNetResponse> {
  try {
    const config = getConfig();
    const endpoint = getApiEndpoint(config.environment);

    const payload = {
      createTransactionRequest: {
        merchantAuthentication: {
          name: config.apiLoginId,
          transactionKey: config.transactionKey,
        },
        transactionRequest: {
          transactionType: 'authCaptureTransaction',
          amount: params.amount.toFixed(2),
          profile: {
            customerProfileId: params.customerProfileId,
            paymentProfile: {
              paymentProfileId: params.customerPaymentProfileId,
            },
          },
          order: {
            invoiceNumber: params.invoiceNumber,
            description: params.description || `Order ${params.invoiceNumber}`,
          },
          customer: {
            id: params.customerId,
            email: params.customerEmail,
          },
        },
      },
    };

    console.log(`[Authorize.net] Charging payment method for invoice ${params.invoiceNumber}`);

    const response = await makeApiRequest(endpoint, payload);

    // Check response
    if (response.messages?.resultCode === 'Ok' && response.transactionResponse?.responseCode === '1') {
      const transactionId = response.transactionResponse.transId;
      console.log(`[Authorize.net] Payment successful. Transaction ID: ${transactionId}`);

      return {
        success: true,
        transactionId,
      };
    } else {
      // Payment failed
      const errorCode = response.transactionResponse?.errors?.[0]?.errorCode || response.messages?.message?.[0]?.code;
      const errorMessage = response.transactionResponse?.errors?.[0]?.errorText || response.messages?.message?.[0]?.text || 'Unknown error';

      console.error(`[Authorize.net] Payment failed: ${errorMessage} (Code: ${errorCode})`);

      return {
        success: false,
        error: errorMessage,
        code: errorCode,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
    console.error('[Authorize.net] Charge failed:', error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Create a customer profile in Authorize.net CIM
 *
 * @param params - Customer parameters
 * @returns Customer Profile ID
 */
export async function createCustomerProfile(
  params: CreateCustomerProfileParams
): Promise<AuthorizeNetResponse> {
  try {
    const config = getConfig();
    const endpoint = getApiEndpoint(config.environment);

    const payload = {
      createCustomerProfileRequest: {
        merchantAuthentication: {
          name: config.apiLoginId,
          transactionKey: config.transactionKey,
        },
        profile: {
          merchantCustomerId: params.customerId,
          email: params.email,
          description: params.description || `Customer ${params.customerId}`,
        },
      },
    };

    console.log(`[Authorize.net] Creating customer profile for ${params.email}`);

    const response = await makeApiRequest(endpoint, payload);

    if (response.messages?.resultCode === 'Ok') {
      const profileId = response.customerProfileId;
      console.log(`[Authorize.net] Customer profile created: ${profileId}`);

      return {
        success: true,
        profileId,
      };
    } else {
      // Check if profile already exists
      if (response.messages?.message?.[0]?.code === 'E00039') {
        // Duplicate profile - extract existing profile ID from error message
        const errorText = response.messages.message[0].text;
        const match = errorText.match(/ID (\d+)/);
        const profileId = match ? match[1] : null;

        if (profileId) {
          console.log(`[Authorize.net] Customer profile already exists: ${profileId}`);
          return {
            success: true,
            profileId,
          };
        }
      }

      const errorMessage = response.messages?.message?.[0]?.text || 'Unknown error';
      console.error(`[Authorize.net] Failed to create customer profile: ${errorMessage}`);

      return {
        success: false,
        error: errorMessage,
        code: response.messages?.message?.[0]?.code,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create customer profile';
    console.error('[Authorize.net] Create customer profile failed:', error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Create a payment profile (credit card) for a customer
 *
 * @param params - Payment profile parameters
 * @returns Payment Profile ID
 */
export async function createPaymentProfile(
  params: CreatePaymentProfileParams
): Promise<AuthorizeNetResponse> {
  try {
    const config = getConfig();
    const endpoint = getApiEndpoint(config.environment);

    const payload = {
      createCustomerPaymentProfileRequest: {
        merchantAuthentication: {
          name: config.apiLoginId,
          transactionKey: config.transactionKey,
        },
        customerProfileId: params.customerProfileId,
        paymentProfile: {
          billTo: {
            firstName: params.billingAddress.firstName,
            lastName: params.billingAddress.lastName,
            address: params.billingAddress.address,
            city: params.billingAddress.city,
            state: params.billingAddress.state,
            zip: params.billingAddress.zip,
            country: params.billingAddress.country || 'US',
          },
          payment: {
            creditCard: {
              cardNumber: params.cardNumber,
              expirationDate: params.expirationDate,
              cardCode: params.cvv,
            },
          },
        },
        validationMode: config.environment === 'production' ? 'liveMode' : 'testMode',
      },
    };

    console.log(`[Authorize.net] Creating payment profile for customer ${params.customerProfileId}`);

    const response = await makeApiRequest(endpoint, payload);

    if (response.messages?.resultCode === 'Ok') {
      const paymentProfileId = response.customerPaymentProfileId;
      console.log(`[Authorize.net] Payment profile created: ${paymentProfileId}`);

      return {
        success: true,
        paymentProfileId,
      };
    } else {
      const errorMessage = response.messages?.message?.[0]?.text || 'Unknown error';
      console.error(`[Authorize.net] Failed to create payment profile: ${errorMessage}`);

      return {
        success: false,
        error: errorMessage,
        code: response.messages?.message?.[0]?.code,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create payment profile';
    console.error('[Authorize.net] Create payment profile failed:', error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Test Authorize.net connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const config = getConfig();
    console.log(`[Authorize.net] Testing connection to ${config.environment} environment...`);

    // Try to get merchant details (light API call)
    const endpoint = getApiEndpoint(config.environment);
    const payload = {
      getMerchantDetailsRequest: {
        merchantAuthentication: {
          name: config.apiLoginId,
          transactionKey: config.transactionKey,
        },
      },
    };

    const response = await makeApiRequest(endpoint, payload);

    if (response.messages?.resultCode === 'Ok') {
      console.log('[Authorize.net] Connection successful!');
      return true;
    } else {
      console.error('[Authorize.net] Connection failed:', response.messages?.message?.[0]?.text);
      return false;
    }
  } catch (error) {
    console.error('[Authorize.net] Connection test failed:', error);
    return false;
  }
}

/**
 * Check if Authorize.net is configured
 */
export function isConfigured(): boolean {
  return !!(
    process.env.AUTHORIZENET_API_LOGIN_ID &&
    process.env.AUTHORIZENET_TRANSACTION_KEY
  );
}
