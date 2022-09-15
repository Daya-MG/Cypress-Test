import util from '../util/util';
// Instantiate the utility object to access all it's methods
const utilFunctions=new util();


describe('check all listed articles are accesible', ()=>{
    it('launches the home page', ()=>{
        utilFunctions.launchHome();
    });

    it('iterates over all available articles and check if they are accesible',()=>{
        utilFunctions.articleHealthCheck();
    });
});