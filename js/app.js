// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const listingForm = document.getElementById('listingForm');

// API Configuration (Update with your Function URL)
const API_BASE = 'https://your-function-app.azurewebsites.net/api';

// Search Books Function
async function searchBooks() {
    const query = searchInput.value.trim();
    if (!query) return;

    try {
        const response = await fetch(`${API_BASE}/searchBooks?course=${encodeURIComponent(query)}`);
        const books = await response.json();
        displayResults(books);
    } catch (error) {
        console.error('Search failed:', error);
        resultsDiv.innerHTML = `<p class="error">Failed to load results. Please try again.</p>`;
    }
}

// Display Results
function displayResults(books) {
    if (books.length === 0) {
        resultsDiv.innerHTML = '<p>No textbooks found for this course.</p>';
        return;
    }

    resultsDiv.innerHTML = books.map(book => `
        <div class="book-card">
            <h3>${book.Title}</h3>
            <p><strong>Course:</strong> ${book.Course}</p>
            <p><strong>Price:</strong> $${book.Price.toFixed(2)}</p>
            <p><small>Listed on ${new Date(book.PostDate).toLocaleDateString()}</small></p>
        </div>
    `).join('');
}

// Submit New Listing
if (listingForm) {
    listingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookData = {
            ISBN: document.getElementById('isbn').value,
            Title: document.getElementById('title').value,
            Course: document.getElementById('course').value,
            Price: parseFloat(document.getElementById('price').value),
            SellerEmail: document.getElementById('email').value
        };

        try {
            const response = await fetch(`${API_BASE}/addListing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });

            if (response.ok) {
                alert('Book listed successfully!');
                listingForm.reset();
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error listing book. Please try again.');
        }
    });
}

// Event Listeners
if (searchBtn) {
    searchBtn.addEventListener('click', searchBooks);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBooks();
    });
}