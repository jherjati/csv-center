ALTER TABLE table_name
ADD COLUMN new_column REAL GENERATED ALWAYS AS (old_column_2 - old_column_1);