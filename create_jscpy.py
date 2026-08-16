# create_jscpy.py

import pandas as pd
import string

# --------------------------------------------------
# Configuration
# --------------------------------------------------

XLSX_FILE = "configuration_doc.xlsx"
OUTPUT_FILE = "docs_all.js"

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
# Clean ID
# --------------------------------------------------

df["id"] = (
    df["id"]
    .astype(str)
    .str.strip()
    .str.upper()
)


# --------------------------------------------------
# Identify category configuration rows
#
# A000, B000, ... T000
# --------------------------------------------------

config_rows = df[
    df["id"].str.fullmatch(
        r"[A-T]000"
    )
].copy()


# --------------------------------------------------
# Validate that every category has a 000 row
# --------------------------------------------------

config_categories = set(
    config_rows["category"]
)

missing_config = [
    category
    for category in CATEGORIES
    if category not in config_categories
]

if missing_config:
    raise ValueError(
        "Missing category configuration rows: "
        f"{missing_config}"
    )


# --------------------------------------------------
# Validate category_label
# --------------------------------------------------

if "category_label" not in df.columns:
    raise ValueError(
        "Excel is missing required column: category_label"
    )


# --------------------------------------------------
# Validate category_folder
# --------------------------------------------------

if "category_folder" not in df.columns:
    raise ValueError(
        "Excel is missing required column: category_folder"
    )


# --------------------------------------------------
# Build category information
# --------------------------------------------------

categories = {}
category_folders = {}

for category in CATEGORIES:

    row = config_rows[
        config_rows["category"] == category
    ].iloc[0]

    category_label = (
        str(row["category_label"])
        .strip()
    )

    category_folder = (
        str(row["category_folder"])
        .strip()
    )

    if not category_label:
        raise ValueError(
            f"Empty category_label for {category}000"
        )

    if not category_folder:
        raise ValueError(
            f"Empty category_folder for {category}000"
        )

    categories[category] = category_label
    category_folders[category] = category_folder


# --------------------------------------------------
# Sort value
#
# Only document rows need sort_xlsx.
# --------------------------------------------------

document_df = df[
    ~df["id"].str.fullmatch(
        r"[A-T]000"
    )
].copy()


document_df["sort_xlsx"] = pd.to_numeric(
    document_df["sort_xlsx"],
    errors="raise"
)


# --------------------------------------------------
# Generate JavaScript
# --------------------------------------------------

lines = []


# ==================================================
# Categories
# ==================================================

lines.append("//")
lines.append("// Category names")
lines.append("//")
lines.append("")
lines.append("const categories =")
lines.append("{")

for category in CATEGORIES:

    lines.append(
        f'    {category}: "{categories[category]}",'
    )

lines.append("};")
lines.append("")


# ==================================================
# Category folders
# ==================================================

lines.append("//")
lines.append("// Category folders")
lines.append("//")
lines.append("")
lines.append("const categoryFolders =")
lines.append("{")

for category in CATEGORIES:

    lines.append(
        f'    {category}: "pdf/{category_folders[category]}/",'
    )

lines.append("};")
lines.append("")


# ==================================================
# Documents
# ==================================================

lines.append("//")
lines.append("// Documents")
lines.append("//")
lines.append("")
lines.append("const documents =")
lines.append("{")

for category in CATEGORIES:

    # --------------------------------------------------
    # Select this category's documents
    # --------------------------------------------------

    cat_df = document_df[
        document_df["category"] == category
    ].copy()

    # --------------------------------------------------
    # Sort documents
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
        lines.append(
            f'            description: "{description}",'
        )
        lines.append(
            f'            keywords: "{keywords}",'
        )
        lines.append(
            f'            file: categoryFolders.{category} + "{filename}",'
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

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as f:

    f.write(
        "\n".join(lines)
    )


# --------------------------------------------------
# Report
# --------------------------------------------------

print()
print(f"Processed {len(df)} total Excel rows.")
print()

print("Category configuration:")

for category in CATEGORIES:

    print(
        f"  {category}: "
        f"{categories[category]} "
        f"-> {category_folders[category]}"
    )

print()

print("Documents:")

for category in CATEGORIES:

    count = len(
        document_df[
            document_df["category"] == category
        ]
    )

    print(
        f"  Category {category}: "
        f"{count} documents"
    )

print()
print(f"Created: {OUTPUT_FILE}")
