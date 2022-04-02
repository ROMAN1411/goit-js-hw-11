import './sass/main.scss';
import ImagesApiService from './js/apiServise'; 
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
Notiflix.Notify.init({
    distance: '27px',
    width: '350px',
});

const searchForm = document.querySelector('.search-form');
const container = document.querySelector('.gallery');
const btn = document.querySelector('[type="submit"]');
const loading = document.querySelector('#loading');

const imagesApiService = new ImagesApiService();

const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionSelector: 'img',
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
});

btn.addEventListener('click', onSearch);

async function onSearch(evt) {
    evt.preventDefault();
    imagesApiService.searchQuery = searchForm.searchQuery.value;
    const getImages = await imagesApiService.fetchImg();

 if (getImages.hits.length === 0) {
        Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
    } else {
        Notiflix.Notify.success(`Hooray! We found ${getImages.totalHits} images`);
        
        clearGallery();
        imagesApiService.resetPage();

        const galleryMarkup = imgCardsTemplates(getImages.hits);
        galleryCardsMarkup(galleryMarkup);

        lightbox.refresh();
    }
}

function clearGallery() {
    container.innerHTML = '';
}

function galleryCardsMarkup(items) {
    container.insertAdjacentHTML('beforeend', items);
    // container.innerHTML = imgCardsTemplates(tempjates);
}


const onEntry = (entries) => {
    entries.forEach(async (entry) => {
        try {
            if (entry.isIntersecting && imagesApiService.searchQuery !== '') {
                imagesApiService.incrementPage();
                const getImages = await imagesApiService.fetchImg();
            
                const galleryMarkup = imgCardsTemplates(getImages.hits);
                galleryCardsMarkup(galleryMarkup);
            
                lightbox.refresh();
                infScroll()
            }
        } catch {
            Notiflix.Notify.warning(`You've reached the end of search results.`);
        }
    });
}

function imgCardsTemplates(tempjates) {
    return tempjates
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `
            <div class="photo-card">     
                <a href="${largeImageURL}">           
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />  
                </a>              
                <div class="info">
                    <p class="info-item">
                    <b>Likes</b>
                    ${likes}
                    </p>
                    <p class="info-item">
                    <b>Views</b>
                    ${views}
                    </p>
                    <p class="info-item">
                    <b>Comments</b>
                    ${comments}
                    </p>
                    <p class="info-item">
                    <b>Downloads</b>
                    ${downloads}
                    </p>
                </div>
            </div>
        `
        }).join('');
}

const options = {
    rootMargin: '150px',
};

const observer = new IntersectionObserver(onEntry, options);
observer.observe(loading);

function infScroll() {
    const { height: cardHeight } = document.querySelector('.photo-card')
        .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });
}

















