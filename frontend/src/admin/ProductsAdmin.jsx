import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { Plus, Search } from 'lucide-react';
import ProductFormModal from './ProductFormModal.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

export default function ProductsAdmin({ refreshStats }) {
  const { token } = useAuth();
  const { push } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get('/products')
      .then(setProducts)
      .catch((e) => push(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [push]);

  useEffect(load, [load]);

  const afterChange = () => {
    load();
    if (refreshStats) refreshStats();
  };

  const executeDelete = async (product) => {
    setConfirm((prev) => ({ ...prev, isLoading: true }));
    try {
      await api.del(`/products/${product._id}`, token);
      push('Pièce retirée de la boutique');
      afterChange();
      setConfirm(null);
    } catch (e) {
      push(e.message, 'error');
      setConfirm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const executeToggleStock = async (product) => {
    setConfirm((prev) => ({ ...prev, isLoading: true }));
    const next = product.inStock === false;
    try {
      await api.patch(`/products/${product._id}`, { inStock: next }, token);
      push(next ? 'Pièce remise en vente' : 'Pièce marquée épuisée');
      afterChange();
      setConfirm(null);
    } catch (e) {
      push(e.message, 'error');
      setConfirm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const confirmDelete = (product) => {
    setConfirm({
      isOpen: true,
      title: 'Retirer la création',
      message: `« ${product.name} » sera définitivement supprimée de la collection. Cette action est irréversible.`,
      isDanger: true,
      confirmText: 'Supprimer',
      onConfirm: () => executeDelete(product),
      onCancel: () => setConfirm(null),
    });
  };

  const confirmToggleStock = (product) => {
    const next = product.inStock === false;
    setConfirm({
      isOpen: true,
      title: next ? 'Remettre en vente' : 'Marquer épuisée',
      message: `Voulez-vous marquer « ${product.name} » comme ${next ? 'disponible' : 'épuisée'} ?`,
      isDanger: !next,
      confirmText: 'Confirmer',
      onConfirm: () => executeToggleStock(product),
      onCancel: () => setConfirm(null),
    });
  };

  const filtered = products.filter(
    (p) => !search.trim() || p.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="vip-panel">
      <div className="vip-panel-head">
        <h2 className="vip-panel-title">Les créations</h2>

        <div className="vip-panel-tools">
          <div className="vip-search">
            <Search size={15} strokeWidth={1.6} />
            <input
              type="search"
              placeholder="Rechercher une pièce…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher un produit"
            />
          </div>
          <span className="chip">{filtered.length} / {products.length}</span>
          <button className="btn btn-gold btn-sm" onClick={() => setModal({})}>
            <Plus size={14} strokeWidth={2.2} />
            Nouvelle pièce
          </button>
        </div>
      </div>

      {loading ? (
        <div className="vip-panel-body" style={{ display: 'grid', gap: '0.8rem' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 58 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="vip-panel-body" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--vip-text-3)' }}>
          {products.length === 0 ? (
            <>
              <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                La vitrine est vide — ajoutez votre première création.
              </p>
              <button className="btn btn-gold btn-sm" onClick={() => setModal({})}>
                <Plus size={14} strokeWidth={2.2} />
                Ajouter une pièce
              </button>
            </>
          ) : (
            <>
              <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Aucune pièce ne correspond à « {search} ».
              </p>
              <button className="btn btn-outline btn-sm" onClick={() => setSearch('')}>
                Effacer la recherche
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="vip-table-wrap">
          <table className="vip-table">
            <thead>
              <tr>
                <th>Création</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Disponibilité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="cell-product">
                      <img src={p.image} alt="" />
                      <div>
                        <span className="cell-name">{p.name}</span>
                        {p.description && <span className="cell-desc">{p.description}</span>}
                      </div>
                    </div>
                  </td>
                  <td><span className="chip">{p.category || 'Parfum de luxe'}</span></td>
                  <td className="cell-price">{p.price.toFixed(3)} DT</td>
                  <td>
                    <button
                      className={`stock-toggle ${p.inStock === false ? 'off' : 'on'}`}
                      onClick={() => confirmToggleStock(p)}
                      title="Cliquer pour inverser"
                    >
                      {p.inStock === false ? 'Épuisée' : 'En vente'}
                    </button>
                  </td>
                  <td>
                    <div className="cell-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => setModal({ product: p })}>
                        Modifier
                      </button>
                      <button className="btn btn-vip-danger btn-sm" onClick={() => confirmDelete(p)}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ProductFormModal
          product={modal.product || null}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            afterChange();
          }}
        />
      )}

      {confirm && <ConfirmModal {...confirm} dark />}
    </div>
  );
}
