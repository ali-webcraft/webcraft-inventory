'use client'

// Add aur Edit dono pages ke 5 text fields yahan ek hi jagah likhe hain
export type ProductValues = {
 name: string
 price: string
 stock: string
 category: string
 description: string
}

export const emptyProduct: ProductValues = { name: '', price: '', stock: '', category: '', description: '' }

const inputClass = "rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-indigo-600 focus:outline-none"

type Props = {
 values: ProductValues
 onChange: (field: keyof ProductValues, value: string) => void
}

export default function ProductFields({ values, onChange }: Props) {
 return (
  <>
   <div className="flex flex-col gap-1.5">
    <label htmlFor="name" className="text-sm font-medium">Name</label>
    <input id="name" type="text" placeholder="Product name" className={inputClass} value={values.name} onChange={(e) => onChange('name', e.target.value)} />
   </div>

   <div className="flex gap-4">
    <div className="flex flex-1 flex-col gap-1.5">
     <label htmlFor="price" className="text-sm font-medium">Price</label>
     <input id="price" type="number" placeholder="0" className={inputClass} value={values.price} onChange={(e) => onChange('price', e.target.value)} />
    </div>
    <div className="flex flex-1 flex-col gap-1.5">
     <label htmlFor="stock" className="text-sm font-medium">Stock</label>
     <input id="stock" type="number" placeholder="0" className={inputClass} value={values.stock} onChange={(e) => onChange('stock', e.target.value)} />
    </div>
   </div>

   <div className="flex flex-col gap-1.5">
    <label htmlFor="category" className="text-sm font-medium">Category</label>
    <input id="category" type="text" placeholder="e.g. Electronics" className={inputClass} value={values.category} onChange={(e) => onChange('category', e.target.value)} />
   </div>

   <div className="flex flex-col gap-1.5">
    <label htmlFor="description" className="text-sm font-medium">Description</label>
    <textarea id="description" rows={3} placeholder="Short description" className={`${inputClass} resize-y`} value={values.description} onChange={(e) => onChange('description', e.target.value)} />
   </div>
  </>
 )
}
