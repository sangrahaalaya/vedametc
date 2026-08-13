#create_jscpy.py
import pandas as pd

# --------------------------------------------------
# Configuration
# --------------------------------------------------

XLSX_FILE = "panchangampdf_doc.xlsx"
OUTPUT_FILE = "docs_A.js"

CATEGORY = "A"


# --------------------------------------------------
# Read Excel
# --------------------------------------------------

df = pd.read_excel(XLSX_FILE)


# --------------------------------------------------
# Process only Category A
# --------------------------------------------------

df = df[
    df["category"]
    .astype(str)
    .str.strip()
    .str.upper()
    == CATEGORY
].copy()


# --------------------------------------------------
# Sort Category A using Excel sort_xlsx column
# --------------------------------------------------

df["sort_xlsx"] = pd.to_numeric(df["sort_xlsx"], errors="raise")

df = df.sort_values(
    by="sort_xlsx",
    ascending=True
)


# --------------------------------------------------
# Generate JavaScript
# --------------------------------------------------

lines = []

lines.append("const documentsA = [")

for _, row in df.iterrows():

    category = str(row["category"]).strip()
    doc_id = str(row["id"]).strip()
    label = str(row["label"]).strip()
    description = str(row["description"]).strip()
    keywords = str(row["keywords"]).strip()
    filename = str(row["filename"]).strip()
    font = str(row["font"]).strip()

    # The JS sort field is NOT used for Excel ordering.
    sort_value = int(row["sort"])

    lines.append("    {")
    #lines.append(f'        category: "{category}",')
    lines.append(f'        id: "{doc_id}",')
    lines.append(f'        label: "{label}",')
    lines.append(f'        description: "{description}",')
    lines.append(f'        keywords: "{keywords}",')
    lines.append(f'        file: CATEGORY_A_FOLDER + "{filename}",')
    #lines.append(f'        font: "{font}",')
    #lines.append(f'        sort: {sort_value}')
    lines.append("    },")

lines.append("];")


# --------------------------------------------------
# Write JavaScript file
# --------------------------------------------------

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))


print(f"Processed {len(df)} Category A rows.")
print(f"Created: {OUTPUT_FILE}")
