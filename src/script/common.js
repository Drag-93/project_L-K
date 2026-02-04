const mainPage = document.querySelector('.body-main')

if(!mainPage){
    header.classList.add("bg_act")
} else {
    header.addEventListener("mouseover", function() {
        header.classList.add("bg_act");
    })
    header.addEventListener("mouseleave", function() {
        const scrollTop = window.scrollY;
        // if(!searchIcon.classList.contains('on') && scrollTop == 0 || getComputedStyle(gnbAllMenu).display !== 'block'){
        if(!searchIcon.classList.contains('on') && scrollTop == 0){
            header.classList.remove("bg_act");
        }
    })
}


window.addEventListener('scroll', function() {
    if(mainPage){
        if (window.scrollY > 0) {
            header.classList.add('bg_act');
            header.style.top = 0
        } else {
            header.classList.remove('bg_act');
        }
    }
    
});