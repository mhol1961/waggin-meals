/**
 * Paid Consultation Email Templates
 * These templates are used for the $395 consultation service
 */

/**
 * Paid Consultation Confirmed Email (Customer)
 */
export function generatePaidConsultationConfirmedEmail(data: {
  consultationId: string;
  customerName: string;
  email: string;
  phone: string;
  dogs: any[];
  preferredFormat: string;
}): { subject: string; html: string; text: string } {
  const subject = 'Consultation Payment Confirmed | Waggin Meals';
  const dogNames = data.dogs.map(d => d.name).join(' and ');

  const html = `<!DOCTYPE html><html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;"><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><div style="text-align: center; padding: 30px; background: linear-gradient(to right, #a5b5eb, #c5d4f7); border-radius: 8px 8px 0 0;"><h1 style="color: white; margin: 0; font-size: 28px;">Payment Confirmed!</h1></div><div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;"><p style="font-size: 16px;">Hi ${data.customerName},</p><p style="font-size: 16px;">Thank you for your payment! Your $395 comprehensive canine nutrition consultation is confirmed.</p><div style="background: #e8f4fb; padding: 20px; border-radius: 8px; margin: 20px 0;"><h3 style="margin-top: 0; color: #3c3a47;">What Happens Next?</h3><ol style="margin: 0; padding-left: 20px; line-height: 1.8;"><li>Christie will review your questionnaire within 24-48 hours</li><li>We'll call you to schedule your ${data.preferredFormat || 'consultation'}</li><li>You'll receive a comprehensive meal plan tailored to ${dogNames}</li><li>Two follow-up consultations are included for ongoing support</li></ol></div><p style="font-size: 16px;">If you have any immediate questions, please don't hesitate to reach out!</p><p style="font-size: 16px; margin-top: 30px;">Warm regards,<br/><strong>Christie & The Waggin Meals Team</strong></p></div><div style="background: #3c3a47; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;"><p style="color: #ffffff; margin: 0; font-size: 14px;">Waggin Meals Pet Nutrition Co.<br/><a href="mailto:info@wagginmeals.com" style="color: #a5b5eb;">info@wagginmeals.com</a></p></div></div></body></html>`;

  const text = `CONSULTATION PAYMENT CONFIRMED\n\nHi ${data.customerName},\n\nThank you for your payment! Your $395 comprehensive canine nutrition consultation is confirmed.\n\nWHAT HAPPENS NEXT?\n\n1. Christie will review your questionnaire within 24-48 hours\n2. We'll call you to schedule your ${data.preferredFormat || 'consultation'}\n3. You'll receive a comprehensive meal plan tailored to ${dogNames}\n4. Two follow-up consultations are included for ongoing support\n\nWarm regards,\nChristie & The Waggin Meals Team\n\n---\nWaggin Meals Pet Nutrition Co.\ninfo@wagginmeals.com`;

  return { subject, html, text };
}

/**
 * New Paid Consultation Email (Admin)
 */
export function generateAdminNewPaidConsultationEmail(data: {
  consultationId: string;
  customerName: string;
  email: string;
  phone: string;
  dogs: any[];
  currentDiet: any;
  goals: string;
  preferredFormat: string;
  orderId: string;
  amount: number;
}): { subject: string; html: string; text: string } {
  const subject = `NEW $395 Consultation - ${data.customerName}`;

  const html = `<!DOCTYPE html><html><body style="font-family: Arial, sans-serif;"><div style="max-width: 800px; margin: 0 auto; padding: 20px;"><div style="background: linear-gradient(to right, #a5b5eb, #c5d4f7); padding: 30px; text-align: center;"><h1 style="color: white; margin: 0;">New Paid Consultation</h1><p style="color: white;">$${data.amount.toFixed(2)} Payment Received</p></div><div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0;"><p><strong>Consultation ID:</strong> ${data.consultationId}<br/><strong>Order ID:</strong> ${data.orderId}<br/><a href="https://wagginmeals.com/admin/paid-consultations/${data.consultationId}">View in Admin Dashboard</a></p><h2>Contact</h2><p><strong>${data.customerName}</strong><br/><a href="mailto:${data.email}">${data.email}</a><br/><a href="tel:${data.phone}">${data.phone}</a></p><h2>Preferred Format</h2><p>${data.preferredFormat || 'Not specified'}</p><h2>Dogs (${data.dogs.length})</h2>${data.dogs.map((dog, idx) => `<div style="background: #e8f4fb; padding: 15px; margin-bottom: 15px;"><strong>${dog.name}</strong> - ${dog.breed}, ${dog.age}, ${dog.weight}</div>`).join('')}<h2>Current Diet</h2><p>${data.currentDiet.currentFood} - ${data.currentDiet.feedingFrequency}</p><h2>Goals</h2><p>${data.goals}</p><div style="background: #d4edda; padding: 20px; margin-top: 30px;"><h3>Next Steps</h3><ol><li>Review questionnaire</li><li>Call to schedule</li><li>Conduct consultation</li><li>Deliver meal plan</li></ol></div></div></div></body></html>`;

  const text = `NEW PAID CONSULTATION - $${data.amount.toFixed(2)}\n\nConsultation ID: ${data.consultationId}\nView: https://wagginmeals.com/admin/paid-consultations/${data.consultationId}\n\nCONTACT\n${data.customerName}\n${data.email}\n${data.phone}\n\nDOGS: ${data.dogs.map(d => `${d.name} (${d.breed})`).join(', ')}\n\nCURRENT DIET: ${data.currentDiet.currentFood}\n\nGOALS:\n${data.goals}\n\nNEXT STEPS:\n1. Review questionnaire\n2. Call to schedule\n3. Conduct consultation\n4. Deliver meal plan`;

  return { subject, html, text };
}
