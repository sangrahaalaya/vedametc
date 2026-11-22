//
// Wait until page has loaded
//
document.addEventListener(
    "DOMContentLoaded",
    function ()
            {   const dateTimeElement =
            document.getElementById("localDateTime");
        
        function updateLocalDateTime()
        {
            const now =
                new Date();
        
            const date =
                now.toLocaleDateString(
                    undefined,
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                );
        
            const time =
                now.toLocaleTimeString(
                    undefined,
                    {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit"
                    }
                );
        
            dateTimeElement.textContent =
                "Date and time: " +
                date +
                " " +
                time;
        }
        
        updateLocalDateTime();
        
        setInterval(
            updateLocalDateTime,
            1000
        );


        //
        // Create category buttons from docs_all.js
        //
        const categoryContainer =
            document.getElementById("categoryButtons");

        Object.keys(categories).forEach(
        function(category)
        {
        //
        // Get documents for this category
        //
        const list =
            documents[category] || [];

        //
        // Check for at least one real document.
        // The xxx000 entry is only a placeholder.
        //
        const hasDocument =
            list.some(
                function(doc)
                {
                    return doc.id !== category + "000";
                });

        //
        // Do not create a category button
        // if there are no real documents.
        //
        if (!hasDocument)
        {
            return;
        }

        //
        // Create category button
        //
        const button =
            document.createElement("button");

        button.id =
            "btnCategory" + category;

        button.className =
            "category category" + category;

        button.textContent =
            categories[category];

        button.addEventListener(
            "click",
            function()
            {
                showCategory(category);
            });

        categoryContainer.appendChild(button);
    });
        //
        // Connect the two document tools
        //
        
        document.getElementById("allDocumentsButton")
    .addEventListener(
        "click",
        function()
        {
            setDocumentAction(
                document.getElementById("allDocumentsButton")
            );

            showAllDocuments();
        }
    );
             document.getElementById("searchDocumentsButton")
    .addEventListener(
        "click",
        function()
        {
            setDocumentAction(
                document.getElementById("searchDocumentsButton")
            );

            showDocumentSearch();
        }
    );
        //
        // Display Category A initially
        //
        showCategory("A");
    });


//
// Display one category
//
function showCategory(category)
{
    //
    // Update document header
    //
    document.getElementById("documentHeader").textContent =
        "Documents for selected category " +
        categories[category];

    //
    // Highlight selected category
    //
    document
        .querySelectorAll(".category")
        .forEach(
            function(button)
            {
                button.classList.remove("active");
            });

    document
        .getElementById("btnCategory" + category)
        .classList.add("active");

    // Clear document action button selection
document
    .querySelectorAll("#documentActions button")
    .forEach(function(button)
    {
        button.classList.remove("active");
    });
    //
    // Clear previous buttons
    //
    const container =
        document.getElementById("pdfButtonContainer");

    container.innerHTML = "";

    //
    // Get selected documents
    //
    const list =
    (documents[category] || [])
        .filter(
            function(doc)
            {
                return doc.id !== category + "000";
            }
        );

    list.sort(
        (a, b) => a.id.localeCompare(b.id)
    );

    //
    // Create one button for each document
    //
    list.forEach(
        function(doc)
        {
            const button =
                document.createElement("button");

            button.textContent =
                doc.label;

            button.dataset.id =
                doc.id;

            button.addEventListener(
                "click",
                function()
                {
                    //
                    // Remove highlight from every PDF button
                    //
                    document
                        .querySelectorAll(
                            "#pdfButtonContainer button"
                        )
                        .forEach(
                            function(btn)
                            {
                                btn.classList.remove(
                                    "pdfSelected"
                                );
                            });

                    //
                    // Highlight this button
                    //
                    button.classList.add(
                        "pdfSelected"
                    );

                    //
                    // Open the PDF
                    //
                    window.open(
                        doc.file,
                        "_blank"
                    );
                });

            container.appendChild(button);
        });
}

//
// Highlight selected document action button
//
function setDocumentAction(activeButton)
{
    document
        .querySelectorAll("#documentActions button")
        .forEach(function(button)
        {
            button.classList.remove("active");
        });

    activeButton.classList.add("active");
}
//
// Collect all documents from all categories
//

function getAllDocuments()
{
    const allDocs = [];

    Object.keys(categories).forEach(
        function(category)
        {
            const list = documents[category] || [];

            list.forEach(
                function(doc)
                {
                    // Skip placeholder records
                    if (doc.id === category + "000")
                    {
                        return;
                    }

                    allDocs.push(
                    {
                        name: doc.label,
                        category: categories[category],
                        file: doc.file
                    });
                });
        });

    // Sort alphabetically by document title
    allDocs.sort(
        (a, b) =>
            a.name.localeCompare(
                b.name,
                undefined,
                { sensitivity: "base" }
            )
    );

    return allDocs;
}


//
// Display all documents alphabetically
//

function showAllDocuments()
{
    openDocumentWindow(false);
}


//
// Display document search window
//

function showDocumentSearch()
{
    openDocumentWindow(true);
}


//
// Common window for alphabetical index
// and search results
//


//
// Display alphabetical index or search results
// within the existing page
//

function openDocumentWindow(searchMode)
{
    const container =
        document.getElementById("pdfButtonContainer");

    const header =
        document.getElementById("documentHeader");

    const allDocs =
        getAllDocuments();

    //
    // Remove active category highlight
    //

    document
        .querySelectorAll(".category")
        .forEach(function(button)
        {
            button.classList.remove("active");
        });

    //
    // Update heading
    //

    header.textContent = searchMode
        ? "Search Documents"
        : "All Documents – Alphabetical Index";

    //
    // Add styling once
    //

    if (!document.getElementById("documentIndexStyles"))
    {
        const style = document.createElement("style");

        style.id = "documentIndexStyles";

        style.textContent = `
            .documentIndexView
            {
                width: 100%;
                flex: 1 1 100%;
            }

            .documentIndexView input
            {
                width: 100%;
                padding: 12px;
                font-size: 16px;
                box-sizing: border-box;
                margin: 15px 0;
            }

            .documentIndexView table
            {
                width: 100%;
                border-collapse: collapse;
                background: white;
            }

            .documentIndexView th,
            .documentIndexView td
            {
                border: 1px solid #cccccc;
                padding: 10px;
                text-align: left;
            }

            .documentIndexView th
            {
                background: #e0e0e0;
            }

            .documentIndexView tr:nth-child(even)
            {
                background: #f3f3f3;
            }

            .documentIndexView a
            {
                color: #0645ad;
                text-decoration: none;
            }

            .documentIndexView a:hover
            {
                text-decoration: underline;
            }

            .documentIndexView #resultCount
            {
                color: #555555;
                margin: 12px 0;
            }
        `;

        document.head.appendChild(style);
    }

    //
    // Create display area
    //

    container.innerHTML = `
        <div class="documentIndexView">

            ${searchMode
                ? `<input
                       type="search"
                       id="searchBox"
                       placeholder="Enter document title..."
                       autocomplete="off">`
                : ""
            }

            <div id="resultCount"></div>

            <div style="overflow-x:auto;">

                <table>

                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Category</th>
                        </tr>
                    </thead>

                    <tbody id="documentRows"></tbody>

                </table>

            </div>

        </div>
    `;

    const tableBody =
        document.getElementById("documentRows");

    const resultCount =
        document.getElementById("resultCount");

    //
    // Display matching documents
    //

    function displayResults(searchText)
    {
        const searchTerm =
            searchText.trim().toLowerCase();

        const matches =
            allDocs.filter(function(item)
            {
                return item.name
                    .toLowerCase()
                    .includes(searchTerm);
            });

        tableBody.innerHTML = "";

        resultCount.textContent =
            "Documents found: " + matches.length;

        if (matches.length === 0)
        {
            const row =
                document.createElement("tr");

            const cell =
                document.createElement("td");

            cell.colSpan = 2;

            cell.textContent =
                "No documents found.";

            row.appendChild(cell);

            tableBody.appendChild(row);

            return;
        }

        matches.forEach(function(item)
        {
            const row =
                document.createElement("tr");

            const nameCell =
                document.createElement("td");

            const categoryCell =
                document.createElement("td");

            const link =
                document.createElement("a");

            link.textContent = item.name;

            link.href = item.file;

            link.target = "_blank";

            link.rel = "noopener";

            nameCell.appendChild(link);

            categoryCell.textContent =
                item.category;

            row.appendChild(nameCell);

            row.appendChild(categoryCell);

            tableBody.appendChild(row);
        });
    }

    //
    // Connect search box if required
    //

    if (searchMode)
    {
        const input =
            document.getElementById("searchBox");

        input.addEventListener(
            "input",
            function()
            {
                displayResults(input.value);
            }
        );
    }

    //
    // Initial display
    //

    displayResults("");
}


    

