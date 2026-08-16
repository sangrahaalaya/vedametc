//
// Documentation definitions
//


const CATEGORY_A_FOLDER = "pdf/categoryA/";
const CATEGORY_B_FOLDER = "pdf/categoryB/";
const CATEGORY_C_FOLDER = "pdf/categoryC/";
const CATEGORY_D_FOLDER = "pdf/categoryD/";






//
// Wait until page has loaded
//
//
// Wait until page has loaded
//
document.addEventListener(
    "DOMContentLoaded",
    function ()
    {
        //
        // Add click handler for every category A-T
        //
        Object.keys(documents).forEach(
            function(category)
            {
                document
                    .getElementById(
                        "btnCategory" + category)
                    .addEventListener(
                        "click",
                        function()
                        {
                            showCategory(category);
                        });
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
        document.getElementById(
            "pdfButtonContainer");

    container.innerHTML = "";

    //
    // Get selected documents
    //
    const list =
    documents[category] || [];

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
                document.createElement(
                    "button");

            button.textContent =
                doc.label;
			button.dataset.id = doc.id;
			
            button.addEventListener(
			    "click",
			    function()
			    {
			        //
			        // Remove highlight from every PDF button
			        //
			        document
			            .querySelectorAll("#pdfButtonContainer button")
			            .forEach(function(btn)
			            {
			                btn.classList.remove("pdfSelected");
			            });
			
			        //
			        // Highlight this button
			        //
			        button.classList.add("pdfSelected");
			
			        //
			        // Open the PDF
			        //
			        window.open(
			            doc.file,
			            "_blank");
			    });

            container.appendChild(
                button);
        });
}
