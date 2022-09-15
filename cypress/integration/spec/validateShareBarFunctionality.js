
import util from '../util/util';

// Instantiate the utility object to access all it's methods
const utilFunctions=new util();


describe('validate all the share buttons work right', ()=>{
    beforeEach(()=>{
        utilFunctions.launcharticle();
    });

    it('check the bookmarking sharing option',()=>{
        utilFunctions.saveArticle();
    });

    it('check the copy link sharing option',()=>{
        utilFunctions.copyLink();
    });

    it('check the send email sharing option',()=>{
        utilFunctions.sendEmail();
    });

    it('check the facebook sharing option',()=>{
        utilFunctions.shareSocial('facebook');
    });

    it('check the twitter sharing option',()=>{
        utilFunctions.shareSocial('twitter');
    });

    it('check the linkedin sharing option',()=>{
        utilFunctions.shareSocial('linkedin');
    });

    it('check the flipboard sharing option',()=>{
        utilFunctions.shareSocial('flipboard');
    });

});