const LS_KEY = "dqg_quotes_v1";
const SS_LAST_KEY = "dqg_last_quote_v1";
const LS_FILTER_KEY = "dqg_last_filter_v1";



let quotes = [];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportJson");
const categoryFilter = document.getElementById("categoryFilter");

  

// Function to load quotes from localStorage
function getDefaultQuotes() {
    return [
    {text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspirational"},
    {text: "Life is 10% what happens to us and 90% how we react to it.", category: "motivational"},
    {text: "The best way to predict the future is to create it.", category: "inspirational"},
    {text: "Success usually comes to those who are too busy to be looking for it.", category: "motivational"},
    {text: "You miss 100% of the shots you don’t take.", category: "motivational"},
    {text: "Act as if what you do makes a difference. It does.", category: "inspirational"},
    {text: "Success is not in what you have, but who you are.", category: "motivational"},
    {text: "Believe you can and you're halfway there.", category: "inspirational" },
    {text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", category: "inspirational"},
    {text: "The future belongs to those who believe in the beauty of their dreams.", category: "inspirational" }
]
}

// Load quotes from localStorage or use default quotes
function loadQuotes() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) {
            const defaults = getDefaultQuotes();
            localStorage.setItem(LS_KEY, JSON.stringify(defaults));
            return defaults;
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : getDefaultQuotes();
    }
    catch (error) {
        console.error("Error loading quotes from localStorage:", error);
        return getDefaultQuotes();
    }
};

// Load quotes into the global variable
function saveQuotes() {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(quotes));
    } catch (error) {
        console.error("Error saving quotes to localStorage:", error);
    }
}

// session storage helpers

function saveLastViewedQuote(q) {
    try {
        sessionStorage.setItem(SS_LAST_KEY, JSON.stringify(q));
    } catch (error) {
        console.error("Error saving last quote index to sessionStorage:", error);
    }
}

function getLastViewedQuote() {
    try {
        const raw = sessionStorage.getItem(SS_LAST_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error("Error retrieving last quote index from sessionStorage:", error);
        return null;
    }
}

// ===== Populate Categories =====
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
  // Clear existing options except "all"
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);

        // Restore last selected filter
  const savedFilter = localStorage.getItem(LS_FILTER_KEY);
  if (savedFilter) {
    categoryFilter.value = savedFilter;
  }

  })};



// UI: show a quote
function renderQuote(quote) {
    if (!quote) {
        quoteDisplay.innerHTML = "No quotes available, please add some quotes.";
        return;
    }
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>Category: ${quote.category}</em></p>`;
    saveLastViewedQuote(quote);
}


// ===== Show Random Quote (with filter) =====
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filtered = quotes;

  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (!filtered.length) {
    renderQuote(null);
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  renderQuote(filtered[randomIndex]);
}

// ===== Filtering =====
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(LS_FILTER_KEY, selectedCategory);
  showRandomQuote();
}


// Create a form to add new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.style.marginTop = "30px";

  const title = document.createElement("h3");
  title.textContent = "Add a New Quote";
  formContainer.appendChild(title);

  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";
  formContainer.appendChild(inputText);

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";
  formContainer.appendChild(inputCategory);

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.onclick = addQuote;
  formContainer.appendChild(addBtn);

  document.body.appendChild(formContainer);
}

// Function to add a new quote
function addQuote() {
    let newQuote = document.getElementById("newQuoteText").value.trim();
    let newCategory = document.getElementById("newQuoteCategory").value.trim();

    if (!newQuote || !newCategory) {
        alert("Please enter both a quote and a category.");
        return;
    }
    quotes.push({text: newQuote, category: newCategory});
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
    // showRandomQuote();

}


// ===== Export JSON =====
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const ts = new Date();
  const name = `quotes-${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(2, "0")}-${String(ts.getDate()).padStart(2, "0")}T${String(ts.getHours()).padStart(2, "0")}${String(ts.getMinutes()).padStart(2, "0")}${String(ts.getSeconds()).padStart(2, "0")}.json`;

  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ===== Import JSON (via <input type="file" onchange="importFromJsonFile(event)">) =====
function importFromJsonFile(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);

      if (!Array.isArray(imported)) throw new Error("JSON is not an array.");
      // basic validation of items
      const cleaned = imported.filter(
        (q) => q && typeof q.text === "string" && typeof q.category === "string" && q.text.trim() && q.category.trim()
      );

      if (!cleaned.length) throw new Error("No valid quotes found in file.");

      quotes.push(...cleaned);
      saveQuotes();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert(`Import failed: ${err.message || "Invalid JSON"}`);
    } finally {
      // reset input so same file can be chosen again if needed
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

// ===== Server Sync Simulation =====
async function fetchFromServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const posts = await res.json();

    // Map posts into {text, category}
    const serverQuotes = posts.map(p => ({
      text: p.title,
      category: p.body.slice(0, 20) // shorten body into pseudo-category
    }));

    // Conflict resolution: server wins
    quotes = [...quotes, ...serverQuotes];
    // Remove duplicates by text
    quotes = quotes.filter((q, idx, arr) =>
      arr.findIndex(other => other.text === q.text) === idx
    );

    saveQuotes();
    populateCategories();
    console.log("Synced with server:", serverQuotes.length, "new quotes");
  } catch (err) {
    console.error("Server sync failed:", err);
  }
}

// Periodic sync every 60 seconds
setInterval(fetchFromServer, 60000);

// ===== Init =====
(function init() {
  quotes = loadQuotes();
  newQuoteBtn.addEventListener("click", showRandomQuote);
  exportBtn.addEventListener("click", exportToJson);
  createAddQuoteForm();
  populateCategories();

  const last = getLastViewedQuote();
  if (last) renderQuote(last);
  else showRandomQuote();

  // initial sync
  fetchFromServer();
})();

// ===== Init =====
// (function init() {
//   quotes = loadQuotes();

//   newQuoteBtn.addEventListener("click", showRandomQuote);
//   exportBtn.addEventListener("click", exportToJson);

//   createAddQuoteForm();
//   populateCategories();
  

//   // Try to show last viewed quote (session-only), else random
//   const last = getLastViewedQuote();
//   if (last) renderQuote(last);
//   else showRandomQuote();
// })();






