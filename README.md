# SalonBook — Beauty & Salon Appointment Booking

SalonBook is a web-based beauty salon appointment booking platform. Customers can explore salon services, create an account, book appointments, manage their bookings, and make payments. Administrators can manage salon services, appointments, users, and transactions.

## Live Website

- **Frontend:** [https://solonbook-client-obo9.vercel.app](https://solonbook-client-obo9.vercel.app)
- **Backend:** [https://salonbook-server-rbcg.vercel.app](https://salonbook-server-rbcg.vercel.app)

## Features

### Customer
- Browse salon services and view service details.
- Search and filter services by category.
- Create an account and sign in using email/password or Google.
- Update profile information and profile image.
- Book appointments by selecting a date and time slot.
- View appointment details and booking history.
- Cancel eligible pending appointments.
- Reschedule eligible appointments.
- Pay for confirmed appointments through Stripe.
- View payment information.

### Administrator
- Access protected admin dashboard pages.
- View dashboard overview and analytics.
- Create, update, activate/deactivate, and delete services.
- View and manage all appointments.
- Confirm or cancel eligible appointments.
- View and manage users.
- View transaction records.

### General
- Responsive interface for desktop, tablet, and mobile.
- Authentication and role-based access control.
- Protected API requests using JWT.
- Image uploads using ImgBB.
- Stripe checkout and webhook-based payment confirmation.
- Toast notifications and form validation.
- Vercel Speed Insights integration.

## Technology Stack

### Frontend
- **Framework:** Next.js (App Router) & React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Better Auth
- **Payments:** Stripe
- **Image Hosting:** ImgBB
- **Deployment:** Vercel

### Backend
- **Runtime & Framework:** Node.js & Express.js
- **Database:** MongoDB
- **Auth Verification:** Better Auth JWT
- **Payments:** Stripe Webhooks

## Getting Started

### Requirements
- Node.js
- npm
- Git

### Installation

1. **Clone the frontend repository:**
   ```bash
   git clone <YOUR_FRONTEND_REPOSITORY_URL>