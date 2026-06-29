import { createClient } from "@/lib/supabase/server";
import CategoryForm from "@/components/admin/CategoryForm";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

async function getCategories(): Promise<Category[]> {
  const defaultCategories: Category[] = [
    { id: "1", name: "Education", slug: "education", created_at: new Date().toISOString() },
    { id: "2", name: "Medical", slug: "medical", created_at: new Date().toISOString() },
    { id: "3", name: "Emergency", slug: "emergency", created_at: new Date().toISOString() },
    { id: "4", name: "Disaster Relief", slug: "disaster-relief", created_at: new Date().toISOString() },
    { id: "5", name: "Environment", slug: "environment", created_at: new Date().toISOString() },
  ];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) return data;
  } catch (error) {
    console.error("Categories query failed, falling back to mock list:", error);
  }

  return defaultCategories;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display-lg text-headline-sm font-bold text-on-surface">
          Campaign Categories
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          Manage taxonomies used to categorize and organize fundraising campaigns.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Categories list */}
        <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden lg:col-span-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-bold text-on-surface-variant border-b border-slate-200/60">
                <th className="px-5 py-3">Category Name</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-xs text-on-surface">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/30">
                  <td className="px-5 py-3 font-semibold">{cat.name}</td>
                  <td className="px-5 py-3 font-mono text-[10px] text-on-surface-variant">
                    {cat.slug}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <DeleteCategoryButton id={cat.id} name={cat.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column: Add Category Form */}
        <div>
          <CategoryForm />
        </div>
      </div>
    </div>
  );
}
