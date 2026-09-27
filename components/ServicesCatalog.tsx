'use client';
import { useCallback, useState } from 'react';
import type { ServiceCategory, ServiceView } from '@/lib/offers';
import CheckoutDialog, { type CheckoutItem } from './CheckoutDialog';

export default function ServicesCatalog({
  services,
  categories,
}: {
  services: ServiceView[];
  categories: { id: ServiceCategory; label: string }[];
}) {
  const [filter, setFilter] = useState<ServiceCategory | 'all'>('all');
  const [selected, setSelected] = useState<CheckoutItem | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const tabs = [
    { id: 'all' as const, label: 'Tout', count: services.length },
    ...categories.map((c) => ({
      ...c,
      count: services.filter((s) => s.category === c.id).length,
    })),
  ];
  const visible = filter === 'all' ? services : services.filter((s) => s.category === filter);

  return (
    <>
      <div className="svc-tabs" role="tablist" aria-label="Catégories de services">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={filter === t.id}
            className="svc-tab"
            onClick={() => setFilter(t.id)}
          >
            {t.label} <span className="svc-tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      <ul className="svc-list">
        {visible.map((s) => (
          <li key={s.id} className="svc-row">
            <div className="svc-text">
              <h3 className="svc-name">{s.name}</h3>
              <p className="svc-tagline">{s.tagline}</p>
            </div>
            <p className="svc-price">{s.priceLabel}</p>
            <button type="button" className="btn svc-cta" onClick={() => setSelected(s)}>
              Commander <span className="ar">→</span>
            </button>
          </li>
        ))}
      </ul>

      <CheckoutDialog item={selected} onClose={close} />
    </>
  );
}
