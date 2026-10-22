'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Initial Categories
    const categories = [
      {
        name: 'Full Body Health Checkups',
        slug: 'full-body-checkups',
        description: 'Comprehensive preventive health packages covering major organs and biomarkers.',
        iconName: 'Activity',
        displayOrder: 1,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Pathology & Blood Tests',
        slug: 'pathology',
        description: 'Routine and specialized blood, urine, and body fluid laboratory examinations.',
        iconName: 'Droplet',
        displayOrder: 2,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Diabetes Care',
        slug: 'diabetes-care',
        description: 'HbA1c, Fasting Blood Sugar, PPBS, and diabetic organ profile tests.',
        iconName: 'HeartPulse',
        displayOrder: 3,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Cardiac & Lipid Profile',
        slug: 'cardiac-lipid',
        description: 'Complete cholesterol profile, lipid ratios, ECG, and cardiovascular risk indicators.',
        iconName: 'Heart',
        displayOrder: 4,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Thyroid & Endocrine',
        slug: 'thyroid-endocrine',
        description: 'T3, T4, TSH, Free T3, Free T4, and thyroid antibody investigations.',
        iconName: 'ShieldAlert',
        displayOrder: 5,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Liver & Kidney Profiles',
        slug: 'liver-kidney',
        description: 'LFT, KFT/RFT, creatinine, uric acid, electrolytes, and renal function markers.',
        iconName: 'ActivitySquare',
        displayOrder: 6,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Women's Wellness",
        slug: 'womens-wellness',
        description: 'Hormonal assays, anemia panel, prenatal screens, calcium, and bone density tests.',
        iconName: 'Users',
        displayOrder: 7,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Senior Citizen Health',
        slug: 'senior-citizen',
        description: 'Tailored geriatric assessments for bone, kidney, heart, and metabolic wellness.',
        iconName: 'UserCheck',
        displayOrder: 8,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('categories', categories, { ignoreDuplicates: true });

    // 2. Default Public & Private Site Settings
    const settings = [
      {
        settingKey: 'whatsapp_number',
        settingValue: process.env.WHATSAPP_DEFAULT_PHONE || '8320740996',
        isPublic: true,
        description: 'Default WhatsApp booking & enquiry number',
        createdAt: now,
        updatedAt: now,
      },
      {
        settingKey: 'phone_number',
        settingValue: '8320740996',
        isPublic: true,
        description: 'Primary customer support phone number',
        createdAt: now,
        updatedAt: now,
      },
      {
        settingKey: 'business_address',
        settingValue: 'Shyam Diagnostic Centre & MediNextGen Healthcare, Surat, Gujarat, India',
        isPublic: true,
        description: 'Main centre physical address',
        createdAt: now,
        updatedAt: now,
      },
      {
        settingKey: 'business_hours',
        settingValue: 'Mon – Sat: 7:00 AM – 9:00 PM | Sun: 7:00 AM – 1:00 PM',
        isPublic: true,
        description: 'Operating working hours',
        createdAt: now,
        updatedAt: now,
      },
      {
        settingKey: 'email_contact',
        settingValue: 'contact@shyamdiagnostic.com',
        isPublic: true,
        description: 'General support email address',
        createdAt: now,
        updatedAt: now,
      },
      {
        settingKey: 'home_collection_charges_text',
        settingValue: 'Free Home Collection on select packages & central areas',
        isPublic: true,
        description: 'Banner text for home collection',
        createdAt: now,
        updatedAt: now,
      },
      {
        settingKey: 'home_collection_free_pincodes',
        settingValue: '395001,395002,395003,395004,395005,395006,395007,395008,395009',
        isPublic: true,
        description: 'Comma-separated free home collection PIN codes',
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('site_settings', settings, { ignoreDuplicates: true });

    // 3. Central Service Areas (Sample Surat PIN codes)
    const serviceAreas = [
      { pinCode: '395001', areaName: 'Surat City / Chowk Bazar', city: 'Surat', state: 'Gujarat', isHomeCollectionActive: true, isAllIndiaPartner: false, createdAt: now, updatedAt: now },
      { pinCode: '395002', areaName: 'Ring Road / Begumpura', city: 'Surat', state: 'Gujarat', isHomeCollectionActive: true, isAllIndiaPartner: false, createdAt: now, updatedAt: now },
      { pinCode: '395003', areaName: 'Varachha / Mini Bazar', city: 'Surat', state: 'Gujarat', isHomeCollectionActive: true, isAllIndiaPartner: false, createdAt: now, updatedAt: now },
      { pinCode: '395004', areaName: 'Katargam / Gotalawadi', city: 'Surat', state: 'Gujarat', isHomeCollectionActive: true, isAllIndiaPartner: false, createdAt: now, updatedAt: now },
      { pinCode: '395007', areaName: 'Vesu / University Area', city: 'Surat', state: 'Gujarat', isHomeCollectionActive: true, isAllIndiaPartner: false, createdAt: now, updatedAt: now },
      { pinCode: '395009', areaName: 'Adajan / Pal', city: 'Surat', state: 'Gujarat', isHomeCollectionActive: true, isAllIndiaPartner: false, createdAt: now, updatedAt: now },
    ];

    await queryInterface.bulkInsert('service_areas', serviceAreas, { ignoreDuplicates: true });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('site_settings', null, {});
    await queryInterface.bulkDelete('service_areas', null, {});
  },
};
