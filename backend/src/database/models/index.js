/**
 * database/models/index.js — Complete Model Registry for Shyam Diagnostic Centre & MediNextGen.
 *
 * Initialises all models using the shared Sequelize instance,
 * then registers associations in a second pass to avoid circular dependencies.
 */

import sequelize from '../../config/database.js';

import defineAdminUser from '../../models/AdminUser.js';
import defineCategory from '../../models/Category.js';
import defineTest from '../../models/Test.js';
import definePackage from '../../models/Package.js';
import definePackageTest from '../../models/PackageTest.js';
import defineOffer from '../../models/Offer.js';
import defineServiceArea from '../../models/ServiceArea.js';
import definePartnerLaboratory from '../../models/PartnerLaboratory.js';
import definePartnerServiceArea from '../../models/PartnerServiceArea.js';
import definePartnerTest from '../../models/PartnerTest.js';
import defineEnquiry from '../../models/Enquiry.js';
import defineEnquiryNote from '../../models/EnquiryNote.js';
import defineAuditLog from '../../models/AuditLog.js';
import defineSiteSettings from '../../models/SiteSettings.js';
import defineExampleRecord from '../../models/ExampleRecord.js';

// 1. Initialise all models
const AdminUser = defineAdminUser(sequelize);
const Category = defineCategory(sequelize);
const Test = defineTest(sequelize);
const Package = definePackage(sequelize);
const PackageTest = definePackageTest(sequelize);
const Offer = defineOffer(sequelize);
const ServiceArea = defineServiceArea(sequelize);
const PartnerLaboratory = definePartnerLaboratory(sequelize);
const PartnerServiceArea = definePartnerServiceArea(sequelize);
const PartnerTest = definePartnerTest(sequelize);
const Enquiry = defineEnquiry(sequelize);
const EnquiryNote = defineEnquiryNote(sequelize);
const AuditLog = defineAuditLog(sequelize);
const SiteSettings = defineSiteSettings(sequelize);
const ExampleRecord = defineExampleRecord(sequelize);

const models = {
  AdminUser,
  Category,
  Test,
  Package,
  PackageTest,
  Offer,
  ServiceArea,
  PartnerLaboratory,
  PartnerServiceArea,
  PartnerTest,
  Enquiry,
  EnquiryNote,
  AuditLog,
  SiteSettings,
  ExampleRecord,
};

// 2. Register associations after all models are initialised
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export {
  sequelize,
  AdminUser,
  Category,
  Test,
  Package,
  PackageTest,
  Offer,
  ServiceArea,
  PartnerLaboratory,
  PartnerServiceArea,
  PartnerTest,
  Enquiry,
  EnquiryNote,
  AuditLog,
  SiteSettings,
  ExampleRecord,
};

export default models;
