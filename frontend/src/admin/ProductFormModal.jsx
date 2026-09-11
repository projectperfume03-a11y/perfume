import { useRef, useState } from 'react';
import { api, uploadImage } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { Camera, X, Upload, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'Floral',
  'Oriental',
  'Boisé',
  'Frais',
  'Fruité',
  'Musqué',
  'Aquatique',
  'Gourmand',
  'Cuir',
  'Chypré',
  'Aromatic',
  'Parfum de luxe',
];

export default function ProductFormModal({ product, onClose, onSaved }) {
  const { token } = useAuth();
  const { push } = useToast();
  const isEdit = Boolean(product);

  const initialImages = product?.images && product.images.length > 0
    ? product.images
    : [product?.image || '', '', ''];

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price ?? '',
    category: product?.category || '',
    brand: product?.brand || '',
    gender: product?.gender || 'mixte',
    inStock: product?.inStock !== false,
    image: product?.image || '',
    images: [
      initialImages[0] || product?.image || '',
      initialImages[1] || '',
      initialImages[2] || '',
    ],
  });

  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileRefs = [useRef(null), useRef(null), useRef(null)];

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const setAltImage = (index, value) => {
    setForm((f) => {
      const nextImages = [...f.images];
      nextImages[index] = value;
      const mainImg = index === 0 ? value : (f.image || value);
      return { ...f, image: mainImg, images: nextImages };
    });
  };

  const handleFileUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(index);
    setProgress(5);
    try {
      const url = await uploadImage(file, setProgress, token);
      setAltImage(index, url);
      push(`Image ${index + 1} chargée avec succès`);
    } catch (err) {
      push(err.message, 'error');
    } finally {
      setUploadingIdx(null);
      setProgress(0);
      if (fileRefs[index]?.current) fileRefs[index].current.value = '';
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const cleanImages = form.images.filter((img) => Boolean(img && img.trim()));
    const mainImg = form.image || cleanImages[0] || '';

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category || 'Parfum de luxe',
      brand: form.brand,
      gender: form.gender,
      inStock: form.inStock,
      image: mainImg,
      images: cleanImages.length > 0 ? cleanImages : [mainImg],
    };

    try {
      if (isEdit) {
        await api.patch(`/products/${product._id}`, payload, token);
        push('Création mise à jour ✓');
      } else {
        await api.post('/products', payload, token);
        push('Nouvelle pièce ajoutée à la vitrine ✓');
      }
      onSaved();
    } catch (err) {
      push(err.message, 'error');
    }
  };

  const viewLabels = ['Face', 'Profil', 'Détail'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal-dark"
        style={{ maxWidth: 700 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="modal-header">
          <h2>{isEdit ? 'Modifier la création' : 'Nouveau parfum'}</h2>
          <button className="icon-btn-dark" onClick={onClose} aria-label="Fermer">
            <X size={18} strokeWidth={1.6} />
          </button>
        </div>

        <form onSubmit={submit} className="modal-body">

          {/* Nom */}
          <div className="form-row">
            <label htmlFor="pf-name">
              Nom du parfum <span className="req">*</span>
            </label>
            <input
              id="pf-name"
              required
              value={form.name}
              onChange={set('name')}
              placeholder="Ex : Baccarat Rouge 540 Extrait"
            />
          </div>

          {/* Prix + Marque */}
          <div className="form-row two">
            <div>
              <label htmlFor="pf-price">
                Prix (DT) <span className="req">*</span>
              </label>
              <input
                id="pf-price"
                required
                type="number"
                min="0"
                step="0.001"
                value={form.price}
                onChange={set('price')}
                placeholder="189.900"
              />
            </div>
            <div>
              <label htmlFor="pf-brand">Maison / Marque</label>
              <input
                id="pf-brand"
                value={form.brand}
                onChange={set('brand')}
                placeholder="Ex : Chanel, Dior, Tom Ford…"
              />
            </div>
          </div>

          {/* Catégorie + Genre */}
          <div className="form-row two">
            <div>
              <label htmlFor="pf-cat">Famille olfactive</label>
              <select id="pf-cat" value={form.category} onChange={set('category')}>
                <option value="">Sélectionner…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pf-gender">Pour</label>
              <select id="pf-gender" value={form.gender} onChange={set('gender')}>
                <option value="femme">Femme</option>
                <option value="homme">Homme</option>
                <option value="mixte">Mixte / Unisexe</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-row">
            <label htmlFor="pf-desc">Description & notes olfactives</label>
            <textarea
              id="pf-desc"
              rows={3}
              value={form.description}
              onChange={set('description')}
              placeholder="Notes de tête, de cœur, de fond. Sillage, projection, longueur…"
            />
          </div>

          {/* Images */}
          <div className="form-row">
            <span className="field-label">
              Photographies — Face, Profil, Détail <span className="req">*</span>
            </span>
            <div className="image-picker">
              {[0, 1, 2].map((idx) => {
                const imgVal = form.images[idx] || '';
                const isUploadingThis = uploadingIdx === idx;
                return (
                  <div className="img-slot" key={idx}>
                    <span className="img-slot-label">
                      Vue {idx + 1} · {viewLabels[idx]}
                      {idx === 0 && <span className="req"> *</span>}
                    </span>

                    <div
                      className="img-slot-preview"
                      onClick={() => !isUploadingThis && fileRefs[idx]?.current?.click()}
                      style={{ cursor: 'pointer' }}
                      title="Cliquer pour choisir une image"
                    >
                      {isUploadingThis ? (
                        <div style={{ textAlign: 'center', color: 'var(--adm-gold)' }}>
                          <Loader2 size={20} strokeWidth={1.6} style={{ animation: 'spin 1s linear infinite' }} />
                          <div style={{ fontSize: '0.65rem', marginTop: '0.35rem' }}>{progress}%</div>
                        </div>
                      ) : imgVal ? (
                        <img src={imgVal} alt={`Aperçu ${viewLabels[idx]}`} />
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--adm-text-3)' }}>
                          <Upload size={18} strokeWidth={1.4} />
                          <div style={{ fontSize: '0.6rem', marginTop: '0.3rem' }}>Cliquer</div>
                        </div>
                      )}
                    </div>

                    <input
                      ref={fileRefs[idx]}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleFileUpload(e, idx)}
                    />

                    <input
                      type="text"
                      placeholder="ou coller une URL…"
                      value={imgVal}
                      onChange={(e) => setAltImage(idx, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disponibilité */}
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
            />
            <span>Disponible à la vente</span>
          </label>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', paddingTop: '0.75rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-gold btn-sm"
              disabled={uploadingIdx !== null || (!form.image && !form.images[0])}
            >
              {isEdit ? 'Enregistrer les modifications' : 'Ajouter à la vitrine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
