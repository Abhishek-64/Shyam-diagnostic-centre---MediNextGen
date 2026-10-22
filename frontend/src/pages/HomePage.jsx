import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Search,
  ArrowRight,
  Award,
  Users,
  Activity,
  Phone,
  MapPin,
  FlaskConical,
  HeartPulse,
  BadgeCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import api from '../services/api.js';
import PackageCard from '../components/catalogue/PackageCard.jsx';
import TestCard from '../components/catalogue/TestCard.jsx';
import CategoryCard from '../components/catalogue/CategoryCard.jsx';
import WhatsAppButton from '../components/common/WhatsAppButton.jsx';
import Modal from '../components/common/Modal.jsx';
import EnquiryForm from '../components/forms/EnquiryForm.jsx';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [popularTests, setPopularTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carousel State for Packages (4-second horizontal auto-scroll)
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const carouselTrackRef = useRef(null);

  // Carousel State for Tests (4-second horizontal auto-scroll)
  const [testCarouselIndex, setTestCarouselIndex] = useState(0);
  const [isTestCarouselHovered, setIsTestCarouselHovered] = useState(false);
  const testCarouselTrackRef = useRef(null);

  // Quick Hero Search State
  const [heroSearch, setHeroSearch] = useState('');

  // Booking Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [pkgRes, catRes, testRes] = await Promise.allSettled([
          api.get('/packages?limit=8'),
          api.get('/categories'),
          api.get('/tests?limit=10'),
        ]);

        if (pkgRes.status === 'fulfilled' && pkgRes.value.data?.success) {
          const pkgs = pkgRes.value.data.data.items || pkgRes.value.data.data || [];
          setFeaturedPackages(pkgs);
        }
        if (catRes.status === 'fulfilled' && catRes.value.data?.success) {
          setCategories(catRes.value.data.data.slice(0, 8) || []);
        }
        if (testRes.status === 'fulfilled' && testRes.value.data?.success) {
          const tests = testRes.value.data.data.items || testRes.value.data.data || [];
          setPopularTests(tests);
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  // Responsive visible card calculation for carousel
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setVisibleCount(1);
        } else if (window.innerWidth < 1024) {
          setVisibleCount(2);
        } else {
          setVisibleCount(3);
        }
      }
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, featuredPackages.length - visibleCount);

  useEffect(() => {
    if (carouselIndex > maxIndex) {
      setCarouselIndex(maxIndex);
    }
  }, [maxIndex, carouselIndex]);

  // 4-second auto-scroll timer for packages carousel
  useEffect(() => {
    if (maxIndex <= 0 || isCarouselHovered) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000); // 4 seconds auto-scroll
    return () => clearInterval(interval);
  }, [maxIndex, isCarouselHovered]);

  // Synchronize ONLY carousel track horizontal scroll position without moving window/page
  useEffect(() => {
    if (carouselTrackRef.current && featuredPackages.length > 0) {
      const track = carouselTrackRef.current;
      const slides = track.children;
      if (slides && slides[carouselIndex]) {
        const slide = slides[carouselIndex];
        const targetLeft = slide.offsetLeft - track.offsetLeft;
        track.scrollTo({
          left: targetLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [carouselIndex, featuredPackages.length]);

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleBookPackage = (pkg) => {
    setSelectedTest(null);
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  // Test Carousel navigation & auto-scroll
  const testMaxIndex = Math.max(0, popularTests.length - visibleCount);

  useEffect(() => {
    if (testCarouselIndex > testMaxIndex) {
      setTestCarouselIndex(testMaxIndex);
    }
  }, [testMaxIndex, testCarouselIndex]);

  // 4-second auto-scroll timer for tests carousel
  useEffect(() => {
    if (testMaxIndex <= 0 || isTestCarouselHovered) return;
    const interval = setInterval(() => {
      setTestCarouselIndex((prev) => (prev >= testMaxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [testMaxIndex, isTestCarouselHovered]);

  // Synchronize ONLY test carousel track horizontal scroll position without jumping page
  useEffect(() => {
    if (testCarouselTrackRef.current && popularTests.length > 0) {
      const track = testCarouselTrackRef.current;
      const slides = track.children;
      if (slides && slides[testCarouselIndex]) {
        const slide = slides[testCarouselIndex];
        const targetLeft = slide.offsetLeft - track.offsetLeft;
        track.scrollTo({
          left: targetLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [testCarouselIndex, popularTests.length]);

  const handlePrevTestSlide = () => {
    setTestCarouselIndex((prev) => (prev <= 0 ? testMaxIndex : prev - 1));
  };

  const handleNextTestSlide = () => {
    setTestCarouselIndex((prev) => (prev >= testMaxIndex ? 0 : prev + 1));
  };

  const handleEnquireTest = (test) => {
    setSelectedPackage(null);
    setSelectedTest(test);
    setModalOpen(true);
  };

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/tests?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/tests');
    }
  };

  const popularTestTags = [
    'Vitamin D Total',
    'Vitamin B12',
    'Thyroid (TSH)',
    'HbA1c Diabetes',
    'Complete Blood Count (CBC)',
    'Lipid Profile',
    'Liver Function (LFT)',
    'Kidney Function (KFT)',
  ];

  return (
    <div className={styles.homeWrapper}>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <div className={styles.trustBadge}>
              <ShieldCheck size={16} />
              <span>Trusted Diagnostic Excellence • 2,000+ Tests Available</span>
            </div>

            <h1 className={styles.heroTitle}>
              Precision Medical Diagnostics & <span className={styles.highlightText}>Comprehensive Health Packages</span>
            </h1>

            <p className={styles.heroDescription}>
              Complete pathological blood tests, preventive health checkups, and swift digital reporting by{' '}
              <strong>Shyam Diagnostic Centre</strong> & <strong>MediNextGen Healthcare</strong>. Certified clinical quality backed by NABL accredited standards.
            </p>

            <div className={styles.heroCtaGroup}>
              <Link to="/packages" className={styles.primaryCta}>
                <Calendar size={18} />
                <span>Explore Health Packages</span>
              </Link>
              <WhatsAppButton
                phone="8320740996"
                variant="solid"
                size="lg"
                label="Book on WhatsApp"
              />
            </div>

            {/* Quick value props */}
            <div className={styles.valueProps}>
              <div className={styles.valueItem}>
                <CheckCircle2 size={16} className={styles.checkIcon} />
                <span>2,000+ Tests Available</span>
              </div>
              <div className={styles.valueItem}>
                <Clock size={16} className={styles.checkIcon} />
                <span>Same-Day Digital PDF Reports</span>
              </div>
              <div className={styles.valueItem}>
                <Award size={16} className={styles.checkIcon} />
                <span>Certified High-Tech Lab</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Search 2,000+ Tests & Instant Booking Widget */}
          <div className={styles.heroWidget}>
            <div className={styles.quickSearchCard}>
              <div className={styles.quickSearchHeader}>
                <div className={styles.searchIconBox}>
                  <FlaskConical size={22} className={styles.searchHeaderIcon} />
                </div>
                <div>
                  <h3 className={styles.quickSearchTitle}>Search 2,000+ Tests</h3>
                  <p className={styles.quickSearchSub}>Fast pathology booking & instant verified quotes</p>
                </div>
              </div>

              <form onSubmit={handleHeroSearchSubmit} className={styles.quickSearchForm}>
                <div className={styles.quickSearchInputWrap}>
                  <Search size={18} className={styles.quickInputIcon} />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search test name (e.g. Vitamin D, Thyroid, CBC)..."
                    className={styles.quickSearchInput}
                  />
                  <button type="submit" className={styles.quickSearchSubmitBtn}>
                    Search
                  </button>
                </div>
              </form>

              <div className={styles.popularTagsBlock}>
                <span className={styles.tagsLabel}>Popular Tests:</span>
                <div className={styles.tagsList}>
                  {popularTestTags.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => navigate(`/tests?search=${encodeURIComponent(tag)}`)}
                      className={styles.tagChip}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.quickSearchFooter}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPackage(null);
                    setSelectedTest({ name: 'General Diagnostic Appointment' });
                    setModalOpen(true);
                  }}
                  className={styles.quickBookBtn}
                >
                  <Calendar size={16} />
                  <span>Book Appointment / Diagnostic Test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className={styles.statsBar}>
        <div className={`container ${styles.statsGrid}`}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>2,000+</span>
            <span className={styles.statLabel}>Pathology & Specialized Tests Available</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>25,000+</span>
            <span className={styles.statLabel}>Satisfied Patient Checkups</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>100%</span>
            <span className={styles.statLabel}>Sterile & Barcoded Sample Protocol</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>12-24 hrs</span>
            <span className={styles.statLabel}>Digital PDF Delivery via WhatsApp & Email</span>
          </div>
        </div>
      </section>

      {/* Featured Packages Horizontal Auto-scroll Carousel */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionOverline}>Preventive Health Profiles</span>
              <h2 className={styles.sectionTitle}>Featured Health Checkup Packages</h2>
              <p className={styles.sectionSubtitle}>
                Certified diagnostic checkups with home sample collection eligibility and comprehensive parameter evaluation.
              </p>
            </div>
            <div className={styles.carouselHeaderActions}>
              {maxIndex > 0 && (
                <div className={styles.carouselArrows}>
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className={styles.carouselArrowBtn}
                    aria-label="Previous checkup package"
                    title="Previous Package"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className={styles.carouselArrowBtn}
                    aria-label="Next checkup package"
                    title="Next Package"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
              <Link to="/packages" className={styles.viewAllLink}>
                View All Packages <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div
            className={styles.carouselWrapper}
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
          >
            {maxIndex > 0 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className={`${styles.sideNavBtn} ${styles.sideNavPrev}`}
                  aria-label="Previous checkup packages"
                  title="Previous"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className={`${styles.sideNavBtn} ${styles.sideNavNext}`}
                  aria-label="Next checkup packages"
                  title="Next"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <div className={styles.carouselTrack} ref={carouselTrackRef}>
              {featuredPackages.map((pkg) => (
                <div key={pkg.id} className={styles.carouselSlide}>
                  <PackageCard pkg={pkg} onBookClick={handleBookPackage} />
                </div>
              ))}
            </div>

            {maxIndex > 0 && (
              <div className={styles.carouselDots}>
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCarouselIndex(idx)}
                    className={`${styles.carouselDot} ${idx === carouselIndex ? styles.carouselDotActive : ''}`}
                    aria-label={`Go to slide set ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Pathology Tests Horizontal Auto-scroll Carousel */}
      {popularTests.length > 0 && (
        <section className={`${styles.section} ${styles.bgAlt}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionOverline}>Accredited Pathology</span>
                <h2 className={styles.sectionTitle}>Popular Diagnostic Tests</h2>
                <p className={styles.sectionSubtitle}>
                  Routine blood assays, clinical biochemistry, and vital preventive biomarkers with same-day digital reporting.
                </p>
              </div>
              <div className={styles.carouselHeaderActions}>
                {testMaxIndex > 0 && (
                  <div className={styles.carouselArrows}>
                    <button
                      type="button"
                      onClick={handlePrevTestSlide}
                      className={styles.carouselArrowBtn}
                      aria-label="Previous diagnostic test"
                      title="Previous Test"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextTestSlide}
                      className={styles.carouselArrowBtn}
                      aria-label="Next diagnostic test"
                      title="Next Test"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
                <Link to="/tests" className={styles.viewAllLink}>
                  View All 2,000+ Tests <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div
              className={styles.carouselWrapper}
              onMouseEnter={() => setIsTestCarouselHovered(true)}
              onMouseLeave={() => setIsTestCarouselHovered(false)}
            >
              {testMaxIndex > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevTestSlide}
                    className={`${styles.sideNavBtn} ${styles.sideNavPrev}`}
                    aria-label="Previous diagnostic tests"
                    title="Previous"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextTestSlide}
                    className={`${styles.sideNavBtn} ${styles.sideNavNext}`}
                    aria-label="Next diagnostic tests"
                    title="Next"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              <div className={styles.carouselTrack} ref={testCarouselTrackRef}>
                {popularTests.map((test) => (
                  <div key={test.id} className={styles.carouselSlide}>
                    <TestCard test={test} onEnquireClick={handleEnquireTest} />
                  </div>
                ))}
              </div>

              {testMaxIndex > 0 && (
                <div className={styles.carouselDots}>
                  {Array.from({ length: testMaxIndex + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTestCarouselIndex(idx)}
                      className={`${styles.carouselDot} ${idx === testCarouselIndex ? styles.carouselDotActive : ''}`}
                      aria-label={`Go to test slide set ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 2,000+ Tests Directory Explorer Banner */}
      <section className={`${styles.section} ${styles.catalogHighlightSection}`}>
        <div className="container">
          <div className={styles.catalogBannerInner}>
            <div className={styles.catalogBannerText}>
              <span className={styles.catalogTag}>COMPREHENSIVE CATALOGUE</span>
              <h2 className={styles.catalogTitle}>Over 2,000+ Pathology & Specialized Tests</h2>
              <p className={styles.catalogDesc}>
                From complete blood counts and hormonal profiles to genetic markers, autoimmune panels, and high-sensitivity cardiac risk markers. Search our extensive catalog or connect directly with our diagnostic team.
              </p>
              <div className={styles.catalogActions}>
                <Link to="/tests" className={styles.catalogExploreBtn}>
                  <FlaskConical size={18} />
                  <span>Browse 2,000+ Tests</span>
                </Link>
                <WhatsAppButton
                  phone="8320740996"
                  variant="outline"
                  size="md"
                  label="Inquire on WhatsApp"
                  className={styles.catalogWhatsAppBtn}
                />
              </div>
            </div>
            <div className={styles.catalogPillars}>
              <div className={styles.pillarBox}>
                <HeartPulse size={24} className={styles.pillarIcon} />
                <strong>Cardiology & Lipid Panels</strong>
                <span>Cholesterol ratios, hs-CRP, and troponin</span>
              </div>
              <div className={styles.pillarBox}>
                <Activity size={24} className={styles.pillarIcon} />
                <strong>Diabetic & Metabolic Care</strong>
                <span>HbA1c, Fasting Sugar, and Insulin resistance</span>
              </div>
              <div className={styles.pillarBox}>
                <Award size={24} className={styles.pillarIcon} />
                <strong>Thyroid & Endocrine Assays</strong>
                <span>TSH, Free T3, Free T4, and Vitamin profiles</span>
              </div>
              <div className={styles.pillarBox}>
                <FlaskConical size={24} className={styles.pillarIcon} />
                <strong>Liver & Renal Health</strong>
                <span>Complete LFT, KFT, and Electrolyte balance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Categories Section */}
      <section className={`${styles.section} ${styles.bgAlt}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionOverline}>Specialized Care</span>
              <h2 className={styles.sectionTitle}>Browse Tests by Organ & Health Need</h2>
            </div>
            <Link to="/tests" className={styles.viewAllLink}>
              Explore All Tests <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>


      {/* How It Works (Diagnostic Journey) */}
      <section className={`${styles.section} ${styles.bgAlt}`}>
        <div className="container">
          <div className={styles.centeredHeader}>
            <span className={styles.sectionOverline}>Seamless & Hassle-Free</span>
            <h2 className={styles.sectionTitle}>Your Diagnostic Care Journey</h2>
            <p className={styles.sectionSubtitle}>
              Four straightforward steps to secure your clinical results with highest medical precision.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>01</div>
              <h4 className={styles.stepTitle}>Select Test / Package</h4>
              <p className={styles.stepDesc}>
                Choose from individual blood tests or complete preventive health profiles online or via WhatsApp.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>02</div>
              <h4 className={styles.stepTitle}>Confirm Booking</h4>
              <p className={styles.stepDesc}>
                Pick your preferred date and slot. Our clinical coordinators instantly confirm your booking.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>03</div>
              <h4 className={styles.stepTitle}>Sterile Sample Processing</h4>
              <p className={styles.stepDesc}>
                Samples are barcoded, vacuum-sealed, and processed on automated multi-channel clinical analyzers.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>04</div>
              <h4 className={styles.stepTitle}>Digital Report Delivery</h4>
              <p className={styles.stepDesc}>
                Receive certified digital PDF reports directly on WhatsApp and email within 12–24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality & Trust Banner */}
      <section className={styles.trustSection}>
        <div className={`container ${styles.trustGrid}`}>
          <div className={styles.trustContent}>
            <span className={styles.trustOverline}>Clinical Quality First</span>
            <h2 className={styles.trustTitle}>
              Why Thousands Trust Shyam Diagnostic & MediNextGen
            </h2>
            <div className={styles.trustPoints}>
              <div className={styles.point}>
                <Award size={20} className={styles.pointIcon} />
                <div>
                  <strong>Strict Internal Quality Assurance</strong>
                  <p>Daily calibrated multi-channel analyzers and automated cross-checks on abnormal values.</p>
                </div>
              </div>
              <div className={styles.point}>
                <Users size={20} className={styles.pointIcon} />
                <div>
                  <strong>Qualified Pathologists & Biochemists</strong>
                  <p>Every test report is reviewed and verified by credentialed clinical specialists.</p>
                </div>
              </div>
              <div className={styles.point}>
                <Activity size={20} className={styles.pointIcon} />
                <div>
                  <strong>Barcoded Vacuum Sample Integrity</strong>
                  <p>Zero sample mix-ups. Samples are vacuum-sealed and barcoded immediately for total traceability.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.trustCtaCard}>
            <h3>Ready to Book a Diagnostic Test?</h3>
            <p>Our clinical coordinators are ready to assist you with transparent rates and fast scheduling.</p>
            <div className={styles.trustCtaBtns}>
              <Link to="/packages" className={styles.trustBookBtn}>
                Explore Packages
              </Link>
              <WhatsAppButton
                phone="8320740996"
                variant="outline"
                size="md"
                label="Direct WhatsApp Booking"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Booking Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPackage(null);
          setSelectedTest(null);
        }}
        title={
          selectedPackage
            ? `Book: ${selectedPackage.name}`
            : selectedTest
            ? `Book: ${selectedTest.name}`
            : 'Book Diagnostic Test'
        }
      >
        <EnquiryForm
          initialType={selectedPackage ? 'package_booking' : 'test_booking'}
          initialPackageId={selectedPackage?.id}
          initialTestId={selectedTest?.id}
          itemName={selectedPackage?.name || selectedTest?.name}
          onSuccess={() => {
            setModalOpen(false);
            setSelectedPackage(null);
            setSelectedTest(null);
          }}
        />
      </Modal>
    </div>
  );
}
