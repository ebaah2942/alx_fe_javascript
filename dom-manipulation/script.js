let quotes = [
    {quote: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspirational"},
    {quote: "Life is 10% what happens to us and 90% how we react to it.", category: "motivational"},
    {quote: "The best way to predict the future is to create it.", category: "inspirational"},
    {quote: "Success usually comes to those who are too busy to be looking for it.", category: "motivational"},
    {quote: "You miss 100% of the shots you don’t take.", category: "motivational"},
    {quote: "Act as if what you do makes a difference. It does.", category: "inspirational"},
    {quote: "Success is not in what you have, but who you are.", category: "motivational"},
    {quote: "Believe you can and you're halfway there.", category: "inspirational" },
    {quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", category: "inspirational"},
    {quote: "The future belongs to those who believe in the beauty of their dreams.", category: "inspirational" }
]


let quoteContainer = document.getElementById("quoteDisplay");
const displayButton = document.getElementById("newQuote");

// Function to display a random quote

function showRandomQuote(){
    if (quotes.lenght === 0) {
        quoteContainer.innerHTML = "No quotes available, please add some quotes.";
        return;
    } else{
        let randomIndex = Math.floor(Math.random() * quotes.length);
        let randomQuote = quotes[randomIndex].quote;
        let randomCategory = quotes[randomIndex].category;

        quoteContainer.innerHTML = `<p>${randomQuote}</p><p><em>Category: ${randomCategory}</em></p>`;
    }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Function to add a new quote
function addQuote() {
    let newQuote = document.getElementById("newQuoteText").value.trim();
    let newCategory = document.getElementById("newQuoteCategory").value.trim();

    if (!newQuote || !newCategory) {
        alert("Please enter both a quote and a category.");
        return;
    }
    quotes.push({quote: newQuote, category: newCategory});
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
    // showRandomQuote();

}

displayButton.addEventListener("click", showRandomQuote);







// Initial display of a quote
showRandomQuote();

