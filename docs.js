//
// Wait until page has loaded
//
document.addEventListener(
    "DOMContentLoaded",
    function ()
    {
        console.log("docs.js started");
        console.log("categories =", categories);
        console.log("documents =", documents);

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
        [...(documents[category] || [])];

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
