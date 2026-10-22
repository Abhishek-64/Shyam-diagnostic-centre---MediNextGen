import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Droplet,
  HeartPulse,
  Heart,
  ShieldAlert,
  ActivitySquare,
  Users,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import styles from './CategoryCard.module.css';

const iconMap = {
  Activity,
  Droplet,
  HeartPulse,
  Heart,
  ShieldAlert,
  ActivitySquare,
  Users,
  UserCheck,
};

export default function CategoryCard({ category }) {
  if (!category) return null;
  const Icon = (category.iconName && iconMap[category.iconName]) || Activity;

  return (
    <Link to={`/tests?category=${category.slug}`} className={styles.card}>
      <div className={styles.iconBox}>
        <Icon size={24} />
      </div>
      <div className={styles.content}>
        <h4 className={styles.name}>{category.name}</h4>
        {category.description && <p className={styles.desc}>{category.description}</p>}
        <div className={styles.footerRow}>
          <span className={styles.testCount}>
            {category.testCount ? `${category.testCount}+ Tests` : 'View Tests'}
          </span>
          <ChevronRight size={16} className={styles.arrow} />
        </div>
      </div>
    </Link>
  );
}
