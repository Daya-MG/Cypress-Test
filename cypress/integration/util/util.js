
// placeholder for all locators used in the project
const locator = {
    SHARE_BAR: '.app-btn-width.group-icons',
    SAVE_ARTICLE:'.bookmark-icon.svg-icon',
    SHARE_FB:'.share-link.facebook > .svg-icon > .facebook',
    SHARE_EMAIL:'.share-link.email > .svg-icon',
    SHARE_ARROW: '.share-icon-button > .svg-icon > path',
    SHARE_EXPANDED_CONTAINER:'.dropdown-menu.not-menu-only',
    SHARE_EXPANDED_TWITTER:'.menu-only.twitter',
    SHARE_EXPANDED_LINKEDIN:'.menu-only.linkedin',
    SHARE_EXPANDED_FLIPBOARD:'.menu-only.flipboard',
    SHARE_EXPANDED_COPY_LINK:'.menu-only.copy-link',
    LOG_IN_DIALOG:'.dialog-base-dialog-wrapper',
    CLOSE_POPUP:'.dialog-base-close',
    LATEST_LINK:'.tout-title-link',
};

// utility functions to handle the functionality of the project
export default class util {
    // initialize the locators to the locale
    constructor(element=locator){
        this.element = element;
    };

    // function to launch the latest page. handles the cookie popup
    launchHome(){
        cy.intercept('**//cdn.privacy-mgmt.com/consent/**').as('pageLoad');
        cy.visit('latest');
        cy.wait('@pageLoad', { timeout: 10000 });
        cy.getPopupIFrame().find('[title="I\'m OK with that"]').click();
        cy.title().then(text=>{
            expect(text).to.equal('The Latest - Insider')
        });
    }

    // launch the article page in the insider webpage.handles the cookie popup
    launcharticle(){
        cy.intercept('**//cdn.privacy-mgmt.com/consent/**').as('pageLoad');
        cy.fixture('data.json').then((data) => { 
            cy.visit(data.articleId);
            cy.url().then((url)=>{
                expect(url).to.contain(data.articleId)  
            });
        });
        cy.wait('@pageLoad', { timeout: 30000 });
        cy.getPopupIFrame().find('[title="I\'m OK with that"]').click()
    }

    // function to check all the share bar icons are present
    checkForShareBar(){
        cy.get(this.element.SHARE_BAR).should('exist');
        cy.get(this.element.SAVE_ARTICLE).should('exist');
        cy.get(this.element.SHARE_FB).should('exist');
        cy.get(this.element.SHARE_EMAIL).should('exist');
        cy.get(this.element.SHARE_ARROW).should('exist'); 
    }

    // function to check that the arrow in the share bar extends to show all associated icons
    checkArrowExtension(){
        cy.get(this.element.SHARE_ARROW)
        .scrollIntoView({duration: 1000 })
        .click();
        cy.get(this.element.SHARE_EXPANDED_CONTAINER).should('be.visible');
        cy.get(this.element.SHARE_EXPANDED_TWITTER).should('be.visible');
        cy.get(this.element.SHARE_EXPANDED_LINKEDIN).should('be.visible');
        cy.get(this.element.SHARE_EXPANDED_FLIPBOARD).should('be.visible');
        cy.get(this.element.SHARE_EXPANDED_COPY_LINK).should('be.visible');
    }

    // function to test the bookmark feature in share bar
    saveArticle(){
        try{
            cy.intercept('**/authentication**').as('authLoad');
            
            // If user is not logged in to insider , login dialog will be prompted
            cy.contains('Log in').and('be.visible');
            cy.get(this.element.SAVE_ARTICLE)
            .scrollIntoView({duration: 1000 })
            .click();
            cy.wait('@authLoad', { timeout: 20000 });
            cy.contains('New to Insider?').should('be.visible');
            cy.intercept('**//cdn.privacy-mgmt.com/consent/**').as('pageLoad');
            cy.get(this.element.CLOSE_POPUP)
            .scrollIntoView({duration: 1000 })
            .click();
            cy.wait('@pageLoad', { timeout: 20000 });
            cy.get(this.element.SHARE_BAR).should('exist');
            
        } catch(err){
            // If user is logged in , a popup is displayed about article being saved
            cy.get(this.element.SAVE_ARTICLE)
            .scrollIntoView({duration: 1000 })
            .click();
            cy.contains('Article saved').and('be.visible');
        }
    }

    //// function to test the email feature in share bar
    sendEmail(){
        //TODO: assumption is it will open up a configured email account
        // creating a spy function to spy on window open event
        cy.window().then((win) => {
            cy.stub(win, 'open', () => {
                win.location.href = "https://mail.google.com/";
            }).as("windowOpen");
        });
        cy.get(this.element.SHARE_EMAIL)
        .scrollIntoView({duration: 1000 })
        .click();
        
        cy.get('@windowOpen').should('be.called');
    }


    // function to test the copylink feature in share bar
    copyLink(){
        cy.get(this.element.SHARE_ARROW)
        .scrollIntoView({duration: 1000 })
        .click();
        cy.get(this.element.SHARE_EXPANDED_COPY_LINK).scrollIntoView().click();
        cy.contains('Link Copied').and('be.visible');
    }


    // function to test the social media sharing feature in share bar
    shareSocial(socialMedia){
        let newUrl='';
        let elmToCheck='';
        switch (socialMedia) {
            case 'facebook':{
                newUrl="https://www.facebook.com";                
                break;
            }
            case 'twitter':{
                newUrl="https://twitter.com/";
                elmToCheck=this.element.SHARE_EXPANDED_TWITTER;
                break;
            }
            case 'linkedin':{
                newUrl="https://www.linkedin.com";
                elmToCheck=this.element.SHARE_EXPANDED_LINKEDIN;
                break;
            }           
            case 'flipboard':{
                newUrl="https://www.share.flipboard.com";
                elmToCheck=this.element.SHARE_EXPANDED_FLIPBOARD;
                break; 
            }        
        }

        // creating a spy function to spy on window open event
        cy.window().then((win) => {
            cy.stub(win, 'open', () => {
                win.location.href = newUrl;
            }).as("windowOpen");
        });

        if(socialMedia == "facebook") {
            cy.get(this.element.SHARE_FB)
            .scrollIntoView({duration: 1000 })
            .click();
        } else{
            cy.get(this.element.SHARE_ARROW)
            .scrollIntoView({duration: 1000})
            .click();
            cy.get(this.element.SHARE_EXPANDED_CONTAINER).should('be.visible');
            cy.get(elmToCheck).click();
        }

        cy.get('@windowOpen').should('be.called');
    }

    // function to check the response codes of all the latest articles
    articleHealthCheck(){
        cy.get(this.element.LATEST_LINK).each($el =>{
            cy.wrap($el).should('have.attr', 'href')
            .then((href) => {
                cy.request(href).then((response) => {
                    expect(response.status).to.eq(200);
                });
            })
        });
        
    }
};