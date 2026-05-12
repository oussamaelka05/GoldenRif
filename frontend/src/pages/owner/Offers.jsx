import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTag, FiPlus, FiTrash2, FiToggleLeft, FiToggleRight, FiClock, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import OwnerLayout from '../../components/OwnerLayout';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const today = new Date().toISOString().split('T')[0];

const fmt = (d) =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

const discountLabel = (offer) =>
  offer.discount_type === 'percentage'
    ? `${offer.discount_value}% OFF`
    : `$${offer.discount_value} OFF/day`;

const Offers = () => {
  const { t } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editDates, setEditDates] = useState({ valid_from: '', valid_until: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/my-offers')
      .then(({ data }) => setOffers(data))
      .finally(() => setLoading(false));
  }, []);

  const toggleActive = async (offer) => {
    setActionId(offer.id);
    try {
      const { data } = await api.put(`/offers/${offer.id}`, { active: !offer.active });
      setOffers((prev) => prev.map((o) => (o.id === offer.id ? data : o)));
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('owner.offers.deleteConfirm'))) return;
    setActionId(id);
    try {
      await api.delete(`/offers/${id}`);
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } finally {
      setActionId(null);
    }
  };

  const startEdit = (offer) => {
    setEditId(offer.id);
    setEditDates({
      valid_from:  offer.valid_from  ? offer.valid_from.substring(0, 10)  : '',
      valid_until: offer.valid_until ? offer.valid_until.substring(0, 10) : '',
    });
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/offers/${id}`, {
        valid_from:  editDates.valid_from  || null,
        valid_until: editDates.valid_until || null,
      });
      setOffers((prev) => prev.map((o) => (o.id === id ? data : o)));
      setEditId(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <OwnerLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{t('owner.offers.title')}</h1>
            <p className="text-slate-500 text-sm mt-1">{t('owner.offers.subtitle')}</p>
          </div>
          <Link
            to="/owner/offers/add"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-lg hover:shadow-amber-500/30"
          >
            <FiPlus size={16} /> {t('owner.offers.newOffer')}
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <FiTag className="mx-auto text-slate-300 mb-4" size={40} />
            <h3 className="text-lg font-bold text-slate-700 mb-2">{t('owner.offers.noOffers')}</h3>
            <p className="text-slate-400 text-sm mb-6">
              {t('owner.offers.noOffersText')}
            </p>
            <Link
              to="/owner/offers/add"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              <FiPlus size={15} /> {t('owner.offers.createFirst')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`bg-white rounded-2xl border shadow-sm p-5 transition-opacity ${
                  !offer.active ? 'opacity-60' : ''
                } ${actionId === offer.id ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="bg-amber-100 text-amber-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                        {discountLabel(offer)}
                      </span>
                      {!offer.active && (
                        <span className="bg-slate-100 text-slate-500 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {t('owner.offers.inactive')}
                        </span>
                      )}
                      {offer.valid_from && offer.valid_from.substring(0, 10) > today && (
                        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {t('owner.offers.starts')} {fmt(offer.valid_from)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{offer.title}</h3>
                    {offer.car && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {offer.car.brand} {offer.car.model}
                      </p>
                    )}
                    {offer.description && (
                      <p className="text-xs text-slate-400 mt-1 truncate">{offer.description}</p>
                    )}

                    {editId === offer.id ? (
                      <div className="mt-3 flex flex-wrap items-end gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{t('owner.offers.validFrom')}</label>
                          <input
                            type="date"
                            value={editDates.valid_from}
                            onChange={(e) => setEditDates((d) => ({ ...d, valid_from: e.target.value }))}
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{t('owner.offers.validUntil')}</label>
                          <input
                            type="date"
                            value={editDates.valid_until}
                            min={editDates.valid_from || undefined}
                            onChange={(e) => setEditDates((d) => ({ ...d, valid_until: e.target.value }))}
                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(offer.id)}
                            disabled={saving}
                            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            <FiCheck size={13} /> {t('owner.offers.save')}
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            <FiX size={13} /> {t('owner.offers.cancel')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        {offer.valid_from && (
                          <span className="flex items-center gap-1">
                            <FiClock size={11} /> {t('owner.offers.from')} {fmt(offer.valid_from)}
                          </span>
                        )}
                        {offer.valid_until && (
                          <span className="flex items-center gap-1">
                            <FiClock size={11} /> {t('owner.offers.until')} {fmt(offer.valid_until)}
                          </span>
                        )}
                        {!offer.valid_from && !offer.valid_until && (
                          <span>{t('owner.offers.noDate')}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(offer)}
                      title="Edit dates"
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => toggleActive(offer)}
                      title={offer.active ? 'Deactivate' : 'Activate'}
                      className={`p-2 rounded-lg transition-colors ${
                        offer.active
                          ? 'text-amber-500 hover:bg-amber-50'
                          : 'text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {offer.active ? <FiToggleRight size={22} /> : <FiToggleLeft size={22} />}
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete offer"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </OwnerLayout>
  );
};

export default Offers;
