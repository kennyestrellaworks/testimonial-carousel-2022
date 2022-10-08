const DOMStrings = {
    testimonial: document.querySelector('.testimonial'),
    testimonialSlide: document.querySelector('.testimonial__slide'),
    testimonialSlideWrap: document.querySelector('.testimonial__slide-wrap'),    
    testimonialItem: '',    
    profileCardLongText: '',
    testimonialSlideLeftButton: document.querySelector('.testimonial__slide-left-button'),
    testimonialSlideRightButton: document.querySelector('.testimonial__slide-right-button'),
    circleIconButton: document.querySelector('.circle-icon-button'),
    profileCardReadMore: '',
    testimonialPopupWrap: document.querySelector('.testimonial__popup-wrap'),
    contentOverlay: document.querySelector('.content-overlay'),
    testimonialPopupCloseButton: ''
}

const SliderSetup = {
    itemWidth: 0, // rem
    divider: 3,
    slideDivider: this.divider,
    sliderLength: 0,
    rightBaseNumber: 0,
    rightRemainingNumber: 0,
    leftBaseNumber: 0,
    leftRemainingNumber: 0,
    activeSlidNumber: 0,
    modulu: 0,
    quotient: 0,
    slideWidth: 1200, // px
    translateXValue: 0,
    innerWidthResize: 0,
    profileLongTextLimit: 100,
    personSocialLinks: [],
    breakPoint: { // Custom breakpoints for media queries.
        breakPointItems: [
            {   divider: 3, // Default used.
                viewportPercentage: [100, 90, 70, 48], // Percentage that'll transform a given width into a value.
                itemsToDisplay: [3, 3, 2, 1] // Testimonial items to be displayed.
            },
            {   divider: 4, 
                viewportPercentage: [100, 90, 70, 48],
                itemsToDisplay: [4, 3, 2, 1] 
            },
            {   divider: 5, 
                viewportPercentage: [100, 90, 80, 70, 48],
                itemsToDisplay: [5, 4, 3, 2, 1]
            }
        ],
        mediaQueryNumber: []
    }    
}

class Events {
    static testimonialPopupCloseButton() {
        DOMStrings.testimonialPopupCloseButton.addEventListener('click', function() {
            DOMStrings.testimonialPopupWrap.classList.add('hidden')
            DOMStrings.contentOverlay.classList.add('hidden')
        })
    }

    static readMoreButton() {
        // console.log('boooo)
        for (let i = 0; i < DOMStrings.profileCardReadMore.length; i++) {
            DOMStrings.profileCardReadMore[i].addEventListener('click', function() {
                console.log(DOMStrings.testimonialItem[i].dataset)
                UI.displayTestimonialPopup(i)                
                DOMStrings.contentOverlay.classList.remove('hidden')           
                DOMStrings.testimonialPopupWrap.classList.remove('hidden')           
            })
        }        
    }

    static slideControls() {        
        // Sliding left.
        DOMStrings.testimonialSlideLeftButton.addEventListener('click', function() {
            if (SliderSetup.leftRemainingNumber != 0) {
                if (SliderSetup.leftRemainingNumber >= SliderSetup.slideDivider) {
                    SliderSetup.leftBaseNumber -= SliderSetup.slideDivider
                    SliderSetup.rightBaseNumber = SliderSetup.leftBaseNumber + (SliderSetup.slideDivider - 1)
                    SliderSetup.rightRemainingNumber = SliderSetup.sliderLength - SliderSetup.rightBaseNumber
                    SliderSetup.leftRemainingNumber = SliderSetup.leftBaseNumber - 1
                } else {
                    SliderSetup.leftBaseNumber -= SliderSetup.modulu
                    SliderSetup.rightBaseNumber -= SliderSetup.modulu
                    SliderSetup.rightRemainingNumber = SliderSetup.sliderLength - SliderSetup.rightBaseNumber
                    SliderSetup.leftRemainingNumber = SliderSetup.leftBaseNumber - 1
                }
                SliderSetup.activeSlidNumber = SliderSetup.rightBaseNumber
                UI.performSlide(SliderSetup.leftBaseNumber - 1)
                UI.disableSlideControls(SliderSetup.rightRemainingNumber, DOMStrings.testimonialSlideRightButton)
                UI.disableSlideControls(SliderSetup.leftRemainingNumber, DOMStrings.testimonialSlideLeftButton)
                Process.traceValues('left slide ====')
            }
        })
        
        // Sliding right.
        DOMStrings.testimonialSlideRightButton.addEventListener('click', function() {
            if (SliderSetup.rightBaseNumber != 0) {
                if (SliderSetup.rightRemainingNumber >= SliderSetup.slideDivider) {
                    SliderSetup.rightBaseNumber += SliderSetup.slideDivider
                    SliderSetup.leftBaseNumber = SliderSetup.rightBaseNumber - (SliderSetup.slideDivider - 1)
                    SliderSetup.leftRemainingNumber = SliderSetup.leftBaseNumber - 1
                    SliderSetup.rightRemainingNumber = SliderSetup.sliderLength - SliderSetup.rightBaseNumber
                } else {
                    SliderSetup.rightBaseNumber += SliderSetup.modulu
                    SliderSetup.leftBaseNumber = SliderSetup.rightBaseNumber - (SliderSetup.slideDivider - 1)
                    SliderSetup.leftRemainingNumber = SliderSetup.leftBaseNumber - 1
                    SliderSetup.rightRemainingNumber = SliderSetup.sliderLength - SliderSetup.rightBaseNumber                    
                }
                SliderSetup.activeSlidNumber = SliderSetup.rightBaseNumber
                UI.performSlide(SliderSetup.rightBaseNumber - SliderSetup.slideDivider)
                UI.disableSlideControls(SliderSetup.rightRemainingNumber, DOMStrings.testimonialSlideRightButton)
                UI.disableSlideControls(SliderSetup.leftRemainingNumber, DOMStrings.testimonialSlideLeftButton)
                Process.traceValues('right slide ====')
            }
        })        
    }

    // Browser window resize.
    static windowResize() {
        window.addEventListener('resize', function() {
            Process.doTestimonialWidth()
            Process.createTestimonialItemWidth() // Responsible for the width changes of the 'testimonial items'.
            Process.doTestimonialSlideWidth()            
            if (SliderSetup.activeSlidNumber != 0) {                
                if (SliderSetup.slideDivider <= SliderSetup.divider) {
                    if (SliderSetup.activeSlidNumber <= SliderSetup.divider) {
                        SliderSetup.activeSlidNumber = SliderSetup.divider
                        SliderSetup.rightBaseNumber = SliderSetup.activeSlidNumber
                        SliderSetup.rightRemainingNumber = SliderSetup.sliderLength - SliderSetup.rightBaseNumber
                        SliderSetup.leftBaseNumber = SliderSetup.rightBaseNumber - (SliderSetup.divider - 1)
                        SliderSetup.leftRemainingNumber = SliderSetup.leftBaseNumber - 1
                    }
                }
                SliderSetup.translateXValue = (SliderSetup.itemWidth * (SliderSetup.activeSlidNumber - SliderSetup.slideDivider)) * (-1)
                DOMStrings.testimonialSlideWrap.style.transform = `translateX(${SliderSetup.translateXValue}rem)`
                SliderSetup.rightBaseNumber = SliderSetup.activeSlidNumber
                SliderSetup.leftBaseNumber = SliderSetup.rightBaseNumber - (SliderSetup.slideDivider - 1)
            }            
            Process.traceValues('window resize ====')
        })
    }
}

class UI {
    static displayTestimonialPopup(i) {
        let testimonialPopupWrap = `
        <div class="testimonial__popup-content">
            <div class="testimonial__popup-close">
                <button class="testimonial__popup-close-button">                                           
                    <svg class="button__icon-button-1" xmlns="http://www.w3.org/2000/svg" width="17.358" height="17.358" viewBox="0 0 17.358 17.358">
                        <rect id="Rectangle_1771" data-name="Rectangle 1771" width="2.654" height="21.894" transform="translate(15.481 0) rotate(45)"/>
                        <rect id="Rectangle_1772" data-name="Rectangle 1772" width="2.654" height="21.894" transform="translate(0 1.877) rotate(-45)"/>
                    </svg>
                </button>
            </div>
            <div class="testimonial__popup-profile-card">
                <div class="testimonial__popup-profile">                                                
                    <img src="images/${data.testimonial_items[i].profile_info.id}-img.jpg" alt="${data.testimonial_items[i].profile_info.first_name} ${data.testimonial_items[i].profile_info.last_name}" class="testimonial__popup-profile-picture">
                    <div class="profile-card__rating">
                        <svg class="profile-card__rating-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
                            <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z" transform="translate(-2 -2)"></path>
                        </svg>
                        <svg class="profile-card__rating-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
                            <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z" transform="translate(-2 -2)"></path>
                        </svg>
                        <svg class="profile-card__rating-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
                            <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z" transform="translate(-2 -2)"></path>
                        </svg>
                        <svg class="profile-card__rating-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
                            <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z" transform="translate(-2 -2)"></path>
                        </svg>
                        <svg class="profile-card__rating-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
                            <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z" transform="translate(-2 -2)"></path>
                        </svg>
                    </div>
                    <h1 class="heading-style-2 heading-style-2__primary profile-card__person-name">${data.testimonial_items[i].profile_info.first_name} ${data.testimonial_items[i].profile_info.last_name}</h1>
                    <h2 class="heading-style-2 heading-style-2__secondary profile-card__person-position">${data.testimonial_items[i].profile_info.job_position}</h2>
                    <div class="profile-card__profile-social" data-id="${data.testimonial_items[i].profile_info.id}"></div>
                    <p class="testimonial__popup-long-text">${data.testimonial_items[i].testimonial_comment}</p>
                </div>
            </div>                                    
        </div>
        `
        DOMStrings.testimonialPopupWrap.innerHTML = testimonialPopupWrap
        DOMStrings.testimonialPopupCloseButton = document.querySelector('.testimonial__popup-close-button')
        Events.testimonialPopupCloseButton()
    }

    // Disabling slide controls, either 'DOMStrings.testimonialSlideRightButton' or 'DOMStrings.testimonialSlideLeftButton'.
    static disableSlideControls(remainingNumber, DOMString) {
        if (remainingNumber == 0) {
            DOMString.classList.remove('circle-icon-button')
            DOMString.classList.add('circle-icon-button-disabled')
            DOMString.disabled = true
        } else {
            DOMString.classList.add('circle-icon-button')
            DOMString.classList.remove('circle-icon-button-disabled')
            DOMString.disabled = false
        }
    }

    // We are adding 'translateX' inline CSS to 'DOMStrings.testimonialSlideWrap'.
    static performSlide(slideValue) {
        SliderSetup.translateXValue = (SliderSetup.itemWidth * (slideValue)) * (-1)
        console.log(`SliderSetup.translateXValue = (SliderSetup.itemWidth * slideValue) * (-1)`)
        console.log(`SliderSetup.translateXValue = (${SliderSetup.itemWidth} * ${slideValue}) * (-1)`)
        DOMStrings.testimonialSlideWrap.style.transform = `translateX(${SliderSetup.translateXValue}rem)`
    }

    // Updating or adjusting the width of each HTML elements with the class represented by 'DOMStrings.testimonialItem'.
    static adjustTestimonialItemWidth(width, divider) {
        SliderSetup.itemWidth = (width / divider) / 10
        // console.log('SliderSetup.itemWidth = (width / divider) / 10')
        // console.log(`SliderSetup.itemWidth = (${width} / ${divider}) / 10`)
        // console.log('SliderSetup.itemWidth = ', SliderSetup.itemWidth)
        for (let i = 0; i < DOMStrings.testimonialItem.length; i++) {
            DOMStrings.testimonialItem[i].style.width = `${SliderSetup.itemWidth}rem`
        }
    }

    // Constructing 'social links' of each item based from the 'data.testimonial_items.social_links' of 'data.js'.
    static displayPersonSocial() {
        let socialLinkValues = []
        let socialLinkItem = ''
        // We loop through 'data.testimonial_items' so that we can push all values of each 'social_links' property. In every iteration [i], we push
        // the values to the 'socialLinkValues' array.
        for (let i = 0; i < data.testimonial_items.length; i++) {
            socialLinkValues = [
                data.testimonial_items[i].social_links.linkedin,
                data.testimonial_items[i].social_links.facebook,
                data.testimonial_items[i].social_links.twitter,
                data.testimonial_items[i].social_links.github,
                data.testimonial_items[i].social_links.dribbble,
                data.testimonial_items[i].social_links.behance,
                data.testimonial_items[i].social_links.youtube,
                data.testimonial_items[i].social_links.instagram,
            ]
            // Then, we push the elements of 'socialLinkValues' array to 'SliderSetup.personSocialLinks'.
            SliderSetup.personSocialLinks.push(socialLinkValues)
            // Then, we loop through 'SliderSetup.personSocialLinks' but with the use of the current iteration [i] of the main for loop, so that we can check which 
            // element is not equal to ''. The iteration of this for loop here is represented by [j], it's how the elements within the current 'SliderSetup.personSocialLinks' are
            // iterated. While we use [i] to represent which is the current element that is iterated. In a much simplier explanation, in this project, by default, there will be
            // a total of 13 elements within 'SliderSetup.personSocialLinks' and looping through each 13, is represented by [i]. Then, to loop the elements of each 13 elements, we 
            // use [j] to represent it. Each 13 elements will have its own elements of 8.
            for (let j = 0; j < SliderSetup.personSocialLinks[i].length; j++) {
                // Checking if we find an element not equal to ''.
                if (SliderSetup.personSocialLinks[i][j] != '') {
                    // If we find one, we construct a template literal, 'socialLinkItem' and we concatenate the literal each time the condition is true.
                    socialLinkItem += `
                    <a href="${SliderSetup.personSocialLinks[i][j]}" target="_blank" class="profile-card__profile-social-links">
                        <img class="profile-card__profile-social-links-image" src="images/${data.social_platforms[j]}-icon.svg" alt="${data.social_platforms[j]}">
                    </a>
                    `
                }
                DOMStrings.profileCardProfileSocial[i].innerHTML = socialLinkItem                
            }
            socialLinkItem = ''
        }
        // This console.log shows the explanation of the for loop above.
        // console.log('SliderSetup.personSocialLinks', SliderSetup.personSocialLinks)
    }

    // Some testimonial paragraph are long, so we set a limit of 100 as default, 'SliderSetup.profileLongTextLimit'.
    static trimProfileLongText() {
        let longTextEditedArray = []
        let stringTrim = ''
        // Looping through each testimonial items, 'DOMStrings.profileCardLongText' so that we can get it's 'textContent'. In the loop, the current item will be represented by [i],
        // then we check if each item with its 'textContent' has the length that is LESS THAN or EQUAL to 'SliderSetup.profileLongTextLimit'.
        for (let i = 0; i < DOMStrings.profileCardLongText.length; i++) {
            if (DOMStrings.profileCardLongText[i].textContent.length <= SliderSetup.profileLongTextLimit) {
                // If the current item's [i] 'textContent' is LESS THAN or EQUAL to 'SliderSetup.profileLongTextLimit', then it means nothing changes, we just push it to the
                // 'longTextEditedArray' as it is.
                longTextEditedArray.push(DOMStrings.profileCardLongText[i].textContent)
            } else {
                // If the current item's [i] 'textContent' is GREATER THAN 'SliderSetup.profileLongTextLimit', then we need to perform a 'for loop' that represents the number of 'strings' we
                // allow to be displayed as testimonial paragraph. We loop through 'SliderSetup.profileLongTextLimit' then we have 'stringTrim variable' to hold the 'strings' of the current 
                // paragraph [i] which is 'DOMStrings.profileCardLongText.textContent'. Then [j] represents, then loop item of 'SliderSetup.profileLongTextLimit'.
                for (let j = 0; j < SliderSetup.profileLongTextLimit; j++) {
                    stringTrim += DOMStrings.profileCardLongText[i].textContent[j]
                }
                // We also push the result 'longTextEditedArray'.
                longTextEditedArray.push(stringTrim + ' ...')
                stringTrim = ''
                // We also show the 'read more button'.
                DOMStrings.profileCardReadMore[i].classList.remove('hidden')
            }
            DOMStrings.profileCardLongText[i].innerHTML = longTextEditedArray[i]            
        }
    }
    
    // Displaying the data from 'data.testimonial_items' from 'data.js'. For this project, by default we have 13 items.
    static displayPersons() {
        let testimonialItems = ''
        // Looping through 'data.testimonial_items', a total of 13 iterations [i] will happen.
        for (let i = 0; i < data.testimonial_items.length; i++) {
            // We construct a template literal, 'testimonialItems' and we concatenate each literal created in every iteration [i].
            testimonialItems += `
            <div class="testimonial__item">
                <div class="testimonial__item-wrap">
                    <div class="profile-card">
                        <div class="profile-card__read-more hidden">
                            <button class="profile-card__read-more-button button__primary">read more</button>
                        </div>                        
                        <p class="profile-card__long-text">${data.testimonial_items[i].testimonial_comment}</p>
                        <div class="profile-card__rating">
                            <svg class="profile-card__rating-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
                                <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z" transform="translate(-2 -2)"></path>
                            </svg>
                            <svg class="profile-card__rating-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
                                <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z" transform="translate(-2 -2)"></path>
                            </svg>
                            <svg class="profile-card__rating-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
                                <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z" transform="translate(-2 -2)"></path>
                            </svg>
                            <svg class="profile-card__rating-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
                                <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z" transform="translate(-2 -2)"></path>
                            </svg>
                            <svg class="profile-card__rating-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19">
                                <path d="M12,17.27,18.18,21l-1.64-7.03L22,9.24l-7.19-.61L12,2,9.19,8.63,2,9.24l5.46,4.73L5.82,21Z" transform="translate(-2 -2)"></path>
                            </svg>
                        </div>
                        <div class="profile-card__profile">                                                
                            <img src="images/${data.testimonial_items[i].profile_info.id}-img.jpg" alt="${data.testimonial_items[i].profile_info.first_name} ${data.testimonial_items[i].profile_info.last_name}" class="profile-card__profile-picture">
                            <h1 class="heading-style-2 heading-style-2__primary profile-card__person-name">${data.testimonial_items[i].profile_info.first_name} ${data.testimonial_items[i].profile_info.last_name}</h1>
                            <h2 class="heading-style-2 heading-style-2__secondary profile-card__person-position">${data.testimonial_items[i].profile_info.job_position}</h2>
                            <div class="profile-card__profile-social" data-id="${data.testimonial_items[i].profile_info.id}"></div>
                        </div>
                    </div>
                </div>
            </div>
            `
            DOMStrings.testimonialSlideWrap.innerHTML = testimonialItems
            DOMStrings.testimonialItem = document.querySelectorAll('.testimonial__item')    
            DOMStrings.profileCardProfileSocial = document.querySelectorAll('.profile-card__profile-social')    
            DOMStrings.profileCardLongText = document.querySelectorAll('.profile-card__long-text')
            DOMStrings.profileCardReadMore = document.querySelectorAll('.profile-card__read-more')
        }
    }
}

class Process {
    static traceValues(tracer) {
        console.log(tracer)
        console.log('SliderSetup.itemWidth', SliderSetup.itemWidth)
        console.log('SliderSetup.sliderLength', SliderSetup.sliderLength)
        console.log('SliderSetup.rightBaseNumber', SliderSetup.rightBaseNumber)
        console.log('SliderSetup.rightRemainingNumber', SliderSetup.rightRemainingNumber)
        console.log('SliderSetup.leftBaseNumber', SliderSetup.leftBaseNumber)
        console.log('SliderSetup.leftRemainingNumber', SliderSetup.leftRemainingNumber)
        console.log('SliderSetup.modulu', SliderSetup.modulu)
        console.log('SliderSetup.quotient', SliderSetup.quotient)
        console.log('SliderSetup.translateXValue', SliderSetup.translateXValue)
        console.log('SliderSetup.slideDivider', SliderSetup.slideDivider)
        console.log('SliderSetup.divider', SliderSetup.divider)
        console.log('SliderSetup.activeSlidNumber', SliderSetup.activeSlidNumber)
        console.log('*************')
    }

    static performQuotientAndModulu() {
        SliderSetup.modulu = SliderSetup.sliderLength % SliderSetup.divider
        SliderSetup.quotient = parseInt(SliderSetup.sliderLength / SliderSetup.divider)        
    }
    static prepareSlide() {
        SliderSetup.sliderLength = data.testimonial_items.length     
        SliderSetup.rightBaseNumber = SliderSetup.slideDivider
        SliderSetup.rightRemainingNumber = SliderSetup.sliderLength - SliderSetup.rightBaseNumber
        SliderSetup.leftBaseNumber = SliderSetup.rightBaseNumber - (SliderSetup.rightBaseNumber - 1)
        SliderSetup.leftRemainingNumber = SliderSetup.leftBaseNumber - 1
        this.performQuotientAndModulu()        
    }
    static createTestimonialItemWidth() {
        if (SliderSetup.innerWidthResize >= SliderSetup.slideWidth) {
            UI.adjustTestimonialItemWidth(SliderSetup.slideWidth, SliderSetup.divider)
            SliderSetup.slideDivider = SliderSetup.divider // This is crucial here.
        } else {
            // This block executes when 'SliderSetup.innerWidthResize' which represents the browser's width is less than the value of 'SliderSetup.slideWidth'
            // that we set which is 1200.

            // Supposedly, 'SliderSetup.breakPoint.mediaQueryNumber' will have a set of elements or items. For example, if 'SliderSetup.innerWidthResize' is 900, the
            // elements would be, '[900, 810, 630, 432]' which represents the values we will use as break points. We are using 'counter', 'counterTwo', and 'limit' to use those elements.
            let counter = 0
            let counterTwo = 0
            let limit = 0
            let breakPointItems = SliderSetup.breakPoint.breakPointItems
            let mediaQueryNumber = SliderSetup.breakPoint.mediaQueryNumber

            while (counter <= breakPointItems.length) {
                if (counterTwo < breakPointItems.length) {
                    // Using 'counter' and 'counterTwo', we are getting values within 'mediaQueryNumber' elements.
                    limit = mediaQueryNumber[counter + 1]
                } else { limit = 0 }
                
                // The console.log below shows if the current browser's width falls in to the conditions we set.
                // console.log(`${SliderSetup.innerWidthResize} <= ${mediaQueryNumber[counter]} && ${SliderSetup.innerWidthResize} > ${limit}`)
                if (SliderSetup.innerWidthResize <= mediaQueryNumber[counter] && SliderSetup.innerWidthResize > limit) {
                    // If the brower's width falls in to the condition, we are looping through 'breakPointItems' where it has 3 elements, a length of 3.           
                    for (let i = 0; i < breakPointItems.length; i++) {
                        if (SliderSetup.divider == breakPointItems[i].divider) {
                            SliderSetup.slideDivider = breakPointItems[i].itemsToDisplay[counter]
                            UI.adjustTestimonialItemWidth(SliderSetup.innerWidthResize, SliderSetup.slideDivider)  
                        }
                    }
                }
                counter++
                counterTwo = counter
            }
        }
    }
    static setBreakpoint() {
        // Assigning 'breakPoint.breakPointItems object properties' from 'SliderSetup object'.
        let breakPointItems = SliderSetup.breakPoint.breakPointItems
        // Assigning 'breakPoint.mediaQueryNumber object property' from 'SliderSetup object'.
        let mediaQueryNumber = SliderSetup.breakPoint.mediaQueryNumber
        // Represents the value after it was divided by 100, meaning we are getting the exact value from the percentage.
        // Example: (90 * 800) / 100.
        let numberAfterPercentage = 0
        // Represents the current value we get from the 'breakPoint.breakPointItems.viewportPercentage object properties'.
        let viewportPercentage = 0

        // We loop through 'breakPointItem' so that we can check in each iteration [i] if 'SliderSetup.divider' has an equal value.
        // The iteration is represented by 'breakPointItem[i].divider'. As of this code update, the options we can see are:
        // divider: 3, divider: 4, divider: 5
        for (let i = 0; i < breakPointItems.length; i++) {
            // If there's a match, loop through the current iteration [i] but this time, using the 'viewportPercentage object property'.
            // For example, if the we match with 'divider: 3', then 'viewportPercentage' has values of '[100, 90, 70, 48]' which represents
            // percentages. That's where we use [j] to loop through each values.
            if (SliderSetup.divider == breakPointItems[i].divider) {
                for (let j = 0; j < breakPointItems[i].viewportPercentage.length; j++) {
                    // Shortening 'breakPointItems[i].viewportPercentage[j]'.
                    viewportPercentage = breakPointItems[i].viewportPercentage[j]
                    // For example, the value of 'SliderSetup.slideWidth is 800', then we are getting it's equivalent value after the percentages.
                    // One computation would be (90 * 800) / 100, the result is 720.
                    numberAfterPercentage = (viewportPercentage * SliderSetup.slideWidth) / 100
                    // We push the result to the empty array, 'mediaQueryNumber'.
                    mediaQueryNumber.push(numberAfterPercentage)
                }
            }
        }
        // console.log('mediaQueryNumber', mediaQueryNumber)
    }
    static doTestimonialSlideWidth() {
        DOMStrings.testimonialSlide.style.width = `${SliderSetup.itemWidth * data.testimonial_items.length}rem`
    }
    // The process to control the inline width of 'DOMStrings.testimonial' using the 'window.innerWidth'.    
    static doTestimonialWidth() {
        // The 'SliderSetup.innerWidthResize' will have the value of the 'window.innerWidth'. then we check if it is greater than or equal to the value of
        // 'SliderSetup.slideWidth'. If TRUE, 'DOMStrings.testimonial' will have an inline width that is equal to the set value of 'SliderSetup.slideWidth'.
        // If FALSE, 'DOMStrings.testimonial' will have an inline width equal to the value of 'SliderSetup.innerWidthResize', meaning the width of the browser.
        this.doBrowserWidth()
        // console.log('browserWidth', SliderSetup.innerWidthResize)
        if (SliderSetup.innerWidthResize >= SliderSetup.slideWidth) {
            DOMStrings.testimonial.style.width = `${SliderSetup.slideWidth / 10}rem`
        } else { 
            DOMStrings.testimonial.style.width = `${SliderSetup.innerWidthResize / 10}rem`
        }
    }
    // The process of getting the browser's width.
    static doBrowserWidth() {
        SliderSetup.innerWidthResize = window.innerWidth
    }
}

document.addEventListener('DOMContentLoaded', function() {
    UI.displayPersons()
    UI.trimProfileLongText()
    // We have to control the inline width of the 'DOMStrings.testimonial' using the 'window.innerWidth'.
    Process.setBreakpoint()  // Creating static media query breakpoints.
    
    Process.doTestimonialWidth()    
    Process.createTestimonialItemWidth() // Responsible for the width changes of the 'testimonial items'.
    Process.doTestimonialSlideWidth()
    UI.displayPersonSocial()
    Process.prepareSlide() // Some default values needed for the slide logic.
    Process.traceValues('page load ====')
    Events.windowResize()
    Events.slideControls()
    Events.readMoreButton() 
    UI.disableSlideControls(SliderSetup.leftRemainingNumber, DOMStrings.testimonialSlideLeftButton)
    // Process.traceValues()
})