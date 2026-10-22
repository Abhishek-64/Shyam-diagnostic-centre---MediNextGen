# WhatsApp Integration Guide & Workflows

## Overview

Shyam Diagnostic Centre & MediNextGen Healthcare utilizes a unified WhatsApp integration across the web application. Visitors can book tests, confirm packages, verify PIN code sample pickups, and chat directly with reception staff with zero friction.

---

## 1. How It Works

All WhatsApp interactions use the standardized `wa.me` deep-linking protocol:

```
https://wa.me/91[PHONE_NUMBER]?text=[URL_ENCODED_MESSAGE]
```

### Contextual Trigger Templates

1. **General Chat / Floating Button:**
   > *"Hello Shyam Diagnostic Centre, I would like to enquire about diagnostic tests and home sample collection."*

2. **Package Booking:**
   > *"Hello Shyam Diagnostic Centre, I would like to book the package: Full Body Health Checkup (Comprehensive) (Ref: ₹1,999). Please guide me with slot availability."*

3. **Individual Test Booking:**
   > *"Hello Shyam Diagnostic Centre, I would like to enquire about the Complete Blood Count (CBC) test (Code: CBC-01, Fee: ₹350). When can a phlebotomist visit?"*

4. **PIN-Code Availability Action:**
   > *"Hello Shyam Diagnostic Centre, I verified my PIN 395007 (Vesu / VIP Road) for home sample collection. Please confirm the earliest available morning slot."*

5. **Enquiry Followup (Staff to Patient):**
   > *"Hello [Patient Name], thank you for contacting Shyam Diagnostic Centre regarding Enquiry #[Ref]. We are reaching out to confirm your booking."*

---

## 2. Configuring the Phone Number

The WhatsApp number is centralized and can be altered in two ways:

### Option A: Via Admin Portal (No Deployment Required)
1. Log in to the Admin Portal at `/admin/login`.
2. Navigate to **Settings** (`/admin/settings`).
3. Under **Direct Communication Channels**, edit the **WhatsApp Business Number**.
4. Click **Save All Settings**. The updated number immediately applies across all frontend floating buttons, header hotlines, and package booking cards.

### Option B: Via Environment Configuration
In `backend/.env`:
```env
WHATSAPP_DEFAULT_PHONE=8320740996
```

---

## 3. Recommended WhatsApp Business Setup

To maximize patient conversion, set up the WhatsApp Business app on the dedicated front desk phone:

1. **Business Profile:**
   - Name: *Shyam Diagnostic Centre & MediNextGen*
   - Category: *Medical & Health / Diagnostic Lab*
   - Description: *NABL Accredited Pathology, Advanced Blood Tests & Home Sample Collection.*
   - Address & Business Hours (match website settings).
2. **Automated Greeting Message:**
   - *"Welcome to Shyam Diagnostic Centre & MediNextGen Healthcare! Our team has received your enquiry and will assist you with slot booking within 15 minutes."*
3. **Quick Replies:**
   - `/fasting`: *"For blood glucose and lipid profile tests, please maintain 10-12 hours of overnight fasting (water is permitted)."*
   - `/reports`: *"Routine blood test reports are delivered via WhatsApp PDF and email within 6-12 hours of sample collection."*
   - `/address`: Send Google Maps location of the main diagnostic centre.

---

## 4. WhatsApp Cloud API / Webhook Roadmap

When moving to automated enterprise messaging (automated PDF report delivery, instant slot confirmations):

1. Register with **Meta for Developers** (WhatsApp Cloud API).
2. Configure webhook endpoints in `backend/src/routes/webhooks/whatsapp.routes.js`.
3. Dispatch transactional template messages (`template: report_ready_v1`) triggered when an admin marks an enquiry as `completed` with report attachments.
