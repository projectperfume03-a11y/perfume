import { useRef, useState } from 'react';
import { api, uploadImage } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { Camera, X } from 'lucide-react';

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
      const mainImg = index === 0 ? value : f.image || value;
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
      push(`Image ${index + 1} envoyée vers Cloudinary`);
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
      inStock: form.inStock,
      image: mainImg,
      images: cleanImages.length > 0 ? cleanImages : [mainImg],
    };

    try {
      if (isEdit) {
        await api.patch(`/products/${product._id}`, payload, token);
        push('Création mise à jour');
      } else {
        await api.post('/products', payload, token);
        push('Nouvelle pièce ajoutée à la vitrine');
      }
      onSaved();
    } catch (err) {
      push(err.message, 'error');
    }
  };

  const viewLabels = ['Face', 'Profil', 'Détail'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-dark" style={{ maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Modifier la création' : 'Nouveau parfum'}</h2>
          <button className="icon-btn-dark" onClick={onClose} aria-label="Fermer">
            <X size={18} strokeWidth={1.6} />
          </button>
        </div>

        <form onSubmit={submit} className="modal-body">

          <div className="form-row">
            <label htmlFor="pf-name">Nom du parfum <span className="req">*</span></label>
            <input
              id="pf-name"
              required
              value={form.name}
              onChange={set('name')}
              placeholder="Ex : Maison de Santal No. 22"
            />
          </div>

          <div className="form-row two">
            <div>
              <label htmlFor="pf-price">Prix (DT) <span className="req">*</span></label>
              <input
                id="pf-price"
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={set('price')}
                placeholder="49.90"
              />
            </div>
            <div>
              <label htmlFor="pf-cat">Catégorie</label>
              <input
                id="pf-cat"
                value={form.category}
                onChange={set('category')}
                placeholder="Floral, Oriental, Boisé…"
              />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="pf-desc">Description</label>
            <textarea
              id="pf-desc"
              rows={3}
              value={form.description}
              onChange={set('description')}
              placeholder="Notes de tête, cœur, base, sillage et ambiance…"
            />
          </div>

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
                      Vue {idx + 1} · {viewLabels[idx]} {idx === 0 && <span className="req">*</span>}
                    </span>

                    <div className="img-slot-preview">
                      {imgVal
                        ? <img src={imgVal} alt={`Aperçu ${viewLabels[idx]}`} />
                        : <Camera size={20} strokeWidth={1.4} />}
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm btn-block"
                      onClick={() => fileRefs[idx]?.current?.click()}
                      disabled={uploadingIdx !== null}
                    >
                      {isUploadingThis ? `${progress} %…` : 'Choisir'}
                    </button>

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

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
            />
            <span>Disponible à la vente</span>
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.9rem', paddingTop: '0.75rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-gold btn-sm"
              disabled={uploadingIdx !== null || (!form.image && !form.images[0])}
            >
              {isEdit ? 'Enregistrer' : 'Ajouter à la vitrine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
