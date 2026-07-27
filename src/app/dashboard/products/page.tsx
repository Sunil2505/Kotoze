import PageHeader from "@/components/dashboard/common/PageHeader";
import ProductTable from "@/components/dashboard/products/ProductTable";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage all products"
      />

      <ProductTable />
    </div>
  );
}