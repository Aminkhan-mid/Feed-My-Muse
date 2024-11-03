import {booksData} from './data.js'
import {quotesForHeader} from './data.js'


const allRadiosInContainer = document.getElementById("radio-container")
const museBtn = document.getElementById('muse-btn')
const nonFictionCheckbox = document.getElementById('nonfiction-checkbox')
const fictionCheckbox = document.getElementById('fiction-checkbox')
const bookModalContainer = document.getElementById('book-modal-container')
const bookModalInnerContainer = document.getElementById('book-modal-inner-container')
const headerQuotes = document.getElementById("header-quotes")

setInterval(randomQuotes, 3600000)

function randomQuotes(){
    const random = Math.floor(Math.random()*quotesForHeader.length)
    headerQuotes.innerText = quotesForHeader[random]
}
randomQuotes()


allRadiosInContainer.addEventListener('change', addHighlightToRadios)

document.addEventListener('click', closePopupByclickOutside)

museBtn.addEventListener('click', renderBook)

function addHighlightToRadios(e){
    const radiosParentDiv = document.getElementsByClassName('radios')   
    for(let removeHighlight of radiosParentDiv){
        removeHighlight.classList.remove('highlight')
    }
    document.getElementById(e.target.id).parentElement.classList.add('highlight')
}

function closePopupByclickOutside(e){
    if (!bookModalContainer.contains(e.target) && !museBtn.contains(e.target)){
        bookModalContainer.style.display = 'none'
    }
}

function getMatchingBookFromArray(){
    if(document.querySelector('input[type="radio"]:checked')){
        const selectedBook = document.querySelector('input[type="radio"]:checked').value
        const isNonfiction = nonFictionCheckbox.checked

        const matchingGenresArray = booksData.filter(function(book){
            if(isNonfiction){
                return book.bookGenre.includes(selectedBook) && isNonfiction
            } else {
                return book.bookGenre.includes(selectedBook)
            }
        })
        return matchingGenresArray
    }
}

function getSingleObjectFromArray(){
    const booksArray = getMatchingBookFromArray()

    if(booksArray.length === 1){
        return booksArray[0]
    } else{
        let randomBook = Math.floor(Math.random()*booksArray.length)
        return booksArray[randomBook]
    }
}

function renderBook(){
    const deployFinalBook = getSingleObjectFromArray()
    const theBook = 
        `
        <img
        class="bookImg"
        src="${deployFinalBook.image}"
        alt="${deployFinalBook.alt}">
        `
    bookModalContainer.style.display = 'flex'
    bookModalInnerContainer.innerHTML = theBook
}

function pushBooksDataInArray(books){
    const booksGenresArray = []
    for(let book of books){
        for(let genre of book.bookGenre){
            if(!booksGenresArray.includes(genre)){
                booksGenresArray.push(genre)
            }
        }
    }
    return booksGenresArray
}


function renderGenreRadiosInWeb(books){

  const isNonFiction = nonFictionCheckbox.checked
  const isFiction = fictionCheckbox.checked
  
  const filteredBooksGenre = books.filter(function(book){
    if(isNonFiction && !isFiction){
        return book.isNonFiction
    } else if(isFiction && !isNonFiction){
        return !book.isNonFiction
    }
    return true
  })
    const allRadios = pushBooksDataInArray(filteredBooksGenre)
    let genreList = ""
    for(let genres of allRadios){
        genreList += 
        `
        <div class="radios">
        <label for="${genres}">${genres}</label>
        <input
        type="radio"
        id="${genres}"
        value="${genres}"
        name="choice-radios">
        </div>
        `
    }
    allRadiosInContainer.innerHTML = genreList
}
renderGenreRadiosInWeb(booksData)

nonFictionCheckbox.addEventListener("change", ()=> {
    localStorage.setItem("NonFiction", nonFictionCheckbox.checked)
    renderGenreRadiosInWeb(booksData)
})
fictionCheckbox.addEventListener("change", ()=> {
    localStorage.setItem("Fiction", fictionCheckbox.checked)
    renderGenreRadiosInWeb(booksData)
})


document.addEventListener('DOMContentLoaded', ()=> {

    const NonFictionStorage = localStorage.getItem("NonFiction") === 'true'
    const FictionStorage = localStorage.getItem("Fiction") === 'true'

    nonFictionCheckbox.checked = NonFictionStorage
    fictionCheckbox.checked = FictionStorage
    renderGenreRadiosInWeb(booksData)
})