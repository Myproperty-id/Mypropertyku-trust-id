-- Add database constraints for properties table
ALTER TABLE properties 
ADD CONSTRAINT properties_price_positive CHECK (price > 0),
ADD CONSTRAINT properties_price_max CHECK (price <= 999999999999999),
ADD CONSTRAINT properties_land_size_positive CHECK (land_size IS NULL OR land_size > 0),
ADD CONSTRAINT properties_building_size_positive CHECK (building_size IS NULL OR building_size > 0),
ADD CONSTRAINT properties_bedrooms_positive CHECK (bedrooms IS NULL OR bedrooms >= 0),
ADD CONSTRAINT properties_bathrooms_positive CHECK (bathrooms IS NULL OR bathrooms >= 0),
ADD CONSTRAINT properties_floors_positive CHECK (floors IS NULL OR floors > 0),
ADD CONSTRAINT properties_year_built_range CHECK (year_built IS NULL OR (year_built >= 1800 AND year_built <= 2100));