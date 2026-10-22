'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Initial Tests
    const tests = [
      {
        name: 'Complete Blood Count (CBC with ESR)',
        code: 'CBC01',
        slug: 'complete-blood-count-cbc',
        shortDescription: 'Measures RBC, WBC, Platelets, Hemoglobin, and ESR to evaluate overall health.',
        preparationInstructions: 'No special fasting required.',
        sampleType: 'Whole Blood (EDTA)',
        reportingTime: 'Same Day (4-6 Hours)',
        priceInPaise: 35000, // ₹350
        discountPriceInPaise: 30000,
        isPopular: true,
        isHomeCollectionAvailable: true,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Fasting Blood Sugar (FBS)',
        code: 'GLU01',
        slug: 'fasting-blood-sugar-fbs',
        shortDescription: 'Measures blood glucose levels after an overnight 8-10 hour fast.',
        preparationInstructions: 'Strict 8-10 hours overnight fasting required. Water is permitted.',
        sampleType: 'Fluoride Plasma',
        reportingTime: 'Same Day',
        priceInPaise: 10000, // ₹100
        discountPriceInPaise: 8000,
        isPopular: true,
        isHomeCollectionAvailable: true,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'HbA1c (Glycated Hemoglobin)',
        code: 'HBA01',
        slug: 'hba1c-glycated-hemoglobin',
        shortDescription: 'Evaluates average blood sugar control over the past 2-3 months.',
        preparationInstructions: 'No fasting required.',
        sampleType: 'Whole Blood (EDTA)',
        reportingTime: 'Same Day',
        priceInPaise: 45000, // ₹450
        discountPriceInPaise: 40000,
        isPopular: true,
        isHomeCollectionAvailable: true,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Lipid Profile (Complete Cholesterol)',
        code: 'LIP01',
        slug: 'lipid-profile-complete',
        shortDescription: 'Total Cholesterol, HDL, LDL, VLDL, and Triglycerides assessment.',
        preparationInstructions: '10-12 hours fasting required.',
        sampleType: 'Serum',
        reportingTime: 'Same Day',
        priceInPaise: 60000, // ₹600
        discountPriceInPaise: 50000,
        isPopular: true,
        isHomeCollectionAvailable: true,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Liver Function Test (LFT Complete)',
        code: 'LFT01',
        slug: 'liver-function-test-lft',
        shortDescription: 'Bilirubin (Total/Direct/Indirect), SGOT, SGPT, Alkaline Phosphatase, Protein, Albumin.',
        preparationInstructions: '8-10 hours fasting recommended.',
        sampleType: 'Serum',
        reportingTime: 'Same Day',
        priceInPaise: 70000, // ₹700
        discountPriceInPaise: 55000,
        isPopular: true,
        isHomeCollectionAvailable: true,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Kidney Function Test (KFT / RFT with Electrolytes)',
        code: 'KFT01',
        slug: 'kidney-function-test-kft',
        shortDescription: 'Blood Urea, Serum Creatinine, Uric Acid, BUN, Sodium, Potassium, Chloride.',
        preparationInstructions: 'Overnight fasting recommended.',
        sampleType: 'Serum',
        reportingTime: 'Same Day',
        priceInPaise: 75000, // ₹750
        discountPriceInPaise: 60000,
        isPopular: true,
        isHomeCollectionAvailable: true,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Thyroid Profile Total (T3, T4, TSH)',
        code: 'THY01',
        slug: 'thyroid-profile-t3-t4-tsh',
        shortDescription: 'Comprehensive screening for hyperthyroidism and hypothyroidism.',
        preparationInstructions: 'Morning sample preferred. Fasting optional.',
        sampleType: 'Serum',
        reportingTime: 'Same Day',
        priceInPaise: 50000, // ₹500
        discountPriceInPaise: 40000,
        isPopular: true,
        isHomeCollectionAvailable: true,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Vitamin D (25-Hydroxy)',
        code: 'VITD01',
        slug: 'vitamin-d-25-hydroxy',
        shortDescription: 'Crucial for bone density, calcium absorption, and immune function.',
        preparationInstructions: 'No fasting required.',
        sampleType: 'Serum',
        reportingTime: 'Same Day',
        priceInPaise: 120000, // ₹1200
        discountPriceInPaise: 90000,
        isPopular: true,
        isHomeCollectionAvailable: true,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Vitamin B12 (Cyanocobalamin)',
        code: 'VITB01',
        slug: 'vitamin-b12',
        shortDescription: 'Essential for nerve health, brain function, and red blood cell production.',
        preparationInstructions: 'Fasting preferred.',
        sampleType: 'Serum',
        reportingTime: 'Same Day',
        priceInPaise: 90000, // ₹900
        discountPriceInPaise: 75000,
        isPopular: true,
        isHomeCollectionAvailable: true,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('tests', tests, { ignoreDuplicates: true });

    // 2. Initial Packages (featuring real asset packages)
    const packages = [
      {
        name: 'Advanced Full Body Checkup with Vitamins (92 Tests)',
        slug: 'advanced-full-body-checkup-with-vitamins',
        subtitle: 'Complete 92-parameter health checkup including Vitamin B12, Vitamin D, Thyroid, Liver, Kidney & CBC.',
        description: 'Comprehensive preventive profile covering 92 vital parameters. Includes Vitamin D Total, Vitamin B12, Iron Profile, Complete Hemogram, Liver Function, Renal Function, Lipid Profile, Blood Glucose, and Thyroid Profile.',
        parametersCovered: 92,
        fastDuration: '10-12 hours fasting required',
        reportTime: 'Same Day / 24 Hours',
        priceInPaise: 180000, // ₹1,800
        originalPriceInPaise: 380000, // ₹3,800
        isPopular: true,
        isFeatured: true,
        isHomeCollectionAvailable: false,
        priceVerified: true,
        isPublished: true,
        displayOrder: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Vitamin Gold Profile (92 Tests)',
        slug: 'vitamin-gold-profile-92-tests',
        subtitle: 'Special Promotional Package: Single Person ₹1,299 | Couple Booking @ ₹999 each!',
        description: 'Covers 92 crucial wellness parameters: Vitamin D Total, Vitamin B12, Thyroid TSH, Complete Lipid Profile, Liver & Kidney profiles, HbA1c, and CBC.',
        parametersCovered: 92,
        fastDuration: '10-12 hours fasting required',
        reportTime: 'Same Day / 24 Hours',
        priceInPaise: 99900, // ₹999
        originalPriceInPaise: 249900, // ₹2,499
        isPopular: true,
        isFeatured: true,
        isHomeCollectionAvailable: false,
        priceVerified: true,
        isPublished: true,
        displayOrder: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Healthy Hearty NCR-Delhi Special Checkup',
        slug: 'healthy-hearty-ncr-delhi-special-checkup',
        subtitle: 'Complete heart, cardiac markers, cholesterol & metabolic health screening for Delhi-NCR.',
        description: 'Dedicated cardiac & metabolic evaluation designed for Delhi-NCR residents. Includes high-sensitivity cardiac risk markers, Lipid screen, Liver, Kidney, Blood Sugar, and Complete Blood Count.',
        parametersCovered: 85,
        fastDuration: '10-12 hours fasting required',
        reportTime: 'Within 24 Hours',
        priceInPaise: 220000, // ₹2,200
        originalPriceInPaise: 450000, // ₹4,500
        isPopular: true,
        isFeatured: true,
        isHomeCollectionAvailable: false,
        priceVerified: true,
        isPublished: true,
        displayOrder: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'MediNextGen Master Health Checkup',
        slug: 'medinextgen-master-health-checkup',
        subtitle: 'Comprehensive 75+ parameter screening for total body wellness and vital organ health.',
        description: 'Includes CBC, Complete Lipid Profile, Liver Function, Kidney Function, Thyroid (TSH), Fasting Sugar, and Urine Routine.',
        parametersCovered: 75,
        fastDuration: '10-12 hours overnight fasting required',
        reportTime: 'Within 24 Hours',
        priceInPaise: 199900, // ₹1,999
        originalPriceInPaise: 399900, // ₹3,999
        isPopular: false,
        isFeatured: true,
        isHomeCollectionAvailable: false,
        priceVerified: true,
        isPublished: true,
        displayOrder: 4,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('packages', packages, { ignoreDuplicates: true });

    // 3. Initial Active Offer
    const offers = [
      {
        title: 'Flat 50% Off On Master Health Checkup',
        code: 'HEALTH50',
        description: 'Special seasonal wellness discount on all complete body checkup bookings with free home collection.',
        discountPercentage: 50,
        bannerText: 'Special Inaugural Offer: Flat 50% Off on Master Health Packages + Free Home Sample Pickup!',
        isVerified: true,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('offers', offers, { ignoreDuplicates: true });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('offers', null, {});
    await queryInterface.bulkDelete('packages', null, {});
    await queryInterface.bulkDelete('tests', null, {});
  },
};
