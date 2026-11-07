import React, { useState } from 'react';
import { Plus, FolderTree, Trash2, Edit2, X, Boxes } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryInfo, ProductCategory } from '../../types';

export const AdminCategories: React.FC = () => {
  const { categories, createCategory, deleteCategory } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subcategoriesStr, setSubcategoriesStr] = useState('');
  const [image, setImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setSubcategoriesStr('');
    setImage('');
    setBannerImage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CategoryInfo) => {
    setEditingCategory(c);
    setName(c.name);
    setDescription(c.description);
    setSubcategoriesStr(c.subcategories ? c.subcategories.join(', ') : '');
    setImage(c.image || '');
    setBannerImage(c.bannerImage || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const subcategories = subcategoriesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingCategory) {
      await createCategory({
        ...editingCategory,
        name: name.trim() as ProductCategory,
        description: description.trim(),
        subcategories,
        image: image.trim() || undefined,
        bannerImage: bannerImage.trim() || undefined,
      });
    } else {
      await createCategory({
        name: name.trim() as ProductCategory,
        description: description.trim(),
        subcategories,
        image: image.trim() || undefined,
        bannerImage: bannerImage.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Category Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organize catalog taxonomy and navigation collections.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <FolderTree className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>

              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {cat.subcategories.slice(0, 4).map((sub) => (
                    <span key={sub} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">
                      {sub}
                    </span>
                  ))}
                  {cat.subcategories.length > 4 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{cat.subcategories.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Products</span>
              <span className="font-extrabold text-blue-600 tabular-nums bg-blue-50 px-2 py-0.5 rounded">
                {cat.itemCount} items
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Smart Living"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subcategories (Comma-separated)</label>
                <input
                  type="text"
                  value={subcategoriesStr}
                  onChange={e => setSubcategoriesStr(e.target.value)}
                  placeholder="e.g. Mobiles, Laptops, Tablets, Smart Watches"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={bannerImage}
                  onChange={e => setBannerImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief synopsis of products in this category..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
