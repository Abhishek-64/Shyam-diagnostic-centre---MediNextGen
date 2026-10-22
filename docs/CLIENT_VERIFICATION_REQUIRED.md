# Client Verification & Audit Checklist

> **Attention Project Stakeholders & Centre Administrators:**  
> The following parameters were seeded with safe initial defaults during development. Before initiating live public advertising or clinical test marketing, the centre administration must formally verify and confirm each item below.

---

## 1. Direct Communication Channels

| Channel | Current System Value | Action Required | Responsible Party |
| :--- | :--- | :--- | :--- |
| **WhatsApp Booking Number** | `8320740996` | Verify if this is the dedicated WhatsApp Business device with phlebotomy dispatch staff. | Centre Manager |
| **Helpline / Reception Phone** | `8320740996` | Confirm multi-line PBX or alternate desk phone numbers. | Front Desk Lead |
| **Official Support Email** | `contact@shyamdiagnostic.com` | Verify domain MX records and inbox routing for online enquiry alerts. | IT / Operations |

> **How to update:** Go to **Admin Portal -> Settings** (`/admin/settings`) to update phone numbers and email instantly without code deployments.

---

## 2. Laboratory Address & Operational Hours

| Setting | Current System Value | Action Required |
| :--- | :--- | :--- |
| **Main Centre Address** | Shyam Diagnostic Centre & MediNextGen Healthcare, Surat, Gujarat, India | Provide exact building name, road, and landmark for walk-in patient footfall. |
| **Operating Hours** | Mon – Sat: 7:00 AM – 9:00 PM<br>Sun: 7:00 AM – 1:00 PM | Confirm Sunday sample processing turnaround times and holiday emergency services. |

---

## 3. Package & Test Pricing Verification

### Mandatory Guardrail
> **System Constraint:** The database strictly prevents publishing unverified packages. Any package with `priceVerified = false` **cannot** have `isPublished = true`.

1. **Full Body Health Checkup (Comprehensive)**
   - Display Price: ₹1,999 (Discounted from ₹4,500)
   - Parameters: 65+
   - Status: Needs signoff by Chief Pathologist / Billing Desk.
2. **Executive Senior Citizen Profile**
   - Display Price: ₹2,499 (Discounted from ₹5,200)
   - Parameters: 72+
   - Status: Needs signoff by Chief Pathologist / Billing Desk.
3. **Advanced Cardiac & Diabetic Risk Panel**
   - Display Price: ₹1,499 (Discounted from ₹3,000)
   - Parameters: 45+
   - Status: Needs signoff by Chief Pathologist / Billing Desk.
4. **Basic Wellness Screening**
   - Display Price: ₹799 (Discounted from ₹1,800)
   - Parameters: 32+
   - Status: Needs signoff by Chief Pathologist / Billing Desk.

---

## 4. Serviceable PIN Codes & Home Collection Reach

The website includes an exact 6-digit PIN code checker. To maintain patient trust and prevent broken promises, **unregistered PIN codes will never return "Available"**.

- **Default Seeded Central Surat PINs:**
  - `395001` (Surat City / Chowk Bazar)
  - `395002` (Ring Road / Begumpura)
  - `395003` (Varachha / Mini Bazar)
  - `395004` (Katargam / Gotalawadi)
  - `395005` (Athwa Lines / Parle Point)
  - `395006` (Adajan / Honey Park)
  - `395007` (Vesu / VIP Road)
  - `395008` (Rander / Navyug College)
  - `395009` (Pal / Gaurav Path)
- **Action Required:**
  - Review morning phlebotomist routes.
  - Add or disable specific PIN codes in **Admin Portal -> Service Areas** (`/admin/service-areas`).

---

## 5. Partner Laboratories & Accreditation Signoff

- **Current Partner Profile:** MediNextGen Reference Lab (Ahmedabad / National Hub)
- **Status:** Requires upload and administrative verification (`isAccreditationVerified: true`) of active NABL (ISO 15189) and ICMR certificates before partner badges appear live.

---

## 6. Verification Sign-Off Table

| Milestone | Verified By | Designation | Signature / Date |
| :--- | :--- | :--- | :--- |
| WhatsApp & Helplines | | Operations Head | |
| Price List Signoff | | Billing / Pathology Lead | |
| Logistics / PIN Coverage | | Logistics Supervisor | |
| Regulatory / Accreditation | | Medical Director | |
