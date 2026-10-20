
const photos = [
    {
        title: "Mountain Escape",
        category: "nature",
        description: "Beautiful mountain scenery.",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "Ocean Waves",
        category: "nature",
        description: "Peaceful blue ocean.",
        url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "Modern Architecture",
        category: "architecture",
        description: "Contemporary architectural design.",
        url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "City Streets",
        category: "architecture",
        description: "Explore the beauty of city life.",
        url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "Forest Path",
        category: "nature",
        description: "A relaxing walk through nature.",
        url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "Travel Adventure",
        category: "travel",
        description: "Discover beautiful destinations.",
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "Desert Journey",
        category: "travel",
        description: "Golden landscapes and open skies.",
        url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "Wild Elephant",
        category: "animals",
        description: "An elephant in its natural habitat.",
        url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "Curious Fox",
        category: "animals",
        description: "Wildlife up close.",
        url: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "Snowy Mountains",
        category: "travel",
        description: "A stunning winter destination.",
        url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "Green Valley",
        category: "nature",
        description: "A scenic green valley.",
        url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=80"
    },
    {
        title: "City Landmark",
        category: "architecture",
        description: "Impressive city architecture.",
        url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=80"
    }
];

const gallery = document.getElementById("gallery");
const search = document.getElementById("search");
const stats = document.getElementById("stats");
const empty = document.getElementById("empty");
const lightbox = document.getElementById("lightbox");
const largeImage = document.getElementById("largeImage");
const largeTitle = document.getElementById("largeTitle");
const largeDescription = document.getElementById("largeDescription");

let category = "all";
let currentPhoto = 0;
let lastFocused = null;

const favorites = new Set();

function renderGallery() {
    gallery.querySelectorAll(".card").forEach(card => card.remove());

    const query = search.value.trim().toLowerCase();

    const filtered = photos
        .map((photo, index) => ({ ...photo, index }))
        .filter(photo =>
            (category === "all" || photo.category === category) &&
            (
                photo.title.toLowerCase().includes(query) ||
                photo.description.toLowerCase().includes(query) ||
                photo.category.toLowerCase().includes(query)
            )
        );

    stats.textContent =
        `${filtered.length} image${filtered.length !== 1 ? "s" : ""} found`;

    empty.style.display = filtered.length ? "none" : "block";

    filtered.forEach(photo => {
        const card = document.createElement("article");
        card.className = "card";

        const imageWrap = document.createElement("div");
        imageWrap.className = "image-wrap";

        const img = document.createElement("img");
        img.src = photo.url;
        img.alt = photo.title;
        img.loading = "lazy";
        img.addEventListener("click", () => openViewer(photo.index));

        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = photo.category;

        imageWrap.append(img, badge);

        const info = document.createElement("div");
        info.className = "card-info";

        const title = document.createElement("h3");
        title.textContent = photo.title;

        const description = document.createElement("p");
        description.textContent = photo.description;

        const actions = document.createElement("div");
        actions.className = "card-actions";

        const view = document.createElement("button");
        view.className = "view-btn";
        view.textContent = "View Image";
        view.addEventListener("click", () => openViewer(photo.index));

        const like = document.createElement("button");
        like.className = "like-btn";
        like.classList.toggle("liked", favorites.has(photo.index));
        like.textContent = favorites.has(photo.index)
            ? "♥ Saved"
            : "♡ Favorite";

        like.setAttribute("aria-pressed", favorites.has(photo.index));

        like.addEventListener("click", () => {
            if (favorites.has(photo.index)) {
                favorites.delete(photo.index);
            } else {
                favorites.add(photo.index);
            }

            renderGallery();
        });

        actions.append(view, like);
        info.append(title, description, actions);
        card.append(imageWrap, info);

        gallery.insertBefore(card, empty);
    });
}

function openViewer(index) {
    currentPhoto = index;
    lastFocused = document.activeElement;

    showPhoto();
    lightbox.classList.add("open");
    document.getElementById("close").focus();
    document.body.style.overflow = "hidden";
}

function showPhoto() {
    const photo = photos[currentPhoto];

    largeImage.src = photo.url;
    largeImage.alt = photo.title;
    largeTitle.textContent = photo.title;
    largeDescription.textContent =
        `${photo.description} · ${photo.category}`;
}

function closeViewer() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";

    if (lastFocused) {
        lastFocused.focus();
    }
}

function changePhoto(direction) {
    currentPhoto =
        (currentPhoto + direction + photos.length) % photos.length;

    showPhoto();
}

document.getElementById("close")
    .addEventListener("click", closeViewer);

document.getElementById("prev")
    .addEventListener("click", () => changePhoto(-1));

document.getElementById("next")
    .addEventListener("click", () => changePhoto(1));

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeViewer();
    }
});

document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") closeViewer();
    if (event.key === "ArrowLeft") changePhoto(-1);
    if (event.key === "ArrowRight") changePhoto(1);
});

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        category = button.dataset.category;

        document.querySelectorAll(".filter").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        renderGallery();
    });
});

search.addEventListener("input", renderGallery);

renderGallery();
