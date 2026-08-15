# create_jscpy.py

import pandas as pd
import string

# --------------------------------------------------
# Configuration
# --------------------------------------------------

XLSX_FILE = "panchangampdf_doc.xlsx"
OUTPUT_FILE = "docs_ALL.js"

# 20 categories: A through T
CATEGORIES = list(string.ascii_uppercase[:20])


# --------------------------------------------------
# Read Excel
# --------------------------------------------------

df = pd.read_excel(XLSX_FILE)


# --------------------------------------------------
# Clean category
# --------------------------------------------------

df["category"] = (
    df["category"]
    .astype(str)
    .str.strip()
    .str.upper()
)


# --------------------------------------------------
# Validate categories
# --------------------------------------------------

invalid_categories = sorted(
    set(df["category"]) - set(CATEGORIES)
)

if invalid_categories:
    raise ValueError(
        f"Invalid categories found in Excel: {invalid_categories}"
    )


# --------------------------------------------------
# Sort value
# --------------------------------------------------

df["sort_xlsx"] = pd.to_numeric(
    df["sort_xlsx"],
    errors="raise"
)


# --------------------------------------------------
# Generate JavaScript
# --------------------------------------------------

lines = []

lines.append("const documents =")
lines.append("{")

for category in CATEGORIES:

    # --------------------------------------------------
    # Select this category
    # --------------------------------------------------

    cat_df = df[
        df["category"] == category
    ].copy()

    # --------------------------------------------------
    # Sort this category
    # --------------------------------------------------

    cat_df = cat_df.sort_values(
        by="sort_xlsx",
        ascending=True
    )

    # --------------------------------------------------
    # Category heading
    # --------------------------------------------------

    lines.append(f"    {category}:")
    lines.append("    [")

    # --------------------------------------------------
    # Generate documents
    # --------------------------------------------------

    for _, row in cat_df.iterrows():

        doc_id = str(row["id"]).strip()
        label = str(row["label"]).strip()
        description = str(row["description"]).strip()
        keywords = str(row["keywords"]).strip()
        filename = str(row["filename"]).strip()

        lines.append("        {")
        lines.append(f'            id: "{doc_id}",')
        lines.append(f'            label: "{label}",')
        lines.append(f'            description: "{description}",')
        lines.append(f'            keywords: "{keywords}",')
        lines.append(
            f'            file: CATEGORY_{category}_FOLDER + "{filename}",'
        )
        lines.append("        },")

    # --------------------------------------------------
    # End category
    # --------------------------------------------------

    lines.append("    ],")

# --------------------------------------------------
# End documents
# --------------------------------------------------

lines.append("};")


# --------------------------------------------------
# Write JavaScript
# --------------------------------------------------

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))


# --------------------------------------------------
# Report
# --------------------------------------------------

print(f"Processed {len(df)} total rows.")

for category in CATEGORIES:
    count = len(df[df["category"] == category])
    print(f"Category {category}: {count} rows")

print(f"Created: {OUTPUT_FILE}")
