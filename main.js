let currentPageNumber = 1;
let currentPageSize = 10;
let currentSort = '-published_at';

function addDataToCards(data) {
    const listPostSection = document.querySelector('.list-post');

    // Menghapus konten yang ada di dalam list-post sebelumnya (jika ada)
    listPostSection.innerHTML = '';

    // Loop melalui setiap ide dari data yang diterima
    data.forEach(idea => {
        const card = document.createElement('div');
        card.classList.add('card', 'w-96', 'bg-white', 'shadow-xl');

        const figure = document.createElement('figure');
        const img = document.createElement('img');
        img.src = "img/post_img.jpg"; // Menggunakan small_image dari data JSON
        img.alt = idea.slug;
        figure.appendChild(img);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const date = document.createElement('p');
        date.textContent = new Date(idea.published_at).toLocaleDateString(); // Menggunakan published_at dari data JSON
        cardBody.appendChild(date);

        const title = document.createElement('h2');
        title.classList.add('card-title', 'text-black');
        title.textContent = idea.title; // Menggunakan title dari data JSON
        cardBody.appendChild(title);

        card.appendChild(figure);
        card.appendChild(cardBody);

        // Menambahkan elemen card ke dalam list-post section
        listPostSection.appendChild(card);
    });
}

function fetchData() {
    const url = new URL('http://localhost:3000/ideas');
    url.searchParams.append('page', currentPageNumber);
    url.searchParams.append('size', currentPageSize);
    url.searchParams.append('sort', currentSort);

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        addDataToCards(data.data); // Menambahkan data ke dalam elemen card
        updatePagination(data.meta.pagination);
    })
    .catch(error => console.error('Error:', error));
}

function updatePagination(pagination) {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageNumberSpan = document.getElementById('page-number');

    prevButton.disabled = currentPageNumber <= 1;
    nextButton.disabled = currentPageNumber >= pagination.total_pages;
    pageNumberSpan.textContent = `Page ${currentPageNumber} of ${pagination.total_pages}`;
}

document.addEventListener('DOMContentLoaded', function() {
    fetchData();

    document.getElementById('sort').addEventListener('change', function() {
        currentSort = this.value;
        currentPageNumber = 1; // Reset to first page
        fetchData();
    });

    document.getElementById('page-size').addEventListener('change', function() {
        currentPageSize = this.value;
        currentPageNumber = 1; // Reset to first page
        fetchData();
    });

    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPageNumber > 1) {
            currentPageNumber--;
            fetchData();
        }
    });

    document.getElementById('next-page').addEventListener('click', function() {
        currentPageNumber++;
        fetchData();
    });
});
