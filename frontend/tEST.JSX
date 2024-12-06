<>
<div className="mt-4 relative">
<Select
  label="Select Brand"
  value={watch("brand") || ""}
  onChange={(value) => {
    handleSelectChange("brand", value);
  }}
  error={Boolean(errors.brand)}
  selected={(element) => 
    element && 
    brands?.find(brand => brand._id === selectedBrand)?.name
  }
>
  <Option value="">Select a brand</Option>
  {brands?.map((brand) => (
    <Option key={brand._id} value={brand._id}>
      {brand.name}
    </Option>
  ))}
</Select>
{errors.brand && (
  <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
)}
</div>


<div className="relative">
<Select
  label="Condition"
  value={watch("specifications.condition") || ""}
  onChange={(value) => handleSelectChange("specifications.condition", value)}
  error={Boolean(errors.specifications?.condition)}
>
  <Option `va`lue="">Select a condition</Option>
  <Option value="New">New</Option>
  <Option value="Refurbished">Refurbished</Option>
  <Option value="Used">Used</Option>
</Select>
{errors.specifications?.condition && (
  <p className="text-red-500 text-sm mt-1">
    {errors.specifications.condition.message}
  </p>
)}
</div>

</>